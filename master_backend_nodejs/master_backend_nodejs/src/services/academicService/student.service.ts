import { IStudent } from '../../models/student_related/studentInterface';
import { db } from '../../config/database';

// Helper functions to convert names to codes
const convertNameToCode = async (name: string, table: string, nameColumn: string, codeColumn: string): Promise<string> => {
    if (!name || name.trim() === '') return '';
    try {
        console.log(`Converting "${name}" using query: SELECT ${codeColumn} FROM ${table} WHERE TRIM(${nameColumn}) = '${name.trim()}'`);
        const result = await db.query(`SELECT ${codeColumn} FROM ${table} WHERE TRIM(${nameColumn}) = $1`, [name.trim()]);
        console.log('Query result:', result.rows);
        
        if (result.rows.length > 0) {
            const code = result.rows[0][codeColumn.toLowerCase()];
            console.log(`Found code: ${code} for name: ${name}`);
            return code;
        } else {
            console.warn(`No code found for ${name} in ${table}.${nameColumn}`);
            return ''; // Return empty if not found instead of original name
        }
    } catch (error) {
        console.error(`Error converting ${name} to code:`, error);
        return ''; // Return empty if error
    }
};

const getMajorCode = async (majorName: string): Promise<string> => {
    console.log('getMajorCode called with:', majorName);
    const result = await convertNameToCode(majorName, 'NGANHHOC', 'TenNganh', 'MaNganh');
    console.log('getMajorCode result:', result);
    return result;
};

const getDistrictCode = async (districtName: string): Promise<string> => {
    console.log('getDistrictCode called with:', districtName);
    const result = await convertNameToCode(districtName, 'HUYEN', 'TenHuyen', 'MaHuyen');
    console.log('getDistrictCode result:', result);
    return result;
};

const getPriorityObjectCode = async (priorityName: string): Promise<string> => {
    console.log('getPriorityObjectCode called with:', priorityName);
    const result = await convertNameToCode(priorityName, 'DOITUONGUUTIEN', 'TenDoiTuong', 'MaDoiTuong');
    console.log('getPriorityObjectCode result:', result);
    return result;
};

