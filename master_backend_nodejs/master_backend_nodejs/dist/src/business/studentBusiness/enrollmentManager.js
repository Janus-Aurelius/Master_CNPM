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
var EnrollmentManager = /** @class */ (function () {
    function EnrollmentManager() {
    }
    EnrollmentManager.prototype.getEnrolledSubjects = function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var semesterPattern, enrolledSubjects, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Validate inputs
                        if (!studentId || !semester) {
                            throw new Error('Student ID and semester are required');
                        }
                        semesterPattern = /^HK[1-3] \d{4}-\d{4}$/;
                        if (!semesterPattern.test(semester)) {
                            throw new Error('Invalid semester format');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    e.id as enrollment_id,\n                    e.course_id,\n                    e.course_name,\n                    e.semester,\n                    e.status,\n                    e.credits,\n                    e.midterm_grade,\n                    e.final_grade,\n                    e.total_grade,\n                    e.letter_grade,\n                    e.enrollment_date,\n                    oc.subject_code,\n                    oc.lecturer,\n                    oc.schedule,\n                    oc.room,\n                    oc.max_students,\n                    oc.current_students,\n                    s.subject_name,\n                    s.type,\n                    s.description,\n                    s.credits as subject_credits\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e.semester = $2\n                AND e.status IN ('registered', 'enrolled', 'completed')\n                ORDER BY e.enrollment_date DESC\n            ", [studentId, semester])];
                    case 1:
                        enrolledSubjects = _a.sent();
                        // Transform to match IEnrolledSubject interface
                        return [2 /*return*/, enrolledSubjects.map(function (subject) { return ({
                                enrollment: {
                                    id: subject.enrollment_id,
                                    studentId: studentId,
                                    courseId: subject.subject_code,
                                    courseName: subject.course_name,
                                    semester: subject.semester,
                                    status: subject.status,
                                    credits: subject.credits
                                },
                                subjectDetails: {
                                    id: subject.subject_code,
                                    name: subject.subject_name,
                                    lecturer: subject.lecturer,
                                    credits: subject.subject_credits,
                                    maxStudents: subject.max_students,
                                    currentStudents: subject.current_students,
                                    schedule: _this.parseSchedule(subject.schedule),
                                    room: subject.room,
                                    type: subject.type,
                                    description: subject.description
                                },
                                grade: subject.total_grade ? {
                                    midterm: subject.midterm_grade || 0,
                                    final: subject.final_grade || 0,
                                    total: subject.total_grade,
                                    letter: subject.letter_grade
                                } : null,
                                attendanceRate: 0 // TODO: Implement attendance tracking
                            }); })];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting enrolled subjects:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    EnrollmentManager.prototype.cancelRegistration = function (studentId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var enrollment, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // Validate inputs
                        if (!studentId || !courseId) {
                            throw new Error('Student ID and Course ID are required');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT e.*, oc.current_students, oc.id as course_internal_id\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND oc.subject_code = $2\n                AND e.status = 'registered'\n            ", [studentId, courseId])];
                    case 1:
                        enrollment = _a.sent();
                        if (!enrollment) {
                            throw new Error('Active enrollment not found');
                        }
                        // Update enrollment status to dropped
                        return [4 /*yield*/, databaseService_1.DatabaseService.update('enrollments', { status: 'dropped', drop_date: new Date() }, { id: enrollment.id })];
                    case 2:
                        // Update enrollment status to dropped
                        _a.sent();
                        // Update course current students count
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE open_courses \n                SET current_students = GREATEST(current_students - 1, 0) \n                WHERE id = $1\n            ", [enrollment.course_internal_id])];
                    case 3:
                        // Update course current students count
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: 'Registration cancelled successfully'
                            }];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error cancelling registration:', error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    EnrollmentManager.prototype.getEnrollmentDetails = function (studentId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var enrollment, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!studentId || !courseId) {
                            throw new Error('Student ID and Course ID are required');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    e.id,\n                    e.course_id,\n                    e.course_name,\n                    e.semester,\n                    e.status,\n                    e.credits,\n                    e.enrollment_date,\n                    oc.subject_code\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND oc.subject_code = $2\n                ORDER BY e.enrollment_date DESC\n                LIMIT 1\n            ", [studentId, courseId])];
                    case 1:
                        enrollment = _a.sent();
                        if (!enrollment) {
                            throw new Error('Enrollment not found');
                        }
                        return [2 /*return*/, {
                                id: enrollment.id,
                                studentId: studentId,
                                courseId: enrollment.subject_code,
                                courseName: enrollment.course_name,
                                semester: enrollment.semester,
                                status: enrollment.status,
                                credits: enrollment.credits
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error getting enrollment details:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get student's enrollment history across all semesters
     */
    EnrollmentManager.prototype.getEnrollmentHistory = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var history_1, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!studentId) {
                            throw new Error('Student ID is required');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    e.id,\n                    e.course_name,\n                    e.semester,\n                    e.status,\n                    e.credits,\n                    e.total_grade,\n                    e.letter_grade,\n                    e.enrollment_date,\n                    oc.subject_code,\n                    s.subject_name,\n                    s.type\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                ORDER BY e.semester DESC, e.enrollment_date DESC\n            ", [studentId])];
                    case 1:
                        history_1 = _a.sent();
                        return [2 /*return*/, history_1];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting enrollment history:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get enrollment statistics for a student
     */
    EnrollmentManager.prototype.getEnrollmentStatistics = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!studentId) {
                            throw new Error('Student ID is required');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    COUNT(*) as total_enrollments,\n                    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses,\n                    COUNT(CASE WHEN e.status = 'registered' THEN 1 END) as current_enrollments,\n                    COUNT(CASE WHEN e.status = 'dropped' THEN 1 END) as dropped_courses,\n                    COALESCE(SUM(CASE WHEN e.status = 'completed' THEN e.credits END), 0) as total_credits_earned,\n                    COALESCE(SUM(CASE WHEN e.status = 'registered' THEN e.credits END), 0) as current_credits,\n                    COALESCE(AVG(CASE WHEN e.status = 'completed' AND e.total_grade IS NOT NULL THEN e.total_grade END), 0) as gpa\n                FROM enrollments e\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n            ", [studentId])];
                    case 1:
                        stats = _a.sent();
                        return [2 /*return*/, {
                                totalEnrollments: parseInt((stats === null || stats === void 0 ? void 0 : stats.total_enrollments) || '0'),
                                completedCourses: parseInt((stats === null || stats === void 0 ? void 0 : stats.completed_courses) || '0'),
                                currentEnrollments: parseInt((stats === null || stats === void 0 ? void 0 : stats.current_enrollments) || '0'),
                                droppedCourses: parseInt((stats === null || stats === void 0 ? void 0 : stats.dropped_courses) || '0'),
                                totalCreditsEarned: parseInt((stats === null || stats === void 0 ? void 0 : stats.total_credits_earned) || '0'),
                                currentCredits: parseInt((stats === null || stats === void 0 ? void 0 : stats.current_credits) || '0'),
                                gpa: parseFloat((stats === null || stats === void 0 ? void 0 : stats.gpa) || '0')
                            }];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting enrollment statistics:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Helper method to parse schedule string into structured format
     */
    EnrollmentManager.prototype.parseSchedule = function (scheduleStr) {
        try {
            if (!scheduleStr)
                return [];
            // Parse schedule format: "MON 08:00-10:00, WED 14:00-16:00"
            var sessions = scheduleStr.split(',').map(function (s) { return s.trim(); });
            return sessions.map(function (session) {
                var parts = session.split(' ');
                var day = parts[0] || 'TBD';
                var timeRange = parts[1] || 'TBD';
                return {
                    day: day,
                    session: timeRange,
                    room: '' // Room is handled separately
                };
            });
        }
        catch (error) {
            console.error('Error parsing schedule:', error);
            return [{ day: 'TBD', session: 'TBD', room: '' }];
        }
    };
    return EnrollmentManager;
}());
exports.default = new EnrollmentManager();
