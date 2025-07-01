import { auditlogService } from '../../services/AdminService/auditlogService';
import { AppError } from '../../middleware/errorHandler';
import { IAuditLog } from '../../models/audit/auditLog';
import { RecentActivity } from '../../models/adminDashboard';

class AuditlogManager {
    async getAuditLogs(page: number, size: number): Promise<{
        logs: IAuditLog[];
        total: number;
        page: number;
        size: number;
    }> {
        try {
            if (page < 1) throw new AppError(400, 'Page must be >= 1');
            if (size < 1) throw new AppError(400, 'Size must be >= 1');
            
            return await auditlogService.getAuditLogs(page, size);
        } catch (error) {
            console.error('Error in AuditlogManager.getAuditLogs:', error);
            throw error;
        }
    }

    async getRecentActivities(limit: number = 5): Promise<RecentActivity[]> {
        try {
            if (limit < 1) throw new AppError(400, 'Limit must be >= 1');
            
            return await auditlogService.getRecentActivities(limit);
        } catch (error) {
            console.error('Error in AuditlogManager.getRecentActivities:', error);
            throw error;
        }
    }
}

export const auditlogManager = new AuditlogManager();