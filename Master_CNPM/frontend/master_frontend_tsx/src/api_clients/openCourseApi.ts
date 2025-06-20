import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export enum CourseStatus {
    OPEN = "Mở lớp",
    WAITING = "Chờ mở lớp",
    CLOSED = "Không mở lớp"
}

export interface OpenCourse {
    id: string;
    subjectCode: string;
    subjectName: string;
    credits: number;
    semester: string;
    academicYear: string;
    fieldOfStudy: string;
    status: CourseStatus;
    enrolledStudents: number;
    minStudents: number;
    maxStudents: number;
}

export const openCourseApi = {
    getCourses: async (): Promise<OpenCourse[]> => {
        const response = await axios.get(`${API_URL}/academic/openCourseMgm`);
        return response.data as OpenCourse[];
    },

    createCourse: async (course: Omit<OpenCourse, 'id'>): Promise<OpenCourse> => {
        const response = await axios.post(`${API_URL}/open-courses`, course);
        return response.data as OpenCourse;
    },

    updateCourse: async (id: string, course: OpenCourse): Promise<OpenCourse> => {
        const response = await axios.put(`${API_URL}/open-courses/${id}`, course);
        return response.data as OpenCourse;
    },

    deleteCourse: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/open-courses/${id}`);
    },

    updateCourseStatus: async (id: string, status: CourseStatus): Promise<OpenCourse> => {
        const response = await axios.patch(`${API_URL}/open-courses/${id}/status`, { status });
        return response.data as OpenCourse;
    }
}; 