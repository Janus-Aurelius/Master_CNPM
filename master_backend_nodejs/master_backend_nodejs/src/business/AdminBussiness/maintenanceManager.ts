class MaintenanceManager {
    private isMaintenanceMode: boolean = false;
    private maintenanceMessage: string = 'System is under maintenance';
    private allowedIPs: string[] = ['127.0.0.1']; // IPs được phép truy cập trong chế độ bảo trì

    isInMaintenanceMode(): boolean {
        return this.isMaintenanceMode;
    }

    getMaintenanceMessage(): string {
        return this.maintenanceMessage;
    }

    async enableMaintenanceMode(message?: string): Promise<void> {
        this.isMaintenanceMode = true;
        if (message) {
            this.maintenanceMessage = message;
        }
    }

    async disableMaintenanceMode(): Promise<void> {
        this.isMaintenanceMode = false;
    }

    async setMaintenanceMessage(message: string): Promise<void> {
        this.maintenanceMessage = message;
    }

    async addAllowedIP(ip: string): Promise<void> {
        if (!this.allowedIPs.includes(ip)) {
            this.allowedIPs.push(ip);
        }
    }

    async removeAllowedIP(ip: string): Promise<void> {
        this.allowedIPs = this.allowedIPs.filter(allowedIP => allowedIP !== ip);
    }

    isIPAllowed(ip: string): boolean {
        return this.allowedIPs.includes(ip);
    }

    getAllowedIPs(): string[] {
        return [...this.allowedIPs];
    }
}

export const maintenanceManager = new MaintenanceManager(); 