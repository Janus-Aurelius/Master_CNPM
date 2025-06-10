// src/services/academicService/dashboard.service.ts
import { DatabaseService } from '../database/databaseService';

interface AcademicDashboardStats {
    totalSubjects: number;
    totalOpenCourses: number;
    totalPrograms: number;
    pendingRequests: number;
    recentActivities: RecentActivity[];
}

interface RecentActivity {
    id: string;
    type: 'subject_created' | 'course_opened' | 'request_submitted' | 'program_updated';
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
    id: number;
    studentId: string;
    studentName: string;
    course: string;
    requestType: 'register' | 'drop';
    submittedDateTime: string;
    status: 'pending' | 'approved' | 'rejected';
}

export const academicDashboardService = {
    async getDashboardStats(): Promise<AcademicDashboardStats> {
        try {
            const totalSubjects = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM subjects`);
            const totalOpenCourses = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM open_courses WHERE status = 'open'`);
            const totalPrograms = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM chuongtrinhdaotao`);
            const pendingRequests = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM student_subject_requests WHERE status = 'pending'`);
            const recentActivities = await this.getRecentActivities(5);
            return {
                totalSubjects: totalSubjects?.count || 0,
                totalOpenCourses: totalOpenCourses?.count || 0,
                totalPrograms: totalPrograms?.count || 0,
                pendingRequests: pendingRequests?.count || 0,
                recentActivities
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
            const activities = await DatabaseService.query(`
                SELECT id, type, description, timestamp, user
                FROM recent_activities
                ORDER BY timestamp DESC
                LIMIT $1
            `, [limit]);
            return activities;
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            return [];
        }
    },

    async getPendingRequestsCount(): Promise<number> {
        try {
            const result = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count FROM student_subject_requests WHERE status = 'pending'
            `);
            return result?.count || 0;
        } catch (error) {
            console.error('Error fetching pending requests count:', error);
            return 0;
        }
    },

    async getStudentRequests(): Promise<StudentRequest[]> {
        try {
            const requests = await DatabaseService.query(`
                SELECT 
                    r.id,
                    r.student_id as "studentId",
                    s.hoten as "studentName",
                    c.tenmonhoc as course,
                    r.request_type as "requestType",
                    r.submitted_at as "submittedDateTime",
                    r.status
                FROM student_subject_requests r
                JOIN sinhvien s ON r.student_id = s.masosinhvien
                JOIN monhoc c ON r.subject_id = c.mamonhoc
                ORDER BY r.submitted_at DESC
            `);
            return requests;
        } catch (error) {
            console.error('Error fetching student requests:', error);
            return [];
        }
    }
};
