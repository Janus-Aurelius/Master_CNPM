import { Request, Response, NextFunction } from 'express';
import { userManager } from '../../business/AdminBussiness/userManager';
import { AppError } from '../../middleware/errorHandler';

class AdminController {
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
            const users = await userManager.getAllUsers();
            res.status(200).json({
                success: true,
                data: users
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