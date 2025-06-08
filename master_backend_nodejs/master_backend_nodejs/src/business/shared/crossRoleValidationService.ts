// src/business/shared/crossRoleValidationService.ts
import { DatabaseService } from '../../services/database/databaseService';
import { ValidationError } from '../../utils/errors/validation.error';
import { AcademicRulesEngine } from './academicRulesEngine';

export interface CourseRegistrationValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface StudentEligibilityCheck {
    canRegister: boolean;
    prerequisitesMet: boolean;
    hasScheduleConflict: boolean;
    hasPaymentIssues: boolean;
    creditLimitExceeded: boolean;
    errors: string[];
}

export interface PaymentValidationResult {
    isValid: boolean;
    critical: boolean;
    errors: string[];
    warnings: string[];
}

export interface PrerequisiteValidationResult {
    isValid: boolean;
    errors: string[];
    missingPrerequisites: string[];
}

export interface CreditValidationResult {
    isValid: boolean;
    isWarning: boolean;
    errors: string[];
    currentCredits: number;
    maxCredits: number;
}

export class CrossRoleValidationService {
    
    /**
     * Comprehensive course registration validation
     * Integrates Academic Affairs and Financial Department rules
     */
    static async validateCourseRegistration(
        studentId: string, 
        courseId: string, 
        semester: string
    ): Promise<CourseRegistrationValidation> {
        const errors: string[] = [];
        const warnings: string[] = [];

        try {
            // 1. Basic input validation
            if (!studentId || !courseId || !semester) {
                errors.push('Student ID, Course ID, and Semester are required');
                return { isValid: false, errors, warnings };
            }

            // 2. Course availability check (Academic Affairs)
            const course = await DatabaseService.queryOne(`
                SELECT oc.*, s.subject_name, s.credits, s.prerequisites, s.subject_code
                FROM open_courses oc 
                JOIN subjects s ON oc.subject_id = s.id 
                WHERE oc.id = $1
            `, [parseInt(courseId)]);
            
            if (!course) {
                errors.push('Course not found');
                return { isValid: false, errors, warnings };
            }

            // 3. Course status validation
            if (course.status !== 'open') {
                errors.push(`Course is currently ${course.status} and not available for registration`);
            }

            // 4. Course capacity validation
            if (course.current_students >= course.max_students) {
                errors.push('Course has reached maximum capacity');
            }

            // 5. Registration period validation
            const now = new Date();
            const regStart = new Date(course.registration_start_date);
            const regEnd = new Date(course.registration_end_date);
            
            if (now < regStart) {
                errors.push('Registration period has not started yet');
            } else if (now > regEnd) {
                errors.push('Registration period has ended');
            }            // 6. Check if student already enrolled
            const existingEnrollment = await DatabaseService.queryOne(`
                SELECT id FROM enrollments 
                WHERE student_id = (SELECT id FROM students WHERE student_id = $1) 
                AND course_id = $2 
                AND is_enrolled = true
            `, [studentId, parseInt(courseId)]);

            if (existingEnrollment) {
                errors.push('Student is already enrolled in this course');
            }

            // 7. Prerequisites validation (Academic Affairs)
            const prerequisitesValid = await this.validatePrerequisites(studentId, course.prerequisites);
            if (!prerequisitesValid.isValid) {
                errors.push(...prerequisitesValid.errors);
            }

            // 8. Payment status validation (Financial Department)
            const paymentValid = await this.validatePaymentStatus(studentId, semester);
            if (!paymentValid.isValid) {
                warnings.push(...paymentValid.warnings);
                if (paymentValid.critical) {
                    errors.push(...paymentValid.errors);
                }
            }

            // 9. Credit limit validation
            const creditValid = await this.validateCreditLimits(studentId, course.subject_code, semester);
            if (!creditValid.isValid) {
                if (creditValid.isWarning) {
                    warnings.push(...creditValid.errors);
                } else {
                    errors.push(...creditValid.errors);
                }
            }

            return {
                isValid: errors.length === 0,
                errors,
                warnings
            };

        } catch (error) {
            console.error('Course registration validation error:', error);
            return {
                isValid: false,
                errors: ['Internal validation error occurred'],
                warnings
            };
        }
    }

