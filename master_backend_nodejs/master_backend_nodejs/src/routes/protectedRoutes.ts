// src/routes/protected.routes.ts
import { Router, Request, Response } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// A protected endpoint for admin, academic, and financial roles
router.get('/dashboard', authenticateToken, authorizeRoles(['admin', 'academic', 'financial']), (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the protected dashboard!' });
});

export default router; 