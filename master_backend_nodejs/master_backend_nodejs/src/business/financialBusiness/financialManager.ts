// src/business/financialBusiness/financialManager.ts
import { financialService } from '../../services/financialService/financialService';

// Dashboard
export const getDashboardData = async () => {
    try {
        // Lấy tổng hợp dữ liệu cho dashboard của phòng tài chính
        const totalStudents = await financialService.countTotalStudents();
        const paidStudents = await financialService.countStudentsByPaymentStatus('PAID');
        const partialStudents = await financialService.countStudentsByPaymentStatus('PARTIAL');
        const unpaidStudents = await financialService.countStudentsByPaymentStatus('UNPAID');
        
        const totalRevenue = await financialService.getTotalRevenue();
        const outstandingAmount = await financialService.getOutstandingAmount();
        
        return {
            studentCounts: {
                total: totalStudents,
                paid: paidStudents,
                partial: partialStudents,
                unpaid: unpaidStudents
            },
            financialSummary: {
                totalRevenue,
                outstandingAmount,
                collectionRate: totalStudents > 0 ? 
                    ((paidStudents + 0.5 * partialStudents) / totalStudents) * 100 : 0
            }
        };
    } catch (error) {
        console.error('Error in financial business layer:', error);
        throw error;
    }
};

// Payment Status Management
export const getAllPaymentStatus = async (filters: { 
    semester?: string, 
    faculty?: string, 
    course?: string 
}) => {
    try {
        return await financialService.getAllStudentPayments(filters);
    } catch (error) {
        console.error('Error getting all payment status:', error);
        throw error;
    }
};

export const getStudentPaymentStatus = async (studentId: string) => {
    try {
        return await financialService.getStudentPayment(studentId);
    } catch (error) {
        console.error('Error getting student payment status:', error);
        throw error;
    }
};

export const updatePaymentStatus = async (studentId: string, paymentData: {
    paymentStatus: string,
    amountPaid: number,
    semester: string
}) => {
    try {
        // Kiểm tra tính hợp lệ của dữ liệu
        if (!paymentData.paymentStatus || !paymentData.semester) {
            throw new Error('Missing required payment data');
        }
        
        // Cập nhật trạng thái thanh toán
        return await financialService.updateStudentPayment(studentId, paymentData);
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
};

// Tuition Adjustment
export const getTuitionSettings = async (semester: string) => {
    try {
        if (!semester) {
            throw new Error('Semester is required');
        }
        
        return await financialService.getTuitionSettings(semester);
    } catch (error) {
        console.error('Error getting tuition settings:', error);
        throw error;
    }
};

export const updateTuitionSettings = async (semester: string, settings: any) => {
    try {
        if (!semester || !settings) {
            throw new Error('Semester and settings are required');
        }
        
        return await financialService.updateTuitionSettings(semester, settings);
    } catch (error) {
        console.error('Error updating tuition settings:', error);
        throw error;
    }
};