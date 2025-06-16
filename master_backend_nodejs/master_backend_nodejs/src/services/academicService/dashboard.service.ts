// src/services/academicService/dashboard.service.ts
import { DatabaseService } from '../database/databaseService';

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

interface StudentRequest {
    id: string;
    studentId: string;
    studentName: string;
    course: string;
    requestType: 'register' | 'cancel';
    submittedDateTime: string;
}

export const academicDashboardService = {
    async getDashboardStats(): Promise<AcademicDashboardStats & { totalStudents: number; registeredStudents: number }> {
        try {
            const totalSubjects = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM MONHOC`);
            const totalOpenCourses = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM DANHSACHMONHOCMO`);
            const totalPrograms = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM CHUONGTRINHHOC`);
            const totalStudents = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM SINHVIEN`);
            const registeredStudents = await DatabaseService.queryOne(`SELECT COUNT(DISTINCT MaSoSinhVien) as count FROM PHIEUDANGKY`);
            return {
                totalSubjects: totalSubjects?.count || 0,
                totalOpenCourses: totalOpenCourses?.count || 0,
                totalPrograms: totalPrograms?.count || 0,
                pendingRequests: 0,
                totalStudents: totalStudents?.count || 0,
                registeredStudents: registeredStudents?.count || 0
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    async getSubjectStatistics(): Promise<SubjectStatistics> {
        try {
            const byDepartment = await DatabaseService.query(`
                SELECT COALESCE(department, 'General') as department, COUNT(*) as count
                FROM subjects GROUP BY department ORDER BY count DESC
            `);
            const byCredits = await DatabaseService.query(`
                SELECT credits, COUNT(*) as count FROM subjects GROUP BY credits ORDER BY credits
            `);
            const totalCreditsResult = await DatabaseService.queryOne(`SELECT SUM(credits) as total FROM subjects`);
            return {
                byDepartment: byDepartment || [],
                byCredits: byCredits || [],
                totalCreditsOffered: totalCreditsResult?.total || 0
            };
        } catch (error) {
            console.error('Error fetching subject statistics:', error);
            throw error;
        }
    },

    async getCourseStatistics(): Promise<CourseStatistics> {
        try {
            const bySemester = await DatabaseService.query(`
                SELECT semester, COUNT(*) as count FROM open_courses GROUP BY semester ORDER BY semester DESC
            `);
            const byStatus = await DatabaseService.query(`
                SELECT status, COUNT(*) as count FROM open_courses GROUP BY status
            `);
            const totalEnrollmentsResult = await DatabaseService.queryOne(`SELECT COUNT(*) as total FROM enrollments`);
            const avgEnrollmentRateResult = await DatabaseService.queryOne(`SELECT AVG(enrollment_rate) as avg FROM open_courses`);
            return {
                bySemester: bySemester || [],
                byStatus: byStatus || [],
                totalEnrollments: totalEnrollmentsResult?.total || 0,
                averageEnrollmentRate: avgEnrollmentRateResult?.avg || 0
            };
        } catch (error) {
            console.error('Error fetching course statistics:', error);
            throw error;
        }
    },

    async getRecentActivities(limit: number = 5): Promise<RecentActivity[]> {
        try {
            // Tạm thời trả về mảng rỗng vì chưa có bảng recent_activities
            return [];
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            return [];
        }
    },

    async getStudentRequests(limit: number = 10): Promise<StudentRequest[]> {
        try {
            // Nếu đã có bảng REGISTRATION_LOG thì dùng bảng này, nếu chưa có thì dùng CT_PHIEUDANGKY
            const logs = await DatabaseService.query(`
                SELECT 
                    rl.id,
                    rl.MaSoSinhVien as studentId,
                    rl.TenSinhVien as studentName,
                    rl.TenMonHoc as course,
                    rl.LoaiYeuCau as requestType,
                    rl.ThoiGianYeuCau as submittedDateTime
                FROM REGISTRATION_LOG rl
                ORDER BY rl.ThoiGianYeuCau DESC
                LIMIT $1
            `, [limit]);
            return logs || [];
        } catch (error) {
            console.error('Error fetching student requests:', error);
            return [];
        }
    }
};
