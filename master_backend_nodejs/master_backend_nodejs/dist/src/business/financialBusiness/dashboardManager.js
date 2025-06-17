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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFinancialReport = exports.getFinancialAnalytics = exports.getDashboardData = void 0;
// src/business/financialBusiness/dashboardManager.ts
var databaseService_1 = require("../../services/database/databaseService");
var financialService_1 = require("../../services/financialService/financialService");
var errorHandler_1 = require("../../middleware/errorHandler");
// Utility function to get current semester
var getCurrentSemester = function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; // JavaScript months are 0-indexed
    if (month >= 1 && month <= 5) {
        return "Spring ".concat(year);
    }
    else if (month >= 6 && month <= 8) {
        return "Summer ".concat(year);
    }
    else {
        return "Fall ".concat(year);
    }
};
// Dashboard
var getDashboardData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dashboardData, monthlyRevenue, data, error_1, totalStudents, paidStudents, partialStudents, unpaidStudents, totalRevenue, outstandingAmount, fallbackError_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 13]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                COUNT(DISTINCT tr.student_id) as total_students,\n                COUNT(DISTINCT CASE WHEN tr.payment_status = 'PAID' THEN tr.student_id END) as paid_students,\n                COUNT(DISTINCT CASE WHEN tr.payment_status = 'PARTIAL' THEN tr.student_id END) as partial_students,\n                COUNT(DISTINCT CASE WHEN tr.payment_status = 'UNPAID' THEN tr.student_id END) as unpaid_students,\n                SUM(CASE WHEN tr.payment_status = 'PAID' THEN tr.total_amount ELSE 0 END) as total_revenue,\n                SUM(CASE WHEN tr.payment_status IN ('UNPAID', 'PARTIAL') THEN tr.outstanding_amount ELSE 0 END) as outstanding_amount\n            FROM tuition_records tr\n            WHERE tr.semester = $1\n        ", [getCurrentSemester()])];
            case 1:
                dashboardData = _a.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                EXTRACT(MONTH FROM pr.payment_date) as month,\n                SUM(pr.amount) as revenue\n            FROM payment_receipts pr\n            WHERE EXTRACT(YEAR FROM pr.payment_date) = EXTRACT(YEAR FROM NOW())\n            GROUP BY EXTRACT(MONTH FROM pr.payment_date)\n            ORDER BY month\n        ")];
            case 2:
                monthlyRevenue = _a.sent();
                data = dashboardData[0] || {};
                return [2 /*return*/, {
                        studentCounts: {
                            total: parseInt(data.total_students || 0),
                            paid: parseInt(data.paid_students || 0),
                            partial: parseInt(data.partial_students || 0),
                            unpaid: parseInt(data.unpaid_students || 0)
                        },
                        financialSummary: {
                            totalRevenue: parseFloat(data.total_revenue || 0),
                            outstandingAmount: parseFloat(data.outstanding_amount || 0),
                            collectionRate: data.total_students > 0 ?
                                ((parseInt(data.paid_students || 0) + 0.5 * parseInt(data.partial_students || 0)) / parseInt(data.total_students)) * 100 : 0
                        },
                        monthlyRevenue: monthlyRevenue.map(function (item) { return ({
                            month: item.month,
                            revenue: parseFloat(item.revenue || 0)
                        }); })
                    }];
            case 3:
                error_1 = _a.sent();
                console.error('Error in financial dashboard:', error_1);
                _a.label = 4;
            case 4:
                _a.trys.push([4, 11, , 12]);
                return [4 /*yield*/, financialService_1.financialService.countTotalStudents()];
            case 5:
                totalStudents = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.countStudentsByPaymentStatus('PAID')];
            case 6:
                paidStudents = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.countStudentsByPaymentStatus('PARTIAL')];
            case 7:
                partialStudents = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.countStudentsByPaymentStatus('UNPAID')];
            case 8:
                unpaidStudents = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.getTotalRevenue()];
            case 9:
                totalRevenue = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.getOutstandingAmount()];
            case 10:
                outstandingAmount = _a.sent();
                return [2 /*return*/, {
                        studentCounts: {
                            total: totalStudents,
                            paid: paidStudents,
                            partial: partialStudents,
                            unpaid: unpaidStudents
                        },
                        financialSummary: {
                            totalRevenue: totalRevenue,
                            outstandingAmount: outstandingAmount,
                            collectionRate: totalStudents > 0 ?
                                ((paidStudents + 0.5 * partialStudents) / totalStudents) * 100 : 0
                        }
                    }];
            case 11:
                fallbackError_1 = _a.sent();
                console.error('Error in financial business layer fallback:', fallbackError_1);
                throw new errorHandler_1.AppError(500, 'Error retrieving financial dashboard data');
            case 12: return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.getDashboardData = getDashboardData;
