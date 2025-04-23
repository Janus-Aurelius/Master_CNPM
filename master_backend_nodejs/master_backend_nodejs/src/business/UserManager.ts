import { User } from '../models/user';
import { AppError, ValidationError, NotFoundError } from '../middleware/errorHandler';

export class UserManager {
    async createUser(userData: Omit<User, 'id'>): Promise<User> {
        try {
            // Validate email uniqueness
            const existingUsers = await User.findAll();
            if (existingUsers.some(user => user.email === userData.email)) {
                throw new ValidationError('Email already exists');
            }

            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Failed to create user');
        }
    }

    async getUser(userId: number): Promise<User | null> {
        try {
            const user = await User.findByPk(userId);
            return user;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Failed to get user');
        }
    }

    async updateUser(userId: number, userData: Partial<User>): Promise<User | null> {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new NotFoundError('User');
            }

            // Validate email uniqueness if email is being updated
            if (userData.email) {
                const existingUsers = await User.findAll();
                if (existingUsers.some(u => u.email === userData.email && u.id !== userId)) {
                    throw new ValidationError('Email already exists');
                }
            }

            await user.update(userData);
            return user;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Failed to update user');
        }
    }

    async deleteUser(userId: number): Promise<boolean> {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new NotFoundError('User');
            }

            await user.destroy();
            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Failed to delete user');
        }
    }

    async login(email: string, password: string): Promise<string | null> {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new ValidationError('Invalid credentials');
            }

            // In a real app, you would hash the password and compare
            if (user.password !== password) {
                throw new ValidationError('Invalid credentials');
            }

            // Generate JWT token
            // This is a placeholder - implement proper JWT generation
            return 'dummy-token';
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new ValidationError('Login failed');
        }
    }
} 