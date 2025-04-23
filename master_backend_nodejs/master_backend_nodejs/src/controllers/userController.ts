import { Request, Response } from 'express';
import { userManager } from '../business/AdminBussiness';
import { User } from '../models/user';

class UserController {
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

    async createUser(req: Request, res: Response) {
        try {
            const userData: Omit<User, 'id'> = req.body;
            const newUser = await userManager.createUser(userData);
            
            res.status(201).json({
                success: true,
                data: newUser
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error creating user'
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userData: Partial<User> = req.body;
            
            const updatedUser = await userManager.updateUser(parseInt(id), userData);
            
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
                message: error.message || 'Error updating user'
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const success = await userManager.deleteUser(parseInt(id));
            
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Error deleting user'
            });
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
}

export default new UserController(); 