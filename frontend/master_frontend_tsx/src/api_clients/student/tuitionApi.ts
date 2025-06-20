import axiosInstance from '../axios';

// Interface cho môn học đã đăng ký
export interface EnrolledSubject {
    id: string;
    name: string;
    credits: number;
    tuition: number;
    courseType: string;
}

// Interface cho thông tin học phí theo kỳ
export interface TuitionRecord {
    id: string;
    semester: string;
    semesterName: string;
    year: string;
    dueDate: string;
    status: "paid" | "pending" | "unpaid" | "overdue";
    subjects: EnrolledSubject[];
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    registrationDate: string;
}

// Interface cho lịch sử thanh toán
export interface PaymentHistoryItem {
    paymentId: string;
    amount: number;
    date: string;
    semester: string;
}

// Interface cho yêu cầu thanh toán
export interface PaymentRequest {
    semesterId: string;
    amount: number;
    paymentMethod: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}

export const tuitionApi = {
    // Lấy tình trạng học phí của sinh viên cho tất cả các kỳ
    getTuitionStatus: async (studentId: string): Promise<TuitionRecord[]> => {
        try {
            console.log('💰 [tuitionApi] Getting tuition status for student:', studentId);
            
            const response = await axiosInstance.get<ApiResponse<TuitionRecord[]>>('/student/tuition/status', {
                params: { studentId }
            });
            
            console.log('✅ [tuitionApi] Tuition status response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to fetch tuition status');
            }
            
            return response.data.data || [];
        } catch (error: any) {
            console.error('❌ [tuitionApi] Error fetching tuition status:', error);
            throw new Error(error.response?.data?.message || error.message || 'Không thể tải thông tin học phí');
        }
    },

    // Lấy lịch sử thanh toán của sinh viên
    getPaymentHistory: async (studentId: string): Promise<PaymentHistoryItem[]> => {
        try {
            console.log('📋 [tuitionApi] Getting payment history for student:', studentId);
            
            const response = await axiosInstance.get<ApiResponse<PaymentHistoryItem[]>>('/student/tuition/history', {
                params: { studentId }
            });
            
            console.log('✅ [tuitionApi] Payment history response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to fetch payment history');
            }
            
            return response.data.data || [];
        } catch (error: any) {
            console.error('❌ [tuitionApi] Error fetching payment history:', error);
            throw new Error(error.response?.data?.message || error.message || 'Không thể tải lịch sử thanh toán');
        }
    },

    // Thực hiện thanh toán học phí
    makePayment: async (studentId: string, paymentData: PaymentRequest): Promise<{ success: boolean; message: string }> => {
        try {
            console.log('💳 [tuitionApi] Making payment for student:', studentId, paymentData);
            
            const response = await axiosInstance.post<ApiResponse<any>>('/student/tuition/payment', {
                studentId,
                ...paymentData
            });
            
            console.log('✅ [tuitionApi] Payment response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Payment failed');
            }
            
            return {
                success: true,
                message: response.data.message || 'Thanh toán thành công'
            };
        } catch (error: any) {
            console.error('❌ [tuitionApi] Error making payment:', error);
            throw new Error(error.response?.data?.message || error.message || 'Thanh toán thất bại');
        }
    },

    // Lấy chi tiết học phí cho một kỳ học cụ thể
    getTuitionDetails: async (studentId: string, semesterId: string): Promise<TuitionRecord | null> => {
        try {
            console.log('🔍 [tuitionApi] Getting tuition details for student:', studentId, 'semester:', semesterId);
            
            const response = await axiosInstance.get<ApiResponse<TuitionRecord>>('/student/tuition/details', {
                params: { studentId, semesterId }
            });
            
            console.log('✅ [tuitionApi] Tuition details response:', response.data);
            
            if (!response.data || !response.data.success) {
                return null;
            }
            
            return response.data.data;
        } catch (error: any) {
            console.error('❌ [tuitionApi] Error fetching tuition details:', error);
            return null;
        }
    }
};

// Helper functions
export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
};

export const getStatusText = (status: string): string => {
    switch (status) {
        case 'paid':
            return 'Đã nộp';
        case 'pending':
            return 'Chờ xử lý';
        case 'unpaid':
            return 'Chưa nộp';
        case 'overdue':
            return 'Quá hạn';
        default:
            return 'Không xác định';
    }
};

export const getStatusChipColor = (status: string): { bg: string; text: string } => {
    switch (status) {
        case "paid":
            return { bg: "#d9fade", text: "#4caf50" };
        case "pending":
            return { bg: "#fff8e1", text: "#f57c00" };
        case "unpaid":
            return { bg: "#ffebee", text: "#ef5350" };
        case "overdue":
            return { bg: "#ffcdd2", text: "#d32f2f" };
        default:
            return { bg: "#e0e0e0", text: "#616161" };
    }
};

export default tuitionApi;