// Advanced Financial Analytics
var getFinancialAnalytics = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (timeframe) {
        var interval, analytics, feeDistribution, error_2;
        if (timeframe === void 0) { timeframe = 'monthly'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    interval = 'month';
                    if (timeframe === 'quarterly')
                        interval = 'quarter';
                    if (timeframe === 'yearly')
                        interval = 'year';
                    return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                DATE_TRUNC($1, pr.payment_date) as period,\n                COUNT(pr.id) as total_payments,\n                SUM(pr.amount) as total_amount,\n                AVG(pr.amount) as average_payment,\n                COUNT(DISTINCT pr.student_id) as unique_students\n            FROM payment_receipts pr\n            WHERE pr.payment_date >= NOW() - INTERVAL '12 months'\n            GROUP BY DATE_TRUNC($1, pr.payment_date)\n            ORDER BY period DESC\n        ", [interval])];
                case 1:
                    analytics = _a.sent();
                    return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                tci.fee_type,\n                COUNT(*) as count,\n                SUM(tci.amount) as total_amount,\n                AVG(tci.amount) as average_amount\n            FROM tuition_course_items tci\n            JOIN tuition_records tr ON tci.tuition_record_id = tr.id\n            WHERE tr.semester = $1\n            GROUP BY tci.fee_type\n            ORDER BY total_amount DESC\n        ", [getCurrentSemester()])];
                case 2:
                    feeDistribution = _a.sent();
                    return [2 /*return*/, {
                            timeframe: timeframe,
                            trends: analytics.map(function (item) { return ({
                                period: item.period,
                                totalPayments: parseInt(item.total_payments),
                                totalAmount: parseFloat(item.total_amount),
                                averagePayment: parseFloat(item.average_payment),
                                uniqueStudents: parseInt(item.unique_students)
                            }); }),
                            feeDistribution: feeDistribution.map(function (item) { return ({
                                feeType: item.fee_type,
                                count: parseInt(item.count),
                                totalAmount: parseFloat(item.total_amount),
                                averageAmount: parseFloat(item.average_amount)
                            }); })
                        }];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error getting financial analytics:', error_2);
                    throw new errorHandler_1.AppError(500, 'Error retrieving financial analytics');
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.getFinancialAnalytics = getFinancialAnalytics;
// Financial Reports
var generateFinancialReport = function (reportType, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var semester, _a, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                semester = filters.semester || getCurrentSemester();
                _a = reportType;
                switch (_a) {
                    case 'summary': return [3 /*break*/, 1];
                    case 'detailed': return [3 /*break*/, 3];
                    case 'overdue': return [3 /*break*/, 5];
                }
                return [3 /*break*/, 7];
            case 1: return [4 /*yield*/, generateSummaryReport(semester, filters)];
            case 2: return [2 /*return*/, _b.sent()];
            case 3: return [4 /*yield*/, generateDetailedReport(semester, filters)];
            case 4: return [2 /*return*/, _b.sent()];
            case 5: return [4 /*yield*/, generateOverdueReport(semester, filters)];
            case 6: return [2 /*return*/, _b.sent()];
            case 7: throw new errorHandler_1.AppError(400, 'Invalid report type');
            case 8: return [3 /*break*/, 10];
            case 9:
                error_3 = _b.sent();
                if (error_3 instanceof errorHandler_1.AppError)
                    throw error_3;
                console.error('Error generating financial report:', error_3);
                throw new errorHandler_1.AppError(500, 'Error generating financial report');
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.generateFinancialReport = generateFinancialReport;
var generateSummaryReport = function (semester, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var summaryData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        SELECT \n            COUNT(DISTINCT tr.student_id) as total_students,\n            SUM(tr.total_amount) as total_tuition,\n            SUM(tr.paid_amount) as total_paid,\n            SUM(tr.outstanding_amount) as total_outstanding,\n            COUNT(CASE WHEN tr.payment_status = 'PAID' THEN 1 END) as paid_count,\n            COUNT(CASE WHEN tr.payment_status = 'PARTIAL' THEN 1 END) as partial_count,\n            COUNT(CASE WHEN tr.payment_status = 'UNPAID' THEN 1 END) as unpaid_count\n        FROM tuition_records tr\n        JOIN students s ON tr.student_id = s.student_id\n        WHERE tr.semester = $1\n        ".concat(filters.faculty ? 'AND s.faculty = $2' : '', "\n    "), filters.faculty ? [semester, filters.faculty] : [semester])];
            case 1:
                summaryData = _a.sent();
                return [2 /*return*/, {
                        reportType: 'summary',
                        semester: semester,
                        generatedAt: new Date().toISOString(),
                        data: summaryData[0]
                    }];
        }
    });
}); };
var generateDetailedReport = function (semester, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var whereConditions, queryParams, paramIndex, detailedData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                whereConditions = ['tr.semester = $1'];
                queryParams = [semester];
                paramIndex = 2;
                if (filters.faculty) {
                    whereConditions.push("s.faculty = $".concat(paramIndex));
                    queryParams.push(filters.faculty);
                    paramIndex++;
                }
                if (filters.startDate) {
                    whereConditions.push("tr.created_at >= $".concat(paramIndex));
                    queryParams.push(filters.startDate);
                    paramIndex++;
                }
                if (filters.endDate) {
                    whereConditions.push("tr.created_at <= $".concat(paramIndex));
                    queryParams.push(filters.endDate);
                    paramIndex++;
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        SELECT \n            tr.student_id,\n            s.full_name,\n            s.faculty,\n            s.program,\n            tr.total_amount,\n            tr.paid_amount,\n            tr.outstanding_amount,\n            tr.payment_status,\n            tr.due_date,\n            tr.created_at\n        FROM tuition_records tr\n        JOIN students s ON tr.student_id = s.student_id\n        WHERE ".concat(whereConditions.join(' AND '), "\n        ORDER BY s.faculty, s.full_name\n    "), queryParams)];
            case 1:
                detailedData = _a.sent();
                return [2 /*return*/, {
                        reportType: 'detailed',
                        semester: semester,
                        filters: filters,
                        generatedAt: new Date().toISOString(),
                        data: detailedData.map(function (item) { return (__assign(__assign({}, item), { total_amount: parseFloat(item.total_amount), paid_amount: parseFloat(item.paid_amount), outstanding_amount: parseFloat(item.outstanding_amount) })); })
                    }];
        }
    });
}); };
var generateOverdueReport = function (semester, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var overdueData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        SELECT \n            tr.student_id,\n            s.full_name,\n            s.faculty,\n            s.program,\n            s.email,\n            s.phone,\n            tr.total_amount,\n            tr.paid_amount,\n            tr.outstanding_amount,\n            tr.due_date,\n            EXTRACT(DAY FROM NOW() - tr.due_date) as days_overdue\n        FROM tuition_records tr\n        JOIN students s ON tr.student_id = s.student_id\n        WHERE tr.semester = $1 \n        AND tr.payment_status IN ('UNPAID', 'PARTIAL')\n        AND tr.due_date < NOW()\n        ".concat(filters.faculty ? 'AND s.faculty = $2' : '', "\n        ORDER BY days_overdue DESC, tr.outstanding_amount DESC\n    "), filters.faculty ? [semester, filters.faculty] : [semester])];
            case 1:
                overdueData = _a.sent();
                return [2 /*return*/, {
                        reportType: 'overdue',
                        semester: semester,
                        generatedAt: new Date().toISOString(),
                        data: overdueData.map(function (item) { return (__assign(__assign({}, item), { total_amount: parseFloat(item.total_amount), paid_amount: parseFloat(item.paid_amount), outstanding_amount: parseFloat(item.outstanding_amount), days_overdue: parseInt(item.days_overdue) })); })
                    }];
        }
    });
}); };
exports.default = {
    getDashboardData: exports.getDashboardData,
    getFinancialAnalytics: exports.getFinancialAnalytics
};
