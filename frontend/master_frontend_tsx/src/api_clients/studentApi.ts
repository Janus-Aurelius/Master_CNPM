import axiosInstance from './axios';

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
    hometown: string;           // Sẽ chứa tên tỉnh
    districtId: string;         // Sẽ chứa tên huyện
    priorityObjectId: string;   // Sẽ chứa tên đối tượng ưu tiên
    majorId: string;            // Sẽ chứa tên ngành
    email?: string;
    phone?: string;
    status?: 'active' | 'inactive' | 'đang học' | 'thôi học';
    faculty?: string;           // Tên khoa
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
    }
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