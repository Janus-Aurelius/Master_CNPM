import { IAcademicRequest } from '../../models/student_related/studentDashboardInterface';

// TODO: Replace with actual database implementation
const requests: IAcademicRequest[] = [];

export const academicRequestService = {
    async createRequest(requestData: Omit<IAcademicRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAcademicRequest> {
        // TODO: Implement database insert
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
        // TODO: Implement database query
        return requests.filter(req => req.studentId === studentId);
    },

    async updateRequestStatus(requestId: string, status: IAcademicRequest['status'], actionBy: string): Promise<IAcademicRequest | null> {
        // TODO: Implement database update
        const request = requests.find(req => req.id === requestId);
        if (request) {
            request.status = status;
            request.updatedAt = new Date();
            request.actionBy = actionBy;
            return request;
        }
        return null;
    },

    async getRequestHistory(studentId: string): Promise<IAcademicRequest[]> {
        // TODO: Implement database query
        return requests
            .filter(req => req.studentId === studentId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
}; 