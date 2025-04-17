import { ITuitionInfo, IPayment } from '../../models/student_related/student-payment.interface';

class TuitionService {
    public async getTuitionInfo(studentId: string, semester: string): Promise<ITuitionInfo> {
        // Mock data for demonstration
        return {
            id: "TUI001",
            studentId: studentId,
            semester: semester,
            academicYear: "2023-2024",
            dueDate: "2024-04-30",
            totalAmount: 8250000,
            status: "unpaid",
            subjects: [
                {
                    subjectId: "CS101",
                    subjectName: "Lập trình web nâng cao",
                    credits: 3,
                    tuitionPerCredit: 850000,
                    amount: 2550000
                },
                {
                    subjectId: "CS102",
                    subjectName: "Công nghệ phần mềm",
                    credits: 4,
                    tuitionPerCredit: 850000,
                    amount: 3400000
                },
                {
                    subjectId: "CS103",
                    subjectName: "Phân tích thiết kế HTTT",
                    credits: 3,
                    tuitionPerCredit: 850000,
                    amount: 2300000
                }
            ]
        };
    }

    public async getPaymentHistory(studentId: string): Promise<IPayment[]> {
        // Mock data for demonstration
        return [
            {
                id: "PAY001",
                studentId: studentId,
                amount: 8250000,
                semester: "HK2",
                academicYear: "2023-2024",
                paymentDate: "2024-02-15",
                status: "paid",
                method: "banking"
            },
            {
                id: "PAY002",
                studentId: studentId,
                amount: 7650000,
                semester: "HK1",
                academicYear: "2023-2024",
                paymentDate: "2023-09-15",
                status: "paid",
                method: "banking"
            }
        ];
    }
}

export default new TuitionService(); 