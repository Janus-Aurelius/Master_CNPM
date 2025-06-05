import {Request, Response, Router} from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import financialController from '../controllers/financialController';

const router = Router();

// Protect all student routes
router.use(authenticateToken, authorizeRoles(['financial']));

// Student tabs
router.get('/dashboard', (req: Request, res: Response) => {res.json({ data: 'Financial deparment dashboard' });});
router.get('/paymentstatus', (req: Request, res: Response) => {res.json({ data: 'Financial deparment payment status management' });});
router.get('/tuitionAdjustment', (req: Request, res: Response) => {res.json({ data: 'Financial deparment tuition adjustment' });});
router.get('/unpaid-report', financialController.getUnpaidTuitionReport);

export default router; 