import { Request, Response, NextFunction } from 'express';
import { userManager } from '../../business/adminBussiness/userManager';
import { activitylogManager } from '../../business/adminBussiness/activitylogManager';

class AdminController {async getActivityLog(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;
            const result = await activitylogManager.getActivityLogs(page, size);
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
            const stats = await userManager.getDashboardStats();
            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }    async getUserManagement(req: Request, res: Response, next: NextFunction) {
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
                    user.name.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
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

export default new AdminController(); 