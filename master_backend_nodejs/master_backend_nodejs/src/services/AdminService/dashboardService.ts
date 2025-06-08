// src/services/AdminService/dashboardService.ts
import { DatabaseService } from '../database/databaseService';

export const getDashboardStats = async () => {
    try {
        const totalStudents = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM students`);
        const pendingPayments = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM payments WHERE status = 'pending'`);
        const newRegistrations = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM registrations WHERE created_at >= NOW() - INTERVAL '7 days'`);
        const systemWarnings = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM system_warnings WHERE resolved = false`);
        return {
            totalStudents: totalStudents?.count || 0,
            pendingPayments: pendingPayments?.count || 0,
            newRegistrations: newRegistrations?.count || 0,
            systemWarnings: systemWarnings?.count || 0
        };
    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        throw error;
    }
};