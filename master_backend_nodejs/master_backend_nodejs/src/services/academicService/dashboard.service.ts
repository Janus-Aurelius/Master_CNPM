// src/services/academicService/dashboard.service.ts
import { db } from '../../config/database';

interface AcademicDashboardStats {
    totalSubjects: number;
    totalOpenCourses: number;
    totalPrograms: number;
    pendingRequests: number;
}

interface RecentActivity {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
}

interface StudentRequest {
    id: string;
    studentid: string;
    studentname: string;
    course: string;
    requesttype: string;
    submitteddatetime: string;
}

interface SubjectStatistics {
    byDepartment: { department: string; count: number }[];
    byCredits: { credits: number; count: number }[];
    totalCreditsOffered: number;
}

interface CourseStatistics {
    bySemester: { semester: string; count: number }[];
    byStatus: { status: string; count: number }[];
    totalEnrollments: number;
    averageEnrollmentRate: number;
}

export const academicDashboardService = {
    async getDashboardStats(): Promise<AcademicDashboardStats & { totalStudents: number; registeredStudents: number }> {
        try {
            const totalSubjectsResult = await db.query(`SELECT COUNT(*) as count FROM MONHOC`);
            const totalOpenCoursesResult = await db.query(`SELECT COUNT(*) as count FROM DANHSACHMONHOCMO`);
            const totalProgramsResult = await db.query(`SELECT COUNT(*) as count FROM CHUONGTRINHHOC`);
            const totalStudentsResult = await db.query(`SELECT COUNT(*) as count FROM SINHVIEN`);
            const registeredStudentsResult = await db.query(`SELECT COUNT(DISTINCT MaSoSinhVien) as count FROM PHIEUDANGKY`);
            
            return {
                totalSubjects: totalSubjectsResult.rows[0]?.count || 0,
                totalOpenCourses: totalOpenCoursesResult.rows[0]?.count || 0,
                totalPrograms: totalProgramsResult.rows[0]?.count || 0,
                pendingRequests: 0,
                totalStudents: totalStudentsResult.rows[0]?.count || 0,
                registeredStudents: registeredStudentsResult.rows[0]?.count || 0
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    async getStudentRequests(limit: number = 10): Promise<StudentRequest[]> {
        try {
            const result = await db.query(`
                SELECT 
                    id,
                    MaSoSinhVien as studentid,
                    TenSinhVien as studentname,
                    TenMonHoc as course,
                    LoaiYeuCau as requesttype,
                    TO_CHAR(ThoiGianYeuCau, 'DD/MM/YYYY HH24:MI') as submitteddatetime
                FROM REGISTRATION_LOG
                ORDER BY ThoiGianYeuCau DESC
                LIMIT $1
            `, [limit]);
            
            return result.rows || [];
        } catch (error) {
            console.error('Error fetching student requests:', error);
            return [];
        }
    },

    async getSubjectStatistics(): Promise<SubjectStatistics> {
        try {
            const byDepartmentResult = await db.query(`
                SELECT COALESCE(k.TenKhoa, 'Chung') as department, COUNT(*) as count
                FROM MONHOC mh
                LEFT JOIN NGANHHOC nh ON mh.MaNganh = nh.MaNganh
                LEFT JOIN KHOA k ON nh.MaKhoa = k.MaKhoa
                GROUP BY k.TenKhoa 
                ORDER BY count DESC
            `);
            
            const byCreditstResult = await db.query(`
                SELECT SoTinChi as credits, COUNT(*) as count 
                FROM MONHOC 
                GROUP BY SoTinChi 
                ORDER BY SoTinChi
            `);
            
            const totalCreditsResult = await db.query(`SELECT SUM(SoTinChi) as total FROM MONHOC`);
            
            return {
                byDepartment: byDepartmentResult.rows || [],
                byCredits: byCreditstResult.rows || [],
                totalCreditsOffered: totalCreditsResult.rows[0]?.total || 0
            };
        } catch (error) {
            console.error('Error fetching subject statistics:', error);
            throw error;
        }
    },

    async getCourseStatistics(): Promise<CourseStatistics> {
        try {
            const bySemesterResult = await db.query(`
                SELECT dmmo.MaHocKy as semester, COUNT(*) as count 
                FROM DANHSACHMONHOCMO dmmo
                GROUP BY dmmo.MaHocKy 
                ORDER BY dmmo.MaHocKy DESC
            `);
            
            const byStatusResult = await db.query(`
                SELECT 
                    CASE 
                        WHEN dmmo.SoSVDaDangKy >= dmmo.SiSoToiThieu THEN 'Đã đủ sĩ số'
                        ELSE 'Chưa đủ sĩ số'
                    END as status,
                    COUNT(*) as count
                FROM DANHSACHMONHOCMO dmmo
                GROUP BY CASE 
                    WHEN dmmo.SoSVDaDangKy >= dmmo.SiSoToiThieu THEN 'Đã đủ sĩ số'
                    ELSE 'Chưa đủ sĩ số'
                END
            `);
            
            const totalEnrollmentsResult = await db.query(`SELECT COUNT(*) as total FROM CT_PHIEUDANGKY`);
            
            const avgEnrollmentRateResult = await db.query(`
                SELECT AVG(
                    CASE 
                        WHEN dmmo.SiSoToiDa > 0 THEN (dmmo.SoSVDaDangKy::float / dmmo.SiSoToiDa) * 100
                        ELSE 0 
                    END
                ) as avg 
                FROM DANHSACHMONHOCMO dmmo
            `);
            
            return {
                bySemester: bySemesterResult.rows || [],
                byStatus: byStatusResult.rows || [],
                totalEnrollments: totalEnrollmentsResult.rows[0]?.total || 0,
                averageEnrollmentRate: parseFloat(avgEnrollmentRateResult.rows[0]?.avg) || 0
            };
        } catch (error) {
            console.error('Error fetching course statistics:', error);
            throw error;
        }
    },

    async getRecentActivities(limit: number = 5): Promise<RecentActivity[]> {
        try {
            const result = await db.query(`
                SELECT 
                    id::text,
                    CASE 
                        WHEN LoaiYeuCau = 'register' THEN 'subject_registration'
                        WHEN LoaiYeuCau = 'cancel' THEN 'subject_cancellation'
                        ELSE 'other'
                    END as type,
                    CASE 
                        WHEN LoaiYeuCau = 'register' THEN TenSinhVien || ' đã đăng ký môn ' || TenMonHoc
                        WHEN LoaiYeuCau = 'cancel' THEN TenSinhVien || ' đã hủy đăng ký môn ' || TenMonHoc
                        ELSE 'Hoạt động khác'
                    END as description,
                    TO_CHAR(ThoiGianYeuCau, 'YYYY-MM-DD"T"HH24:MI:SS') as timestamp,
                    TenSinhVien as user
                FROM REGISTRATION_LOG
                ORDER BY ThoiGianYeuCau DESC
                LIMIT $1
            `, [limit]);
            
            return result.rows || [];
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            return [];
        }
    }
};
