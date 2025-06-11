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
    details: string;
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
        const response = await axiosInstance.get('/admin/dashboard/summary');
        // Nếu backend trả về { success: true, data: {...} }
        return response.data.data as AdminDashboardSummary;
    },
    getAuditLogs: async (): Promise<AuditLog[]> => {
        const response = await axiosInstance.get('/admin/dashboard/audit-logs');
        // Nếu backend trả về { success: true, data: [...] }
        return response.data.data as AuditLog[];
    },
    getRecentActivities: async (): Promise<RecentActivity[]> => {
        const response = await axiosInstance.get('/admin/dashboard/recent-activities');
        // Nếu backend trả về { success: true, data: [...] }
        return response.data.data as RecentActivity[];
    },
};