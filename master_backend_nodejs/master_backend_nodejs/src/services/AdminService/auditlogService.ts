// src/services/AdminService/auditlogService.ts
import { DatabaseService } from '../database/databaseService';
import { IAuditLog } from '../../models/audit/auditLog';
import { RecentActivity } from '../../models/adminDashboard';

export class auditlogService {
    static async getAuditLogs(page: number, size: number): Promise<{
        logs: IAuditLog[];
        total: number;
        page: number;
        size: number;
    }> {
        try {
            const countResult = await DatabaseService.queryOne(
                'SELECT COUNT(*) as total FROM AUDIT_LOGS'
            );
            const total = parseInt(countResult?.total || '0');

            const logs = await DatabaseService.query(`
                SELECT 
                    id,
                    user_id,
                    action_type,
                    created_at,
                    status,
                    ip_address,
                    user_agent
                FROM AUDIT_LOGS 
                ORDER BY created_at DESC 
                LIMIT $1 OFFSET $2
            `, [size, (page - 1) * size]);

            return {
                logs: logs || [],
                total,
                page,
                size
            };
        } catch (error) {
            console.error('Error in AuditlogService.getAuditLogs:', error);
            throw error;
        }
    }

    static async getRecentActivities(limit: number = 5): Promise<RecentActivity[]> {
        try {
            const activities = await DatabaseService.query(`
                SELECT 
                    id,
                    action_type as message,
                    created_at as time,
                    CASE 
                        WHEN action_type = 'ERROR' THEN 'error'
                        WHEN action_type = 'WARNING' THEN 'warning'
                        ELSE 'info'
                    END as severity
                FROM AUDIT_LOGS
                ORDER BY created_at DESC
                LIMIT $1
            `, [limit]);

            return (activities || []).map(activity => ({
                id: activity.id,
                message: activity.message,
                time: new Date(activity.time).toISOString(),
                severity: activity.severity
            }));
        } catch (error) {
            console.error('Error in AuditlogService.getRecentActivities:', error);
            throw error;
        }
    }

    static async createAuditLog(logData: {
        user_id: string;
        action_type: string;
        status: string;
        created_at?: string;
        ip_address?: string;
        user_agent?: string;
    }): Promise<void> {
        try {
            await DatabaseService.query(`
                INSERT INTO AUDIT_LOGS (
                    user_id,
                    action_type,
                    status,
                    created_at,
                    ip_address,
                    user_agent
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                logData.user_id,
                logData.action_type,
                logData.status,
                logData.created_at || new Date().toISOString(),
                logData.ip_address || null,
                logData.user_agent || null
            ]);
        } catch (error) {
            console.error('Error creating audit log:', error);
            throw error;
        }
    }

    static async getAuditLogsByUser(
        userId: string,
        page: number,
        size: number
    ): Promise<{
        logs: IAuditLog[];
        total: number;
        page: number;
        size: number;
    }> {
        try {
            const countResult = await DatabaseService.queryOne(
                'SELECT COUNT(*) as total FROM AUDIT_LOGS WHERE user_id = $1',
                [userId]
            );
            const total = parseInt(countResult?.total || '0');

            const logs = await DatabaseService.query(`
                SELECT 
                    id,
                    user_id,
                    action_type,
                    created_at,
                    ip_address,
                    user_agent
                FROM AUDIT_LOGS 
                WHERE user_id = $1
                ORDER BY created_at DESC 
                LIMIT $2 OFFSET $3
            `, [userId, size, (page - 1) * size]);

            return {
                logs: logs || [],
                total,
                page,
                size
            };
        } catch (error) {
            console.error('Error fetching user audit logs:', error);
            throw error;
        }
    }
}