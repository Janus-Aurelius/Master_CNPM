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
exports.subjects = exports.subjectRegistrationService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.subjectRegistrationService = {
    getAvailableSubjects: function (semester) {
        return __awaiter(this, void 0, void 0, function () {
            var subjects_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    m.MaMonHoc as \"subjectId\",\n                    m.TenMonHoc as \"subjectName\",\n                    m.MaLoaiMon as \"subjectTypeId\",\n                    m.SoTiet as \"totalHours\",\n                    l.TenLoaiMon as \"subjectTypeName\",\n                    l.SoTietMotTC as \"hoursPerCredit\",\n                    l.SoTienMotTC as \"costPerCredit\"\n                FROM MONHOC m\n                JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon\n                JOIN DANHSACHMONHOCMO d ON m.MaMonHoc = d.MaMonHoc\n                WHERE d.MaHocKy = $1\n            ", [semester])];
                    case 1:
                        subjects_1 = _a.sent();
                        return [2 /*return*/, subjects_1];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in getAvailableSubjects:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getSubjectById: function (subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var subject, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    m.MaMonHoc as \"subjectId\",\n                    m.TenMonHoc as \"subjectName\",\n                    m.MaLoaiMon as \"subjectTypeId\",\n                    m.SoTiet as \"totalHours\",\n                    l.TenLoaiMon as \"subjectTypeName\",\n                    l.SoTietMotTC as \"hoursPerCredit\",\n                    l.SoTienMotTC as \"costPerCredit\"\n                FROM MONHOC m\n                JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon\n                WHERE m.MaMonHoc = $1\n            ", [subjectId])];
                    case 1:
                        subject = _a.sent();
                        return [2 /*return*/, subject];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting subject by id:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    checkPrerequisites: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var completedSubjects, completedSubjectIds_1, prerequisites, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT MaMonHoc\n                FROM DIEM\n                WHERE MaSinhVien = $1 AND DiemChu IN ('A', 'B', 'C', 'D')\n            ", [studentId])];
                    case 1:
                        completedSubjects = _a.sent();
                        completedSubjectIds_1 = completedSubjects.map(function (s) { return s.MaMonHoc; });
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT MaMonHocTruoc\n                FROM MONHOC_TRUOC\n                WHERE MaMonHoc = $1\n            ", [subjectId])];
                    case 2:
                        prerequisites = _a.sent();
                        return [2 /*return*/, prerequisites.every(function (prereq) { return completedSubjectIds_1.includes(prereq.MaMonHocTruoc); })];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error checking prerequisites:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    checkScheduleConflict: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var currentSemester, enrolledSchedules, newSubjectSchedule, _i, enrolledSchedules_1, enrolled, _a, newSubjectSchedule_1, newSchedule, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaHocKy\n                FROM PHIEUDANGKY\n                WHERE MaSinhVien = $1 AND TrangThai = 'active'\n                LIMIT 1\n            ", [studentId])];
                    case 1:
                        currentSemester = _b.sent();
                        if (!currentSemester)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT l.Thu, l.Tiet\n                FROM CT_PHIEUDANGKY c\n                JOIN LICH l ON c.MaMonHoc = l.MaMonHoc\n                WHERE c.MaPhieuDangKy IN (\n                    SELECT MaPhieuDangKy \n                    FROM PHIEUDANGKY \n                    WHERE MaSinhVien = $1 AND MaHocKy = $2\n                )\n            ", [studentId, currentSemester.MaHocKy])];
                    case 2:
                        enrolledSchedules = _b.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT Thu, Tiet\n                FROM LICH\n                WHERE MaMonHoc = $1\n            ", [subjectId])];
                    case 3:
                        newSubjectSchedule = _b.sent();
                        // Check for conflicts
                        for (_i = 0, enrolledSchedules_1 = enrolledSchedules; _i < enrolledSchedules_1.length; _i++) {
                            enrolled = enrolledSchedules_1[_i];
                            for (_a = 0, newSubjectSchedule_1 = newSubjectSchedule; _a < newSubjectSchedule_1.length; _a++) {
                                newSchedule = newSubjectSchedule_1[_a];
                                if (enrolled.Thu === newSchedule.Thu && enrolled.Tiet === newSchedule.Tiet) {
                                    return [2 /*return*/, true]; // Conflict found
                                }
                            }
                        }
                        return [2 /*return*/, false]; // No conflicts
                    case 4:
                        error_4 = _b.sent();
                        console.error('Error checking schedule conflict:', error_4);
                        throw error_4;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    checkCreditLimit: function (studentId, subjectId) {
        return __awaiter(this, void 0, void 0, function () {
            var currentSemester, currentCredits, newSubject, subjectType, subjectCredits, MAX_CREDITS_PER_SEMESTER, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaHocKy\n                FROM PHIEUDANGKY\n                WHERE MaSinhVien = $1 AND TrangThai = 'active'\n                LIMIT 1\n            ", [studentId])];
                    case 1:
                        currentSemester = _a.sent();
                        if (!currentSemester)
                            return [2 /*return*/, true];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COALESCE(SUM(CEIL(m.SoTiet / l.SoTietMotTC)), 0) as total_credits\n                FROM CT_PHIEUDANGKY c\n                JOIN MONHOC m ON c.MaMonHoc = m.MaMonHoc\n                JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon\n                WHERE c.MaPhieuDangKy IN (\n                    SELECT MaPhieuDangKy \n                    FROM PHIEUDANGKY \n                    WHERE MaSinhVien = $1 AND MaHocKy = $2\n                )\n            ", [studentId, currentSemester.MaHocKy])];
                    case 2:
                        currentCredits = _a.sent();
                        return [4 /*yield*/, this.getSubjectById(subjectId)];
                    case 3:
                        newSubject = _a.sent();
                        if (!newSubject)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT SoTietMotTC\n                FROM LOAIMON\n                WHERE MaLoaiMon = $1\n            ", [newSubject.subjectTypeId])];
                    case 4:
                        subjectType = _a.sent();
                        subjectCredits = Math.ceil(newSubject.totalHours / subjectType.SoTietMotTC);
                        MAX_CREDITS_PER_SEMESTER = 24;
                        return [2 /*return*/, (currentCredits.total_credits + subjectCredits) <= MAX_CREDITS_PER_SEMESTER];
                    case 5:
                        error_5 = _a.sent();
                        console.error('Error checking credit limit:', error_5);
                        throw error_5;
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    searchSubjects: function (query, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var subjects_2, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    m.MaMonHoc as \"subjectId\",\n                    m.TenMonHoc as \"subjectName\",\n                    m.MaLoaiMon as \"subjectTypeId\",\n                    m.SoTiet as \"totalHours\",\n                    l.TenLoaiMon as \"subjectTypeName\",\n                    l.SoTietMotTC as \"hoursPerCredit\",\n                    l.SoTienMotTC as \"costPerCredit\"\n                FROM MONHOC m\n                JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon\n                JOIN DANHSACHMONHOCMO d ON m.MaMonHoc = d.MaMonHoc\n                WHERE d.MaHocKy = $1 AND (\n                    LOWER(m.TenMonHoc) LIKE LOWER($2) OR \n                    LOWER(m.MaMonHoc) LIKE LOWER($2)\n                )\n            ", [semester, "%".concat(query.toLowerCase(), "%")])];
                    case 1:
                        subjects_2 = _a.sent();
                        return [2 /*return*/, subjects_2];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error searching subjects:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    enrollInSubject: function (studentId, subjectId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var existingEnrollment, enrollment, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query('SELECT * FROM CT_PHIEUDANGKY WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2', [studentId, subjectId])];
                    case 1:
                        existingEnrollment = _a.sent();
                        if (existingEnrollment.length > 0) {
                            throw new Error('Student is already enrolled in this subject');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO CT_PHIEUDANGKY (MaPhieuDangKy, MaMonHoc)\n                VALUES ($1, $2)\n                RETURNING *", [studentId, subjectId])];
                    case 2:
                        enrollment = _a.sent();
                        return [2 /*return*/, enrollment[0]];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Error in enrollInSubject:', error_7);
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
exports.subjects = [];
