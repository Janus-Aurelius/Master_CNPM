export interface IPayment {
    // Schema fields (mapped to Vietnamese database fields)
    paymentId: string;          // maPhieuThu
    paymentDate: Date;          // ngayLap
    registrationId: string;     // maPhieuDangKy
    paymentAmount: number;      // soTienDong

    // Additional UI fields
    studentId?: string;
    courseId?: number;
    status?: "paid" | "pending" | "failed";
    paymentMethod?: "credit_card" | "bank_transfer" | "cash";
    transactionId?: string;
}