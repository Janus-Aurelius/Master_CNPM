import { ISubject, ISubjectType } from '../../models/academic_related/subject';
import { Database } from '../../config/database';

export class SubjectBusiness {
    static async getAllSubjects(): Promise<ISubject[]> {
        const query = `
            SELECT 
                m.MaMonHoc as "subjectId",
                m.TenMonHoc as "subjectName",
                m.MaLoaiMon as "subjectTypeId",
                m.SoTiet as "totalHours",
                l.TenLoaiMon as "subjectTypeName",
                l.SoTietMotTC as "hoursPerCredit",
                l.SoTienMotTC as "costPerCredit"
            FROM MONHOC m
            JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon
            ORDER BY m.MaMonHoc`;
        return await Database.query(query);
    }

    static async getSubjectById(id: string): Promise<ISubject | null> {
        const query = `
            SELECT 
                m.MaMonHoc as "subjectId",
                m.TenMonHoc as "subjectName",
                m.MaLoaiMon as "subjectTypeId",
                m.SoTiet as "totalHours",
                l.TenLoaiMon as "subjectTypeName",
                l.SoTietMotTC as "hoursPerCredit",
                l.SoTienMotTC as "costPerCredit"
            FROM MONHOC m
            JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon
            WHERE m.MaMonHoc = $1`;
        const result = await Database.query(query, [id]);
        return result[0] || null;
    }

    static async createSubject(subjectData: Partial<ISubject>): Promise<ISubject> {
        const query = `
            INSERT INTO MONHOC (MaMonHoc, TenMonHoc, MaLoaiMon, SoTiet)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;
        const result = await Database.query(query, [
            subjectData.subjectId,
            subjectData.subjectName,
            subjectData.subjectTypeId,
            subjectData.totalHours
        ]);
        return result[0];
    }

    static async updateSubject(id: string, subjectData: Partial<ISubject>): Promise<ISubject> {
        const query = `
            UPDATE MONHOC 
            SET TenMonHoc = $1, MaLoaiMon = $2, SoTiet = $3
            WHERE MaMonHoc = $4
            RETURNING *`;
        const result = await Database.query(query, [
            subjectData.subjectName,
            subjectData.subjectTypeId,
            subjectData.totalHours,
            id
        ]);
        return result[0];
    }

    static async deleteSubject(id: string): Promise<void> {
        const query = 'DELETE FROM MONHOC WHERE MaMonHoc = $1';
        await Database.query(query, [id]);
    }

    static validateSubjectData(subjectData: Partial<ISubject>): string[] {
        const errors: string[] = [];
        
        if (!subjectData.subjectId) errors.push('Subject ID is required');
        if (!subjectData.subjectName) errors.push('Subject name is required');
        if (!subjectData.subjectTypeId) errors.push('Subject type is required');
        if (!subjectData.totalHours) errors.push('Total hours is required');

        return errors;
    }

    static async checkScheduleConflicts(subjectData: Partial<ISubject>): Promise<string[]> {
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