// src/business/admin/AdminBusiness.ts
import { User } from '../../models/user';
import { UserService } from '../../services/admin/user.service';

export class UserManager {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async validateUserData(userData: Partial<User>): Promise<boolean> {
        if (userData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Invalid email format');
            }
        }

        if (userData.password && userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (userData.role && !['student', 'admin', 'financial', 'academic'].includes(userData.role)) {
            throw new Error('Invalid role');
        }

        return true;
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userService.getAllUsers();
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userService.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        await this.validateUserData(userData);
        return await this.userService.createUser(userData);
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User> {
        await this.validateUserData(userData);
        const updatedUser = await this.userService.updateUser(id, userData);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }

    async deleteUser(id: number): Promise<boolean> {
        const success = await this.userService.deleteUser(id);
        if (!success) {
            throw new Error('User not found');
        }
        return success;
    }
}