import axiosInstance from './axios';

export interface FinancialDashboardOverview {
    overview: {
        paidStudents: number;
        unpaidStudents: number;
        partialStudents: number;
        totalStudents: number;
        paymentRate: number;
    };
    financial: {
        totalCollected: number;
        totalTuition: number;
        totalOutstanding: number;
        collectionRate: number;
    };
}

export interface Semester {
    semesterId: string;
    semesterName: string;
    HocKyThu?: number;
    NamHoc?: string;
}

export interface OverviewData {
    totalDebtStudents: number;
    totalDebt: number;
    todayTransactions: number;
    todayRevenue: number;
    totalCollected: number;
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
        const res = await axiosInstance.get<{ success: boolean; data: any }>('/financial/dashboard/overview');
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
    getSemesters: async (): Promise<Semester[]> => {
        const response = await axiosInstance.get<{ success: boolean; data: Semester[] }>(
            '/financial/dashboard/semesters'
        );
        return response.data.data;
    },
    getFacultyStatsBySemester: async (semesterId: string): Promise<FacultyStat[]> => {
        const response = await axiosInstance.get<{ success: boolean; data: FacultyStat[] }>(
            `/financial/dashboard/faculty-stats?semesterId=${semesterId}`
        );
        return response.data.data;
    },
    // Có thể bổ sung thêm các API khác nếu cần
};
