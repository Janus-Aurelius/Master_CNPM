import axiosInstance from '../axios';

// Interface cho API response
interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

// Interfaces cho dashboard API
export interface TimetableEntry {
    courseId: string;
    courseName: string;
    lecturer: string;
    credits: number;
    dayOfWeek: number; // 2 = Thứ 2, 3 = Thứ 3, etc.
    startPeriod: number;
    endPeriod: number;
    room?: string;
    startDate?: string;
    endDate?: string;
}

export interface StudentScheduleResponse {
    success: boolean;
    message: string;
    data: {
        student: {
            studentId: string;
            name: string;
            major: string;
            majorName: string;
        };
        semester: string;
        courses: TimetableEntry[];
    };
}

// Add request interceptor to add token and debug info
axiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('🔐 Dashboard API - Token:', token ? 'Present' : 'Missing');
    console.log('👤 Dashboard API - User:', user);
    console.log('📡 Dashboard API - URL:', config.url);
    
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Thêm studentId vào params nếu user có studentId hoặc id
    const studentId = user.studentId || user.id;
    if (studentId && !config.params?.studentId) {
        config.params = config.params || {};
        config.params.studentId = studentId;
        console.log('🎓 Added studentId to dashboard request:', studentId);
    }
    
    return config;
}, (error) => {
    console.error('❌ Dashboard API interceptor error:', error);
    return Promise.reject(error);
});

export const dashboardApi = {    // Lấy thời khóa biểu của sinh viên
    getStudentTimetable: async (semester?: string): Promise<TimetableEntry[]> => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('📅 Getting student timetable for:', user.studentId, 'semester:', semester || 'current (from backend)');
            
            if (!user.studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên');
            }            const params: any = { studentId: user.studentId };
            if (semester) {
                params.semester = semester;
            }
            
            const response = await axiosInstance.get<StudentScheduleResponse>('/student/timetable', { params });
            
            console.log('✅ Timetable response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Không thể tải thời khóa biểu');
            }
            
            return response.data.data.courses || [];
        } catch (error: any) {
            console.error('❌ Error fetching student timetable:', error);
            console.error('❌ Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url
            });
            
            // Return empty array instead of throwing to prevent cascade failures
            console.log('🔄 Returning empty timetable as fallback');
            return [];
        }
    },

    // Lấy thông tin tổng quan sinh viên
    getStudentOverview: async (): Promise<any> => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('📊 Getting student overview for:', user.studentId);
            
            if (!user.studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên');
            }
            
            const response = await axiosInstance.get('/student/overview', {
                params: { 
                    studentId: user.studentId
                }
            });
              console.log('✅ Overview response:', response.data);
            
            const apiResponse = response.data as ApiResponse<any>;
            if (!apiResponse || !apiResponse.success) {
                throw new Error(apiResponse?.message || 'Không thể tải thông tin tổng quan');
            }
            
            return apiResponse.data;
        } catch (error: any) {
            console.error('❌ Error fetching student overview:', error);
            throw new Error(error.response?.data?.message || error.message || 'Không thể tải thông tin tổng quan');
        }
    }
};

// Helper function để convert dayOfWeek number thành text
export const getDayText = (dayOfWeek: number): string => {
    const days = {
        2: 'Thứ 2',
        3: 'Thứ 3', 
        4: 'Thứ 4',
        5: 'Thứ 5',
        6: 'Thứ 6',
        7: 'Thứ 7',
        8: 'Chủ nhật'
    };
    return days[dayOfWeek as keyof typeof days] || `Thứ ${dayOfWeek}`;
};

// Helper function để format tiết học
export const formatPeriod = (startPeriod: number, endPeriod: number): string => {
    return `Tiết ${startPeriod}-${endPeriod}`;
};

// Helper function để convert TimetableEntry thành TimetableSubject
export const convertToTimetableSubject = (entry: TimetableEntry) => {
    // Parse session từ startPeriod để có format phù hợp với grid
    const session = entry.startPeriod.toString();
    
    return {
        id: entry.courseId,
        name: entry.courseName,
        day: getDayText(entry.dayOfWeek),
        session: session,
        fromTo: formatPeriod(entry.startPeriod, entry.endPeriod),
        credits: entry.credits
    };
};

export default dashboardApi;
