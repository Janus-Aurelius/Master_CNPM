// src/business/academicBusiness/dashboard.business.ts
import { academicDashboardService } from '../../services/academicService/dashboard.service';

export class AcademicDashboardBusiness {
    static async getDashboardOverview() {
        try {
            const [stats, subjectStats, courseStats] = await Promise.all([
                academicDashboardService.getDashboardStats(),
                academicDashboardService.getSubjectStatistics(),
                academicDashboardService.getCourseStatistics()
            ]);

            return {
                overview: stats,
                subjects: subjectStats,
                courses: courseStats,
                generatedAt: new Date().toISOString()
            };
        } catch (error) {
            throw new Error('Error fetching dashboard overview');
        }
    }

    static async getQuickStats() {
        try {
            const stats = await academicDashboardService.getDashboardStats();
            return {
                totalSubjects: stats.totalSubjects,
                totalOpenCourses: stats.totalOpenCourses,
                totalPrograms: stats.totalPrograms,
                pendingRequests: stats.pendingRequests
            };
        } catch (error) {
            throw new Error('Error fetching quick stats');
        }
    }

    static async getRecentActivities(limit: number = 5) {
        try {
            return await academicDashboardService.getRecentActivities(limit);
        } catch (error) {
            throw new Error('Error fetching recent activities');
        }
    }
}
