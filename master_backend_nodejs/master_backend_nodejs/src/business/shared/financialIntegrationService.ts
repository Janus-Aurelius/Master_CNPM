// src/business/shared/financialIntegrationService.ts
import { financialService } from '../../services/financialService/financialService';
import { SubjectBusiness } from '../academicBusiness/subject.business';
import { DatabaseService } from '../../services/database/databaseService';
import { ITuitionCalculation, TuitionCourseItem } from '../../models/student_related/studentPaymentInterface';
import { calculateTuition } from '../financialBusiness/financialManager';

export interface PaymentEligibility {
    canRegister: boolean;
    paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE';
    outstandingAmount: number;
    gracePeriodExpired: boolean;
    errors: string[];
    warnings: string[];
}

export class FinancialIntegrationService {

    /**
     * Calculate tuition for a specific course registration
     */
    static async calculateCourseTuition(
        studentId: string,
        courseId: string,
        semester: string
    ): Promise<ITuitionCalculation> {
        try {
            // Get course/subject information
            const subjects = await SubjectBusiness.getAllSubjects();
            const subject = subjects.find(s => s.subjectId === courseId);

            if (!subject) {
                throw new Error(`Subject ${courseId} not found`);
            }

            // Create course item
            const courseItem: TuitionCourseItem = {
                courseId,
                courseName: subject.subjectName,
                credits: subject.totalHours || 3,
                amount: 0, // Will be calculated below
                semester,
                academicYear: '2023-2024' // Assuming a default academic year
            };

            // Calculate tuition
            return await calculateTuition(studentId, semester, [courseItem]);

        } catch (error) {
            console.error('Error calculating course tuition:', error);
            throw error;
        }
    }

    /**
     * Create tuition record for course registration
     */
    static async createTuitionRecord(
        studentId: string,
        courseId: string,
        semester: string
    ): Promise<{ success: boolean; tuitionRecordId?: string; error?: string }> {
        try {
            // Calculate tuition
            const tuitionCalculation = await this.calculateCourseTuition(studentId, courseId, semester);
            
            if (tuitionCalculation.totalAmount === 0) {
                return {
                    success: false,
                    error: 'Unable to calculate tuition amount'
                };
            }

            // Create tuition record via financial service
            const tuitionRecord = await financialService.createTuitionRecord({
                studentId,
                courseId,
                semester,
                amount: tuitionCalculation.totalAmount,
                breakdown: tuitionCalculation.adjustments.map((adj: { description: string; amount: number }) => ({
                    description: adj.description,
                    amount: adj.amount
                })),
                dueDate: new Date(tuitionCalculation.dueDate),
                status: 'PENDING'
            });

            return {
                success: true,
                tuitionRecordId: tuitionRecord.id
            };

        } catch (error) {
            console.error('Error creating tuition record:', error);
            return {
                success: false,
                error: 'Failed to create tuition record'
            };
        }
    }

