import axiosInstance from './axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AdminUser {
    id: string;
    name: string;
    studentid: string;
    role: string;
    status: string;
    department: string;
}

export interface AdminUserResponse {
    success: boolean;
    data: {
        users: AdminUser[];
        total: number;
        page: number;
        totalPages: number;
    }
}

export interface AdminRole {
    id: number;
    name: string;
    displayName: string;
    permissions: { id: number; name: string; granted: boolean }[];
}

export const userAdminApi = {
    async getUsers(page: number = 1, limit: number = 10, role?: string) {
        const params: any = { page, limit };
        if (role && role !== "all") params.role = role;
        const response = await axiosInstance.get<{ success: boolean; data: { users: AdminUser[], total: number, page: number, totalPages: number } }>(
            `${API_URL}/admin/users`,
            { params }
        );
        return response.data.data;
    },
    createUser: async (user: Omit<AdminUser, 'id'>): Promise<AdminUser> => {
        const response = await axiosInstance.post(`${API_URL}/admin/users`, user);
        return response.data as AdminUser;
    },
    updateUser: async (id: number, user: AdminUser): Promise<AdminUser> => {
        const response = await axiosInstance.put(`${API_URL}/admin/users/${id}`, user);
        return response.data as AdminUser;
    },
    deleteUser: async (id: string): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/admin/users/${id}`);
    },
    getRoles: async (): Promise<AdminRole[]> => {
        const response = await axiosInstance.get(`${API_URL}/admin/roles`);
        return response.data as AdminRole[];
    },
    updateRolePermissions: async (roleId: number, permissions: { id: number; granted: boolean }[]): Promise<AdminRole> => {
        const response = await axiosInstance.put(`${API_URL}/admin/roles/${roleId}/permissions`, { permissions });
        return response.data as AdminRole;
    },
    advancedSearch: async (searchTerm: string): Promise<AdminUser[]> => {
        const response = await axiosInstance.get<{ success: boolean; data: AdminUser[] }>(
            `${API_URL}/admin/users/advanced-search`,
            { params: { searchTerm } }
        );
        return response.data.data;
    },
    searchUsersByName: async (searchTerm: string): Promise<AdminUser[]> => {
        const response = await axiosInstance.get<{ success: boolean; data: AdminUser[] }>(
            `${API_URL}/admin/users/search`,
            { params: { searchTerm } }
        );
        return response.data.data;
    }
}; 