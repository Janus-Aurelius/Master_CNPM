// src/routes/student.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Protect all student routes
router.use(authenticateToken, authorizeRoles(['student']));

// Student tabs
router.get('/dashboard', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ data: 'Student dashboard' });
    } catch (error) {
        next(error);
    }
});

router.get('/subjects', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ data: 'Student courses' });
    } catch (error) {
        next(error);
    }
});

router.get('/academicReqMgm', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ data: 'Student schedule' });
    } catch (error) {
        next(error);
    }
});

router.get('/enrolledSubjects', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ data: 'Student grades' });
    } catch (error) {
        next(error);
    }
});

router.get('/tuition', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json({ data: 'Student payments' });
    } catch (error) {
        next(error);
    }
});

export default router;