import axiosInstance from '../axios';
import { Subject } from '../../types';

// Add request interceptor to add token and debug info
axiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('🔐 Request interceptor - Token:', token ? 'Present' : 'Missing');
    console.log('👤 Request interceptor - User:', user);
    console.log('📡 Request interceptor - URL:', config.url);
    
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

// Backend Course interfaces (từ API response)
export interface AvailableCourse {
    semesterId: string;
    courseId: string;
    courseName: string;
    credits: number;
    courseType: string;
    feePerCredit: number;
}

export interface EnrolledCourse {
    registrationId: string;
    courseId: string;
    courseName: string;
    credits: number;
    courseType: string;
    fee: number;
}

// Extended Subject interfaces cho frontend (bổ sung các field cần thiết)
export interface AvailableSubject extends Subject {
    feePerCredit?: number;
    courseType?: string;
    semesterId?: string;
    fee?: number;
    schedule?: string;
    currentEnrollment?: number;
    isRecommended?: boolean;
}

export interface EnrolledSubjectData extends Subject {
    registrationId?: string;
    fee?: number;
    courseType?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}

// Helper function để mapping từ backend course sang frontend subject
const mapCourseToSubject = (course: any): AvailableSubject => {
    return {
        id: course.courseId,
        name: course.courseName,
        lecturer: 'Chưa có thông tin', // Chưa có từ backend
        day: `Thứ ${course.dayOfWeek || 'N/A'}`,
        fromTo: `tiết ${course.startPeriod || 'N/A'}-${course.endPeriod || 'N/A'}`,
        credits: course.credits || 0,
        maxStudents: course.maxStudents || 0,
        currentStudents: course.currentEnrollment || 0,
        feePerCredit: course.feePerCredit,
        courseType: course.courseType || 'Chưa xác định',
        semesterId: course.semesterId,
        fee: course.fee || 0,
        schedule: `Thứ ${course.dayOfWeek || 'N/A'}: tiết ${course.startPeriod || 'N/A'}-${course.endPeriod || 'N/A'}`,
        currentEnrollment: course.currentEnrollment || 0,
        isRecommended: course.isRecommended || false
    };
};

