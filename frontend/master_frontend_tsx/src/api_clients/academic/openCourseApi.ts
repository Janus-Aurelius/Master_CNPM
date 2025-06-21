import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export enum CourseStatus {
    OPEN = "Mở lớp",
    WAITING = "Chờ mở lớp",
    CLOSED = "Không mở lớp"
}

// Interface matching backend IOfferedCourse
export interface OpenCourse {
    semesterId: string;         // MaHocKy
    courseId: string;           // MaMonHoc
    minStudents: number;        // SiSoToiThieu
    maxStudents: number;        // SiSoToiDa
    currentStudents: number;    // SoSVDaDangKy
    dayOfWeek: number;          // Thu (1-7)
    startPeriod: number;        // TietBatDau
    endPeriod: number;          // TietKetThuc

    // Computed fields from JOINs
    courseName?: string;        // from MONHOC.TenMonHoc
    courseTypeId?: string;      // from MONHOC.MaLoaiMon
    courseTypeName?: string;    // from LOAIMON.TenLoaiMon
    totalHours?: number;        // from MONHOC.SoTiet
    hoursPerCredit?: number;    // from LOAIMON.SoTietMotTC
    pricePerCredit?: number;    // from LOAIMON.SoTienMotTC
      // Academic year and semester info from HOCKYNAMHOC
    semesterNumber?: number;    // from HOCKYNAMHOC.HocKyThu
    academicYear?: number;      // from HOCKYNAMHOC.NamHoc
    
    // Status
    status?: string;            // 'Mở' | 'Đầy'
    
    // Additional UI fields
    registrationStartDate?: string;
    registrationEndDate?: string;
}

export const openCourseApi = {
    getCourses: async (): Promise<OpenCourse[]> => {
        try {
            const response = await axios.get(`${API_URL}/academic/open-courses`);
            return response.data as OpenCourse[];
        } catch (error) {
            console.error('Error fetching open courses:', error); 
            throw error;
        }
    },    // Thêm API để lấy danh sách môn học
    getAllCourses: async (): Promise<any[]> => {
        try {
            const response = await axios.get(`${API_URL}/academic/courses`);
            return response.data as any[];
        } catch (error) {
            console.error('Error fetching all courses:', error);
            throw error;
        }
    },    // Thêm API để lấy danh sách học kỳ
    getSemesters: async (): Promise<any[]> => {
        try {
            const response = await axios.get(`${API_URL}/academic/open-courses/available-semesters`);
            const data = response.data as any;
            if (data.success) {
                return data.data;
            }
            return data || [];
        } catch (error) {
            console.error('Error fetching semesters:', error);
            throw error;
        }
    },

    getAvailableCourses: async (): Promise<Array<{courseId: string, courseName: string, courseTypeId: string, courseTypeName: string, totalHours: number}>> => {
        try {
            const response = await axios.get(`${API_URL}/academic/open-courses/available-courses`);
            const data = response.data as any;
            if (data.success) {
                return data.data;
            }
            return data || [];
        } catch (error) {
            console.error('Error fetching available courses:', error);
            throw error;
        }
    },createCourse: async (course: Omit<OpenCourse, 'currentStudents' | 'courseName' | 'courseTypeId' | 'courseTypeName' | 'totalHours' | 'hoursPerCredit' | 'pricePerCredit' | 'semesterNumber' | 'academicYear' | 'status' | 'registrationStartDate' | 'registrationEndDate'>): Promise<OpenCourse> => {
        try {
            const response = await axios.post(`${API_URL}/academic/open-courses`, course);
            const data = response.data as any;
            if (data.success) {
                return data.data;
            }
            throw new Error(data.message || 'Failed to create course');
        } catch (error) {
            throw error;
        }
    },

    updateCourse: async (semesterId: string, courseId: string, course: Partial<OpenCourse>): Promise<OpenCourse> => {
        try {
            const response = await axios.put(`${API_URL}/academic/open-courses/${semesterId}/${courseId}`, course);
            const data = response.data as any;
            if (data.success) {
                return data.data;
            }
            throw new Error(data.message || 'Failed to update course');
        } catch (error) {
            throw error;
        }
    },    deleteCourse: async (semesterId: string, courseId: string): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/academic/open-courses/${semesterId}/${courseId}`);
        } catch (error) {
            throw error;
        }
    },

    updateCourseStatus: async (semesterId: string, courseId: string, status: CourseStatus): Promise<OpenCourse> => {
        const response = await axios.patch(`${API_URL}/academic/open-courses/${semesterId}/${courseId}/status`, { status });
        return response.data as OpenCourse;
    }
};