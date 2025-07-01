import axiosInstance from "../axios";
import { StudentInfo } from "../../types";
import { Subject } from "../../types";

export * from './enrollmentApi';
export { enrolledSubjectApi, getEnrolledSubjects as getEnrolledSubjectsFromApi, unenrollSubject as unenrollSubjectFromApi } from './enrolledSubjectApi';
export * from './dashboardApi';

interface ApiResponse<T> {
    data: T;
}

export const enrollmentApi = {
    getStudentInfo: async (): Promise<StudentInfo> => {
        const response = await axiosInstance.get<ApiResponse<StudentInfo>>('/student/info');
        return response.data.data;
    },
    getClassifiedSubjects: async (semesterId: string): Promise<{ required: Subject[], elective: Subject[] }> => {
        const response = await axiosInstance.get<ApiResponse<{ required: Subject[], elective: Subject[] }>>(`/student/subjects/classified?semesterId=${semesterId}`);
        return response.data.data;
    },
    getEnrolledSubjects: async (semesterId: string): Promise<Subject[]> => {
        const response = await axiosInstance.get<ApiResponse<Subject[]>>(`/student/enrolled-courses?semesterId=${semesterId}`);
        return response.data.data;
    },
    getCurrentSemester: async (): Promise<string> => {
        const response = await axiosInstance.get<ApiResponse<{ currentSemester: string }>>('/student/current-semester');
        return response.data.data.currentSemester;
    },
    checkRegistrationStatus: async (semesterId: string): Promise<{ hasRegistration: boolean }> => {
        const response = await axiosInstance.get<{ hasRegistration: boolean }>(`/student/registration-status?semesterId=${semesterId}`);
        return response.data;
    },
    registerSubject: async (courseId: string): Promise<{ success: boolean, message: string }> => {
        const response = await axiosInstance.post<{ success: boolean, message: string }>('/student/register-subject', { courseId });
        return response.data;
    }
};

export const parseSemesterInfo = (semesterId: string): { name: string, year: string, fullName: string } => {
    if (!semesterId || typeof semesterId !== 'string' || !semesterId.includes('_')) {
        return { name: 'N/A', year: 'N/A', fullName: 'Học kỳ không xác định' };
    }
    const parts = semesterId.split('_');
    const semesterName = `Học kỳ ${parts[0].replace('HK', '')}`;
    const year = parts[1];
    return {
        name: semesterName,
        year: year,
        fullName: `${semesterName} - Năm học ${year}`
    };
};