export const studentService = {
    getStudents: async (): Promise<IStudent[]> => {
        try {            const result = await db.query(`
                SELECT 
                    sv.MaSoSinhVien, sv.HoTen, sv.NgaySinh, sv.GioiTinh, sv.QueQuan, 
                    sv.MaHuyen, sv.MaDoiTuongUT, sv.MaNganh, sv.Email, sv.SoDienThoai, sv.Status,
                    dt.TenDoiTuong,
                    h.TenHuyen,
                    t.TenTinh,
                    nh.TenNganh,
                    k.TenKhoa
                FROM SINHVIEN sv
                LEFT JOIN DOITUONGUUTIEN dt ON sv.MaDoiTuongUT = dt.MaDoiTuong
                LEFT JOIN HUYEN h ON sv.MaHuyen = h.MaHuyen
                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh
                LEFT JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh
                LEFT JOIN KHOA k ON nh.MaKhoa = k.MaKhoa
            `);            return result.rows.map(row => ({
                studentId: row.masosinhvien,
                fullName: row.hoten,
                dateOfBirth: row.ngaysinh,
                gender: row.gioitinh,
                hometown: row.tentinh || row.quequan, // Tên tỉnh
                districtId: row.tenhuyen || row.mahuyen, // Tên huyện  
                priorityObjectId: row.tendoituong || row.madoituongut, // Tên đối tượng
                majorId: row.tennganh || row.manganh, // Tên ngành
                email: row.email || '',
                phone: row.sodienthoai || '',
                status: row.status === 'active' ? 'đang học' : 'thôi học',
                faculty: row.tenkhoa || '' // Tên khoa
            }));
        } catch (error) {
            console.error('Error in getStudents:', error);
            throw new Error('Failed to fetch students');
        }
    },    createStudent: async (student: Omit<IStudent, 'id'>): Promise<IStudent> => {
        try {
            // Convert display status back to database format
            const dbStatus = student.status === 'đang học' ? 'active' : 'inactive';
            
            console.log('Original student data:', {
                majorId: student.majorId,
                districtId: student.districtId,
                priorityObjectId: student.priorityObjectId
            });
            
            // Convert names to codes
            const majorCode = await getMajorCode(student.majorId);
            const districtCode = await getDistrictCode(student.districtId);
            const priorityCode = await getPriorityObjectCode(student.priorityObjectId);
            
            console.log('Converted codes:', {
                majorCode,
                districtCode,
                priorityCode
            });
            
            const result = await db.query(
                'INSERT INTO SINHVIEN (MaSoSinhVien, HoTen, NgaySinh, GioiTinh, QueQuan, MaHuyen, MaDoiTuongUT, MaNganh, Email, SoDienThoai, Status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
                [student.studentId, student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone, dbStatus]
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
                phone: row.sodienthoai || '',
                status: row.status === 'active' ? 'đang học' : 'thôi học'
            };
        } catch (error) {
            console.error('Error in createStudent:', error);
            throw new Error('Failed to create student');
        }
    },updateStudent: async (id: string, student: IStudent): Promise<IStudent> => {
        try {
            // Convert display status back to database format
            const dbStatus = student.status === 'đang học' ? 'active' : 'inactive';
            
            // Convert names to codes
            const majorCode = await getMajorCode(student.majorId);
            const districtCode = await getDistrictCode(student.districtId);
            const priorityCode = await getPriorityObjectCode(student.priorityObjectId);
            
            const result = await db.query(
                'UPDATE SINHVIEN SET HoTen = $1, NgaySinh = $2, GioiTinh = $3, QueQuan = $4, MaHuyen = $5, MaDoiTuongUT = $6, MaNganh = $7, Email = $8, SoDienThoai = $9, Status = $10 WHERE MaSoSinhVien = $11 RETURNING *',
                [student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone, dbStatus, id]
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
                phone: row.sodienthoai || '',
                status: row.status === 'active' ? 'đang học' : 'thôi học'
            };
        } catch (error) {
            console.error('Error in updateStudent:', error);
            throw error;
        }
    },

    deleteStudent: async (id: string): Promise<void> => {
        try {
            const result = await db.query('DELETE FROM SINHVIEN WHERE MaSoSinhVien = $1 RETURNING *', [id]);
            if (result.rows.length === 0) {
                throw new Error('Student not found');
            }
        } catch (error) {
            console.error('Error in deleteStudent:', error);
            throw error;
        }
    },

    searchStudents: async (query: string): Promise<IStudent[]> => {
        try {            const result = await db.query(`
                SELECT 
                    sv.MaSoSinhVien, sv.HoTen, sv.NgaySinh, sv.GioiTinh, sv.QueQuan, 
                    sv.MaHuyen, sv.MaDoiTuongUT, sv.MaNganh, sv.Email, sv.SoDienThoai, sv.Status,
                    dt.TenDoiTuong,
                    h.TenHuyen,
                    t.TenTinh,
                    nh.TenNganh,
                    k.TenKhoa
                FROM SINHVIEN sv
                LEFT JOIN DOITUONGUUTIEN dt ON sv.MaDoiTuongUT = dt.MaDoiTuong
                LEFT JOIN HUYEN h ON sv.MaHuyen = h.MaHuyen
                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh
                LEFT JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh
                LEFT JOIN KHOA k ON nh.MaKhoa = k.MaKhoa
                WHERE sv.HoTen ILIKE $1 OR sv.MaSoSinhVien ILIKE $1
            `, [`%${query}%`]);            return result.rows.map(row => ({
                studentId: row.masosinhvien,
                fullName: row.hoten,
                dateOfBirth: row.ngaysinh,
                gender: row.gioitinh,
                hometown: row.tentinh || row.quequan,
                districtId: row.tenhuyen || row.mahuyen,
                priorityObjectId: row.tendoituong || row.madoituongut,
                majorId: row.tennganh || row.manganh, // Tên ngành
                email: row.email || '',
                phone: row.sodienthoai || '',
                status: row.status === 'active' ? 'đang học' : 'thôi học',
                faculty: row.tenkhoa || '' // Tên khoa
            }));
        } catch (error) {
            console.error('Error in searchStudents:', error);
            throw new Error('Failed to search students');
        }
    }
};