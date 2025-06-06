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
// Enrolled Subjects
router.get('/enrolled-subjects', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.getEnrolledSubjects(req, res);
});
router.get('/enrolled-subjects/:courseId', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.getSubjectDetails(req, res);
});
// Hỗ trợ cả DELETE và POST cho việc hủy đăng ký môn học
router.delete('/enrolled-subjects/:courseId', function (req, res) {
    var _a;
    // Xử lý DELETE request cho hủy đăng ký môn học
    req.body = {
        studentId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '',
        courseId: req.params.courseId
    };
    studentController_1.default.cancelRegistration(req, res);
});
router.post('/enrolled-subjects/cancel', function (req, res) {
    // Đảm bảo studentId được thiết lập nếu chưa có
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController_1.default.cancelRegistration(req, res);
});
// Academic Request
router.get('/academic-requests', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào request params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.getRequestHistory(req, res);
});
router.post('/academic-requests', function (req, res) {
    // Thêm studentId từ token JWT vào request body nếu chưa có
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController_1.default.createRequest(req, res);
});
// Tuition
router.get('/tuition', function (req, res) {
    // Thêm studentId từ token JWT vào query
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController_1.default.getTuitionRecordsByStudent(req, res);
});
router.get('/tuition/history/:recordId', function (req, res) {
    // Thêm recordId từ URL params vào query
    req.query.tuitionRecordId = req.params.recordId;
    studentController_1.default.getPaymentReceiptsByRecord(req, res);
});
router.post('/tuition/pay', function (req, res) {
    // Đảm bảo yêu cầu thanh toán được xác thực
    studentController_1.default.payTuition(req, res);
});
router.post('/tuition/confirm', function (req, res) {
    // Đảm bảo studentId được thiết lập nếu chưa có
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController_1.default.confirmRegistration(req, res);
});
router.put('/tuition/edit', studentController_1.default.editRegistration);
// Grades
router.get('/grades', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.getGrades(req, res);
});
// Profile
router.put('/profile', function (req, res) {
    var _a;
    // Thêm studentId từ token JWT vào params
    req.params.studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id.toString()) || '';
    studentController_1.default.updateProfile(req, res);
});
exports.default = router;
