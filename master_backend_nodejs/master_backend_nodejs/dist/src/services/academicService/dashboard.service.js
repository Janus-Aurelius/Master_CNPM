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
exports.academicDashboardService = void 0;
// src/services/academicService/dashboard.service.ts
var databaseService_1 = require("../database/databaseService");
exports.academicDashboardService = {
    getDashboardStats: function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalSubjects, totalOpenCourses, totalPrograms, totalStudents, registeredStudents, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(*) as count FROM MONHOC")];
                    case 1:
                        totalSubjects = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(*) as count FROM DANHSACHMONHOCMO")];
                    case 2:
                        totalOpenCourses = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(*) as count FROM CHUONGTRINHHOC")];
                    case 3:
                        totalPrograms = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(*) as count FROM SINHVIEN")];
                    case 4:
                        totalStudents = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(DISTINCT MaSoSinhVien) as count FROM PHIEUDANGKY")];
                    case 5:
                        registeredStudents = _a.sent();
                        return [2 /*return*/, {
                                totalSubjects: (totalSubjects === null || totalSubjects === void 0 ? void 0 : totalSubjects.count) || 0,
                                totalOpenCourses: (totalOpenCourses === null || totalOpenCourses === void 0 ? void 0 : totalOpenCourses.count) || 0,
                                totalPrograms: (totalPrograms === null || totalPrograms === void 0 ? void 0 : totalPrograms.count) || 0,
                                pendingRequests: 0,
                                totalStudents: (totalStudents === null || totalStudents === void 0 ? void 0 : totalStudents.count) || 0,
                                registeredStudents: (registeredStudents === null || registeredStudents === void 0 ? void 0 : registeredStudents.count) || 0
                            }];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error fetching dashboard stats:', error_1);
                        throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    getSubjectStatistics: function () {
        return __awaiter(this, void 0, void 0, function () {
            var byDepartment, byCredits, totalCreditsResult, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT COALESCE(department, 'General') as department, COUNT(*) as count\n                FROM subjects GROUP BY department ORDER BY count DESC\n            ")];
                    case 1:
                        byDepartment = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT credits, COUNT(*) as count FROM subjects GROUP BY credits ORDER BY credits\n            ")];
                    case 2:
                        byCredits = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT SUM(credits) as total FROM subjects")];
                    case 3:
                        totalCreditsResult = _a.sent();
                        return [2 /*return*/, {
                                byDepartment: byDepartment || [],
                                byCredits: byCredits || [],
                                totalCreditsOffered: (totalCreditsResult === null || totalCreditsResult === void 0 ? void 0 : totalCreditsResult.total) || 0
                            }];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error fetching subject statistics:', error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    getCourseStatistics: function () {
        return __awaiter(this, void 0, void 0, function () {
            var bySemester, byStatus, totalEnrollmentsResult, avgEnrollmentRateResult, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT semester, COUNT(*) as count FROM open_courses GROUP BY semester ORDER BY semester DESC\n            ")];
                    case 1:
                        bySemester = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT status, COUNT(*) as count FROM open_courses GROUP BY status\n            ")];
                    case 2:
                        byStatus = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(*) as total FROM enrollments")];
                    case 3:
                        totalEnrollmentsResult = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT AVG(enrollment_rate) as avg FROM open_courses")];
                    case 4:
                        avgEnrollmentRateResult = _a.sent();
                        return [2 /*return*/, {
                                bySemester: bySemester || [],
                                byStatus: byStatus || [],
                                totalEnrollments: (totalEnrollmentsResult === null || totalEnrollmentsResult === void 0 ? void 0 : totalEnrollmentsResult.total) || 0,
                                averageEnrollmentRate: (avgEnrollmentRateResult === null || avgEnrollmentRateResult === void 0 ? void 0 : avgEnrollmentRateResult.avg) || 0
                            }];
                    case 5:
                        error_3 = _a.sent();
                        console.error('Error fetching course statistics:', error_3);
                        throw error_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    getRecentActivities: function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 5; }
            return __generator(this, function (_a) {
                try {
                    // Tạm thời trả về mảng rỗng vì chưa có bảng recent_activities
                    return [2 /*return*/, []];
                }
                catch (error) {
                    console.error('Error fetching recent activities:', error);
                    return [2 /*return*/, []];
                }
                return [2 /*return*/];
            });
        });
    },
    getStudentRequests: function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var logs, error_4;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    rl.id,\n                    rl.MaSoSinhVien as studentId,\n                    rl.TenSinhVien as studentName,\n                    rl.TenMonHoc as course,\n                    rl.LoaiYeuCau as requestType,\n                    rl.ThoiGianYeuCau as submittedDateTime\n                FROM REGISTRATION_LOG rl\n                ORDER BY rl.ThoiGianYeuCau DESC\n                LIMIT $1\n            ", [limit])];
                    case 1:
                        logs = _a.sent();
                        return [2 /*return*/, logs || []];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error fetching student requests:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
