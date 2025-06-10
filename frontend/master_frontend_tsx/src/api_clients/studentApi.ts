import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Student {
    id: string;
    studentId: string;
    name: string;
    email: string;
    faculty: string;
    program: string;
    enrollmentYear: string;
    status: string;
    phone: string;
    dob: string;
    address: string;
    avatar?: string;
    gender?: string;
    hometown?: string;
    targetGroup?: string;
}

export const studentApi = {
    getStudents: async (): Promise<Student[]> => {
        const response = await axios.get(`${API_URL}/students`);
        return response.data as Student[];
    },

    createStudent: async (student: Omit<Student, 'id'>): Promise<Student> => {
        const response = await axios.post(`${API_URL}/students`, student);
        return response.data as Student;
    },

    updateStudent: async (id: string, student: Student): Promise<Student> => {
        const response = await axios.put(`${API_URL}/students/${id}`, student);
        return response.data as Student;
    },

    deleteStudent: async (id: string): Promise<void> => {
        await axios.delete(`${API_URL}/students/${id}`);
    },

    searchStudents: async (query: string): Promise<Student[]> => {
        const response = await axios.get(`${API_URL}/students/search`, {
            params: { query }
        });
        return response.data as Student[];
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