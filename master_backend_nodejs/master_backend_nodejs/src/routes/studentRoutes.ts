import express, { Request, Response, RequestHandler } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateStudent } from '../middleware/validateStudent';
import { validateRegistration } from '../middleware/validateRegistration';
import { validatePayment } from '../middleware/validatePayment';
import studentController from '../controllers/studentController';
import { gradeService } from '../services/studentServices/gradeService';
import { academicRequestService } from '../services/studentServices/academicRequestService';

const router = express.Router();

// Protect all student routes
router.use(authenticateToken, authorizeRoles(['student']));

// Dashboard & Schedule
router.get('/dashboard/:studentId', studentController.getDashboard);
router.get('/timetable/:studentId', studentController.getTimeTable);

// Subject Registration
router.get('/available-subjects', studentController.getAvailableSubjects);
router.get('/search-subjects', studentController.searchSubjects);
router.post('/register-subject', studentController.registerSubject);

// Enrolled Subjects
router.get('/enrolled-subjects/:studentId', studentController.getEnrolledSubjects);
router.post('/cancel-registration', studentController.cancelRegistration);

// Grades
router.get('/grades/:studentId', (async (req: Request, res: Response) => {
    try {
        const grades = await gradeService.getStudentGrades(req.params.studentId);
        res.json({ success: true, data: grades });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, message: errorMessage });
    }
}) as RequestHandler);

router.get('/subject/:subjectId/grade/:studentId', (async (req: Request, res: Response) => {
    try {
        const grade = await gradeService.getSubjectDetails(req.params.studentId, req.params.subjectId);
        if (!grade) {
            return res.status(404).json({ success: false, message: 'Grade not found' });
        }
        res.json({ success: true, data: grade });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, message: errorMessage });
    }
}) as RequestHandler);

// Academic Requests
router.post('/requests', async (req: Request, res: Response) => {
    try {
        const request = await academicRequestService.createRequest(req.body);
        res.status(201).json({ success: true, data: request });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, message: errorMessage });
    }
});

router.get('/requests/:studentId', async (req: Request, res: Response) => {
    try {
        const requests = await academicRequestService.getStudentRequests(req.params.studentId);
        res.json({ success: true, data: requests });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, message: errorMessage });
    }
});

router.get('/request-history/:studentId', async (req: Request, res: Response) => {
    try {
        const history = await academicRequestService.getRequestHistory(req.params.studentId);
        res.json({ success: true, data: history });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ success: false, message: errorMessage });
    }
});

// Student profile routes
router.post('/register', validateStudent, studentController.register);
router.put('/profile/:studentId', validateStudent, studentController.updateProfile);

// Course registration routes
router.post('/register-courses', validateRegistration, studentController.registerCourses);
router.get('/registered-courses/:studentId', studentController.getRegisteredCourses);

// Xác nhận đăng ký, tạo phiếu học phí
router.post('/confirm-registration', studentController.confirmRegistration);
// Đóng học phí
router.post('/pay-tuition', studentController.payTuition);
// Chỉnh sửa đăng ký
router.post('/edit-registration', studentController.editRegistration);
// Lấy danh sách phiếu học phí của sinh viên
router.get('/tuition-records', studentController.getTuitionRecordsByStudent);
// Lấy lịch sử phiếu thu
router.get('/payment-receipts', studentController.getPaymentReceiptsByRecord);

export default router; 