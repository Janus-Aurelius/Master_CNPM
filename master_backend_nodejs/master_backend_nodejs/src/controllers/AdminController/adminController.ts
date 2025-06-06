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
            const users = await userManager.getAllUsers();
            // TODO: Implement filtering and pagination logic
            res.status(200).json({
                success: true,
                data: users,
                total: users.length,
                page: page ? parseInt(page as string) : 1,
                size: size ? parseInt(size as string) : 10
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