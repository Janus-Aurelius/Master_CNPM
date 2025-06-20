import axiosInstance from '../axios';
import { Subject } from '../../types/course';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const courseApi = {
    getCourses: async (): Promise<Subject[]> => {
        const { data } = await axiosInstance.get<ApiResponse<any[]>>('/academic/courses');
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        // Map backend response to frontend Subject interface
        const mappedData = (data.data || []).map((item: any) => ({
            maMonHoc: item.courseId || '',
            tenMonHoc: item.courseName || '',
            maLoaiMon: item.courseTypeId || '',
            soTiet: item.totalHours || 0,
            credits: item.totalCredits || 0
        }));
        return mappedData;
    },

    getCourseTypes: async (): Promise<Array<{id: string, name: string, hoursPerCredit: number}>> => {
        const { data } = await axiosInstance.get<ApiResponse<any[]>>('/academic/courses/types');
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to fetch course types');
        }
        return data.data || [];
    },createCourse: async (subject: Subject): Promise<Subject> => {
        // Map frontend Subject to backend format (không gửi credits vì tự tính)
        const backendData = {
            courseId: subject.maMonHoc,
            courseName: subject.tenMonHoc,
            courseTypeId: subject.maLoaiMon,
            totalHours: subject.soTiet
        };
        const { data } = await axiosInstance.post<ApiResponse<any>>('/academic/courses', backendData);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to create course');
        }
        // Map response back to frontend format
        return {
            maMonHoc: data.data.courseId || subject.maMonHoc,
            tenMonHoc: data.data.courseName || subject.tenMonHoc,
            maLoaiMon: data.data.courseTypeId || subject.maLoaiMon,
            soTiet: data.data.totalHours || subject.soTiet,
            credits: data.data.totalCredits || 0 // Credits được tính từ backend
        };
    },    updateCourse: async (id: string, subject: Subject): Promise<Subject> => {
        // Map frontend Subject to backend format (không gửi credits vì tự tính)
        const backendData = {
            courseName: subject.tenMonHoc,
            courseTypeId: subject.maLoaiMon,
            totalHours: subject.soTiet
        };
        const { data } = await axiosInstance.put<ApiResponse<any>>(`/academic/courses/${id}`, backendData);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to update course');
        }
        // Map response back to frontend format
        return {
            maMonHoc: data.data.courseId || subject.maMonHoc,
            tenMonHoc: data.data.courseName || subject.tenMonHoc,
            maLoaiMon: data.data.courseTypeId || subject.maLoaiMon,
            soTiet: data.data.totalHours || subject.soTiet,
            credits: data.data.totalCredits || 0 // Credits được tính lại từ backend
        };
    },    deleteCourse: async (id: string): Promise<void> => {
        console.log('Deleting course with ID:', id);
        console.log('API endpoint:', `/academic/courses/${id}`);
        console.log('Token:', localStorage.getItem('token'));
        
        try {
            const { data } = await axiosInstance.delete<ApiResponse<void>>(`/academic/courses/${id}`);
            if (!data || !data.success) {
                throw new Error(data?.message || 'Failed to delete course');
            }
        } catch (error: any) {
            console.error('Delete API Error:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            throw error;
        }
    }
}; 