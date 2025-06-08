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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var databaseService_1 = require("../../services/database/databaseService");
var crossRoleValidationService_1 = require("../shared/crossRoleValidationService");
var financialIntegrationService_1 = require("../shared/financialIntegrationService");
var RegistrationManager = /** @class */ (function () {
    function RegistrationManager() {
    }
    RegistrationManager.prototype.getAvailableSubjects = function (semester) {
        return __awaiter(this, void 0, void 0, function () {
            var semesterPattern, subjects, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Validate semester
                        if (!semester) {
                            throw new Error('Semester is required');
                        }
                        semesterPattern = /^(HK[1-3] \d{4}-\d{4}|\d{4}-[1-3])$/;
                        if (!semesterPattern.test(semester)) {
                            throw new Error('Invalid semester format');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    oc.id,\n                    oc.subject_code,\n                    oc.subject_name,\n                    oc.semester,\n                    oc.academic_year,\n                    oc.max_students,\n                    oc.current_students,\n                    oc.lecturer,\n                    oc.schedule,\n                    oc.room,\n                    oc.status,\n                    oc.registration_start_date,\n                    oc.registration_end_date,\n                    s.credits,\n                    s.description,\n                    s.type,\n                    s.prerequisite_subjects\n                FROM open_courses oc\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE oc.semester = $1 \n                AND oc.status = 'open'\n                AND oc.registration_start_date <= CURRENT_DATE\n                AND oc.registration_end_date >= CURRENT_DATE\n                ORDER BY oc.subject_code\n            ", [semester])];
                    case 1:
                        subjects = _a.sent();
                        return [2 /*return*/, subjects];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting available subjects:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search subjects by query and semester
     */
    RegistrationManager.prototype.searchSubjects = function (query, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var cleanQuery, subjects, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Validate inputs
                        if (!query || !semester) {
                            throw new Error('Search query and semester are required');
                        }
                        cleanQuery = query.trim();
                        if (cleanQuery.length < 2) {
                            throw new Error('Search query must be at least 2 characters');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    oc.id,\n                    oc.subject_code,\n                    oc.subject_name,\n                    oc.semester,\n                    oc.academic_year,\n                    oc.max_students,\n                    oc.current_students,\n                    oc.lecturer,\n                    oc.schedule,\n                    oc.room,\n                    oc.status,\n                    oc.registration_start_date,\n                    oc.registration_end_date,\n                    s.credits,\n                    s.description,\n                    s.type,\n                    s.prerequisite_subjects\n                FROM open_courses oc\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE oc.semester = $1 \n                AND oc.status = 'open'\n                AND (\n                    LOWER(oc.subject_name) LIKE LOWER($2) OR \n                    LOWER(oc.subject_code) LIKE LOWER($2) OR\n                    LOWER(s.description) LIKE LOWER($2)\n                )\n                ORDER BY oc.subject_code\n            ", [semester, "%".concat(cleanQuery, "%")])];
                    case 1:
                        subjects = _a.sent();
                        return [2 /*return*/, subjects];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error searching subjects:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Register student for a course with comprehensive validation (Legacy method)
     */
    RegistrationManager.prototype.registerSubject = function (studentId, courseId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, eligibility, tuitionResult, warnings, student, enrollment, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        // Validate inputs
                        if (!studentId || !courseId || !semester) {
                            throw new Error('Student ID, Course ID, and Semester are required');
                        }
                        // Validate courseId format (basic validation)
                        if (courseId === 'INVALID' || courseId.length < 3) {
                            throw new Error('Invalid course ID format');
                        }
                        return [4 /*yield*/, crossRoleValidationService_1.CrossRoleValidationService.validateCourseRegistration(studentId, courseId, semester)];
                    case 1:
                        validation = _a.sent();
                        if (!validation.isValid) {
                            throw new Error("Registration failed: ".concat(validation.errors.join(', ')));
                        } // 2. Enhanced eligibility check
                        return [4 /*yield*/, crossRoleValidationService_1.CrossRoleValidationService.checkStudentEligibility(studentId, courseId)];
                    case 2:
                        eligibility = _a.sent();
                        if (!eligibility.canRegister) {
                            throw new Error("Student not eligible: ".concat(eligibility.errors.join(', ')));
                        } // 3. Financial integration - create tuition record
                        return [4 /*yield*/, financialIntegrationService_1.FinancialIntegrationService.createTuitionRecord(studentId, courseId, semester)];
                    case 3:
                        tuitionResult = _a.sent();
                        warnings = __spreadArray([], validation.warnings, true);
                        if (!tuitionResult.success) {
                            warnings.push("Tuition record creation warning: ".concat(tuitionResult.error));
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT id FROM students WHERE student_id = $1\n            ", [studentId])];
                    case 4:
                        student = _a.sent();
                        if (!student) {
                            throw new Error('Student not found');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.insert('enrollments', {
                                student_id: student.id,
                                course_id: parseInt(courseId),
                                enrollment_date: new Date(),
                                status: 'registered'
                            })];
                    case 5:
                        enrollment = _a.sent();
                        // Update current students count in open_courses
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE open_courses \n                SET current_students = current_students + 1 \n                WHERE id = $1\n            ", [parseInt(courseId)])];
                    case 6:
                        // Update current students count in open_courses
                        _a.sent();
                        // 5. Log warnings if any
                        if (warnings.length > 0) {
                            console.warn("Registration warnings for student ".concat(studentId, ":"), warnings);
                        }
                        return [2 /*return*/, {
                                success: true,
                                warnings: warnings,
                                message: 'Course registered successfully',
                                tuitionRecordId: tuitionResult.tuitionRecordId,
                                eligibilityDetails: {
                                    prerequisitesMet: eligibility.prerequisitesMet,
                                    creditStatus: !eligibility.creditLimitExceeded,
                                    paymentStatus: !eligibility.hasPaymentIssues,
                                    scheduleStatus: !eligibility.hasScheduleConflict
                                }
                            }];
                    case 7:
                        error_3 = _a.sent();
                        if (error_3 instanceof Error && error_3.message === 'Already registered') {
                            throw new Error('Already registered');
                        }
                        throw error_3;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Register student for a course with comprehensive validation (New method)
     */
    RegistrationManager.prototype.registerForCourse = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, courseId, semester, validation, student, course, enrollment, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        studentId = request.studentId, courseId = request.courseId, semester = request.semester;
                        return [4 /*yield*/, crossRoleValidationService_1.CrossRoleValidationService.validateCourseRegistration(studentId, courseId, semester)];
                    case 1:
                        validation = _a.sent();
                        if (!validation.isValid) {
                            return [2 /*return*/, {
                                    success: false,
                                    errors: validation.errors,
                                    warnings: validation.warnings
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT id, student_id, name FROM students WHERE student_id = $1\n            ", [studentId])];
                    case 2:
                        student = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT oc.*, s.credits, s.subject_name \n                FROM open_courses oc \n                JOIN subjects s ON oc.subject_code = s.subject_code \n                WHERE oc.id = $1\n            ", [parseInt(courseId)])];
                    case 3:
                        course = _a.sent();
                        if (!student || !course) {
                            return [2 /*return*/, {
                                    success: false,
                                    errors: ['Student or course not found'],
                                    warnings: []
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.insert('enrollments', {
                                student_id: student.student_id,
                                course_id: parseInt(courseId),
                                course_name: course.subject_name,
                                semester: semester,
                                status: 'registered',
                                credits: course.credits
                            })];
                    case 4:
                        enrollment = _a.sent();
                        // 4. Update course current students count
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE open_courses \n                SET current_students = current_students + 1 \n                WHERE id = $1\n            ", [parseInt(courseId)])];
                    case 5:
                        // 4. Update course current students count
                        _a.sent();
                        // 5. Create tuition record
                        return [4 /*yield*/, financialIntegrationService_1.FinancialIntegrationService.createTuitionRecord(student.student_id, courseId, semester)];
                    case 6:
                        // 5. Create tuition record
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                enrollmentId: enrollment.id,
                                errors: [],
                                warnings: validation.warnings
                            }];
                    case 7:
                        error_4 = _a.sent();
                        console.error('Course registration error:', error_4);
                        return [2 /*return*/, {
                                success: false,
                                errors: ["Registration failed: ".concat(error_4 instanceof Error ? error_4.message : 'Unknown error')],
                                warnings: []
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get student's enrolled courses for a semester
     */
    RegistrationManager.prototype.getStudentEnrollments = function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, enrollments, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT \n                    e.id as enrollment_id,\n                    e.course_id,\n                    e.course_name,\n                    e.semester,\n                    e.status,\n                    e.credits,\n                    e.midterm_grade,\n                    e.final_grade,\n                    e.total_grade,\n                    e.letter_grade,\n                    oc.subject_code,\n                    oc.lecturer,\n                    oc.schedule,\n                    oc.room,\n                    s.type,\n                    s.description\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE e.student_id = $1\n            ";
                        params = [studentId];
                        if (semester) {
                            query += ' AND e.semester = $2';
                            params.push(semester);
                        }
                        query += ' ORDER BY e.created_at DESC';
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, params)];
                    case 1:
                        enrollments = _a.sent();
                        return [2 /*return*/, enrollments];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting student enrollments:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Drop/withdraw from a course
     */
    RegistrationManager.prototype.dropCourse = function (studentId, enrollmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var enrollment, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT e.*, oc.current_students, oc.id as course_id\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                WHERE e.id = $1 AND e.student_id = $2\n            ", [enrollmentId, studentId])];
                    case 1:
                        enrollment = _a.sent();
                        if (!enrollment) {
                            return [2 /*return*/, {
                                    success: false,
                                    errors: ['Enrollment not found'],
                                    warnings: []
                                }];
                        }
                        // 2. Check if drop is allowed
                        if (enrollment.status === 'completed') {
                            return [2 /*return*/, {
                                    success: false,
                                    errors: ['Cannot drop completed course'],
                                    warnings: []
                                }];
                        }
                        // 3. Update enrollment status
                        return [4 /*yield*/, databaseService_1.DatabaseService.update('enrollments', { status: 'dropped' }, { id: enrollmentId })];
                    case 2:
                        // 3. Update enrollment status
                        _a.sent();
                        // 4. Update course current students count
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE open_courses \n                SET current_students = GREATEST(current_students - 1, 0) \n                WHERE id = $1\n            ", [enrollment.course_id])];
                    case 3:
                        // 4. Update course current students count
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                errors: [],
                                warnings: ['Course dropped successfully']
                            }];
                    case 4:
                        error_6 = _a.sent();
                        console.error('Course drop error:', error_6);
                        return [2 /*return*/, {
                                success: false,
                                errors: ["Drop failed: ".concat(error_6 instanceof Error ? error_6.message : 'Unknown error')],
                                warnings: []
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get student's academic summary
     */
    RegistrationManager.prototype.getStudentAcademicSummary = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var summary, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    s.student_id,\n                    s.name,\n                    s.major,\n                    s.enrollment_year,\n                    s.completed_credits,\n                    s.current_credits,\n                    s.required_credits,\n                    COUNT(e.id) as total_enrollments,\n                    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses,\n                    COUNT(CASE WHEN e.status = 'registered' THEN 1 END) as current_enrollments,\n                    COALESCE(AVG(e.total_grade), 0) as gpa\n                FROM students s\n                LEFT JOIN enrollments e ON s.student_id = e.student_id\n                WHERE s.student_id = $1\n                GROUP BY s.student_id, s.name, s.major, s.enrollment_year, \n                         s.completed_credits, s.current_credits, s.required_credits\n            ", [studentId])];
                    case 1:
                        summary = _a.sent();
                        return [2 /*return*/, summary];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error getting academic summary:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RegistrationManager;
}());
exports.default = new RegistrationManager();
