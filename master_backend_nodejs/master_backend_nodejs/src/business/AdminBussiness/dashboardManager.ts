import { IUser } from '../../models/user';
import { AppError } from '../../middleware/errorHandler';
import * as userService from '../../services/AdminService/userService';
import { DashboardSummary } from '../../models/adminDashboard';
import { dashboardService } from '../../services/studentService';
import {DashboardService} from '../../services/AdminService/dashboardService';

class dashboardManager {
    async getDashboardStats(): Promise<DashboardSummary> {
        try {
            const stats = await DashboardService.getDashboardStats();
            return stats || {
                totalStudents: 0,
                pendingPayments: 0,
                newRegistrations: 0,
                systemAlerts: 0
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Fallback to service call with same interface
            return {
                totalStudents: 0,
                pendingPayments: 0,
                newRegistrations: 0,
                systemAlerts: 0
            };
        }
    }
}
export const dashboardAdminManager= new dashboardManager();