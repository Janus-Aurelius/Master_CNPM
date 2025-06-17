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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialPaymentBusiness = void 0;
// src/business/financialBusiness/paymentBusiness.ts
var paymentService_1 = require("../../services/financialService/paymentService");
var FinancialPaymentBusiness = /** @class */ (function () {
    function FinancialPaymentBusiness() {
        this.paymentService = new paymentService_1.FinancialPaymentService();
    }
    /**
     * Get payment status list with validation and business logic
     */
    FinancialPaymentBusiness.prototype.getPaymentStatusList = function (semesterId, filters) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, offset, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Validate semesterId
                        if (!semesterId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Semester ID is required'
                                }];
                        }
                        page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
                        limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 50;
                        offset = (page - 1) * limit;
                        return [4 /*yield*/, this.paymentService.getPaymentStatusList(semesterId, __assign(__assign({}, filters), { offset: offset, limit: limit }))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: result.data,
                                pagination: {
                                    total: result.total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(result.total / limit)
                                }
                            }];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get payment status list: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get student payment history with validation
     */
    FinancialPaymentBusiness.prototype.getStudentPaymentHistory = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var history_1, totalPaid, paymentCount, averagePayment, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!studentId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Student ID is required'
                                }];
                        }
                        return [4 /*yield*/, this.paymentService.getPaymentHistory(studentId, semesterId)];
                    case 1:
                        history_1 = _a.sent();
                        totalPaid = history_1.reduce(function (sum, payment) { return sum + payment.amount; }, 0);
                        paymentCount = history_1.length;
                        averagePayment = paymentCount > 0 ? totalPaid / paymentCount : 0;
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    payments: history_1,
                                    summary: {
                                        totalPaid: totalPaid,
                                        paymentCount: paymentCount,
                                        averagePayment: Math.round(averagePayment * 100) / 100,
                                        lastPaymentDate: history_1.length > 0 ? history_1[0].paymentDate : null
                                    }
                                }
                            }];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get payment history: ".concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Confirm payment with validation and business rules
     */
    FinancialPaymentBusiness.prototype.confirmPayment = function (paymentData, performedBy) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentsList, studentStatus, result, updatedStatus, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        // Validate required fields
                        if (!paymentData.studentId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Student ID is required'
                                }];
                        }
                        if (!paymentData.semester) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Semester is required'
                                }];
                        }
                        if (!paymentData.amount || paymentData.amount <= 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Payment amount must be greater than 0'
                                }];
                        }
                        if (!paymentData.paymentMethod) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Payment method is required'
                                }];
                        }
                        if (!performedBy) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Performer information is required'
                                }];
                        }
                        return [4 /*yield*/, this.paymentService.getPaymentStatusList(paymentData.semester, {
                                studentId: paymentData.studentId,
                                limit: 1
                            })];
                    case 1:
                        paymentsList = _a.sent();
                        if (paymentsList.total === 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Student not found in this semester'
                                }];
                        }
                        studentStatus = paymentsList.data[0];
                        if (studentStatus.remainingAmount <= 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Student has no outstanding balance'
                                }];
                        }
                        if (paymentData.amount > studentStatus.remainingAmount) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: "Payment amount cannot exceed outstanding balance (".concat(studentStatus.remainingAmount, ")")
                                }];
                        }
                        return [4 /*yield*/, this.paymentService.confirmPayment(paymentData, performedBy)];
                    case 2:
                        result = _a.sent();
                        if (!result.success) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.paymentService.getPaymentStatusList(paymentData.semester, {
                                studentId: paymentData.studentId,
                                limit: 1
                            })];
                    case 3:
                        updatedStatus = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    paymentId: result.paymentId,
                                    updatedStatus: updatedStatus.data[0] || null
                                },
                                message: result.message
                            }];
                    case 4: return [2 /*return*/, result];
                    case 5:
                        error_3 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to confirm payment: ".concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'Unknown error')
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get payment receipt with validation
     */
    FinancialPaymentBusiness.prototype.getPaymentReceipt = function (paymentId) {
        return __awaiter(this, void 0, void 0, function () {
            var receipt, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!paymentId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Payment ID is required'
                                }];
                        }
                        return [4 /*yield*/, this.paymentService.getPaymentReceipt(paymentId)];
                    case 1:
                        receipt = _a.sent();
                        if (!receipt) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Payment receipt not found'
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                data: receipt
                            }];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get payment receipt: ".concat((error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get payment audit trail with filters and validation
     */
    FinancialPaymentBusiness.prototype.getPaymentAudit = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, offset, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Validate date range
                        if ((filters === null || filters === void 0 ? void 0 : filters.dateFrom) && (filters === null || filters === void 0 ? void 0 : filters.dateTo) && filters.dateFrom > filters.dateTo) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Start date cannot be after end date'
                                }];
                        }
                        page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
                        limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 50;
                        offset = (page - 1) * limit;
                        return [4 /*yield*/, this.paymentService.getPaymentAudit(__assign(__assign({}, filters), { offset: offset, limit: limit }))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: result.data,
                                pagination: {
                                    total: result.total,
                                    page: page,
                                    limit: limit,
                                    totalPages: Math.ceil(result.total / limit)
                                }
                            }];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get payment audit: ".concat((error_5 === null || error_5 === void 0 ? void 0 : error_5.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate payment data before processing
     */
    FinancialPaymentBusiness.prototype.validatePaymentData = function (paymentData) {
        var errors = [];
        if (!paymentData.studentId) {
            errors.push('Student ID is required');
        }
        if (!paymentData.semester) {
            errors.push('Semester is required');
        }
        if (!paymentData.amount || paymentData.amount <= 0) {
            errors.push('Payment amount must be greater than 0');
        }
        if (!paymentData.paymentMethod) {
            errors.push('Payment method is required');
        }
        var validPaymentMethods = ['cash', 'bank_transfer', 'momo', 'vnpay'];
        if (paymentData.paymentMethod && !validPaymentMethods.includes(paymentData.paymentMethod)) {
            errors.push('Invalid payment method');
        }
        var validStatuses = ['PAID', 'PARTIAL', 'UNPAID'];
        if (paymentData.status && !validStatuses.includes(paymentData.status)) {
            errors.push('Invalid payment status');
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };
    /**
     * Get payment statistics for a specific period
     */
    FinancialPaymentBusiness.prototype.getPaymentStatistics = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var auditResult, payments, totalPayments, totalAmount, averagePayment, paymentMethodStats, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.paymentService.getPaymentAudit(__assign(__assign({}, filters), { limit: 10000 // Get all records for statistics
                             }))];
                    case 1:
                        auditResult = _a.sent();
                        payments = auditResult.data;
                        totalPayments = payments.length;
                        totalAmount = payments.reduce(function (sum, payment) { return sum + payment.amount; }, 0);
                        averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;
                        paymentMethodStats = payments.reduce(function (acc, payment) {
                            if (!acc[payment.paymentMethod]) {
                                acc[payment.paymentMethod] = { count: 0, amount: 0 };
                            }
                            acc[payment.paymentMethod].count++;
                            acc[payment.paymentMethod].amount += payment.amount;
                            return acc;
                        }, {});
                        return [2 /*return*/, {
                                success: true,
                                data: {
                                    totalPayments: totalPayments,
                                    totalAmount: totalAmount,
                                    averagePayment: Math.round(averagePayment * 100) / 100,
                                    paymentMethodStats: paymentMethodStats
                                }
                            }];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get payment statistics: ".concat((error_6 === null || error_6 === void 0 ? void 0 : error_6.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FinancialPaymentBusiness;
}());
exports.FinancialPaymentBusiness = FinancialPaymentBusiness;
