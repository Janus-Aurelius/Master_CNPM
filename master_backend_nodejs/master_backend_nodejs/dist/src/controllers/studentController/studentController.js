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
var studentTuitionPaymentService_1 = require("../../services/studentService/studentTuitionPaymentService");
var StudentController = /** @class */ (function () {
    function StudentController() {
    }
    StudentController.prototype.getDashboard = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, dashboard, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId in user token' })];
                        }
                        return [4 /*yield*/, dashboardService_1.dashboardService.getStudentOverview(studentId)];
                    case 1:
                        dashboard = _b.sent();
                        if (!dashboard) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Student dashboard not found' })];
                        }
                        response = __assign(__assign({}, dashboard), { schedule: dashboard.upcomingClasses });
                        return [2 /*return*/, res.status(200).json({ success: true, data: response })];
                    case 2:
                        error_1 = _b.sent();
                        console.error("Error getting dashboard: ".concat(error_1));
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getTimeTable = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, schedule, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId in user token' })];
                        }
                        return [4 /*yield*/, dashboardService_1.dashboardService.getStudentSchedule(studentId)];
                    case 1:
                        schedule = _b.sent();
                        if (!schedule) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Student schedule not found' })];
                        }
                        return [2 /*return*/, res.status(200).json({ success: true, data: schedule.subjects })];
                    case 2:
                        error_2 = _b.sent();
                        console.error("Error getting timetable: ".concat(error_2));
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
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
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: subjects
                            })];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error getting available subjects:', error_3);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            })];
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
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: subjects
                            })];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error searching subjects:', error_4);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.registerSubject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, _a, courseId, semester, semesterParam, error_5;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        studentId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.studentId;
                        _a = req.body, courseId = _a.courseId, semester = _a.semester;
                        if (!studentId || !courseId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId or courseId' })];
                        }
                        semesterParam = semester || 'HK1 2023-2024';
                        return [4 /*yield*/, registrationManager_1.default.registerSubject(studentId, courseId, semesterParam)];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, res.status(201).json({ success: true, message: 'Subject registered successfully' })];
                    case 2:
                        error_5 = _c.sent();
                        if (error_5.message.includes('already registered')) {
                            return [2 /*return*/, res.status(409).json({
                                    success: false,
                                    message: error_5.message
                                })];
                        }
                        else if (error_5.message.includes('not found')) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: error_5.message
                                })];
                        }
                        else if (error_5.message.toLowerCase().includes('invalid') || error_5.message.toLowerCase().includes('required')) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: error_5.message
                                })];
                        }
                        else if (error_5.message.includes('available')) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    message: error_5.message
                                })];
                        }
                        else {
                            console.error('Error registering subject:', error_5);
                            return [2 /*return*/, res.status(500).json({
                                    success: false,
                                    message: 'Internal server error'
                                })];
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
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                data: request
                            })];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Error creating request: ".concat(error_6));
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getRequestHistory = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, history_1, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId in user token' })];
                        }
                        return [4 /*yield*/, academicRequestService_1.academicRequestService.getRequestsByStudent(studentId)];
                    case 1:
                        history_1 = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: history_1 })];
                    case 2:
                        error_7 = _b.sent();
                        console.error("Error getting request history: ".concat(error_7));
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getEnrolledSubjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, semester, enrolledSubjects, error_8;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        semester = req.query.semester || 'HK1 2023-2024';
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId in user token' })];
                        }
                        return [4 /*yield*/, enrollmentManager_1.default.getEnrolledSubjects(studentId, semester)];
                    case 1:
                        enrolledSubjects = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: enrolledSubjects })];
                    case 2:
                        error_8 = _b.sent();
                        console.error('Error getting enrolled subjects:', error_8);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getSubjectDetails = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, courseId_1, enrolledSubjects, enrolledSubject, grades, subjectGrade, error_9;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        courseId_1 = req.params.courseId;
                        if (!studentId || !courseId_1) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId or courseId' })];
                        }
                        return [4 /*yield*/, enrollmentManager_1.default.getEnrolledSubjects(studentId, 'HK1 2023-2024')];
                    case 1:
                        enrolledSubjects = _b.sent();
                        enrolledSubject = enrolledSubjects.find(function (subject) { return subject.enrollment.courseId === courseId_1; });
                        if (!enrolledSubject) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: 'Subject not found or student not enrolled' })];
                        }
                        return [4 /*yield*/, gradeService_1.gradeService.getStudentGrades(studentId)];
                    case 2:
                        grades = _b.sent();
                        subjectGrade = grades.find(function (grade) { return grade.subjectId === courseId_1; });
                        return [2 /*return*/, res.status(200).json({
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
                            })];
                    case 3:
                        error_9 = _b.sent();
                        console.error('Error getting subject details:', error_9);
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
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
                    return [2 /*return*/, res.status(201).json({
                            success: true,
                            message: 'Student registered successfully'
                        })];
                }
                catch (error) {
                    console.error('Error registering student:', error);
                    return [2 /*return*/, res.status(500).json({
                            success: false,
                            message: 'Internal server error'
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
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId in user token' })];
                    }
                    // Simulate update logic
                    return [2 /*return*/, res.status(200).json({ success: true, message: 'Profile updated successfully' })];
                }
                catch (error) {
                    console.error('Error updating profile:', error);
                    return [2 /*return*/, res.status(500).json({
                            success: false,
                            message: 'Internal server error'
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
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId or courseIds' })];
                    }
                    // Simulate course registration logic
                    return [2 /*return*/, res.status(201).json({ success: true, message: 'Courses registered successfully' })];
                }
                catch (error) {
                    console.error('Error registering courses:', error);
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
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
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId in user token' })];
                    }
                    // Simulate getting registered courses logic
                    return [2 /*return*/, res.status(200).json({ success: true, data: [] })];
                }
                catch (error) {
                    console.error('Error getting registered courses:', error);
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.getGrades = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, grades, error_10;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId in user token' })];
                        }
                        return [4 /*yield*/, gradeService_1.gradeService.getStudentGrades(studentId)];
                    case 1:
                        grades = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: grades })];
                    case 2:
                        error_10 = _b.sent();
                        console.error("Error getting grades: ".concat(error_10));
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.confirmRegistration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semester, courses, studentId, record, error_11;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: 'Unauthorized'
                                })];
                        }
                        _a = req.body, semester = _a.semester, courses = _a.courses;
                        studentId = req.user.id;
                        // Validate input
                        if (!semester || !courses || !Array.isArray(courses) || courses.length === 0) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Invalid input data'
                                })];
                        }
                        return [4 /*yield*/, studentTuitionPaymentService_1.studentTuitionPaymentService.createTuitionRecord(studentId, semester, courses)];
                    case 1:
                        record = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Registration confirmed and tuition record created',
                                data: record
                            })];
                    case 2:
                        error_11 = _b.sent();
                        console.error('Error confirming registration:', error_11);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Error confirming registration'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.payTuition = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, _a, tuitionRecordId, amount;
            var _b;
            return __generator(this, function (_c) {
                try {
                    studentId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.studentId;
                    _a = req.body, tuitionRecordId = _a.tuitionRecordId, amount = _a.amount;
                    if (!studentId || !tuitionRecordId || typeof amount !== 'number' || amount < 0) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId, tuitionRecordId, or invalid amount' })];
                    }
                    // Simulate payment logic
                    return [2 /*return*/, res.status(200).json({ success: true, message: 'Payment processed successfully' })];
                }
                catch (error) {
                    console.error('Error processing payment:', error);
                    return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
                }
                return [2 /*return*/];
            });
        });
    };
    StudentController.prototype.editRegistration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, tuitionRecordId, newCourses, studentId, record, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!req.user) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: 'Unauthorized'
                                })];
                        }
                        _a = req.body, tuitionRecordId = _a.tuitionRecordId, newCourses = _a.newCourses;
                        studentId = req.user.id;
                        // Validate input
                        if (!tuitionRecordId || !newCourses || !Array.isArray(newCourses)) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Invalid input data'
                                })];
                        }
                        return [4 /*yield*/, studentTuitionPaymentService_1.studentTuitionPaymentService.editRegistration(tuitionRecordId, newCourses)];
                    case 1:
                        record = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Registration updated successfully',
                                data: record
                            })];
                    case 2:
                        error_12 = _b.sent();
                        console.error('Error editing registration:', error_12);
                        return [2 /*return*/, res.status(500).json({
                                success: false,
                                message: 'Error editing registration'
                            })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getTuitionRecordsByStudent = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, records, error_13;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId in user token' })];
                        }
                        return [4 /*yield*/, tuitionPaymentManager_1.tuitionPaymentManager.getTuitionRecordsByStudent(studentId)];
                    case 1:
                        records = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: records })];
                    case 2:
                        error_13 = _b.sent();
                        console.error('Error getting tuition records:', error_13);
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.getPaymentReceiptsByRecord = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, tuitionRecordId, receipts, error_14;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        tuitionRecordId = req.query.tuitionRecordId;
                        if (!studentId || !tuitionRecordId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId or tuitionRecordId' })];
                        }
                        return [4 /*yield*/, tuitionPaymentManager_1.tuitionPaymentManager.getPaymentReceiptsByRecord(tuitionRecordId)];
                    case 1:
                        receipts = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: receipts })];
                    case 2:
                        error_14 = _b.sent();
                        console.error('Error getting payment receipts:', error_14);
                        return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentController.prototype.cancelRegistration = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, courseId, error_15;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        studentId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.studentId;
                        courseId = req.body.courseId;
                        if (!studentId || !courseId) {
                            return [2 /*return*/, res.status(400).json({ success: false, message: 'Missing studentId or courseId' })];
                        }
                        return [4 /*yield*/, enrollmentManager_1.default.cancelRegistration(studentId, courseId)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, message: 'Registration cancelled successfully' })];
                    case 2:
                        error_15 = _b.sent();
                        if (error_15.message.includes('not found')) {
                            return [2 /*return*/, res.status(404).json({ success: false, message: error_15.message })];
                        }
                        else {
                            console.error('Error cancelling registration:', error_15);
                            return [2 /*return*/, res.status(500).json({ success: false, message: 'Internal server error' })];
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
