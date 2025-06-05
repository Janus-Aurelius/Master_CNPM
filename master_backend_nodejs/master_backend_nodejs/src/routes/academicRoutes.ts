import {Request, Response, Router} from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Protect all student routes
router.use(authenticateToken, authorizeRoles(['academic']));

// Student tabs
router.get('/dashboard', (req: Request, res: Response) => {res.json({data:'Academic affairs deparment dashboard'});});
router.get('/programsMgm', (req: Request, res: Response) => {res.json({ data: 'Academic affairs deparment program management' });});
router.get('/subjectMgm', (req: Request, res: Response) => {res.json({ data: 'Academic affairs deparment subject management' });});
router.get('/studentSubjectReq', (req: Request, res: Response) => {res.json({ data: 'Academic affairs deparment student subject request management' });});
router.get('/openCourseMgm', (req: Request, res: Response) => {res.json({ data: 'Academic affairs deparment open courses management' });});

export default router; 