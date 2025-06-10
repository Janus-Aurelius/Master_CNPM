import { DatabaseService } from '../database/databaseService';
import { DatabaseError } from '../../utils/errors/database.error';

export interface Program {
    id: number;
    maNganh: string;
    maMonHoc: string;
    maHocKy: string;
    ghiChu?: string;
}

export class ProgramService {
    static async getAllPrograms(): Promise<Program[]> {
        try {
            const result = await DatabaseService.query(
                `SELECT * FROM chuongtrinhhoc ORDER BY maNganh, maHocKy`
            );
            return result;
        } catch (error) {
            console.error('Error in getAllPrograms:', error);
            throw new DatabaseError('Failed to fetch programs');
        }
    }

    static async getProgramById(id: number): Promise<Program | null> {
        try {
            const result = await DatabaseService.query(
                `SELECT * FROM chuongtrinhhoc WHERE id = $1`,
                [id]
            );
            return result[0] || null;
        } catch (error) {
            console.error('Error in getProgramById:', error);
            throw new DatabaseError('Failed to fetch program');
        }
    }

    static async createProgram(program: Omit<Program, 'id'>): Promise<Program> {
        try {
            const result = await DatabaseService.query(
                `INSERT INTO chuongtrinhhoc (maNganh, maMonHoc, maHocKy, ghiChu)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [program.maNganh, program.maMonHoc, program.maHocKy, program.ghiChu]
            );
            return result[0];
        } catch (error) {
            console.error('Error in createProgram:', error);
            throw new DatabaseError('Failed to create program');
        }
    }

    static async updateProgram(
        maNganh: string,
        maMonHoc: string,
        maHocKy: string,
        program: Partial<Program>
    ): Promise<Program | null> {
        try {
            // Build dynamic SET clause
            const fields = [];
            const values = [];
            let idx = 1;

            if (program.ghiChu !== undefined) {
                fields.push(`ghiChu = $${idx++}`);
                values.push(program.ghiChu);
            }
            if (program.maNganh !== undefined) {
                fields.push(`maNganh = $${idx++}`);
                values.push(program.maNganh);
            }
            if (program.maMonHoc !== undefined) {
                fields.push(`maMonHoc = $${idx++}`);
                values.push(program.maMonHoc);
            }
            if (program.maHocKy !== undefined) {
                fields.push(`maHocKy = $${idx++}`);
                values.push(program.maHocKy);
            }
            // Add more fields if needed

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            // Add composite key to values
            values.push(maNganh, maMonHoc, maHocKy);

            const sql = `
                UPDATE chuongtrinhhoc
                SET ${fields.join(', ')}
                WHERE maNganh = $${idx++} AND maMonHoc = $${idx++} AND maHocKy = $${idx}
                RETURNING *
            `;

            const result = await DatabaseService.query(sql, values);
            return result[0] || null;
        } catch (error) {
            console.error('Error in updateProgram:', error);
            throw new DatabaseError('Failed to update program');
        }
    }

    static async deleteProgram(maNganh: string, maMonHoc: string, maHocKy: string): Promise<void> {
        try {
            const query = `
                DELETE FROM chuongtrinhhoc 
                WHERE manganh = $1 AND mamonhoc = $2 AND mahocky = $3
                RETURNING *
            `;
            const result = await DatabaseService.query(query, [maNganh, maMonHoc, maHocKy]);
            
            if (result.length === 0) {
                throw new DatabaseError('Program not found');
            }
        } catch (error) {
            console.error('Error in deleteProgram:', error);
            throw new DatabaseError('Failed to delete program');
        }
    }

    static async getProgramsByNganh(maNganh: string): Promise<Program[]> {
        try {
            const result = await DatabaseService.query(
                `SELECT * FROM chuongtrinhhoc WHERE maNganh = $1 ORDER BY maHocKy`,
                [maNganh]
            );
            return result;
        } catch (error) {
            console.error('Error in getProgramsByNganh:', error);
            throw new DatabaseError('Failed to fetch programs by nganh');
        }
    }

    static async getProgramsByHocKy(maHocKy: string): Promise<Program[]> {
        try {
            const result = await DatabaseService.query(
                `SELECT * FROM chuongtrinhhoc WHERE maHocKy = $1 ORDER BY maNganh`,
                [maHocKy]
            );
            return result;
        } catch (error) {
            console.error('Error in getProgramsByHocKy:', error);
            throw new DatabaseError('Failed to fetch programs by hoc ky');
        }
    }
}