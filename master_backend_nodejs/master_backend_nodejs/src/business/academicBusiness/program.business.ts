import Program from '../../models/academic_related/program';
import { Database } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database.error';
import { ValidationError } from '../../utils/errors/validation.error';
import * as XLSX from 'xlsx';

export class ProgramBusiness {
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
        const errors = this.validateProgramData(programData);
        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }

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
        const existingProgram = await this.getProgramById(id);
        if (!existingProgram) {
            throw new ValidationError('Program not found');
        }

        const errors = this.validateProgramData({ ...existingProgram, ...programData });
        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }

        try {
            const query = `
                UPDATE programs 
                SET name_year = $1, department = $2, major = $3,
                    course_list = $4, total_credit = $5, status = $6
                WHERE id = $7
                RETURNING *
            `;
            const result = await Database.query(query, [
                programData.name_year || existingProgram.name_year,
                programData.department || existingProgram.department,
                programData.major || existingProgram.major,
                JSON.stringify(programData.courseList || existingProgram.courseList),
                programData.totalCredit || existingProgram.totalCredit,
                programData.status || existingProgram.status,
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

    static validateProgramData(programData: Partial<Program>): string[] {
        const errors: string[] = [];
        
        if (!programData.name_year) errors.push('Program name and year is required');
        if (!programData.department) errors.push('Department is required');
        if (!programData.major) errors.push('Major is required');
        if (!programData.courseList || !Array.isArray(programData.courseList)) {
            errors.push('Course list must be an array');
        }
        if (typeof programData.totalCredit !== 'number' || programData.totalCredit <= 0) {
            errors.push('Total credit must be a positive number');
        }
        if (!programData.status || !['active', 'inactive'].includes(programData.status)) {
            errors.push('Status must be either active or inactive');
        }

        return errors;
    }

    static async processExcelData(file: Express.Multer.File): Promise<Program[]> {
        try {
            const workbook = XLSX.read(file.buffer);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            const programs: Program[] = [];
            for (const row of data) {
                const program = this.mapExcelRowToProgram(row);
                const errors = this.validateProgramData(program);
                if (errors.length > 0) {
                    throw new ValidationError(`Invalid program data: ${errors.join(', ')}`);
                }
                programs.push(await this.createProgram(program));
            }
            return programs;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new Error('Error processing Excel file');
        }
    }

    private static mapExcelRowToProgram(row: any): Omit<Program, 'id'> {
        return {
            name_year: row['Program Name and Year'],
            department: row['Department'],
            major: row['Major'],
            courseList: row['Course List'].split(',').map((course: string) => course.trim()),
            totalCredit: parseInt(row['Total Credits']),
            status: row['Status'].toLowerCase()
        };
    }
} 