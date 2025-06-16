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
exports.enrolledSubjects = exports.enrollments = exports.enrollmentService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.enrollmentService = {
    getEnrolledSubjects: function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var enrolledSubjects_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    e.id,\n                    e.student_id as \"studentId\",\n                    e.course_id as \"courseId\",\n                    e.course_name as \"courseName\",\n                    e.semester,\n                    e.is_enrolled as \"isEnrolled\",\n                    e.credits,\n                    s.name as \"subjectName\",\n                    s.lecturer,\n                    s.credits as \"subjectCredits\",\n                    s.max_students as \"maxStudents\",\n                    s.current_students as \"currentStudents\",\n                    json_agg(\n                        json_build_object(\n                            'day', c.day,\n                            'session', c.session,\n                            'room', c.room\n                        )\n                    ) as schedule,\n                    g.midterm_grade as \"midtermGrade\",\n                    g.final_grade as \"finalGrade\",\n                    g.total_grade as \"totalGrade\",\n                    g.letter_grade as \"letterGrade\",\n                    COALESCE(a.attendance_rate, 0) as \"attendanceRate\"\n                FROM enrollments e\n                JOIN subjects s ON e.course_id = s.id\n                LEFT JOIN classes c ON s.id = c.subject_id\n                LEFT JOIN grades g ON e.student_id = g.student_id AND e.course_id = g.subject_id\n                LEFT JOIN attendance a ON e.student_id = a.student_id AND e.course_id = a.subject_id\n                WHERE e.student_id = $1 AND e.semester = $2\n                GROUP BY \n                    e.id, e.student_id, e.course_id, e.course_name, e.semester, \n                    e.is_enrolled, e.credits, s.name, s.lecturer, s.credits,\n                    s.max_students, s.current_students, g.midterm_grade, g.final_grade,\n                    g.total_grade, g.letter_grade, a.attendance_rate\n            ", [studentId, semester])];
                    case 1:
                        enrolledSubjects_1 = _a.sent();
                        return [2 /*return*/, enrolledSubjects_1.map(function (subject) { return ({
                                enrollment: {
                                    id: subject.id,
                                    studentId: subject.studentId,
                                    courseId: subject.courseId,
                                    courseName: subject.courseName,
                                    semester: subject.semester,
                                    isEnrolled: subject.isEnrolled,
                                    credits: subject.credits
                                },
                                subjectDetails: {
                                    id: subject.courseId,
                                    name: subject.subjectName,
                                    lecturer: subject.lecturer,
                                    credits: subject.subjectCredits,
                                    maxStudents: subject.maxStudents,
                                    currentStudents: subject.currentStudents,
                                    schedule: subject.schedule
                                },
                                grade: subject.midtermGrade ? {
                                    midterm: subject.midtermGrade,
                                    final: subject.finalGrade,
                                    total: subject.totalGrade,
                                    letter: subject.letterGrade
                                } : null,
                                attendanceRate: subject.attendanceRate
                            }); })];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting enrolled subjects:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getSubjectDetails: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    e.id,\n                    e.student_id as \"studentId\",\n                    e.course_id as \"courseId\",\n                    e.course_name as \"courseName\",\n                    e.semester,\n                    e.is_enrolled as \"isEnrolled\",\n                    e.credits,\n                    s.name as \"subjectName\",\n                    s.lecturer,\n                    s.credits as \"subjectCredits\",\n                    s.max_students as \"maxStudents\",\n                    s.current_students as \"currentStudents\",\n                    json_agg(\n                        json_build_object(\n                            'day', c.day,\n                            'session', c.session,\n                            'room', c.room\n                        )\n                    ) as schedule,\n                    g.midterm_grade as \"midtermGrade\",\n                    g.final_grade as \"finalGrade\",\n                    g.total_grade as \"totalGrade\",\n                    g.letter_grade as \"letterGrade\",\n                    COALESCE(a.attendance_rate, 0) as \"attendanceRate\"\n                FROM enrollments e\n                JOIN subjects s ON e.course_id = s.id\n                LEFT JOIN classes c ON s.id = c.subject_id\n                LEFT JOIN grades g ON e.student_id = g.student_id AND e.course_id = g.subject_id\n                LEFT JOIN attendance a ON e.student_id = a.student_id AND e.course_id = a.subject_id\n                WHERE e.student_id = $1 AND e.course_id = $2\n                GROUP BY \n                    e.id, e.student_id, e.course_id, e.course_name, e.semester, \n                    e.is_enrolled, e.credits, s.name, s.lecturer, s.credits,\n                    s.max_students, s.current_students, g.midterm_grade, g.final_grade,\n                    g.total_grade, g.letter_grade, a.attendance_rate\n            ", [studentId, subjectId])];
                    case 1:
                        subject = _a.sent();
                        if (!subject)
                            return [2 /*return*/, null];
                        return [2 /*return*/, {
                                enrollment: {
                                    id: subject.id,
                                    studentId: subject.studentId,
                                    courseId: subject.courseId,
                                    courseName: subject.courseName,
                                    semester: subject.semester,
                                    isEnrolled: subject.isEnrolled,
                                    credits: subject.credits
                                },
                                subjectDetails: {
                                    id: subject.courseId,
                                    name: subject.subjectName,
                                    lecturer: subject.lecturer,
                                    credits: subject.subjectCredits,
                                    maxStudents: subject.maxStudents,
                                    currentStudents: subject.currentStudents,
                                    schedule: subject.schedule
                                },
                                grade: subject.midtermGrade ? {
                                    midterm: subject.midtermGrade,
                                    final: subject.finalGrade,
                                    total: subject.totalGrade,
                                    letter: subject.letterGrade
                                } : null,
                                attendanceRate: subject.attendanceRate
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting subject details:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    enrollInSubject: function (enrollmentData) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, existingEnrollment, enrollment, student, subjectName, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    id,\n                    name,\n                    credits,\n                    max_students,\n                    current_students\n                FROM subjects\n                WHERE id = $1\n            ", [enrollmentData.courseId])];
                    case 1:
                        subject = _a.sent();
                        if (!subject) {
                            throw new Error('Subject not found');
                        }
                        if (subject.current_students >= subject.max_students) {
                            throw new Error('Subject is full');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT id\n                FROM enrollments\n                WHERE student_id = $1 AND course_id = $2\n            ", [enrollmentData.studentId, enrollmentData.courseId])];
                    case 2:
                        existingEnrollment = _a.sent();
                        if (existingEnrollment) {
                            throw new Error('Student is already enrolled in this subject');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                INSERT INTO enrollments (\n                    student_id,\n                    course_id,\n                    course_name,\n                    semester,\n                    is_enrolled,\n                    credits,\n                    created_at,\n                    updated_at\n                ) VALUES ($1, $2, $3, $4, true, $5, NOW(), NOW())\n                RETURNING \n                    id,\n                    student_id as \"studentId\",\n                    course_id as \"courseId\",\n                    course_name as \"courseName\",\n                    semester,\n                    is_enrolled as \"isEnrolled\",\n                    credits\n            ", [
                                enrollmentData.studentId,
                                enrollmentData.courseId,
                                enrollmentData.courseName,
                                enrollmentData.semester,
                                enrollmentData.credits
                            ])];
                    case 3:
                        enrollment = _a.sent();
                        // Update subject current students count
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE subjects\n                SET current_students = current_students + 1\n                WHERE id = $1\n            ", [enrollmentData.courseId])];
                    case 4:
                        // Update subject current students count
                        _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT HoTen FROM SINHVIEN WHERE MaSoSinhVien = $1", [enrollmentData.studentId])];
                    case 5:
                        student = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT TenMonHoc FROM MONHOC WHERE MaMonHoc = $1", [enrollmentData.courseId])];
                    case 6:
                        subjectName = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO REGISTRATION_LOG (MaSoSinhVien, TenSinhVien, MaMonHoc, TenMonHoc, LoaiYeuCau)\n                 VALUES ($1, $2, $3, $4, 'register')", [enrollmentData.studentId, (student === null || student === void 0 ? void 0 : student.HoTen) || '', enrollmentData.courseId, (subjectName === null || subjectName === void 0 ? void 0 : subjectName.TenMonHoc) || ''])];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, enrollment];
                    case 8:
                        error_3 = _a.sent();
                        console.error('Error enrolling in subject:', error_3);
                        throw error_3;
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
    cancelEnrollment: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var enrollment, student, subject, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT id\n                FROM enrollments\n                WHERE student_id = $1 AND course_id = $2\n            ", [studentId, subjectId])];
                    case 1:
                        enrollment = _a.sent();
                        if (!enrollment) {
                            throw new Error('Enrollment not found');
                        }
                        // Update enrollment status
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE enrollments\n                SET is_enrolled = false, updated_at = NOW()\n                WHERE id = $1\n            ", [enrollment.id])];
                    case 2:
                        // Update enrollment status
                        _a.sent();
                        // Update subject current students count
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE subjects\n                SET current_students = current_students - 1\n                WHERE id = $1\n            ", [subjectId])];
                    case 3:
                        // Update subject current students count
                        _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT HoTen FROM SINHVIEN WHERE MaSoSinhVien = $1", [studentId])];
                    case 4:
                        student = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT TenMonHoc FROM MONHOC WHERE MaMonHoc = $1", [subjectId])];
                    case 5:
                        subject = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO REGISTRATION_LOG (MaSoSinhVien, TenSinhVien, MaMonHoc, TenMonHoc, LoaiYeuCau)\n                 VALUES ($1, $2, $3, $4, 'cancel')", [studentId, (student === null || student === void 0 ? void 0 : student.HoTen) || '', subjectId, (subject === null || subject === void 0 ? void 0 : subject.TenMonHoc) || ''])];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7:
                        error_4 = _a.sent();
                        console.error('Error canceling enrollment:', error_4);
                        throw error_4;
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
    getEnrollmentHistory: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var enrollments_1, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    id,\n                    student_id as \"studentId\",\n                    course_id as \"courseId\",\n                    course_name as \"courseName\",\n                    semester,\n                    is_enrolled as \"isEnrolled\",\n                    credits\n                FROM enrollments\n                WHERE student_id = $1\n                ORDER BY semester DESC, created_at DESC\n            ", [studentId])];
                    case 1:
                        enrollments_1 = _a.sent();
                        return [2 /*return*/, enrollments_1];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting enrollment history:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    checkEnrollmentStatus: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var enrollment, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT is_enrolled\n                FROM enrollments\n                WHERE student_id = $1 AND course_id = $2\n            ", [studentId, subjectId])];
                    case 1:
                        enrollment = _a.sent();
                        return [2 /*return*/, (enrollment === null || enrollment === void 0 ? void 0 : enrollment.is_enrolled) || false];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error checking enrollment status:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
exports.enrollments = [];
exports.enrolledSubjects = [];
