import { ITuitionRecord, ITuitionPaymentReceipt, TuitionCourseItem } from '../../models/student_related/studentTuitionPaymentInterface';

// TODO: Thay thế bằng thao tác database thực tế
const tuitionRecords: ITuitionRecord[] = [];
const paymentReceipts: ITuitionPaymentReceipt[] = [];
export { tuitionRecords, paymentReceipts };

export const studentTuitionPaymentService = {
    // Tạo phiếu học phí mới khi xác nhận đăng ký
    async createTuitionRecord(studentId: string, semester: string, courses: TuitionCourseItem[]): Promise<ITuitionRecord> {
        const totalAmount = courses.reduce((sum, c) => sum + c.price, 0);
        const newRecord: ITuitionRecord = {
            id: Math.random().toString(36).substr(2, 9),
            studentId,
            semester,
            totalAmount,
            paidAmount: 0,
            remainingAmount: totalAmount,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            courses
        };
        tuitionRecords.push(newRecord);
        return newRecord;
    },

    // Đóng học phí (có thể đóng thiếu, đủ, dư)
    async payTuition(tuitionRecordId: string, amount: number): Promise<{ record: ITuitionRecord, receipt: ITuitionPaymentReceipt }> {
        if (typeof amount !== 'number' || amount < 0) throw new Error('Invalid payment amount');
        const record = tuitionRecords.find(r => r.id === tuitionRecordId);
        if (!record) throw new Error('Tuition record not found');
        record.paidAmount += amount;
        record.remainingAmount = record.totalAmount - record.paidAmount;
        let status: ITuitionRecord['status'] = 'PENDING';
        if (record.paidAmount === record.totalAmount) status = 'PAID';
        else if (record.paidAmount > record.totalAmount) status = 'OVERPAID';
        else if (record.paidAmount > 0) status = 'PARTIAL';
        record.status = status;
        record.updatedAt = new Date().toISOString();
        const receipt: ITuitionPaymentReceipt = {
            id: Math.random().toString(36).substr(2, 9),
            tuitionRecordId: record.id,
            amount,
            paymentDate: new Date().toISOString(),
            status: 'SUCCESS'
        };
        paymentReceipts.push(receipt);
        return { record, receipt };
    },

    // Chỉnh sửa đăng ký (thêm/xóa môn học)
    async editRegistration(tuitionRecordId: string, newCourses: TuitionCourseItem[]): Promise<ITuitionRecord> {
        const record = tuitionRecords.find(r => r.id === tuitionRecordId);
        if (!record) throw new Error('Tuition record not found');
        record.courses = newCourses;
        record.totalAmount = newCourses.reduce((sum, c) => sum + c.price, 0);
        record.remainingAmount = record.totalAmount - record.paidAmount;
        // Cập nhật lại trạng thái
        let status: ITuitionRecord['status'] = 'PENDING';
        if (record.paidAmount === record.totalAmount) status = 'PAID';
        else if (record.paidAmount > record.totalAmount) status = 'OVERPAID';
        else if (record.paidAmount > 0) status = 'PARTIAL';
        record.status = status;
        record.updatedAt = new Date().toISOString();
        return record;
    },

    // Lấy phiếu học phí theo studentId
    async getTuitionRecordsByStudent(studentId: string): Promise<ITuitionRecord[]> {
        return tuitionRecords.filter(r => r.studentId === studentId);
    },

    // Lấy lịch sử phiếu thu
    async getPaymentReceiptsByRecord(tuitionRecordId: string): Promise<ITuitionPaymentReceipt[]> {
        return paymentReceipts.filter(r => r.tuitionRecordId === tuitionRecordId);
    }
};

