// src/services/AdminService/dashboardService.ts
import { DatabaseService } from '../database/databaseService';
import { DashboardSummary } from '../../models/adminDashboard';

export class DashboardService {
    static async getDashboardStats(): Promise<DashboardSummary> {
        try {
            const totalStudents = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count 
                FROM SINHVIEN 
                WHERE MaSoSinhVien IS NOT NULL
            `);

            const pendingPayments = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count 
                FROM PHIEUDANGKY 
                WHERE SoTienConLai > 0
            `);

            const newRegistrations = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count 
                FROM PHIEUDANGKY 
                WHERE NgayLap >= CURRENT_DATE - INTERVAL '7 days'
            `);

            const systemAlerts = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count 
                FROM AUDIT_LOGS 
                WHERE action_type = 'ERROR' 
                AND created_at >= CURRENT_DATE - INTERVAL '7 days'
            `);

            return {
                totalStudents: totalStudents?.count || 0,
                pendingPayments: pendingPayments?.count || 0,
                newRegistrations: newRegistrations?.count || 0,
                systemAlerts: systemAlerts?.count || 0
            };
        } catch (error) {
            console.error('Error fetching admin dashboard stats:', error);
            throw error;
        }
    }

    static async getAuditLogs(page: number = 1, size: number = 10) {
        try {
            const offset = (page - 1) * size;

            const logs = await DatabaseService.query(`
                SELECT 
                    id,
                    user_id,
                    action_type,
                    details,
                    created_at,
                    ip_address,
                    user_agent
                FROM AUDIT_LOGS
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
            `, [size, offset]);

            const total = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count
                FROM AUDIT_LOGS
            `);

            return {
                logs,
                total: total?.count || 0,
                page,
                size
            };
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            throw error;
        }
    }

    static async getRecentActivities(limit: number = 5) {
        try {
            const activities = await DatabaseService.query(`
                SELECT 
                    id,
                    user_id,
                    action_type,
                    details,
                    created_at
                FROM AUDIT_LOGS
                ORDER BY created_at DESC
                LIMIT $1
            `, [limit]);

            return activities;
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            throw error;
        }
    }
}