export interface IPayment {
    id: number;
    studentId: string;
    courseId: number;
    amount: number;
    date: string;
    status: "paid" | "pending" | "failed";
    paymentMethod: "credit_card" | "bank_transfer" | "cash";
    transactionId?: string;
}