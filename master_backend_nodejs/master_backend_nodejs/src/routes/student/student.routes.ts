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

// Enrolled Subjects
router.get('/enrolled-subjects', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = req.user?.id.toString() || '';
    studentController.getEnrolledSubjects(req, res);
});

router.get('/enrolled-subjects/:courseId', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào params
    req.params.studentId = req.user?.id.toString() || '';
    studentController.getSubjectDetails(req, res);
});

// Hỗ trợ cả DELETE và POST cho việc hủy đăng ký môn học
router.delete('/enrolled-subjects/:courseId', (req: Request, res: Response) => {
    // Xử lý DELETE request cho hủy đăng ký môn học
    req.body = {
        studentId: req.user?.id.toString() || '',
        courseId: req.params.courseId
    };
    studentController.cancelRegistration(req, res);
});

router.post('/enrolled-subjects/cancel', (req: Request, res: Response) => {
    // Đảm bảo studentId được thiết lập nếu chưa có
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController.cancelRegistration(req, res);
});

// Academic Request
router.get('/academic-requests', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = req.user?.id.toString() || '';
    studentController.getRequestHistory(req, res);
});

router.post('/academic-requests', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào request body nếu chưa có
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController.createRequest(req, res);
});

// Tuition
router.get('/tuition', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào query
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController.getTuitionRecordsByStudent(req, res);
});

router.get('/tuition/history/:recordId', (req: Request, res: Response) => {
    // Thêm recordId từ URL params vào query
    req.query.tuitionRecordId = req.params.recordId;
    studentController.getPaymentReceiptsByRecord(req, res);
});

router.post('/tuition/pay', (req: Request, res: Response) => {
    // Đảm bảo yêu cầu thanh toán được xác thực
    studentController.payTuition(req, res);
});

router.post('/tuition/confirm', (req: Request, res: Response) => {
    // Đảm bảo studentId được thiết lập nếu chưa có
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController.confirmRegistration(req, res);
});

router.put('/tuition/edit', studentController.editRegistration as unknown as RequestHandler);

// Grades
router.get('/grades', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào params
    req.params.studentId = req.user?.id.toString() || '';
    studentController.getGrades(req, res);
});

// Profile
router.put('/profile', (req: Request, res: Response) => {
    // Thêm studentId từ token JWT vào params
    req.params.studentId = req.user?.id.toString() || '';
    studentController.updateProfile(req, res);
});

export default router;
