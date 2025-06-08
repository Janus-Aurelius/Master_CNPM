import UserService from '../../services/adminService/UserService';
import { User } from '../../models/user';
import { AppError } from '../../middleware/errorHandler';
import * as DashboardService from '../../services/adminService/dashboardService';
import { DatabaseService } from '../../services/database/databaseService';

class UserManager {
    async getAllUsers(): Promise<User[]> {
        return UserService.getAllUsers();
    }

    async getUserById(id: number): Promise<User | null> {
        return UserService.getUserById(id);
    }

    async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const existingUsers = await UserService.getAllUsers();
        if (existingUsers.some((user: User) => user.email === userData.email)) {
            throw new AppError(400, 'Email already exists');
        }
        return UserService.createUser({
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
        const existingUsers = await UserService.getAllUsers();
        if (userData.email && existingUsers.some((user: User) => user.email === userData.email && user.id !== id)) {
            throw new AppError(400, 'Email already exists');
        }
        return UserService.updateUser(id, userData);
    }

    async deleteUser(id: number): Promise<boolean> {
        return UserService.deleteUser(id);
    }

    async changeUserStatus(id: number, status: boolean): Promise<User | null> {
        return UserService.updateUser(id, { status });
    }

    async getDashboardStats() {
        try {
            // Get comprehensive dashboard stats from database
            const userStats = await DatabaseService.queryOne(`
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN status = true THEN 1 END) as active_users,
                    COUNT(CASE WHEN status = false THEN 1 END) as inactive_users,
                    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
                    COUNT(CASE WHEN role = 'academic_staff' THEN 1 END) as academic_staff,
                    COUNT(CASE WHEN role = 'financial_staff' THEN 1 END) as financial_staff,
                    COUNT(CASE WHEN role = 'student' THEN 1 END) as students
                FROM users
            `);

            const systemStats = await DatabaseService.queryOne(`
                SELECT 
                    COUNT(DISTINCT student_id) as total_students,
                    COUNT(DISTINCT subject_code) as total_subjects,
                    COUNT(*) as total_courses
                FROM open_courses
            `);

            const recentActivity = await DatabaseService.query(`
                SELECT 
                    'user_created' as type,
                    'New user: ' || name || ' (' || role || ')' as description,
                    created_at as timestamp,
                    'System' as user
                FROM users 
                WHERE created_at >= NOW() - INTERVAL '7 days'
                ORDER BY created_at DESC
                LIMIT 5
            `);

            return {
                userStatistics: userStats || {
                    total_users: 0,
                    active_users: 0,
                    inactive_users: 0,
                    admin_users: 0,
                    academic_staff: 0,
                    financial_staff: 0,
                    students: 0
                },
                systemStatistics: systemStats || {
                    total_students: 0,
                    total_subjects: 0,
                    total_courses: 0
                },
                recentActivity: recentActivity || [],
                systemHealth: {
                    databaseStatus: 'healthy',
                    serverUptime: process.uptime(),
                    memoryUsage: process.memoryUsage(),
                    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                }
            };        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Fallback to service call
            return await DashboardService.getDashboardStats();
        }
    }

    async getSystemConfig() {
        try {
            // Get system configuration from database
            const configs = await DatabaseService.query(`
                SELECT setting_key, setting_value, setting_type 
                FROM system_settings 
                WHERE setting_key IN (
                    'max_users', 'allowed_domains', 'password_min_length',
                    'password_require_numbers', 'password_require_special_chars',
                    'session_timeout', 'maintenance_mode', 'backup_frequency'
                )
            `);

            const configMap: any = {};
            configs.forEach((config: any) => {
                let value = config.setting_value;
                if (config.setting_type === 'number') {
                    value = parseInt(value, 10);
                } else if (config.setting_type === 'boolean') {
                    value = value === 'true';
                } else if (config.setting_type === 'json') {
                    value = JSON.parse(value);
                }
                configMap[config.setting_key] = value;
            });

            return {
                maxUsers: configMap.max_users || 1000,
                allowedDomains: configMap.allowed_domains || ['@example.com', '@admin.com'],
                passwordPolicy: {
                    minLength: configMap.password_min_length || 8,
                    requireNumbers: configMap.password_require_numbers ?? true,
                    requireSpecialChars: configMap.password_require_special_chars ?? true
                },
                sessionTimeout: configMap.session_timeout || 3600,
                maintenanceMode: configMap.maintenance_mode || false,
                backupFrequency: configMap.backup_frequency || 'daily'
            };
        } catch (error) {
            console.error('Error fetching system config:', error);
            // Fallback to default config
            return {
                maxUsers: 1000,
                allowedDomains: ['@example.com', '@admin.com'],
                passwordPolicy: {
                    minLength: 8,
                    requireNumbers: true,
                    requireSpecialChars: true
                },
                sessionTimeout: 3600,
                maintenanceMode: false,                backupFrequency: 'daily'
            };
        }
    }

    async updateSystemConfig(configKey: string, configValue: any) {
        try {
            let settingType = 'string';
            let settingValue = configValue;

            if (typeof configValue === 'number') {
                settingType = 'number';
                settingValue = configValue.toString();
            } else if (typeof configValue === 'boolean') {
                settingType = 'boolean';
                settingValue = configValue.toString();
            } else if (typeof configValue === 'object') {
                settingType = 'json';
                settingValue = JSON.stringify(configValue);
            }

            await DatabaseService.query(`
                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET 
                    setting_value = EXCLUDED.setting_value,
                    setting_type = EXCLUDED.setting_type,
                    updated_at = NOW()
            `, [configKey, settingValue, settingType]);            return { success: true, message: 'System configuration updated successfully' };
        } catch (error) {
            console.error('Error updating system config:', error);
            throw new AppError(500, 'Error updating system configuration');
        }
    }

    async getAuditLogs(limit: number = 50) {
        try {
            const auditLogs = await DatabaseService.query(`
                SELECT 
                    id,
                    user_id,
                    action,
                    resource,
                    details,
                    ip_address,
                    created_at
                FROM audit_logs 
                ORDER BY created_at DESC 
                LIMIT $1
            `, [limit]);            return auditLogs || [];
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            return [];
        }
    }

    async createAuditLog(userId: number, action: string, resource: string, details: string, ipAddress?: string) {
        try {
            await DatabaseService.query(`
                INSERT INTO audit_logs (user_id, action, resource, details, ip_address, created_at)
                VALUES ($1, $2, $3, $4, $5, NOW())
            `, [userId, action, resource, details, ipAddress]);
        } catch (error) {
            console.error('Error creating audit log:', error);
        }
    }
}

export const userManager = new UserManager(); 