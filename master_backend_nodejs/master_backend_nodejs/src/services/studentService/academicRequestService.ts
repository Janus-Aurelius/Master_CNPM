import { IAcademicRequest } from '../../models/student_related/studentDashboardInterface';
import { DatabaseService } from '../database/databaseService';

export const academicRequestService = {
    async createRequest(requestData: Omit<IAcademicRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAcademicRequest> {
            const requestId = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            const insertedRequest = await DatabaseService.queryOne(`
                INSERT INTO academic_requests (
                id, student_id, type, status, description, created_at, updated_at, response, action_by
            ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6, $7)
                RETURNING *
        `, [requestId, requestData.studentId, requestData.type, requestData.status, requestData.description, requestData.response, requestData.actionBy]);
        return insertedRequest;
    },
    async getRequestsByStudent(studentId: string): Promise<IAcademicRequest[]> {
        return await DatabaseService.query(`SELECT * FROM academic_requests WHERE student_id = $1 ORDER BY created_at DESC`, [studentId]);
    },
    async updateRequestStatus(requestId: string, status: string, response?: string, actionBy?: string): Promise<boolean> {
        try {
            await DatabaseService.query(`UPDATE academic_requests SET status = $1, response = $2, action_by = $3, updated_at = NOW() WHERE id = $4`, [status, response, actionBy, requestId]);
            return true;
        } catch {
            return false;
        }
    }
};