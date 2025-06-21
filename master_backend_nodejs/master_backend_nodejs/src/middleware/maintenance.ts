import { Request, Response, NextFunction } from 'express';
import { maintenanceManager } from '../business/AdminBussiness/maintenanceManager';
import { Database } from '../config/database';

export const checkMaintenance = async (req: Request, res: Response, next: NextFunction) => {
    if (maintenanceManager.isInMaintenanceMode()) {
        const clientIP = req.ip || req.connection.remoteAddress || '';
        
        // Nếu là route đăng nhập, kiểm tra username có phải admin không
        if (req.path === '/login' && req.method === 'POST') {
            const { username } = req.body;
            if (username) {
                const result = await Database.query(
                    'SELECT manhom FROM NGUOIDUNG WHERE TenDangNhap = $1',
                    [username]
                );
                
                if (result[0]?.manhom === 'N1') {
                    return next();
                }
            }
        }
        // Cho phép admin đã đăng nhập truy cập
        else if (req.user && req.user.role === 'admin') {
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