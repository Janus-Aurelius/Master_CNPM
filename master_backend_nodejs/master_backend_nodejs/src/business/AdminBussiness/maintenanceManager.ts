import { AppError } from '../../middleware/errorHandler';

class MaintenanceManager {
    private isMaintenanceMode: boolean = false;
    private maintenanceMessage: string = '';
    private allowedIPs: string[] = [];

    async getStatus() {
        try {
            return {
                isMaintenanceMode: this.isMaintenanceMode,
                message: this.maintenanceMessage,
                allowedIPs: this.allowedIPs
            };
        } catch (error) {
            throw new AppError(500, 'Error getting maintenance status');
        }
    }

    async enable(message: string) {
        try {
            this.isMaintenanceMode = true;
            this.maintenanceMessage = message || 'System is under maintenance';
        } catch (error) {
            throw new AppError(500, 'Error enabling maintenance mode');
        }
    }

    async disable() {
        try {
            this.isMaintenanceMode = false;
            this.maintenanceMessage = '';
        } catch (error) {
            throw new AppError(500, 'Error disabling maintenance mode');
        }
    }

    async updateMessage(message: string) {
        try {
            if (!message) {
                throw new AppError(400, 'Message is required');
            }
            this.maintenanceMessage = message;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Error updating maintenance message');
        }
    }

    async addAllowedIP(ip: string) {
        try {
            if (!ip) {
                throw new AppError(400, 'IP address is required');
            }
            if (!this.allowedIPs.includes(ip)) {
                this.allowedIPs.push(ip);
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Error adding IP to allowed list');
        }
    }

    async removeAllowedIP(ip: string) {
        try {
            if (!ip) {
                throw new AppError(400, 'IP address is required');
            }
            this.allowedIPs = this.allowedIPs.filter(allowedIP => allowedIP !== ip);
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Error removing IP from allowed list');
        }
    }

    isInMaintenanceMode(): boolean {
        return this.isMaintenanceMode;
    }

    getMaintenanceMessage(): string {
        return this.maintenanceMessage;
    }

    getAllowedIPs(): string[] {
        return [...this.allowedIPs];
    }

    isIPAllowed(ip: string): boolean {
        return this.allowedIPs.includes(ip);
    }
}

export const maintenanceManager = new MaintenanceManager(); 