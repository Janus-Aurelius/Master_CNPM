import { Request, Response, NextFunction } from 'express';
import { maintenanceManager } from '../business/adminBussiness/maintenanceManager';

export const checkMaintenance = (req: Request, res: Response, next: NextFunction) => {
    if (maintenanceManager.isInMaintenanceMode()) {
        const clientIP = req.ip || req.connection.remoteAddress || '';
        
        // Cho phép admin truy cập trong chế độ bảo trì
        if (req.user && req.user.role === 'admin') {
            return next();
        }

        // Cho phép các IP được cấu hình truy cập
        if (maintenanceManager.isIPAllowed(clientIP)) {
            return next();
        }

        return res.status(503).json({
            success: false,
            message: maintenanceManager.getMaintenanceMessage()
        });
    }
    next();
};

export const maintenanceMode = (req: Request, res: Response, next: NextFunction): void => {
    const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

    if (isMaintenance) {
        res.status(503).json({
            success: false,
            message: 'Hệ thống đang trong quá trình bảo trì. Vui lòng thử lại sau.'
        });
        return;
    }

    next();
}; 