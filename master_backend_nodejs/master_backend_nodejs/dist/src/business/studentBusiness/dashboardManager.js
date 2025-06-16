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
Object.defineProperty(exports, "__esModule", { value: true });
var databaseService_1 = require("../../services/database/databaseService");
var DashboardManager = /** @class */ (function () {
    function DashboardManager() {
    }
    DashboardManager.prototype.getStudentDashboard = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, upcomingClasses, recentPayments, currentSemester, semester, dashboardData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        // Validate studentId
                        if (!studentId) {
                            throw new Error('Student ID is required');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    s.*,\n                    p.name_year as program_name,\n                    COUNT(e.id) as total_enrollments,\n                    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses,\n                    COUNT(CASE WHEN e.status = 'registered' THEN 1 END) as current_enrollments,\n                    COALESCE(SUM(CASE WHEN e.status = 'completed' THEN e.credits END), 0) as credits_earned,\n                    COALESCE(SUM(CASE WHEN e.status = 'registered' THEN e.credits END), 0) as current_credits,\n                    COALESCE(AVG(CASE WHEN e.status = 'completed' AND e.total_grade IS NOT NULL THEN e.total_grade END), 0) as gpa\n                FROM students s\n                LEFT JOIN programs p ON s.major = p.major\n                LEFT JOIN enrollments e ON s.student_id = e.student_id\n                WHERE s.student_id = $1\n                GROUP BY s.student_id, s.name, s.email, s.phone, s.address, s.major, s.enrollment_year, \n                         s.completed_credits, s.current_credits, s.required_credits, s.status, p.name_year\n            ", [studentId])];
                    case 1:
                        student = _a.sent();
                        if (!student) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.getUpcomingClasses(studentId)];
                    case 2:
                        upcomingClasses = _a.sent();
                        return [4 /*yield*/, this.getRecentPayments(studentId)];
                    case 3:
                        recentPayments = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT setting_value FROM system_settings WHERE setting_key = 'current_semester'\n            ")];
                    case 4:
                        currentSemester = _a.sent();
                        semester = (currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.setting_value) || '2024-1';
                        dashboardData = {
                            student: {
                                studentId: student.student_id,
                                fullName: student.name,
                                dateOfBirth: student.date_of_birth || new Date(),
                                gender: student.gender, hometown: student.hometown ? JSON.parse(student.hometown) : undefined,
                                districtId: student.district_id,
                                priorityObjectId: student.priority_object_id,
                                majorId: student.major,
                                email: student.email,
                                phone: student.phone,
                                status: student.status || 'active'
                            },
                            enrolledSubjects: parseInt(student.current_enrollments) || 0,
                            totalCredits: parseInt(student.current_credits) || 0,
                            gpa: parseFloat(student.gpa) || 0,
                            upcomingClasses: upcomingClasses,
                            recentPayments: recentPayments
                        };
                        return [2 /*return*/, dashboardData];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error getting student dashboard:', error_1);
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    DashboardManager.prototype.getTimeTable = function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var timetable, structuredTimetable, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Validate inputs
                        if (!studentId || !semester) {
                            throw new Error('Student ID and semester are required');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    e.course_name,\n                    oc.subject_code,\n                    oc.lecturer,\n                    oc.schedule,\n                    oc.room,\n                    s.credits,\n                    s.type,\n                    e.status\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e.semester = $2\n                AND e.status IN ('registered', 'enrolled')\n                ORDER BY oc.schedule\n            ", [studentId, semester])];
                    case 1:
                        timetable = _a.sent();
                        structuredTimetable = this.structureWeeklySchedule(timetable);
                        return [2 /*return*/, {
                                semester: semester,
                                studentId: studentId,
                                weeklySchedule: structuredTimetable,
                                totalCourses: timetable.length,
                                totalCredits: timetable.reduce(function (sum, course) { return sum + (course.credits || 0); }, 0)
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting timetable:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get student's upcoming classes for the next 2 days
     */
    DashboardManager.prototype.getUpcomingClasses = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var currentSemester, semester, classes, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT setting_value FROM system_settings WHERE setting_key = 'current_semester'\n            ")];
                    case 1:
                        currentSemester = _a.sent();
                        semester = (currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.setting_value) || '2024-1';
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    e.course_name as name,\n                    oc.subject_code as id,\n                    oc.lecturer,\n                    oc.schedule,\n                    oc.room,\n                    s.credits\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e.semester = $2\n                AND e.status = 'registered'\n                ORDER BY oc.schedule\n                LIMIT 5\n            ", [studentId, semester])];
                    case 2:
                        classes = _a.sent();
                        return [2 /*return*/, classes.map(function (cls) {
                                var schedule = _this.parseScheduleForUpcoming(cls.schedule);
                                return {
                                    id: cls.id,
                                    subjectId: cls.id,
                                    subjectName: cls.name,
                                    lecturer: cls.lecturer,
                                    day: schedule.day,
                                    time: "".concat(schedule.startTime, "-").concat(schedule.endTime),
                                    room: cls.room
                                };
                            })];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error getting upcoming classes:', error_3);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get student's recent payment records
     */
    DashboardManager.prototype.getRecentPayments = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var payments, recentPayments, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    pr.id,\n                    pr.amount,\n                    pr.payment_date as paymentDate,\n                    pr.payment_method as paymentMethod,\n                    pr.status,\n                    tr.semester\n                FROM payment_receipts pr\n                JOIN tuition_records tr ON pr.tuition_record_id = tr.id\n                WHERE tr.student_id = $1\n                ORDER BY pr.payment_date DESC\n                LIMIT 5\n            ", [studentId])];
                    case 1:
                        payments = _a.sent();
                        recentPayments = payments.map(function (payment) { return ({
                            paymentId: payment.id.toString(),
                            paymentDate: payment.paymentDate,
                            registrationId: payment.courseId.toString(),
                            paymentAmount: payment.amount,
                            status: payment.status,
                            paymentMethod: payment.paymentMethod,
                            transactionId: payment.id
                        }); });
                        return [2 /*return*/, recentPayments];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting recent payments:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get important alerts for the student
     */
    DashboardManager.prototype.getStudentAlerts = function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var alerts_1, unpaidTuition, studentData, gpa, registrationDeadlines, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        alerts_1 = [];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT remaining_amount FROM tuition_records \n                WHERE student_id = $1 AND semester = $2 AND status != 'paid'\n                ORDER BY due_date ASC LIMIT 1\n            ", [studentId, semester])];
                    case 1:
                        unpaidTuition = _a.sent();
                        if (unpaidTuition && parseFloat(unpaidTuition.remaining_amount) > 0) {
                            alerts_1.push({
                                type: 'payment',
                                severity: 'high',
                                message: "Outstanding tuition payment: ".concat(parseFloat(unpaidTuition.remaining_amount).toLocaleString(), " VND"),
                                actionRequired: true
                            });
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT AVG(total_grade) as gpa FROM enrollments \n                WHERE student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND status = 'completed' AND total_grade IS NOT NULL\n            ", [studentId])];
                    case 2:
                        studentData = _a.sent();
                        gpa = parseFloat((studentData === null || studentData === void 0 ? void 0 : studentData.gpa) || '0');
                        if (gpa > 0 && gpa < 2.0) {
                            alerts_1.push({
                                type: 'academic',
                                severity: 'high',
                                message: "Low GPA warning: ".concat(gpa.toFixed(2), ". Academic support recommended."),
                                actionRequired: true
                            });
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT subject_name, registration_end_date \n                FROM open_courses oc\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE oc.semester = $1 \n                AND oc.registration_end_date > CURRENT_DATE \n                AND oc.registration_end_date <= CURRENT_DATE + INTERVAL '7 days'\n                AND oc.status = 'open'\n            ", [semester])];
                    case 3:
                        registrationDeadlines = _a.sent();
                        registrationDeadlines.forEach(function (deadline) {
                            alerts_1.push({
                                type: 'registration',
                                severity: 'medium',
                                message: "Registration deadline approaching for ".concat(deadline.subject_name),
                                actionRequired: false
                            });
                        });
                        return [2 /*return*/, alerts_1];
                    case 4:
                        error_5 = _a.sent();
                        console.error('Error getting student alerts:', error_5);
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Structure timetable data into weekly format
     */
    DashboardManager.prototype.structureWeeklySchedule = function (courses) {
        var _this = this;
        var weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var weeklySchedule = {};
        weekDays.forEach(function (day) {
            weeklySchedule[day] = [];
        });
        courses.forEach(function (course) {
            var schedule = _this.parseScheduleForUpcoming(course.schedule);
            if (schedule.day && weeklySchedule[schedule.day]) {
                weeklySchedule[schedule.day].push({
                    courseCode: course.subject_code,
                    courseName: course.course_name,
                    lecturer: course.lecturer,
                    room: course.room,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    credits: course.credits,
                    type: course.type,
                    status: course.status
                });
            }
        });
        // Sort courses within each day by start time
        Object.keys(weeklySchedule).forEach(function (day) {
            weeklySchedule[day].sort(function (a, b) {
                return a.startTime.localeCompare(b.startTime);
            });
        });
        return weeklySchedule;
    };
    /**
     * Parse schedule string for upcoming classes
     */
    DashboardManager.prototype.parseScheduleForUpcoming = function (scheduleStr) {
        try {
            if (!scheduleStr) {
                return { day: 'TBD', startTime: '00:00', endTime: '00:00' };
            }
            // Parse format: "MON 08:00-10:00" or "Monday 08:00-10:00"
            var parts = scheduleStr.trim().split(' ');
            if (parts.length < 2) {
                return { day: 'TBD', startTime: '00:00', endTime: '00:00' };
            }
            var dayMap = {
                'MON': 'Monday', 'TUE': 'Tuesday', 'WED': 'Wednesday',
                'THU': 'Thursday', 'FRI': 'Friday', 'SAT': 'Saturday', 'SUN': 'Sunday'
            };
            var dayCode = parts[0].toUpperCase();
            var day = dayMap[dayCode] || parts[0];
            var timeRange = parts[1] || '00:00-00:00';
            var _a = timeRange.split('-'), startTime = _a[0], endTime = _a[1];
            return {
                day: day,
                startTime: startTime || '00:00',
                endTime: endTime || '00:00'
            };
        }
        catch (error) {
            console.error('Error parsing schedule:', error);
            return { day: 'TBD', startTime: '00:00', endTime: '00:00' };
        }
    };
    return DashboardManager;
}());
exports.default = new DashboardManager();
