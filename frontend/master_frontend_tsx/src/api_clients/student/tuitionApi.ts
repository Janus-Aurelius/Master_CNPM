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
            
            console.log('📊 [tuitionApi] Raw data from backend:', registeredSemesters);
            
            // Thêm logging chi tiết cho từng record trước khi mapping
            registeredSemesters.forEach((record: any, index: number) => {
                console.log(`🔍 [tuitionApi] Raw record ${index + 1} from backend:`, {
                    registrationId: record.registrationId,
                    semester: record.semester,
                    semesterName: record.semesterName,
                    originalAmount: record.originalAmount,
                    totalAmount: record.totalAmount,
                    paidAmount: record.paidAmount,
                    remainingAmount: record.remainingAmount,
                    status: record.status,
                    // Log toàn bộ object để debug
                    fullRecord: record
                });
            });
            
            // Chỉ trả về các kỳ đã đăng ký (có registered)
            const combinedSemesters = registeredSemesters.map((registered: any, index: number) => {
                // Sử dụng remainingAmount từ backend thay vì tính toán lại
                const remainingAmount = Number(registered.remainingAmount) || 0;
                const paidAmount = Number(registered.paidAmount) || 0;
                const totalAmount = Number(registered.totalAmount) || 0;
                
                // Sử dụng status từ backend nếu có, nếu không thì tính toán
                let status: "paid" | "unpaid" = "unpaid";
                if (registered.status === "paid" || remainingAmount <= 0) {
                    status = "paid";
                } else {
                    status = "unpaid";
                }
                
                console.log(`📊 [tuitionApi] Mapping semester ${index + 1}:`, {
                    registrationId: registered.registrationId,
                    semester: registered.semester,
                    semesterName: registered.semesterName,
                    originalAmount: registered.originalAmount,
                    totalAmount: totalAmount,
                    paidAmount: paidAmount,
                    remainingAmount: remainingAmount,
                    calculatedStatus: status,
                    backendStatus: registered.status,
                    // Thêm log chi tiết hơn
                    rawRemainingAmount: registered.remainingAmount,
                    rawPaidAmount: registered.paidAmount,
                    rawTotalAmount: registered.totalAmount,
                    // Thêm toàn bộ dữ liệu raw từ backend
                    rawData: registered
                });
                
                return {
                    id: registered.registrationId || registered.semester || registered.id,
                    semester: registered.semester || registered.id,
                    semesterName: registered.semesterName || registered.semester || registered.id,
                    year: registered.year,
                    dueDate: registered.dueDate || '',
                    status,
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
                    totalAmount: totalAmount,
                    paidAmount: paidAmount,
                    remainingAmount: remainingAmount,
                    registrationDate: registered.registrationDate || '',
                    discountInfo: registered.discount ? {
                        type: registered.discount.type,
                        percentage: registered.discount.percentage,
                        amount: registered.discount.amount,
                        code: registered.discount.code
                    } : undefined
                };
            });
            
            console.log('📊 [tuitionApi] Final mapped data:', combinedSemesters);
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
