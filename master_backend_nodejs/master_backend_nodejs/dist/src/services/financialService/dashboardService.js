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
            var query, params, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT \n                    COUNT(DISTINCT s.student_id) as total_students,\n                    COUNT(DISTINCT CASE WHEN p.status = 'PAID' THEN s.student_id END) as paid_students,\n                    COUNT(DISTINCT CASE WHEN p.status = 'PARTIAL' THEN s.student_id END) as partial_students,\n                    SUM(t.amount) as total_tuition,\n                    SUM(p.amount_paid) as total_collected\n                FROM students s\n                LEFT JOIN tuition t ON s.student_id = t.student_id\n                LEFT JOIN payments p ON t.tuition_id = p.tuition_id\n                ".concat(semesterId ? 'WHERE t.semester_id = $1' : '', "\n            ");
                        params = semesterId ? [semesterId] : [];
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, params)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error('Database error in getDashboardStats');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get enhanced dashboard statistics using your dynamic calculation logic
     */
    FinancialDashboardService.prototype.getDashboardStatsEnhanced = function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var targetSemester, currentSemester, stats, monthlyTrends, facultyStats, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        targetSemester = semesterId;
                        if (!!targetSemester) return [3 /*break*/, 2];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                    SELECT MaHocKy FROM HOCKYNAMHOC \n                    WHERE TrangThaiHocKy = 'active' \n                    LIMIT 1\n                ")];
                    case 1:
                        currentSemester = _a.sent();
                        targetSemester = currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.mahocky;
                        _a.label = 2;
                    case 2:
                        if (!targetSemester) {
                            throw new Error('No active semester found');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                WITH PaymentCalculations AS (\n                    SELECT \n                        pd.MaSoSinhVien,\n                        -- SoTienPhaiDong calculation\n                        COALESCE(\n                            (SELECT SUM(\n                                (mh.SoTiet::decimal / lm.SoTietMotTC) * lm.SoTienMotTC * (1 - COALESCE(dt.MucGiamHocPhi, 0))\n                            )\n                            FROM CT_PHIEUDANGKY ct\n                            JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                            JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                            JOIN SINHVIEN sv2 ON pd.MaSoSinhVien = sv2.MaSoSinhVien\n                            JOIN DOITUONGUUTIEN dt ON sv2.MaDoiTuongUT = dt.MaDoiTuong\n                            WHERE ct.MaPhieuDangKy = pd.MaPhieuDangKy), 0\n                        ) AS total_amount,\n                        -- SoTienDaDong calculation  \n                        COALESCE(\n                            (SELECT SUM(pt.SoTienDong) \n                             FROM PHIEUTHUHP pt \n                             WHERE pt.MaPhieuDangKy = pd.MaPhieuDangKy), 0\n                        ) AS paid_amount\n                    FROM PHIEUDANGKY pd\n                    WHERE pd.MaHocKy = $1\n                )\n                SELECT \n                    COUNT(DISTINCT MaSoSinhVien) as total_students,\n                    COUNT(DISTINCT CASE WHEN (total_amount - paid_amount) <= 0 THEN MaSoSinhVien END) as paid_students,\n                    COUNT(DISTINCT CASE WHEN (total_amount - paid_amount) > 0 THEN MaSoSinhVien END) as unpaid_students,\n                    SUM(total_amount - paid_amount) as total_outstanding,\n                    SUM(total_amount) as total_tuition,\n                    SUM(paid_amount) as total_collected\n                FROM PaymentCalculations\n            ", [targetSemester])];
                    case 3:
                        stats = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    EXTRACT(YEAR FROM pt.NgayLap) as year,\n                    EXTRACT(MONTH FROM pt.NgayLap) as month,\n                    COUNT(pt.MaPhieuThu) as payment_count,\n                    SUM(pt.SoTienDong) as total_amount\n                FROM PHIEUTHUHP pt\n                WHERE pt.NgayLap >= CURRENT_DATE - INTERVAL '12 months'\n                GROUP BY EXTRACT(YEAR FROM pt.NgayLap), EXTRACT(MONTH FROM pt.NgayLap)\n                ORDER BY year DESC, month DESC\n            ")];
                    case 4:
                        monthlyTrends = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                WITH FacultyPayments AS (\n                    SELECT \n                        k.MaKhoa,\n                        k.TenKhoa as faculty_name,\n                        pd.MaSoSinhVien,\n                        COALESCE(\n                            (SELECT SUM(\n                                (mh.SoTiet::decimal / lm.SoTietMotTC) * lm.SoTienMotTC * (1 - COALESCE(dt.MucGiamHocPhi, 0))\n                            )\n                            FROM CT_PHIEUDANGKY ct\n                            JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                            JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                            JOIN SINHVIEN sv2 ON pd.MaSoSinhVien = sv2.MaSoSinhVien\n                            JOIN DOITUONGUUTIEN dt ON sv2.MaDoiTuongUT = dt.MaDoiTuong\n                            WHERE ct.MaPhieuDangKy = pd.MaPhieuDangKy), 0\n                        ) - COALESCE(\n                            (SELECT SUM(pt.SoTienDong) \n                             FROM PHIEUTHUHP pt \n                             WHERE pt.MaPhieuDangKy = pd.MaPhieuDangKy), 0\n                        ) AS remaining_amount\n                    FROM PHIEUDANGKY pd\n                    JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien\n                    JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh\n                    JOIN KHOA k ON nh.MaKhoa = k.MaKhoa\n                    WHERE pd.MaHocKy = $1\n                )\n                SELECT \n                    faculty_name,\n                    COUNT(DISTINCT MaSoSinhVien) as total_students,\n                    SUM(remaining_amount) as total_outstanding\n                FROM FacultyPayments\n                GROUP BY MaKhoa, faculty_name\n                ORDER BY total_outstanding DESC\n            ", [targetSemester])];
                    case 5:
                        facultyStats = _a.sent();
                        return [2 /*return*/, {
                                semester: targetSemester,
                                overview: stats,
                                monthlyTrends: monthlyTrends,
                                facultyStats: facultyStats
                            }];
                    case 6:
                        error_2 = _a.sent();
                        throw new Error('Database error in getDashboardStatsEnhanced');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    FinancialDashboardService.prototype.getSemesterComparisonData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                WITH SemesterPayments AS (\n                    SELECT \n                        hk.MaHocKy,\n                        hk.HocKyThu,\n                        hk.NamHoc,\n                        pd.MaPhieuDangKy,\n                        COALESCE(\n                            (SELECT SUM(pt.SoTienDong) \n                             FROM PHIEUTHUHP pt \n                             WHERE pt.MaPhieuDangKy = pd.MaPhieuDangKy), 0\n                        ) AS total_collected,\n                        COUNT(DISTINCT pd.MaSoSinhVien) AS total_students\n                    FROM HOCKYNAMHOC hk\n                    LEFT JOIN PHIEUDANGKY pd ON hk.MaHocKy = pd.MaHocKy\n                    GROUP BY hk.MaHocKy, hk.HocKyThu, hk.NamHoc, pd.MaPhieuDangKy\n                )\n                SELECT \n                    MaHocKy as semester_id,\n                    CONCAT('HK', HocKyThu, ' ', NamHoc) as semester_name,\n                    SUM(total_collected) as total_collected,\n                    SUM(total_students) as total_students\n                FROM SemesterPayments\n                GROUP BY MaHocKy, HocKyThu, NamHoc\n                ORDER BY NamHoc DESC, HocKyThu DESC\n                LIMIT 4\n            ";
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error('Database error in getSemesterComparisonData');
                    case 3: return [2 /*return*/];
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
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaHocKy FROM HOCKYNAMHOC \n                WHERE TrangThaiHocKy = 'active' \n                LIMIT 1\n            ")];
                    case 1:
                        currentSemester = _a.sent();
                        targetSemester = currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.MaHocKy;
                        _a.label = 2;
                    case 2: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            WITH OverdueCalculations AS (\n                SELECT \n                    pd.MaPhieuDangKy,\n                    pd.MaSoSinhVien,\n                    sv.HoTen as student_name,\n                    sv.Email,\n                    sv.SoDienThoai,\n                    k.TenKhoa as faculty,\n                    nh.TenNganh as program,\n                    -- Dynamic SoTienPhaiDong calculation\n                    COALESCE(\n                        (SELECT SUM(\n                            (mh.SoTiet::decimal / lm.SoTietMotTC) * lm.SoTienMotTC * (1 - COALESCE(dt.MucGiamHocPhi, 0))\n                        )\n                        FROM CT_PHIEUDANGKY ct\n                        JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                        JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                        JOIN SINHVIEN sv2 ON pd.MaSoSinhVien = sv2.MaSoSinhVien\n                        JOIN DOITUONGUUTIEN dt ON sv2.MaDoiTuongUT = dt.MaDoiTuong\n                        WHERE ct.MaPhieuDangKy = pd.MaPhieuDangKy), 0\n                    ) AS SoTienPhaiDong,\n                    -- Dynamic SoTienDaDong calculation\n                    COALESCE(\n                        (SELECT SUM(pt.SoTienDong) \n                         FROM PHIEUTHUHP pt \n                         WHERE pt.MaPhieuDangKy = pd.MaPhieuDangKy), 0\n                    ) AS SoTienDaDong,\n                    hk.ThoiHanDongHP as due_date\n                FROM PHIEUDANGKY pd\n                JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien\n                JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh\n                JOIN KHOA k ON nh.MaKhoa = k.MaKhoa\n                JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy\n                WHERE pd.MaHocKy = $1 AND hk.ThoiHanDongHP < CURRENT_DATE\n            )\n            SELECT *,\n                   (SoTienPhaiDong - SoTienDaDong) AS SoTienConLai\n            FROM OverdueCalculations \n            WHERE (SoTienPhaiDong - SoTienDaDong) > 0\n        ", [targetSemester])];
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
    FinancialDashboardService.prototype.getOverview = function () {
        return __awaiter(this, void 0, void 0, function () {
            var debtRow, todayRow, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log('[getOverview Service] Querying totalDebtStudents and totalDebt');
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT COUNT(DISTINCT pd.MaSoSinhVien) AS totalDebtStudents,\n                       SUM(pd.SoTienConLai) AS totalDebt\n                FROM PHIEUDANGKY pd\n                WHERE pd.SoTienConLai > 0\n            ")];
                    case 1:
                        debtRow = (_a.sent())[0];
                        console.log('[getOverview Service] debtRow:', debtRow);
                        console.log('[getOverview Service] Querying todayTransactions and todayRevenue');
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT COUNT(*) AS todayTransactions,\n                       SUM(SoTienDong) AS todayRevenue\n                FROM PHIEUTHUHP\n                WHERE NgayLap = CURRENT_DATE\n            ")];
                    case 2:
                        todayRow = (_a.sent())[0];
                        console.log('[getOverview Service] todayRow:', todayRow);
                        return [2 /*return*/, {
                                totalDebtStudents: Number(debtRow.totaldebtstudents) || 0,
                                totalDebt: Number(debtRow.totaldebt) || 0,
                                todayTransactions: Number(todayRow.todaytransactions) || 0,
                                todayRevenue: Number(todayRow.todayrevenue) || 0,
                            }];
                    case 3:
                        err_1 = _a.sent();
                        console.error('[getOverview Service] Error:', err_1);
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FinancialDashboardService.prototype.getRecentPayments = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT pd.MaSoSinhVien AS studentId,\n                   sv.HoTen AS studentName,\n                   pt.SoTienDong AS amount,\n                   pt.PhuongThuc AS method,\n                   pt.NgayLap AS time\n            FROM PHIEUTHUHP pt\n            JOIN PHIEUDANGKY pd ON pt.MaPhieuDangKy = pd.MaPhieuDangKy\n            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien\n            ORDER BY pt.NgayLap DESC\n            LIMIT $1\n        ", [limit])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FinancialDashboardService.prototype.getFacultyStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT k.TenKhoa AS facultyName,\n                   COUNT(DISTINCT sv.MaSoSinhVien) AS totalStudents,\n                   COUNT(DISTINCT CASE WHEN pd.SoTienConLai > 0 THEN sv.MaSoSinhVien END) AS debtStudents,\n                   ROUND(\n                       COUNT(DISTINCT CASE WHEN pd.SoTienConLai > 0 THEN sv.MaSoSinhVien END)::numeric\n                       / NULLIF(COUNT(DISTINCT sv.MaSoSinhVien), 0) * 100, 1\n                   ) AS debtPercent\n            FROM KHOA k\n            JOIN NGANHHOC nh ON k.MaKhoa = nh.MaKhoa\n            JOIN SINHVIEN sv ON nh.MaNganh = sv.MaNganh\n            LEFT JOIN PHIEUDANGKY pd ON sv.MaSoSinhVien = pd.MaSoSinhVien\n            GROUP BY k.TenKhoa\n            ORDER BY k.TenKhoa\n        ")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return FinancialDashboardService;
}());
exports.FinancialDashboardService = FinancialDashboardService;
exports.financialDashboardService = new FinancialDashboardService();
