import { Request, Response } from 'express';
import { UserManager } from '../business/admin/user.manager';

export class AdminController {
  private userManager = new UserManager();

  async createUser(req: Request, res: Response) {
    try {
      const result = await this.userManager.createUser(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
