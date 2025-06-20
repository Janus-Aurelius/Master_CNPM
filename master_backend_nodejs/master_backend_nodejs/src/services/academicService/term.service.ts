import ISemester, { ISemesterCreate } from '../../models/academic_related/semester';
import { db } from '../../config/database';

export const semesterService = {
    getAllSemesters: async (): Promise<ISemester[]> => {
        try {
            const result = await db.query(`
                SELECT 
                    MaHocKy as semesterId,
                    HocKyThu as termNumber,
                    ThoiGianBatDau as startDate,
                    ThoiGianKetThuc as endDate,
                    TrangThaiHocKy as status,
                    NamHoc as academicYear,
                    ThoiHanDongHP as feeDeadline
                FROM HOCKYNAMHOC
                ORDER BY NamHoc DESC, HocKyThu DESC
            `);
            
            return result.rows.map(row => ({
                semesterId: row.semesterid,
                termNumber: row.termnumber,
                startDate: row.startdate,
                endDate: row.enddate,
                status: row.status,
                academicYear: row.academicyear,
                feeDeadline: row.feedeadline
            }));
        } catch (error) {
            console.error('Error fetching semesters:', error);
            throw new Error('Failed to fetch semesters');
        }
    },

    getSemesterById: async (id: string): Promise<ISemester | null> => {
        try {
            const result = await db.query(`
                SELECT 
                    MaHocKy as semesterId,
                    HocKyThu as termNumber,
                    ThoiGianBatDau as startDate,
                    ThoiGianKetThuc as endDate,
                    TrangThaiHocKy as status,
                    NamHoc as academicYear,
                    ThoiHanDongHP as feeDeadline
                FROM HOCKYNAMHOC
                WHERE MaHocKy = $1
            `, [id]);
            
            if (result.rows.length === 0) return null;
            
            const row = result.rows[0];
            return {
                semesterId: row.semesterid,
                termNumber: row.termnumber,
                startDate: row.startdate,
                endDate: row.enddate,
                status: row.status,
                academicYear: row.academicyear,
                feeDeadline: row.feedeadline
            };
        } catch (error) {
            console.error('Error fetching semester by ID:', error);
            throw new Error('Failed to fetch semester');
        }
    },

    createSemester: async (semester: ISemesterCreate): Promise<ISemester> => {
        try {
            const result = await db.query(
                `INSERT INTO HOCKYNAMHOC (MaHocKy, HocKyThu, ThoiGianBatDau, ThoiGianKetThuc, TrangThaiHocKy, NamHoc, ThoiHanDongHP) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [semester.semesterId, semester.termNumber, semester.startDate, semester.endDate, semester.status, semester.academicYear, semester.feeDeadline]
            );
            
            const row = result.rows[0];
            return {
                semesterId: row.mahocky,
                termNumber: row.hockyth,
                startDate: row.thoigianbatdau,
                endDate: row.thoigianketthuc,
                status: row.trangthanhocky,
                academicYear: row.namhoc,
                feeDeadline: row.thoihandonghp
            };
        } catch (error) {
            console.error('Error in createSemester:', error);
            throw new Error('Failed to create semester');
        }
    },

    updateSemester: async (id: string, semester: ISemester): Promise<ISemester> => {
        try {
            const result = await db.query(
                `UPDATE HOCKYNAMHOC SET 
                    HocKyThu = $2, ThoiGianBatDau = $3, ThoiGianKetThuc = $4, 
                    TrangThaiHocKy = $5, NamHoc = $6, ThoiHanDongHP = $7
                 WHERE MaHocKy = $1 RETURNING *`,
                [id, semester.termNumber, semester.startDate, semester.endDate, semester.status, semester.academicYear, semester.feeDeadline]
            );
            
            if (result.rows.length === 0) {
                throw new Error('Semester not found');
            }
            
            const row = result.rows[0];
            return {
                semesterId: row.mahocky,
                termNumber: row.hockyth,
                startDate: row.thoigianbatdau,
                endDate: row.thoigianketthuc,
                status: row.trangthanhocky,
                academicYear: row.namhoc,
                feeDeadline: row.thoihandonghp
            };
        } catch (error) {
            console.error('Error in updateSemester:', error);
            throw new Error('Failed to update semester');
        }
    },

    deleteSemester: async (id: string): Promise<void> => {
        try {
            const result = await db.query('DELETE FROM HOCKYNAMHOC WHERE MaHocKy = $1', [id]);
            if (result.rowCount === 0) {
                throw new Error('Semester not found');
            }
        } catch (error) {
            console.error('Error in deleteSemester:', error);
            throw new Error('Failed to delete semester');
        }
    },

    searchSemesters: async (searchTerm: string): Promise<ISemester[]> => {
        try {
            const result = await db.query(`
                SELECT 
                    MaHocKy as semesterId,
                    HocKyThu as termNumber,
                    ThoiGianBatDau as startDate,
                    ThoiGianKetThuc as endDate,
                    TrangThaiHocKy as status,
                    NamHoc as academicYear,
                    ThoiHanDongHP as feeDeadline
                FROM HOCKYNAMHOC
                WHERE MaHocKy ILIKE $1 OR TrangThaiHocKy ILIKE $1 OR CAST(NamHoc AS TEXT) ILIKE $1
                ORDER BY NamHoc DESC, HocKyThu DESC
            `, [`%${searchTerm}%`]);
            
            return result.rows.map(row => ({
                semesterId: row.semesterid,
                termNumber: row.termnumber,
                startDate: row.startdate,
                endDate: row.enddate,
                status: row.status,
                academicYear: row.academicyear,
                feeDeadline: row.feedeadline
            }));
        } catch (error) {
            console.error('Error searching semesters:', error);
            throw new Error('Failed to search semesters');
        }
    },

    getSemestersByYear: async (academicYear: number): Promise<ISemester[]> => {
        try {
            const result = await db.query(`
                SELECT 
                    MaHocKy as semesterId,
                    HocKyThu as termNumber,
                    ThoiGianBatDau as startDate,
                    ThoiGianKetThuc as endDate,
                    TrangThaiHocKy as status,
                    NamHoc as academicYear,
                    ThoiHanDongHP as feeDeadline
                FROM HOCKYNAMHOC
                WHERE NamHoc = $1
                ORDER BY HocKyThu DESC
            `, [academicYear]);
            
            return result.rows.map(row => ({
                semesterId: row.semesterid,
                termNumber: row.termnumber,
                startDate: row.startdate,
                endDate: row.enddate,
                status: row.status,
                academicYear: row.academicyear,
                feeDeadline: row.feedeadline
            }));
        } catch (error) {
            console.error('Error fetching semesters by year:', error);
            throw new Error('Failed to fetch semesters by year');
        }
    }
};
