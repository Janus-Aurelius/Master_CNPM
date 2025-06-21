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

export const financialDashboardApi = {
    getOverview: async (): Promise<FinancialDashboardOverview> => {
        const response = await axiosInstance.get<{ success: boolean; data: FinancialDashboardOverview }>('/financial/dashboard/overview');
        return response.data.data;
    },
    // Có thể bổ sung thêm các API khác nếu cần
};