export const enrollmentApi = {
    // Lấy danh sách môn học có thể đăng ký cho sinh viên cụ thể
    getAvailableSubjects: async (semester?: string): Promise<AvailableSubject[]> => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('🔍 Getting available subjects for student:', user.studentId);
            console.log('📅 Semester:', semester || 'current (from backend)');
            console.log('🔗 Making request to:', '/student/subjects');
            
            if (!user.studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.');
            }

            const params: any = { studentId: user.studentId };
            if (semester) {
                params.semester = semester;
            }

            const response = await axiosInstance.get<ApiResponse<any[]>>('/student/subjects', { params });
            console.log('✅ Available subjects response:', response.data);
            
            if (!response.data || !response.data.success) {
                console.error('❌ API response not successful:', response.data);
                throw new Error(response.data?.message || 'Failed to fetch available subjects');
            }
            
            // Mapping từ backend course sang frontend subject
            const courses = response.data.data || [];
            console.log('📋 Raw courses from backend:', courses);
            const mappedSubjects = courses.map(mapCourseToSubject);
            console.log('📋 Mapped subjects for frontend:', mappedSubjects);
            return mappedSubjects;        } catch (error: any) {
            console.error('❌ Error fetching available subjects:', error);
            console.error('❌ Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText,
                url: error.config?.url
            });
            
            // Return empty array instead of throwing to prevent cascade failures
            console.log('🔄 Returning empty subjects array as fallback');
            return [];
        }
    },    // Tìm kiếm môn học
    searchSubjects: async (query: string, semester?: string): Promise<AvailableSubject[]> => {
        try {
            const params: any = { query };
            if (semester) {
                params.semester = semester;
            }
            
            const response = await axiosInstance.get<ApiResponse<any[]>>('/student/subjects/search', { params });
            console.log('Search subjects response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to search subjects');
            }
            
            // Mapping từ backend course sang frontend subject
            const courses = response.data.data || [];
            return courses.map(mapCourseToSubject);
        } catch (error) {
            console.error('Error searching subjects:', error);
            return [];
        }
    },    // Đăng ký môn học cho sinh viên cụ thể
    registerSubject: async (courseId: string, semester?: string): Promise<{ success: boolean; message: string }> => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('📝 Registering subject for student:', user.studentId);
            console.log('📚 Course ID:', courseId);
            
            if (!user.studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.');
            }
            
            const requestBody: any = {
                courseId,
                studentId: user.studentId
            };
            if (semester) {
                requestBody.semester = semester;
            }
            
            const response = await axiosInstance.post<ApiResponse<any>>('/student/subjects/register', requestBody);
            console.log('✅ Register subject response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to register subject');
            }
            
            return { 
                success: true, 
                message: response.data.message || 'Đăng ký môn học thành công!' 
            };
        } catch (error: any) {
            console.error('❌ Error registering subject:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Đăng ký môn học thất bại';
            
            // Phân loại các loại lỗi khác nhau
            if (errorMessage.includes('đã đăng ký')) {
                return {
                    success: false,
                    message: 'Bạn đã đăng ký môn học này rồi!'
                };
            } else if (errorMessage.includes('Trùng lịch')) {
                return {
                    success: false,
                    message: errorMessage
                };
            } else {
                return {
                    success: false,
                    message: errorMessage
                };
            }
        }
    },    // Lấy danh sách môn học đã đăng ký cho sinh viên cụ thể
    getEnrolledSubjects: async (semester?: string): Promise<EnrolledSubjectData[]> => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('📋 Getting enrolled subjects for student:', user.studentId);
            console.log('📅 Semester:', semester || 'current (from backend)');
            
            if (!user.studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.');
            }

            const params: any = { studentId: user.studentId };
            if (semester) {
                params.semester = semester;
            }
            
            const response = await axiosInstance.get<ApiResponse<any[]>>('/student/enrolled-courses', { params });
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
    },// Hủy đăng ký môn học cho sinh viên cụ thể
    unenrollSubject: async (courseId: string): Promise<{ success: boolean; message: string }> => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('❌ Unenrolling subject for student:', user.studentId);
            console.log('📚 Course ID:', courseId);
            
            if (!user.studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.');
            }
            
            const response = await axiosInstance.post<ApiResponse<any>>('/student/enrolled-courses/cancel', {
                courseId,
                studentId: user.studentId  // Đảm bảo gửi studentId
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
    },// Lấy môn học gợi ý
    getRecommendedSubjects: async (studentId: string, semesterId = 'HK1_2025') => {
        try {
            console.log('🎯 [enrollmentApi] Getting recommended subjects for student:', studentId, 'semester:', semesterId);
            
            const response = await axiosInstance.get('/student/subjects/recommended', {
                params: { 
                    studentId, 
                    semester: semesterId 
                }
            });
              if ((response.data as any).success) {
                const courses = (response.data as any).data;
                console.log('✅ [enrollmentApi] Recommended subjects loaded:', courses);
                
                return {
                    success: true,
                    data: courses
                };
            } else {
                console.error('❌ [enrollmentApi] Failed to get recommended subjects:', (response.data as any).message);
                throw new Error((response.data as any).message || 'Failed to get recommended subjects');
            }
        } catch (error) {
            console.error('❌ [enrollmentApi] Error getting recommended subjects:', error);
            throw error;
        }
    },    // API để lấy thông tin sinh viên và ngành
    getStudentInfo: async () => {
        try {
            console.log('📚 [enrollmentApi] Getting student info...');
            
            // Thử endpoint mới trước
            let response;
            try {
                response = await axiosInstance.get('/student/info');
                console.log('✅ [enrollmentApi] Got response from /student/info:', response.data);
            } catch (infoError) {
                console.log('❌ /student/info failed, trying fallbacks...', infoError);
                // Thử các endpoint khác nếu /student/info fail
                try {
                    response = await axiosInstance.get('/student/dashboard');
                } catch (dashboardError) {
                    console.log('❌ Dashboard endpoint failed, trying /student/profile...');
                    response = await axiosInstance.get('/student/profile');
                }
            }
            
            console.log('✅ [enrollmentApi] Raw response:', response.data);
            
            if (response.data && (response.data as any).success) {
                const studentData = (response.data as any).data;
                console.log('✅ [enrollmentApi] Student info loaded:', studentData);
                
                return {
                    studentId: studentData.studentId,
                    name: studentData.name || studentData.fullName,
                    major: studentData.major || 'Chưa xác định',
                    majorName: studentData.majorName || studentData.major || 'Chưa xác định'
                };
            } else {
                // Fallback: dùng thông tin từ localStorage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                console.log('🔄 [enrollmentApi] Using fallback user info:', user);
                
                return {
                    studentId: user.studentId || user.id,
                    name: user.name || 'Chưa xác định',
                    major: user.major || 'Chưa xác định',
                    majorName: user.majorName || user.major || 'Chưa xác định'
                };
            }
        } catch (error) {
            console.error('❌ [enrollmentApi] Error getting student info:', error);
            
            // Fallback: dùng thông tin từ localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('🔄 [enrollmentApi] Using fallback user info from localStorage:', user);
            
            if (user.studentId || user.id) {
                return {
                    studentId: user.studentId || user.id,
                    name: user.name || 'Chưa xác định',
                    major: user.major || 'Chưa xác định',
                    majorName: user.majorName || user.major || 'Chưa xác định'
                };
            }
            
            throw new Error('Không thể lấy thông tin sinh viên. Vui lòng đăng nhập lại.');
        }
    },    // API để lấy học kỳ hiện tại
    getCurrentSemester: async (): Promise<string> => {
        try {
            console.log('📅 [enrollmentApi] Getting current semester...');
            
            const response = await axiosInstance.get<ApiResponse<{ currentSemester: string }>>('/student/current-semester');
            console.log('✅ [enrollmentApi] Current semester response:', response.data);
            
            if (!response.data || !response.data.success) {
                throw new Error(response.data?.message || 'Failed to fetch current semester');
            }
            
            return response.data.data.currentSemester;
        } catch (error: any) {
            console.error('❌ [enrollmentApi] Error getting current semester:', error);
            // Fallback to default semester
            console.log('🔄 [enrollmentApi] Using fallback semester: HK1_2024');
            return 'HK1_2024';
        }
    },

    // API để lấy môn học phân loại theo chương trình
    getClassifiedSubjects: async (semesterId?: string) => {
        try {
            console.log('🎯 [enrollmentApi] Getting classified subjects for semester:', semesterId || 'current (from backend)');
            
            // Lấy studentId từ localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            console.log('👤 User from localStorage:', user);
            
            if (!user.studentId) {
                throw new Error('Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.');
            }            const params: any = { studentId: user.studentId };
            if (semesterId) {
                params.semester = semesterId;
            }
            
            // Sử dụng API phân loại môn học mới
            const response = await axiosInstance.get('/student/subjects/classified', { params });
            
            console.log('🔍 [enrollmentApi] Full response from /student/subjects/classified:', response);
            console.log('🔍 [enrollmentApi] Response data:', response.data);
            
            if ((response.data as any).success) {
                const classifiedData = (response.data as any).data;
                console.log('✅ [enrollmentApi] Classified subjects loaded:', classifiedData);
                console.log('🔍 [enrollmentApi] inProgram subjects:', classifiedData.inProgram);
                console.log('🔍 [enrollmentApi] notInProgram subjects:', classifiedData.notInProgram);
                  // Map môn học thuộc ngành
                const inProgramSubjects = classifiedData.inProgram?.map((course: any): AvailableSubject => ({
                    id: course.courseId,
                    name: course.courseName,
                    lecturer: 'Chưa có thông tin', // Chưa có từ backend
                    day: `Thứ ${course.dayOfWeek}`,
                    fromTo: `tiết ${course.startPeriod}-${course.endPeriod}`,
                    credits: course.credits,
                    maxStudents: course.maxStudents,
                    currentStudents: course.currentEnrollment || 0,
                    fee: course.fee || 0,
                    schedule: `Thứ ${course.dayOfWeek}: tiết ${course.startPeriod}-${course.endPeriod}`,
                    currentEnrollment: course.currentEnrollment,
                    courseType: course.courseType || 'Chuyên ngành',
                    isRecommended: true
                })) || [];
                
                // Map môn học không thuộc ngành
                const notInProgramSubjects = classifiedData.notInProgram?.map((course: any): AvailableSubject => ({
                    id: course.courseId,
                    name: course.courseName,
                    lecturer: 'Chưa có thông tin', // Chưa có từ backend
                    day: `Thứ ${course.dayOfWeek}`,
                    fromTo: `tiết ${course.startPeriod}-${course.endPeriod}`,
                    credits: course.credits,
                    maxStudents: course.maxStudents,
                    currentStudents: course.currentEnrollment || 0,
                    fee: course.fee || 0,
                    schedule: `Thứ ${course.dayOfWeek}: tiết ${course.startPeriod}-${course.endPeriod}`,
                    currentEnrollment: course.currentEnrollment,
                    courseType: course.courseType || 'Tự chọn',
                    isRecommended: false
                })) || [];
                
                // Để duy trì tương thích với mã nguồn hiện tại, vẫn trả về required/elective
                return {
                    required: inProgramSubjects,
                    elective: notInProgramSubjects,
                    summary: {
                        total: classifiedData.summary.totalSubjects,
                        required: classifiedData.summary.totalInProgram,
                        elective: classifiedData.summary.totalNotInProgram
                    }
                };
            }
            
            throw new Error('Không thể lấy danh sách môn học phân loại');
        } catch (error) {
            console.error('❌ Error in getClassifiedSubjects:', error);
            throw error;
        }
    }
};

