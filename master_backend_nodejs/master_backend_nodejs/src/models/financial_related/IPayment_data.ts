// src/models/student_related/studentPaymentInterface.ts
export interface IPaymentData {
    id: number;
    date: string;
    amount: number;
    method: string;
}