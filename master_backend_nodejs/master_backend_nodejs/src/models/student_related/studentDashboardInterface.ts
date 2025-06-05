import { IPayment } from '../payment';
import { IStudent } from './studentInterface';

export interface IStudentOverview {
    student: IStudent;
    enrolledSubjects: number;
    totalCredits: number;
    gpa: number;
    upcomingClasses: IClass[];
    recentPayments: IPayment[];
}

export interface IClass {
    id: string;
    subjectId: string;
    subjectName: string;
    lecturer: string;
    day: string;
    time: string;
    room: string;
}

export interface IGrade {
    studentId: string;
    subjectId: string;
    midtermGrade: number;
    finalGrade: number;
    totalGrade: number;
    letterGrade: string;
}

export interface IFinancialReport {
    studentId: string;
    semester: string;
    totalTuition: number;
    paidAmount: number;
    remainingAmount: number;
    paymentHistory: IPayment[];
}

export interface IAcademicRequest {
    id: string;
    studentId: string;
    type: 'course_registration' | 'grade_review' | 'academic_leave' | 'other';
    status: 'pending' | 'approved' | 'rejected';
    description: string;
    createdAt: Date;
    updatedAt: Date;
    response?: string;
    actionBy?: string;
} 