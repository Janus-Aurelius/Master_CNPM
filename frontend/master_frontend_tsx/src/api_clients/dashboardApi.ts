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

export interface OverviewData {
    totalDebtStudents: number;
    totalDebt: number;
    todayTransactions: number;
    todayRevenue: number;
}

export interface RecentPayment {
    studentid: string;
    studentname: string;
    amount: number;
    method: string;
    time: string;
}

export interface FacultyStat {
    facultyname: string;
    totalstudents: number;
    debtstudents: number;
    debtpercent: number;
}

export const financialDashboardApi = {
    getOverview: async (): Promise<OverviewData> => {
        const res = await axiosInstance.get<{ success: boolean; data: OverviewData }>('/financial/dashboard/overview');
        return res.data.data;
    },
    getRecentPayments: async (): Promise<RecentPayment[]> => {
        const res = await axiosInstance.get<{ success: boolean; data: RecentPayment[] }>('/financial/dashboard/recent-payments');
        return res.data.data;
    },
    getFacultyStats: async (): Promise<FacultyStat[]> => {
        const res = await axiosInstance.get<{ success: boolean; data: FacultyStat[] }>('/financial/dashboard/faculty-stats');
        return res.data.data;
    },
}; 