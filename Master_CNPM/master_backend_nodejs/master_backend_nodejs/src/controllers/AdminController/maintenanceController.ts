import { Request, Response, NextFunction } from 'express';
import { maintenanceManager } from '../../business/AdminBussiness/maintenanceManager';
import { AppError } from '../../middleware/errorHandler';

export class MaintenanceController {
    async getMaintenanceStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const status = await maintenanceManager.getStatus();
            res.status(200).json({
                success: true,
                data: status
            });
        } catch (error) {
            next(error);
        }
    }

    async enableMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            const { message } = req.body;
            await maintenanceManager.enable(message);
            res.status(200).json({
                success: true,
                message: 'Maintenance mode enabled'
            });
        } catch (error) {
            next(error);
        }
    }

    async disableMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            await maintenanceManager.disable();
            res.status(200).json({
                success: true,
                message: 'Maintenance mode disabled'
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMaintenanceMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const { message } = req.body;
            if (!message) {
                throw new AppError(400, 'Message is required');
            }
            await maintenanceManager.updateMessage(message);
            res.status(200).json({
                success: true,
                message: 'Maintenance message updated'
            });
        } catch (error) {
            next(error);
        }
    }

    async addAllowedIP(req: Request, res: Response, next: NextFunction) {
        try {
            const { ip } = req.body;
            if (!ip) {
                throw new AppError(400, 'IP address is required');
            }
            await maintenanceManager.addAllowedIP(ip);
            res.status(200).json({
                success: true,
                message: 'IP address added to allowed list'
            });
        } catch (error) {
            next(error);
        }
    }

    async removeAllowedIP(req: Request, res: Response, next: NextFunction) {
        try {
            const { ip } = req.body;
            if (!ip) {
                throw new AppError(400, 'IP address is required');
            }
            await maintenanceManager.removeAllowedIP(ip);
            res.status(200).json({
                success: true,
                message: 'IP address removed from allowed list'
            });
        } catch (error) {
            next(error);
        }
    }

    async toggleMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            const { enable } = req.body;
            if (enable) {
                await maintenanceManager.enable("Máy chủ đang bảo trì");
            } else {
                await maintenanceManager.disable();
            }
            res.status(200).json({ maintenanceMode: enable });
        } catch (error) {
            next(error);
        }
    }
}

export default new MaintenanceController(); 