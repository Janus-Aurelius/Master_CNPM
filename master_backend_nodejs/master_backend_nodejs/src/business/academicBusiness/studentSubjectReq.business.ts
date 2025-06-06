import { StudentSubjectReq, RequestStatus, RequestType } from '../../models/academic_related/studentSubjectReq';
import { ValidationError } from '../../utils/errors/validation.error';
import { StudentSubjectReqService } from '../../services/courseService/studentSubjectReq.service';

export class StudentSubjectReqBusiness {
    static async getAllRequests(): Promise<StudentSubjectReq[]> {
        return await StudentSubjectReqService.getAllRequests();
    }

    static async getRequestById(id: number): Promise<StudentSubjectReq | null> {
        return await StudentSubjectReqService.getRequestById(id);
    }

    static async createRequest(requestData: Omit<StudentSubjectReq, 'id'>): Promise<StudentSubjectReq> {
        const errors = this.validateRequestData(requestData);
        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }

        return await StudentSubjectReqService.createRequest(requestData);
    }

    static async updateRequestStatus(id: number, status: RequestStatus): Promise<StudentSubjectReq> {
        const request = await this.getRequestById(id);
        if (!request) {
            throw new ValidationError('Request not found');
        }

        if (request.status !== RequestStatus.PENDING) {
            throw new ValidationError('Can only update status of pending requests');
        }

        return await StudentSubjectReqService.updateRequestStatus(id, status);
    }

    static async getRequestsByStudentId(studentId: string): Promise<StudentSubjectReq[]> {
        if (!studentId) {
            throw new ValidationError('Student ID is required');
        }
        return await StudentSubjectReqService.getRequestsByStudentId(studentId);
    }

    static async getRequestsByStatus(status: RequestStatus): Promise<StudentSubjectReq[]> {
        return await StudentSubjectReqService.getRequestsByStatus(status);
    }

    private static validateRequestData(requestData: Partial<StudentSubjectReq>): string[] {
        const errors: string[] = [];
        
        if (!requestData.studentId) errors.push('Student ID is required');
        if (!requestData.studentName) errors.push('Student name is required');
        if (!requestData.type || !Object.values(RequestType).includes(requestData.type)) {
            errors.push('Valid request type is required');
        }
        if (!requestData.subjectCode) errors.push('Subject code is required');
        if (!requestData.subjectName) errors.push('Subject name is required');
        if (!requestData.requestDate) errors.push('Request date is required');
        if (!requestData.reason) errors.push('Reason is required');
        if (!requestData.status || !Object.values(RequestStatus).includes(requestData.status)) {
            errors.push('Valid status is required');
        }

        return errors;
    }
} 