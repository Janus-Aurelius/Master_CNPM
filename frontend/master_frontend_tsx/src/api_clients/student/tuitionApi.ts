import axiosInstance from '../axios';

// Interface cho môn học đã đăng ký
export interface EnrolledSubject {
    courseId: string;
    courseName: string;
    credits: number;
    totalPeriods: number;
    periodsPerCredit: number;
    pricePerCredit: number;
    totalFee: number;
    courseType: string;
}

// Interface cho thông tin học phí theo kỳ
export interface TuitionRecord {
    id: string;                     // registrationId
    semester: string;               // semesterId
    semesterName: string;           // semesterName
    year: string;                   // year
    dueDate: string;               // dueDate
    status: "paid" | "unpaid" | "not_opened";
    subjects: EnrolledSubject[];    // courses from backend
    originalAmount: number;         // registrationAmount (trước ưu tiên)
    totalAmount: number;            // requiredAmount (sau ưu tiên)
    paidAmount: number;             // paidAmount
    remainingAmount: number;        // remainingAmount    registrationDate: string;       // registrationDate
    discountInfo?: {                // discount information
        type: string;
        percentage: number;
        amount: number;
        code?: string;               // mã ưu tiên
    };
}

// Interface cho lịch sử thanh toán
export interface PaymentHistoryItem {
    paymentId: string;
    amount: number;
    paymentDate: string;  // Đổi từ 'date' thành 'paymentDate' để khớp với backend
    semester: string;
    registrationId?: string; // Thêm field này để filter
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

// Helper function to map old status to simplified 3-state system
const mapToSimplifiedStatus = (status: string): "paid" | "unpaid" | "not_opened" => {
    switch (status) {
        case 'paid':
            return 'paid';
        case 'partial':
        case 'pending':
        case 'overdue':
        case 'unpaid':
            return 'unpaid';
        case 'not_opened':
            return 'not_opened';
        default:
            return 'unpaid';
    }
};

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
            
            const registeredSemesters = response.data.data || [];
            
            // Định nghĩa tất cả các kỳ từ HK1_2023 đến hiện tại và tương lai
            const allSemesters = [
                { id: 'HK1_2027', name: 'HK1_2027', year: '2027', status: 'not_opened' },
                { id: 'HK2_2026', name: 'HK2_2026', year: '2026', status: 'not_opened' },
                { id: 'HK1_2026', name: 'HK1_2026', year: '2026', status: 'not_opened' },
                { id: 'HK2_2025', name: 'HK2_2025', year: '2025', status: 'not_opened' },
                { id: 'HK1_2025', name: 'HK1_2025', year: '2025', status: 'not_opened' },
                { id: 'HK2_2024', name: 'HK2_2024', year: '2024', status: 'not_opened' },
                { id: 'HK1_2024', name: 'HK1_2024', year: '2024', status: 'unpaid' },
                { id: 'HK2_2023', name: 'HK2_2023', year: '2023', status: 'unpaid' },
                { id: 'HK1_2023', name: 'HK1_2023', year: '2023', status: 'unpaid' }
            ];              // Tạo map của các kỳ đã đăng ký
            const registeredMap = new Map();
            registeredSemesters.forEach((reg: any) => {
                registeredMap.set(reg.semester || reg.id, reg);
            });
            
            // Tạo danh sách kết hợp
            const combinedSemesters = allSemesters.map(semester => {
                const registered = registeredMap.get(semester.id);
                  if (registered) {
                    // Kỳ đã đăng ký - sử dụng dữ liệu thực
                    return {
                        id: registered.registrationId || semester.id,
                        semester: semester.id,
                        semesterName: semester.name,
                        year: semester.year,
                        dueDate: registered.dueDate || '',
                        status: mapToSimplifiedStatus(registered.status || 'unpaid'),
                        subjects: registered.courses?.map((course: any) => ({
                            courseId: course.courseId,
                            courseName: course.courseName,
                            credits: course.credits,
                            totalPeriods: course.totalPeriods,
                            periodsPerCredit: course.periodsPerCredit,
                            pricePerCredit: course.pricePerCredit,
                            totalFee: course.totalFee,
                            courseType: course.courseType
                        })) || [],
                        originalAmount: registered.originalAmount || 0,
                        totalAmount: registered.totalAmount || 0,
                        paidAmount: registered.paidAmount || 0,
                        remainingAmount: registered.remainingAmount || 0,
                        registrationDate: registered.registrationDate || '',                        discountInfo: registered.discount ? {
                            type: registered.discount.type,
                            percentage: registered.discount.percentage,
                            amount: registered.discount.amount,
                            code: registered.discount.code
                        } : undefined
                    };
                } else {
                    // Kỳ chưa mở - tạo dữ liệu placeholder
                    const isNotOpened = ['HK2_2024', 'HK1_2025', 'HK2_2025', 'HK1_2026', 'HK2_2026', 'HK1_2027'].includes(semester.id);
                    
                    return {
                        id: semester.id,
                        semester: semester.id,
                        semesterName: semester.name,
                        year: semester.year,
                        dueDate: '',
                        status: isNotOpened ? 'not_opened' as const : 'unpaid' as const,
                        subjects: [],
                        originalAmount: 0,
                        totalAmount: 0,
                        paidAmount: 0,
                        remainingAmount: 0,
                        registrationDate: '',
                        discountInfo: undefined
                    };
                }
            });
            
            console.log('📊 [tuitionApi] Combined semesters:', combinedSemesters);
            return combinedSemesters;
            
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
            return 'Đã nộp đủ';
        case 'unpaid':
            return 'Chưa nộp đủ';
        case 'not_opened':
            return 'Chưa mở kỳ';
        default:
            return 'Không xác định';
    }
};

export const getStatusChipColor = (status: string): { bg: string; text: string } => {
    switch (status) {
        case "paid":
            return { bg: "#d9fade", text: "#4caf50" };
        case "unpaid":
            return { bg: "#ffebee", text: "#ef5350" };
        case "not_opened":
            return { bg: "#f3e5f5", text: "#7b1fa2" };
        default:
            return { bg: "#e0e0e0", text: "#616161" };
    }
};

export default tuitionApi;
