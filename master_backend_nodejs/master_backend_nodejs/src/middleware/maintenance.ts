import { Request, Response, NextFunction } from 'express';
import { maintenanceManager } from '../business/adminBussiness';

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