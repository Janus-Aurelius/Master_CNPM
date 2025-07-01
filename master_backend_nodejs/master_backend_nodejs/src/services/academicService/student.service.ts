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

// Helper function to check email duplication
const checkEmailDuplicate = async (email: string, excludeStudentId?: string): Promise<boolean> => {
    if (!email || email.trim() === '') return false;
    
    try {
        let query = 'SELECT MaSoSinhVien FROM SINHVIEN WHERE LOWER(TRIM(Email)) = LOWER($1)';
        let params = [email.trim()];
        
        if (excludeStudentId) {
            query += ' AND MaSoSinhVien != $2';
            params.push(excludeStudentId);
        }
        
        const result = await db.query(query, params);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking email duplicate:', error);
        throw error;
    }
};

// Helper function to check MSSV duplication
const checkStudentIdDuplicate = async (studentId: string): Promise<boolean> => {
    if (!studentId || studentId.trim() === '') return false;
    try {
        const result = await db.query('SELECT MaSoSinhVien FROM SINHVIEN WHERE MaSoSinhVien = $1', [studentId.trim()]);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking MSSV duplicate:', error);
        throw error;
    }
};

export const studentService = {    getAllStudents: async (semesterId?: string): Promise<{ students: IStudent[], registrationMap: Record<string, boolean> }> => {
        try {
            // Lấy danh sách sinh viên như cũ
            let query = `
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
                    s.DiaChi as address,
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
            `;
            const studentsResult = await db.query(query, []);
            const students = studentsResult.rows.map((row: any) => ({
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
                address: row.address || '',
                districtName: row.districtname,
                provinceName: row.provincename,
                priorityName: row.priorityname,
                majorName: row.majorname,
                facultyName: row.facultyname
            }));

            // Tạo map trạng thái phiếu đăng ký
            const registrationMap: Record<string, boolean> = {};
            if (semesterId) {
                for (const sv of students) {
                    const exists = await db.query('SELECT 1 FROM PHIEUDANGKY WHERE masosinhvien = $1 AND mahocky = $2 LIMIT 1', [sv.studentId, semesterId]);
                    registrationMap[sv.studentId] = exists.rows.length > 0;
                }
            }
            return { students, registrationMap };
        } catch (error) {
            console.error('Error fetching students:', error);
            throw new Error('Failed to fetch students');
        }
    },    getStudentById: async (id: string): Promise<IStudent | null> => {
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
                    s.DiaChi as address,
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
                address: row.address || '',
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
            // Check for MSSV duplication
            if (student.studentId && student.studentId.trim()) {
                const isIdDuplicate = await checkStudentIdDuplicate(student.studentId);
                if (isIdDuplicate) {
                    throw new Error('Không thể thêm sinh viên này do trùng MSSV');
                }
            }
            
            console.log('Original student data:', {
                majorId: student.majorId,
                districtId: student.districtId,
                priorityObjectId: student.priorityObjectId
            });
            
            // Check for email duplication
            if (student.email && student.email.trim()) {
                const isEmailDuplicate = await checkEmailDuplicate(student.email);
                if (isEmailDuplicate) {
                    throw new Error('Không thể thêm sinh viên này do trùng email');
                }
            }
            
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
                'INSERT INTO SINHVIEN (MaSoSinhVien, HoTen, NgaySinh, GioiTinh, QueQuan, MaHuyen, MaDoiTuongUT, MaNganh, Email, SoDienThoai, DiaChi) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
                [student.studentId, student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone, student.address || '']
            );            const row = result.rows[0];
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
                address: row.diachi || ''
            };
        } catch (error) {
            console.error('Error in createStudent:', error);
            const err = error as Error;
            if ((err.message && err.message.includes('trùng email')) || (err.message && err.message.includes('trùng MSSV'))) {
                throw err;
            }
            throw new Error('Failed to create student');
        }
    },

    updateStudent: async (id: string, student: IStudent): Promise<IStudent> => {
        try {
            // Check for email duplication (excluding current student)
            if (student.email && student.email.trim()) {
                const isEmailDuplicate = await checkEmailDuplicate(student.email, id);
                if (isEmailDuplicate) {
                    throw new Error('Không thể sửa sinh viên này do trùng email');
                }
            }
            
            // Convert names to codes
            const districtCode = await convertNameToCode(student.districtName || '', 'HUYEN', 'TenHuyen', 'MaHuyen');
            const priorityCode = await convertNameToCode(student.priorityName || '', 'DOITUONGUUTIEN', 'TenDoiTuong', 'MaDoiTuong');
            const majorCode = await convertNameToCode(student.majorName || '', 'NGANHHOC', 'TenNganh', 'MaNganh');
              const result = await db.query(
                `UPDATE SINHVIEN SET 
                    HoTen = $2, NgaySinh = $3, GioiTinh = $4, QueQuan = $5, 
                    MaHuyen = $6, MaDoiTuongUT = $7, MaNganh = $8, 
                    Email = $9, SoDienThoai = $10, DiaChi = $11
                WHERE MaSoSinhVien = $1 RETURNING *`,
                [id, student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone, student.address || '']
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
                address: row.diachi || ''
            };
        } catch (error) {
            console.error('Error in updateStudent:', error);
            if (error instanceof Error && error.message.includes('trùng email')) {
                throw error;
            }
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

    searchStudents: async (searchTerm: string): Promise<IStudent[]> => {        try {
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
                    s.DiaChi as address,
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
                address: row.address || '',
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
    },

    // Tạo hàng loạt PHIEUDANGKY
    createBulkRegistrations: async (studentIds: string[], semesterId: string, maxCredits: number): Promise<any> => {
        try {
            const { registrationService } = await import('../../services/studentService/registrationService');
            
            const results = [];
            let successCount = 0;
            let failCount = 0;
            let alreadyExistsCount = 0;

            for (const studentId of studentIds) {
                try {
                    // Gọi createRegistration, nếu đã có phiếu sẽ throw lỗi
                    await registrationService.createRegistration(studentId, semesterId, maxCredits);
                    results.push({ 
                        studentId, 
                        success: true, 
                        message: 'Tạo phiếu đăng ký thành công',
                        alreadyExists: false
                    });
                    successCount++;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
                    if (errorMessage.includes('đã có phiếu đăng ký cho học kỳ này')) {
                        results.push({ 
                            studentId, 
                            success: false, 
                            message: errorMessage,
                            alreadyExists: true
                        });
                        alreadyExistsCount++;
                    } else {
                        results.push({ studentId, success: false, message: errorMessage });
                        failCount++;
                    }
                }
            }

            return {
                success: successCount > 0,
                message: `Xử lý thành công ${successCount}/${studentIds.length} sinh viên. ${alreadyExistsCount} sinh viên đã có phiếu, ${successCount} sinh viên được tạo phiếu mới. ${failCount} sinh viên thất bại.`,
                details: results,
                summary: {
                    total: studentIds.length,
                    success: successCount,
                    failed: failCount,
                    alreadyExists: alreadyExistsCount,
                    newlyCreated: successCount
                }
            };
        } catch (error) {
            console.error('Error creating bulk registrations:', error);
            throw new Error('Failed to create bulk registrations');
        }
    }
};