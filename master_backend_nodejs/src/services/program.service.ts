import { Program } from '../models/academic_related/program';
import { Database } from '../config/database';
import { DatabaseError } from '../utils/errors/database.error';

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
    }

    static async updateProgram(id: string, programData: Partial<Program>): Promise<Program> {
        try {
            const query = `
                UPDATE programs 
                SET name_year = $1, department = $2, major = $3,
                    course_list = $4, total_credit = $5, status = $6
                WHERE id = $7
                RETURNING *
            `;
            const result = await Database.query(query, [
                programData.name_year,
                programData.department,
                programData.major,
                JSON.stringify(programData.courseList),
                programData.totalCredit,
                programData.status,
                id
            ]);
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error updating program');
        }
    }

    static async deleteProgram(id: string): Promise<void> {
        try {
            const query = 'DELETE FROM programs WHERE id = $1';
            await Database.query(query, [id]);
        } catch (error) {
            throw new DatabaseError('Error deleting program');
        }
    }
} 