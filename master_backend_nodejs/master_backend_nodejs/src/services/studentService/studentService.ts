import { IStudent } from '../../models/student_related/studentInterface';
import { DatabaseService } from '../database/databaseService';

export const studentService = {    async getStudentInfo(studentId: string): Promise<IStudent | null> {        try {
            console.log('🔍 [studentService] Getting student info for ID:', studentId);
              // Sử dụng bảng SINHVIEN để tìm sinh viên
            let student = await DatabaseService.queryOne(`
                SELECT 
                    s.MaSoSinhVien as "studentId",
                    s.HoTen as "fullName",
                    s.NgaySinh as "dateOfBirth",
                    s.GioiTinh as "gender",
                    s.QueQuan as "hometown",
                    s.MaHuyen as "districtId",
                    s.MaDoiTuongUT as "priorityObjectId",
                    s.MaNganh as "majorId",
                    s.Email as "email",
                    s.SoDienThoai as "phone",
                    'active' as "status",
                    -- Thêm thông tin tên ngành
                    CASE 
                        WHEN s.MaNganh = 'CNPM' THEN 'Công nghệ phần mềm'
                        WHEN s.MaNganh = 'KHMT' THEN 'Khoa học máy tính' 
                        WHEN s.MaNganh = 'HTTT' THEN 'Hệ thống thông tin'
                        WHEN s.MaNganh = 'CNTT' THEN 'Công nghệ thông tin'
                        WHEN s.MaNganh = 'TMDT' THEN 'Thương mại điện tử'
                        WHEN s.MaNganh = 'KTPM' THEN 'Kỹ thuật phần mềm'
                        WHEN s.MaNganh = 'VMC' THEN 'Viễn thông Multimedia'
                        WHEN s.MaNganh = 'CNTT_Nhat' THEN 'Công nghệ thông tin (tiếng Nhật)'
                        ELSE s.MaNganh
                    END as "majorName"
                FROM SINHVIEN s
                WHERE s.MaSoSinhVien = $1            `, [studentId]);

            console.log('🔍 [studentService] Raw database result:', student);

            // Nếu không tìm thấy sinh viên, thử fallback mapping từ bảng NGUOIDUNG
            if (!student) {
                console.log('⚠️ [studentService] Student not found directly, trying fallback mapping from NGUOIDUNG...');                // Thử tìm trong bảng NGUOIDUNG để lấy masosinhvien
                const userToStudentMapping = await DatabaseService.queryOne(`
                    SELECT 
                        n.userid,
                        n.tendangnhap,
                        n.masosinhvien as "mappedStudentId"
                    FROM NGUOIDUNG n
                    WHERE n.userid = $1 OR UPPER(n.tendangnhap) = UPPER($1)
                `, [studentId]);
                
                console.log('🔍 [studentService] User mapping result:', userToStudentMapping);
                
                // Nếu tìm thấy mapping, thử query lại bảng SINHVIEN
                if (userToStudentMapping?.mappedStudentId) {
                    console.log('🔄 [studentService] Found mapping, trying with:', userToStudentMapping.mappedStudentId);
                    
                    student = await DatabaseService.queryOne(`
                        SELECT 
                            s.MaSoSinhVien as "studentId",
                            s.HoTen as "fullName",
                            s.NgaySinh as "dateOfBirth",
                            s.GioiTinh as "gender",
                            s.QueQuan as "hometown",
                            s.MaHuyen as "districtId",
                            s.MaDoiTuongUT as "priorityObjectId",
                            s.MaNganh as "majorId",
                            s.Email as "email",
                            s.SoDienThoai as "phone",
                            'active' as "status",
                            CASE 
                                WHEN s.MaNganh = 'CNPM' THEN 'Công nghệ phần mềm'
                                WHEN s.MaNganh = 'KHMT' THEN 'Khoa học máy tính' 
                                WHEN s.MaNganh = 'HTTT' THEN 'Hệ thống thông tin'
                                WHEN s.MaNganh = 'CNTT' THEN 'Công nghệ thông tin'
                                WHEN s.MaNganh = 'TMDT' THEN 'Thương mại điện tử'
                                WHEN s.MaNganh = 'KTPM' THEN 'Kỹ thuật phần mềm'
                                WHEN s.MaNganh = 'VMC' THEN 'Viễn thông Multimedia'
                                WHEN s.MaNganh = 'CNTT_Nhat' THEN 'Công nghệ thông tin (tiếng Nhật)'
                                ELSE s.MaNganh
                            END as "majorName"
                        FROM SINHVIEN s
                        WHERE s.MaSoSinhVien = $1
                    `, [userToStudentMapping.mappedStudentId]);
                    
                    console.log('🔍 [studentService] Fallback query result:', student);
                }
            }            if (!student) {
                console.log('❌ [studentService] No student found even after fallback mapping for ID:', studentId);
                return null;
            }

            const result = {
                studentId: student.studentId,
                fullName: student.fullName,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
                hometown: student.hometown,
                districtId: student.districtId,
                priorityObjectId: student.priorityObjectId,
                majorId: student.majorId,
                email: student.email,
                phone: student.phone,
                majorName: student.majorName  // Thêm tên ngành
            };

            console.log('✅ [studentService] Processed result:', result);
            return result;
        } catch (error) {
            console.error('Error getting student info:', error);
            throw error;
        }
    },    async updateStudentInfo(studentId: string, data: Partial<IStudent>): Promise<IStudent | null> {
        try {
            // Check if student exists
            const existingStudent = await this.getStudentInfo(studentId);
            if (!existingStudent) return null;

            // Prepare update data cho bảng SINHVIEN
            const updateData: Record<string, any> = {};
            if (data.fullName) updateData.HoTen = data.fullName;
            if (data.email) updateData.Email = data.email;
            if (data.phone) updateData.SoDienThoai = data.phone;
            if (data.gender) updateData.GioiTinh = data.gender;
            if (data.hometown) updateData.QueQuan = data.hometown;
            if (data.districtId) updateData.MaHuyen = data.districtId;
            if (data.priorityObjectId) updateData.MaDoiTuongUT = data.priorityObjectId;
            if (data.majorId) updateData.MaNganh = data.majorId;
            if (data.address) updateData.DiaChi = data.address;

            // Update student trong bảng SINHVIEN
            await DatabaseService.query(`
                UPDATE SINHVIEN 
                SET ${Object.keys(updateData).map((key, index) => `${key} = $${index + 1}`).join(', ')}
                WHERE MaSoSinhVien = $${Object.keys(updateData).length + 1}
            `, [...Object.values(updateData), studentId]);

            // Return updated student
            return this.getStudentInfo(studentId);
        } catch (error) {
            console.error('Error updating student info:', error);
            throw error;
        }
    },    async createStudent(studentData: Omit<IStudent, 'studentId'>): Promise<IStudent> {
        try {
            // Generate student ID
            const studentId = `SV${Date.now().toString().slice(-6)}`;

            // Insert student vào bảng SINHVIEN
            await DatabaseService.query(`
                INSERT INTO SINHVIEN (
                    MaSoSinhVien,
                    HoTen,
                    NgaySinh,
                    GioiTinh,
                    QueQuan,
                    MaHuyen,
                    MaDoiTuongUT,
                    MaNganh,
                    Email,
                    SoDienThoai,
                    DiaChi
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
                )
            `, [
                studentId,
                studentData.fullName,
                studentData.dateOfBirth,
                studentData.gender,
                studentData.hometown,
                studentData.districtId,
                studentData.priorityObjectId,
                studentData.majorId,
                studentData.email,
                studentData.phone,
                studentData.address
            ]);

            // Return created student
            const createdStudent = await this.getStudentInfo(studentId);
            if (!createdStudent) {
                throw new Error('Failed to get created student');
            }
            return createdStudent;
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },    async deleteStudent(studentId: string): Promise<boolean> {
        try {
            // Check if student exists
            const existingStudent = await this.getStudentInfo(studentId);
            if (!existingStudent) return false;

            // Delete student từ bảng SINHVIEN
            await DatabaseService.query(`
                DELETE FROM SINHVIEN 
                WHERE MaSoSinhVien = $1
            `, [studentId]);

            return true;
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    },

    async getAllStudents(): Promise<IStudent[]> {
        try {
            const students = await DatabaseService.query(`
                SELECT 
                    s.MaSoSinhVien as "studentId",
                    s.HoTen as "fullName",
                    s.NgaySinh as "dateOfBirth",
                    s.GioiTinh as "gender",
                    s.QueQuan as "hometown",
                    s.MaHuyen as "districtId",
                    s.MaDoiTuongUT as "priorityObjectId",
                    s.MaNganh as "majorId",
                    s.Email as "email",
                    s.SoDienThoai as "phone",
                    s.DiaChi as "address",
                    -- Thêm thông tin tên ngành
                    CASE 
                        WHEN s.MaNganh = 'CNPM' THEN 'Công nghệ phần mềm'
                        WHEN s.MaNganh = 'KHMT' THEN 'Khoa học máy tính' 
                        WHEN s.MaNganh = 'HTTT' THEN 'Hệ thống thông tin'
                        WHEN s.MaNganh = 'CNTT' THEN 'Công nghệ thông tin'
                        WHEN s.MaNganh = 'TMDT' THEN 'Thương mại điện tử'
                        WHEN s.MaNganh = 'KTPM' THEN 'Kỹ thuật phần mềm'
                        WHEN s.MaNganh = 'VMC' THEN 'Viễn thông Multimedia'
                        WHEN s.MaNganh = 'CNTT_Nhat' THEN 'Công nghệ thông tin (tiếng Nhật)'
                        ELSE s.MaNganh
                    END as "majorName"
                FROM SINHVIEN s
            `);

            return students.map(student => ({
                studentId: student.studentId,
                fullName: student.fullName,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
                hometown: student.hometown,
                districtId: student.districtId,
                priorityObjectId: student.priorityObjectId,
                majorId: student.majorId,
                email: student.email,
                phone: student.phone,
                address: student.address,
                majorName: student.majorName
            }));
        } catch (error) {
            console.error('Error getting all students:', error);
            throw error;
        }
    }
};