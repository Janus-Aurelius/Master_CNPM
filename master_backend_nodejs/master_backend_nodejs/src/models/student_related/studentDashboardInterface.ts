import { IPayment } from '../payment';
import { IStudent } from './studentInterface';
import { IOfferedCourse } from '../academic_related/openCourse';

export interface IStudentOverview {
    student: IStudent;
    enrolledCourses: number;
    totalCredits: number;
    gpa: number;
    availableOpenCourses: IOfferedCourse[];
    recentPayments: IPayment[];
}

export interface IFinancialReport {
    studentId: string;
    semester: string;    totalTuition: number;
    paidAmount: number;
    remainingAmount: number;
    paymentHistory: IPayment[];
}