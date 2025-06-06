import { ITuitionRecord } from '../../models/student_related/studentTuitionPaymentInterface';
import { tuitionRecords } from '../studentService/studentTuitionPaymentService';

// Mock data cho financial department
const mockStudentPayments = [
    {
        studentId: "23524325",
        fullName: "Nguyễn Văn A",
        faculty: "Công nghệ thông tin",
        major: "Khoa học máy tính",
        course: "K18",
        paymentStatus: "PAID",
        semester: "HK1 2024-2025",
        totalAmount: 2100000,
        paidAmount: 2100000
    },
    {
        studentId: "22524234", 
        fullName: "Trần Thị B",
        faculty: "Công nghệ thông tin",
        major: "Kỹ thuật phần mềm",
        course: "K17",
        paymentStatus: "PARTIAL",
        semester: "HK1 2024-2025",
        totalAmount: 2100000,
        paidAmount: 1000000
    },
    {
        studentId: "23524324",
        fullName: "Lê Văn C", 
        faculty: "Cơ điện tử",
        major: "Cơ điện tử",
        course: "K17",
        paymentStatus: "UNPAID",
        semester: "HK1 2024-2025",
        totalAmount: 2100000,
        paidAmount: 0
    }
];

const mockTuitionSettings = {
    "HK1 2024-2025": {
        pricePerCredit: 150000,
        baseFee: 500000,
        laboratoryFee: 200000,
        libraryFee: 100000
    }
};

export const financialService = {
    // Dashboard functions
    async countTotalStudents(): Promise<number> {
        return mockStudentPayments.length;
    },

    async countStudentsByPaymentStatus(status: string): Promise<number> {
        return mockStudentPayments.filter(student => student.paymentStatus === status).length;
    },

    async getTotalRevenue(): Promise<number> {
        return mockStudentPayments.reduce((total, student) => total + student.paidAmount, 0);
    },

    async getOutstandingAmount(): Promise<number> {
        return mockStudentPayments.reduce((total, student) => 
            total + (student.totalAmount - student.paidAmount), 0);
    },

    // Payment Status Management
    async getAllStudentPayments(filters: { 
        semester?: string, 
        faculty?: string, 
        course?: string 
    }): Promise<any[]> {
        let filteredPayments = [...mockStudentPayments];
        
        if (filters.semester) {
            filteredPayments = filteredPayments.filter(p => p.semester === filters.semester);
        }
        if (filters.faculty) {
            filteredPayments = filteredPayments.filter(p => p.faculty === filters.faculty);
        }
        if (filters.course) {
            filteredPayments = filteredPayments.filter(p => p.course === filters.course);
        }
        
        return filteredPayments;
    },

    async getStudentPayment(studentId: string): Promise<any | null> {
        return mockStudentPayments.find(student => student.studentId === studentId) || null;
    },

    async updateStudentPayment(studentId: string, paymentData: {
        paymentStatus: string,
        amountPaid: number,
        semester: string
    }): Promise<boolean> {
        const studentIndex = mockStudentPayments.findIndex(student => student.studentId === studentId);
        if (studentIndex === -1) return false;
        
        mockStudentPayments[studentIndex] = {
            ...mockStudentPayments[studentIndex],
            paymentStatus: paymentData.paymentStatus,
            paidAmount: paymentData.amountPaid,
            semester: paymentData.semester
        };
        
        return true;
    },    // Tuition Settings Management
    async getTuitionSettings(semester: string): Promise<any> {
        return mockTuitionSettings[semester as keyof typeof mockTuitionSettings] || null;
    },

    async updateTuitionSettings(semester: string, settings: any): Promise<boolean> {
        (mockTuitionSettings as any)[semester] = settings;
        return true;
    },

    // Create tuition record for course registration
    async createTuitionRecord(tuitionData: {
        studentId: string;
        courseId: string;
        semester: string;
        amount: number;
        breakdown: Array<{ description: string; amount: number }>;
        dueDate: Date;
        status: string;
    }): Promise<{ id: string; success: boolean }> {
        const newRecord = {
            id: `TR_${Date.now()}_${tuitionData.studentId}`,
            studentId: tuitionData.studentId,
            courseId: tuitionData.courseId,
            semester: tuitionData.semester,
            totalAmount: tuitionData.amount,
            paidAmount: 0,
            remainingAmount: tuitionData.amount,
            status: tuitionData.status,
            dueDate: tuitionData.dueDate,
            breakdown: tuitionData.breakdown,
            createdAt: new Date()
        };

        // Add to tuitionRecords (mock storage)
        tuitionRecords.push(newRecord as any);
        
        return {
            id: newRecord.id,
            success: true
        };
    },

    // Existing function
    async getUnpaidTuitionReport(semester: string, year: string): Promise<{ studentId: string, remainingAmount: number }[]> {
        // Lọc các record chưa hoàn thành đóng học phí theo học kỳ/năm học
        const semesterQuery = `${semester} ${year}`;
        return tuitionRecords
            .filter(r => r.semester === semesterQuery && r.status !== 'PAID')
            .map(r => ({ studentId: r.studentId, remainingAmount: r.remainingAmount }));
    }
};