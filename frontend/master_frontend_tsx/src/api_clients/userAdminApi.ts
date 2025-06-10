import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    department: string;
}

export interface AdminRole {
    id: number;
    name: string;
    displayName: string;
    permissions: { id: number; name: string; granted: boolean }[];
}

export const userAdminApi = {
    getUsers: async (): Promise<AdminUser[]> => {
        const response = await axios.get(`${API_URL}/admin/users`);
        return response.data as AdminUser[];
    },
    createUser: async (user: Omit<AdminUser, 'id'>): Promise<AdminUser> => {
        const response = await axios.post(`${API_URL}/admin/users`, user);
        return response.data as AdminUser;
    },
    updateUser: async (id: number, user: AdminUser): Promise<AdminUser> => {
        const response = await axios.put(`${API_URL}/admin/users/${id}`, user);
        return response.data as AdminUser;
    },
    deleteUser: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/admin/users/${id}`);
    },
    getRoles: async (): Promise<AdminRole[]> => {
        const response = await axios.get(`${API_URL}/admin/roles`);
        return response.data as AdminRole[];
    },
    updateRolePermissions: async (roleId: number, permissions: { id: number; granted: boolean }[]): Promise<AdminRole> => {
        const response = await axios.put(`${API_URL}/admin/roles/${roleId}/permissions`, { permissions });
        return response.data as AdminRole;
    }
}; 