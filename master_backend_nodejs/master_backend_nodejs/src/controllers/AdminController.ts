import { Request, Response } from 'express';
import { userManager } from '../business/AdminBussiness/userManager';

export class AdminController {
  private userManager = userManager;

  async createUser(req: Request, res: Response) {
    try {
      const result = await this.userManager.createUser(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
