import { studentTuitionPaymentService } from '../../services/studentService/studentTuitionPaymentService';
import { TuitionCourseItem, ITuitionRecord } from '../../models/student_related/studentPaymentInterface';

export const tuitionPaymentManager = {
    // Xác nhận đăng ký, tạo phiếu học phí
    async confirmRegistration(studentId: string, semester: string, courses: TuitionCourseItem[]) {
        // Gọi service tạo phiếu học phí
        return studentTuitionPaymentService.createTuitionRecord(studentId, semester, courses);
    },
    // Đóng học phí
    async payTuition(tuitionRecordId: string, amount: number) {
        return studentTuitionPaymentService.payTuition(tuitionRecordId, amount);
    },
    // Chỉnh sửa đăng ký
    async editRegistration(tuitionRecordId: string, newCourses: TuitionCourseItem[]) {
        return studentTuitionPaymentService.editRegistration(tuitionRecordId, newCourses);
    },
    // Lấy danh sách phiếu học phí của sinh viên
    async getTuitionRecordsByStudent(studentId: string) {
        return studentTuitionPaymentService.getTuitionRecordsByStudent(studentId);
    },
    // Lấy lịch sử phiếu thu
    async getPaymentReceiptsByRecord(tuitionRecordId: string) {
        return studentTuitionPaymentService.getPaymentReceiptsByRecord(tuitionRecordId);
    }
}; 