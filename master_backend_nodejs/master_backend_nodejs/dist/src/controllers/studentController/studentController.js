"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var dashboardService_1 = require("../../services/studentService/dashboardService");
var studentService_1 = require("../../services/studentService/studentService");
var tuitionService_1 = require("../../services/studentService/tuitionService");
var tuitionManager_1 = __importDefault(require("../../business/studentBusiness/tuitionManager"));
var registrationManager_1 = __importDefault(require("../../business/studentBusiness/registrationManager"));
var StudentController = /** @class */ (function () {
    function StudentController() {
    }
    StudentController.prototype.getDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, dashboard, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Thiếu thông tin studentId trong token' })];
                        }
                        return [4 /*yield*/, dashboardService_1.dashboardService.getStudentOverview(studentId)];
                    case 1:
                        dashboard = _b.sent();
                        if (!dashboard) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Không tìm thấy dashboard của sinh viên' })];
                        }
                        return [2 /*return*/, res.status(200).json({ success: true, data: dashboard })];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Error getting dashboard: ".concat(error_1));
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Lỗi hệ thống' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getStudentInfo = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, username, studentInfo, response, error_2, message;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        _j.trys.push([0, 2, , 3]);
                        // Debug: Xem thông tin từ request
                        console.log('🔍 Debug - req.body:', req.body);
                        console.log('🔍 Debug - req.params:', req.params);
                        console.log('🔍 Debug - req.user:', req.user);
                        console.log('🔍 Debug - req.user.studentId:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId);
                        console.log('🔍 Debug - req.user.id:', (_b = req.user) === null || _b === void 0 ? void 0 : _b.id);
                        console.log('🔍 Debug - req.user.username:', (_c = req.user) === null || _c === void 0 ? void 0 : _c.username);
                        studentId = ((_d = req.body) === null || _d === void 0 ? void 0 : _d.studentId) || ((_e = req.params) === null || _e === void 0 ? void 0 : _e.studentId) || ((_f = req.user) === null || _f === void 0 ? void 0 : _f.studentId);
                        // Nếu không có studentId từ request, thử lấy từ user token
                        if (!studentId) {
                            studentId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.id;
                            // Nếu có username và username bắt đầu bằng 'sv', convert thành format SV0xxx
                            if (!studentId && ((_h = req.user) === null || _h === void 0 ? void 0 : _h.username)) {
                                username = req.user.username.toLowerCase();
                                if (username.startsWith('sv')) {
                                    // Convert sv0001 -> SV0001
                                    studentId = username.toUpperCase();
                                    console.log('🔄 Converted username to studentId:', studentId);
                                }
                            }
                        }
                        if (!studentId) {
                            console.log('❌ No studentId found in request or token:', { body: req.body, params: req.params, user: req.user });
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Thiếu thông tin studentId trong request hoặc token',
                                    debug: { body: req.body, params: req.params, user: req.user }
                                })];
                        }
                        console.log('🎓 Getting student info for studentId:', studentId);
                        return [4 /*yield*/, studentService_1.studentService.getStudentInfo(studentId)];
                    case 1:
                        studentInfo = _j.sent();
                        if (!studentInfo) {
                            console.log('❌ Student not found in database for ID:', studentId);
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Student not found' })];
                        }
                        console.log('✅ Raw student info from database:', studentInfo);
                        response = {
                            studentId: studentInfo.studentId,
                            name: studentInfo.fullName,
                            major: studentInfo.majorId,
                            majorName: studentInfo.majorName || studentInfo.majorId,
                            email: studentInfo.email,
                            phone: studentInfo.phone
                        };
                        console.log('✅ Formatted response:', response);
                        return [2 /*return*/, res.status(200).json({ success: true, data: response })];
                    case 2:
                        error_2 = _j.sent();
                        console.error('❌ Error getting student info:', error_2);
                        message = error_2 instanceof Error ? error_2.message : 'Lỗi hệ thống';
                        return [2 /*return*/, res.status(500).json({ success: false, message: message })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getTimeTable = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var DatabaseService, studentId, semester, _a, student, timetableData, error_3;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService = (_c.sent()).DatabaseService;
                        studentId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.studentId) || req.query.studentId;
                        _a = req.query.semester;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, DatabaseService.getCurrentSemester()];
                    case 2:
                        _a = (_c.sent());
                        _c.label = 3;
                    case 3:
                        semester = _a;
                        console.log("\uD83D\uDD35 [StudentController] getTimeTable called for student: ".concat(studentId, ", semester: ").concat(semester));
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Thiếu thông tin studentId trong token hoặc query'
                                })];
                        }
                        return [4 /*yield*/, studentService_1.studentService.getStudentInfo(studentId)];
                    case 4:
                        student = _c.sent();
                        if (!student) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: 'Không tìm thấy sinh viên'
                                })];
                        }
                        return [4 /*yield*/, dashboardService_1.dashboardService.getStudentTimetable(studentId, semester)];
                    case 5:
                        timetableData = _c.sent();
                        console.log("\u2705 [StudentController] Retrieved ".concat(timetableData.length, " courses for timetable"));
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Lấy thời khóa biểu thành công',
                                data: {
                                    student: {
                                        studentId: student.studentId,
                                        name: student.fullName,
                                        major: student.majorId,
                                        majorName: student.majorId // TODO: Map to actual major name
                                    },
                                    semester: semester,
                                    courses: timetableData
                                }
                            })];
                    case 6:
                        error_3 = _c.sent();
                        console.error("\u274C [StudentController] Error getting timetable:", error_3);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống',
                                error: error_3 instanceof Error ? error_3.message : 'Unknown error'
                            })];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getAvailableSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var DatabaseService, semester, _a, studentId, result, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService = (_b.sent()).DatabaseService;
                        _a = req.query.semester;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, DatabaseService.getCurrentSemester()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        semester = _a;
                        studentId = req.query.studentId;
                        console.log('🔍 Getting available subjects for:', { semester: semester, studentId: studentId });
                        return [4 /*yield*/, registrationManager_1.default.getAvailableCourses(semester)];
                    case 4:
                        result = _b.sent();
                        if (!result.success) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: result.message,
                                    error: result.error
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: result.data
                            })];
                    case 5:
                        error_4 = _b.sent();
                        console.error('❌ Error getting available subjects:', error_4);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống',
                                error: error_4.message
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.searchSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var DatabaseService, searchQuery_1, semester, _a, studentId, result, filteredData, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService = (_b.sent()).DatabaseService;
                        searchQuery_1 = req.query.query;
                        _a = req.query.semester;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, DatabaseService.getCurrentSemester()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        semester = _a;
                        studentId = req.query.studentId;
                        console.log('🔍 Searching subjects:', { searchQuery: searchQuery_1, semester: semester, studentId: studentId });
                        return [4 /*yield*/, registrationManager_1.default.getAvailableCourses(semester)];
                    case 4:
                        result = _b.sent();
                        if (!result.success) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: result.message,
                                    error: result.error
                                })];
                        }
                        filteredData = result.data || [];
                        if (searchQuery_1) {
                            filteredData = filteredData.filter(function (course) {
                                var _a, _b;
                                return ((_a = course.courseName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchQuery_1.toLowerCase())) ||
                                    ((_b = course.courseId) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchQuery_1.toLowerCase()));
                            });
                        }
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: filteredData
                            })];
                    case 5:
                        error_5 = _b.sent();
                        console.error('❌ Error searching subjects:', error_5);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống',
                                error: error_5.message
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.registerSubject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentId, courseId, semester, semesterId, DatabaseService, semesterParam, _b, result, error_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        console.log('🔵 [StudentController] registerSubject called');
                        console.log('🔵 [StudentController] req.body:', req.body);
                        console.log('🔵 [StudentController] req.user:', req.user);
                        _a = req.body, studentId = _a.studentId, courseId = _a.courseId, semester = _a.semester, semesterId = _a.semesterId;
                        if (!studentId || !courseId) {
                            console.log('❌ [StudentController] Missing studentId or courseId');
                            console.log('🔍 [StudentController] studentId:', studentId, 'courseId:', courseId);
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Thiếu thông tin studentId hoặc courseId' })];
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService = (_c.sent()).DatabaseService;
                        _b = semesterId || semester;
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, DatabaseService.getCurrentSemester()];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        semesterParam = _b;
                        console.log('🔵 [StudentController] Calling registerSubject with:', {
                            studentId: studentId,
                            courseId: courseId,
                            semesterParam: semesterParam
                        });
                        return [4 /*yield*/, registrationManager_1.default.registerSubject(studentId, courseId, semesterParam)];
                    case 4:
                        result = _c.sent();
                        console.log('🔵 [StudentController] Registration result:', result);
                        if (result.success) {
                            console.log('✅ [StudentController] Registration successful');
                            return [2 /*return*/, res.status(201).json({ success: true, message: result.message })];
                        }
                        else {
                            console.log('❌ [StudentController] Registration failed:', result.message);
                            return [2 /*return*/, res.status(409).json({ success: false, message: result.message })];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_6 = _c.sent();
                        console.error('❌ [StudentController] Registration error:', error_6);
                        if (error_6.message.includes('already registered')) {
                            return [2 /*return*/, res.status(409).json({
                                    success: false,
                                    message: error_6.message
                                })];
                        }
                        else if (error_6.message.includes('not found')) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: error_6.message
                                })];
                        }
                        else if (error_6.message.toLowerCase().includes('invalid') || error_6.message.toLowerCase().includes('required')) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: error_6.message
                                })];
                        }
                        else if (error_6.message.includes('available')) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: error_6.message
                                })];
                        }
                        else if (error_6.message.includes('Trùng lịch học') || error_6.message.includes('conflict') || error_6.message.includes('lịch học')) {
                            // Handle schedule conflict errors
                            return [2 /*return*/, res.status(409).json({
                                    success: false,
                                    message: error_6.message
                                })];
                        }
                        else {
                            console.error('Error registering subject:', error_6);
                            return [2 /*return*/, res.status(500).json({
                                    success: false,
                                    message: 'Lỗi hệ thống'
                                })];
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getEnrolledCourses = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var DatabaseService, studentId, semester, _a, enrolledCourses, error_7;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService = (_f.sent()).DatabaseService;
                        studentId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.studentId) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || ((_d = req.params) === null || _d === void 0 ? void 0 : _d.studentId) || ((_e = req.query) === null || _e === void 0 ? void 0 : _e.studentId);
                        _a = req.query.semester;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, DatabaseService.getCurrentSemester()];
                    case 2:
                        _a = (_f.sent());
                        _f.label = 3;
                    case 3:
                        semester = _a;
                        console.log('🔍 [StudentController] getEnrolledCourses - req.user:', req.user);
                        console.log('🔍 [StudentController] getEnrolledCourses - extracted studentId:', studentId);
                        if (!studentId) {
                            console.log('❌ [StudentController] No studentId found in request');
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Thiếu thông tin studentId trong token' })];
                        }
                        console.log('📚 [StudentController] Getting enrolled courses for student:', studentId, 'semester:', semester);
                        return [4 /*yield*/, registrationManager_1.default.getEnrolledCourses(studentId, semester)];
                    case 4:
                        enrolledCourses = _f.sent();
                        console.log('✅ [StudentController] Enrolled courses result:', enrolledCourses);
                        return [2 /*return*/, res.status(200).json(enrolledCourses)];
                    case 5:
                        error_7 = _f.sent();
                        console.error('Error getting enrolled courses:', error_7);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống'
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentData;
            return __generator(this, function (_a) {
                try {
                    studentData = req.body;
                    // Simulate registration logic
                    return [2 /*return*/, res.status(201).json({
                            success: true,
                            message: 'Đăng ký sinh viên thành công'
                        })];
                }
                catch (error) {
                    console.error('Error registering student:', error);
                    return [2 /*return*/, res.status(500).json({
                            success: false,
                            message: 'Lỗi hệ thống'
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.updateProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, updateData;
            var _a;
            return __generator(this, function (_b) {
                try {
                    studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                    updateData = req.body;
                    if (!studentId) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Thiếu thông tin studentId trong token' })];
                    }
                    // Simulate update logic
                    return [2 /*return*/, res.status(200).json({ success: true, message: 'Cập nhật hồ sơ thành công' })];
                }
                catch (error) {
                    console.error('Error updating profile:', error);
                    return [2 /*return*/, res.status(500).json({
                            success: false,
                            message: 'Lỗi hệ thống'
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.registerCourses = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, _a, courseIds, semester, academicYear;
            var _b;
            return __generator(this, function (_c) {
                try {
                    studentId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.studentId;
                    _a = req.body, courseIds = _a.courseIds, semester = _a.semester, academicYear = _a.academicYear;
                    if (!studentId || !Array.isArray(courseIds) || courseIds.length === 0) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Thiếu thông tin studentId hoặc courseIds' })];
                    }
                    // Simulate course registration logic
                    return [2 /*return*/, res.status(201).json({ success: true, message: 'Đăng ký các môn học thành công' })];
                }
                catch (error) {
                    console.error('Error registering courses:', error);
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Lỗi hệ thống' })];
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.getRegisteredCourses = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, semester;
            var _a;
            return __generator(this, function (_b) {
                try {
                    studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                    semester = req.query.semester;
                    if (!studentId) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Thiếu thông tin studentId trong token' })];
                    } // Simulate getting registered courses logic
                    return [2 /*return*/, res.status(200).json({ success: true, data: [] })];
                }
                catch (error) {
                    console.error('Error getting registered courses:', error);
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Lỗi hệ thống' })];
                }
                return [2 /*return*/];
            });
        });
    };
    // === TUITION PAYMENT METHODS ===
    StudentController.prototype.getTuitionStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, allTuitionStatus, error_8;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || ((_c = req.query) === null || _c === void 0 ? void 0 : _c.studentId);
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Thiếu thông tin studentId'
                                })];
                        }
                        console.log('🎓 Getting tuition status for studentId:', studentId);
                        return [4 /*yield*/, tuitionManager_1.default.getAllTuitionStatus(studentId)];
                    case 1:
                        allTuitionStatus = _d.sent();
                        if (!allTuitionStatus || allTuitionStatus.length === 0) {
                            return [2 /*return*/, res.status(200).json({
                                    success: true,
                                    data: [],
                                    message: 'No tuition records found'
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({ success: true, data: allTuitionStatus })];
                    case 2:
                        error_8 = _d.sent();
                        console.error('Error getting tuition status:', error_8);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.makePayment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, _a, semesterId, amount, paymentMethod, registrationId, registration, paymentRequest, paymentResponse, error_9;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 5, , 6]);
                        studentId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.studentId) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || ((_d = req.body) === null || _d === void 0 ? void 0 : _d.studentId);
                        _a = req.body, semesterId = _a.semesterId, amount = _a.amount, paymentMethod = _a.paymentMethod;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Thiếu thông tin studentId trong token'
                                })];
                        }
                        // Validate payment request
                        if (!semesterId || !amount || amount <= 0) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Invalid payment request - missing semesterId or amount'
                                })];
                        }
                        console.log('💳 Processing payment for student:', studentId, 'semester/registrationId:', semesterId, 'amount:', amount);
                        registrationId = semesterId;
                        if (!!semesterId.startsWith('PD')) return [3 /*break*/, 2];
                        return [4 /*yield*/, tuitionService_1.tuitionService.getRegistrationBySemester(studentId, semesterId)];
                    case 1:
                        registration = _e.sent();
                        if (!registration) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: 'Không tìm thấy phiếu đăng ký cho học kỳ này'
                                })];
                        }
                        registrationId = registration.registrationId;
                        console.log('📋 Found registration ID:', registrationId, 'for semester:', semesterId);
                        return [3 /*break*/, 3];
                    case 2:
                        console.log('📋 Using provided registration ID directly:', registrationId);
                        _e.label = 3;
                    case 3:
                        paymentRequest = {
                            registrationId: registrationId,
                            amount: amount,
                            paymentMethod: 'bank_transfer',
                            notes: "Payment from student ".concat(studentId, " for registration ").concat(registrationId)
                        };
                        return [4 /*yield*/, tuitionManager_1.default.processPayment(paymentRequest)];
                    case 4:
                        paymentResponse = _e.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: paymentResponse,
                                message: 'Thanh toán được xử lý thành công'
                            })];
                    case 5:
                        error_9 = _e.sent();
                        console.error('Error making payment:', error_9);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: error_9.message || 'Lỗi hệ thống'
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getPaymentHistory = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, paymentHistory, error_10;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || ((_c = req.query) === null || _c === void 0 ? void 0 : _c.studentId);
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Thiếu thông tin studentId trong token'
                                })];
                        }
                        console.log('📋 Getting payment history for student:', studentId);
                        return [4 /*yield*/, tuitionManager_1.default.getPaymentHistory(studentId)];
                    case 1:
                        paymentHistory = _d.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: paymentHistory
                            })];
                    case 2:
                        error_10 = _d.sent();
                        console.error('Error getting payment history:', error_10);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.cancelRegistration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, courseId, result, error_11;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        studentId = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.studentId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.studentId) || ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
                        courseId = req.body.courseId;
                        console.log('🔍 [StudentController] cancelRegistration - req.user:', req.user);
                        console.log('🔍 [StudentController] cancelRegistration - req.body:', req.body);
                        console.log('🔍 [StudentController] cancelRegistration - extracted studentId:', studentId);
                        if (!studentId || !courseId) {
                            console.log('❌ [StudentController] Missing studentId or courseId');
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Thiếu thông tin studentId hoặc courseId' })];
                        }
                        console.log('❌ [StudentController] Cancelling registration for student:', studentId, 'course:', courseId);
                        return [4 /*yield*/, registrationManager_1.default.cancelRegistration(studentId, courseId)];
                    case 1:
                        result = _d.sent();
                        console.log('✅ [StudentController] Cancel registration result:', result);
                        return [2 /*return*/, res.status(200).json(result)];
                    case 2:
                        error_11 = _d.sent();
                        if (error_11.message.includes('not found')) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: error_11.message })];
                        }
                        else {
                            console.error('Error cancelling registration:', error_11);
                            return [2 /*return*/, res.status(500).json({ success: false, message: 'Lỗi hệ thống' })];
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getRecommendedSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, username, DatabaseService, semester, _a, result, error_12;
            var _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 5, , 6]);
                        studentId = ((_b = req.body) === null || _b === void 0 ? void 0 : _b.studentId) || ((_c = req.params) === null || _c === void 0 ? void 0 : _c.studentId) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.studentId);
                        // Nếu không có studentId từ request, thử lấy từ user token và convert
                        if (!studentId) {
                            studentId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
                            // Nếu có username và username bắt đầu bằng 'sv', convert thành format SV0xxx
                            if (!studentId && ((_f = req.user) === null || _f === void 0 ? void 0 : _f.username)) {
                                username = req.user.username.toLowerCase();
                                if (username.startsWith('sv')) {
                                    studentId = username.toUpperCase();
                                }
                            }
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService = (_g.sent()).DatabaseService;
                        _a = req.query.semester;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, DatabaseService.getCurrentSemester()];
                    case 2:
                        _a = (_g.sent());
                        _g.label = 3;
                    case 3:
                        semester = _a;
                        console.log('🎯 Getting recommended subjects for:', { semester: semester, studentId: studentId, userFromToken: req.user });
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Thiếu thông tin studentId trong request hoặc token'
                                })];
                        }
                        return [4 /*yield*/, registrationManager_1.default.getRecommendedCourses(studentId, semester)];
                    case 4:
                        result = _g.sent();
                        if (!result.success) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: result.message,
                                    error: result.error
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: result.data
                            })];
                    case 5:
                        error_12 = _g.sent();
                        console.error('❌ Error getting recommended subjects:', error_12);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống',
                                error: error_12.message
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getClassifiedSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, username, DatabaseService, semester, _a, result, courses, inProgramSubjects, notInProgramSubjects, classifiedSubjects, error_13;
            var _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        _k.trys.push([0, 5, , 6]);
                        // Debug: Xem thông tin từ request (giống getStudentInfo và getRecommendedSubjects)
                        console.log('🔍 Debug getClassifiedSubjects - req.body:', req.body);
                        console.log('🔍 Debug getClassifiedSubjects - req.params:', req.params);
                        console.log('🔍 Debug getClassifiedSubjects - req.user:', req.user);
                        studentId = ((_b = req.body) === null || _b === void 0 ? void 0 : _b.studentId) || ((_c = req.params) === null || _c === void 0 ? void 0 : _c.studentId) || ((_d = req.user) === null || _d === void 0 ? void 0 : _d.studentId);
                        // Nếu không có studentId từ request, thử lấy từ user token
                        if (!studentId) {
                            studentId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
                            // Nếu có username và username bắt đầu bằng 'sv', convert thành format SV0xxx
                            if (!studentId && ((_f = req.user) === null || _f === void 0 ? void 0 : _f.username)) {
                                username = req.user.username.toLowerCase();
                                if (username.startsWith('sv')) {
                                    // Convert sv0001 -> SV0001
                                    studentId = username.toUpperCase();
                                    console.log('🔄 Converted username to studentId:', studentId);
                                }
                            }
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService = (_k.sent()).DatabaseService;
                        _a = req.query.semester;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, DatabaseService.getCurrentSemester()];
                    case 2:
                        _a = (_k.sent());
                        _k.label = 3;
                    case 3:
                        semester = _a;
                        console.log('📚 Getting classified subjects for:', { semester: semester, studentId: studentId });
                        if (!studentId) {
                            console.log('❌ No studentId found in request or token:', { body: req.body, params: req.params, user: req.user });
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Thiếu thông tin studentId trong request hoặc token',
                                    debug: { body: req.body, params: req.params, user: req.user }
                                })];
                        }
                        return [4 /*yield*/, registrationManager_1.default.getRecommendedCourses(studentId, semester)];
                    case 4:
                        result = _k.sent();
                        if (!result.success) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: result.message,
                                    error: result.error
                                })];
                        }
                        courses = ((_g = result.data) === null || _g === void 0 ? void 0 : _g.all) || [];
                        inProgramSubjects = ((_h = result.data) === null || _h === void 0 ? void 0 : _h.inProgram) || [];
                        notInProgramSubjects = ((_j = result.data) === null || _j === void 0 ? void 0 : _j.notInProgram) || [];
                        classifiedSubjects = {
                            inProgram: inProgramSubjects,
                            notInProgram: notInProgramSubjects,
                            summary: {
                                totalInProgram: inProgramSubjects.length,
                                totalNotInProgram: notInProgramSubjects.length,
                                totalSubjects: courses.length
                            }
                        };
                        console.log('✅ Classified subjects:', {
                            inProgram: classifiedSubjects.inProgram.length,
                            notInProgram: classifiedSubjects.notInProgram.length,
                            total: classifiedSubjects.summary.totalSubjects
                        });
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: classifiedSubjects
                            })];
                    case 5:
                        error_13 = _k.sent();
                        console.error('❌ Error getting classified subjects:', error_13);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống',
                                error: error_13.message
                            })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get current semester from system settings
     */
    StudentController.prototype.getCurrentSemester = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var DatabaseService, currentSemester, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService = (_a.sent()).DatabaseService;
                        return [4 /*yield*/, DatabaseService.getCurrentSemester()];
                    case 2:
                        currentSemester = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: { currentSemester: currentSemester }
                            })];
                    case 3:
                        error_14 = _a.sent();
                        console.error('Error getting current semester:', error_14);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống khi lấy học kỳ hiện tại'
                            })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Check registration status
    StudentController.prototype.checkRegistrationStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, semesterId, result, error_15;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        studentId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || ((_c = req.query) === null || _c === void 0 ? void 0 : _c.studentId);
                        semesterId = (_d = req.query) === null || _d === void 0 ? void 0 : _d.semesterId;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Thiếu thông tin studentId'
                                })];
                        }
                        console.log('🎓 Getting registration status for studentId:', studentId);
                        return [4 /*yield*/, registrationManager_1.default.checkRegistrationStatus(studentId, semesterId)];
                    case 1:
                        result = _e.sent();
                        if (!result.success) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: result.message
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: result.data
                            })];
                    case 2:
                        error_15 = _e.sent();
                        console.error('Error getting registration status:', error_15);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Lỗi hệ thống'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return StudentController;
}());
exports.default = new StudentController();
