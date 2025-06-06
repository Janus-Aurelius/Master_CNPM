import { IAcademicRequest } from '../../models/student_related/studentDashboardInterface';

// Mock data for academic requests
const requests: IAcademicRequest[] = [
    {
        id: '1',
        studentId: 'SV001',
        type: 'course_registration',
        status: 'approved',
        description: 'Đăng ký thêm môn học Mạng máy tính ngoài thời gian đăng ký chính thức',
        createdAt: new Date('2025-05-20'),
        updatedAt: new Date('2025-05-22'),
        response: 'Phê duyệt đăng ký môn học',
        actionBy: 'academic_001'
    },
    {
        id: '2',
        studentId: 'SV001',
        type: 'grade_review',
        status: 'pending',
        description: 'Đề nghị xem xét lại điểm cuối kỳ môn Cơ sở dữ liệu',
        createdAt: new Date('2025-06-01'),
        updatedAt: new Date('2025-06-01')
    },
    {
        id: '3',
        studentId: 'SV001',
        type: 'academic_leave',
        status: 'rejected',
        description: 'Xin nghỉ học 2 tuần vì lý do cá nhân',
        createdAt: new Date('2025-04-15'),
        updatedAt: new Date('2025-04-16'),
        response: 'Thời gian nghỉ quá dài, vui lòng điều chỉnh thời gian nghỉ',
        actionBy: 'academic_002'
    },
    {
        id: '4',
        studentId: 'SV002',
        type: 'course_registration',
        status: 'approved',
        description: 'Đăng ký môn Trí tuệ nhân tạo',
        createdAt: new Date('2025-05-19'),
        updatedAt: new Date('2025-05-21'),
        response: 'Đã phê duyệt',
        actionBy: 'academic_001'
    }
];

export const academicRequestService = {
    async createRequest(requestData: Omit<IAcademicRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAcademicRequest> {
        const newRequest: IAcademicRequest = {
            ...requestData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        requests.push(newRequest);
        return newRequest;
    },

    async getStudentRequests(studentId: string): Promise<IAcademicRequest[]> {
        return requests.filter(req => req.studentId === studentId);
    },

    async updateRequestStatus(requestId: string, status: IAcademicRequest['status'], actionBy: string, response?: string): Promise<IAcademicRequest | null> {
        const request = requests.find(req => req.id === requestId);
        if (request) {
            request.status = status;
            request.updatedAt = new Date();
            request.actionBy = actionBy;
            if (response) {
                request.response = response;
            }
            return request;
        }
        return null;
    },

    async getRequestHistory(studentId: string): Promise<IAcademicRequest[]> {
        return requests
            .filter(req => req.studentId === studentId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
};