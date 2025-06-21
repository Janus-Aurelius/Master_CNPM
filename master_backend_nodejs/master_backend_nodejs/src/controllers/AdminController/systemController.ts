import { Request, Response, NextFunction } from 'express';
import { systemManager} from '../../business/AdminBussiness/systemManager'; // Corrected import path
import { maintenanceManager } from '../../business/AdminBussiness/maintenanceManager';
import { auditlogManager } from '../../business/AdminBussiness/auditlogManager';

export class SecurityController {
    async getSecuritySettings(req: Request, res: Response, next: NextFunction) {
        try {
            const settings = await systemManager.getSecuritySettings();
            res.json(settings);
        } catch (err) {
            next(err);
        }
    }
    async updateSecuritySettings(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const result = await systemManager.updateSecuritySettings(data);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
    async disableMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            await maintenanceManager.disable();
            res.status(200).json({ success: true });
        } catch (err) {
            next(err);
        }
    }
    async enableMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            const { message } = req.body;
            await maintenanceManager.enable(message);
            res.status(200).json({ success: true });
        } catch (err) {
            next(err);
        }
    }
    
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

}
export const securityController = new SecurityController();