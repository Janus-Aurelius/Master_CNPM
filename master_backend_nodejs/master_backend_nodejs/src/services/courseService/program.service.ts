import Program from '../../models/academic_related/program';
import { Database } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database.error';

export class ProgramService {
    static async getAllPrograms(): Promise<Program[]> {
        try {
            const query = 'SELECT * FROM programs ORDER BY id';
            return await Database.query(query);
        } catch (error) {
            throw new DatabaseError('Error fetching programs');
        }
    }

    static async getProgramById(id: string): Promise<Program | null> {
        try {
            const query = 'SELECT * FROM programs WHERE id = $1';
            const result = await Database.query(query, [id]);
            return result[0] || null;
        } catch (error) {
            throw new DatabaseError('Error fetching program by ID');
        }
    }

    static async createProgram(programData: Omit<Program, 'id'>): Promise<Program> {
        try {
            const query = `
                INSERT INTO programs (
                    name_year, department, major, 
                    course_list, total_credit, status
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            const result = await Database.query(query, [
                programData.name_year,
                programData.department,
                programData.major,
                JSON.stringify(programData.courseList),
                programData.totalCredit,
                programData.status
            ]);
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error creating program');
        }
    }    static async updateProgram(id: string, programData: Partial<Program>): Promise<Program> {
        try {
            const query = `
                UPDATE programs 
                SET name_year = COALESCE($1, name_year), 
                    department = COALESCE($2, department), 
                    major = COALESCE($3, major),
                    course_list = COALESCE($4, course_list), 
                    total_credit = COALESCE($5, total_credit), 
                    status = COALESCE($6, status)
                WHERE id = $7
                RETURNING *
            `;
            const result = await Database.query(query, [
                programData.name_year,
                programData.department,
                programData.major,
                programData.courseList ? JSON.stringify(programData.courseList) : null,
                programData.totalCredit,
                programData.status,
                id
            ]);
            if (!result[0]) {
                throw new Error('Program not found');
            }
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error updating program');
        }
    }

    static async deleteProgram(id: string): Promise<void> {
        try {
            const query = 'DELETE FROM programs WHERE id = $1 RETURNING id';
            const result = await Database.query(query, [id]);
            if (!result[0]) {
                throw new Error('Program not found');
            }        } catch (error) {
            throw new DatabaseError('Error deleting program');
        }
    }

    static async getProgramsByDepartment(department: string): Promise<Program[]> {
        try {
            const query = 'SELECT * FROM programs WHERE department = $1 ORDER BY name_year';
            return await Database.query(query, [department]);
        } catch (error) {
            throw new DatabaseError('Error fetching programs by department');
        }
    }

    static async getProgramsByStatus(status: string): Promise<Program[]> {
        try {
            const query = 'SELECT * FROM programs WHERE status = $1 ORDER BY name_year';
            return await Database.query(query, [status]);
        } catch (error) {
            throw new DatabaseError('Error fetching programs by status');
        }
    }

    static async updateProgramStatus(id: string, status: string): Promise<Program> {
        try {
            const query = `
                UPDATE programs 
                SET status = $1
                WHERE id = $2
                RETURNING *
            `;
            const result = await Database.query(query, [status, id]);
            if (!result[0]) {
                throw new Error('Program not found');
            }
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error updating program status');
        }
    }
}