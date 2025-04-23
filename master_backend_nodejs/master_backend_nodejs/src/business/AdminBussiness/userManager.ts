import UserService from '../../services/admin/UserService';
import { User } from '../../models/user.interface';

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
            throw new Error('Email already exists');
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
            throw new Error('Email already exists');
        }
        return UserService.updateUser(id, userData);
    }

    async deleteUser(id: number): Promise<boolean> {
        return UserService.deleteUser(id);
    }

    async changeUserStatus(id: number, status: boolean): Promise<User | null> {
        return UserService.updateUser(id, { status });
    }
}

export const userManager = new UserManager(); 