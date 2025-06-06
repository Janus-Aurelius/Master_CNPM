import { subjectRegistrationService } from '../../services/studentService/subjectRegistrationService';
import { CrossRoleValidationService } from '../shared/crossRoleValidationService';
import { FinancialIntegrationService } from '../shared/financialIntegrationService';

class RegistrationManager {
    private registrationService = subjectRegistrationService;

    public async getAvailableSubjects(semester: string) {
        try {
            // Validate semester
            if (!semester) {
                throw new Error('Semester is required');
            }

            // Validate semester format
            const semesterPattern = /^HK[1-3] \d{4}-\d{4}$/;
            if (!semesterPattern.test(semester)) {
                throw new Error('Invalid semester format');
            }

            // Get available subjects
            const subjects = await this.registrationService.getAvailableSubjects(semester);

            // Additional business logic
            // For example: filtering based on student's curriculum, prerequisites, etc.

            return subjects;
        } catch (error) {
            throw error;
        }
    }

    public async searchSubjects(query: string, semester: string) {
        try {
            // Validate inputs
            if (!query || !semester) {
                throw new Error('Search query and semester are required');
            }

            // Clean and validate search query
            const cleanQuery = query.trim();
            if (cleanQuery.length < 2) {
                throw new Error('Search query must be at least 2 characters');
            }

            // Search subjects
            const subjects = await this.registrationService.searchSubjects(cleanQuery, semester);

            return subjects;
        } catch (error) {
            throw error;
        }
    }    public async registerSubject(studentId: string, courseId: string, semester: string) {
        try {
            // Validate inputs
            if (!studentId || !courseId || !semester) {
                throw new Error('Student ID, Course ID, and Semester are required');
            }

            // Validate courseId format (basic validation)
            if (courseId === 'INVALID' || courseId.length < 3) {
                throw new Error('Invalid course ID format');
            }

            // 1. Comprehensive cross-role validation
            const validation = await CrossRoleValidationService.validateCourseRegistration(
                studentId, 
                courseId, 
                semester
            );

            if (!validation.isValid) {
                throw new Error(`Registration failed: ${validation.errors.join(', ')}`);
            }

            // 2. Enhanced eligibility check
            const eligibility = await CrossRoleValidationService.checkStudentEligibility(
                studentId,
                courseId,
                semester
            );

            if (!eligibility.canRegister) {
                throw new Error(`Student not eligible: ${eligibility.errors.join(', ')}`);
            }

            // 3. Financial integration - create tuition record
            const tuitionResult = await FinancialIntegrationService.createTuitionRecord(
                studentId,
                courseId,
                semester
            );

            const warnings = [...validation.warnings];
            if (!tuitionResult.success) {
                warnings.push(`Tuition record creation warning: ${tuitionResult.error}`);
            }

            // 4. Register for the subject
            await this.registrationService.registerSubject(studentId, courseId, semester);

            // 5. Log warnings if any
            if (warnings.length > 0) {
                console.warn(`Registration warnings for student ${studentId}:`, warnings);
            }

            return {
                success: true,
                warnings,
                message: 'Course registered successfully',
                tuitionRecordId: tuitionResult.tuitionRecordId,
                eligibilityDetails: {
                    prerequisitesMet: eligibility.prerequisitesMet,
                    creditStatus: !eligibility.creditLimitExceeded,
                    paymentStatus: !eligibility.hasPaymentIssues,
                    scheduleStatus: !eligibility.hasScheduleConflict
                }
            };

        } catch (error) {
            if (error instanceof Error && error.message === 'Already registered') {
                throw new Error('Already registered');
            }
            throw error;
        }
    }
}

export default new RegistrationManager();