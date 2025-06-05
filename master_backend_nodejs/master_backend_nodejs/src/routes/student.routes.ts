// src/routes/student.routes.ts
import { Router, Request, Response, RequestHandler} from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Protect all student routes
router.use(authenticateToken, authorizeRoles(['student']));

// Student tabs
router.get('/dashboard', (req: Request, res: Response) => {res.json({data:'Student dashboard'});});
router.get('/subjects', (req: Request, res: Response) => {res.json({ data: 'Student courses' });});
router.get('/academicReqMgm', (req: Request, res: Response) => {res.json({ data: 'Student schedule' });});
router.get('/enrolledSubjects', (req: Request, res: Response) => {res.json({ data: 'Student grades' });});
router.get('/tuition', (req: Request, res: Response) => {res.json({ data: 'Student payments' });});

export default router;