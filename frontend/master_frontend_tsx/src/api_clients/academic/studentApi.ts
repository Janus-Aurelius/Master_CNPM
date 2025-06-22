import axiosInstance from '../axios';

// Add request interceptor to add token
axiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Student {
    studentId: string;
    fullName: string;
    dateOfBirth: Date | string;  // Allow both Date and string to handle API response
    gender: string;
    hometown: string;           
    districtId: string;         
    priorityObjectId: string;   
    majorId: string;            
    email?: string;
    phone?: string;
    address?: string;           // Add address field
    status?: 'active' | 'inactive' | 'đang học' | 'thôi học';
    
    // Computed fields from JOINs (for display)
    districtName?: string;     // from HUYEN.TenHuyen
    provinceName?: string;     // from TINH.TenTinh  
    priorityName?: string;     // from DOITUONGUUTIEN.TenDoiTuong
    majorName?: string;        // from NGANHHOC.TenNganh
    facultyName?: string;      // from KHOA.TenKhoa
}

// Interfaces for dropdown data
export interface Major {
    maNganh?: string;    // Keep camelCase for backward compatibility
    tenNganh?: string;
    maKhoa?: string;
    tenKhoa?: string;
    // Actual fields from backend (lowercase)
    manganh: string;
    tennganh: string;
    makhoa: string;
    tenkhoa: string;
}

export interface PriorityGroup {
    maDoiTuong?: string; // Keep camelCase for backward compatibility
    tenDoiTuong?: string;
    mucGiamHocPhi?: number;
    // Actual fields from backend (lowercase)
    madoituong: string;
    tendoituong: string;
    mucgiamhocphi: number;
}

export interface Province {
    maTinh?: string;     // Keep camelCase for backward compatibility
    tenTinh?: string;
    // Actual fields from backend (lowercase)
    matinh: string;
    tentinh: string;
}

export interface District {
    maHuyen?: string;    // Keep camelCase for backward compatibility
    tenHuyen?: string;
    maTinh?: string;
    // Actual fields from backend (lowercase)
    mahuyen: string;
    tenhuyen: string;
    matinh: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const studentApi = {
    getStudents: async (): Promise<Student[]> => {
        const { data } = await axiosInstance.get<ApiResponse<Student[]>>('/academic/students');
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    createStudent: async (student: Omit<Student, 'id'>): Promise<Student> => {
        const { data } = await axiosInstance.post<ApiResponse<Student>>('/academic/students', student);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to create student');
        }
        return data.data;
    },

    updateStudent: async (id: string, student: Student): Promise<Student> => {
        const { data } = await axiosInstance.put<ApiResponse<Student>>(`/academic/students/${id}`, student);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to update student');
        }
        return data.data;
    },

    deleteStudent: async (id: string): Promise<void> => {
        const { data } = await axiosInstance.delete<ApiResponse<void>>(`/academic/students/${id}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to delete student');
        }
    },

    searchStudents: async (query: string): Promise<Student[]> => {
        const { data } = await axiosInstance.get<ApiResponse<Student[]>>('/academic/students/search', {
            params: { query }
        });
        if (!data || !data.success) {
            throw new Error(data?.message || 'No data received from server');
        }
        return data.data || [];
    },

    // Dropdown data APIs
    getMajors: async (): Promise<Major[]> => {
        const { data } = await axiosInstance.get<ApiResponse<Major[]>>('/academic/majors');
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to fetch majors');
        }
        return data.data || [];
    },

    getPriorityGroups: async (): Promise<PriorityGroup[]> => {
        const { data } = await axiosInstance.get<ApiResponse<PriorityGroup[]>>('/academic/priority-groups');
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to fetch priority groups');
        }
        return data.data || [];
    },

    getProvinces: async (): Promise<Province[]> => {
        const { data } = await axiosInstance.get<ApiResponse<Province[]>>('/academic/provinces');
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to fetch provinces');
        }
        return data.data || [];
    },

    getDistrictsByProvince: async (provinceId: string): Promise<District[]> => {
        const { data } = await axiosInstance.get<ApiResponse<District[]>>(`/academic/districts/province/${provinceId}`);
        if (!data || !data.success) {
            throw new Error(data?.message || 'Failed to fetch districts');
        }
        return data.data || [];
    },

    // Lấy dữ liệu form sinh viên
    getStudentFormData: async (): Promise<any> => {
        try {
            const response = await axiosInstance.get('/academic/students/form-data');
            return response.data;
        } catch (error) {
            console.error('Error fetching student form data:', error);
            throw error;
        }
    },

    // Tạo hàng loạt PHIEUDANGKY
    createBulkRegistrations: async (studentIds: string[], semesterId: string, maxCredits: number): Promise<any> => {
        try {
            const response = await axiosInstance.post('/academic/students/bulk-registration', {
                studentIds,
                semesterId,
                maxCredits
            });
            return response.data;
        } catch (error) {
            console.error('Error creating bulk registrations:', error);
            throw error;
        }
    },

    // Kiểm tra trạng thái đăng ký của sinh viên
    checkRegistrationStatus: async (studentId: string, semesterId: string): Promise<any> => {
        try {
            const response = await axiosInstance.get(`/academic/students/registration-status?studentId=${studentId}&semesterId=${semesterId}`);
            return response.data;
        } catch (error) {
            console.error('Error checking registration status:', error);
            throw error;
        }
    },

    // Lấy danh sách tất cả học kỳ
    getSemesters: async (): Promise<any> => {
        try {
            const response = await axiosInstance.get('/academic/students/semesters');
            return response.data;
        } catch (error) {
            console.error('Error fetching semesters:', error);
            throw error;
        }
    },

    // Lấy học kỳ hiện tại (đang mở đăng ký)
    getCurrentSemester: async (): Promise<string> => {
        try {
            const { data } = await axiosInstance.get<ApiResponse<string>>('/academic/students/current-semester');
            return data.data;
        } catch (error) {
            console.error('Error fetching current semester:', error);
            throw error;
        }
    },

    // Kiểm tra trạng thái PHIEUDANGKY của sinh viên cho học kỳ hiện tại
    checkStudentRegistrationStatus: async (studentId: string, semesterId: string): Promise<boolean> => {
        try {
            const { data } = await axiosInstance.get<ApiResponse<{hasRegistration: boolean}>>(`/academic/students/registration-status?studentId=${studentId}&semesterId=${semesterId}`);
            return data.data.hasRegistration;
        } catch (error) {
            console.error('Error checking student registration status:', error);
            return false;
        }
    },
};

// API client cho student
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/student';

export async function getEnrolledSubjects(studentId: string) {
  const res = await fetch(`${API_BASE}/enrolled-subjects?studentId=${studentId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được danh sách môn đã đăng ký');
  return res.json();
}

export async function unenrollSubject(studentId: string, subjectId: string) {
  const res = await fetch(`${API_BASE}/enrolled-subjects/${subjectId}?studentId=${studentId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Hủy đăng ký môn học thất bại');
  return res.json();
}

// Lấy danh sách môn học có thể đăng ký
export async function getAvailableSubjects(studentId: string) {
  const res = await fetch(`${API_BASE}/available-subjects?studentId=${studentId}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không lấy được danh sách môn có thể đăng ký');
  return res.json();
}

// Đăng ký môn học mới
export async function enrollSubject(studentId: string, subjectId: string) {
  const res = await fetch(`${API_BASE}/enrolled-subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ studentId, subjectId }),
  });
  if (!res.ok) throw new Error('Đăng ký môn học thất bại');
  return res.json();
}