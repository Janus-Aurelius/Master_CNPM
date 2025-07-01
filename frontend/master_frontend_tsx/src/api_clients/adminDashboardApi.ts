import axiosInstance from './axios';

export interface AdminDashboardSummary {
    totalStudents: number;
    pendingPayments: number;
    newRegistrations: number;
    systemAlerts: number;
}

export interface AuditLog {
    id: number;
    user_id: string;
    action_type: string;
    status: string;
    created_at: string;
    ip_address?: string;
    user_agent?: string;
}

export interface RecentActivity {
    id: number;
    message: string;
    time: string;
    severity: 'info' | 'warning' | 'error';
}

export const adminDashboardApi = {
    getSummary: async (): Promise<AdminDashboardSummary> => {
        const response = await axiosInstance.get<{ success: boolean; data: AdminDashboardSummary }>('/admin/dashboard/summary');
        return response.data.data;
    },
    getAuditLogs: async (): Promise<AuditLog[]> => {
        const response = await axiosInstance.get<{ success: boolean; data: AuditLog[] }>('/admin/dashboard/audit-logs');
        return response.data.data;
    },
    getRecentActivities: async (): Promise<RecentActivity[]> => {
        const response = await axiosInstance.get<{ success: boolean; data: RecentActivity[] }>('/admin/dashboard/recent-activities');
        return response.data.data;
    },
};