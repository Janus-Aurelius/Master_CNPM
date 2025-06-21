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
exports.FinancialPaymentService = void 0;
// src/services/financialService/paymentService.ts
var databaseService_1 = require("../database/databaseService");
var database_1 = require("../../config/database");
var FinancialPaymentService = /** @class */ (function () {
    function FinancialPaymentService() {
    }
    /**
     * Get payment status for all students in a semester
     */
    FinancialPaymentService.prototype.getPaymentStatusList = function (semesterId, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, params, paramIndex, countQuery, countResult, total, offset, limit, dataQuery, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        whereClause = 'WHERE pd.MaHocKy = $1';
                        params = [semesterId];
                        paramIndex = 2;
                        // Add payment status filter
                        if (filters === null || filters === void 0 ? void 0 : filters.paymentStatus) {
                            switch (filters.paymentStatus) {
                                case 'paid':
                                    whereClause += " AND pd.SoTienConLai = 0";
                                    break;
                                case 'partial':
                                    whereClause += " AND pd.SoTienConLai > 0 AND pd.SoTienDaDong > 0";
                                    break;
                                case 'unpaid':
                                    whereClause += " AND pd.SoTienDaDong = 0";
                                    break;
                                case 'overdue':
                                    whereClause += " AND pd.SoTienConLai > 0 AND hk.HanDongHocPhi < CURRENT_DATE";
                                    break;
                            }
                        }
                        // Add student ID filter
                        if (filters === null || filters === void 0 ? void 0 : filters.studentId) {
                            whereClause += " AND pd.MaSoSinhVien LIKE $".concat(paramIndex);
                            params.push("%".concat(filters.studentId, "%"));
                            paramIndex++;
                        }
                        countQuery = "\n            SELECT COUNT(*) as total\n            FROM PHIEUDANGKY pd\n            JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy\n            ".concat(whereClause, "\n        ");
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne(countQuery, params)];
                    case 1:
                        countResult = _a.sent();
                        total = (countResult === null || countResult === void 0 ? void 0 : countResult.total) || 0;
                        offset = (filters === null || filters === void 0 ? void 0 : filters.offset) || 0;
                        limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 50;
                        dataQuery = "\n            SELECT \n                pd.MaSoSinhVien,\n                sv.HoTen,\n                pd.MaHocKy,\n                pd.SoTienPhaiDong,\n                pd.SoTienDaDong,\n                pd.SoTienConLai,\n                hk.HanDongHocPhi,\n                CASE \n                    WHEN pd.SoTienConLai = 0 THEN 'paid'\n                    WHEN pd.SoTienConLai > 0 AND pd.SoTienDaDong > 0 THEN 'partial'\n                    WHEN pd.SoTienDaDong = 0 THEN 'unpaid'\n                END as payment_status,\n                CASE \n                    WHEN pd.SoTienConLai > 0 AND hk.HanDongHocPhi < CURRENT_DATE THEN true\n                    ELSE false\n                END as is_overdue\n            FROM PHIEUDANGKY pd\n            JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy\n            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien\n            ".concat(whereClause, "\n            ORDER BY pd.MaSoSinhVien\n            LIMIT $").concat(paramIndex, " OFFSET $").concat(paramIndex + 1, "\n        ");
                        params.push(limit, offset);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(dataQuery, params)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data.map(function (row) { return ({
                                    studentId: row.MaSoSinhVien,
                                    studentName: row.HoTen,
                                    semesterId: row.MaHocKy,
                                    totalAmount: parseFloat(row.SoTienPhaiDong),
                                    paidAmount: parseFloat(row.SoTienDaDong),
                                    remainingAmount: parseFloat(row.SoTienConLai),
                                    dueDate: row.HanDongHocPhi,
                                    paymentStatus: row.payment_status,
                                    isOverdue: row.is_overdue
                                }); }),
                                total: parseInt(total)
                            }];
                }
            });
        });
    };
    /**
     * Get payment history for a specific student
     */
    FinancialPaymentService.prototype.getPaymentHistory = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, params, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        whereClause = 'WHERE pt.MaSoSinhVien = $1';
                        params = [studentId];
                        if (semesterId) {
                            whereClause += ' AND pt.MaHocKy = $2';
                            params.push(semesterId);
                        }
                        query = "\n            SELECT \n                pt.MaPhieuThu as payment_id,\n                pt.NgayLap as payment_date,\n                pt.SoTienDong as amount,\n                pt.MaPhieuDangKy as registration_id\n            FROM PHIEUTHUHP pt\n            ".concat(whereClause, "\n            ORDER BY pt.NgayLap DESC\n        ");
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, params)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(function (row) { return ({
                                paymentId: row.payment_id,
                                paymentDate: row.payment_date,
                                amount: parseFloat(row.amount),
                                registrationId: row.registration_id
                            }); })];
                }
            });
        });
    };
    /**
     * Confirm a payment (update payment status)
     */
    FinancialPaymentService.prototype.confirmPayment = function (paymentData, createdBy) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, database_1.Database.withClient(function (client) { return __awaiter(_this, void 0, void 0, function () {
                        var insertPaymentQuery, paymentResult, paymentId, updateRegistrationQuery, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 5, , 7]);
                                    return [4 /*yield*/, client.query('BEGIN')];
                                case 1:
                                    _a.sent();
                                    insertPaymentQuery = "\n                    INSERT INTO PHIEUTHUHP (\n                        MaSoSinhVien, MaHocKy, SoTienDong, NgayLap, \n                        PhuongThucThanhToan, GhiChu, TrangThai, NguoiTao, NgayTao\n                    ) VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', $7, CURRENT_TIMESTAMP)\n                    RETURNING MaPhieuThu\n                ";
                                    return [4 /*yield*/, client.query(insertPaymentQuery, [
                                            paymentData.studentId,
                                            paymentData.semester,
                                            paymentData.amount,
                                            paymentData.paymentDate,
                                            paymentData.paymentMethod,
                                            paymentData.notes,
                                            createdBy
                                        ])];
                                case 2:
                                    paymentResult = _a.sent();
                                    paymentId = paymentResult.rows[0].MaPhieuThu;
                                    updateRegistrationQuery = "\n                    UPDATE PHIEUDANGKY \n                    SET \n                        SoTienDaDong = SoTienDaDong + $1,\n                        SoTienConLai = SoTienPhaiDong - (SoTienDaDong + $1),\n                        NgayCapNhat = CURRENT_TIMESTAMP\n                    WHERE MaSoSinhVien = $2 AND MaHocKy = $3\n                ";
                                    return [4 /*yield*/, client.query(updateRegistrationQuery, [
                                            paymentData.amount,
                                            paymentData.studentId,
                                            paymentData.semester
                                        ])];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, client.query('COMMIT')];
                                case 4:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            success: true,
                                            paymentId: paymentId,
                                            message: 'Payment confirmed successfully'
                                        }];
                                case 5:
                                    error_1 = _a.sent();
                                    return [4 /*yield*/, client.query('ROLLBACK')];
                                case 6:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            success: false,
                                            message: "Payment confirmation failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unknown error')
                                        }];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Get payment receipt data
     */
    FinancialPaymentService.prototype.getPaymentReceipt = function (paymentId) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT \n                pt.MaPhieuThu as payment_id,\n                pt.MaSoSinhVien as student_id,\n                sv.HoTen as student_name,\n                pt.MaHocKy as semester_id,\n                hk.TenHocKy as semester_name,\n                pt.SoTienDong as amount,\n                pt.NgayLap as payment_date,\n                pt.PhuongThucThanhToan as payment_method,\n                pt.GhiChu as notes,\n                pt.NguoiTao as created_by\n            FROM PHIEUTHUHP pt\n            JOIN SINHVIEN sv ON pt.MaSoSinhVien = sv.MaSoSinhVien\n            JOIN HOCKYNAMHOC hk ON pt.MaHocKy = hk.MaHocKy\n            WHERE pt.MaPhieuThu = $1\n        ";
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne(query, [paymentId])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get payment audit trail
     */
    FinancialPaymentService.prototype.getPaymentAudit = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, params, paramIndex, countQuery, countResult, total, offset, limit, dataQuery, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        whereClause = 'WHERE 1=1';
                        params = [];
                        paramIndex = 1;
                        if (filters === null || filters === void 0 ? void 0 : filters.studentId) {
                            whereClause += " AND pt.MaSoSinhVien = $".concat(paramIndex);
                            params.push(filters.studentId);
                            paramIndex++;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.semesterId) {
                            whereClause += " AND pt.MaHocKy = $".concat(paramIndex);
                            params.push(filters.semesterId);
                            paramIndex++;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.dateFrom) {
                            whereClause += " AND pt.NgayLap >= $".concat(paramIndex);
                            params.push(filters.dateFrom);
                            paramIndex++;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.dateTo) {
                            whereClause += " AND pt.NgayLap <= $".concat(paramIndex);
                            params.push(filters.dateTo);
                            paramIndex++;
                        }
                        countQuery = "\n            SELECT COUNT(*) as total\n            FROM PHIEUTHUHP pt\n            ".concat(whereClause, "\n        ");
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne(countQuery, params)];
                    case 1:
                        countResult = _a.sent();
                        total = (countResult === null || countResult === void 0 ? void 0 : countResult.total) || 0;
                        offset = (filters === null || filters === void 0 ? void 0 : filters.offset) || 0;
                        limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 50;
                        dataQuery = "\n            SELECT \n                pt.MaPhieuThu as payment_id,\n                pt.MaSoSinhVien as student_id,\n                sv.HoTen as student_name,\n                pt.MaHocKy as semester_id,\n                pt.SoTienDong as amount,\n                pt.NgayLap as payment_date,\n                pt.PhuongThucThanhToan as payment_method,\n                pt.TrangThai as status,\n                pt.NguoiTao as created_by,\n                pt.NgayTao as created_at\n            FROM PHIEUTHUHP pt\n            JOIN SINHVIEN sv ON pt.MaSoSinhVien = sv.MaSoSinhVien\n            ".concat(whereClause, "\n            ORDER BY pt.NgayLap DESC\n            LIMIT $").concat(paramIndex, " OFFSET $").concat(paramIndex + 1, "\n        ");
                        params.push(limit, offset);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(dataQuery, params)];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, {
                                data: data.map(function (row) { return ({
                                    paymentId: row.payment_id,
                                    studentId: row.student_id,
                                    studentName: row.student_name,
                                    semesterId: row.semester_id,
                                    amount: parseFloat(row.amount),
                                    paymentDate: row.payment_date,
                                    paymentMethod: row.payment_method,
                                    status: row.status,
                                    createdBy: row.created_by,
                                    createdAt: row.created_at
                                }); }),
                                total: parseInt(total)
                            }];
                }
            });
        });
    };
    return FinancialPaymentService;
}());
exports.FinancialPaymentService = FinancialPaymentService;
