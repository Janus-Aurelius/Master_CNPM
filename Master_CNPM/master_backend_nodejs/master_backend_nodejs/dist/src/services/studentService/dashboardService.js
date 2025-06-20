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
exports.dashboardService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.dashboardService = { getStudentOverview: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, enrollmentStats, gpa, availableOpenCourses, recentPayments, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    student_id as \"studentId\",\n                    name,\n                    email,\n                    phone,\n                    address,\n                    date_of_birth as \"dateOfBirth\",\n                    enrollment_year as \"enrollmentYear\",\n                    major,\n                    faculty,\n                    program,\n                    status\n                FROM students \n                WHERE student_id = $1\n            ", [studentId])];
                    case 1:
                        student = _a.sent();
                        if (!student)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    COUNT(*) as enrolled_count,\n                    SUM(s.credits) as total_credits\n                FROM enrollments e\n                JOIN subjects s ON e.course_id = s.id\n                WHERE e.student_id = $1 AND e.is_enrolled = true\n            ", [studentId])];
                    case 2:
                        enrollmentStats = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COALESCE(AVG(total_grade), 0) as gpa\n                FROM grades\n                WHERE student_id = $1\n            ", [studentId])];
                    case 3:
                        gpa = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    oc.id,\n                    s.id as \"courseId\",\n                    s.name as \"courseName\",\n                    s.lecturer,\n                    s.credits,\n                    oc.max_students as \"maxStudents\",\n                    oc.current_students as \"currentStudents\",\n                    oc.semester,\n                    oc.is_registration_open as \"isRegistrationOpen\"\n                FROM open_courses oc\n                JOIN subjects s ON oc.course_id = s.id\n                WHERE oc.is_registration_open = true\n                AND oc.current_students < oc.max_students\n                AND s.id NOT IN (\n                    SELECT course_id FROM enrollments \n                    WHERE student_id = $1 AND is_enrolled = true\n                )\n                ORDER BY s.name\n                LIMIT 10\n            ", [studentId])];
                    case 4:
                        availableOpenCourses = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    id,\n                    student_id as \"studentId\",\n                    amount,\n                    payment_date as \"paymentDate\",\n                    status,\n                    payment_method as \"paymentMethod\"\n                FROM payments\n                WHERE student_id = $1\n                ORDER BY payment_date DESC\n                LIMIT 5\n            ", [studentId])];
                    case 5:
                        recentPayments = _a.sent();
                        return [2 /*return*/, {
                                student: {
                                    studentId: student.studentId,
                                    fullName: student.name,
                                    dateOfBirth: student.dateOfBirth,
                                    gender: student.gender,
                                    hometown: student.hometown,
                                    districtId: student.districtId,
                                    priorityObjectId: student.priorityObjectId,
                                    majorId: student.major, email: student.email,
                                    phone: student.phone
                                },
                                enrolledCourses: (enrollmentStats === null || enrollmentStats === void 0 ? void 0 : enrollmentStats.enrolled_count) || 0,
                                totalCredits: (enrollmentStats === null || enrollmentStats === void 0 ? void 0 : enrollmentStats.total_credits) || 0, gpa: (gpa === null || gpa === void 0 ? void 0 : gpa.gpa) || 0,
                                availableOpenCourses: availableOpenCourses,
                                recentPayments: recentPayments
                            }];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error getting student overview:', error_1);
                        throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    }, getStudentSchedule: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, currentSemester, courses, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    student_id as \"studentId\",\n                    name,\n                    email,\n                    phone,\n                    address,\n                    date_of_birth as \"dateOfBirth\",\n                    enrollment_year as \"enrollmentYear\",\n                    major,\n                    faculty,\n                    program,\n                    status\n                FROM students \n                WHERE student_id = $1\n            ", [studentId])];
                    case 1:
                        student = _a.sent();
                        if (!student)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT semester \n                FROM enrollments \n                WHERE student_id = $1 \n                AND is_enrolled = true\n                ORDER BY semester DESC\n                LIMIT 1\n            ", [studentId])];
                    case 2:
                        currentSemester = _a.sent();
                        if (!currentSemester)
                            return [2 /*return*/, null]; // Get enrolled courses with schedule
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    s.id,\n                    s.name,\n                    s.credits,\n                    s.lecturer,\n                    json_agg(\n                        json_build_object(\n                            'day', c.day,\n                            'time', CASE \n                                WHEN c.session = '1' THEN '7:30-9:30'\n                                WHEN c.session = '2' THEN '9:30-11:30'\n                                WHEN c.session = '3' THEN '13:30-15:30'\n                                ELSE '15:30-17:30'\n                            END,\n                            'room', c.room\n                        )\n                    ) as schedule\n                FROM subjects s\n                JOIN enrollments e ON s.id = e.course_id\n                JOIN classes c ON s.id = c.subject_id\n                WHERE e.student_id = $1 \n                AND e.semester = $2\n                AND e.is_enrolled = true\n                GROUP BY s.id, s.name, s.credits, s.lecturer\n            ", [studentId, currentSemester.semester])];
                    case 3:
                        courses = _a.sent();
                        return [2 /*return*/, {
                                student: {
                                    studentId: student.studentId,
                                    fullName: student.name,
                                    dateOfBirth: student.dateOfBirth,
                                    gender: student.gender,
                                    hometown: student.hometown,
                                    districtId: student.districtId,
                                    priorityObjectId: student.priorityObjectId, majorId: student.major,
                                    email: student.email,
                                    phone: student.phone
                                },
                                semester: currentSemester.semester,
                                courses: courses.map(function (s) { return ({
                                    id: s.id,
                                    name: s.name,
                                    credit: s.credits,
                                    schedule: s.schedule,
                                    lecturer: s.lecturer
                                }); })
                            }];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error getting student schedule:', error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, updateStudentOverview: function (overview) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedOverview, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Update student info
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE students \n                SET \n                    name = $1,\n                    email = $2,\n                    phone = $3,\n                    updated_at = NOW()\n                WHERE student_id = $4\n            ", [
                                overview.student.fullName,
                                overview.student.email,
                                overview.student.phone,
                                overview.student.studentId
                            ])];
                    case 1:
                        // Update student info
                        _a.sent();
                        return [4 /*yield*/, this.getStudentOverview(overview.student.studentId)];
                    case 2:
                        updatedOverview = _a.sent();
                        if (!updatedOverview) {
                            throw new Error('Failed to get updated overview');
                        }
                        return [2 /*return*/, updatedOverview];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error updating student overview:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
