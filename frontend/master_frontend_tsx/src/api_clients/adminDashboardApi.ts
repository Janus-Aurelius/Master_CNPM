import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AdminDashboardSummary {
    totalStudents: number;
    pendingPayments: number;
    newRegistrations: number;
    systemAlerts: number;
}

export interface AuditLog {
    id: number;
    user: string;
    action: string;
    resource: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
}

export interface RecentActivity {
    id: number;
    message: string;
    time: string;
    severity: 'info' | 'warning' | 'error';
}

export const adminDashboardApi = {
    getSummary: async (): Promise<AdminDashboardSummary> => {
        const response = await axios.get(`${API_URL}/admin/dashboard/summary`);
        return response.data as AdminDashboardSummary;
    },
    getAuditLogs: async (): Promise<AuditLog[]> => {
        const response = await axios.get(`${API_URL}/admin/dashboard/audit-logs`);
        return response.data as AuditLog[];
    },
    getRecentActivities: async (): Promise<RecentActivity[]> => {
        const response = await axios.get(`${API_URL}/admin/dashboard/recent-activities`);
        return response.data as RecentActivity[];
    }
}; 