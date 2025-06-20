import axiosInstance from '../axios';

// Interface cho môn học đã đăng ký
export interface EnrolledSubjectData {
    id: string;
    name: string;
    lecturer: string;
    day: string;
    fromTo: string;
    credits: number;
    courseType: string;
    fee?: number;
    registrationId?: string;
    maxStudents?: number;
    currentStudents?: number;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Add request interceptor to add token and debug info
axiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('🔐 EnrolledSubject Request interceptor - Token:', token ? 'Present' : 'Missing');
    console.log('👤 EnrolledSubject Request interceptor - User:', user);
    console.log('📡 EnrolledSubject Request interceptor - URL:', config.url);
    
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Thêm studentId vào params nếu user có studentId hoặc id
    const studentId = user.studentId || user.id;
    if (studentId && !config.params?.studentId) {
        config.params = config.params || {};
        config.params.studentId = studentId;
        console.log('🎓 Added studentId to request:', studentId);
    }
    
    return config;
}, (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
});

export const enrolledSubjectApi = {
    // Lấy danh sách môn học đã đăng ký cho sinh viên cụ thể
    getEnrolledSubjects: async (semester: string = 'HK1_2024'): Promise<EnrolledSubjectData[]> => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('📋 Getting enrolled subjects for student:', user.studentId || user.id);
            console.log('📅 Semester:', semester);
            
            const studentId = user.studentId || user.id;
            if (!studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.');
            }
            
            const response = await axiosInstance.get<ApiResponse<any[]>>('/student/enrolled-courses', {
                params: { 
                    semester,
                    studentId: studentId  // Đảm bảo gửi studentId
                }
            });
            console.log('✅ Enrolled subjects response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to fetch enrolled subjects');
            }
            
            // Mapping từ backend course sang frontend subject
            const enrolledCourses = response.data.data || [];
            console.log('📋 Raw enrolled courses from backend:', enrolledCourses);
            
            const mappedSubjects = enrolledCourses.map((course: any): EnrolledSubjectData => ({
                id: course.courseId,
                name: course.courseName,
                lecturer: course.lecturer || 'Chưa xác định',
                day: course.day || 'Chưa xác định',
                fromTo: course.fromTo || 'Chưa xác định',
                credits: course.credits,
                maxStudents: 0, // Không có thông tin này từ enrolled courses
                currentStudents: 0, // Không có thông tin này từ enrolled courses
                courseType: course.courseType,
                fee: course.fee || 0,
                registrationId: course.registrationId
            }));
            
            console.log('📋 Mapped enrolled subjects:', mappedSubjects);
            return mappedSubjects;
        } catch (error: any) {
            console.error('❌ Error fetching enrolled subjects:', error);
            throw new Error(error.response?.data?.message || error.message || 'Không thể tải danh sách môn học đã đăng ký');
        }
    },

    // Hủy đăng ký môn học cho sinh viên cụ thể
    unenrollSubject: async (courseId: string): Promise<{ success: boolean; message: string }> => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const studentId = user.studentId || user.id;
            console.log('❌ Unenrolling subject for student:', studentId);
            console.log('📚 Course ID:', courseId);
            
            if (!studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.');
            }
            
            const response = await axiosInstance.post<ApiResponse<any>>('/student/enrolled-courses/cancel', {
                courseId,
                studentId: studentId  // Đảm bảo gửi studentId
            });
            console.log('✅ Unenroll subject response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to unenroll subject');
            }
            
            return { 
                success: true, 
                message: response.data.message || 'Hủy đăng ký môn học thành công!' 
            };
        } catch (error: any) {
            console.error('❌ Error unenrolling subject:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Hủy đăng ký môn học thất bại';
            
            return {
                success: false,
                message: errorMessage
            };
        }
    }
};

// Export individual functions for easier import
export const getEnrolledSubjects = enrolledSubjectApi.getEnrolledSubjects;
export const unenrollSubject = enrolledSubjectApi.unenrollSubject;

// Default export
export default enrolledSubjectApi;
