import { IEnrollment, IEnrolledSubject, EnrollmentStatus } from '../../models/student_related/studentEnrollmentInterface';
import { IStudent } from '../../models/student_related/studentInterface';
import { subjects } from './subjectRegistrationService';

// Mock data for enrollments
const enrollments: IEnrollment[] = [
    {
        id: '1',
        studentId: 'SV001',
        courseId: 'IT001',
        courseName: 'Nhập môn lập trình',
        semester: '2025-1',
        status: 'registered',
        credits: 4
    },
    {
        id: '2',
        studentId: 'SV001',
        courseId: 'IT002',
        courseName: 'Lập trình hướng đối tượng',
        semester: '2025-1',
        status: 'registered',
        credits: 4
    },
    {
        id: '3',
        studentId: 'SV002',
        courseId: 'IT003',
        courseName: 'Cấu trúc dữ liệu và giải thuật',
        semester: '2025-1',
        status: 'registered',
        credits: 4
    }
];

// Mock data for enrolled subjects with additional details
const enrolledSubjects: IEnrolledSubject[] = [
    {
        enrollment: enrollments[0],
        subjectDetails: subjects[0],
        grade: null,
        attendanceRate: 0
    },
    {
        enrollment: enrollments[1],
        subjectDetails: subjects[1],
        grade: null,
        attendanceRate: 0
    },
    {
        enrollment: enrollments[2],
        subjectDetails: subjects[2],
        grade: null,
        attendanceRate: 0
    }
];

export { enrollments, enrolledSubjects };

export const enrollmentService = {
    async getEnrolledSubjects(studentId: string, semester: string): Promise<IEnrolledSubject[]> {
        // Filter enrolled subjects by student ID and semester
        return enrolledSubjects.filter(subject => 
            subject.enrollment.studentId === studentId && 
            subject.enrollment.semester === semester
        );
    },

    async getSubjectDetails(studentId: string, subjectId: string): Promise<IEnrolledSubject | null> {
        // Find a specific enrolled subject for a student
        return enrolledSubjects.find(subject => 
            subject.enrollment.studentId === studentId && 
            subject.enrollment.courseId === subjectId
        ) || null;
    },

    async enrollInSubject(enrollmentData: Omit<IEnrollment, 'id' | 'status'>): Promise<IEnrollment> {
        // Create a new enrollment
        const newEnrollment: IEnrollment = {
            ...enrollmentData,
            id: Math.random().toString(36).substr(2, 9),
            status: 'registered'
        };
        
        // Add to enrollments array
        enrollments.push(newEnrollment);
        
        // Get subject details
        const subjectDetails = subjects.find(s => s.id === enrollmentData.courseId);
        
        if (subjectDetails) {
            // Create a new enrolled subject entry
            enrolledSubjects.push({
                enrollment: newEnrollment,
                subjectDetails,
                grade: null,
                attendanceRate: 0
            });
        }
        
        return newEnrollment;
    },

    async cancelEnrollment(studentId: string, subjectId: string): Promise<boolean> {
        // Find the enrollment
        const enrollmentIndex = enrollments.findIndex(
            e => e.studentId === studentId && e.courseId === subjectId
        );
        
        if (enrollmentIndex === -1) {
            throw new Error('Enrollment not found');
        }
        
        // Update status to dropped
        enrollments[enrollmentIndex].status = 'dropped';
        
        // Find and update the enrolled subject
        const enrolledSubjectIndex = enrolledSubjects.findIndex(
            es => es.enrollment.studentId === studentId && es.enrollment.courseId === subjectId
        );
        
        if (enrolledSubjectIndex !== -1) {
            enrolledSubjects[enrolledSubjectIndex].enrollment.status = 'dropped';
        }
        
        return true;
    },

    async getEnrollmentHistory(studentId: string): Promise<IEnrollment[]> {
        // Get all enrollments for a student sorted by semester
        return enrollments
            .filter(e => e.studentId === studentId)
            .sort((a, b) => new Date(b.semester).getTime() - new Date(a.semester).getTime());
    },

    async checkEnrollmentStatus(studentId: string, subjectId: string): Promise<EnrollmentStatus | 'not_enrolled'> {
        // Check if a student is enrolled in a subject
        const enrollment = enrollments.find(e => 
            e.studentId === studentId && 
            e.courseId === subjectId
        );
        return enrollment?.status || 'not_enrolled';
    }
};
