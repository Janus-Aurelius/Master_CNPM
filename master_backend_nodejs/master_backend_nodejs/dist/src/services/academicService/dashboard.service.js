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
var database_1 = require("../../config/database");
exports.academicDashboardService = {
    getDashboardStats: function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalSubjectsResult, totalOpenCoursesResult, totalProgramsResult, totalStudentsResult, registeredStudentsResult, error_1;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, database_1.db.query("SELECT COUNT(*) as count FROM MONHOC")];
                    case 1:
                        totalSubjectsResult = _f.sent();
                        return [4 /*yield*/, database_1.db.query("SELECT COUNT(*) as count FROM DANHSACHMONHOCMO")];
                    case 2:
                        totalOpenCoursesResult = _f.sent();
                        return [4 /*yield*/, database_1.db.query("SELECT COUNT(*) as count FROM CHUONGTRINHHOC")];
                    case 3:
                        totalProgramsResult = _f.sent();
                        return [4 /*yield*/, database_1.db.query("SELECT COUNT(*) as count FROM SINHVIEN")];
                    case 4:
                        totalStudentsResult = _f.sent();
                        return [4 /*yield*/, database_1.db.query("SELECT COUNT(DISTINCT MaSoSinhVien) as count FROM PHIEUDANGKY")];
                    case 5:
                        registeredStudentsResult = _f.sent();
                        return [2 /*return*/, {
                                totalSubjects: ((_a = totalSubjectsResult.rows[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                                totalOpenCourses: ((_b = totalOpenCoursesResult.rows[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                                totalPrograms: ((_c = totalProgramsResult.rows[0]) === null || _c === void 0 ? void 0 : _c.count) || 0,
                                pendingRequests: 0,
                                totalStudents: ((_d = totalStudentsResult.rows[0]) === null || _d === void 0 ? void 0 : _d.count) || 0,
                                registeredStudents: ((_e = registeredStudentsResult.rows[0]) === null || _e === void 0 ? void 0 : _e.count) || 0
                            }];
                    case 6:
                        error_1 = _f.sent();
                        console.error('Error fetching dashboard stats:', error_1);
                        throw error_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    getStudentRequests: function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var result, error_2;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    id,\n                    MaSoSinhVien as studentid,\n                    TenSinhVien as studentname,\n                    TenMonHoc as course,\n                    LoaiYeuCau as requesttype,\n                    TO_CHAR(ThoiGianYeuCau, 'DD/MM/YYYY HH24:MI') as submitteddatetime\n                FROM REGISTRATION_LOG\n                ORDER BY ThoiGianYeuCau DESC\n                LIMIT $1\n            ", [limit])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows || []];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error fetching student requests:', error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getSubjectStatistics: function () {
        return __awaiter(this, void 0, void 0, function () {
            var byDepartmentResult, byCreditstResult, totalCreditsResult, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1.db.query("\n                SELECT COALESCE(k.TenKhoa, 'Chung') as department, COUNT(*) as count\n                FROM MONHOC mh\n                LEFT JOIN NGANHHOC nh ON mh.MaNganh = nh.MaNganh\n                LEFT JOIN KHOA k ON nh.MaKhoa = k.MaKhoa\n                GROUP BY k.TenKhoa \n                ORDER BY count DESC\n            ")];
                    case 1:
                        byDepartmentResult = _b.sent();
                        return [4 /*yield*/, database_1.db.query("\n                SELECT SoTinChi as credits, COUNT(*) as count \n                FROM MONHOC \n                GROUP BY SoTinChi \n                ORDER BY SoTinChi\n            ")];
                    case 2:
                        byCreditstResult = _b.sent();
                        return [4 /*yield*/, database_1.db.query("SELECT SUM(SoTinChi) as total FROM MONHOC")];
                    case 3:
                        totalCreditsResult = _b.sent();
                        return [2 /*return*/, {
                                byDepartment: byDepartmentResult.rows || [],
                                byCredits: byCreditstResult.rows || [],
                                totalCreditsOffered: ((_a = totalCreditsResult.rows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0
                            }];
                    case 4:
                        error_3 = _b.sent();
                        console.error('Error fetching subject statistics:', error_3);
                        throw error_3;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    getCourseStatistics: function () {
        return __awaiter(this, void 0, void 0, function () {
            var bySemesterResult, byStatusResult, totalEnrollmentsResult, avgEnrollmentRateResult, error_4;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, database_1.db.query("\n                SELECT dmmo.MaHocKy as semester, COUNT(*) as count \n                FROM DANHSACHMONHOCMO dmmo\n                GROUP BY dmmo.MaHocKy \n                ORDER BY dmmo.MaHocKy DESC\n            ")];
                    case 1:
                        bySemesterResult = _c.sent();
                        return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    CASE \n                        WHEN dmmo.SoSVDaDangKy >= dmmo.SiSoToiThieu THEN '\u0110\u00E3 \u0111\u1EE7 s\u0129 s\u1ED1'\n                        ELSE 'Ch\u01B0a \u0111\u1EE7 s\u0129 s\u1ED1'\n                    END as status,\n                    COUNT(*) as count\n                FROM DANHSACHMONHOCMO dmmo\n                GROUP BY CASE \n                    WHEN dmmo.SoSVDaDangKy >= dmmo.SiSoToiThieu THEN '\u0110\u00E3 \u0111\u1EE7 s\u0129 s\u1ED1'\n                    ELSE 'Ch\u01B0a \u0111\u1EE7 s\u0129 s\u1ED1'\n                END\n            ")];
                    case 2:
                        byStatusResult = _c.sent();
                        return [4 /*yield*/, database_1.db.query("SELECT COUNT(*) as total FROM CT_PHIEUDANGKY")];
                    case 3:
                        totalEnrollmentsResult = _c.sent();
                        return [4 /*yield*/, database_1.db.query("\n                SELECT AVG(\n                    CASE \n                        WHEN dmmo.SiSoToiDa > 0 THEN (dmmo.SoSVDaDangKy::float / dmmo.SiSoToiDa) * 100\n                        ELSE 0 \n                    END\n                ) as avg \n                FROM DANHSACHMONHOCMO dmmo\n            ")];
                    case 4:
                        avgEnrollmentRateResult = _c.sent();
                        return [2 /*return*/, {
                                bySemester: bySemesterResult.rows || [],
                                byStatus: byStatusResult.rows || [],
                                totalEnrollments: ((_a = totalEnrollmentsResult.rows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                                averageEnrollmentRate: parseFloat((_b = avgEnrollmentRateResult.rows[0]) === null || _b === void 0 ? void 0 : _b.avg) || 0
                            }];
                    case 5:
                        error_4 = _c.sent();
                        console.error('Error fetching course statistics:', error_4);
                        throw error_4;
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    getRecentActivities: function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var result, error_5;
            if (limit === void 0) { limit = 5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    id::text,\n                    CASE \n                        WHEN LoaiYeuCau = 'register' THEN 'subject_registration'\n                        WHEN LoaiYeuCau = 'cancel' THEN 'subject_cancellation'\n                        ELSE 'other'\n                    END as type,\n                    CASE \n                        WHEN LoaiYeuCau = 'register' THEN TenSinhVien || ' \u0111\u00E3 \u0111\u0103ng k\u00FD m\u00F4n ' || TenMonHoc\n                        WHEN LoaiYeuCau = 'cancel' THEN TenSinhVien || ' \u0111\u00E3 h\u1EE7y \u0111\u0103ng k\u00FD m\u00F4n ' || TenMonHoc\n                        ELSE 'Ho\u1EA1t \u0111\u1ED9ng kh\u00E1c'\n                    END as description,\n                    TO_CHAR(ThoiGianYeuCau, 'YYYY-MM-DD\"T\"HH24:MI:SS') as timestamp,\n                    TenSinhVien as user\n                FROM REGISTRATION_LOG\n                ORDER BY ThoiGianYeuCau DESC\n                LIMIT $1\n            ", [limit])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows || []];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error fetching recent activities:', error_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
