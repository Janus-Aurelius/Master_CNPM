import axiosInstance from './axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface DashboardSummary {
    totalStudents: number;
    totalCourses: number;
    activeRegistrations: number;
    pendingRequests: number;
}

export interface UpcomingEvent {
    id: number;
    event: string;
    date: string;
}

export interface StudentRequest {
    id: number;
    studentId: string;
    studentName: string;
    course: string;
    requestType: 'register' | 'drop';
    submittedDateTime: string;
    status: 'pending' | 'approved' | 'rejected';
}

export const dashboardApi = {
    getSummary: async (): Promise<DashboardSummary> => {
        const response = await axiosInstance.get('/dashboard');
        return response.data as DashboardSummary;
    },

    getUpcomingEvents: async (): Promise<UpcomingEvent[]> => {
        const response = await axiosInstance.get('/dashboard/activities');
        return response.data as UpcomingEvent[];
    },

    getStudentRequests: async (): Promise<StudentRequest[]> => {
        const response = await axiosInstance.get('/dashboard/requests');
        return response.data as StudentRequest[];
    }
}; 