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
exports.updateTuitionSettings = exports.getTuitionSettings = exports.updatePaymentStatus = exports.getStudentPaymentStatus = exports.getAllPaymentStatus = exports.getDashboardData = void 0;
// src/business/financialBusiness/financialManager.ts
var financialService_1 = require("../../services/financialService/financialService");
// Dashboard
var getDashboardData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var totalStudents, paidStudents, partialStudents, unpaidStudents, totalRevenue, outstandingAmount, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4 /*yield*/, financialService_1.financialService.countTotalStudents()];
            case 1:
                totalStudents = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.countStudentsByPaymentStatus('PAID')];
            case 2:
                paidStudents = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.countStudentsByPaymentStatus('PARTIAL')];
            case 3:
                partialStudents = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.countStudentsByPaymentStatus('UNPAID')];
            case 4:
                unpaidStudents = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.getTotalRevenue()];
            case 5:
                totalRevenue = _a.sent();
                return [4 /*yield*/, financialService_1.financialService.getOutstandingAmount()];
            case 6:
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
            case 7:
                error_1 = _a.sent();
                console.error('Error in financial business layer:', error_1);
                throw error_1;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getDashboardData = getDashboardData;
// Payment Status Management
var getAllPaymentStatus = function (filters) { return __awaiter(void 0, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, financialService_1.financialService.getAllStudentPayments(filters)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_2 = _a.sent();
                console.error('Error getting all payment status:', error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllPaymentStatus = getAllPaymentStatus;
var getStudentPaymentStatus = function (studentId) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, financialService_1.financialService.getStudentPayment(studentId)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_3 = _a.sent();
                console.error('Error getting student payment status:', error_3);
                throw error_3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getStudentPaymentStatus = getStudentPaymentStatus;
var updatePaymentStatus = function (studentId, paymentData) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // Kiểm tra tính hợp lệ của dữ liệu
                if (!paymentData.paymentStatus || !paymentData.semester) {
                    throw new Error('Missing required payment data');
                }
                return [4 /*yield*/, financialService_1.financialService.updateStudentPayment(studentId, paymentData)];
            case 1: 
            // Cập nhật trạng thái thanh toán
            return [2 /*return*/, _a.sent()];
            case 2:
                error_4 = _a.sent();
                console.error('Error updating payment status:', error_4);
                throw error_4;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updatePaymentStatus = updatePaymentStatus;
// Tuition Adjustment
var getTuitionSettings = function (semester) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!semester) {
                    throw new Error('Semester is required');
                }
                return [4 /*yield*/, financialService_1.financialService.getTuitionSettings(semester)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_5 = _a.sent();
                console.error('Error getting tuition settings:', error_5);
                throw error_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTuitionSettings = getTuitionSettings;
var updateTuitionSettings = function (semester, settings) { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!semester || !settings) {
                    throw new Error('Semester and settings are required');
                }
                return [4 /*yield*/, financialService_1.financialService.updateTuitionSettings(semester, settings)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_6 = _a.sent();
                console.error('Error updating tuition settings:', error_6);
                throw error_6;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateTuitionSettings = updateTuitionSettings;
