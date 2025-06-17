"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../../middleware/auth");
var studentController_1 = __importDefault(require("../../controllers/studentController/studentController"));
// Không cần khai báo lại kiểu Request.user vì đã được định nghĩa trong middleware/auth.ts
var router = (0, express_1.Router)();
// Apply authentication middleware to all student routes
router.use(auth_1.authenticateToken, (0, auth_1.authorizeRoles)(['student']));
// Dashboard
router.get('/dashboard', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.getDashboard(req, res);
});
router.get('/timetable', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.getTimeTable(req, res);
});
// Subject Registration
router.get('/subjects', studentController_1.default.getAvailableSubjects);
router.get('/subjects/search', studentController_1.default.searchSubjects);
router.post('/subjects/register', function (req, res) {
    // Ensure studentId is set from authenticated user
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController_1.default.registerSubject(req, res);
});
// Enrolled Courses
router.get('/enrolled-courses', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.getEnrolledCourses(req, res);
});
// Hỗ trợ cả DELETE và POST cho việc hủy đăng ký môn học
router.delete('/enrolled-courses/:courseId', function (req, res) {
    var _a;
    // Xử lý DELETE request cho hủy đăng ký môn học
    req.body = {
        studentId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '',
        courseId: req.params.courseId
    };
    studentController_1.default.cancelRegistration(req, res);
});
router.post('/enrolled-courses/cancel', function (req, res) {
    // Đảm bảo studentId được thiết lập nếu chưa có
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController_1.default.cancelRegistration(req, res);
});
// Tuition Payment - NEW ROUTES
router.get('/tuition/status', function (req, res) {
    // Get tuition status for specific semester
    studentController_1.default.getTuitionStatus(req, res);
});
router.post('/tuition/payment', function (req, res) {
    // Make a payment
    studentController_1.default.makePayment(req, res);
});
router.get('/tuition/history', function (req, res) {
    // Get payment history
    studentController_1.default.getPaymentHistory(req, res);
});
// Profile
router.put('/profile', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.updateProfile(req, res);
});
exports.default = router;
