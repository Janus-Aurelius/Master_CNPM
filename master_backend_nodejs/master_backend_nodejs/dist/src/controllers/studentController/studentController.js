"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var academicRequestService_1 = require("../../services/studentService/academicRequestService");
var gradeService_1 = require("../../services/studentService/gradeService");
var registrationManager_1 = __importDefault(require("../../business/studentBusiness/registrationManager"));
var enrollmentManager_1 = __importDefault(require("../../business/studentBusiness/enrollmentManager"));
var tuitionPaymentManager_1 = require("../../business/studentBusiness/tuitionPaymentManager");
var StudentController = /** @class */ (function () {
    function StudentController() {
    }
    StudentController.prototype.getDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, dashboard, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentId = req.user.id;
                        return [4 /*yield*/, dashboardService_1.dashboardService.getStudentOverview(studentId)];
                    case 1:
                        dashboard = _a.sent();
                        if (!dashboard) {
                            res.status(404).json({
                                success: false,
                                message: 'Student dashboard not found'
                            });
                            return [2 /*return*/];
                        }
                        response = __assign(__assign({}, dashboard), { schedule: dashboard.upcomingClasses // Map upcomingClasses to schedule
                         });
                        res.status(200).json({
                            success: true,
                            data: response
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error getting dashboard: ".concat(error_1));
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getTimeTable = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, schedule, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentId = req.user.id;
                        return [4 /*yield*/, dashboardService_1.dashboardService.getStudentSchedule(studentId)];
                    case 1:
                        schedule = _a.sent();
                        if (!schedule) {
                            res.status(404).json({
                                success: false,
                                message: 'Student schedule not found'
                            });
                            return [2 /*return*/];
                        }
                        res.status(200).json({
                            success: true,
                            data: schedule.subjects // Return the subjects array instead of the whole schedule
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error getting timetable: ".concat(error_2));
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getAvailableSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var semester, subjects, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        semester = req.query.semester || 'HK1 2023-2024';
                        return [4 /*yield*/, registrationManager_1.default.getAvailableSubjects(semester)];
                    case 1:
                        subjects = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: subjects
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error getting available subjects:', error_3);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.searchSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var searchQuery, semester, subjects, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        searchQuery = req.query.query;
                        semester = req.query.semester || 'HK1 2023-2024';
                        return [4 /*yield*/, registrationManager_1.default.searchSubjects(searchQuery, semester)];
                    case 1:
                        subjects = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: subjects
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error searching subjects:', error_4);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.registerSubject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentId, courseId, semester, semesterParam, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, studentId = _a.studentId, courseId = _a.courseId, semester = _a.semester;
                        semesterParam = semester || 'HK1 2023-2024';
                        return [4 /*yield*/, registrationManager_1.default.registerSubject(studentId, courseId, semesterParam)];
                    case 1:
                        _b.sent();
                        res.status(201).json({
                            success: true,
                            message: 'Subject registered successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _b.sent();
                        if (error_5.message.includes('already registered')) {
                            res.status(409).json({
                                success: false,
                                message: error_5.message
                            });
                        }
                        else if (error_5.message.includes('not found')) {
                            res.status(404).json({
                                success: false,
                                message: error_5.message
                            });
                        }
                        else if (error_5.message.toLowerCase().includes('invalid') || error_5.message.toLowerCase().includes('required')) {
                            res.status(400).json({
                                success: false,
                                message: error_5.message
                            });
                        }
                        else if (error_5.message.includes('available')) {
                            res.status(404).json({
                                success: false,
                                message: error_5.message
                            });
                        }
                        else {
                            console.error('Error registering subject:', error_5);
                            res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.createRequest = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var request, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, academicRequestService_1.academicRequestService.createRequest(req.body)];
                    case 1:
                        request = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: request
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error creating request: ".concat(error_6));
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getRequestHistory = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, history_1, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentId = req.params.studentId;
                        return [4 /*yield*/, academicRequestService_1.academicRequestService.getRequestHistory(studentId)];
                    case 1:
                        history_1 = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: history_1
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Error getting request history: ".concat(error_7));
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getEnrolledSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, semester, enrolledSubjects, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentId = req.params.studentId;
                        semester = req.query.semester || 'HK1 2023-2024';
                        return [4 /*yield*/, enrollmentManager_1.default.getEnrolledSubjects(studentId, semester)];
                    case 1:
                        enrolledSubjects = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: enrolledSubjects
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error getting enrolled subjects:', error_8);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getSubjectDetails = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentId, courseId_1, enrolledSubjects, enrolledSubject, grades, subjectGrade, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        _a = req.params, studentId = _a.studentId, courseId_1 = _a.courseId;
                        return [4 /*yield*/, enrollmentManager_1.default.getEnrolledSubjects(studentId, 'HK1 2023-2024')];
                    case 1:
                        enrolledSubjects = _b.sent();
                        enrolledSubject = enrolledSubjects.find(function (subject) { return subject.enrollment.courseId === courseId_1; });
                        if (!enrolledSubject) {
                            res.status(404).json({
                                success: false,
                                message: 'Subject not found or student not enrolled'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, gradeService_1.gradeService.getStudentGrades(studentId)];
                    case 2:
                        grades = _b.sent();
                        subjectGrade = grades.find(function (grade) { return grade.subjectId === courseId_1; });
                        res.status(200).json({
                            success: true,
                            data: {
                                subjectId: courseId_1,
                                grade: subjectGrade || {
                                    subjectId: courseId_1,
                                    midtermGrade: null,
                                    finalGrade: null,
                                    totalGrade: null,
                                    letterGrade: null
                                },
                                subject: enrolledSubject
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _b.sent();
                        console.error('Error getting subject details:', error_9);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
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
                    res.status(201).json({
                        success: true,
                        message: 'Student registered successfully'
                    });
                }
                catch (error) {
                    console.error('Error registering student:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.updateProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, updateData;
            return __generator(this, function (_a) {
                try {
                    studentId = req.params.studentId;
                    updateData = req.body;
                    // Simulate update logic
                    res.status(200).json({
                        success: true,
                        message: 'Profile updated successfully'
                    });
                }
                catch (error) {
                    console.error('Error updating profile:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.registerCourses = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentId, courseIds, semester, academicYear;
            return __generator(this, function (_b) {
                try {
                    _a = req.body, studentId = _a.studentId, courseIds = _a.courseIds, semester = _a.semester, academicYear = _a.academicYear;
                    // Simulate course registration logic
                    res.status(201).json({
                        success: true,
                        message: 'Courses registered successfully'
                    });
                }
                catch (error) {
                    console.error('Error registering courses:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.getRegisteredCourses = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, semester;
            return __generator(this, function (_a) {
                try {
                    studentId = req.params.studentId;
                    semester = req.query.semester;
                    // Simulate getting registered courses logic
                    res.status(200).json({
                        success: true,
                        data: []
                    });
                }
                catch (error) {
                    console.error('Error getting registered courses:', error);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.getGrades = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, grades, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentId = req.params.studentId;
                        return [4 /*yield*/, gradeService_1.gradeService.getStudentGrades(studentId)];
                    case 1:
                        grades = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: grades
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.error("Error getting grades: ".concat(error_10));
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.confirmRegistration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentId, semester, courses, record, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, studentId = _a.studentId, semester = _a.semester, courses = _a.courses;
                        return [4 /*yield*/, tuitionPaymentManager_1.tuitionPaymentManager.confirmRegistration(studentId, semester, courses)];
                    case 1:
                        record = _b.sent();
                        res.status(201).json({ success: true, data: record });
                        return [3 /*break*/, 3];
                    case 2:
                        error_11 = _b.sent();
                        console.error('Error confirming registration:', error_11);
                        res.status(500).json({ success: false, message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.payTuition = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, tuitionRecordId, amount;
            return __generator(this, function (_b) {
                try {
                    _a = req.body, tuitionRecordId = _a.tuitionRecordId, amount = _a.amount;
                    if (typeof amount !== 'number' || amount < 0) {
                        res.status(400).json({ success: false, message: 'Invalid amount' });
                        return [2 /*return*/];
                    }
                    // Simulate payment logic
                    res.status(200).json({ success: true, message: 'Payment processed successfully' });
                }
                catch (error) {
                    console.error('Error processing payment:', error);
                    res.status(500).json({ success: false, message: 'Internal server error' });
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.editRegistration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, tuitionRecordId, newCourses, record, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, tuitionRecordId = _a.tuitionRecordId, newCourses = _a.newCourses;
                        return [4 /*yield*/, tuitionPaymentManager_1.tuitionPaymentManager.editRegistration(tuitionRecordId, newCourses)];
                    case 1:
                        record = _b.sent();
                        res.status(200).json({ success: true, data: record });
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _b.sent();
                        console.error('Error editing registration:', error_12);
                        res.status(500).json({ success: false, message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getTuitionRecordsByStudent = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, records, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentId = req.query.studentId;
                        return [4 /*yield*/, tuitionPaymentManager_1.tuitionPaymentManager.getTuitionRecordsByStudent(studentId)];
                    case 1:
                        records = _a.sent();
                        res.status(200).json({ success: true, data: records });
                        return [3 /*break*/, 3];
                    case 2:
                        error_13 = _a.sent();
                        console.error('Error getting tuition records:', error_13);
                        res.status(500).json({ success: false, message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getPaymentReceiptsByRecord = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var tuitionRecordId, receipts, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tuitionRecordId = req.query.tuitionRecordId;
                        return [4 /*yield*/, tuitionPaymentManager_1.tuitionPaymentManager.getPaymentReceiptsByRecord(tuitionRecordId)];
                    case 1:
                        receipts = _a.sent();
                        res.status(200).json({ success: true, data: receipts });
                        return [3 /*break*/, 3];
                    case 2:
                        error_14 = _a.sent();
                        console.error('Error getting payment receipts:', error_14);
                        res.status(500).json({ success: false, message: 'Internal server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.cancelRegistration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentId, courseId, error_15;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, studentId = _a.studentId, courseId = _a.courseId;
                        return [4 /*yield*/, enrollmentManager_1.default.cancelRegistration(studentId, courseId)];
                    case 1:
                        _b.sent();
                        res.status(200).json({
                            success: true,
                            message: 'Registration cancelled successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_15 = _b.sent();
                        if (error_15.message.includes('not found')) {
                            res.status(404).json({
                                success: false,
                                message: error_15.message
                            });
                        }
                        else {
                            console.error('Error cancelling registration:', error_15);
                            res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return StudentController;
}());
exports.default = new StudentController();
