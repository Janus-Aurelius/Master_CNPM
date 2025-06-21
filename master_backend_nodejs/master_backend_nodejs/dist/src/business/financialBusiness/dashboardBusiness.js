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
exports.FinancialDashboardBusiness = void 0;
// src/business/financialBusiness/dashboardBusiness.ts
var dashboardService_1 = require("../../services/financialService/dashboardService");
var FinancialDashboardBusiness = /** @class */ (function () {
    function FinancialDashboardBusiness() {
        this.dashboardService = new dashboardService_1.FinancialDashboardService();
    } /**
     * Get dashboard overview with validation
     */
    FinancialDashboardBusiness.prototype.getDashboardOverview = function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, overduePayments, overview, totalStudents, paidStudents, paymentRate, totalTuition, totalCollected, collectionRate, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.dashboardService.getDashboardStats(semesterId)];
                    case 1:
                        stats = _a.sent();
                        return [4 /*yield*/, this.dashboardService.getOverduePayments(semesterId)];
                    case 2:
                        overduePayments = _a.sent();
                        overview = stats.overview;
                        totalStudents = (overview === null || overview === void 0 ? void 0 : overview.total_students) || 0;
                        paidStudents = (overview === null || overview === void 0 ? void 0 : overview.paid_students) || 0;
                        paymentRate = totalStudents > 0 ? (paidStudents / totalStudents * 100) : 0;
                        totalTuition = parseFloat((overview === null || overview === void 0 ? void 0 : overview.total_tuition) || '0');
                        totalCollected = parseFloat((overview === null || overview === void 0 ? void 0 : overview.total_collected) || '0');
                        collectionRate = totalTuition > 0 ? (totalCollected / totalTuition * 100) : 0;
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    overview: {
                                        totalStudents: totalStudents,
                                        paidStudents: (overview === null || overview === void 0 ? void 0 : overview.paid_students) || 0,
                                        partialStudents: (overview === null || overview === void 0 ? void 0 : overview.partial_students) || 0,
                                        unpaidStudents: (overview === null || overview === void 0 ? void 0 : overview.unpaid_students) || 0,
                                        paymentRate: Math.round(paymentRate * 100) / 100,
                                        collectionRate: Math.round(collectionRate * 100) / 100
                                    },
                                    financial: {
                                        totalTuition: totalTuition,
                                        totalCollected: totalCollected,
                                        totalOutstanding: parseFloat((overview === null || overview === void 0 ? void 0 : overview.total_outstanding) || '0')
                                    },
                                    trends: stats.monthlyTrends || [],
                                    facultyStats: stats.facultyStats || [],
                                    overduePayments: overduePayments || []
                                }
                            }];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get dashboard overview: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unknown error')
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }; /**
     * Get semester comparison data
     */
    FinancialDashboardBusiness.prototype.getSemesterComparison = function (currentSemesterId, previousSemesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currentStats, previousStats, currentOverview, previousOverview, currentTotal, previousTotal, growth, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this.dashboardService.getDashboardStats(currentSemesterId),
                                this.dashboardService.getDashboardStats(previousSemesterId)
                            ])];
                    case 1:
                        _a = _b.sent(), currentStats = _a[0], previousStats = _a[1];
                        currentOverview = currentStats.overview;
                        previousOverview = previousStats.overview;
                        currentTotal = parseFloat((currentOverview === null || currentOverview === void 0 ? void 0 : currentOverview.total_collected) || '0');
                        previousTotal = parseFloat((previousOverview === null || previousOverview === void 0 ? void 0 : previousOverview.total_collected) || '0');
                        growth = previousTotal > 0 ?
                            ((currentTotal - previousTotal) / previousTotal * 100) : 0;
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    current: {
                                        semesterId: currentSemesterId,
                                        totalStudents: (currentOverview === null || currentOverview === void 0 ? void 0 : currentOverview.total_students) || 0,
                                        totalCollected: currentTotal,
                                        paymentRate: (currentOverview === null || currentOverview === void 0 ? void 0 : currentOverview.total_students) > 0 ?
                                            (currentOverview.paid_students / currentOverview.total_students * 100) : 0
                                    },
                                    previous: {
                                        semesterId: previousSemesterId,
                                        totalStudents: (previousOverview === null || previousOverview === void 0 ? void 0 : previousOverview.total_students) || 0,
                                        totalCollected: previousTotal,
                                        paymentRate: (previousOverview === null || previousOverview === void 0 ? void 0 : previousOverview.total_students) > 0 ?
                                            (previousOverview.paid_students / previousOverview.total_students * 100) : 0
                                    },
                                    growth: Math.round(growth * 100) / 100
                                }
                            }];
                    case 2:
                        error_2 = _b.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get semester comparison: ".concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }; /**
     * Get payment analytics with date range
     */
    FinancialDashboardBusiness.prototype.getPaymentAnalytics = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var startDate, endDate, analytics, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        startDate = (filters === null || filters === void 0 ? void 0 : filters.dateFrom) || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        endDate = (filters === null || filters === void 0 ? void 0 : filters.dateTo) || new Date();
                        return [4 /*yield*/, this.dashboardService.getRevenueAnalytics(startDate, endDate)];
                    case 1:
                        analytics = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: analytics
                            }];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get payment analytics: ".concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Export dashboard data to CSV/Excel format
     */
    FinancialDashboardBusiness.prototype.exportDashboardData = function (semesterId_1) {
        return __awaiter(this, arguments, void 0, function (semesterId, format) {
            var stats, overduePayments, overview, exportData, error_4;
            if (format === void 0) { format = 'csv'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.dashboardService.getDashboardStats(semesterId)];
                    case 1:
                        stats = _a.sent();
                        return [4 /*yield*/, this.dashboardService.getOverduePayments(semesterId)];
                    case 2:
                        overduePayments = _a.sent();
                        overview = stats.overview;
                        exportData = {
                            summary: {
                                totalStudents: (overview === null || overview === void 0 ? void 0 : overview.total_students) || 0,
                                paidStudents: (overview === null || overview === void 0 ? void 0 : overview.paid_students) || 0,
                                partialStudents: (overview === null || overview === void 0 ? void 0 : overview.partial_students) || 0,
                                unpaidStudents: (overview === null || overview === void 0 ? void 0 : overview.unpaid_students) || 0,
                                totalTuition: (overview === null || overview === void 0 ? void 0 : overview.total_tuition) || 0,
                                totalCollected: (overview === null || overview === void 0 ? void 0 : overview.total_collected) || 0,
                                totalOutstanding: (overview === null || overview === void 0 ? void 0 : overview.total_outstanding) || 0
                            },
                            overdueDetails: overduePayments,
                            facultyStats: stats.facultyStats,
                            monthlyTrends: stats.monthlyTrends
                        };
                        return [2 /*return*/, {
                                success: true,
                                data: exportData,
                                format: format
                            }];
                    case 3:
                        error_4 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to export dashboard data: ".concat((error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'Unknown error')
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return FinancialDashboardBusiness;
}());
exports.FinancialDashboardBusiness = FinancialDashboardBusiness;
