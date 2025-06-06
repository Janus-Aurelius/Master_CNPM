import { IStudentSchedule } from '../../models/student_related/studentInterface';
import { IStudentOverview, IClass } from '../../models/student_related/studentDashboardInterface';
import { IStudent } from '../../models/student_related/studentInterface';
import { subjects } from './subjectRegistrationService';

// Mock data for students
const students: IStudent[] = [
    {
        studentId: 'SV001',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        address: 'Quận 1, TP.HCM',
        dateOfBirth: new Date('2003-01-15'),
        enrollmentYear: 2022,
        major: 'Công nghệ thông tin',
        faculty: 'Khoa học và Kỹ thuật Máy tính',
        program: 'Cử nhân',
        status: 'active',
        avatarUrl: 'https://example.com/avatar1.jpg',
        credits: {
            completed: 64,
            current: 8,
            required: 145
        }
    },
    {
        studentId: 'SV002',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0912345678',
        address: 'Quận 2, TP.HCM',
        dateOfBirth: new Date('2002-05-22'),
        enrollmentYear: 2021,
        major: 'Khoa học máy tính',
        faculty: 'Khoa học và Kỹ thuật Máy tính',
        program: 'Cử nhân',
        status: 'active',
        avatarUrl: 'https://example.com/avatar2.jpg',
        credits: {
            completed: 79,
            current: 12,
            required: 145
        }
    }
];

// Mock class data from subjects
const classes: IClass[] = subjects.map(subject => ({
    id: `C${subject.id}`,
    subjectId: subject.id,
    subjectName: subject.name,
    lecturer: subject.lecturer,
    day: subject.schedule[0].day,
    time: `${subject.schedule[0].session === '1' ? '7:30-9:30' : 
            subject.schedule[0].session === '2' ? '9:30-11:30' : 
            subject.schedule[0].session === '3' ? '13:30-15:30' : '15:30-17:30'}`,
    room: subject.schedule[0].room
}));

// Mock data for student schedules
const schedules: IStudentSchedule[] = [
    {
        student: students[0],
        semester: '2025-1',
        subjects: [
            {
                id: 'IT001',
                name: 'Nhập môn lập trình',
                credit: 4,
                schedule: [
                    { day: 'Thứ 2', time: '7:30-9:30', room: 'E3.1' },
                    { day: 'Thứ 4', time: '9:30-11:30', room: 'E3.1' }
                ],
                lecturer: 'TS. Nguyễn Văn A'
            },
            {
                id: 'IT002',
                name: 'Lập trình hướng đối tượng',
                credit: 4,
                schedule: [
                    { day: 'Thứ 3', time: '9:30-11:30', room: 'E2.5' },
                    { day: 'Thứ 5', time: '13:30-15:30', room: 'E2.5' }
                ],
                lecturer: 'PGS. TS. Trần Thị B'
            }
        ]
    },
    {
        student: students[1],
        semester: '2025-1',
        subjects: [
            {
                id: 'IT003',
                name: 'Cấu trúc dữ liệu và giải thuật',
                credit: 4,
                schedule: [
                    { day: 'Thứ 4', time: '13:30-15:30', room: 'E4.2' },
                    { day: 'Thứ 6', time: '15:30-17:30', room: 'E4.2' }
                ],
                lecturer: 'TS. Lê Văn C'
            }
        ]
    }
];

// Mock data for student overviews
const overviews: IStudentOverview[] = [
    {
        student: students[0],
        enrolledSubjects: 2,
        totalCredits: 8,
        gpa: 3.5,
        upcomingClasses: [
            classes[0],
            classes[1]
        ],        recentPayments: [
            {
                id: 1001,
                studentId: 'SV001',
                courseId: 1,
                amount: 8000000,
                date: '2025-02-15',
                status: 'paid',
                paymentMethod: 'bank_transfer',
                transactionId: 'TXN-1001'
            }
        ]
    },
    {
        student: students[1],
        enrolledSubjects: 3,
        totalCredits: 10,
        gpa: 3.7,
        upcomingClasses: [
            classes[2]
        ],        recentPayments: [
            {
                id: 1002,
                studentId: 'SV002',
                courseId: 2,
                amount: 10000000,
                date: '2025-02-10',
                status: 'paid',
                paymentMethod: 'credit_card',
                transactionId: 'TXN-1002'
            }
        ]
    }
];

export const dashboardService = {
    async getStudentOverview(studentId: string): Promise<IStudentOverview | null> {
        return overviews.find(overview => overview.student.studentId === studentId) || null;
    },

    async getStudentSchedule(studentId: string): Promise<IStudentSchedule | null> {
        return schedules.find(schedule => schedule.student.studentId === studentId) || null;
    },

    async updateStudentOverview(overview: IStudentOverview): Promise<IStudentOverview> {
        const index = overviews.findIndex(o => o.student.studentId === overview.student.studentId);
        if (index !== -1) {
            overviews[index] = overview;
        } else {
            overviews.push(overview);
        }
        return overview;
    }
};