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
exports.financialPaymentController = exports.FinancialPaymentController = void 0;
var paymentBusiness_1 = require("../../business/financialBusiness/paymentBusiness");
var FinancialPaymentController = /** @class */ (function () {
    function FinancialPaymentController() {
        this.paymentBusiness = new paymentBusiness_1.FinancialPaymentBusiness();
    } /**
     * GET /api/financial/payment/status
     * Get payment status list for a semester
     */
    FinancialPaymentController.prototype.getPaymentStatusList = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semesterId, paymentStatus, studentId, page, limit, finalStudentId, filters, result, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.query, semesterId = _a.semesterId, paymentStatus = _a.paymentStatus, studentId = _a.studentId, page = _a.page, limit = _a.limit;
                        console.log('[getPaymentStatusList] req.user:', req.user);
                        console.log('[getPaymentStatusList] req.query before processing:', req.query);
                        if (!semesterId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Semester ID is required'
                                })];
                        }
                        finalStudentId = undefined;
                        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === 'financial') {
                            // Financial staff should see all students, ignore auto-injected studentId
                            console.log('[getPaymentStatusList] Financial staff detected, ignoring studentId filter');
                            finalStudentId = undefined;
                        }
                        else if (studentId && typeof studentId === 'string') {
                            // For other roles, use studentId if provided
                            finalStudentId = studentId;
                        }
                        filters = {
                            paymentStatus: paymentStatus,
                            studentId: finalStudentId,
                            page: page ? parseInt(page) : 1,
                            limit: limit ? parseInt(limit) : 50
                        };
                        console.log('[getPaymentStatusList] Final filters after role check:', filters);
                        return [4 /*yield*/, this.paymentBusiness.getPaymentStatusList(semesterId, filters)];
                    case 1:
                        result = _c.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data,
                                pagination: result.pagination
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
                        error_1 = _c.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_1 === null || error_1 === void 0 ? void 0 : error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/payment/history/:studentId
     * Get payment history for a specific student
     */
    FinancialPaymentController.prototype.getStudentPaymentHistory = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, semesterId, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        studentId = req.params.studentId;
                        semesterId = req.query.semesterId;
                        if (!studentId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Student ID is required'
                                })];
                        }
                        return [4 /*yield*/, this.paymentBusiness.getStudentPaymentHistory(studentId, semesterId)];
                    case 1:
                        result = _a.sent();
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
                        error_2 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_2 === null || error_2 === void 0 ? void 0 : error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/financial/payment/confirm
     * Confirm a payment
     */
    FinancialPaymentController.prototype.confirmPayment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentData, performedBy, result, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        paymentData = req.body;
                        performedBy = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.body.performedBy;
                        // Log dữ liệu nhận vào
                        console.log('[CONFIRM PAYMENT] Request body:', paymentData);
                        console.log('[CONFIRM PAYMENT] Performed by:', performedBy);
                        if (!performedBy) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    message: 'User authentication required'
                                })];
                        }
                        return [4 /*yield*/, this.paymentBusiness.confirmPayment(paymentData, performedBy)];
                    case 1:
                        result = _b.sent();
                        // Log kết quả trả về từ business/service
                        console.log('[CONFIRM PAYMENT] Result:', result);
                        if (result.success) {
                            res.status(201).json({
                                success: true,
                                data: { paymentId: result.paymentId },
                                message: result.message
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
                        console.error('[CONFIRM PAYMENT] Error:', error_3);
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
     * GET /api/financial/payment/receipt/:paymentId
     * Get payment receipt
     */
    FinancialPaymentController.prototype.getPaymentReceipt = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentId, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        paymentId = req.params.paymentId;
                        if (!paymentId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Payment ID is required'
                                })];
                        }
                        return [4 /*yield*/, this.paymentBusiness.getPaymentReceipt(paymentId)];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data
                            });
                        }
                        else {
                            res.status(404).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
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
    /**
     * GET /api/financial/payment/audit
     * Get payment audit trail
     */
    FinancialPaymentController.prototype.getPaymentAudit = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentId, semesterId, dateFrom, dateTo, page, limit, filters, result, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, studentId = _a.studentId, semesterId = _a.semesterId, dateFrom = _a.dateFrom, dateTo = _a.dateTo, page = _a.page, limit = _a.limit;
                        filters = {
                            studentId: studentId,
                            semesterId: semesterId,
                            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
                            dateTo: dateTo ? new Date(dateTo) : undefined,
                            page: page ? parseInt(page) : 1,
                            limit: limit ? parseInt(limit) : 50
                        };
                        return [4 /*yield*/, this.paymentBusiness.getPaymentAudit(filters)];
                    case 1:
                        result = _b.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data,
                                pagination: result.pagination
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
                        error_5 = _b.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_5 === null || error_5 === void 0 ? void 0 : error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/payment/statistics
     * Get payment statistics
     */
    FinancialPaymentController.prototype.getPaymentStatistics = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semesterId, dateFrom, dateTo, filters, result, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, semesterId = _a.semesterId, dateFrom = _a.dateFrom, dateTo = _a.dateTo;
                        filters = {
                            semesterId: semesterId,
                            dateFrom: dateFrom ? new Date(dateFrom) : undefined,
                            dateTo: dateTo ? new Date(dateTo) : undefined
                        };
                        return [4 /*yield*/, this.paymentBusiness.getPaymentStatistics(filters)];
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
                        error_6 = _b.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_6 === null || error_6 === void 0 ? void 0 : error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/payment/available-semesters
     * Get list of semesters that have payment data
     */
    FinancialPaymentController.prototype.getAvailableSemesters = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.paymentBusiness.getAvailableSemesters()];
                    case 1:
                        result = _a.sent();
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
                        error_7 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_7 === null || error_7 === void 0 ? void 0 : error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FinancialPaymentController;
}());
exports.FinancialPaymentController = FinancialPaymentController;
exports.financialPaymentController = new FinancialPaymentController();
