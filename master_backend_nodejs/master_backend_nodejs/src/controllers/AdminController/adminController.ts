import { Request, Response, NextFunction } from 'express';
import { userManager } from '../../business/AdminBussiness/userManager';
import { AppError } from '../../middleware/errorHandler';
import * as activityLogManager from '../../business/AdminBussiness/activitylogManager';





class AdminController {

    async getActivityLog(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const size = parseInt(req.query.size as string) || 10;
            const result = await activityLogManager.getActivityLogs(page, size);
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
    }

    async getUserManagement(req: Request, res: Response, next: NextFunction) {
        try {
            const { search, role, page, size } = req.query;
            const result = await userManager.getAllUsers({
                search: search as string,
                role: role as string,
                page: page ? parseInt(page as string) : 1,
                size: size ? parseInt(size as string) : 10
            });
            res.status(200).json({
                success: true,
                ...result
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