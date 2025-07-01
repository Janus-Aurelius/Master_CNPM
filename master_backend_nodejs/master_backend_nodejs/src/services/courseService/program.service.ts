import { DatabaseService } from '../database/databaseService';
import { DatabaseError } from '../../utils/errors/database.error';
import { ValidationError } from '../../utils/errors/validation.error';

export interface Program {
    id: number;
    maNganh: string;
    maMonHoc: string;
    maHocKy: string;
    ghiChu?: string;
}

export class ProgramService {    static async getAllPrograms(): Promise<(Program & { thoiGianBatDau?: string, thoiGianKetThuc?: string, tenKhoa?: string, tenNganh?: string })[]> {
        try {
            const result = await DatabaseService.query(
                `SELECT cth.*, 
                        hknh.thoigianbatdau, 
                        hknh.thoigianketthuc,
                        k.tenkhoa,
                        nh.tennganh
                 FROM chuongtrinhhoc cth
                 LEFT JOIN hockynamhoc hknh ON cth.mahocky = hknh.mahocky
                 LEFT JOIN nganhhoc nh ON cth.manganh = nh.manganh
                 LEFT JOIN khoa k ON nh.makhoa = k.makhoa
                 ORDER BY cth.manganh, cth.mahocky`
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

    static async checkMonHocExists(maMonHoc: string): Promise<boolean> {
        try {
            const result = await DatabaseService.query(
                'SELECT 1 FROM monhoc WHERE mamonhoc = $1',
                [maMonHoc]
            );
            return result.length > 0;
        } catch (error) {
            console.error('Error checking monhoc:', error);
            throw new DatabaseError('Failed to check monhoc');
        }
    }

    static async checkHocKyExists(maHocKy: string): Promise<boolean> {
        try {
            const result = await DatabaseService.query(
                'SELECT 1 FROM hockynamhoc WHERE mahocky = $1',
                [maHocKy]
            );
            return result.length > 0;
        } catch (error) {
            console.error('Error checking hocky:', error);
            throw new DatabaseError('Failed to check hocky');
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
            throw error;
        }
    }

    static async updateProgram(
        maNganh: string,
        maMonHoc: string,
        maHocKy: string,
        program: Partial<Program>
    ): Promise<Program | null> {
        try {
            await DatabaseService.query('BEGIN');

            // 1. Kiểm tra bản ghi cũ
            const existingProgram = await DatabaseService.query(
                `SELECT * FROM chuongtrinhhoc 
                 WHERE maNganh = $1 AND maMonHoc = $2 AND maHocKy = $3`,
                [maNganh, maMonHoc, maHocKy]
            );
            
            if (existingProgram.length === 0) {
                await DatabaseService.query('ROLLBACK');
                throw new DatabaseError('Program not found');
            }

            // 3. Xóa bản ghi cũ
            await DatabaseService.query(
                `DELETE FROM chuongtrinhhoc 
                 WHERE maNganh = $1 AND maMonHoc = $2 AND maHocKy = $3`,
                [maNganh, maMonHoc, maHocKy]
            );

            // 4. Thêm bản ghi mới với thông tin mới
            const newProgram = await DatabaseService.query(
                `INSERT INTO chuongtrinhhoc (maNganh, maMonHoc, maHocKy, ghiChu)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [
                    program.maNganh || maNganh,
                    program.maMonHoc || maMonHoc,
                    program.maHocKy || maHocKy,
                    program.ghiChu || existingProgram[0].ghiChu
                ]
            );

            await DatabaseService.query('COMMIT');
            return newProgram[0];
        } catch (error) {
            await DatabaseService.query('ROLLBACK');
            console.error('Error in updateProgram:', error);
            throw error;
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