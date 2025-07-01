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
exports.financialDashboardController = exports.FinancialDashboardController = void 0;
var dashboardBusiness_1 = require("../../business/financialBusiness/dashboardBusiness");
var dashboardService_1 = require("../../services/financialService/dashboardService");
var FinancialDashboardController = /** @class */ (function () {
    function FinancialDashboardController() {
        this.dashboardBusiness = new dashboardBusiness_1.FinancialDashboardBusiness();
        this.service = new dashboardService_1.FinancialDashboardService();
    }
    /**
     * GET /api/financial/dashboard/overview
     * Get dashboard overview statistics
     */
    FinancialDashboardController.prototype.getDashboardOverview = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var semesterId, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        semesterId = req.query.semesterId;
                        return [4 /*yield*/, this.dashboardBusiness.getDashboardOverview(semesterId)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(200).json(data)];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in getDashboardOverview:', error_1);
                        return [2 /*return*/, res.status(500).json({ message: 'Internal server error' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/dashboard/comparison
     * Get semester comparison data
     */
    FinancialDashboardController.prototype.getSemesterComparison = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dashboardBusiness.getSemesterComparison()];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.status(200).json(data)];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error in getSemesterComparison:', error_2);
                        return [2 /*return*/, res.status(500).json({ message: 'Internal server error' })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/dashboard/analytics
     * Get payment analytics with filters
     */
    FinancialDashboardController.prototype.getPaymentAnalytics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semesterId, dateFrom, dateTo, groupBy, filters, result, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, semesterId = _a.semesterId, dateFrom = _a.dateFrom, dateTo = _a.dateTo, groupBy = _a.groupBy;
                        filters = {
                            semesterId: semesterId,
                            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
                            dateTo: dateTo ? new Date(dateTo) : undefined,
                            groupBy: groupBy
                        };
                        return [4 /*yield*/, this.dashboardBusiness.getPaymentAnalytics(filters)];
                    case 1:
                        result = _b.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_3 === null || error_3 === void 0 ? void 0 : error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/dashboard/export
     * Export dashboard data
     */
    FinancialDashboardController.prototype.exportDashboardData = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semesterId, format, result, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, semesterId = _a.semesterId, format = _a.format;
                        return [4 /*yield*/, this.dashboardBusiness.exportDashboardData(semesterId, format || 'csv')];
                    case 1:
                        result = _b.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data,
                                format: result.format
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_4 === null || error_4 === void 0 ? void 0 : error_4.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialDashboardController.prototype.getOverduePayments = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var semesterId, overdueData, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        semesterId = req.query.semesterId;
                        return [4 /*yield*/, this.dashboardBusiness.getOverduePayments(semesterId)];
                    case 1:
                        overdueData = _a.sent();
                        res.json({
                            success: true,
                            data: overdueData
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error in getOverduePayments:', error_5);
                        res.status(500).json({
                            success: false,
                            message: 'Lỗi khi tải dữ liệu nợ học phí',
                            error: error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialDashboardController.prototype.getOverview = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('[getOverview] Called');
                        return [4 /*yield*/, this.service.getOverview()];
                    case 1:
                        data = _a.sent();
                        console.log('[getOverview] Data:', data);
                        res.json({ success: true, data: data });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('[getOverview] Error:', err_1);
                        res.status(500).json({ success: false, message: 'Server error', error: err_1 instanceof Error ? err_1.message : err_1 });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialDashboardController.prototype.getRecentPayments = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.service.getRecentPayments()];
                    case 1:
                        data = _a.sent();
                        res.json({ success: true, data: data });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        res.status(500).json({ success: false, message: 'Server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialDashboardController.prototype.getFacultyStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.service.getFacultyStats()];
                    case 1:
                        data = _a.sent();
                        res.json({ success: true, data: data });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        res.status(500).json({ success: false, message: 'Server error' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FinancialDashboardController;
}());
exports.FinancialDashboardController = FinancialDashboardController;
exports.financialDashboardController = new FinancialDashboardController();
