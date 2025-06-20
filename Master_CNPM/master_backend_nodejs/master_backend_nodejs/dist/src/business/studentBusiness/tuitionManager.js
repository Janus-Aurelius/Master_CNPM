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
var tuitionService_1 = require("../../services/studentService/tuitionService");
var databaseService_1 = require("../../services/database/databaseService");
/**
 * Business layer for student tuition management
 * Handles business rules and validation for tuition-related operations
 */
var TuitionManager = /** @class */ (function () {
    function TuitionManager() {
    }
    /**
     * Get comprehensive tuition status for a student in current semester
     * Includes business rules for payment deadlines and warnings
     */
    TuitionManager.prototype.getStudentTuitionStatus = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var semester, _a, tuitionStatus, statusWithWarnings, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!studentId) {
                            throw new Error('Student ID is required');
                        }
                        _a = semesterId;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getCurrentSemester()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        semester = _a;
                        return [4 /*yield*/, tuitionService_1.tuitionService.getTuitionStatus(studentId, semester)];
                    case 3:
                        tuitionStatus = _b.sent();
                        if (!tuitionStatus) {
                            return [2 /*return*/, null];
                        }
                        statusWithWarnings = this.applyPaymentDeadlineRules(tuitionStatus);
                        return [2 /*return*/, statusWithWarnings];
                    case 4:
                        error_1 = _b.sent();
                        console.error('Error in tuition manager getting status:', error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }; /**
     * Process tuition payment with business validation
     */
    TuitionManager.prototype.processPayment = function (paymentRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentResponse, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // Validate payment request
                        this.validatePaymentRequest(paymentRequest); // Check if payment is allowed (not overpaying, valid amount, etc.)
                        return [4 /*yield*/, this.validatePaymentAmount(paymentRequest)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, tuitionService_1.tuitionService.makePayment(paymentRequest)];
                    case 2:
                        paymentResponse = _a.sent();
                        // Apply post-payment business rules (notifications, status updates, etc.)
                        return [4 /*yield*/, this.applyPostPaymentRules(paymentResponse)];
                    case 3:
                        // Apply post-payment business rules (notifications, status updates, etc.)
                        _a.sent();
                        return [2 /*return*/, paymentResponse];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error in tuition manager processing payment:', error_2);
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    }; /**
     * Get payment history with business formatting
     */
    TuitionManager.prototype.getPaymentHistory = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var semester, _a, registration, history_1, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!studentId) {
                            throw new Error('Student ID is required');
                        }
                        _a = semesterId;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getCurrentSemester()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        semester = _a;
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy as \"registrationId\"\n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semester])];
                    case 3:
                        registration = _b.sent();
                        if (!registration) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, tuitionService_1.tuitionService.getPaymentHistory(registration.registrationId)];
                    case 4:
                        history_1 = _b.sent();
                        // Apply business formatting and categorization
                        return [2 /*return*/, this.formatPaymentHistory(history_1)];
                    case 5:
                        error_3 = _b.sent();
                        console.error('Error in tuition manager getting payment history:', error_3);
                        throw error_3;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get recent payments for dashboard (last 5 transactions)
     */
    TuitionManager.prototype.getRecentPayments = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var allHistory, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getPaymentHistory(studentId)];
                    case 1:
                        allHistory = _a.sent();
                        return [2 /*return*/, allHistory.slice(0, 5)]; // Return only the 5 most recent
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting recent payments:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get tuition summary for financial reporting
     */
    TuitionManager.prototype.getTuitionSummary = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var semester, _a, status_1, summary, error_5;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, , 5]);
                        _a = semesterId;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getCurrentSemester()];
                    case 1:
                        _a = (_c.sent());
                        _c.label = 2;
                    case 2:
                        semester = _a;
                        return [4 /*yield*/, this.getStudentTuitionStatus(studentId, semester)];
                    case 3:
                        status_1 = _c.sent();
                        if (!status_1) {
                            return [2 /*return*/, null];
                        }
                        summary = {
                            studentId: status_1.registration.studentId,
                            semesterId: semester,
                            totalTuition: status_1.registration.registrationAmount,
                            totalPaid: status_1.registration.paidAmount,
                            remainingBalance: status_1.registration.remainingAmount,
                            totalDiscount: ((_b = status_1.discount) === null || _b === void 0 ? void 0 : _b.amount) || 0,
                            paymentStatus: this.calculateOverallPaymentStatus(status_1),
                            registrationCount: 1, // One registration per semester
                            lastPaymentDate: status_1.paymentHistory.length > 0 ?
                                status_1.paymentHistory
                                    .sort(function (a, b) { return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(); })[0]
                                    .paymentDate : undefined
                        };
                        return [2 /*return*/, summary];
                    case 4:
                        error_5 = _c.sent();
                        console.error('Error getting tuition summary:', error_5);
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get tuition overview for dashboard display
     */
    TuitionManager.prototype.getTuitionOverview = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var summary, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getTuitionSummary(studentId)];
                    case 1:
                        summary = _a.sent();
                        if (!summary) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                totalOwed: summary.remainingBalance,
                                totalPaid: summary.totalPaid,
                                paymentStatus: summary.paymentStatus,
                                nextPaymentDue: summary.lastPaymentDate
                            }];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error getting tuition overview:', error_6);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get current active semester
     */
    TuitionManager.prototype.getCurrentSemester = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentSemester, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT setting_value FROM system_settings WHERE setting_key = 'current_semester'\n            ")];
                    case 1:
                        currentSemester = _a.sent();
                        return [2 /*return*/, (currentSemester === null || currentSemester === void 0 ? void 0 : currentSemester.setting_value) || '2024-1'];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error getting current semester:', error_7);
                        return [2 /*return*/, '2024-1']; // Fallback
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Apply payment deadline rules and warnings
     */
    TuitionManager.prototype.applyPaymentDeadlineRules = function (status) {
        var currentDate = new Date();
        var warningDays = 7; // Warn 7 days before deadline
        // For now, we don't have a due date in the schema, but this is where you'd add it
        // You could add business logic to calculate due dates based on registration date
        return status;
    };
    /**
     * Validate payment request
     */
    TuitionManager.prototype.validatePaymentRequest = function (request) {
        if (!request.registrationId) {
            throw new Error('Registration ID is required');
        }
        if (!request.amount || request.amount <= 0) {
            throw new Error('Payment amount must be greater than 0');
        }
        if (!request.paymentMethod) {
            throw new Error('Payment method is required');
        }
    }; /**
     * Validate payment amount against outstanding balance
     */
    TuitionManager.prototype.validatePaymentAmount = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var registration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                MaSoSinhVien as \"studentId\",\n                MaHocKy as \"semesterId\", \n                SoTienConLai as \"remainingAmount\"\n            FROM PHIEUDANGKY \n            WHERE MaPhieuDangKy = $1\n        ", [request.registrationId])];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            throw new Error('Registration not found');
                        }
                        if (request.amount > registration.remainingAmount) {
                            throw new Error('Payment amount exceeds remaining balance');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Apply post-payment business rules
     */
    TuitionManager.prototype.applyPostPaymentRules = function (paymentResponse) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Here you could add:
                // - Send payment confirmation email
                // - Update student status if fully paid
                // - Generate receipt
                // - Log payment for audit
                // - Trigger notifications to financial department
                console.log("Payment processed successfully, payment ID: ".concat(paymentResponse.paymentId, ", amount: ").concat(paymentResponse.newPaidAmount));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Format payment history with business logic
     */
    TuitionManager.prototype.formatPaymentHistory = function (history) {
        return history.map(function (payment) { return (__assign({}, payment)); });
    };
    /**
     * Calculate overall payment status
     */
    TuitionManager.prototype.calculateOverallPaymentStatus = function (status) {
        if (status.registration.remainingAmount <= 0) {
            return 'paid';
        }
        if (status.registration.paidAmount > 0) {
            return 'partial';
        }
        // Here you could add logic to check if overdue based on dates
        return 'unpaid';
    };
    return TuitionManager;
}());
exports.default = new TuitionManager();
