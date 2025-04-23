import { Request, Response } from 'express';
import { maintenanceManager } from '../../business/AdminBussiness';

class MaintenanceController {
    async getMaintenanceStatus(req: Request, res: Response) {
        try {
            res.status(200).json({
                success: true,
                data: {
                    isMaintenanceMode: maintenanceManager.isInMaintenanceMode(),
                    message: maintenanceManager.getMaintenanceMessage(),
                    allowedIPs: maintenanceManager.getAllowedIPs()
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error getting maintenance status'
            });
        }
    }

    async enableMaintenance(req: Request, res: Response) {
        try {
            const { message } = req.body;
            await maintenanceManager.enableMaintenanceMode(message);
            
            res.status(200).json({
                success: true,
                message: 'Maintenance mode enabled'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error enabling maintenance mode'
            });
        }
    }

    async disableMaintenance(req: Request, res: Response) {
        try {
            await maintenanceManager.disableMaintenanceMode();
            
            res.status(200).json({
                success: true,
                message: 'Maintenance mode disabled'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error disabling maintenance mode'
            });
        }
    }

    async updateMaintenanceMessage(req: Request, res: Response) {
        try {
            const { message } = req.body;
            await maintenanceManager.setMaintenanceMessage(message);
            
            res.status(200).json({
                success: true,
                message: 'Maintenance message updated'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error updating maintenance message'
            });
        }
    }

    async addAllowedIP(req: Request, res: Response) {
        try {
            const { ip } = req.body;
            await maintenanceManager.addAllowedIP(ip);
            
            res.status(200).json({
                success: true,
                message: 'IP added to allowed list'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error adding IP to allowed list'
            });
        }
    }

    async removeAllowedIP(req: Request, res: Response) {
        try {
            const { ip } = req.body;
            await maintenanceManager.removeAllowedIP(ip);
            
            res.status(200).json({
                success: true,
                message: 'IP removed from allowed list'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error removing IP from allowed list'
            });
        }
    }
}

export default new MaintenanceController(); 