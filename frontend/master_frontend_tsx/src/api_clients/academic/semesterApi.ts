import axiosInstance from '../axios';

// Add request interceptor to add token
axiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Semester {
    semesterId: string;         // MaHocKy (Primary Key)
    termNumber: number;         // HocKyThu (1, 2, 3)
    startDate: Date | string;   // ThoiGianBatDau
    endDate: Date | string;     // ThoiGianKetThuc
    status: string;             // TrangThaiHocKy
    academicYear: number;       // NamHoc
    feeDeadline: Date | string; // ThoiHanDongHP
    
    // Computed/derived fields for UI display
    year?: string;              // Extract from academicYear
    academicYearDisplay?: string; // e.g., "2024-2025"
    semesterName?: string;      // e.g., "HK1", "HK2", "HK3"
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const semesterApi = {
    getSemesters: async (): Promise<Semester[]> => {
        const { data } = await axiosInstance.get<ApiResponse<Semester[]>>('/academic/semesters');
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    getSemesterById: async (id: string): Promise<Semester> => {
        const { data } = await axiosInstance.get<ApiResponse<Semester>>(`/academic/semesters/${id}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to fetch semester');
        }
        return data.data;
    },

    createSemester: async (semester: Omit<Semester, 'semesterId'> & { semesterId: string }): Promise<Semester> => {
        const { data } = await axiosInstance.post<ApiResponse<Semester>>('/academic/semesters', semester);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to create semester');
        }
        return data.data;
    },

    updateSemester: async (id: string, semester: Semester): Promise<Semester> => {
        const { data } = await axiosInstance.put<ApiResponse<Semester>>(`/academic/semesters/${id}`, semester);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to update semester');
        }
        return data.data;
    },

    deleteSemester: async (id: string): Promise<void> => {
        const { data } = await axiosInstance.delete<ApiResponse<void>>(`/academic/semesters/${id}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to delete semester');
        }
    },

    searchSemesters: async (query: string): Promise<Semester[]> => {
        const { data } = await axiosInstance.get<ApiResponse<Semester[]>>('/academic/semesters/search', {
            params: { q: query }
        });
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    getSemestersByYear: async (year: number): Promise<Semester[]> => {
        const { data } = await axiosInstance.get<ApiResponse<Semester[]>>(`/academic/semesters/year/${year}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    getCurrentSemester: async (): Promise<Semester> => {
        const { data } = await axiosInstance.get<ApiResponse<Semester>>('/academic/semesters/current');
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to fetch current semester');
        }
        return data.data;
    },
};
