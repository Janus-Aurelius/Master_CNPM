import axiosInstance from '../axios';

export interface ProgramSchedule {
    id: number;
    maNganh: string;
    maMonHoc: string;
    maHocKy: string;
    ghiChu?: string;
    thoiGianBatDau?: string;
    thoiGianKetThuc?: string;
    tenKhoa?: string;
    tenNganh?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const programApi = {
    getPrograms: async (): Promise<ProgramSchedule[]> => {
        const { data } = await axiosInstance.get<ApiResponse<ProgramSchedule[]>>(`/academic/programsMgm`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },    createProgram: async (program: Omit<ProgramSchedule, 'id'>): Promise<ProgramSchedule> => {
        try {
            const { data } = await axiosInstance.post<ApiResponse<ProgramSchedule>>(`/academic/programsMgm`, program);
            if (!data || !data.success) {
                throw new Error(data?.message || 'Failed to create program');
            }
            return data.data;
        } catch (error) {
            // Re-throw axios errors as-is to preserve response structure
            throw error;
        }
    },    updateProgram: async (maNganh: string, maMonHoc: string, maHocKy: string, program: Partial<ProgramSchedule>): Promise<ProgramSchedule> => {
        try {
            const { data } = await axiosInstance.put<ApiResponse<ProgramSchedule>>(`/academic/programsMgm/${maNganh}/${maMonHoc}/${maHocKy}`, program);
            if (!data || !data.success) {
                throw new Error(data?.message || 'Failed to update program');
            }
            return data.data;
        } catch (error) {
            // Re-throw axios errors as-is to preserve response structure
            throw error;
        }
    },    deleteProgram: async (maNganh: string, maMonHoc: string, maHocKy: string): Promise<any> => {
        try {
            const { data } = await axiosInstance.delete<ApiResponse<void>>(`/academic/programsMgm/${maNganh}/${maMonHoc}/${maHocKy}`);
            if (!data || !data.success) {
                throw new Error(data?.message || 'Failed to delete program');
            }
            return data;
        } catch (error) {
            // Re-throw axios errors as-is to preserve response structure
            throw error;
        }
    },

    getProgramsByNganh: async (maNganh: string): Promise<ProgramSchedule[]> => {
        const { data } = await axiosInstance.get<ApiResponse<ProgramSchedule[]>>(`/academic/programsMgm/nganh/${maNganh}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    getProgramsByHocKy: async (maHocKy: string): Promise<ProgramSchedule[]> => {
        const { data } = await axiosInstance.get<ApiResponse<ProgramSchedule[]>>(`/academic/programsMgm/hocky/${maHocKy}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    getProgramsByDepartment: async (department: string): Promise<ProgramSchedule[]> => {
        const { data } = await axiosInstance.get<ApiResponse<ProgramSchedule[]>>(`/academic/programsMgm/department/${department}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    getProgramsByStatus: async (status: string): Promise<ProgramSchedule[]> => {
        const { data } = await axiosInstance.get<ApiResponse<ProgramSchedule[]>>(`/academic/programsMgm/status/${status}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    updateProgramStatus: async (id: number, status: string): Promise<ProgramSchedule> => {
        const { data } = await axiosInstance.put<ApiResponse<ProgramSchedule>>(`/academic/programsMgm/${id}/status`, { status });
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to update program status');
        }
        return data.data;
    },

    validateSemester: async (maHocKy: string): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.get<ApiResponse<{ exists: boolean }>>(`/academic/programsMgm/validate-semester/${maHocKy}`);
            return data.data.exists;
        } catch (error) {
            console.error('Error validating semester:', error);
            return false;
        }
    }
}; 