import { Request, Response, NextFunction } from 'express';
import * as roleManager from '../../business/AdminBussiness/roleManager';

export class RoleController {
    async getAllRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const roles = await roleManager.getAllRoles();
            res.status(200).json(roles);
        } catch (error) {
            next(error);
        }
    }
}