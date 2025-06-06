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
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentService = exports.enrolledSubjects = exports.enrollments = void 0;
var subjectRegistrationService_1 = require("./subjectRegistrationService");
// Mock data for enrollments
var enrollments = [
    {
        id: '1',
        studentId: 'SV001',
        courseId: 'IT001',
        courseName: 'Nhập môn lập trình',
        semester: '2025-1',
        status: 'registered',
        credits: 4
    },
    {
        id: '2',
        studentId: 'SV001',
        courseId: 'IT002',
        courseName: 'Lập trình hướng đối tượng',
        semester: '2025-1',
        status: 'registered',
        credits: 4
    },
    {
        id: '3',
        studentId: 'SV002',
        courseId: 'IT003',
        courseName: 'Cấu trúc dữ liệu và giải thuật',
        semester: '2025-1',
        status: 'registered',
        credits: 4
    }
];
exports.enrollments = enrollments;
// Mock data for enrolled subjects with additional details
var enrolledSubjects = [
    {
        enrollment: enrollments[0],
        subjectDetails: subjectRegistrationService_1.subjects[0],
        grade: null,
        attendanceRate: 0
    },
    {
        enrollment: enrollments[1],
        subjectDetails: subjectRegistrationService_1.subjects[1],
        grade: null,
        attendanceRate: 0
    },
    {
        enrollment: enrollments[2],
        subjectDetails: subjectRegistrationService_1.subjects[2],
        grade: null,
        attendanceRate: 0
    }
];
exports.enrolledSubjects = enrolledSubjects;
exports.enrollmentService = {
    getEnrolledSubjects: function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Filter enrolled subjects by student ID and semester
                return [2 /*return*/, enrolledSubjects.filter(function (subject) {
                        return subject.enrollment.studentId === studentId &&
                            subject.enrollment.semester === semester;
                    })];
            });
        });
    },
    getSubjectDetails: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Find a specific enrolled subject for a student
                return [2 /*return*/, enrolledSubjects.find(function (subject) {
                        return subject.enrollment.studentId === studentId &&
                            subject.enrollment.courseId === subjectId;
                    }) || null];
            });
        });
    },
    enrollInSubject: function (enrollmentData) {
        return __awaiter(this, void 0, void 0, function () {
            var newEnrollment, subjectDetails;
            return __generator(this, function (_a) {
                newEnrollment = __assign(__assign({}, enrollmentData), { id: Math.random().toString(36).substr(2, 9), status: 'registered' });
                // Add to enrollments array
                enrollments.push(newEnrollment);
                subjectDetails = subjectRegistrationService_1.subjects.find(function (s) { return s.id === enrollmentData.courseId; });
                if (subjectDetails) {
                    // Create a new enrolled subject entry
                    enrolledSubjects.push({
                        enrollment: newEnrollment,
                        subjectDetails: subjectDetails,
                        grade: null,
                        attendanceRate: 0
                    });
                }
                return [2 /*return*/, newEnrollment];
            });
        });
    },
    cancelEnrollment: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var enrollmentIndex, enrolledSubjectIndex;
            return __generator(this, function (_a) {
                enrollmentIndex = enrollments.findIndex(function (e) { return e.studentId === studentId && e.courseId === subjectId; });
                if (enrollmentIndex === -1) {
                    throw new Error('Enrollment not found');
                }
                // Update status to dropped
                enrollments[enrollmentIndex].status = 'dropped';
                enrolledSubjectIndex = enrolledSubjects.findIndex(function (es) { return es.enrollment.studentId === studentId && es.enrollment.courseId === subjectId; });
                if (enrolledSubjectIndex !== -1) {
                    enrolledSubjects[enrolledSubjectIndex].enrollment.status = 'dropped';
                }
                return [2 /*return*/, true];
            });
        });
    },
    getEnrollmentHistory: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Get all enrollments for a student sorted by semester
                return [2 /*return*/, enrollments
                        .filter(function (e) { return e.studentId === studentId; })
                        .sort(function (a, b) { return new Date(b.semester).getTime() - new Date(a.semester).getTime(); })];
            });
        });
    },
    checkEnrollmentStatus: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var enrollment;
            return __generator(this, function (_a) {
                enrollment = enrollments.find(function (e) {
                    return e.studentId === studentId &&
                        e.courseId === subjectId;
                });
                return [2 /*return*/, (enrollment === null || enrollment === void 0 ? void 0 : enrollment.status) || 'not_enrolled'];
            });
        });
    }
};
