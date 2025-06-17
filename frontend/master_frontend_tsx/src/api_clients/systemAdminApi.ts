import axiosInstance from './axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface BackupHistory {
    id: number;
    date: string;
    size: string;
    status: 'success' | 'warning' | 'error';
    type: string;
}

export interface AuditLog {
    id: number;
    user_id: string;  // Thay đổi từ user
    action_type: string;  // Thay đổi từ action
    status: string;
    created_at: string;  // Thay đổi từ timestamp
    ip_address?: string;  // Thay đổi từ ipAddress
    user_agent?: string;  // Thêm mới
}

export interface SystemSettings {
    security: any;
    integration: any;
    backup: any;
    maintenance: any;
}

export const systemAdminApi = {

    getSecuritySettings: async (): Promise<any> => {
        const res = await axiosInstance.get<any>(`${API_URL}/admin/system/getsecurity`);
        return res.data;
    },
    updateSecuritySettings: async (settings: any): Promise<void> => {
        await axiosInstance.put(`${API_URL}/admin/system/updatesecurity`, settings);
    },
    getMaintenanceSettings: async (): Promise<any> => {
        const res = await axiosInstance.get<any>(`${API_URL}/admin/maintenance/status`);
        return res.data.data;
    },
    getAuditLogs: async (): Promise<AuditLog[]> => {
        const res = await axiosInstance.get(`${API_URL}/admin/system/audit-logs`);

        if (Array.isArray(res.data)) {
            return res.data;
        }
        return [];
    },
    toggleMaintenance: async (enable: boolean): Promise<any> => {
        const res = await axiosInstance.post(`${API_URL}/admin/system/maintenance`, { enable });
        return res.data;
    }
}; 