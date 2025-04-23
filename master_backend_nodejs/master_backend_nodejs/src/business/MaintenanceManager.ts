import { Maintenance } from '../models/maintenance';
import { AppError, ValidationError, NotFoundError } from '../middleware/errorHandler';

export class MaintenanceManager {
    async createMaintenance(maintenanceData: Omit<Maintenance, 'id'>): Promise<Maintenance> {
        try {
            if (!maintenanceData.message) {
                throw new ValidationError('Message is required');
            }
            const maintenance = await Maintenance.create(maintenanceData);
            return maintenance;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Failed to create maintenance');
        }
    }

    async getMaintenance(maintenanceId: number): Promise<Maintenance | null> {
        try {
            const maintenance = await Maintenance.findByPk(maintenanceId);
            return maintenance;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Failed to get maintenance');
        }
    }

    async updateMaintenance(maintenanceId: number, maintenanceData: Partial<Maintenance>): Promise<Maintenance | null> {
        try {
            const maintenance = await Maintenance.findByPk(maintenanceId);
            if (!maintenance) {
                throw new NotFoundError('Maintenance');
            }

            await maintenance.update(maintenanceData);
            return maintenance;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Failed to update maintenance');
        }
    }

    async deleteMaintenance(maintenanceId: number): Promise<boolean> {
        try {
            const maintenance = await Maintenance.findByPk(maintenanceId);
            if (!maintenance) {
                throw new NotFoundError('Maintenance');
            }

            await maintenance.destroy();
            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Failed to delete maintenance');
        }
    }
} 