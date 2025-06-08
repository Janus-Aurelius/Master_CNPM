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
exports.CrossRoleValidationService = void 0;
// src/business/shared/crossRoleValidationService.ts
var databaseService_1 = require("../../services/database/databaseService");
var CrossRoleValidationService = /** @class */ (function () {
    function CrossRoleValidationService() {
    }
    /**
     * Comprehensive course registration validation
     * Integrates Academic Affairs and Financial Department rules
     */
    CrossRoleValidationService.validateCourseRegistration = function (studentId, courseId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, warnings, course, now, regStart, regEnd, existingEnrollment, prerequisitesValid, paymentValid, creditValid, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errors = [];
                        warnings = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        // 1. Basic input validation
                        if (!studentId || !courseId || !semester) {
                            errors.push('Student ID, Course ID, and Semester are required');
                            return [2 /*return*/, { isValid: false, errors: errors, warnings: warnings }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT oc.*, s.subject_name, s.credits, s.prerequisites, s.subject_code\n                FROM open_courses oc \n                JOIN subjects s ON oc.subject_id = s.id \n                WHERE oc.id = $1\n            ", [parseInt(courseId)])];
                    case 2:
                        course = _a.sent();
                        if (!course) {
                            errors.push('Course not found');
                            return [2 /*return*/, { isValid: false, errors: errors, warnings: warnings }];
                        }
                        // 3. Course status validation
                        if (course.status !== 'open') {
                            errors.push("Course is currently ".concat(course.status, " and not available for registration"));
                        }
                        // 4. Course capacity validation
                        if (course.current_students >= course.max_students) {
                            errors.push('Course has reached maximum capacity');
                        }
                        now = new Date();
                        regStart = new Date(course.registration_start_date);
                        regEnd = new Date(course.registration_end_date);
                        if (now < regStart) {
                            errors.push('Registration period has not started yet');
                        }
                        else if (now > regEnd) {
                            errors.push('Registration period has ended');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT id FROM enrollments \n                WHERE student_id = (SELECT id FROM students WHERE student_id = $1) \n                AND course_id = $2 \n                AND status IN ('registered', 'enrolled')\n            ", [studentId, parseInt(courseId)])];
                    case 3:
                        existingEnrollment = _a.sent();
                        if (existingEnrollment) {
                            errors.push('Student is already enrolled in this course');
                        }
                        return [4 /*yield*/, this.validatePrerequisites(studentId, course.prerequisites)];
                    case 4:
                        prerequisitesValid = _a.sent();
                        if (!prerequisitesValid.isValid) {
                            errors.push.apply(errors, prerequisitesValid.errors);
                        }
                        return [4 /*yield*/, this.validatePaymentStatus(studentId, semester)];
                    case 5:
                        paymentValid = _a.sent();
                        if (!paymentValid.isValid) {
                            warnings.push.apply(warnings, paymentValid.warnings);
                            if (paymentValid.critical) {
                                errors.push.apply(errors, paymentValid.errors);
                            }
                        }
                        return [4 /*yield*/, this.validateCreditLimits(studentId, course.subject_code, semester)];
                    case 6:
                        creditValid = _a.sent();
                        if (!creditValid.isValid) {
                            if (creditValid.isWarning) {
                                warnings.push.apply(warnings, creditValid.errors);
                            }
                            else {
                                errors.push.apply(errors, creditValid.errors);
                            }
                        }
                        return [2 /*return*/, {
                                isValid: errors.length === 0,
                                errors: errors,
                                warnings: warnings
                            }];
                    case 7:
                        error_1 = _a.sent();
                        console.error('Course registration validation error:', error_1);
                        return [2 /*return*/, {
                                isValid: false,
                                errors: ['Internal validation error occurred'],
                                warnings: warnings
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate prerequisites using database
     */
    CrossRoleValidationService.validatePrerequisites = function (studentId, prerequisites) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, missingPrerequisites, completedCourses, completedSubjects, _i, prerequisites_1, prereq, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!prerequisites || prerequisites.length === 0) {
                            return [2 /*return*/, { isValid: true, errors: [], missingPrerequisites: [] }];
                        }
                        errors = [];
                        missingPrerequisites = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT DISTINCT s.subject_code \n                FROM grades g\n                JOIN enrollments e ON g.enrollment_id = e.id\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_id = s.id\n                JOIN students st ON e.student_id = st.id\n                WHERE st.student_id = $1 \n                AND g.grade_value >= 4.0\n                AND g.status = 'finalized'\n            ", [studentId])];
                    case 2:
                        completedCourses = _a.sent();
                        completedSubjects = completedCourses.map(function (c) { return c.subject_code; });
                        for (_i = 0, prerequisites_1 = prerequisites; _i < prerequisites_1.length; _i++) {
                            prereq = prerequisites_1[_i];
                            if (!completedSubjects.includes(prereq)) {
                                missingPrerequisites.push(prereq);
                                errors.push("Missing prerequisite: ".concat(prereq));
                            }
                        }
                        return [2 /*return*/, {
                                isValid: missingPrerequisites.length === 0,
                                errors: errors,
                                missingPrerequisites: missingPrerequisites
                            }];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Prerequisites validation error:', error_2);
                        return [2 /*return*/, {
                                isValid: false,
                                errors: ['Could not validate prerequisites'],
                                missingPrerequisites: []
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate payment status using database
     */
    CrossRoleValidationService.validatePaymentStatus = function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var tuitionRecord, errors, warnings, critical, remainingAmount, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM tuition_records \n                WHERE student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND semester = $2\n            ", [studentId, semester])];
                    case 1:
                        tuitionRecord = _a.sent();
                        if (!tuitionRecord) {
                            return [2 /*return*/, {
                                    isValid: false,
                                    critical: true,
                                    errors: ['No tuition record found for current semester'],
                                    warnings: []
                                }];
                        }
                        errors = [];
                        warnings = [];
                        critical = false;
                        // Check payment status
                        if (tuitionRecord.payment_status === 'unpaid') {
                            critical = true;
                            errors.push('Tuition payment is required before course registration');
                        }
                        else if (tuitionRecord.payment_status === 'partial') {
                            remainingAmount = tuitionRecord.total_amount - tuitionRecord.paid_amount;
                            if (remainingAmount > tuitionRecord.total_amount * 0.5) { // More than 50% unpaid
                                critical = true;
                                errors.push("Significant tuition balance remaining: ".concat(remainingAmount.toLocaleString(), " VND"));
                            }
                            else {
                                warnings.push("Tuition balance remaining: ".concat(remainingAmount.toLocaleString(), " VND"));
                            }
                        }
                        // Check due date
                        if (tuitionRecord.due_date && new Date() > new Date(tuitionRecord.due_date)) {
                            if (tuitionRecord.payment_status !== 'paid') {
                                critical = true;
                                errors.push('Tuition payment is overdue');
                            }
                        }
                        return [2 /*return*/, {
                                isValid: !critical,
                                critical: critical,
                                errors: errors,
                                warnings: warnings
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Payment validation error:', error_3);
                        return [2 /*return*/, {
                                isValid: false,
                                critical: true,
                                errors: ['Could not validate payment status'],
                                warnings: []
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate credit limits using database
     */
    CrossRoleValidationService.validateCreditLimits = function (studentId, subjectCode, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, currentCredits, newTotalCredits, maxCredits, errors, isWarning, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT credits FROM subjects WHERE subject_code = $1\n            ", [subjectCode])];
                    case 1:
                        subject = _a.sent();
                        if (!subject) {
                            return [2 /*return*/, {
                                    isValid: false,
                                    isWarning: false,
                                    errors: ['Subject not found'],
                                    currentCredits: 0,
                                    maxCredits: 0
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COALESCE(SUM(s.credits), 0) as total_credits\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_id = s.id\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND oc.semester = $2\n                AND e.status IN ('registered', 'enrolled')\n            ", [studentId, semester])];
                    case 2:
                        currentCredits = _a.sent();
                        newTotalCredits = ((currentCredits === null || currentCredits === void 0 ? void 0 : currentCredits.total_credits) || 0) + subject.credits;
                        maxCredits = 24;
                        errors = [];
                        isWarning = false;
                        if (newTotalCredits > maxCredits) {
                            errors.push("Credit limit exceeded. Current: ".concat((currentCredits === null || currentCredits === void 0 ? void 0 : currentCredits.total_credits) || 0, ", Adding: ").concat(subject.credits, ", Max: ").concat(maxCredits));
                            return [2 /*return*/, {
                                    isValid: false,
                                    isWarning: false,
                                    errors: errors,
                                    currentCredits: (currentCredits === null || currentCredits === void 0 ? void 0 : currentCredits.total_credits) || 0,
                                    maxCredits: maxCredits
                                }];
                        }
                        else if (newTotalCredits > maxCredits * 0.8) { // Warning at 80%
                            isWarning = true;
                            errors.push("Approaching credit limit. Total will be: ".concat(newTotalCredits, "/").concat(maxCredits, " credits"));
                            return [2 /*return*/, {
                                    isValid: false,
                                    isWarning: true,
                                    errors: errors,
                                    currentCredits: (currentCredits === null || currentCredits === void 0 ? void 0 : currentCredits.total_credits) || 0,
                                    maxCredits: maxCredits
                                }];
                        }
                        return [2 /*return*/, {
                                isValid: true,
                                isWarning: false,
                                errors: [],
                                currentCredits: (currentCredits === null || currentCredits === void 0 ? void 0 : currentCredits.total_credits) || 0,
                                maxCredits: maxCredits
                            }];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Credit validation error:', error_4);
                        return [2 /*return*/, {
                                isValid: false,
                                isWarning: false,
                                errors: ['Could not validate credit limits'],
                                currentCredits: 0,
                                maxCredits: 0
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Comprehensive student eligibility check
     */
    CrossRoleValidationService.checkStudentEligibility = function (studentId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, currentSemester, semester, validation, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM students WHERE student_id = $1\n            ", [studentId])];
                    case 1:
                        student = _a.sent();
                        if (!student) {
                            return [2 /*return*/, {
                                    canRegister: false,
                                    prerequisitesMet: false,
                                    hasScheduleConflict: false,
                                    hasPaymentIssues: true,
                                    creditLimitExceeded: false,
                                    errors: ['Student not found']
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT setting_value FROM system_settings WHERE setting_key = 'current_semester'\n            ")];
                    case 2:
                        currentSemester = _a.sent();
                        semester = (currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.setting_value) || '2024-1';
                        return [4 /*yield*/, this.validateCourseRegistration(studentId, courseId, semester)];
                    case 3:
                        validation = _a.sent();
                        return [2 /*return*/, {
                                canRegister: validation.isValid,
                                prerequisitesMet: !validation.errors.some(function (e) { return e.includes('prerequisite'); }),
                                hasScheduleConflict: validation.errors.some(function (e) { return e.includes('schedule') || e.includes('conflict'); }),
                                hasPaymentIssues: validation.errors.some(function (e) { return e.includes('payment') || e.includes('tuition'); }),
                                creditLimitExceeded: validation.errors.some(function (e) { return e.includes('credit limit'); }),
                                errors: __spreadArray(__spreadArray([], validation.errors, true), validation.warnings, true)
                            }];
                    case 4:
                        error_5 = _a.sent();
                        console.error('Student eligibility check error:', error_5);
                        return [2 /*return*/, {
                                canRegister: false,
                                prerequisitesMet: false,
                                hasScheduleConflict: false,
                                hasPaymentIssues: false,
                                creditLimitExceeded: false,
                                errors: ['Internal error during eligibility check']
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check for schedule conflicts
     */
    CrossRoleValidationService.checkScheduleConflict = function (studentId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var conflictingCourses, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT oc1.id, oc1.subject_id, s1.subject_name\n                FROM enrollments e1\n                JOIN open_courses oc1 ON e1.course_id = oc1.id\n                JOIN subjects s1 ON oc1.subject_id = s1.id\n                JOIN open_courses oc2 ON oc2.id = $2\n                WHERE e1.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e1.status IN ('registered', 'enrolled')\n                AND oc1.schedule && oc2.schedule\n                AND oc1.id != oc2.id\n            ", [studentId, parseInt(courseId)])];
                    case 1:
                        conflictingCourses = _a.sent();
                        return [2 /*return*/, conflictingCourses.length > 0];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Schedule conflict check error:', error_6);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CrossRoleValidationService;
}());
exports.CrossRoleValidationService = CrossRoleValidationService;
