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
    user_id: string;
    action_type: string;
    created_at: string;
    status: string;
    ip_address: string;
    user_agent: string;
}

export interface AuditLogResponse {
    success: boolean;
    data: AuditLog[];
    total: number;
    page: number;
    size: number;
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
    getAuditLogs: async (page: number, size: number): Promise<AuditLogResponse> => {
        const response = await axiosInstance.get<AuditLogResponse>(`${API_URL}/admin/system/audit-logs?page=${page}&size=${size}`);
        return response.data;
    },
    toggleMaintenance: async (enable: boolean): Promise<any> => {
        const res = await axiosInstance.post(`${API_URL}/admin/system/maintenance`, { enable });
        return res.data;
    }
}; 