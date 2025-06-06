import { StudentSubjectReq, RequestStatus } from '../../models/academic_related/studentSubjectReq';
import { Database } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database.error';

export class StudentSubjectReqService {
    static async getAllRequests(): Promise<StudentSubjectReq[]> {
        try {
            const query = 'SELECT * FROM student_subject_requests ORDER BY request_date DESC';
            return await Database.query(query);
        } catch (error) {
            throw new DatabaseError('Error fetching student subject requests');
        }
    }

    static async getRequestById(id: number): Promise<StudentSubjectReq | null> {
        try {
            const query = 'SELECT * FROM student_subject_requests WHERE id = $1';
            const result = await Database.query(query, [id]);
            return result[0] || null;
        } catch (error) {
            throw new DatabaseError('Error fetching student subject request by ID');
        }
    }

    static async createRequest(requestData: Omit<StudentSubjectReq, 'id'>): Promise<StudentSubjectReq> {
        try {
            const query = `
                INSERT INTO student_subject_requests (
                    student_id, student_name, type, subject_code,
                    subject_name, request_date, reason, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
            `;
            const result = await Database.query(query, [
                requestData.studentId,
                requestData.studentName,
                requestData.type,
                requestData.subjectCode,
                requestData.subjectName,
                requestData.requestDate,
                requestData.reason,
                requestData.status
            ]);
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error creating student subject request');
        }
    }

    static async updateRequestStatus(id: number, status: RequestStatus): Promise<StudentSubjectReq> {
        try {
            const query = `
                UPDATE student_subject_requests 
                SET status = $1
                WHERE id = $2
                RETURNING *
            `;
            const result = await Database.query(query, [status, id]);
            if (!result[0]) {
                throw new Error('Request not found');
            }
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error updating student subject request status');
        }
    }

    static async getRequestsByStudentId(studentId: string): Promise<StudentSubjectReq[]> {
        try {
            const query = 'SELECT * FROM student_subject_requests WHERE student_id = $1 ORDER BY request_date DESC';
            return await Database.query(query, [studentId]);
        } catch (error) {
            throw new DatabaseError('Error fetching student subject requests by student ID');
        }
    }

    static async getRequestsByStatus(status: RequestStatus): Promise<StudentSubjectReq[]> {
        try {
            const query = 'SELECT * FROM student_subject_requests WHERE status = $1 ORDER BY request_date DESC';
            return await Database.query(query, [status]);
        } catch (error) {
            throw new DatabaseError('Error fetching student subject requests by status');
        }
    }
} 