    /**
     * Validate prerequisites using database
     */
    private static async validatePrerequisites(
        studentId: string, 
        prerequisites: string[]
    ): Promise<PrerequisiteValidationResult> {
        if (!prerequisites || prerequisites.length === 0) {
            return { isValid: true, errors: [], missingPrerequisites: [] };
        }

        const errors: string[] = [];
        const missingPrerequisites: string[] = [];

        try {
            // Get student's completed courses
            const completedCourses = await DatabaseService.query(`
                SELECT DISTINCT s.subject_code 
                FROM grades g
                JOIN enrollments e ON g.enrollment_id = e.id
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_id = s.id
                JOIN students st ON e.student_id = st.id
                WHERE st.student_id = $1 
                AND g.grade_value >= 4.0
                AND g.status = 'finalized'
            `, [studentId]);

            const completedSubjects = completedCourses.map((c: any) => c.subject_code);

            for (const prereq of prerequisites) {
                if (!completedSubjects.includes(prereq)) {
                    missingPrerequisites.push(prereq);
                    errors.push(`Missing prerequisite: ${prereq}`);
                }
            }

            return {
                isValid: missingPrerequisites.length === 0,
                errors,
                missingPrerequisites
            };

        } catch (error) {
            console.error('Prerequisites validation error:', error);
            return {
                isValid: false,
                errors: ['Could not validate prerequisites'],
                missingPrerequisites: []
            };
        }
    }

    /**
     * Validate payment status using database
     */
    private static async validatePaymentStatus(
        studentId: string, 
        semester: string
    ): Promise<PaymentValidationResult> {
        try {
            // Check tuition payment status for current semester
            const tuitionRecord = await DatabaseService.queryOne(`
                SELECT * FROM tuition_records 
                WHERE student_id = (SELECT id FROM students WHERE student_id = $1)
                AND semester = $2
            `, [studentId, semester]);

            if (!tuitionRecord) {
                return {
                    isValid: false,
                    critical: true,
                    errors: ['No tuition record found for current semester'],
                    warnings: []
                };
            }

            const errors: string[] = [];
            const warnings: string[] = [];
            let critical = false;

            // Check payment status
            if (tuitionRecord.payment_status === 'unpaid') {
                critical = true;
                errors.push('Tuition payment is required before course registration');
            } else if (tuitionRecord.payment_status === 'partial') {
                const remainingAmount = tuitionRecord.total_amount - tuitionRecord.paid_amount;
                if (remainingAmount > tuitionRecord.total_amount * 0.5) { // More than 50% unpaid
                    critical = true;
                    errors.push(`Significant tuition balance remaining: ${remainingAmount.toLocaleString()} VND`);
                } else {
                    warnings.push(`Tuition balance remaining: ${remainingAmount.toLocaleString()} VND`);
                }
            }

            // Check due date
            if (tuitionRecord.due_date && new Date() > new Date(tuitionRecord.due_date)) {
                if (tuitionRecord.payment_status !== 'paid') {
                    critical = true;
                    errors.push('Tuition payment is overdue');
                }
            }

            return {
                isValid: !critical,
                critical,
                errors,
                warnings
            };

        } catch (error) {
            console.error('Payment validation error:', error);
            return {
                isValid: false,
                critical: true,
                errors: ['Could not validate payment status'],
                warnings: []
            };
        }
    }

