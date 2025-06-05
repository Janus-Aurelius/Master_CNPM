// Interface cho record học phí
export interface ITuitionRecord {
    id: string; // Mã phiếu học phí
    studentId: string; // Mã sinh viên
    semester: string; // Học kỳ
    totalAmount: number; // Tổng số tiền phải đóng
    paidAmount: number; // Tổng số tiền đã đóng
    remainingAmount: number; // Số tiền còn lại
    status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERPAID'; // Trạng thái thanh toán
    createdAt: string;
    updatedAt: string;
    courses: TuitionCourseItem[]; // Danh sách môn học đã đăng ký
}

// Interface cho từng môn học trong phiếu học phí
export interface TuitionCourseItem {
    courseId: string;
    courseName: string;
    credits: number;
    price: number;
}

// Interface cho phiếu thu học phí
export interface ITuitionPaymentReceipt {
    id: string; // Mã phiếu thu
    tuitionRecordId: string; // Liên kết tới phiếu học phí
    amount: number; // Số tiền đóng lần này
    paymentDate: string;
    status: 'SUCCESS' | 'FAILED';
} 