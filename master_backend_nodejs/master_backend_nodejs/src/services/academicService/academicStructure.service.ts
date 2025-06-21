import { DatabaseService } from '../database/databaseService';
import { Faculty, Major, CourseType, District, Province, PriorityGroup } from '../../models/academic_related/academicStructure';

export class AcademicStructureService {
    
    // Faculty Services
    static async getAllFaculties(): Promise<Faculty[]> {
        try {
            const faculties = await DatabaseService.query(`
                SELECT 
                    MaKhoa as facultyId,
                    TenKhoa as facultyName
                FROM KHOA
                ORDER BY TenKhoa
            `);
            return faculties;
        } catch (error) {
            console.error('Error fetching faculties:', error);
            throw error;
        }
    }

    static async getFacultyById(facultyId: string): Promise<Faculty | null> {
        try {
            const faculty = await DatabaseService.queryOne(`
                SELECT 
                    MaKhoa as facultyId,
                    TenKhoa as facultyName
                FROM KHOA
                WHERE MaKhoa = $1
            `, [facultyId]);
            return faculty;
        } catch (error) {
            console.error('Error fetching faculty by id:', error);
            throw error;
        }
    }

    // Major Services
    static async getAllMajors(): Promise<Major[]> {
        try {            const majors = await DatabaseService.query(`
                SELECT 
                    ng.MaNganh as maNganh,
                    ng.TenNganh as tenNganh,
                    ng.MaKhoa as maKhoa,
                    k.TenKhoa as tenKhoa
                FROM NGANHHOC ng
                JOIN KHOA k ON ng.MaKhoa = k.MaKhoa
                ORDER BY k.TenKhoa, ng.TenNganh
            `);
            return majors;
        } catch (error) {
            console.error('Error fetching majors:', error);
            throw error;
        }
    }

    static async getMajorsByFaculty(facultyId: string): Promise<Major[]> {
        try {            const majors = await DatabaseService.query(`
                SELECT 
                    ng.MaNganh as maNganh,
                    ng.TenNganh as tenNganh,
                    ng.MaKhoa as maKhoa,
                    k.TenKhoa as tenKhoa
                FROM NGANHHOC ng
                JOIN KHOA k ON ng.MaKhoa = k.MaKhoa
                WHERE ng.MaKhoa = $1
                ORDER BY ng.TenNganh
            `, [facultyId]);
            return majors;
        } catch (error) {
            console.error('Error fetching majors by faculty:', error);
            throw error;
        }
    }

    // Course Type Services
    static async getAllCourseTypes(): Promise<CourseType[]> {
        try {
            const courseTypes = await DatabaseService.query(`
                SELECT 
                    MaLoaiMon as courseTypeId,
                    TenLoaiMon as courseTypeName,
                    SoTietMotTC as hoursPerCredit,
                    SoTienMotTC as pricePerCredit
                FROM LOAIMON
                ORDER BY TenLoaiMon
            `);
            return courseTypes;
        } catch (error) {
            console.error('Error fetching course types:', error);
            throw error;
        }
    }

    // Geographic Services
    static async getAllProvinces(): Promise<Province[]> {
        try {            const provinces = await DatabaseService.query(`
                SELECT 
                    MaTinh as maTinh,
                    TenTinh as tenTinh
                FROM TINH
                ORDER BY TenTinh
            `);
            return provinces;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            throw error;
        }
    }

    static async getDistrictsByProvince(provinceId: string): Promise<District[]> {
        try {            const districts = await DatabaseService.query(`
                SELECT 
                    h.MaHuyen as maHuyen,
                    h.TenHuyen as tenHuyen,
                    h.MaTinh as maTinh,
                    t.TenTinh as tenTinh
                FROM HUYEN h
                JOIN TINH t ON h.MaTinh = t.MaTinh
                WHERE h.MaTinh = $1
                ORDER BY h.TenHuyen
            `, [provinceId]);
            return districts;
        } catch (error) {
            console.error('Error fetching districts by province:', error);
            throw error;
        }
    }

    static async getAllDistricts(): Promise<District[]> {
        try {            const districts = await DatabaseService.query(`
                SELECT 
                    h.MaHuyen as maHuyen,
                    h.TenHuyen as tenHuyen,
                    h.MaTinh as maTinh,
                    t.TenTinh as tenTinh
                FROM HUYEN h
                JOIN TINH t ON h.MaTinh = t.MaTinh
                ORDER BY t.TenTinh, h.TenHuyen
            `);
            return districts;
        } catch (error) {
            console.error('Error fetching districts:', error);
            throw error;
        }
    }

    // Priority Group Services
    static async getAllPriorityGroups(): Promise<PriorityGroup[]> {
        try {            const priorityGroups = await DatabaseService.query(`
                SELECT 
                    MaDoiTuong as maDoiTuong,
                    TenDoiTuong as tenDoiTuong,
                    MucGiamHocPhi as mucGiamHocPhi
                FROM DOITUONGUUTIEN
                ORDER BY TenDoiTuong
            `);
            return priorityGroups;
        } catch (error) {
            console.error('Error fetching priority groups:', error);
            throw error;
        }
    }

    static async getPriorityGroupById(priorityId: string): Promise<PriorityGroup | null> {
        try {            const priorityGroup = await DatabaseService.queryOne(`
                SELECT 
                    MaDoiTuong as maDoiTuong,
                    TenDoiTuong as tenDoiTuong,
                    MucGiamHocPhi as mucGiamHocPhi
                FROM DOITUONGUUTIEN
                WHERE MaDoiTuong = $1
            `, [priorityId]);
            return priorityGroup;
        } catch (error) {
            console.error('Error fetching priority group by id:', error);
            throw error;
        }
    }
}
