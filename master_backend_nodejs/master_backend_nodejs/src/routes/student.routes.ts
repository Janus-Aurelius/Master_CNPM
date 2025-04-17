// src/routes/student.routes.ts
import { Router, Request, Response } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import studentController from '../controllers/studentController';

const router = Router();

// Protect all student routes
router.use(authenticateToken, authorizeRoles(['student']));

// Dashboard & Schedule
router.get('/dashboard/:studentId', studentController.getDashboard);
router.get('/timetable/:studentId', studentController.getTimeTable);

// Subject Registration
router.get('/subjects/available', studentController.getAvailableSubjects);
router.get('/subjects/search', studentController.searchSubjects);
router.post('/subjects/register', studentController.registerSubject);

// Enrolled Subjects
router.get('/enrolled/:studentId', studentController.getEnrolledSubjects);
router.delete('/subjects/cancel', studentController.cancelRegistration);

// Academic Request Management (placeholder for future implementation)
router.get('/academicReqMgm', (req: Request, res: Response) => {
    res.json({ data: 'Student academic requests' });
});

// Tuition (placeholder for future implementation)
router.get('/tuition', (req: Request, res: Response) => {
    res.json({ data: 'Student tuition' });
});

// Tuition Management
router.get('/tuition/:studentId', studentController.getTuitionInfo);
router.get('/tuition/history/:studentId', studentController.getPaymentHistory);

export default router;