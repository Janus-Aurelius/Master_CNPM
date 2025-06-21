// src/business/AdminBussiness/securityManager.ts
import { securityService } from '../../services/AdminService/systemService';
import { maintenanceManager } from './maintenanceManager';
import { auditlogManager } from './auditlogManager';

class SystemManager {
    async getSecuritySettings() {
        return await securityService.getSecuritySettings();
    }
    async updateSecuritySettings(data: any) {
        // Validate nếu muốn
        return await securityService.updateSecuritySettings(data);
    }
    
}
export const systemManager = new SystemManager();