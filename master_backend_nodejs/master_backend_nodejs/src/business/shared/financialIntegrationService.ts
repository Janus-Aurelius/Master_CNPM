// src/business/shared/financialIntegrationService.ts
import { financialService } from '../../services/financialService/financialService';
import { SubjectBusiness } from '../academicBusiness/subject.business';

export interface TuitionCalculation {
    baseAmount: number;
    additionalFees: number;
    totalAmount: number;
    breakdown: Array<{
        description: string;
        amount: number;
    }>;
}

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
    ): Promise<TuitionCalculation> {
        try {
            // Get course/subject information
            const subjects = await SubjectBusiness.getAllSubjects();
            const subject = subjects.find(s => s.subjectCode === courseId);

            if (!subject) {
                throw new Error(`Subject ${courseId} not found`);
            }

            // Base tuition calculation
            const creditHour = subject.credits || 3;
            const tuitionPerCredit = await this.getTuitionPerCredit(studentId);
            const baseAmount = creditHour * tuitionPerCredit;

            // Additional fees calculation
            const additionalFees = await this.calculateAdditionalFees(courseId, semester);

            const breakdown = [
                {
                    description: `Tuition (${creditHour} credits × ${tuitionPerCredit.toLocaleString()} VND)`,
                    amount: baseAmount
                },
                ...additionalFees.breakdown
            ];

            return {
                baseAmount,
                additionalFees: additionalFees.total,
                totalAmount: baseAmount + additionalFees.total,
                breakdown
            };

        } catch (error) {
            console.error('Error calculating course tuition:', error);
            return {
                baseAmount: 0,
                additionalFees: 0,
                totalAmount: 0,
                breakdown: [{ description: 'Error calculating tuition', amount: 0 }]
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
    }

    /**
     * Auto-create tuition record when student registers for a course
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
                breakdown: tuitionCalculation.breakdown,
                dueDate: this.calculateDueDate(semester),
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

    // Helper methods
    private static async getTuitionPerCredit(studentId: string): Promise<number> {
        // TODO: Implement based on student program, year, etc.
        // Different programs might have different tuition rates
        return 1500000; // 1.5M VND per credit hour (mock)
    }

    private static async calculateAdditionalFees(courseId: string, semester: string): Promise<{ total: number; breakdown: Array<{ description: string; amount: number }> }> {
        // TODO: Implement additional fees calculation
        // Lab fees, facility fees, etc.
        const breakdown = [
            { description: 'Administrative fee', amount: 200000 },
            { description: 'Insurance fee', amount: 100000 }
        ];

        return {
            total: breakdown.reduce((sum, fee) => sum + fee.amount, 0),
            breakdown
        };
    }

    private static async checkGracePeriod(studentId: string, semester: string): Promise<boolean> {
        // TODO: Implement grace period check
        // Check if current date is past the payment deadline
        const now = new Date();
        const gracePeriodEnd = new Date('2024-02-15'); // Mock date
        return now > gracePeriodEnd;
    }

    private static async checkFinancialHolds(studentId: string): Promise<string[]> {
        // TODO: Implement financial holds check
        // Library fines, parking tickets, etc.
        return []; // Mock: no holds
    }

    private static calculateDueDate(semester: string): Date {
        // TODO: Implement due date calculation based on semester
        // Usually 30 days from registration or specific semester dates
        const now = new Date();
        now.setDate(now.getDate() + 30); // 30 days from now
        return now;
    }
}
