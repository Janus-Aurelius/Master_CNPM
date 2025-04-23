import { Request, Response, NextFunction } from 'express';
import { MaintenanceManager } from '../business/MaintenanceManager';
import { AppError, ValidationError, NotFoundError } from '../middleware/errorHandler';

export class MaintenanceController {
    private maintenanceManager: MaintenanceManager;

    constructor() {
        this.maintenanceManager = new MaintenanceManager();
    }

    async createMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            const maintenanceData = req.body;
            if (!maintenanceData.message) {
                throw new ValidationError('Message is required');
            }
            const maintenance = await this.maintenanceManager.createMaintenance(maintenanceData);
            res.status(201).json({
                status: 'success',
                data: maintenance
            });
        } catch (error) {
            next(error);
        }
    }

    async getMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            const maintenanceId = req.params.id;
            const maintenance = await this.maintenanceManager.getMaintenance(maintenanceId);
            if (!maintenance) {
                throw new NotFoundError('Maintenance');
            }
            res.status(200).json({
                status: 'success',
                data: maintenance
            });
        } catch (error) {
            next(error);
        }
    }

    async updateMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            const maintenanceId = req.params.id;
            const maintenanceData = req.body;
            const maintenance = await this.maintenanceManager.updateMaintenance(maintenanceId, maintenanceData);
            if (!maintenance) {
                throw new NotFoundError('Maintenance');
            }
            res.status(200).json({
                status: 'success',
                data: maintenance
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteMaintenance(req: Request, res: Response, next: NextFunction) {
        try {
            const maintenanceId = req.params.id;
            const success = await this.maintenanceManager.deleteMaintenance(maintenanceId);
            if (!success) {
                throw new NotFoundError('Maintenance');
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
} 