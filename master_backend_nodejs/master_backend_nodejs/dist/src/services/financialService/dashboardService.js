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
exports.financialDashboardService = exports.FinancialDashboardService = void 0;
// src/services/financialService/dashboardService.ts
var databaseService_1 = require("../database/databaseService");
var FinancialDashboardService = /** @class */ (function () {
    function FinancialDashboardService() {
    }
    /**
     * Get dashboard statistics for a semester
     */
    FinancialDashboardService.prototype.getDashboardStats = function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetSemester, currentSemester, stats, monthlyTrends, facultyStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetSemester = semesterId;
                        if (!!targetSemester) return [3 /*break*/, 2];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaHocKy FROM HOCKYNAMHOC \n                WHERE TrangThaiHocKy = 'active' \n                ORDER BY ThoiGianBatDau DESC \n                LIMIT 1\n            ")];
                    case 1:
                        currentSemester = _a.sent();
                        targetSemester = currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.MaHocKy;
                        _a.label = 2;
                    case 2:
                        if (!targetSemester) {
                            throw new Error('No active semester found');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                COUNT(DISTINCT pd.MaSoSinhVien) as total_students,\n                COUNT(DISTINCT CASE WHEN pd.SoTienConLai = 0 THEN pd.MaSoSinhVien END) as paid_students,\n                COUNT(DISTINCT CASE WHEN pd.SoTienConLai > 0 AND pd.SoTienDaDong > 0 THEN pd.MaSoSinhVien END) as partial_students,\n                COUNT(DISTINCT CASE WHEN pd.SoTienDaDong = 0 THEN pd.MaSoSinhVien END) as unpaid_students,\n                SUM(pd.SoTienPhaiDong) as total_tuition,\n                SUM(pd.SoTienDaDong) as total_collected,\n                SUM(pd.SoTienConLai) as total_outstanding\n            FROM PHIEUDANGKY pd\n            WHERE pd.MaHocKy = $1\n        ", [targetSemester])];
                    case 3:
                        stats = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                EXTRACT(YEAR FROM pt.NgayLap) as year,\n                EXTRACT(MONTH FROM pt.NgayLap) as month,\n                COUNT(pt.MaPhieuThu) as payment_count,\n                SUM(pt.SoTienDong) as total_amount\n            FROM PHIEUTHUHP pt\n            WHERE pt.NgayLap >= CURRENT_DATE - INTERVAL '12 months'\n            GROUP BY EXTRACT(YEAR FROM pt.NgayLap), EXTRACT(MONTH FROM pt.NgayLap)\n            ORDER BY year DESC, month DESC\n        ")];
                    case 4:
                        monthlyTrends = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                k.TenKhoa as faculty_name,\n                COUNT(DISTINCT pd.MaSoSinhVien) as total_students,\n                SUM(pd.SoTienPhaiDong) as total_tuition,\n                SUM(pd.SoTienDaDong) as total_collected,\n                SUM(pd.SoTienConLai) as total_outstanding\n            FROM PHIEUDANGKY pd\n            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien\n            JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh\n            JOIN KHOA k ON nh.MaKhoa = k.MaKhoa\n            WHERE pd.MaHocKy = $1\n            GROUP BY k.MaKhoa, k.TenKhoa\n            ORDER BY total_tuition DESC\n        ", [targetSemester])];
                    case 5:
                        facultyStats = _a.sent();
                        return [2 /*return*/, {
                                semester: targetSemester,
                                overview: stats,
                                monthlyTrends: monthlyTrends,
                                facultyStats: facultyStats
                            }];
                }
            });
        });
    };
    /**
     * Get overdue payments report
     */
    FinancialDashboardService.prototype.getOverduePayments = function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetSemester, currentSemester;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetSemester = semesterId;
                        if (!!targetSemester) return [3 /*break*/, 2];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaHocKy FROM HOCKYNAMHOC \n                WHERE TrangThaiHocKy = 'active' \n                ORDER BY ThoiGianBatDau DESC \n                LIMIT 1\n            ")];
                    case 1:
                        currentSemester = _a.sent();
                        targetSemester = currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.MaHocKy;
                        _a.label = 2;
                    case 2: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                pd.MaPhieuDangKy,\n                pd.MaSoSinhVien,\n                sv.HoTen as student_name,\n                sv.Email,\n                sv.SoDienThoai,\n                k.TenKhoa as faculty,\n                nh.TenNganh as program,\n                pd.SoTienPhaiDong,\n                pd.SoTienDaDong,\n                pd.SoTienConLai,\n                hk.ThoiHanDongHP as due_date,\n                CURRENT_DATE - hk.ThoiHanDongHP as days_overdue\n            FROM PHIEUDANGKY pd\n            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien\n            JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh\n            JOIN KHOA k ON nh.MaKhoa = k.MaKhoa\n            JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy\n            WHERE pd.MaHocKy = $1 \n            AND pd.SoTienConLai > 0 \n            AND hk.ThoiHanDongHP < CURRENT_DATE\n            ORDER BY days_overdue DESC, pd.SoTienConLai DESC\n        ", [targetSemester])];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get revenue analytics
     */
    FinancialDashboardService.prototype.getRevenueAnalytics = function (startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                DATE(pt.NgayLap) as payment_date,\n                COUNT(pt.MaPhieuThu) as payment_count,\n                SUM(pt.SoTienDong) as daily_revenue,\n                AVG(pt.SoTienDong) as avg_payment_amount\n            FROM PHIEUTHUHP pt\n            WHERE pt.NgayLap BETWEEN $1 AND $2\n            GROUP BY DATE(pt.NgayLap)\n            ORDER BY payment_date\n        ", [startDate, endDate])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return FinancialDashboardService;
}());
exports.FinancialDashboardService = FinancialDashboardService;
exports.financialDashboardService = new FinancialDashboardService();
