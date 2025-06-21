import { Request, Response, NextFunction, RequestHandler } from 'express';
import { userManager } from '../../business/AdminBussiness/userManager';
import { IUser } from '../../models/user';
import { AppError } from '../../middleware/errorHandler';

export class UserController {
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filters = {
                role: req.query.role as string,
                status: req.query.status === 'true' ? true : 
                       req.query.status === 'false' ? false : undefined,
                search: req.query.search as string
            };
            
            console.log('Request params:', { page, limit, filters });
            
            const users = await userManager.getAllUsers(page, limit, filters);
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (err) {
            console.error('Error in getAllUsers controller:', err);
            next(err);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await userManager.getUserById(id);
            if (!user) throw new AppError(404, 'User not found');
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
            const updatedUser = await userManager.updateUser(id, userData);
            if (!updatedUser) throw new AppError(404, 'User not found');
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
            const success = await userManager.deleteUser(id);
            if (!success) throw new AppError(404, 'User not found');
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
            const updatedUser = await userManager.changeUserStatus(id, status);
            if (!updatedUser) throw new AppError(404, 'User not found');
            res.status(200).json({
                success: true,
                data: updatedUser
            });
        } catch (error) {
            next(error);
        }
    }

    searchUsersByName: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { searchTerm } = req.query;
            if (!searchTerm) {
                res.status(400).json({
                    success: false,
                    message: 'Search term is required'
                });
                return;
            }
            
            const users = await userManager.searchUsersByName(searchTerm as string);
            res.status(200).json({
                success: true,
                data: users
            });
        } catch (error) {
            next(error);
        }
    };

    advancedSearch: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { searchTerm, role, status, department } = req.query;
            
            const results = await userManager.advancedSearch({
                searchTerm: searchTerm as string,
                role: role as string,
                status: status === 'true',
                department: department as string
            });
            
            res.status(200).json({
                success: true,
                data: results
            });
        } catch (error) {
            next(error);
        }
    };
} 