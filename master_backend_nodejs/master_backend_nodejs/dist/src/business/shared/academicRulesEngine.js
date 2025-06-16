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
exports.AcademicRulesEngine = void 0;
// src/business/shared/academicRulesEngine.ts
var subject_business_1 = require("../academicBusiness/subject.business");
var databaseService_1 = require("../../services/database/databaseService");
var AcademicRulesEngine = /** @class */ (function () {
    function AcademicRulesEngine() {
    }
    /**
     * Check if student has completed all prerequisites for a course
     */ AcademicRulesEngine.checkPrerequisites = function (studentId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, courseInfo, completedCourses, prerequisites, missingPrerequisites, details, _loop_1, _i, prerequisites_1, prereqCode, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, subject_business_1.SubjectBusiness.getAllSubjects()];
                    case 1:
                        subjects = _a.sent();
                        courseInfo = subjects.find(function (subject) { return subject.subjectId === courseId; });
                        if (!courseInfo) {
                            return [2 /*return*/, {
                                    isMet: false,
                                    missingPrerequisites: [],
                                    details: ["Course ".concat(courseId, " not found")]
                                }];
                        }
                        return [4 /*yield*/, this.getStudentCompletedCourses(studentId)];
                    case 2:
                        completedCourses = _a.sent();
                        prerequisites = courseInfo.prerequisiteSubjects || [];
                        missingPrerequisites = [];
                        details = [];
                        _loop_1 = function (prereqCode) {
                            var completed = completedCourses.find(function (course) {
                                return course.courseId === prereqCode &&
                                    course.grade &&
                                    _this.isPassingGrade(course.grade);
                            });
                            if (!completed) {
                                missingPrerequisites.push(prereqCode);
                                details.push("Missing prerequisite: ".concat(prereqCode));
                            }
                        };
                        for (_i = 0, prerequisites_1 = prerequisites; _i < prerequisites_1.length; _i++) {
                            prereqCode = prerequisites_1[_i];
                            _loop_1(prereqCode);
                        }
                        return [2 /*return*/, {
                                isMet: missingPrerequisites.length === 0,
                                missingPrerequisites: missingPrerequisites,
                                details: details.length > 0 ? details : ['All prerequisites met']
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error checking prerequisites:', error_1);
                        return [2 /*return*/, {
                                isMet: false,
                                missingPrerequisites: [],
                                details: ['Error checking prerequisites']
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check student's academic eligibility for course registration
     */
    AcademicRulesEngine.checkAcademicEligibility = function (studentId_1) {
        return __awaiter(this, arguments, void 0, function (studentId, additionalCredits) {
            var currentCredits, studentGPA, academicStanding, maxCreditsPerSemester, minGPAForRegistration, totalCreditsAfterRegistration, remainingCredits, error_2;
            if (additionalCredits === void 0) { additionalCredits = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.getCurrentSemesterCredits(studentId)];
                    case 1:
                        currentCredits = _a.sent();
                        return [4 /*yield*/, this.getStudentGPA(studentId)];
                    case 2:
                        studentGPA = _a.sent();
                        return [4 /*yield*/, this.getAcademicStanding(studentId)];
                    case 3:
                        academicStanding = _a.sent();
                        maxCreditsPerSemester = 24;
                        minGPAForRegistration = 2.0;
                        totalCreditsAfterRegistration = currentCredits + additionalCredits;
                        remainingCredits = maxCreditsPerSemester - currentCredits;
                        return [2 /*return*/, {
                                canEnroll: totalCreditsAfterRegistration <= maxCreditsPerSemester &&
                                    studentGPA >= minGPAForRegistration &&
                                    academicStanding !== 'SUSPENSION',
                                creditLimitStatus: {
                                    currentCredits: currentCredits,
                                    maxCredits: maxCreditsPerSemester,
                                    remainingCredits: Math.max(0, remainingCredits)
                                },
                                academicStanding: academicStanding,
                                gpaRequirement: {
                                    currentGPA: studentGPA,
                                    minRequiredGPA: minGPAForRegistration,
                                    meetsRequirement: studentGPA >= minGPAForRegistration
                                }
                            }];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error checking academic eligibility:', error_2);
                        return [2 /*return*/, {
                                canEnroll: false,
                                creditLimitStatus: {
                                    currentCredits: 0,
                                    maxCredits: 24,
                                    remainingCredits: 0
                                },
                                academicStanding: 'SUSPENSION',
                                gpaRequirement: {
                                    currentGPA: 0,
                                    minRequiredGPA: 2.0,
                                    meetsRequirement: false
                                }
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check for schedule conflicts with existing enrolled courses
     */
    AcademicRulesEngine.checkScheduleConflicts = function (studentId, courseId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var enrolledCourses, newCourseSchedule, conflictingCourses, _i, enrolledCourses_1, enrolledCourse, enrolledSchedule, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, this.getStudentEnrolledCourses(studentId, semester)];
                    case 1:
                        enrolledCourses = _a.sent();
                        return [4 /*yield*/, this.getCourseSchedule(courseId, semester)];
                    case 2:
                        newCourseSchedule = _a.sent();
                        if (!newCourseSchedule) {
                            return [2 /*return*/, {
                                    hasConflict: false,
                                    conflictingCourses: []
                                }];
                        }
                        conflictingCourses = [];
                        _i = 0, enrolledCourses_1 = enrolledCourses;
                        _a.label = 3;
                    case 3:
                        if (!(_i < enrolledCourses_1.length)) return [3 /*break*/, 6];
                        enrolledCourse = enrolledCourses_1[_i];
                        return [4 /*yield*/, this.getCourseSchedule(enrolledCourse.courseId, semester)];
                    case 4:
                        enrolledSchedule = _a.sent();
                        if (enrolledSchedule && this.hasTimeConflict(newCourseSchedule, enrolledSchedule)) {
                            conflictingCourses.push({
                                courseId: enrolledCourse.courseId,
                                courseName: enrolledCourse.courseName,
                                timeSlot: enrolledSchedule.timeSlot,
                                room: enrolledSchedule.room
                            });
                        }
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, {
                            hasConflict: conflictingCourses.length > 0,
                            conflictingCourses: conflictingCourses
                        }];
                    case 7:
                        error_3 = _a.sent();
                        console.error('Error checking schedule conflicts:', error_3);
                        return [2 /*return*/, {
                                hasConflict: true,
                                conflictingCourses: []
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }; // Helper methods
    AcademicRulesEngine.getStudentCompletedCourses = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var completedCourses, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    e.course_id,\n                    e.course_name,\n                    e.letter_grade as grade,\n                    e.total_grade,\n                    oc.subject_code as courseId,\n                    s.subject_name as courseName\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e.status = 'completed'\n                AND e.total_grade >= 5.0\n                ORDER BY e.created_at DESC\n            ", [studentId])];
                    case 1:
                        completedCourses = _a.sent();
                        return [2 /*return*/, completedCourses.map(function (course) { return ({
                                courseId: course.courseId,
                                courseName: course.courseName,
                                grade: course.grade || 'N/A'
                            }); })];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error fetching completed courses:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicRulesEngine.getCurrentSemesterCredits = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var currentSemester, semester, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT setting_value FROM system_settings WHERE setting_key = 'current_semester'\n            ")];
                    case 1:
                        currentSemester = _a.sent();
                        semester = (currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.setting_value) || '2024-1';
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COALESCE(SUM(e.credits), 0) as total_credits\n                FROM enrollments e\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e.semester = $2\n                AND e.status IN ('registered', 'enrolled')\n            ", [studentId, semester])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, parseInt((result === null || result === void 0 ? void 0 : result.total_credits) || '0')];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error fetching current semester credits:', error_5);
                        return [2 /*return*/, 0];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AcademicRulesEngine.getStudentGPA = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    COALESCE(AVG(e.total_grade), 0) as gpa,\n                    COUNT(e.id) as completed_courses\n                FROM enrollments e\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e.status = 'completed'\n                AND e.total_grade IS NOT NULL\n                AND e.total_grade >= 0\n            ", [studentId])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, parseFloat((result === null || result === void 0 ? void 0 : result.gpa) || '0')];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error fetching student GPA:', error_6);
                        return [2 /*return*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicRulesEngine.getAcademicStanding = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var gpa, standingRules, probationThreshold, suspensionThreshold, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getStudentGPA(studentId)];
                    case 1:
                        gpa = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM academic_standing_rules WHERE status = 'active'\n            ")];
                    case 2:
                        standingRules = _a.sent();
                        probationThreshold = (standingRules === null || standingRules === void 0 ? void 0 : standingRules.probation_gpa) || 2.0;
                        suspensionThreshold = (standingRules === null || standingRules === void 0 ? void 0 : standingRules.suspension_gpa) || 1.0;
                        if (gpa < suspensionThreshold) {
                            return [2 /*return*/, 'SUSPENSION'];
                        }
                        else if (gpa < probationThreshold) {
                            return [2 /*return*/, 'PROBATION'];
                        }
                        else {
                            return [2 /*return*/, 'GOOD'];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Error determining academic standing:', error_7);
                        return [2 /*return*/, 'GOOD']; // Default to good standing on error
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AcademicRulesEngine.getStudentEnrolledCourses = function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var enrolledCourses, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    e.course_id,\n                    e.course_name,\n                    oc.subject_code as courseId,\n                    s.subject_name as courseName,\n                    e.is_enrolled\n                FROM enrollments e\n                JOIN open_courses oc ON e.course_id = oc.id\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e.semester = $2\n                AND e.is_enrolled = true\n                ORDER BY oc.subject_code\n            ", [studentId, semester])];
                    case 1:
                        enrolledCourses = _a.sent();
                        return [2 /*return*/, enrolledCourses.map(function (course) { return ({
                                courseId: course.courseId,
                                courseName: course.courseName
                            }); })];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error fetching enrolled courses:', error_8);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicRulesEngine.getCourseSchedule = function (courseId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var schedule, scheduleData, parts, dayOfWeek, timeRange, _a, startTime, endTime, error_9;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    oc.schedule,\n                    oc.room,\n                    s.subject_name\n                FROM open_courses oc\n                JOIN subjects s ON oc.subject_code = s.subject_code\n                WHERE oc.id = $1 AND oc.semester = $2\n            ", [parseInt(courseId), semester])];
                    case 1:
                        schedule = _b.sent();
                        if (!schedule) {
                            return [2 /*return*/, null];
                        }
                        scheduleData = schedule.schedule || '';
                        parts = scheduleData.split(' ');
                        dayOfWeek = parts[0] || 'UNKNOWN';
                        timeRange = parts[1] || '00:00-00:00';
                        _a = timeRange.split('-'), startTime = _a[0], endTime = _a[1];
                        return [2 /*return*/, {
                                timeSlot: scheduleData,
                                room: schedule.room,
                                dayOfWeek: dayOfWeek,
                                startTime: startTime || '00:00',
                                endTime: endTime || '00:00'
                            }];
                    case 2:
                        error_9 = _b.sent();
                        console.error('Error fetching course schedule:', error_9);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicRulesEngine.hasTimeConflict = function (schedule1, schedule2) {
        // TODO: Implement time conflict logic
        // For now, simple string comparison
        return schedule1.timeSlot === schedule2.timeSlot;
    };
    AcademicRulesEngine.isPassingGrade = function (grade) {
        var passingGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D'];
        return passingGrades.includes(grade);
    };
    return AcademicRulesEngine;
}());
exports.AcademicRulesEngine = AcademicRulesEngine;
