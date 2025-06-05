import { IEnrollment, IEnrolledSubject, EnrollmentStatus } from '../../models/student_related/studentEnrollmentInterface';
import { IStudent } from '../../models/student_related/studentInterface';

// TODO: Replace with actual database implementation
const enrollments: IEnrollment[] = [];
const enrolledSubjects: IEnrolledSubject[] = [];
export { enrollments, enrolledSubjects };

export const enrollmentService = {
    async getEnrolledSubjects(studentId: string, semester: string): Promise<IEnrolledSubject[]> {
        // TODO: Implement database query
        return enrolledSubjects.filter(subject => 
            subject.enrollment.studentId === studentId && 
            subject.enrollment.semester === semester
        );
    },

    async getSubjectDetails(studentId: string, subjectId: string): Promise<IEnrolledSubject | null> {
        // TODO: Implement database query
        return enrolledSubjects.find(subject => 
            subject.enrollment.studentId === studentId && 
            subject.enrollment.courseId === subjectId
        ) || null;
    },

    async enrollInSubject(enrollmentData: Omit<IEnrollment, 'id' | 'status'>): Promise<IEnrollment> {
        // TODO: Implement database insert
        const newEnrollment: IEnrollment = {
            ...enrollmentData,
            id: Math.random().toString(36).substr(2, 9),
            status: 'registered'
        };
        enrollments.push(newEnrollment);
        return newEnrollment;
    },

    async cancelEnrollment(enrollmentId: string): Promise<IEnrollment | null> {
        // TODO: Implement database update
        const enrollment = enrollments.find(e => e.id === enrollmentId);
        if (enrollment) {
            enrollment.status = 'dropped';
            return enrollment;
        }
        throw new Error('Enrollment not found');
    },

    async getEnrollmentHistory(studentId: string): Promise<IEnrollment[]> {
        // TODO: Implement database query
        return enrollments
            .filter(e => e.studentId === studentId)
            .sort((a, b) => new Date(b.semester).getTime() - new Date(a.semester).getTime());
    },

    async checkEnrollmentStatus(studentId: string, subjectId: string): Promise<EnrollmentStatus | 'not_enrolled'> {
        // TODO: Implement database query
        const enrollment = enrollments.find(e => 
            e.studentId === studentId && 
            e.courseId === subjectId
        );
        return enrollment?.status || 'not_enrolled';
    }
};