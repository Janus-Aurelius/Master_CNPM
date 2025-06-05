// src/routes/student.routes.ts
import {Request, Response, Router} from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Protect all student routes
router.use(authenticateToken, authorizeRoles(['admin']));

// Student tabs
router.get('/dashboard', (req: Request, res: Response) => {res.json({data:'Admin dashboard'});});
router.get('/userManagement', (req: Request, res: Response) => {res.json({ data: 'Admin user management' });});
router.get('/config', (req: Request, res: Response) => {res.json({ data: 'Admin server configuration' });});

export default router;