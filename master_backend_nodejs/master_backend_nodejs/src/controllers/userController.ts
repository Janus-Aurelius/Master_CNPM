import { Request, Response, NextFunction } from 'express';
import { userManager } from '../business/AdminBussiness';
import { User } from '../models/user';
import { UserManager } from '../business/UserManager';
import { AppError, ValidationError, NotFoundError, AuthenticationError } from '../middleware/errorHandler';

class UserController {
    private userManager: UserManager;

    constructor() {
        this.userManager = new UserManager();
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userManager.getAllUsers();
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching users'
            });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await userManager.getUserById(parseInt(id));
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error fetching user'
            });
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: Omit<User, 'id'> = req.body;
            const user = await this.userManager.createUser(userData);
            
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            if (error instanceof AppError) {
                next(error);
            } else {
                next(new ValidationError('Failed to create user'));
            }
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userData: Partial<User> = req.body;
            
            const user = await this.userManager.updateUser(parseInt(id), userData);
            
            if (!user) {
                throw new NotFoundError('User');
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const success = await this.userManager.deleteUser(parseInt(id));
            
            if (!success) {
                throw new NotFoundError('User');
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async changeUserStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            const updatedUser = await userManager.changeUserStatus(parseInt(id), status);
            
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: updatedUser
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error changing user status'
            });
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const token = await this.userManager.login(email, password);
            if (!token) {
                throw new AuthenticationError('Invalid credentials');
            }
            res.status(200).json({
                status: 'success',
                token
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController(); 