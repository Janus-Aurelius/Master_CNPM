import axiosInstance from './axios';
import { Subject } from '../types/course';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const courseApi = {
    getCourses: async (): Promise<Subject[]> => {
        const { data } = await axiosInstance.get<ApiResponse<Subject[]>>('/academic/courseMgm');
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    createCourse: async (subject: Subject): Promise<Subject> => {
        const { data } = await axiosInstance.post<ApiResponse<Subject>>('/academic/courseMgm', subject);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to create course');
        }
        return data.data;
    },

    updateCourse: async (id: string, subject: Subject): Promise<Subject> => {
        const { data } = await axiosInstance.put<ApiResponse<Subject>>(`/academic/courseMgm/${id}`, subject);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to update course');
        }
        return data.data;
    },

    deleteCourse: async (id: string): Promise<void> => {
        const { data } = await axiosInstance.delete<ApiResponse<void>>(`/academic/courseMgm/${id}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to delete course');
        }
    }
}; 