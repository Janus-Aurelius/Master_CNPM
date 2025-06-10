import axiosInstance from './axios';
import { Subject } from '../types/course';

export const courseApi = {
    getCourses: async (): Promise<Subject[]> => {
        const response = await axiosInstance.get('/academic/courseMgm');
        return response.data as Subject[];
    },

    createCourse: async (subject: Subject): Promise<Subject> => {
        const response = await axiosInstance.post('/academic/courseMgm', subject);
        return response.data as Subject;
    },

    updateCourse: async (id: number, subject: Subject): Promise<Subject> => {
        const response = await axiosInstance.put(`/academic/courseMgm/${id}`, subject);
        return response.data as Subject;
    },

    deleteCourse: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/academic/courseMgm/${id}`);
    }
}; 