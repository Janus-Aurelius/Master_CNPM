import { Subject } from '../../models/academic_related/subject';
import { Database } from '../../config/database';

export class SubjectBusiness {
    static async getAllSubjects(): Promise<Subject[]> {
        const query = 'SELECT * FROM subjects ORDER BY subject_code';
        return await Database.query(query);
    }

    static async getSubjectById(id: number): Promise<Subject | null> {
        const query = 'SELECT * FROM subjects WHERE id = $1';
        const result = await Database.query(query, [id]);
        return result[0] || null;
    }

    static async createSubject(subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subject> {
        const query = `
            INSERT INTO subjects (
                subject_code, name, credits, description, 
                prerequisite_subjects, type, department, 
                lecturer, schedule
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const result = await Database.query(query, [
            subjectData.subjectCode,
            subjectData.name,
            subjectData.credits,
            subjectData.description,
            JSON.stringify(subjectData.prerequisiteSubjects),
            subjectData.type,
            subjectData.department,
            subjectData.lecturer,
            JSON.stringify(subjectData.schedule)
        ]);
        return result[0];
    }

    static async updateSubject(id: number, subjectData: Partial<Subject>): Promise<Subject> {
        const query = `
            UPDATE subjects 
            SET subject_code = $1, name = $2, credits = $3, 
                description = $4, prerequisite_subjects = $5, 
                type = $6, department = $7
            WHERE id = $8
            RETURNING *
        `;
        const result = await Database.query(query, [
            subjectData.subjectCode,
            subjectData.name,
            subjectData.credits,
            subjectData.description,
            JSON.stringify(subjectData.prerequisiteSubjects),
            subjectData.type,
            subjectData.department,
            id
        ]);
        return result[0];
    }

    static async deleteSubject(id: number): Promise<void> {
        const query = 'DELETE FROM subjects WHERE id = $1';
        await Database.query(query, [id]);
    }

    static validateSubjectData(subjectData: Partial<Subject>): string[] {
        const errors: string[] = [];
        
        if (!subjectData.subjectCode) errors.push('Subject code is required');
        if (!subjectData.name) errors.push('Subject name is required');
        if (!subjectData.credits) errors.push('Credits is required');
        if (!subjectData.type) errors.push('Type is required');
        if (!subjectData.department) errors.push('Department is required');
        if (!subjectData.lecturer) errors.push('Lecturer is required');
        if (!subjectData.schedule?.day) errors.push('Day is required');
        if (!subjectData.schedule?.session) errors.push('Session is required');
        if (!subjectData.schedule?.fromTo) errors.push('Time is required');
        if (!subjectData.schedule?.room) errors.push('Room is required');

        return errors;
    }

    static async checkScheduleConflicts(subjectData: Partial<Subject>): Promise<string[]> {
        const conflicts: string[] = [];
        const query = `
            SELECT * FROM subjects 
            WHERE schedule->>'day' = $1 
            AND schedule->>'session' = $2 
            AND schedule->>'room' = $3
        `;
        const existingSubjects = await Database.query(query, [
            subjectData.schedule?.day,
            subjectData.schedule?.session,
            subjectData.schedule?.room
        ]);

        if (existingSubjects.length > 0) {
            conflicts.push('Schedule conflict: Room already booked for this time slot');
        }

        return conflicts;
    }
}