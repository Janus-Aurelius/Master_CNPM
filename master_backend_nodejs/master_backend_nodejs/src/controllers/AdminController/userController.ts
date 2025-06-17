import { Request, Response, NextFunction } from 'express';
import { userManager } from '../../business/AdminBussiness/userManager';
import { IUser } from '../../models/user';
import { AppError } from '../../middleware/errorHandler';

export class UserController {
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userManager.getAllUsers();
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await userManager.getUserById(parseInt(id));
            
            if (!user) {
                throw new AppError(404, 'User not found');
            }

            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: Omit<IUser, 'id'> = req.body;
            const newUser = await userManager.createUser(userData);
            
            res.status(201).json({
                success: true,
                data: newUser
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userData = req.body;
            const updatedUser = await userManager.updateUser(parseInt(id), userData);
            
            if (!updatedUser) {
                throw new AppError(404, 'User not found');
            }

            res.status(200).json({
                success: true,
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const success = await userManager.deleteUser(parseInt(id));
            
            if (!success) {
                throw new AppError(404, 'User not found');
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    async changeUserStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedUser = await userManager.changeUserStatus(parseInt(id), status);
            
            if (!updatedUser) {
                throw new AppError(404, 'User not found');
            }

            res.status(200).json({
                success: true,
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }
} 