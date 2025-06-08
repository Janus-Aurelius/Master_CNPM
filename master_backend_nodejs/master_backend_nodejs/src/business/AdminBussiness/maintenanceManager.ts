import { AppError } from '../../middleware/errorHandler';
import { DatabaseService } from '../../services/database/databaseService';

class MaintenanceManager {
    private isMaintenanceMode: boolean = false;
    private maintenanceMessage: string = '';
    private allowedIPs: string[] = [];    async getStatus() {
        try {
            // Get maintenance status from database
            const maintenanceSettings = await DatabaseService.query(`
                SELECT setting_key, setting_value 
                FROM system_settings 
                WHERE setting_key IN ('maintenance_mode', 'maintenance_message', 'maintenance_allowed_ips')
            `);

            const settings: any = {};
            maintenanceSettings.forEach((setting: any) => {
                if (setting.setting_key === 'maintenance_allowed_ips') {
                    settings[setting.setting_key] = setting.setting_value ? JSON.parse(setting.setting_value) : [];
                } else if (setting.setting_key === 'maintenance_mode') {
                    settings[setting.setting_key] = setting.setting_value === 'true';
                } else {
                    settings[setting.setting_key] = setting.setting_value;
                }
            });

            return {
                isMaintenanceMode: settings.maintenance_mode || this.isMaintenanceMode,
                message: settings.maintenance_message || this.maintenanceMessage,
                allowedIPs: settings.maintenance_allowed_ips || this.allowedIPs,
                lastUpdated: new Date().toISOString(),
                systemStatus: await this.getSystemHealth()
            };
        } catch (error) {
            console.error('Error getting maintenance status:', error);
            // Fallback to in-memory values
            return {
                isMaintenanceMode: this.isMaintenanceMode,
                message: this.maintenanceMessage,
                allowedIPs: this.allowedIPs
            };
        }
    }

    async enable(message: string) {
        try {
            this.isMaintenanceMode = true;
            this.maintenanceMessage = message || 'System is under maintenance';

            // Update database
            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ('maintenance_mode', 'true', 'boolean', NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = 'true', updated_at = NOW()
            `);

            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ('maintenance_message', $1, 'string', NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = $1, updated_at = NOW()
            `, [this.maintenanceMessage]);

            // Log the maintenance activation
            await this.logMaintenanceAction('ENABLED', `Maintenance mode enabled: ${this.maintenanceMessage}`);        } catch (error) {
            console.error('Error enabling maintenance mode:', error);
            throw new AppError(500, 'Error enabling maintenance mode');
        }
    }

    async disable() {
        try {
            this.isMaintenanceMode = false;
            this.maintenanceMessage = '';

            // Update database
            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ('maintenance_mode', 'false', 'boolean', NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = 'false', updated_at = NOW()
            `);

            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ('maintenance_message', '', 'string', NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = '', updated_at = NOW()
            `);

            // Log the maintenance deactivation
            await this.logMaintenanceAction('DISABLED', 'Maintenance mode disabled');        } catch (error) {
            console.error('Error disabling maintenance mode:', error);
            throw new AppError(500, 'Error disabling maintenance mode');
        }
    }

    async updateMessage(message: string) {
        try {
            if (!message) {
                throw new AppError(400, 'Message is required');
            }
            
            this.maintenanceMessage = message;

            // Update database
            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ('maintenance_message', $1, 'string', NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = $1, updated_at = NOW()
            `, [message]);

            // Log the message update
            await this.logMaintenanceAction('MESSAGE_UPDATED', `Maintenance message updated: ${message}`);

        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Error updating maintenance message:', error);
            throw new AppError(500, 'Error updating maintenance message');
        }
    }    async addAllowedIP(ip: string) {
        try {
            if (!ip) {
                throw new AppError(400, 'IP address is required');
            }
            
            // Get current allowed IPs from database
            const result = await DatabaseService.query(`
                SELECT setting_value FROM system_settings 
                WHERE setting_key = 'maintenance_allowed_ips'
            `);

            let currentIPs: string[] = [];
            if (result.length > 0 && result[0].setting_value) {
                currentIPs = JSON.parse(result[0].setting_value);
            }

            if (!currentIPs.includes(ip)) {
                currentIPs.push(ip);
                this.allowedIPs = currentIPs;

                // Update database
                await DatabaseService.query(`
                    INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                    VALUES ('maintenance_allowed_ips', $1, 'json', NOW())
                    ON CONFLICT (setting_key) 
                    DO UPDATE SET setting_value = $1, updated_at = NOW()
                `, [JSON.stringify(currentIPs)]);

                // Log the IP addition
                await this.logMaintenanceAction('IP_ADDED', `Added IP to allowed list: ${ip}`);
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Error adding IP to allowed list:', error);
            throw new AppError(500, 'Error adding IP to allowed list');
        }
    }

    async removeAllowedIP(ip: string) {
        try {
            if (!ip) {
                throw new AppError(400, 'IP address is required');
            }
            
            // Get current allowed IPs from database
            const result = await DatabaseService.query(`
                SELECT setting_value FROM system_settings 
                WHERE setting_key = 'maintenance_allowed_ips'
            `);

            let currentIPs: string[] = [];
            if (result.length > 0 && result[0].setting_value) {
                currentIPs = JSON.parse(result[0].setting_value);
            }

            const filteredIPs = currentIPs.filter(allowedIP => allowedIP !== ip);
            this.allowedIPs = filteredIPs;

            // Update database
            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ('maintenance_allowed_ips', $1, 'json', NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = $1, updated_at = NOW()
            `, [JSON.stringify(filteredIPs)]);

            // Log the IP removal
            await this.logMaintenanceAction('IP_REMOVED', `Removed IP from allowed list: ${ip}`);

        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Error removing IP from allowed list:', error);
            throw new AppError(500, 'Error removing IP from allowed list');
        }
    }