// Helper function để parse mã học kỳ thành năm học và học kỳ
const parseSemesterInfo = (semesterId: string) => {
    // Ví dụ: HK1_2024 => Năm học 2024-2025 học kỳ 1
    try {
        const [semester, year] = semesterId.split('_');
        const semesterNumber = semester.replace('HK', '');
        const startYear = parseInt(year);
        const endYear = startYear + 1;
        
        return {
            academicYear: `${startYear}-${endYear}`,
            semesterNumber: semesterNumber,
            fullName: `Năm học ${startYear}-${endYear} học kỳ ${semesterNumber}`
        };
    } catch (error) {
        return {
            academicYear: 'Không xác định',
            semesterNumber: '1',
            fullName: 'Học kỳ không xác định'
        };
    }
};

// Export individual functions for easier import
export const getStudentInfo = enrollmentApi.getStudentInfo;
export const getClassifiedSubjects = enrollmentApi.getClassifiedSubjects;
export const getAvailableSubjects = enrollmentApi.getAvailableSubjects;
export const registerSubject = enrollmentApi.registerSubject;
export const getEnrolledSubjects = enrollmentApi.getEnrolledSubjects;
export const unenrollSubject = enrollmentApi.unenrollSubject;
export const getCurrentSemester = enrollmentApi.getCurrentSemester;
export { parseSemesterInfo };

// Default export
export default enrollmentApi;
