import UserService from '../../services/AdminService/UserService';
import { User } from '../../models/user';
import { AppError } from '../../middleware/errorHandler';

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
            const users = await this.getAllUsers();
            const activeUsers = users.filter(user => user.status);
            const inactiveUsers = users.filter(user => !user.status);

            return {
                totalUsers: users.length,
                activeUsers: activeUsers.length,
                inactiveUsers: inactiveUsers.length,
                recentUsers: users.slice(-5) // Last 5 users
            };
        } catch (error) {
            throw new AppError(500, 'Error fetching dashboard stats');
        }
    }

    async getSystemConfig() {
        try {
            return {
                maxUsers: 1000,
                allowedDomains: ['@example.com', '@admin.com'],
                passwordPolicy: {
                    minLength: 8,
                    requireNumbers: true,
                    requireSpecialChars: true
                },
                sessionTimeout: 3600 // 1 hour in seconds
            };
        } catch (error) {
            throw new AppError(500, 'Error fetching system config');
        }
    }
}

export const userManager = new UserManager(); 