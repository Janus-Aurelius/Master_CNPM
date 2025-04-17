import { ITuitionInfo, IPayment } from '../../models/student_related/student-payment.interface';
import tuitionService from '../../services/studentServices/TuitionService';

class TuitionFeeManager {
    public async getTuitionInfo(studentId: string, semester: string): Promise<ITuitionInfo | null> {
        try {
            const tuitionInfo = await tuitionService.getTuitionInfo(studentId, semester);
            
            // Validate student ID format
            if (!studentId.match(/^[0-9]{8}$/)) {
                return null;
            }

            // Tính lại tổng học phí từ các môn học
            let calculatedTotal = 0;
            tuitionInfo.subjects.forEach(subject => {
                calculatedTotal += subject.credits * subject.tuitionPerCredit;
            });

            // Kiểm tra và cập nhật tổng tiền nếu cần
            if (calculatedTotal !== tuitionInfo.totalAmount) {
                tuitionInfo.totalAmount = calculatedTotal;
            }

            // Kiểm tra trạng thái học phí dựa vào ngày hết hạn
            const currentDate = new Date();
            const dueDate = new Date(tuitionInfo.dueDate);
            
            if (tuitionInfo.status === 'unpaid' && currentDate > dueDate) {
                tuitionInfo.status = 'overdue';
            }

            return tuitionInfo;
        } catch (error) {
            throw new Error('Failed to get tuition information');
        }
    }

    public async getPaymentHistory(studentId: string): Promise<IPayment[]> {
        try {
            const payments = await tuitionService.getPaymentHistory(studentId);
            
            // Sắp xếp lịch sử thanh toán theo thời gian mới nhất
            return payments.sort((a, b) => {
                const dateA = new Date(a.paymentDate);
                const dateB = new Date(b.paymentDate);
                return dateB.getTime() - dateA.getTime();
            });
        } catch (error) {
            throw new Error('Failed to get payment history');
        }
    }

    public calculateTotalTuition(subjects: ITuitionInfo['subjects']): number {
        return subjects.reduce((total, subject) => {
            return total + (subject.credits * subject.tuitionPerCredit);
        }, 0);
    }
}

export default new TuitionFeeManager(); 