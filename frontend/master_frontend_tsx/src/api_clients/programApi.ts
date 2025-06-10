import axiosInstance from './axios';

export interface ProgramSchedule {
    id: number;
    maNganh: string;
    maMonHoc: string;
    maHocKy: string;
    ghiChu?: string;
}

export const programApi = {
    getPrograms: async (): Promise<ProgramSchedule[]> => {
        const response = await axiosInstance.get(`/academic/programsMgm`);
        if (!response.data) {
            throw new Error('No data received from server');
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    createProgram: async (program: Omit<ProgramSchedule, 'id'>): Promise<ProgramSchedule> => {
        const response = await axiosInstance.post(`/academic/programsMgm`, program);
        if (!response.data) {
            throw new Error('No data received from server');
        }
        return response.data as ProgramSchedule;
    },

    updateProgram: async (maNganh: string, maMonHoc: string, maHocKy: string, program: Partial<ProgramSchedule>): Promise<ProgramSchedule> => {
        const response = await axiosInstance.put(`/academic/programsMgm/${maNganh}/${maMonHoc}/${maHocKy}`, program);
        return response.data as ProgramSchedule;
    },

    deleteProgram: async (maNganh: string, maMonHoc: string, maHocKy: string): Promise<void> => {
        await axiosInstance.delete(`/academic/programsMgm/${maNganh}/${maMonHoc}/${maHocKy}`);
    },

    getProgramsByNganh: async (maNganh: string): Promise<ProgramSchedule[]> => {
        const response = await axiosInstance.get(`/academic/programsMgm/nganh/${maNganh}`);
        if (!response.data) {
            throw new Error('No data received from server');
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    getProgramsByHocKy: async (maHocKy: string): Promise<ProgramSchedule[]> => {
        const response = await axiosInstance.get(`/academic/programsMgm/hocky/${maHocKy}`);
        if (!response.data) {
            throw new Error('No data received from server');
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    getProgramsByDepartment: async (department: string): Promise<ProgramSchedule[]> => {
        const response = await axiosInstance.get(`/academic/programsMgm/department/${department}`);
        return response.data as ProgramSchedule[];
    },

    getProgramsByStatus: async (status: string): Promise<ProgramSchedule[]> => {
        const response = await axiosInstance.get(`/academic/programsMgm/status/${status}`);
        return response.data as ProgramSchedule[];
    },

    updateProgramStatus: async (id: number, status: string): Promise<ProgramSchedule> => {
        const response = await axiosInstance.put(`/academic/programsMgm/${id}/status`, { status });
        return response.data as ProgramSchedule;
    }
}; 