// src/business/academicBusiness/dashboard.business.ts
import { academicDashboardService } from '../../services/academicService/dashboard.service';

export class AcademicDashboardBusiness {
    static async getDashboardOverview() {
        try {
            const stats = await academicDashboardService.getDashboardStats();
            return {
                success: true,
                data: stats
            };
        } catch (error) {
            throw new Error('Error fetching dashboard overview');
        }
    }

    static async getQuickStats() {
        try {
            const stats = await academicDashboardService.getDashboardStats();
            return {
                success: true,
                data: stats
            };
        } catch (error) {
            throw new Error('Error fetching quick stats');
        }
    }

    static async getRecentActivities(limit: number = 5) {
        try {
            const activities = await academicDashboardService.getRecentActivities(limit);
            return {
                success: true,
                data: activities
            };
        } catch (error) {
            throw new Error('Error fetching recent activities');
        }
    }

    static async getStudentRequests(limit: number = 10) {
        try {
            const requests = await academicDashboardService.getStudentRequests(limit);
            return {
                success: true,
                data: requests
            };
        } catch (error) {
            throw new Error('Error fetching student requests');
        }
    }
}
