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

// Timetable/Schedule
router.get('/timetable', (req: Request, res: Response) => {
    studentController.getTimeTable(req, res);
});

// Student Info - Hỗ trợ cả GET và POST để frontend có thể gửi studentId
router.get('/info', (req: Request, res: Response) => {
    studentController.getStudentInfo(req, res);
});

router.post('/info', (req: Request, res: Response) => {
    studentController.getStudentInfo(req, res);
});

// Debug endpoint để test database
router.get('/debug/:studentId', async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        console.log('🔍 Debug endpoint - Looking for student:', studentId);
        
        // Test direct database query
        const { DatabaseService } = require('../../services/database/databaseService');
        const result = await DatabaseService.queryOne(`
            SELECT * FROM SINHVIEN WHERE MaSoSinhVien = $1
        `, [studentId]);
        
        console.log('🔍 Debug - Raw database result:', result);
        
        res.json({ 
            success: true, 
            requestedId: studentId,
            found: !!result,
            data: result 
        });    } catch (error) {
        console.error('❌ Debug endpoint error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, error: message });
    }
});

// Subject Registration
router.get('/subjects', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params/query
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController.getAvailableSubjects(req, res);
});

// API để phân loại môn học theo chương trình đào tạo
router.get('/subjects/classified', (req: Request, res: Response) => {
    studentController.getClassifiedSubjects(req, res);
});

router.get('/subjects/search', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params/query
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController.searchSubjects(req, res);
});
router.post('/subjects/register', (req: Request, res: Response) => {
    // Ensure studentId is set from authenticated user
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController.registerSubject(req, res);
});

// Enrolled Courses
router.get('/enrolled-courses', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params và query
    const studentId = req.user?.studentId || req.user?.id;
    if (studentId) {
        req.params.studentId = studentId.toString();
        if (!req.query.studentId) {
            req.query.studentId = studentId.toString();
        }
    }
    console.log('🔍 [Route] enrolled-courses - req.user:', req.user);
    console.log('🔍 [Route] enrolled-courses - studentId:', studentId);
    studentController.getEnrolledCourses(req, res);
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
        req.body.studentId = req.user.studentId || req.user.id;
    }
    console.log('🔍 [Route] cancel registration - req.user:', req.user);
    console.log('🔍 [Route] cancel registration - req.body:', req.body);
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

// Đường dẫn mới để lấy môn học gợi ý theo chương trình học
router.get('/subjects/recommended', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params/query
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController.getRecommendedSubjects(req, res);
});

// Get current semester
router.get('/current-semester', (req: Request, res: Response) => {
    studentController.getCurrentSemester(req, res);
});

export default router;
