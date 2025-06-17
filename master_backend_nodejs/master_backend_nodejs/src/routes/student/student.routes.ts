import { Router, Request, Response, RequestHandler } from 'express';
import { authenticateToken, authorizeRoles } from '../../middleware/auth';
import studentController from '../../controllers/studentController/studentController';

// Không cần khai báo lại kiểu Request.user vì đã được định nghĩa trong middleware/auth.ts

const router = Router();

// Apply authentication middleware to all student routes
router.use(authenticateToken, authorizeRoles(['student']));

// Dashboard
router.get('/dashboard', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = req.user?.id.toString() || '';
    studentController.getDashboard(req, res);
});

router.get('/timetable', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = req.user?.id.toString() || '';
    studentController.getTimeTable(req, res);
});

// Subject Registration
router.get('/subjects', studentController.getAvailableSubjects as unknown as RequestHandler);
router.get('/subjects/search', studentController.searchSubjects as unknown as RequestHandler);
router.post('/subjects/register', (req: Request, res: Response) => {
    // Ensure studentId is set from authenticated user
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController.registerSubject(req, res);
});

// Enrolled Courses
router.get('/enrolled-courses', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = req.user?.id.toString() || '';    studentController.getEnrolledCourses(req, res);
});

// Hỗ trợ cả DELETE và POST cho việc hủy đăng ký môn học
router.delete('/enrolled-courses/:courseId', (req: Request, res: Response) => {
    // Xử lý DELETE request cho hủy đăng ký môn học
    req.body = {
        studentId: req.user?.id.toString() || '',
        courseId: req.params.courseId
    };
    studentController.cancelRegistration(req, res);
});

router.post('/enrolled-courses/cancel', (req: Request, res: Response) => {
    // Đảm bảo studentId được thiết lập nếu chưa có
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController.cancelRegistration(req, res);
});

// Tuition Payment - NEW ROUTES
router.get('/tuition/status', (req: Request, res: Response) => {
    // Get tuition status for specific semester
    studentController.getTuitionStatus(req, res);
});

router.post('/tuition/payment', (req: Request, res: Response) => {
    // Make a payment
    studentController.makePayment(req, res);
});

router.get('/tuition/history', (req: Request, res: Response) => {
    // Get payment history
    studentController.getPaymentHistory(req, res);
});

// Profile
router.put('/profile', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào params
    req.params.studentId = req.user?.id.toString() || '';
    studentController.updateProfile(req, res);
});

export default router;
