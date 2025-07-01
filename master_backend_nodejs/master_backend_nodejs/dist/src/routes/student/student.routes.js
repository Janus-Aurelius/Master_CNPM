"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
// Timetable/Schedule
router.get('/timetable', function (req, res) {
    studentController_1.default.getTimeTable(req, res);
});
// Student Info - Hỗ trợ cả GET và POST để frontend có thể gửi studentId
router.get('/info', function (req, res) {
    studentController_1.default.getStudentInfo(req, res);
});
router.post('/info', function (req, res) {
    studentController_1.default.getStudentInfo(req, res);
});
// Debug endpoint để test database
router.get('/debug/:studentId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var studentId, DatabaseService, result, error_1, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                studentId = req.params.studentId;
                console.log('🔍 Debug endpoint - Looking for student:', studentId);
                DatabaseService = require('../../services/database/databaseService').DatabaseService;
                return [4 /*yield*/, DatabaseService.queryOne("\n            SELECT * FROM SINHVIEN WHERE MaSoSinhVien = $1\n        ", [studentId])];
            case 1:
                result = _a.sent();
                console.log('🔍 Debug - Raw database result:', result);
                res.json({
                    success: true,
                    requestedId: studentId,
                    found: !!result,
                    data: result
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('❌ Debug endpoint error:', error_1);
                message = error_1 instanceof Error ? error_1.message : 'Unknown error';
                res.status(500).json({ success: false, error: message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Subject Registration
router.get('/subjects', function (req, res) {
    // Thêm studentId từ token JWT vào request params/query
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController_1.default.getAvailableSubjects(req, res);
});
// API để phân loại môn học theo chương trình đào tạo
router.get('/subjects/classified', function (req, res) {
    studentController_1.default.getClassifiedSubjects(req, res);
});
router.get('/subjects/search', function (req, res) {
    // Thêm studentId từ token JWT vào request params/query
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController_1.default.searchSubjects(req, res);
});
router.post('/subjects/register', function (req, res) {
    // Ensure studentId is set from authenticated user
    if (!req.body.studentId && req.user) {
        req.body.studentId = req.user.id.toString();
    }
    studentController_1.default.registerSubject(req, res);
});
// Enrolled Courses
router.get('/enrolled-courses', function (req, res) {
    var _a, _b;
    // Thêm studentId từ token JWT vào request params và query
    var studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
    if (studentId) {
        req.params.studentId = studentId.toString();
        if (!req.query.studentId) {
            req.query.studentId = studentId.toString();
        }
    }
    console.log('🔍 [Route] enrolled-courses - req.user:', req.user);
    console.log('🔍 [Route] enrolled-courses - studentId:', studentId);
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
        req.body.studentId = req.user.studentId || req.user.id;
    }
    console.log('🔍 [Route] cancel registration - req.user:', req.user);
    console.log('🔍 [Route] cancel registration - req.body:', req.body);
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
// Đường dẫn mới để lấy môn học gợi ý theo chương trình học
router.get('/subjects/recommended', function (req, res) {
    // Thêm studentId từ token JWT vào request params/query
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController_1.default.getRecommendedSubjects(req, res);
});
// Get current semester
router.get('/current-semester', function (req, res) {
    studentController_1.default.getCurrentSemester(req, res);
});
// Check registration status
router.get('/registration-status', function (req, res) {
    // Thêm studentId từ token JWT vào request
    if (req.user) {
        req.query.studentId = req.user.id.toString();
    }
    studentController_1.default.checkRegistrationStatus(req, res);
});
exports.default = router;
