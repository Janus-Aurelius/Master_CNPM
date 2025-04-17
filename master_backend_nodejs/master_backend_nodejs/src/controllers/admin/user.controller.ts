// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import { AdminBusiness } from '../../business/admin/user.manager';
import { CreateUserDTO, UserResponse } from '../../models/user';

export class AdminController {
    private adminBusiness: AdminBusiness;

    constructor() {
        this.adminBusiness = new AdminBusiness();
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.adminBusiness.getAllUsers();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const user = await this.adminBusiness.getUserById(id);
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(error instanceof Error && error.message === 'User not found' ? 404 : 500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const userData = {
                ...req.body,
                status: true  // Mặc định status là true khi tạo mới
            };
            const newUser = await this.adminBusiness.createUser(userData);
            
            // Chuyển đổi sang UserResponse trước khi trả về
            const userResponse: UserResponse = {
                ...newUser
            };
            
            res.status(201).json({
                success: true,
                data: userResponse
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const userData = req.body;
            const updatedUser = await this.adminBusiness.updateUser(id, userData);
            res.json({
                success: true,
                data: updatedUser
            });
        } catch (error) {
            res.status(error instanceof Error && error.message === 'User not found' ? 404 : 400).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.adminBusiness.deleteUser(id);
            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(error instanceof Error && error.message === 'User not found' ? 404 : 500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }
}