    /**
     * Check payment eligibility for course registration
     */
    static async checkPaymentEligibility(
        studentId: string,
        semester: string
    ): Promise<PaymentEligibility> {
        const errors: string[] = [];
        const warnings: string[] = [];

        try {
            // Get student payment information
            const paymentInfo = await financialService.getStudentPayment(studentId);
            
            if (!paymentInfo) {
                return {
                    canRegister: true, // Allow registration for new students
                    paymentStatus: 'UNPAID',
                    outstandingAmount: 0,
                    gracePeriodExpired: false,
                    errors: [],
                    warnings: ['No payment record found - first-time registration']
                };
            }

            // Determine payment status
            let paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID' | 'OVERDUE' = 'UNPAID';
            const outstandingAmount = paymentInfo.totalAmount - paymentInfo.paidAmount;

            if (paymentInfo.paidAmount >= paymentInfo.totalAmount) {
                paymentStatus = 'PAID';
            } else if (paymentInfo.paidAmount > 0) {
                paymentStatus = 'PARTIAL';
            } else {
                paymentStatus = 'UNPAID';
            }

            // Check for overdue payments
            const gracePeriodExpired = await this.checkGracePeriod(studentId, semester);
            if (gracePeriodExpired && outstandingAmount > 0) {
                paymentStatus = 'OVERDUE';
            }

            // Business rules for registration eligibility
            let canRegister = true;
            
            switch (paymentStatus) {
                case 'PAID':
                    // All good
                    break;
                    
                case 'PARTIAL':
                    if (outstandingAmount > 5000000) { // 5M VND threshold
                        warnings.push(`Large outstanding balance: ${outstandingAmount.toLocaleString()} VND`);
                    } else {
                        warnings.push(`Outstanding balance: ${outstandingAmount.toLocaleString()} VND`);
                    }
                    break;
                    
                case 'UNPAID':
                    if (gracePeriodExpired) {
                        errors.push('Payment grace period has expired');
                        canRegister = false;
                    } else {
                        warnings.push('Tuition payment is pending');
                    }
                    break;
                    
                case 'OVERDUE':
                    errors.push(`Payment is overdue. Outstanding amount: ${outstandingAmount.toLocaleString()} VND`);
                    canRegister = false;
                    break;
            }

            // Additional financial holds check
            const financialHolds = await this.checkFinancialHolds(studentId);
            if (financialHolds.length > 0) {
                errors.push(`Financial holds: ${financialHolds.join(', ')}`);
                canRegister = false;
            }

            return {
                canRegister,
                paymentStatus,
                outstandingAmount,
                gracePeriodExpired,
                errors,
                warnings
            };

        } catch (error) {
            console.error('Error checking payment eligibility:', error);
            return {
                canRegister: false,
                paymentStatus: 'UNPAID',
                outstandingAmount: 0,
                gracePeriodExpired: false,
                errors: ['Error checking payment status'],
                warnings: []
            };
        }
    }    // Helper methods
    private static async getTuitionPerCredit(studentId: string): Promise<number> {
        try {
            // Get student's program information
            const student = await DatabaseService.queryOne(`
                SELECT s.*, p.name_year as program_name
                FROM students s
                LEFT JOIN programs p ON s.major = p.major
                WHERE s.student_id = $1
            `, [studentId]);

            if (!student) {
                return 1500000; // Default rate
            }

            // Get tuition rate based on program/major
            const tuitionRate = await DatabaseService.queryOne(`
                SELECT tr.rate_per_credit, tr.effective_date
                FROM tuition_rates tr
                WHERE tr.program = $1 
                AND tr.status = 'active'
                AND tr.effective_date <= CURRENT_DATE
                ORDER BY tr.effective_date DESC
                LIMIT 1
            `, [student.major]);

            if (tuitionRate) {
                return parseFloat(tuitionRate.rate_per_credit);
            }

            // Get default rate from system settings
            const defaultRate = await DatabaseService.queryOne(`
                SELECT setting_value FROM system_settings 
                WHERE setting_key = 'default_tuition_per_credit'
            `);

            return parseFloat(defaultRate?.setting_value || '1500000');

        } catch (error) {
            console.error('Error getting tuition per credit:', error);
            return 1500000; // Fallback rate
        }
    }

