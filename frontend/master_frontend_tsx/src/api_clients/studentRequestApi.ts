import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export enum RequestType {
    ADD = "Thêm học phần",
    DELETE = "Xóa học phần"
}

export enum RequestStatus {
    PENDING = "Chờ xử lý",
    APPROVED = "Đã duyệt",
    REJECTED = "Từ chối"
}

export interface Request {
    id: number;
    studentId: string;
    studentName: string;
    type: RequestType;
    subjectCode: string;
    subjectName: string;
    requestDate: string;
    reason: string;
    status: RequestStatus;
}

export const studentRequestApi = {
    getRequests: async (): Promise<Request[]> => {
        const response = await axios.get(`${API_URL}/academic/studentSubjectReq`);
        return response.data as Request[];
    },

    approveRequest: async (id: number): Promise<Request> => {
        const response = await axios.patch(`${API_URL}/student-requests/${id}/approve`);
        return response.data as Request;
    },

    rejectRequest: async (id: number): Promise<Request> => {
        const response = await axios.patch(`${API_URL}/student-requests/${id}/reject`);
        return response.data as Request;
    },

    getRequestDetails: async (id: number): Promise<Request> => {
        const response = await axios.get(`${API_URL}/academic/studentSubjectReq/${id}`);
        return response.data as Request;
    }
}; 