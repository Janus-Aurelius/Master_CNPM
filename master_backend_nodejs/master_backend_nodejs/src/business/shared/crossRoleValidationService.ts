// src/business/shared/crossRoleValidationService.ts
import { OpenCourseBusiness } from '../academicBusiness/openCourse.business';
import { SubjectBusiness } from '../academicBusiness/subject.business';
import { ProgramBusiness } from '../academicBusiness/program.business';
import { financialService } from '../../services/financialService/financialService';
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
            const course = await OpenCourseBusiness.getCourseById(parseInt(courseId));
            if (!course) {
                errors.push('Course not found');
                return { isValid: false, errors, warnings };
            }

            // 3. Course status validation
            if (course.status !== 'open') {
                errors.push(`Course is currently ${course.status} and not available for registration`);
            }

            // 4. Course capacity validation
            if (course.currentStudents >= course.maxStudents) {
                errors.push('Course has reached maximum capacity');
            }

            // 5. Registration period validation
            const now = new Date();
            const regStart = new Date(course.registrationStartDate);
            const regEnd = new Date(course.registrationEndDate);
            
            if (now < regStart) {
                errors.push('Registration period has not started yet');
            } else if (now > regEnd) {
                errors.push('Registration period has ended');
            }

            // 6. Prerequisites validation (Academic Affairs)
            const prerequisitesValid = await this.validatePrerequisites(studentId, course.prerequisites);
            if (!prerequisitesValid.isValid) {
                errors.push(...prerequisitesValid.errors);
            }

            // 7. Payment status validation (Financial Department)
            const paymentValid = await this.validatePaymentStatus(studentId, semester);
            if (!paymentValid.isValid) {
                warnings.push(...paymentValid.warnings);
                if (paymentValid.critical) {
                    errors.push(...paymentValid.errors);
                }
            }

            // 8. Credit limit validation
            const creditValid = await this.validateCreditLimits(studentId, course.subjectCode, semester);
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
            console.error('Error in course registration validation:', error);
            return {
                isValid: false,
                errors: ['Internal validation error occurred'],
                warnings
            };
        }
    }

    /**
     * Validate student prerequisites for a course
     */
    private static async validatePrerequisites(
        studentId: string, 
        prerequisites: string[]
    ): Promise<{ isValid: boolean; errors: string[] }> {
        const errors: string[] = [];
        
        if (!prerequisites || prerequisites.length === 0) {
            return { isValid: true, errors: [] };
        }

        // TODO: Implement prerequisite checking logic
        // This would involve checking student's completed courses
        // against the required prerequisites
        
        for (const prerequisite of prerequisites) {
            // Mock validation - replace with actual logic
            const hasCompleted = await this.checkStudentCompletedCourse(studentId, prerequisite);
            if (!hasCompleted) {
                errors.push(`Prerequisite not met: ${prerequisite}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate student payment status
     */
    private static async validatePaymentStatus(
        studentId: string, 
        semester: string
    ): Promise<{ isValid: boolean; errors: string[]; warnings: string[]; critical: boolean }> {
        const errors: string[] = [];
        const warnings: string[] = [];

        try {
            // Get student payment information from Financial Department
            const paymentInfo = await financialService.getStudentPayment(studentId);
            
            if (!paymentInfo) {
                return {
                    isValid: true,
                    errors: [],
                    warnings: ['No payment record found'],
                    critical: false
                };
            }

            // Check payment status
            switch (paymentInfo.paymentStatus) {
                case 'UNPAID':
                    if (paymentInfo.totalAmount > 0) {
                        warnings.push('Student has unpaid tuition fees');
                        // Could block registration based on policy
                        // errors.push('Cannot register with unpaid tuition fees');
                    }
                    break;
                case 'PARTIAL':
                    warnings.push('Student has partially paid tuition fees');
                    break;
                case 'PAID':
                    // All good
                    break;
                default:
                    warnings.push('Unknown payment status');
            }

            return {
                isValid: errors.length === 0,
                errors,
                warnings,
                critical: errors.length > 0
            };

        } catch (error) {
            console.error('Error validating payment status:', error);
            return {
                isValid: false,
                errors: ['Error checking payment status'],
                warnings: [],
                critical: true
            };
        }
    }

    /**
     * Validate credit limits for student registration
     */
    private static async validateCreditLimits(
        studentId: string, 
        subjectCode: string, 
        semester: string
    ): Promise<{ isValid: boolean; errors: string[]; isWarning: boolean }> {
        const errors: string[] = [];
        
        try {
            // Get subject credit information
            const subjects = await SubjectBusiness.getAllSubjects();
            const subject = subjects.find(s => s.subjectCode === subjectCode);
            
            if (!subject) {
                return {
                    isValid: false,
                    errors: ['Subject information not found'],
                    isWarning: false
                };
            }

            // TODO: Implement actual credit limit checking
            // This would involve:
            // 1. Getting student's current registered credits for the semester
            // 2. Adding the new subject's credits
            // 3. Checking against maximum allowed credits per semester
            
            const maxCreditsPerSemester = 24; // Example limit
            const currentCredits = await this.getStudentCurrentCredits(studentId, semester);
            const newTotalCredits = currentCredits + subject.credits;
            
            if (newTotalCredits > maxCreditsPerSemester) {
                errors.push(`Credit limit exceeded. Current: ${currentCredits}, Adding: ${subject.credits}, Max allowed: ${maxCreditsPerSemester}`);
                return {
                    isValid: false,
                    errors,
                    isWarning: false
                };
            }

            // Warning for high credit load
            if (newTotalCredits > maxCreditsPerSemester * 0.8) {
                errors.push(`High credit load warning: ${newTotalCredits}/${maxCreditsPerSemester} credits`);
                return {
                    isValid: true,
                    errors,
                    isWarning: true
                };
            }

            return {
                isValid: true,
                errors: [],
                isWarning: false
            };

        } catch (error) {
            console.error('Error validating credit limits:', error);
            return {
                isValid: false,
                errors: ['Error checking credit limits'],
                isWarning: false
            };
        }
    }

    /**
     * Check if student has completed a specific course
     * TODO: Implement with actual database query
     */
    private static async checkStudentCompletedCourse(studentId: string, courseCode: string): Promise<boolean> {
        // Mock implementation - replace with actual database query
        // This should check the student's academic record for completed courses
        return false; // Placeholder
    }

    /**
     * Get student's current registered credits for a semester
     * TODO: Implement with actual database query
     */
    private static async getStudentCurrentCredits(studentId: string, semester: string): Promise<number> {
        // Mock implementation - replace with actual database query
        // This should sum up credits from all courses the student is registered for in the semester
        return 0; // Placeholder
    }    /**
     * Complete student eligibility check combining all factors
     */
    static async checkStudentEligibility(
        studentId: string, 
        courseId: string, 
        semester: string
    ): Promise<StudentEligibilityCheck> {
        const errors: string[] = [];
        
        try {
            // 1. Academic Rules Engine checks
            const prerequisiteCheck = await AcademicRulesEngine.checkPrerequisites(studentId, courseId);
            const academicEligibility = await AcademicRulesEngine.checkAcademicEligibility(studentId, 3); // Assuming 3 credits
            const scheduleConflict = await AcademicRulesEngine.checkScheduleConflicts(studentId, courseId, semester);

            // 2. Financial validation
            const paymentValidation = await this.validatePaymentStatus(studentId, semester);

            // Compile results
            const prerequisitesMet = prerequisiteCheck.isMet;
            const hasScheduleConflict = scheduleConflict.hasConflict;
            const hasPaymentIssues = !paymentValidation.isValid || paymentValidation.critical;
            const creditLimitExceeded = !academicEligibility.canEnroll;

            // Add specific errors
            if (!prerequisitesMet) {
                errors.push(...prerequisiteCheck.details);
            }
            
            if (hasScheduleConflict) {
                errors.push(`Schedule conflict with: ${scheduleConflict.conflictingCourses.map(c => c.courseId).join(', ')}`);
            }
            
            if (!academicEligibility.canEnroll) {
                errors.push(`Academic eligibility failed: GPA ${academicEligibility.gpaRequirement.currentGPA} < ${academicEligibility.gpaRequirement.minRequiredGPA}`);
            }
            
            if (creditLimitExceeded) {
                errors.push(`Credit limit exceeded: ${academicEligibility.creditLimitStatus.currentCredits}/${academicEligibility.creditLimitStatus.maxCredits}`);
            }

            errors.push(...paymentValidation.errors);

            return {
                canRegister: prerequisitesMet && !hasScheduleConflict && !hasPaymentIssues && !creditLimitExceeded,
                prerequisitesMet,
                hasScheduleConflict,
                hasPaymentIssues,
                creditLimitExceeded,
                errors
            };

        } catch (error) {
            console.error('Error checking student eligibility:', error);
            return {
                canRegister: false,
                prerequisitesMet: false,
                hasScheduleConflict: false,
                hasPaymentIssues: true,
                creditLimitExceeded: false,
                errors: ['System error during eligibility check']
            };
        }
    }
}
