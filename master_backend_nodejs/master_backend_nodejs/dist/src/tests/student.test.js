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
var supertest_1 = __importDefault(require("supertest"));
var express_1 = __importDefault(require("express"));
var student_routes_1 = __importDefault(require("../routes/student/student.routes"));
var globals_1 = require("@jest/globals");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dashboardService_1 = require("../services/studentService/dashboardService");
var subjectRegistrationService_1 = require("../services/studentService/subjectRegistrationService");
var enrollmentService_1 = require("../services/studentService/enrollmentService");
var gradeService_1 = require("../services/studentService/gradeService");
var studentTuitionPaymentService_1 = require("../services/studentService/studentTuitionPaymentService");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/students', student_routes_1.default);
// Mock token for testing
var secretKey = '1234567890';
var mockToken = jsonwebtoken_1.default.sign({ id: '20120123', role: 'student' }, secretKey, { expiresIn: '1h' });
// Mock data
var mockStudent = {
    studentId: '20120123',
    name: 'Test Student',
    email: 'test@example.com',
    class: 'IT1',
    major: 'Information Technology'
};
var mockSchedule = {
    student: mockStudent,
    subjects: [
        {
            id: 'IT001',
            name: 'Introduction to Programming',
            lecturer: 'Dr. Smith',
            day: 'Monday',
            session: '1-3',
            room: 'A101'
        }
    ]
};
var mockSubject = {
    id: 'IT001',
    name: 'Introduction to Programming',
    lecturer: 'Dr. Smith',
    credits: 3,
    maxStudents: 50,
    currentStudents: 30,
    schedule: [
        {
            day: 'Monday',
            session: '1-3',
            room: 'A101'
        }
    ]
};
var mockEnrollment = {
    id: 'ENR001',
    studentId: '20120123',
    courseId: 'IT001',
    courseName: 'Introduction to Programming',
    semester: 'HK1 2023-2024',
    status: 'registered',
    credits: 3
};
var mockGrade = {
    studentId: '20120123',
    subjectId: 'IT001',
    subjectName: 'Introduction to Programming',
    midtermGrade: 8.5,
    finalGrade: 9.0,
    totalGrade: 8.8,
    letterGrade: 'A'
};
var mockTuitionRecord = {
    id: 'TR001',
    studentId: '20120123',
    semester: 'HK1 2023-2024',
    totalAmount: 3000000,
    paidAmount: 0,
    remainingAmount: 3000000,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    courses: [
        {
            courseId: 'IT001',
            courseName: 'Introduction to Programming',
            credits: 3,
            price: 3000000
        }
    ]
};
// Setup mock data before tests
(0, globals_1.beforeAll)(function () {
    // Clear existing data
    subjectRegistrationService_1.subjects.length = 0;
    enrollmentService_1.enrollments.length = 0;
    enrollmentService_1.enrolledSubjects.length = 0;
    gradeService_1.grades.length = 0;
    studentTuitionPaymentService_1.tuitionRecords.length = 0;
    studentTuitionPaymentService_1.paymentReceipts.length = 0;
    // Add mock data for each service
    subjectRegistrationService_1.subjects.push(mockSubject);
    enrollmentService_1.enrollments.push(mockEnrollment);
    // Fix IEnrolledSubject structure
    var enrolledSubject = {
        enrollment: mockEnrollment,
        subjectDetails: {
            id: 'SUB001',
            name: 'Test Subject',
            lecturer: 'Test Lecturer',
            credits: 3,
            maxStudents: 50,
            currentStudents: 25,
            schedule: [
                {
                    day: 'Monday',
                    session: '1-3',
                    room: 'A101'
                }
            ]
        }, grade: {
            midterm: 8.5,
            final: 9.0,
            total: 8.75,
            letter: 'A'
        },
        attendanceRate: 95
    };
    enrollmentService_1.enrolledSubjects.push(enrolledSubject);
    gradeService_1.grades.push(mockGrade);
    studentTuitionPaymentService_1.tuitionRecords.push(mockTuitionRecord);
    // Fix IStudentOverview structure
    dashboardService_1.dashboardService.students = [mockStudent];
    dashboardService_1.dashboardService.schedules = [mockSchedule];
    dashboardService_1.dashboardService.overviews = [{
            student: mockStudent,
            enrolledSubjects: 1,
            totalCredits: 3,
            gpa: 8.8,
            upcomingClasses: [
                {
                    id: 'IT001',
                    name: 'Introduction to Programming',
                    lecturer: 'Dr. Smith',
                    day: 'Monday',
                    startTime: '07:00',
                    endTime: '09:30',
                    room: 'A101'
                }
            ],
            recentPayments: [
                {
                    id: 'PAY001',
                    studentId: '20120123',
                    amount: 3000000,
                    paymentDate: new Date().toISOString(),
                    paymentMethod: 'BANK_TRANSFER',
                    status: 'COMPLETED'
                }
            ]
        }];
});
(0, globals_1.describe)('Student API Endpoints', function () {
    var mockStudentId = '20120123';
    var mockSemester = 'HK1 2023-2024';
    // Test Dashboard & Schedule endpoints
    (0, globals_1.describe)('Dashboard & Schedule', function () {
        (0, globals_1.it)('should get student dashboard', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/api/students/dashboard/".concat(mockStudentId))
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(res.body.data).toHaveProperty('student');
                        (0, globals_1.expect)(res.body.data).toHaveProperty('schedule');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should get student timetable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/api/students/timetable/".concat(mockStudentId))
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(Array.isArray(res.body.data)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should return 404 for non-existent student', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/students/dashboard/99999999')
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(404);
                        (0, globals_1.expect)(res.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test Subject Registration endpoints
    (0, globals_1.describe)('Subject Registration', function () {
        (0, globals_1.it)('should get available subjects', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/students/available-subjects')
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(Array.isArray(res.body.data)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should search subjects', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/students/search-subjects?query=IT')
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(Array.isArray(res.body.data)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should register for a subject', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/students/register-subject')
                            .set('Authorization', "Bearer ".concat(mockToken))
                            .send({
                            studentId: mockStudentId,
                            courseId: 'IT001'
                        })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(201);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should return 400 for invalid course ID', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/students/register-subject')
                            .set('Authorization', "Bearer ".concat(mockToken))
                            .send({
                            studentId: mockStudentId,
                            courseId: 'INVALID'
                        })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(400);
                        (0, globals_1.expect)(res.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test Enrolled Subjects endpoints
    (0, globals_1.describe)('Enrolled Subjects', function () {
        (0, globals_1.it)('should get enrolled subjects', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/api/students/enrolled-subjects/".concat(mockStudentId))
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(Array.isArray(res.body.data)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should cancel subject registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/students/cancel-registration')
                            .set('Authorization', "Bearer ".concat(mockToken))
                            .send({
                            studentId: mockStudentId,
                            courseId: 'IT001'
                        })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should return 404 for non-existent enrollment', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/students/cancel-registration')
                            .set('Authorization', "Bearer ".concat(mockToken))
                            .send({
                            studentId: mockStudentId,
                            courseId: 'NONEXISTENT'
                        })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(404);
                        (0, globals_1.expect)(res.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test Grades endpoints
    (0, globals_1.describe)('Grades', function () {
        (0, globals_1.it)('should get student grades', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/api/students/grades/".concat(mockStudentId))
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(Array.isArray(res.body.data)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should get subject grade details', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/api/students/subject/IT001/grade/".concat(mockStudentId))
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(res.body.data).toHaveProperty('subjectId');
                        (0, globals_1.expect)(res.body.data).toHaveProperty('grade');
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should return 404 for non-existent grade', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get("/api/students/subject/NONEXISTENT/grade/".concat(mockStudentId))
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(404);
                        (0, globals_1.expect)(res.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Test Tuition endpoints
    (0, globals_1.describe)('Tuition', function () {
        (0, globals_1.it)('should confirm registration', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/students/confirm-registration')
                            .set('Authorization', "Bearer ".concat(mockToken))
                            .send({
                            studentId: mockStudentId,
                            semester: mockSemester,
                            courses: [
                                {
                                    courseId: 'IT001',
                                    courseName: 'Introduction to Programming',
                                    credits: 3,
                                    price: 3000000
                                }
                            ]
                        })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(201);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should pay tuition', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/students/pay-tuition')
                            .set('Authorization', "Bearer ".concat(mockToken))
                            .send({
                            tuitionRecordId: 'TR001',
                            amount: 3000000,
                            paymentMethod: 'BANK_TRANSFER'
                        })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should return 400 for invalid payment amount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post('/api/students/pay-tuition')
                            .set('Authorization', "Bearer ".concat(mockToken))
                            .send({
                            tuitionRecordId: 'TR001',
                            amount: -1000000,
                            paymentMethod: 'BANK_TRANSFER'
                        })];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(400);
                        (0, globals_1.expect)(res.body.success).toBe(false);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should get tuition records', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/students/tuition-records')
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(Array.isArray(res.body.data)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, globals_1.it)('should get payment receipts', function () { return __awaiter(void 0, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                            .get('/api/students/payment-receipts')
                            .set('Authorization', "Bearer ".concat(mockToken))];
                    case 1:
                        res = _a.sent();
                        (0, globals_1.expect)(res.status).toBe(200);
                        (0, globals_1.expect)(res.body.success).toBe(true);
                        (0, globals_1.expect)(Array.isArray(res.body.data)).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
