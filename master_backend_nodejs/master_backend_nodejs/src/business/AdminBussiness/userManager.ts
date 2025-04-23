import { User } from '../../models/user';
import UserService from '../../services/UserService';

export class UserManager {
    async getAllUsers(): Promise<User[]> {
        try {
            return await UserService.getAllUsers();
        } catch (error) {
            throw new Error('Failed to fetch users');
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            return await UserService.getUserById(id);
        } catch (error) {
            throw new Error('Failed to fetch user');
        }
    }

    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        try {
            // Validate user data
            if (!userData.name || !userData.email || !userData.password || !userData.role) {
                throw new Error('Missing required fields');
            }

            // Check if email already exists
            const existingUsers = await UserService.getAllUsers();
            if (existingUsers.some(user => user.email === userData.email)) {
                throw new Error('Email already exists');
            }

            return await UserService.createUser(userData);
        } catch (error) {
            throw new Error('Failed to create user');
        }
    }

    async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
        try {
            // Check if user exists
            const existingUser = await UserService.getUserById(id);
            if (!existingUser) {
                throw new Error('User not found');
            }

            // If email is being updated, check if it's already taken
            if (userData.email && userData.email !== existingUser.email) {
                const existingUsers = await UserService.getAllUsers();
                if (existingUsers.some(user => user.email === userData.email)) {
                    throw new Error('Email already exists');
                }
            }

            return await UserService.updateUser(id, userData);
        } catch (error) {
            throw new Error('Failed to update user');
        }
    }

    async deleteUser(id: number): Promise<boolean> {
        try {
            // Check if user exists
            const existingUser = await UserService.getUserById(id);
            if (!existingUser) {
                throw new Error('User not found');
            }

            return await UserService.deleteUser(id);
        } catch (error) {
            throw new Error('Failed to delete user');
        }
    }

    async changeUserStatus(id: number, status: boolean): Promise<User | null> {
        try {
            // Check if user exists
            const existingUser = await UserService.getUserById(id);
            if (!existingUser) {
                throw new Error('User not found');
            }

            return await UserService.changeUserStatus(id, status);
        } catch (error) {
            throw new Error('Failed to change user status');
        }
    }
}

export const userManager = new UserManager(); 