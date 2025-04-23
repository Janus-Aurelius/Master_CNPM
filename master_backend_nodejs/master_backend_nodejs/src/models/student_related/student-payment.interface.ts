export type PaymentStatus = 
    | 'pending'
    | 'paid'
    | 'overdue';

export type PaymentMethod = 
    | 'bank_transfer'
    | 'credit_card';

export interface IPayment {
    id: string;
    studentId: string;
    amount: number;
    semester: string;
    academicYear: string;
    paymentDate: string;
    status: 'paid' | 'pending' | 'failed';
    method: 'cash' | 'banking';
}

export interface ITuitionInfo {
    id: string;
    studentId: string;
    semester: string;
    academicYear: string;
    dueDate: string;
    totalAmount: number;
    status: 'paid' | 'pending' | 'unpaid' | 'overdue';
    subjects: {
        subjectId: string;
        subjectName: string;
        credits: number;
        tuitionPerCredit: number;
        amount: number;
    }[];
} 