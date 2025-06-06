import { enrollmentService } from '../../services/studentService/enrollmentService';
import { IEnrollment } from '../../models/student_related/studentEnrollmentInterface';

class EnrollmentManager {
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
            const subjects = await enrollmentService.getEnrolledSubjects(studentId, semester);

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

            // Get enrollment details first
            const enrollment = await enrollmentService.getSubjectDetails(studentId, courseId);

            // Check if enrollment exists
            if (!enrollment) {
                throw new Error('Enrollment not found');
            }

            // Check enrollment status
            if (enrollment.enrollment.status !== 'registered') {
                throw new Error('Cannot cancel - enrollment status is ' + enrollment.enrollment.status);
            }

            // Cancel registration
            await enrollmentService.cancelEnrollment(studentId, courseId);

        } catch (error) {
            if (error instanceof Error && error.message === 'Enrollment not found') {
                throw new Error('Enrollment not found');
            }
            throw error;
        }
    }

    public async getEnrollmentDetails(studentId: string, courseId: string): Promise<IEnrollment> {
        try {
            if (!studentId || !courseId) {
                throw new Error('Student ID and Course ID are required');
            }
            const enrollment = await enrollmentService.getSubjectDetails(studentId, courseId);
            if (!enrollment) {
                throw new Error('Enrollment not found');
            }
            return enrollment.enrollment;
        } catch (error) {
            throw error;
        }
    }
}

export default new EnrollmentManager();