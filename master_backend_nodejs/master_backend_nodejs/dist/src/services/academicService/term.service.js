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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.semesterService = void 0;
var database_1 = require("../../config/database");
exports.semesterService = {
    getAllSemesters: function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    MaHocKy as semesterId,\n                    HocKyThu as termNumber,\n                    ThoiGianBatDau as startDate,\n                    ThoiGianKetThuc as endDate,\n                    TrangThaiHocKy as status,\n                    NamHoc as academicYear,\n                    ThoiHanDongHP as feeDeadline\n                FROM HOCKYNAMHOC\n                ORDER BY NamHoc DESC, HocKyThu DESC            ")];
                case 1:
                    result = _a.sent();
                    console.log('Raw semester query result:', result.rows); // Debug log
                    return [2 /*return*/, result.rows.map(function (row) {
                            console.log('Processing semester row:', row); // Debug log
                            return {
                                semesterId: row.semesterid,
                                termNumber: row.termnumber,
                                startDate: row.startdate,
                                endDate: row.enddate,
                                status: row.status,
                                academicYear: row.academicyear,
                                feeDeadline: row.feedeadline
                            };
                        })];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching semesters:', error_1);
                    throw new Error('Failed to fetch semesters');
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getSemesterById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result, row, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    MaHocKy as semesterId,\n                    HocKyThu as termNumber,\n                    ThoiGianBatDau as startDate,\n                    ThoiGianKetThuc as endDate,\n                    TrangThaiHocKy as status,\n                    NamHoc as academicYear,\n                    ThoiHanDongHP as feeDeadline\n                FROM HOCKYNAMHOC\n                WHERE MaHocKy = $1\n            ", [id])];
                case 1:
                    result = _a.sent();
                    if (result.rows.length === 0)
                        return [2 /*return*/, null];
                    row = result.rows[0];
                    return [2 /*return*/, {
                            semesterId: row.semesterid,
                            termNumber: row.termnumber,
                            startDate: row.startdate,
                            endDate: row.enddate,
                            status: row.status,
                            academicYear: row.academicyear,
                            feeDeadline: row.feedeadline
                        }];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching semester by ID:', error_2);
                    throw new Error('Failed to fetch semester');
                case 3: return [2 /*return*/];
            }
        });
    }); }, createSemester: function (semester) { return __awaiter(void 0, void 0, void 0, function () {
        var semesterData, result, row, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    semesterData = __assign(__assign({}, semester), { status: 'Đóng' });
                    return [4 /*yield*/, database_1.db.query("INSERT INTO HOCKYNAMHOC (MaHocKy, HocKyThu, ThoiGianBatDau, ThoiGianKetThuc, TrangThaiHocKy, NamHoc, ThoiHanDongHP) \n                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [semesterData.semesterId, semesterData.termNumber, semesterData.startDate, semesterData.endDate, semesterData.status, semesterData.academicYear, semesterData.feeDeadline])];
                case 1:
                    result = _a.sent();
                    row = result.rows[0];
                    return [2 /*return*/, {
                            semesterId: row.mahocky,
                            termNumber: row.hockyth,
                            startDate: row.thoigianbatdau,
                            endDate: row.thoigianketthuc,
                            status: row.trangthanhocky,
                            academicYear: row.namhoc,
                            feeDeadline: row.thoihandonghp
                        }];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error in createSemester:', error_3);
                    throw new Error('Failed to create semester');
                case 3: return [2 /*return*/];
            }
        });
    }); }, updateSemester: function (id, semester) { return __awaiter(void 0, void 0, void 0, function () {
        var client, closeResult, systemResult, currentResult, updateFields, values, paramIndex, result, row, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.db.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 10, 12, 13]);
                    return [4 /*yield*/, client.query('BEGIN')];
                case 3:
                    _a.sent(); // If changing status to "Đang diễn ra", update current semester in ACADEMIC_SETTINGS
                    if (!(semester.status === 'Đang diễn ra')) return [3 /*break*/, 6];
                    console.log("\uD83D\uDD04 Setting semester ".concat(id, " as current (\u0110ang di\u1EC5n ra)"));
                    return [4 /*yield*/, client.query("UPDATE HOCKYNAMHOC SET TrangThaiHocKy = '\u0110\u00F3ng' \n                     WHERE TrangThaiHocKy = '\u0110ang di\u1EC5n ra' AND MaHocKy != $1", [id])];
                case 4:
                    closeResult = _a.sent();
                    console.log("\uD83D\uDCDD Closed ".concat(closeResult.rowCount, " other active semesters"));
                    return [4 /*yield*/, client.query("UPDATE ACADEMIC_SETTINGS SET current_semester = $1 WHERE id = 1", [id])];
                case 5:
                    systemResult = _a.sent();
                    console.log("\u2699\uFE0F Updated ACADEMIC_SETTINGS: ".concat(systemResult.rowCount, " rows affected"));
                    _a.label = 6;
                case 6: return [4 /*yield*/, client.query("SELECT TrangThaiHocKy FROM HOCKYNAMHOC WHERE MaHocKy = $1", [id])];
                case 7:
                    currentResult = _a.sent();
                    if (currentResult.rows.length > 0 &&
                        currentResult.rows[0].trangthanhocky === 'Đang diễn ra' &&
                        semester.status !== 'Đang diễn ra') {
                        throw new Error('Không thể thay đổi trạng thái của học kỳ đang diễn ra');
                    } // Build UPDATE query dynamically based on provided fields
                    updateFields = [];
                    values = [id];
                    paramIndex = 2;
                    if (semester.startDate !== undefined) {
                        updateFields.push("ThoiGianBatDau = $".concat(paramIndex));
                        values.push(semester.startDate);
                        paramIndex++;
                    }
                    if (semester.endDate !== undefined) {
                        updateFields.push("ThoiGianKetThuc = $".concat(paramIndex));
                        values.push(semester.endDate);
                        paramIndex++;
                    }
                    if (semester.status !== undefined) {
                        updateFields.push("TrangThaiHocKy = $".concat(paramIndex));
                        values.push(semester.status);
                        paramIndex++;
                    }
                    if (semester.feeDeadline !== undefined) {
                        updateFields.push("ThoiHanDongHP = $".concat(paramIndex));
                        values.push(semester.feeDeadline);
                        paramIndex++;
                    }
                    if (updateFields.length === 0) {
                        throw new Error('No fields to update');
                    }
                    return [4 /*yield*/, client.query("UPDATE HOCKYNAMHOC SET ".concat(updateFields.join(', '), " WHERE MaHocKy = $1 RETURNING *"), values)];
                case 8:
                    result = _a.sent();
                    if (result.rows.length === 0) {
                        throw new Error('Semester not found');
                    }
                    return [4 /*yield*/, client.query('COMMIT')];
                case 9:
                    _a.sent();
                    row = result.rows[0];
                    return [2 /*return*/, {
                            semesterId: row.mahocky,
                            termNumber: row.hockyth,
                            startDate: row.thoigianbatdau,
                            endDate: row.thoigianketthuc,
                            status: row.trangthanhocky,
                            academicYear: row.namhoc,
                            feeDeadline: row.thoihandonghp
                        }];
                case 10:
                    error_4 = _a.sent();
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 11:
                    _a.sent();
                    console.error('Error in updateSemester:', error_4);
                    throw error_4;
                case 12:
                    client.release();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); }, deleteSemester: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var registrationCheck, courseCheck, curriculumCheck, result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, database_1.db.query("SELECT COUNT(*) as count FROM PHIEUDANGKY WHERE MaHocKy = $1", [id])];
                case 1:
                    registrationCheck = _a.sent();
                    if (registrationCheck.rows[0].count > 0) {
                        throw new Error('Không thể xóa học kỳ đã có phiếu đăng ký');
                    }
                    return [4 /*yield*/, database_1.db.query("SELECT COUNT(*) as count FROM DANHSACHMONHOCMO WHERE MaHocKy = $1", [id])];
                case 2:
                    courseCheck = _a.sent();
                    if (!(courseCheck.rows[0].count > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, database_1.db.query('DELETE FROM DANHSACHMONHOCMO WHERE MaHocKy = $1', [id])];
                case 3:
                    _a.sent();
                    console.log("Deleted ".concat(courseCheck.rows[0].count, " courses from DANHSACHMONHOCMO for semester ").concat(id));
                    _a.label = 4;
                case 4: return [4 /*yield*/, database_1.db.query("SELECT COUNT(*) as count FROM CHUONGTRINHHOC WHERE MaHocKy = $1", [id])];
                case 5:
                    curriculumCheck = _a.sent();
                    if (!(curriculumCheck.rows[0].count > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, database_1.db.query('DELETE FROM CHUONGTRINHHOC WHERE MaHocKy = $1', [id])];
                case 6:
                    _a.sent();
                    console.log("Deleted ".concat(curriculumCheck.rows[0].count, " curriculum records from CHUONGTRINHHOC for semester ").concat(id));
                    _a.label = 7;
                case 7: return [4 /*yield*/, database_1.db.query('DELETE FROM HOCKYNAMHOC WHERE MaHocKy = $1', [id])];
                case 8:
                    result = _a.sent();
                    if (result.rowCount === 0) {
                        throw new Error('Semester not found');
                    }
                    console.log("Successfully deleted semester ".concat(id, " and all related records"));
                    return [3 /*break*/, 10];
                case 9:
                    error_5 = _a.sent();
                    console.error('Error in deleteSemester:', error_5);
                    if (error_5 instanceof Error &&
                        (error_5.message === 'Không thể xóa học kỳ đã có phiếu đăng ký' ||
                            error_5.message === 'Semester not found')) {
                        throw error_5;
                    }
                    throw new Error('Failed to delete semester');
                case 10: return [2 /*return*/];
            }
        });
    }); },
    searchSemesters: function (searchTerm) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    MaHocKy as semesterId,\n                    HocKyThu as termNumber,\n                    ThoiGianBatDau as startDate,\n                    ThoiGianKetThuc as endDate,\n                    TrangThaiHocKy as status,\n                    NamHoc as academicYear,\n                    ThoiHanDongHP as feeDeadline\n                FROM HOCKYNAMHOC\n                WHERE MaHocKy ILIKE $1 OR TrangThaiHocKy ILIKE $1 OR CAST(NamHoc AS TEXT) ILIKE $1\n                ORDER BY NamHoc DESC, HocKyThu DESC\n            ", ["%".concat(searchTerm, "%")])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows.map(function (row) { return ({
                            semesterId: row.semesterid,
                            termNumber: row.termnumber,
                            startDate: row.startdate,
                            endDate: row.enddate,
                            status: row.status,
                            academicYear: row.academicyear,
                            feeDeadline: row.feedeadline
                        }); })];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error searching semesters:', error_6);
                    throw new Error('Failed to search semesters');
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getSemestersByYear: function (academicYear) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    MaHocKy as semesterId,\n                    HocKyThu as termNumber,\n                    ThoiGianBatDau as startDate,\n                    ThoiGianKetThuc as endDate,\n                    TrangThaiHocKy as status,\n                    NamHoc as academicYear,\n                    ThoiHanDongHP as feeDeadline\n                FROM HOCKYNAMHOC\n                WHERE NamHoc = $1\n                ORDER BY HocKyThu DESC\n            ", [academicYear])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows.map(function (row) { return ({
                            semesterId: row.semesterid,
                            termNumber: row.termnumber,
                            startDate: row.startdate,
                            endDate: row.enddate,
                            status: row.status,
                            academicYear: row.academicyear,
                            feeDeadline: row.feedeadline
                        }); })];
                case 2:
                    error_7 = _a.sent();
                    console.error('Error fetching semesters by year:', error_7);
                    throw new Error('Failed to fetch semesters by year');
                case 3: return [2 /*return*/];
            }
        });
    }); },
    updateSemesterStatus: function (semesterId, newStatus) { return __awaiter(void 0, void 0, void 0, function () {
        var DatabaseService, queries, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../database/databaseService')); })];
                case 1:
                    DatabaseService = (_a.sent()).DatabaseService;
                    if (!(newStatus === 'Đang diễn ra')) return [3 /*break*/, 4];
                    queries = [
                        // 1. Set all current "Đang diễn ra" semesters to "Đóng"
                        {
                            sql: "UPDATE HOCKYNAMHOC SET TrangThaiHocKy = 'Đóng' WHERE TrangThaiHocKy = 'Đang diễn ra'",
                            params: []
                        },
                        // 2. Set the new semester to "Đang diễn ra"
                        {
                            sql: "UPDATE HOCKYNAMHOC SET TrangThaiHocKy = $1 WHERE MaHocKy = $2",
                            params: [newStatus, semesterId]
                        }
                    ];
                    return [4 /*yield*/, DatabaseService.transaction(queries)];
                case 2:
                    _a.sent();
                    // 3. Update ACADEMIC_SETTINGS to point to new current semester
                    return [4 /*yield*/, DatabaseService.updateCurrentSemester(semesterId)];
                case 3:
                    // 3. Update ACADEMIC_SETTINGS to point to new current semester
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: 
                // Simple status update for other statuses
                return [4 /*yield*/, database_1.db.query("UPDATE HOCKYNAMHOC SET TrangThaiHocKy = $1 WHERE MaHocKy = $2", [newStatus, semesterId])];
                case 5:
                    // Simple status update for other statuses
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, exports.semesterService.getSemesterById(semesterId)];
                case 7: 
                // Return updated semester
                return [2 /*return*/, _a.sent()];
                case 8:
                    error_8 = _a.sent();
                    console.error('Error updating semester status:', error_8);
                    throw new Error('Failed to update semester status');
                case 9: return [2 /*return*/];
            }
        });
    }); }
};
