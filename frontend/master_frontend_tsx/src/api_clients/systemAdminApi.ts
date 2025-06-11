import axios from 'axios';

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
    details: string;
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
    getSettings: async (): Promise<SystemSettings> => {
        const response = await axios.get(`${API_URL}/admin/system/settings`);
        return response.data as SystemSettings;
    },
    updateSettings: async (section: string, settings: any): Promise<SystemSettings> => {
        const response = await axios.put(`${API_URL}/admin/system/settings/${section}`, settings);
        return response.data as SystemSettings;
    },
    getBackupHistory: async (): Promise<BackupHistory[]> => {
        const response = await axios.get(`${API_URL}/admin/system/backup-history`);
        return response.data as BackupHistory[];
    },
    startBackup: async (): Promise<{ message: string }> => {
        const response = await axios.post(`${API_URL}/admin/system/backup`);
        return response.data as { message: string };
    },
    getAuditLogs: async (): Promise<AuditLog[]> => {
        const response = await axios.get(`${API_URL}/admin/system/audit-logs`);
        return response.data as AuditLog[];
    },
    toggleMaintenance: async (enable: boolean): Promise<{ maintenanceMode: boolean }> => {
        const response = await axios.post(`${API_URL}/admin/system/maintenance`, { enable });
        return response.data as { maintenanceMode: boolean };
    }
}; 