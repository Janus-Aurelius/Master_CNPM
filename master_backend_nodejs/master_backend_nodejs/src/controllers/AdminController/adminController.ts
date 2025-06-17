import { Request, Response, NextFunction } from 'express';
import { userManager } from '../../business/AdminBussiness/userManager';
import { auditlogManager } from '../../business/AdminBussiness/auditlogManager';
import { dashboardAdminManager } from '../../business/AdminBussiness/dashboardManager';


class AdminController {
    async getAuditLog(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;
            
            const result = await auditlogManager.getAuditLogs(page, size);
            
            res.status(200).json({
                success: true,
                data: result.logs,
                total: result.total,
                page: result.page,
                size: result.size
            });
        } catch (error) {
            next(error);
        }
    }

    async getRecentActivities(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            
            const result = await auditlogManager.getRecentActivities(limit);
            
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
    async getDashboard(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await dashboardAdminManager.getDashboardStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }
    async getUserManagement(req: Request, res: Response, next: NextFunction) {
        try {
            const { search, role, page, size } = req.query;
            const { users: userList, total, page: currentPage, totalPages } = await userManager.getAllUsers();
            let users = userList;

            // Filter by role
            if (role && typeof role === 'string') {
                users = users.filter(user => user.role === role);
            }

            // Filter by search (name or email)
            if (search && typeof search === 'string') {
                const searchLower = search.toLowerCase();
                users = users.filter(user =>
                    user.username.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower)
                );
            }

            // Pagination
            const pageNum = page ? parseInt(page as string) : 1;
            const pageSize = size ? parseInt(size as string) : 10;
            const start = (pageNum - 1) * pageSize;
            const pagedUsers = users.slice(start, start + pageSize);

            res.status(200).json({
                success: true,
                data: pagedUsers,
                total,
                page: pageNum,
                size: pageSize
            });
        } catch (error) {
            next(error);
        }
    }

    async getConfig(req: Request, res: Response, next: NextFunction) {
        try {
            const config = await userManager.getSystemConfig();
            res.status(200).json({
                success: true,
                data: config
            });
        } catch (error) {
            next(error);
        }
    }
    
}

export const adminController = new AdminController(); 