    private static async calculateAdditionalFees(courseId: string, semester: string): Promise<{ total: number; breakdown: Array<{ description: string; amount: number }> }> {
        try {
            const breakdown: Array<{ description: string; amount: number }> = [];

            // Get course-specific fees
            const courseFees = await DatabaseService.query(`
                SELECT cf.fee_name, cf.amount, cf.fee_type
                FROM course_fees cf
                JOIN open_courses oc ON cf.course_type = oc.type OR cf.subject_code = oc.subject_code
                WHERE oc.id = $1 AND cf.status = 'active'
            `, [parseInt(courseId)]);

            courseFees.forEach(fee => {
                breakdown.push({
                    description: fee.fee_name,
                    amount: parseFloat(fee.amount)
                });
            });

            // Get semester-wide fees
            const semesterFees = await DatabaseService.query(`
                SELECT sf.fee_name, sf.amount
                FROM semester_fees sf
                WHERE sf.semester = $1 AND sf.status = 'active'
            `, [semester]);

            semesterFees.forEach(fee => {
                breakdown.push({
                    description: fee.fee_name,
                    amount: parseFloat(fee.amount)
                });
            });

            // Default fees if no specific fees found
            if (breakdown.length === 0) {
                breakdown.push(
                    { description: 'Administrative fee', amount: 200000 },
                    { description: 'Insurance fee', amount: 100000 }
                );
            }

            return {
                total: breakdown.reduce((sum, fee) => sum + fee.amount, 0),
                breakdown
            };

        } catch (error) {
            console.error('Error calculating additional fees:', error);
            // Return default fees on error
            const defaultBreakdown = [
                { description: 'Administrative fee', amount: 200000 },
                { description: 'Insurance fee', amount: 100000 }
            ];
            return {
                total: defaultBreakdown.reduce((sum, fee) => sum + fee.amount, 0),
                breakdown: defaultBreakdown
            };
        }
    }

    private static async checkGracePeriod(studentId: string, semester: string): Promise<boolean> {
        try {
            // Get grace period settings from database
            const gracePeriodSettings = await DatabaseService.queryOne(`
                SELECT grace_period_days FROM payment_settings 
                WHERE semester = $1 AND status = 'active'
            `);

            const gracePeriodDays = gracePeriodSettings?.grace_period_days || 30;

            // Get student's registration date for this semester
            const registration = await DatabaseService.queryOne(`
                SELECT MIN(e.enrollment_date) as first_enrollment
                FROM enrollments e
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e.semester = $2
            `, [studentId, semester]);

            if (!registration?.first_enrollment) {
                return false; // No registration found, grace period not applicable
            }

            // Calculate grace period end date
            const enrollmentDate = new Date(registration.first_enrollment);
            const gracePeriodEnd = new Date(enrollmentDate);
            gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);

            return new Date() > gracePeriodEnd;

        } catch (error) {
            console.error('Error checking grace period:', error);
            // Default to 30 days from registration
            const now = new Date();
            const defaultGracePeriodEnd = new Date();
            defaultGracePeriodEnd.setDate(now.getDate() - 30);
            return now > defaultGracePeriodEnd;
        }
    }

    private static async checkFinancialHolds(studentId: string): Promise<string[]> {
        try {
            const holds = await DatabaseService.query(`
                SELECT hold_type, hold_reason, amount
                FROM financial_holds fh
                WHERE fh.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND fh.status = 'active'
                ORDER BY fh.created_at DESC
            `, [studentId]);

            return holds.map(hold => 
                `${hold.hold_type}: ${hold.hold_reason}${hold.amount ? ` (${parseFloat(hold.amount).toLocaleString()} VND)` : ''}`
            );

        } catch (error) {
            console.error('Error checking financial holds:', error);
            return []; // Return no holds on error
        }
    }

    private static calculateDueDate(semester: string): Date {
        try {
            // Parse semester to determine due date
            // Semester format: "2024-1", "2024-2", etc.
            const [year, semesterNum] = semester.split('-').map(Number);
            
            if (!year || !semesterNum) {
                // Default to 30 days from now
                const defaultDate = new Date();
                defaultDate.setDate(defaultDate.getDate() + 30);
                return defaultDate;
            }

            // Calculate due date based on semester
            let dueDate = new Date();
            
            if (semesterNum === 1) {
                // First semester: due date in February
                dueDate = new Date(year, 1, 15); // February 15
            } else if (semesterNum === 2) {
                // Second semester: due date in July
                dueDate = new Date(year, 6, 15); // July 15
            } else if (semesterNum === 3) {
                // Summer semester: due date in September
                dueDate = new Date(year, 8, 15); // September 15
            } else {
                // Default to 30 days from now
                dueDate.setDate(dueDate.getDate() + 30);
            }

            return dueDate;

        } catch (error) {
            console.error('Error calculating due date:', error);
            // Default to 30 days from now
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 30);
            return defaultDate;
        }
    }
}
