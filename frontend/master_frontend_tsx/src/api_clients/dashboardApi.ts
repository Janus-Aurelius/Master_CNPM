import axiosInstance from './axios';

export interface DashboardSummary {
    totalSubjects: number;
    totalOpenCourses: number;
    totalPrograms: number;
    pendingRequests: number;
}

export interface UpcomingEvent {
    id: string;
    type: 'subject_created' | 'course_opened' | 'request_submitted' | 'program_updated';
    description: string;
    timestamp: string;
    user: string;
}

export interface StudentRequest {
    id: string;
    studentId: string;
    studentName: string;
    course: string;
    requestType: 'register' | 'cancel';
    submittedDateTime: string;
}

export const dashboardApi = {
    getSummary: async (): Promise<DashboardSummary> => {
        const response: any = await axiosInstance.get('/academic/dashboard/stats');
        console.log('summaryData:', response.data?.data?.data || response.data?.data || response.data);
        return response.data?.data?.data || response.data?.data || response.data;
    },

    getUpcomingEvents: async (): Promise<UpcomingEvent[]> => {
        const response = await axiosInstance.get('/academic/dashboard/activities');
        return response.data as UpcomingEvent[];
    },

    getStudentRequests: async (): Promise<StudentRequest[]> => {
        const response: any = await axiosInstance.get('/academic/dashboard/requests');
        console.log('studentRequests:', response.data?.data?.data || response.data?.data || []);
        return response.data?.data?.data || response.data?.data || [];
    }
}; 