import { IStudentSchedule } from '../../models/student_related/studentInterface';
import { IStudentOverview } from '../../models/student_related/studentDashboardInterface';
import { IStudent } from '../../models/student_related/studentInterface';
import { IOfferedCourse } from '../../models/academic_related/openCourse';
import { DatabaseService } from '../database/databaseService';

export const dashboardService = {    async getStudentOverview(studentId: string): Promise<IStudentOverview | null> {
        try {            // Get student info với thông tin ngành đầy đủ từ bảng SINHVIEN
            const student = await DatabaseService.queryOne(`
                SELECT 
                    s.MaSoSinhVien as "studentId",
                    s.HoTen as "name",
                    s.Email as "email",
                    s.SoDienThoai as "phone",
                    s.DiaChi as "address",
                    s.NgaySinh as "dateOfBirth",
                    '2024' as "enrollmentYear",
                    s.MaNganh as "major",
                    '' as "faculty",
                    '' as "program",
                    'active' as "status",
                    -- Lấy thông tin ngành từ mapping
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
            `, [studentId]);

            if (!student) return null;            // Get enrolled courses count and total credits từ bảng CT_PHIEUDANGKY
            const enrollmentStats = await DatabaseService.queryOne<{enrolled_count: number, total_credits: number}>(`
                SELECT 
                    COUNT(*) as enrolled_count,
                    SUM(m.SoTiet / lm.SoTietMotTC) as total_credits
                FROM CT_PHIEUDANGKY ct
                JOIN MONHOC m ON ct.MaMonHoc = m.MaMonHoc
                JOIN LOAIMON lm ON m.MaLoaiMon = lm.MaLoaiMon
                WHERE ct.MaSoSinhVien = $1
            `, [studentId]);

            // Get GPA - tạm thời return 0 vì chưa có bảng điểm
            const gpa = { gpa: 0 };// Get available open courses
            const availableOpenCourses = await DatabaseService.query<IOfferedCourse>(`
                SELECT 
                    oc.id,
                    s.id as "courseId",
                    s.name as "courseName",
                    s.lecturer,
                    s.credits,
                    oc.max_students as "maxStudents",
                    oc.current_students as "currentStudents",
                    oc.semester,
                    oc.is_registration_open as "isRegistrationOpen"
                FROM open_courses oc
                JOIN subjects s ON oc.course_id = s.id
                WHERE oc.is_registration_open = true
                AND oc.current_students < oc.max_students
                AND s.id NOT IN (
                    SELECT course_id FROM enrollments 
                    WHERE student_id = $1 AND is_enrolled = true
                )
                ORDER BY s.name
                LIMIT 10
            `, [studentId]);

            // Get recent payments
            const recentPayments = await DatabaseService.query(`
                SELECT 
                    id,
                    student_id as "studentId",
                    amount,
                    payment_date as "paymentDate",
                    status,
                    payment_method as "paymentMethod"
                FROM payments
                WHERE student_id = $1
                ORDER BY payment_date DESC
                LIMIT 5
            `, [studentId]);            return {
                student: {
                    studentId: student.studentId,
                    fullName: student.name,
                    dateOfBirth: student.dateOfBirth,
                    gender: student.gender,
                    hometown: student.hometown,
                    districtId: student.districtId,
                    priorityObjectId: student.priorityObjectId,
                    majorId: student.major,                    email: student.email,
                    phone: student.phone
                },
                enrolledCourses: enrollmentStats?.enrolled_count || 0,
                totalCredits: enrollmentStats?.total_credits || 0,                gpa: gpa?.gpa || 0,
                availableOpenCourses,
                recentPayments
            };
        } catch (error) {
            console.error('Error getting student overview:', error);
            throw error;
        }
    },    // Lấy thời khóa biểu sinh viên từ CT_PHIEUDANGKY và DANHSACHMONHOCMO
    async getStudentTimetable(studentId: string, semester?: string): Promise<any[]> {
        try {
            // Get current semester if not provided
            const actualSemester = semester || await DatabaseService.getCurrentSemester();
            console.log(`🔵 [DashboardService] Getting timetable for student ${studentId} in semester ${actualSemester}`);// Lấy thời khóa biểu từ các bảng CT_PHIEUDANGKY, DANHSACHMONHOCMO, MONHOC
            const timetableData = await DatabaseService.query(`
                SELECT 
                    ct.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    (mh.SoTiet / lm.SoTietMotTC) as "credits",
                    ds.Thu as "dayOfWeek",
                    ds.TietBatDau as "startPeriod",
                    ds.TietKetThuc as "endPeriod"
                FROM CT_PHIEUDANGKY ct
                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy
                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                JOIN DANHSACHMONHOCMO ds ON ct.MaMonHoc = ds.MaMonHoc AND ct.MaHocKy = ds.MaHocKy
                WHERE pd.MaSoSinhVien = $1 AND ct.MaHocKy = $2
                ORDER BY ds.Thu, ds.TietBatDau
            `, [studentId, actualSemester]);

            console.log(`✅ [DashboardService] Found ${timetableData.length} courses in timetable`);
            console.log(`📋 [DashboardService] Timetable data:`, timetableData);

            return timetableData;
        } catch (error) {
            console.error('❌ [DashboardService] Error getting student timetable:', error);
            throw error;
        }
    },

    async updateStudentOverview(overview: IStudentOverview): Promise<IStudentOverview> {
        try {
            // Update student info
            await DatabaseService.query(`
                UPDATE students 
                SET 
                    name = $1,
                    email = $2,
                    phone = $3,
                    updated_at = NOW()
                WHERE student_id = $4
            `, [
                overview.student.fullName,
                overview.student.email,
                overview.student.phone,
                overview.student.studentId
            ]);

            // Return updated overview
            const updatedOverview = await this.getStudentOverview(overview.student.studentId);
            if (!updatedOverview) {
                throw new Error('Failed to get updated overview');
        }
            return updatedOverview;
        } catch (error) {
            console.error('Error updating student overview:', error);
            throw error;
        }
    }
};