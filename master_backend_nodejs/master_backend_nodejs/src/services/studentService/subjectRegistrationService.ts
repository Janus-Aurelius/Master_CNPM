// src/services/studentService/subjectRegistrationService.ts
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

// Mock data for subjects
const subjects: ISubject[] = [
    {
        id: 'IT001',
        name: 'Nhập môn lập trình',
        lecturer: 'TS. Nguyễn Văn A',
        credits: 4,
        maxStudents: 60,
        currentStudents: 45,
        schedule: [
            { day: 'Thứ 2', session: '1', room: 'E3.1' },
            { day: 'Thứ 4', session: '2', room: 'E3.1' }
        ]
    },
    {
        id: 'IT002',
        name: 'Lập trình hướng đối tượng',
        lecturer: 'PGS. TS. Trần Thị B',
        credits: 4,
        maxStudents: 60,
        currentStudents: 40,
        schedule: [
            { day: 'Thứ 3', session: '2', room: 'E2.5' },
            { day: 'Thứ 5', session: '3', room: 'E2.5' }
        ]
    },
    {
        id: 'IT003',
        name: 'Cấu trúc dữ liệu và giải thuật',
        lecturer: 'TS. Lê Văn C',
        credits: 4,
        maxStudents: 60,
        currentStudents: 50,
        schedule: [
            { day: 'Thứ 4', session: '3', room: 'E4.2' },
            { day: 'Thứ 6', session: '4', room: 'E4.2' }
        ]
    },
    {
        id: 'SE001',
        name: 'Nhập môn công nghệ phần mềm',
        lecturer: 'TS. Phạm Thị D',
        credits: 3,
        maxStudents: 60,
        currentStudents: 35,
        schedule: [
            { day: 'Thứ 5', session: '4', room: 'B1.2' }
        ]
    },
    {
        id: 'MA001',
        name: 'Giải tích 1',
        lecturer: 'GS. TS. Trần Văn E',
        credits: 4,
        maxStudents: 70,
        currentStudents: 60,
        schedule: [
            { day: 'Thứ 2', session: '3', room: 'C2.1' },
            { day: 'Thứ 4', session: '1', room: 'C2.1' }
        ]
    }
];

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

    async registerSubject(studentId: string, subjectId: string, semester: string): Promise<boolean> {
        // TODO: Implement database insert
        const subject = subjects.find(s => s.id === subjectId);
        
        if (!subject) {
            throw new Error('Subject not found');
        }
        
        if (subject.currentStudents >= subject.maxStudents) {
            throw new Error('Subject is full');
        }
        
        // Increment current students
        subject.currentStudents += 1;
        
        return true;
    }
};
