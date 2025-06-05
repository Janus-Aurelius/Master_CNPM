import { IEnrollment } from '../../models/student_related/studentEnrollmentInterface';

interface ISubject {
    id: string;
    name: string;
    lecturer: string;
    credits: number;
    maxStudents: number;
    currentStudents: number;
    schedule: {
        day: string;
        session: string;
        room: string;
    }[];
}

// TODO: Replace with actual database implementation
const subjects: ISubject[] = [];
export { subjects };

export const subjectRegistrationService = {
    async getAvailableSubjects(semester: string): Promise<ISubject[]> {
        // TODO: Implement database query
        return subjects.filter(subject => subject.currentStudents < subject.maxStudents);
    },

    async searchSubjects(query: string, semester: string): Promise<ISubject[]> {
        // TODO: Implement database query
        return subjects.filter(subject => 
            subject.name.toLowerCase().includes(query.toLowerCase()) ||
            subject.id.toLowerCase().includes(query.toLowerCase())
        );
    },

    async registerSubject(studentId: string, subjectId: string): Promise<IEnrollment> {
        // TODO: Lấy số tín chỉ tối đa từ hệ thống phòng đào tạo khi merge code
        const MAX_CREDITS_PER_TERM = 20;
        // TODO: Lấy danh sách đăng ký hiện tại của sinh viên từ DB
        const currentEnrollments: IEnrollment[] = []; // Mock, cần thay bằng truy vấn DB
        // Kiểm tra đã đăng ký chưa
        if (currentEnrollments.some(e => e.courseId === subjectId && e.studentId === studentId)) {
            throw new Error('Already registered');
        }
        const currentCredits = currentEnrollments.reduce((sum, e) => sum + (e.credits || 0), 0);
        const subject = subjects.find(s => s.id === subjectId);
        if (!subject) {
            throw new Error('Subject not found');
        }
        if (subject.currentStudents >= subject.maxStudents) {
            throw new Error('Subject is full');
        }
        if (currentCredits + subject.credits > MAX_CREDITS_PER_TERM) {
            throw new Error('Vượt quá số tín chỉ tối đa mỗi đợt đăng ký');
        }
        // TODO: Check for schedule conflicts
        // TODO: Check student eligibility
        subject.currentStudents++;
        return {
            id: Math.random().toString(36).substr(2, 9),
            studentId,
            courseId: subjectId,
            courseName: subject.name,
            semester: 'current_semester', // TODO: Get from config
            status: 'registered',
            credits: subject.credits
        };
    },

    async cancelRegistration(studentId: string, subjectId: string): Promise<boolean> {
        // TODO: Implement database transaction
        const subject = subjects.find(s => s.id === subjectId);
        if (!subject) {
            throw new Error('Subject not found');
        }

        // TODO: Check if student is registered
        // TODO: Check if cancellation is allowed

        subject.currentStudents--;
        return true;
    },

    async getSubjectDetails(subjectId: string): Promise<ISubject | null> {
        // TODO: Implement database query
        return subjects.find(s => s.id === subjectId) || null;
    }
};