    async getSystemHealth() {
        try {
            // Check database connectivity
            const dbCheck = await DatabaseService.query('SELECT 1 as alive');
            const isDatabaseHealthy = dbCheck.length > 0;

            // Get system metrics
            const systemMetrics = await DatabaseService.query(`
                SELECT 
                    COUNT(*) as total_users 
                FROM users
                UNION ALL
                SELECT COUNT(*) as active_sessions 
                FROM user_sessions 
                WHERE expires_at > NOW()
                UNION ALL
                SELECT COUNT(*) as pending_requests 
                FROM academic_requests 
                WHERE status = 'pending'
            `);

            return {
                database: isDatabaseHealthy ? 'healthy' : 'unhealthy',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                timestamp: new Date().toISOString(),
                metrics: {
                    totalUsers: systemMetrics[0]?.total_users || 0,
                    activeSessions: systemMetrics[1]?.active_sessions || 0,
                    pendingRequests: systemMetrics[2]?.pending_requests || 0
                }
            };
        } catch (error) {
            console.error('Error getting system health:', error);
            return {
                database: 'unhealthy',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                timestamp: new Date().toISOString(),
                error: 'Health check failed'
            };
        }
    }

    async logMaintenanceAction(action: string, details: string) {
        try {
            await DatabaseService.query(`
                INSERT INTO audit_logs (
                    action_type, 
                    details, 
                    created_at,
                    user_id,
                    ip_address,
                    user_agent
                ) VALUES ($1, $2, NOW(), 'system', 'system', 'maintenance-manager')
            `, [action, details]);
        } catch (error) {
            console.error('Error logging maintenance action:', error);
            // Don't throw error for logging failures
        }
    }

    async getMaintenanceHistory(limit: number = 50) {
        try {
            const history = await DatabaseService.query(`
                SELECT 
                    action_type,
                    details,
                    created_at,
                    user_id
                FROM audit_logs 
                WHERE action_type IN ('ENABLED', 'DISABLED', 'MESSAGE_UPDATED', 'IP_ADDED', 'IP_REMOVED')
                ORDER BY created_at DESC 
                LIMIT $1
            `, [limit]);

            return history.map((log: any) => ({
                action: log.action_type,
                details: log.details,
                timestamp: log.created_at,
                userId: log.user_id
            }));
        } catch (error) {
            console.error('Error getting maintenance history:', error);
            return [];
        }
    }

    async scheduleMaintenanceWindow(startTime: Date, endTime: Date, message: string) {
        try {
            // Store scheduled maintenance in database
            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ('scheduled_maintenance', $1, 'json', NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = $1, updated_at = NOW()
            `, [JSON.stringify({
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                message: message,
                scheduled: true
            })]);

            await this.logMaintenanceAction('SCHEDULED', `Maintenance scheduled from ${startTime.toISOString()} to ${endTime.toISOString()}: ${message}`);

            return {
                success: true,
                scheduledWindow: {
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    message
                }
            };
        } catch (error) {
            console.error('Error scheduling maintenance window:', error);
            throw new AppError(500, 'Error scheduling maintenance window');
        }
    }

    async getScheduledMaintenance() {
        try {
            const result = await DatabaseService.query(`
                SELECT setting_value FROM system_settings 
                WHERE setting_key = 'scheduled_maintenance'
            `);

            if (result.length > 0 && result[0].setting_value) {
                return JSON.parse(result[0].setting_value);
            }

            return null;
        } catch (error) {
            console.error('Error getting scheduled maintenance:', error);
            return null;
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