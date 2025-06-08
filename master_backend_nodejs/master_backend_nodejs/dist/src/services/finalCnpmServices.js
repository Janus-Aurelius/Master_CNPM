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
exports.StudentService = exports.FinancialService = exports.RegistrationService = exports.AcademicService = void 0;
// Services for final_cnpm database tables
var databaseService_1 = require("./database/databaseService");
/**
 * Academic Service - Handle subjects, courses, programs
 */
var AcademicService = /** @class */ (function () {
    function AcademicService() {
    }
    // Get all subjects (monhoc)
    AcademicService.getAllSubjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    mh.mamonhoc,\n                    mh.tenmonhoc,\n                    mh.sotinchi,\n                    mh.sotietlt,\n                    mh.sotietth,\n                    mh.maloaimon,\n                    lm.tenloaimon\n                FROM monhoc mh\n                LEFT JOIN loaimon lm ON mh.maloaimon = lm.maloaimon\n                ORDER BY mh.tenmonhoc\n            ")];
                    case 1:
                        subjects = _a.sent();
                        return [2 /*return*/, subjects];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting subjects:', error_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get subjects by program (nganh)
    AcademicService.getSubjectsByProgram = function (programId) {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    mh.mamonhoc,\n                    mh.tenmonhoc,\n                    mh.sotinchi,\n                    cth.hocky,\n                    cth.namhoc\n                FROM chuongtrinhhoc cth\n                JOIN monhoc mh ON cth.mamonhoc = mh.mamonhoc\n                WHERE cth.manganh = $1\n                ORDER BY cth.hocky, cth.namhoc, mh.tenmonhoc\n            ", [programId])];
                    case 1:
                        subjects = _a.sent();
                        return [2 /*return*/, subjects];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting subjects by program:', error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get available subjects for registration
    AcademicService.getAvailableSubjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    dsmhm.mamonhoc,\n                    mh.tenmonhoc,\n                    mh.sotinchi,\n                    dsmhm.hocky,\n                    dsmhm.namhoc,\n                    dsmhm.siso\n                FROM danhsachmonhocmo dsmhm\n                JOIN monhoc mh ON dsmhm.mamonhoc = mh.mamonhoc\n                ORDER BY dsmhm.hocky, dsmhm.namhoc, mh.tenmonhoc\n            ")];
                    case 1:
                        subjects = _a.sent();
                        return [2 /*return*/, subjects];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error getting available subjects:', error_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get all programs (nganhhoc)
    AcademicService.getAllPrograms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var programs, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    nh.manganh,\n                    nh.tennganh,\n                    nh.makhoa,\n                    k.tenkhoa\n                FROM nganhhoc nh\n                LEFT JOIN khoa k ON nh.makhoa = k.makhoa\n                ORDER BY k.tenkhoa, nh.tennganh\n            ")];
                    case 1:
                        programs = _a.sent();
                        return [2 /*return*/, programs];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting programs:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AcademicService;
}());
exports.AcademicService = AcademicService;
/**
 * Registration Service - Handle student registration
 */
var RegistrationService = /** @class */ (function () {
    function RegistrationService() {
    }
    // Get student registrations
    RegistrationService.getStudentRegistrations = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var registrations, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    pd.maphieudangky,\n                    pd.masosinhvien,\n                    pd.hocky,\n                    pd.namhoc,\n                    pd.ngaydangky,\n                    ctpd.mamonhoc,\n                    mh.tenmonhoc,\n                    mh.sotinchi\n                FROM phieudangky pd\n                JOIN ct_phieudangky ctpd ON pd.maphieudangky = ctpd.maphieudangky\n                JOIN monhoc mh ON ctpd.mamonhoc = mh.mamonhoc\n                WHERE pd.masosinhvien = $1\n                ORDER BY pd.namhoc DESC, pd.hocky DESC, mh.tenmonhoc\n            ", [studentId])];
                    case 1:
                        registrations = _a.sent();
                        return [2 /*return*/, registrations];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting student registrations:', error_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Register student for subjects
    RegistrationService.registerStudentForSubjects = function (studentId, subjectIds, semester, year) {
        return __awaiter(this, void 0, void 0, function () {
            var registrationId, _i, subjectIds_1, subjectId, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        registrationId = "PDK_".concat(studentId, "_").concat(semester, "_").concat(year);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO phieudangky (maphieudangky, masosinhvien, hocky, namhoc, ngaydangky)\n                VALUES ($1, $2, $3, $4, CURRENT_DATE)\n                ON CONFLICT (maphieudangky) DO NOTHING\n            ", [registrationId, studentId, semester, year])];
                    case 1:
                        _a.sent();
                        _i = 0, subjectIds_1 = subjectIds;
                        _a.label = 2;
                    case 2:
                        if (!(_i < subjectIds_1.length)) return [3 /*break*/, 5];
                        subjectId = subjectIds_1[_i];
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    INSERT INTO ct_phieudangky (maphieudangky, mamonhoc)\n                    VALUES ($1, $2)\n                    ON CONFLICT DO NOTHING\n                ", [registrationId, subjectId])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, { success: true, registrationId: registrationId }];
                    case 6:
                        error_6 = _a.sent();
                        console.error('Error registering student for subjects:', error_6);
                        return [2 /*return*/, { success: false, error: error_6.message }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return RegistrationService;
}());
exports.RegistrationService = RegistrationService;
/**
 * Financial Service - Handle payments and fees
 */
var FinancialService = /** @class */ (function () {
    function FinancialService() {
    }
    // Get payment records
    FinancialService.getPaymentRecords = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, payments, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT \n                    pth.maphieuthuhp,\n                    pth.masosinhvien,\n                    sv.hoten,\n                    pth.sotien,\n                    pth.ngaythu,\n                    pth.hocky,\n                    pth.namhoc\n                FROM phieuthuhp pth\n                JOIN sinhvien sv ON pth.masosinhvien = sv.masosinhvien\n            ";
                        params = [];
                        if (studentId) {
                            query += ' WHERE pth.masosinhvien = $1';
                            params.push(studentId);
                        }
                        query += ' ORDER BY pth.ngaythu DESC';
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, params)];
                    case 1:
                        payments = _a.sent();
                        return [2 /*return*/, payments];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error getting payment records:', error_7);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Get students with outstanding payments
    FinancialService.getOutstandingPayments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var outstanding, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    bcsv.masosinhvien,\n                    sv.hoten,\n                    bcsv.tongsotienno\n                FROM baocaosinhviennohp bcsv\n                JOIN sinhvien sv ON bcsv.masosinhvien = sv.masosinhvien\n                WHERE bcsv.tongsotienno > 0\n                ORDER BY bcsv.tongsotienno DESC\n            ")];
                    case 1:
                        outstanding = _a.sent();
                        return [2 /*return*/, outstanding];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error getting outstanding payments:', error_8);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FinancialService;
}());
exports.FinancialService = FinancialService;
/**
 * Student Service - Handle student information
 */
var StudentService = /** @class */ (function () {
    function StudentService() {
    }
    // Get student dashboard data
    StudentService.getStudentDashboard = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var studentInfo, currentRegistrations, paymentStatus, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    sv.*,\n                    nh.tennganh,\n                    k.tenkhoa\n                FROM sinhvien sv\n                LEFT JOIN nganhhoc nh ON sv.manganh = nh.manganh\n                LEFT JOIN khoa k ON nh.makhoa = k.makhoa\n                WHERE sv.masosinhvien = $1\n            ", [studentId])];
                    case 1:
                        studentInfo = _a.sent();
                        return [4 /*yield*/, RegistrationService.getStudentRegistrations(studentId)];
                    case 2:
                        currentRegistrations = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT tongsotienno\n                FROM baocaosinhviennohp\n                WHERE masosinhvien = $1\n            ", [studentId])];
                    case 3:
                        paymentStatus = _a.sent();
                        return [2 /*return*/, {
                                student: studentInfo,
                                registrations: currentRegistrations,
                                paymentStatus: (paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.tongsotienno) || 0,
                                totalCredits: currentRegistrations.reduce(function (sum, reg) { return sum + (reg.sotinchi || 0); }, 0)
                            }];
                    case 4:
                        error_9 = _a.sent();
                        console.error('Error getting student dashboard:', error_9);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return StudentService;
}());
exports.StudentService = StudentService;
