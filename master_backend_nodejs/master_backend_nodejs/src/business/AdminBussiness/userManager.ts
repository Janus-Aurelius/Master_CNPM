import { IUser, IUserSearchResult } from '../../models/user';
import { AppError } from '../../middleware/errorHandler';
import * as userService from '../../services/AdminService/userService';
import { DashboardSummary } from '../../models/adminDashboard';


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

            if (filters?.status === true || filters?.status === false) {
                whereConditions.push(`nguoidung.TrangThai = $${paramIndex}`);
                queryParams.push(filters.status ? 'active' : 'inactive');
                paramIndex++;
            }

            if (filters?.role && filters.role !== 'all') {
                whereConditions.push(`nguoidung.MaNhom = $${paramIndex}`);
                queryParams.push(filters.role);
                paramIndex++;
            }

            if (filters?.search) {
                whereConditions.push(`(nguoidung.UserID ILIKE $${paramIndex} OR nguoidung.TenDangNhap ILIKE $${paramIndex} OR sinhvien.HoTen ILIKE $${paramIndex})`);
                queryParams.push(`%${filters.search}%`);
                paramIndex++;
            }

            const whereClause = whereConditions.length > 0 
                ? `WHERE ${whereConditions.join(' AND ')}` 
                : '';
            console.log('Request params:', { page, limit, filters });
            console.log('Final whereClause:', whereClause);
            console.log('Final queryParams:', queryParams);

            const totalCount = await userService.getUserCount(whereClause, queryParams);
            const total = parseInt(totalCount?.total || '0');

            const users = await userService.getAllUsers(whereClause, queryParams, limit, offset);

            return {
                users: users || [],
                total,
                page,
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            throw new AppError(500, 'Error retrieving users: ' + (error as Error).message);
        }
    }

    async getUserById(id: string): Promise<{ users: IUser[], total: number, page: number, totalPages: number }> {
        try {
            const user = await userService.getUserById(id);
            return {
                users: user ? [user] : [],
                total: user ? 1 : 0,
                page: 1,
                totalPages: 1
            };
        } catch (error) {
            console.error('Error getting user:', error);
            throw new AppError(500, 'Error retrieving user');
        }
    }

    async createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
        // Validate studentId thay vì email
        if (!userData.studentId) throw new AppError(400, 'Student ID is required');
        
        // Check duplicate username (mã số sinh viên)
        const existingUser = await userService.getUserByUsername(userData.studentId);
        if (existingUser) throw new AppError(400, 'User already exists');

        // Nếu là sinh viên thì kiểm tra tồn tại trong bảng SINHVIEN
        if (userData.role === 'N3') {
            const student = await userService.getStudentById(userData.studentId);
            if (!student) throw new AppError(400, 'Student does not exist');
        }

        // Sinh mã UserID mới
        const lastUser = await userService.getLastUser();
        let newUserId = 'U001';
        if (lastUser && lastUser.UserID) {
            const num = parseInt(lastUser.UserID.replace('U', '')) + 1;
            newUserId = 'U' + num.toString().padStart(3, '0');
        }

        // Gọi service để insert - dùng studentId làm TenDangNhap
        const result = await userService.createUser({
            username: userData.studentId,
            userId: newUserId,
            password: '123456',
            role: userData.role || '',
            studentId: userData.studentId,
            status: userData.status ? 'active' : 'inactive'
        });
        if (!result) throw new AppError(500, 'Failed to create user');
        return result;
    }

    async updateUser(
        id: string,
        userData: { name?: string; department?: string; status?: string; studentid?: string; role?: string }
    ): Promise<IUser | null> {
        // Nếu là sinh viên, cập nhật họ tên và mã ngành (department là mã ngành)
        if (userData.role === 'N3' && userData.studentid && userData.name && userData.department) {
            await userService.updateStudentInfo(userData.studentid, userData.name, userData.department);
        }
        // Chỉ cập nhật trạng thái ở NGUOIDUNG
        const result = await userService.updateUser(id, {
            status: userData.status
        });
        return result[0] || null;
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await userService.deleteUser(id);
            return result.length > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new AppError(500, 'Error deleting user and related data');
        }
    }

    async changeUserStatus(id: string, status: boolean): Promise<IUser | null> {
        try {
            const result = await userService.changeUserStatus(id, status);
            return result[0] || null;
        } catch (error) {
            console.error('Error changing user status:', error);
            throw new AppError(500, 'Error changing user status');
        }
    }

    async getDashboardStats(): Promise<DashboardSummary> {
        try {
            const stats = await userService.getDashboardStats();
            return stats || {
                totalStudents: 0,
                pendingPayments: 0,
                newRegistrations: 0,
                systemAlerts: 0
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Fallback to service call with same interface
            return {
                totalStudents: 0,
                pendingPayments: 0,
                newRegistrations: 0,
                systemAlerts: 0
            };
        }
    }
    async getSystemConfig() {
        try {
            const configs = await userService.getSystemConfigs();
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

            await userService.updateSystemConfig(configKey, settingValue, settingType);
            return { success: true, message: 'System configuration updated successfully' };
        } catch (error) {
            console.error('Error updating system config:', error);
            throw new AppError(500, 'Error updating system configuration');
        }
    }

    async searchUsersByName(searchTerm: string): Promise<IUserSearchResult[]> {
        try {
            // Validate search term
            if (!searchTerm || searchTerm.trim().length === 0) {
                return [];
            }

            // Chuẩn hóa search term
            const normalizedSearchTerm = searchTerm.trim().toLowerCase();

            // Kiểm tra độ dài tối thiểu
            if (normalizedSearchTerm.length < 2) {
                return [];
            }

            // Tạo where clause và query params
            const whereConditions = [];
            const queryParams = [];
            let paramIndex = 1;

            // Tìm kiếm theo tên sinh viên
            whereConditions.push(`LOWER(sinhvien.HoTen) LIKE LOWER($${paramIndex})`);
            queryParams.push(`%${normalizedSearchTerm}%`);
            paramIndex++;

            // Thêm điều kiện chỉ lấy sinh viên (MaNhom = 'N3')
            whereConditions.push(`nguoidung.MaNhom = $${paramIndex}`);
            queryParams.push('N3');

            const whereClause = whereConditions.length > 0 
                ? `WHERE ${whereConditions.join(' AND ')}` 
                : '';

            // Gọi service để thực hiện tìm kiếm
            const results = await userService.getAllUsers(
                whereClause,
                queryParams,
                10, // Giới hạn 10 kết quả
                0   // Không cần offset vì đây là tìm kiếm
            );

            // Map kết quả về định dạng IUserSearchResult
            const mappedResults = results.map(user => ({
                id: user.id,
                name: user.name || user.studentId, // Fallback to studentId if name is null
                studentId: user.studentId,
                role: user.role,
                status: user.status,
                department: user.department
            }));

            return mappedResults;
        } catch (error) {
            console.error('Error in searchUsersByName:', error);
            throw new AppError(500, 'Error searching users: ' + (error as Error).message);
        }
    }

    // Thêm phương thức mới để xử lý tìm kiếm nâng cao
    async advancedSearch(params: {
        searchTerm?: string;
        role?: string;
        status?: boolean;
        department?: string;
    }): Promise<{ users: IUserSearchResult[], total: number }> {
        try {
            const whereConditions = [];
            const queryParams = [];
            let paramIndex = 1;

            // Xử lý tìm kiếm theo tên
            if (params.searchTerm && params.searchTerm.trim().length >= 2) {
                whereConditions.push(`(LOWER(sinhvien.HoTen) LIKE LOWER($${paramIndex}) OR LOWER(nguoidung.TenDangNhap) LIKE LOWER($${paramIndex}))`);
                queryParams.push(`%${params.searchTerm.trim().toLowerCase()}%`);
                paramIndex++;
            }

            // Xử lý lọc theo vai trò
            if (params.role && params.role !== 'all') {
                whereConditions.push(`nguoidung.MaNhom = $${paramIndex}`);
                queryParams.push(params.role);
                paramIndex++;
            }

            // Xử lý lọc theo trạng thái
            if (params.status !== undefined) {
                whereConditions.push(`nguoidung.TrangThai = $${paramIndex}`);
                queryParams.push(params.status ? 'active' : 'inactive');
                paramIndex++;
            }

            // Xử lý lọc theo khoa
            if (params.department) {
                whereConditions.push(`khoa.TenKhoa = $${paramIndex}`);
                queryParams.push(params.department);
                paramIndex++;
            }

            const whereClause = whereConditions.length > 0 
                ? `WHERE ${whereConditions.join(' AND ')}` 
                : '';

            // Lấy tổng số kết quả
            const totalCount = await userService.getUserCount(whereClause, queryParams);
            const total = parseInt(totalCount?.total || '0');

            // Lấy danh sách người dùng
            const users = await userService.getAllUsers(
                whereClause,
                queryParams,
                10, // Giới hạn 10 kết quả cho tìm kiếm
                0   // Không cần offset
            );

            // Map kết quả về định dạng IUserSearchResult
            const mappedResults = users.map(user => ({
                id: user.id,
                name: user.name || user.studentId,
                studentId: user.studentId,
                role: user.role,
                status: user.status,
                department: user.department
            }));

            return {
                users: mappedResults,
                total
            };
        } catch (error) {
            console.error('Error in advancedSearch:', error);
            throw new AppError(500, 'Error performing advanced search: ' + (error as Error).message);
        }
    }
}

export const userManager = new UserManager(); 
