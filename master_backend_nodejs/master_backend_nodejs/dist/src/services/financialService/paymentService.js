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
     */ FinancialPaymentService.prototype.getPaymentStatusList = function (semesterId, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var whereClause, params, paramIndex, countQuery, countResult, total, offset, limit, dataQuery, data, mappedData, filteredData;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('[getPaymentStatusList] semesterId:', semesterId);
                        console.log('[getPaymentStatusList] filters:', filters); // Base where clause - always filter by semester first (your approach)
                        whereClause = 'WHERE pd.mahocky = $1';
                        params = [semesterId];
                        paramIndex = 2;
                        // Add student ID filter if provided
                        if (filters === null || filters === void 0 ? void 0 : filters.studentId) {
                            whereClause += " AND pd.masosinhvien LIKE $".concat(paramIndex);
                            params.push("%".concat(filters.studentId, "%"));
                            paramIndex++;
                        } // Get total count
                        countQuery = "\n            SELECT COUNT(*) as total\n            FROM PHIEUDANGKY pd\n            JOIN HOCKYNAMHOC hk ON pd.mahocky = hk.mahocky\n            ".concat(whereClause, "\n        ");
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne(countQuery, params)];
                    case 1:
                        countResult = _a.sent();
                        total = (countResult === null || countResult === void 0 ? void 0 : countResult.total) || 0;
                        offset = (filters === null || filters === void 0 ? void 0 : filters.offset) || 0;
                        limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 50;
                        dataQuery = "\n            SELECT \n                pd.masosinhvien AS \"studentId\",\n                sv.hoten AS \"studentName\",\n                k.tenkhoa AS \"faculty\", \n                nh.tennganh AS \"major\",\n                hk.namhoc AS \"year\",\n                CONCAT('H\u1ECDc k\u1EF3 ', hk.hockythu) AS \"semester\",\n                pd.mahocky AS \"semesterId\",\n                hk.thoihandonghp AS \"dueDate\",\n                \n                -- SoTienPhaiDong calculation using your formula\n                COALESCE(\n                    (SELECT SUM(\n                        (mh.sotiet::decimal / lm.sotietmottc) * lm.sotienmottc * (1 - COALESCE(dt.mucgiamhocphi, 0))\n                    )\n                    FROM ct_phieudangky ct\n                    JOIN monhoc mh ON ct.mamonhoc = mh.mamonhoc\n                    JOIN loaimon lm ON mh.maloaimon = lm.maloaimon\n                    JOIN sinhvien sv2 ON pd.masosinhvien = sv2.masosinhvien\n                    JOIN doituonguutien dt ON sv2.madoituongut = dt.madoituong\n                    WHERE ct.maphieudangky = pd.maphieudangky), 0\n                ) AS \"totalAmount\",\n                \n                -- SoTienDaDong calculation using your formula  \n                COALESCE(\n                    (SELECT SUM(pt.sotiendong) \n                     FROM phieuthuhp pt \n                     WHERE pt.maphieudangky = pd.maphieudangky), 0\n                ) AS \"paidAmount\"\n                \n            FROM phieudangky pd\n            JOIN sinhvien sv ON pd.masosinhvien = sv.masosinhvien\n            JOIN nganhhoc nh ON sv.manganh = nh.manganh\n            JOIN khoa k ON nh.makhoa = k.makhoa\n            JOIN hockynamhoc hk ON pd.mahocky = hk.mahocky\n            ".concat(whereClause, "\n            ORDER BY pd.masosinhvien\n            LIMIT $").concat(paramIndex, " OFFSET $").concat(paramIndex + 1, "\n        ");
                        params.push(limit, offset);
                        console.log('[getPaymentStatusList] SQL:', dataQuery);
                        console.log('[getPaymentStatusList] params:', params);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(dataQuery, params)];
                    case 2:
                        data = _a.sent();
                        // Log dữ liệu từ DB để debug
                        console.log('[getPaymentStatusList] Raw DB data:', data);
                        return [4 /*yield*/, Promise.all(data.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
                                var totalAmount, paidAmount, remainingAmount, paymentStatus, paymentHistory;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            totalAmount = parseFloat(row.totalAmount) || 0;
                                            paidAmount = parseFloat(row.paidAmount) || 0;
                                            remainingAmount = totalAmount - paidAmount;
                                            paymentStatus = 'unpaid';
                                            if (remainingAmount <= 0) {
                                                paymentStatus = 'paid';
                                            }
                                            else if (row.dueDate && new Date(row.dueDate) < new Date()) {
                                                paymentStatus = 'overdue';
                                            }
                                            return [4 /*yield*/, this.getPaymentHistory(row.studentId, row.semesterId)];
                                        case 1:
                                            paymentHistory = _a.sent();
                                            return [2 /*return*/, {
                                                    id: row.studentId,
                                                    studentId: row.studentId,
                                                    studentName: row.studentName,
                                                    faculty: row.faculty,
                                                    major: row.major,
                                                    year: row.year,
                                                    semester: row.semester,
                                                    semesterId: row.semesterId,
                                                    totalAmount: totalAmount,
                                                    paidAmount: paidAmount,
                                                    remainingAmount: remainingAmount,
                                                    dueDate: row.dueDate,
                                                    paymentStatus: paymentStatus,
                                                    paymentHistory: paymentHistory.map(function (p) { return ({
                                                        id: p.paymentId,
                                                        date: p.paymentDate,
                                                        amount: p.amount,
                                                        method: p.method || ''
                                                    }); }),
                                                    isOverdue: paymentStatus === 'overdue'
                                                }];
                                    }
                                });
                            }); }))];
                    case 3:
                        mappedData = _a.sent();
                        filteredData = mappedData;
                        if (filters === null || filters === void 0 ? void 0 : filters.paymentStatus) {
                            filteredData = mappedData.filter(function (item) {
                                switch (filters.paymentStatus) {
                                    case 'paid':
                                        return item.paymentStatus === 'paid';
                                    case 'unpaid':
                                        return item.paymentStatus === 'unpaid' || item.paymentStatus === 'overdue';
                                    case 'not_opened':
                                        // Logic for semester not opened yet - check semester status
                                        return false; // Implement logic based on semester state
                                    default:
                                        return true;
                                }
                            });
                        }
                        console.log('[getPaymentStatusList] Final mapped data:', filteredData);
                        return [2 /*return*/, {
                                data: filteredData,
                                total: parseInt(total)
                            }];
                }
            });
        });
    };
    /**
     * Get payment history for a specific student
     */ FinancialPaymentService.prototype.getPaymentHistory = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT \n                pt.maphieuthu as payment_id,\n                pt.ngaylap as payment_date,\n                pt.sotiendong as amount,\n                pt.phuongthuc as method,\n                pd.masosinhvien as student_id\n            FROM phieuthuhp pt\n            JOIN phieudangky pd ON pt.maphieudangky = pd.maphieudangky\n            WHERE pd.masosinhvien = $1\n            ".concat(semesterId ? 'AND pd.mahocky = $2' : '', "\n            ORDER BY pt.ngaylap DESC\n        ");
                        params = [studentId];
                        if (semesterId) {
                            params.push(semesterId);
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, params)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(function (row) { return ({
                                paymentId: row.payment_id,
                                paymentDate: row.payment_date instanceof Date
                                    ? row.payment_date.toISOString().split('T')[0]
                                    : (typeof row.payment_date === 'string' && row.payment_date.includes('T')
                                        ? row.payment_date.split('T')[0]
                                        : row.payment_date),
                                amount: parseFloat(row.amount),
                                method: row.method,
                                registrationId: row.registration_id
                            }); })];
                }
            });
        });
    };
    /**
     * Thêm phiếu thu học phí và cập nhật phiếu đăng ký
     */
    FinancialPaymentService.prototype.confirmPayment = function (paymentData, createdBy) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, database_1.Database.withClient(function (client) { return __awaiter(_this, void 0, void 0, function () {
                        var regRes, maPhieuDangKy, result, nextNum, maPhieuThu, insertPaymentQuery, paymentResult, paymentId, updateRegistrationQuery, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 7, , 9]);
                                    return [4 /*yield*/, client.query('BEGIN')];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, client.query("SELECT MaPhieuDangKy FROM PHIEUDANGKY WHERE MaSoSinhVien = $1 AND MaHocKy = $2", [paymentData.studentId, paymentData.semester])];
                                case 2:
                                    regRes = _a.sent();
                                    if (!regRes.rows.length) {
                                        throw new Error('Không tìm thấy phiếu đăng ký');
                                    }
                                    maPhieuDangKy = regRes.rows[0].maphieudangky;
                                    return [4 /*yield*/, client.query('SELECT MAX(CAST(SUBSTRING(maphieuthu, 3) AS INTEGER)) as max_num FROM phieuthuhp')];
                                case 3:
                                    result = _a.sent();
                                    nextNum = (result.rows[0].max_num || 0) + 1;
                                    maPhieuThu = 'PT' + String(nextNum).padStart(3, '0');
                                    insertPaymentQuery = "\n                    INSERT INTO phieuthuhp (maphieuthu, maphieudangky, ngaylap, sotiendong, phuongthuc)\n                    VALUES ($1, $2, $3, $4, $5)\n                    RETURNING maphieuthu\n                ";
                                    return [4 /*yield*/, client.query(insertPaymentQuery, [
                                            maPhieuThu,
                                            maPhieuDangKy,
                                            paymentData.paymentDate,
                                            paymentData.amount,
                                            paymentData.paymentMethod
                                        ])];
                                case 4:
                                    paymentResult = _a.sent();
                                    paymentId = paymentResult.rows[0].maphieuthu;
                                    updateRegistrationQuery = "\n                    UPDATE PHIEUDANGKY\n                    SET SoTienConLai = SoTienConLai - $1\n                    WHERE MaPhieuDangKy = $2\n                ";
                                    return [4 /*yield*/, client.query(updateRegistrationQuery, [
                                            paymentData.amount,
                                            maPhieuDangKy
                                        ])];
                                case 5:
                                    _a.sent();
                                    return [4 /*yield*/, client.query('COMMIT')];
                                case 6:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            success: true,
                                            paymentId: paymentId,
                                            message: 'Payment confirmed successfully'
                                        }];
                                case 7:
                                    error_1 = _a.sent();
                                    return [4 /*yield*/, client.query('ROLLBACK')];
                                case 8:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            success: false,
                                            message: "Payment confirmation failed: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unknown error')
                                        }];
                                case 9: return [2 /*return*/];
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
                        console.log('[getPaymentAudit] SQL:', dataQuery);
                        console.log('[getPaymentAudit] params:', params);
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
    }; /**
     * Get list of semesters that have registration data
     */
    FinancialPaymentService.prototype.getAvailableSemesters = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT \n                pd.mahocky as semester_id,\n                COUNT(*) as student_count\n            FROM phieudangky pd\n            GROUP BY pd.mahocky\n            HAVING COUNT(*) > 0\n            ORDER BY pd.mahocky DESC\n        ";
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(function (row) { return ({
                                semesterId: row.semester_id,
                                count: parseInt(row.student_count)
                            }); })];
                }
            });
        });
    };
    return FinancialPaymentService;
}());
exports.FinancialPaymentService = FinancialPaymentService;
