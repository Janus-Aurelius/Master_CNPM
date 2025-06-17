import { IStudent } from '../../models/student_related/studentInterface';
import { db } from '../../config/database';

// Helper function to convert names to codes
const convertNameToCode = async (name: string, table: string, nameColumn: string, codeColumn: string): Promise<string> => {
    if (!name || name.trim() === '') return '';
    try {
        console.log(`Converting "${name}" using query: SELECT ${codeColumn} FROM ${table} WHERE TRIM(${nameColumn}) = '${name.trim()}'`);
        const result = await db.query(`SELECT ${codeColumn} FROM ${table} WHERE TRIM(${nameColumn}) = $1`, [name.trim()]);
        console.log('Query result:', result.rows);
        
        if (result.rows.length > 0) {
            const code = result.rows[0][codeColumn.toLowerCase()];
            console.log(`Found code: ${code}`);
            return code;
        } else {
            console.log(`No code found for name: ${name}`);
            return '';
        }
    } catch (error) {
        console.error(`Error converting name to code for "${name}":`, error);
        return '';
    }
};

export const studentService = {
    getAllStudents: async (): Promise<IStudent[]> => {
        try {
            const result = await db.query(`
                SELECT 
                    s.MaSoSinhVien as studentId,
                    s.HoTen as fullName,
                    s.NgaySinh as dateOfBirth,
                    s.GioiTinh as gender,
                    s.QueQuan as hometown,
                    s.MaHuyen as districtId,
                    s.MaDoiTuongUT as priorityObjectId,
                    s.MaNganh as majorId,
                    s.Email as email,
                    s.SoDienThoai as phone,
                    h.TenHuyen as districtName,
                    t.TenTinh as provinceName,
                    d.TenDoiTuong as priorityName,
                    n.TenNganh as majorName,
                    k.TenKhoa as facultyName
                FROM SINHVIEN s
                LEFT JOIN HUYEN h ON s.MaHuyen = h.MaHuyen
                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh
                LEFT JOIN DOITUONGUUTIEN d ON s.MaDoiTuongUT = d.MaDoiTuong
                LEFT JOIN NGANHHOC n ON s.MaNganh = n.MaNganh
                LEFT JOIN KHOA k ON n.MaKhoa = k.MaKhoa
                ORDER BY s.MaSoSinhVien
            `);
            
            return result.rows.map(row => ({
                studentId: row.studentid,
                fullName: row.fullname,
                dateOfBirth: row.dateofbirth,
                gender: row.gender,
                hometown: row.hometown,
                districtId: row.districtid,
                priorityObjectId: row.priorityobjectid,
                majorId: row.majorid,
                email: row.email || '',
                phone: row.phone || '',
                districtName: row.districtname,
                provinceName: row.provincename,
                priorityName: row.priorityname,
                majorName: row.majorname,
                facultyName: row.facultyname
            }));
        } catch (error) {
            console.error('Error fetching students:', error);
            throw new Error('Failed to fetch students');
        }
    },

    getStudentById: async (id: string): Promise<IStudent | null> => {
        try {
            const result = await db.query(`
                SELECT 
                    s.MaSoSinhVien as studentId,
                    s.HoTen as fullName,
                    s.NgaySinh as dateOfBirth,
                    s.GioiTinh as gender,
                    s.QueQuan as hometown,
                    s.MaHuyen as districtId,
                    s.MaDoiTuongUT as priorityObjectId,
                    s.MaNganh as majorId,
                    s.Email as email,
                    s.SoDienThoai as phone,
                    h.TenHuyen as districtName,
                    t.TenTinh as provinceName,
                    d.TenDoiTuong as priorityName,
                    n.TenNganh as majorName,
                    k.TenKhoa as facultyName
                FROM SINHVIEN s
                LEFT JOIN HUYEN h ON s.MaHuyen = h.MaHuyen
                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh
                LEFT JOIN DOITUONGUUTIEN d ON s.MaDoiTuongUT = d.MaDoiTuong
                LEFT JOIN NGANHHOC n ON s.MaNganh = n.MaNganh
                LEFT JOIN KHOA k ON n.MaKhoa = k.MaKhoa
                WHERE s.MaSoSinhVien = $1
            `, [id]);
            
            if (result.rows.length === 0) return null;
            
            const row = result.rows[0];
            return {
                studentId: row.studentid,
                fullName: row.fullname,
                dateOfBirth: row.dateofbirth,
                gender: row.gender,
                hometown: row.hometown,
                districtId: row.districtid,
                priorityObjectId: row.priorityobjectid,
                majorId: row.majorid,
                email: row.email || '',
                phone: row.phone || '',
                districtName: row.districtname,
                provinceName: row.provincename,
                priorityName: row.priorityname,
                majorName: row.majorname,
                facultyName: row.facultyname
            };
        } catch (error) {
            console.error('Error fetching student by ID:', error);
            throw new Error('Failed to fetch student');
        }
    },

    createStudent: async (student: Omit<IStudent, "studentId"> & { studentId: string }): Promise<IStudent> => {
        try {
            console.log('Original student data:', {
                majorId: student.majorId,
                districtId: student.districtId,
                priorityObjectId: student.priorityObjectId
            });
            
            // Convert names to codes
            const districtCode = await convertNameToCode(student.districtName || '', 'HUYEN', 'TenHuyen', 'MaHuyen');
            const priorityCode = await convertNameToCode(student.priorityName || '', 'DOITUONGUUTIEN', 'TenDoiTuong', 'MaDoiTuong');
            const majorCode = await convertNameToCode(student.majorName || '', 'NGANHHOC', 'TenNganh', 'MaNganh');
            
            console.log('Final codes:', {
                districtCode,
                priorityCode,
                majorCode
            });
            
            const result = await db.query(
                'INSERT INTO SINHVIEN (MaSoSinhVien, HoTen, NgaySinh, GioiTinh, QueQuan, MaHuyen, MaDoiTuongUT, MaNganh, Email, SoDienThoai) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
                [student.studentId, student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone]
            );
            const row = result.rows[0];
            return {
                studentId: row.masosinhvien,
                fullName: row.hoten,
                dateOfBirth: row.ngaysinh,
                gender: row.gioitinh,
                hometown: row.quequan,
                districtId: row.mahuyen,
                priorityObjectId: row.madoituongut,
                majorId: row.manganh,
                email: row.email || '',
                phone: row.sodienthoai || ''
            };
        } catch (error) {
            console.error('Error in createStudent:', error);
            throw new Error('Failed to create student');
        }
    },

    updateStudent: async (id: string, student: IStudent): Promise<IStudent> => {
        try {
            // Convert names to codes
            const districtCode = await convertNameToCode(student.districtName || '', 'HUYEN', 'TenHuyen', 'MaHuyen');
            const priorityCode = await convertNameToCode(student.priorityName || '', 'DOITUONGUUTIEN', 'TenDoiTuong', 'MaDoiTuong');
            const majorCode = await convertNameToCode(student.majorName || '', 'NGANHHOC', 'TenNganh', 'MaNganh');
            
            const result = await db.query(
                `UPDATE SINHVIEN SET 
                    HoTen = $2, NgaySinh = $3, GioiTinh = $4, QueQuan = $5, 
                    MaHuyen = $6, MaDoiTuongUT = $7, MaNganh = $8, 
                    Email = $9, SoDienThoai = $10
                WHERE MaSoSinhVien = $1 RETURNING *`,
                [id, student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone]
            );
            
            if (result.rows.length === 0) {
                throw new Error('Student not found');
            }
            
            const row = result.rows[0];
            return {
                studentId: row.masosinhvien,
                fullName: row.hoten,
                dateOfBirth: row.ngaysinh,
                gender: row.gioitinh,
                hometown: row.quequan,
                districtId: row.mahuyen,
                priorityObjectId: row.madoituongut,
                majorId: row.manganh,
                email: row.email || '',
                phone: row.sodienthoai || ''
            };
        } catch (error) {
            console.error('Error in updateStudent:', error);
            throw new Error('Failed to update student');
        }
    },

    deleteStudent: async (id: string): Promise<void> => {
        try {
            const result = await db.query('DELETE FROM SINHVIEN WHERE MaSoSinhVien = $1', [id]);
            if (result.rowCount === 0) {
                throw new Error('Student not found');
            }
        } catch (error) {
            console.error('Error in deleteStudent:', error);
            throw new Error('Failed to delete student');
        }
    },

    searchStudents: async (searchTerm: string): Promise<IStudent[]> => {
        try {
            const result = await db.query(`
                SELECT 
                    s.MaSoSinhVien as studentId,
                    s.HoTen as fullName,
                    s.NgaySinh as dateOfBirth,
                    s.GioiTinh as gender,
                    s.QueQuan as hometown,
                    s.MaHuyen as districtId,
                    s.MaDoiTuongUT as priorityObjectId,
                    s.MaNganh as majorId,
                    s.Email as email,
                    s.SoDienThoai as phone,
                    h.TenHuyen as districtName,
                    t.TenTinh as provinceName,
                    d.TenDoiTuong as priorityName,
                    n.TenNganh as majorName,
                    k.TenKhoa as facultyName
                FROM SINHVIEN s
                LEFT JOIN HUYEN h ON s.MaHuyen = h.MaHuyen
                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh
                LEFT JOIN DOITUONGUUTIEN d ON s.MaDoiTuongUT = d.MaDoiTuong
                LEFT JOIN NGANHHOC n ON s.MaNganh = n.MaNganh
                LEFT JOIN KHOA k ON n.MaKhoa = k.MaKhoa
                WHERE s.MaSoSinhVien ILIKE $1 OR s.HoTen ILIKE $1
                ORDER BY s.MaSoSinhVien
            `, [`%${searchTerm}%`]);
            
            return result.rows.map(row => ({
                studentId: row.studentid,
                fullName: row.fullname,
                dateOfBirth: row.dateofbirth,
                gender: row.gender,
                hometown: row.hometown,
                districtId: row.districtid,
                priorityObjectId: row.priorityobjectid,
                majorId: row.majorid,
                email: row.email || '',
                phone: row.phone || '',
                districtName: row.districtname,
                provinceName: row.provincename,
                priorityName: row.priorityname,
                majorName: row.majorname,
                facultyName: row.facultyname
            }));
        } catch (error) {
            console.error('Error searching students:', error);
            throw new Error('Failed to search students');
        }
    }
};