    /**
     * Validate credit limits using database
     */
    private static async validateCreditLimits(
        studentId: string, 
        subjectCode: string, 
        semester: string
    ): Promise<CreditValidationResult> {
        try {
            // Get subject credits
            const subject = await DatabaseService.queryOne(`
                SELECT credits FROM subjects WHERE subject_code = $1
            `, [subjectCode]);

            if (!subject) {
                return {
                    isValid: false,
                    isWarning: false,
                    errors: ['Subject not found'],
                    currentCredits: 0,
                    maxCredits: 0
                };
            }

            // Get current semester enrolled credits
            const currentCredits = await DatabaseService.queryOne(`
                SELECT COALESCE(SUM(s.credits), 0) as total_credits
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_id = s.id
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND oc.semester = $2
                AND e.status IN ('registered', 'enrolled')
            `, [studentId, semester]);

            const newTotalCredits = (currentCredits?.total_credits || 0) + subject.credits;
            const maxCredits = 24; // Standard maximum credits per semester

            const errors: string[] = [];
            let isWarning = false;

            if (newTotalCredits > maxCredits) {
                errors.push(`Credit limit exceeded. Current: ${currentCredits?.total_credits || 0}, Adding: ${subject.credits}, Max: ${maxCredits}`);
                return {
                    isValid: false,
                    isWarning: false,
                    errors,
                    currentCredits: currentCredits?.total_credits || 0,
                    maxCredits
                };
            } else if (newTotalCredits > maxCredits * 0.8) { // Warning at 80%
                isWarning = true;
                errors.push(`Approaching credit limit. Total will be: ${newTotalCredits}/${maxCredits} credits`);
                return {
                    isValid: false,
                    isWarning: true,
                    errors,
                    currentCredits: currentCredits?.total_credits || 0,
                    maxCredits
                };
            }

            return {
                isValid: true,
                isWarning: false,
                errors: [],
                currentCredits: currentCredits?.total_credits || 0,
                maxCredits
            };

        } catch (error) {
            console.error('Credit validation error:', error);
            return {
                isValid: false,
                isWarning: false,
                errors: ['Could not validate credit limits'],
                currentCredits: 0,
                maxCredits: 0
            };
        }
    }

    /**
     * Comprehensive student eligibility check
     */
    static async checkStudentEligibility(studentId: string, courseId: string): Promise<StudentEligibilityCheck> {
        try {
            const student = await DatabaseService.queryOne(`
                SELECT * FROM students WHERE student_id = $1
            `, [studentId]);

            if (!student) {
                return {
                    canRegister: false,
                    prerequisitesMet: false,
                    hasScheduleConflict: false,
                    hasPaymentIssues: true,
                    creditLimitExceeded: false,
                    errors: ['Student not found']
                };
            }

            // Get current semester from system settings or use default
            const currentSemester = await DatabaseService.queryOne(`
                SELECT setting_value FROM system_settings WHERE setting_key = 'current_semester'
            `);

            const semester = currentSemester?.setting_value || '2024-1';

            const validation = await this.validateCourseRegistration(studentId, courseId, semester);

            return {
                canRegister: validation.isValid,
                prerequisitesMet: !validation.errors.some(e => e.includes('prerequisite')),
                hasScheduleConflict: validation.errors.some(e => e.includes('schedule') || e.includes('conflict')),
                hasPaymentIssues: validation.errors.some(e => e.includes('payment') || e.includes('tuition')),
                creditLimitExceeded: validation.errors.some(e => e.includes('credit limit')),
                errors: [...validation.errors, ...validation.warnings]
            };

        } catch (error) {
            console.error('Student eligibility check error:', error);
            return {
                canRegister: false,
                prerequisitesMet: false,
                hasScheduleConflict: false,
                hasPaymentIssues: false,
                creditLimitExceeded: false,
                errors: ['Internal error during eligibility check']
            };
        }
    }

    /**
     * Check for schedule conflicts
     */
    static async checkScheduleConflict(studentId: string, courseId: string): Promise<boolean> {
        try {
            const conflictingCourses = await DatabaseService.query(`
                SELECT oc1.id, oc1.subject_id, s1.subject_name
                FROM enrollments e1
                JOIN open_courses oc1 ON e1.course_id = oc1.id
                JOIN subjects s1 ON oc1.subject_id = s1.id
                JOIN open_courses oc2 ON oc2.id = $2
                WHERE e1.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e1.status IN ('registered', 'enrolled')
                AND oc1.schedule && oc2.schedule
                AND oc1.id != oc2.id
            `, [studentId, parseInt(courseId)]);

            return conflictingCourses.length > 0;

        } catch (error) {
            console.error('Schedule conflict check error:', error);
            return false;
        }
    }
}
