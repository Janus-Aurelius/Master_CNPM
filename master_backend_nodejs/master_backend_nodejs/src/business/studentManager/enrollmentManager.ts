import { EnrollmentService } from '../../services/studentServices';
import { IEnrollment } from '../../models/student_related/student-enrollment.interface';

class EnrollmentManager {
    private enrollmentService: EnrollmentService;

    constructor() {
        this.enrollmentService = new EnrollmentService();
    }

    public async getEnrolledSubjects(studentId: string, semester: string) {
        try {
            // Validate inputs
            if (!studentId || !semester) {
                throw new Error('Student ID and semester are required');
            }

            // Validate semester format
            const semesterPattern = /^HK[1-3] \d{4}-\d{4}$/;
            if (!semesterPattern.test(semester)) {
                throw new Error('Invalid semester format');
            }

            // Get enrolled subjects
            const subjects = await this.enrollmentService.getEnrolledSubjects(studentId, semester);

            // Additional business logic
            // For example: sorting by day/time, adding status indicators, etc.

            return subjects;
        } catch (error) {
            throw error;
        }
    }

    public async cancelRegistration(studentId: string, courseId: string) {
        try {
            // Validate inputs
            if (!studentId || !courseId) {
                throw new Error('Student ID and Course ID are required');
            }

            // Additional business validations:
            // 1. Check if within cancellation period
            // 2. Check if student is actually enrolled in the course
            // 3. Check if cancellation would affect other requirements (e.g., minimum credits)

            // Get enrollment details first
            const enrollment = await this.enrollmentService.getEnrollmentDetails(studentId, courseId);
            
            // Check if enrollment exists
            if (!enrollment) {
                throw new Error('Enrollment not found');
            }

            // Check enrollment status
            if (enrollment.status !== 'registered') {
                throw new Error('Cannot cancel - enrollment status is ' + enrollment.status);
            }

            // Cancel registration
            await this.enrollmentService.cancelRegistration(studentId, courseId);

        } catch (error) {
            throw error;
        }
    }

    public async getEnrollmentDetails(studentId: string, courseId: string): Promise<IEnrollment> {
        try {
            // Validate inputs
            if (!studentId || !courseId) {
                throw new Error('Student ID and Course ID are required');
            }

            // Get enrollment details
            const enrollment = await this.enrollmentService.getEnrollmentDetails(studentId, courseId);

            // Additional business logic
            // For example: adding grade calculations, attendance info, etc.

            return enrollment;
        } catch (error) {
            throw error;
        }
    }
}

export default new EnrollmentManager(); 