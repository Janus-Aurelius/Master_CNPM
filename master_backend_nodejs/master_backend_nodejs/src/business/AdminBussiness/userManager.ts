import { IUser } from '../../models/user';
import { AppError } from '../../middleware/errorHandler';
import * as DashboardService from '../../services/AdminService/dashboardService';
import { DatabaseService } from '../../services/database/databaseService';

class UserManager {
    async getAllUsers(page: number = 1, limit: number = 10, filters?: {
        role?: string,
        status?: boolean,
        search?: string
    }): Promise<{ users: IUser[], total: number, page: number, totalPages: number }> {
        try {
            const offset = (page - 1) * limit;
            let whereConditions = [];
            let queryParams = [];
            let paramIndex = 1;

            if (filters?.role) {
                whereConditions.push(`role = $${paramIndex}`);
                queryParams.push(filters.role);
                paramIndex++;
            }

            if (filters?.status !== undefined) {
                whereConditions.push(`status = $${paramIndex}`);
                queryParams.push(filters.status);
                paramIndex++;
            }

            if (filters?.search) {
                whereConditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
                queryParams.push(`%${filters.search}%`);
                paramIndex++;
            }

            const whereClause = whereConditions.length > 0 
                ? `WHERE ${whereConditions.join(' AND ')}` 
                : '';

            // Get total count
            const totalCount = await DatabaseService.queryOne<{ total: string }>(`
                SELECT COUNT(*) as total
                FROM users
                ${whereClause}
            `, queryParams);

            // Get paginated users
            const users = await DatabaseService.query<IUser>(`
                SELECT *
                FROM users
                ${whereClause}
                ORDER BY created_at DESC
                LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
            `, [...queryParams, limit, offset]);

            return {
                users,
                total: parseInt(totalCount?.total || '0'),
                page,
                totalPages: Math.ceil(parseInt(totalCount?.total || '0') / limit)
            };
        } catch (error) {
            console.error('Error getting users:', error);
            throw new AppError(500, 'Error retrieving users');
        }
    }

    async getUserById(id: number): Promise<IUser | null> {
        try {
            const user = await DatabaseService.queryOne<IUser>(`
                SELECT * FROM users WHERE id = $1
            `, [id]);
            return user || null;
        } catch (error) {
            console.error('Error getting user:', error);
            throw new AppError(500, 'Error retrieving user');
        }
    }

    async createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
        try {
            const existingUser = await DatabaseService.queryOne<IUser>(`
                SELECT * FROM users WHERE email = $1
            `, [userData.email]);

            if (existingUser) {
                throw new AppError(400, 'Email already exists');
            }

            const result = await DatabaseService.query<IUser>(`
                INSERT INTO users (name, email, role, status, created_at, updated_at)
                VALUES ($1, $2, $3, $4, NOW(), NOW())
                RETURNING *
            `, [userData.name, userData.email, userData.role, userData.status]);

            return result[0];
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Error creating user:', error);
            throw new AppError(500, 'Error creating user');
        }
    }

    async updateUser(id: number, userData: Partial<IUser>): Promise<IUser | null> {
        try {
            if (userData.email) {
                const existingUser = await DatabaseService.queryOne<IUser>(`
                    SELECT * FROM users WHERE email = $1 AND id != $2
                `, [userData.email, id]);

                if (existingUser) {
                    throw new AppError(400, 'Email already exists');
                }
            }

            const result = await DatabaseService.query<IUser>(`
                UPDATE users 
                SET 
                    name = COALESCE($1, name),
                    email = COALESCE($2, email),
                    role = COALESCE($3, role),
                    status = COALESCE($4, status),
                    updated_at = NOW()
                WHERE id = $5
                RETURNING *
            `, [userData.name, userData.email, userData.role, userData.status, id]);

            return result[0] || null;
        } catch (error) {
            if (error instanceof AppError) throw error;
            console.error('Error updating user:', error);
            throw new AppError(500, 'Error updating user');
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            // Start transaction
            await DatabaseService.query('BEGIN');

            try {
                // Delete related records first
                await DatabaseService.query(`
                    DELETE FROM user_sessions WHERE user_id = $1;
                    DELETE FROM audit_logs WHERE user_id = $1;
                    DELETE FROM academic_requests WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1);
                    DELETE FROM enrollments WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1);
                    DELETE FROM tuition_records WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1);
                    DELETE FROM payment_receipts WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1);
                    DELETE FROM students WHERE user_id = $1;
                `, [id]);

                // Finally delete the user
                const result = await DatabaseService.query<IUser>(`
                    DELETE FROM users WHERE id = $1 RETURNING *
                `, [id]);

                // Commit transaction
                await DatabaseService.query('COMMIT');

                return result.length > 0;
            } catch (error) {
                // Rollback on error
                await DatabaseService.query('ROLLBACK');
                throw error;
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new AppError(500, 'Error deleting user and related data');
        }
    }

    async changeUserStatus(id: number, status: boolean): Promise<IUser | null> {
        try {
            const result = await DatabaseService.query<IUser>(`
                UPDATE users 
                SET 
                    status = $1
                WHERE id = $2
                RETURNING *
            `, [status, id]);
            return result[0] || null;
        } catch (error) {
            console.error('Error changing user status:', error);
            throw new AppError(500, 'Error changing user status');
        }
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