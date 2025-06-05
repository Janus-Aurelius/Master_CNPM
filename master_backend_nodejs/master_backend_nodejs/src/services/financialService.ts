import { ITuitionRecord } from '../models/student_related/studentTuitionPaymentInterface';
import { tuitionRecords } from './studentServices/studentTuitionPaymentService';

export const financialService = {
    async getUnpaidTuitionReport(semester: string, year: string): Promise<{ studentId: string, remainingAmount: number }[]> {
        // Lọc các record chưa hoàn thành đóng học phí theo học kỳ/năm học
        // TODO: Thay bằng truy vấn DB thực tế
        return tuitionRecords
            .filter(r => r.semester === semester && r.status !== 'PAID')
            .map(r => ({ studentId: r.studentId, remainingAmount: r.remainingAmount }));
    }
}; 