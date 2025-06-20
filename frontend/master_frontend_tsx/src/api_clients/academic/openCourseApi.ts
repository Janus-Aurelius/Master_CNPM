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
    },

    createCourse: async (course: Omit<OpenCourse, 'semesterId' | 'courseId'>): Promise<OpenCourse> => {
        const response = await axios.post(`${API_URL}/academic/open-courses`, course);
        return response.data as OpenCourse;
    },

    updateCourse: async (semesterId: string, courseId: string, course: Partial<OpenCourse>): Promise<OpenCourse> => {
        const response = await axios.put(`${API_URL}/academic/open-courses/${semesterId}/${courseId}`, course);
        return response.data as OpenCourse;
    },

    deleteCourse: async (semesterId: string, courseId: string): Promise<void> => {
        await axios.delete(`${API_URL}/academic/open-courses/${semesterId}/${courseId}`);
    },

    updateCourseStatus: async (semesterId: string, courseId: string, status: CourseStatus): Promise<OpenCourse> => {
        const response = await axios.patch(`${API_URL}/academic/open-courses/${semesterId}/${courseId}/status`, { status });
        return response.data as OpenCourse;
    }
};