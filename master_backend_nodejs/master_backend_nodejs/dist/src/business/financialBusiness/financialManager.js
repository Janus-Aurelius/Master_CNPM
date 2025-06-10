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
exports.createReceipt = exports.getReceiptById = exports.getAllReceipts = exports.deleteTuitionSetting = exports.FinancialManager = exports.validatePaymentConditions = exports.validateTuitionSetting = exports.calculateTuition = exports.getPaymentAuditTrail = exports.validatePayment = exports.generateFinancialReport = exports.updateTuitionSettings = exports.getTuitionSettings = exports.updatePaymentStatus = exports.getStudentPaymentStatus = exports.getAllPaymentStatus = exports.getFinancialAnalytics = exports.getDashboardData = void 0;
// src/business/financialBusiness/financialManager.ts
var financialService_1 = require("../../services/financialService/financialService");
var databaseService_1 = require("../../services/database/databaseService");
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
// Payment Status Management
var getAllPaymentStatus = function (filters) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, offset, whereConditions, queryParams, paramIndex, paymentData, totalCount, error_3, fallbackError_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 8]);
                page = filters.page || 1;
                limit = filters.limit || 50;
                offset = (page - 1) * limit;
                whereConditions = ['tr.semester = $1'];
                queryParams = [filters.semester || getCurrentSemester()];
                paramIndex = 2;
                if (filters.faculty) {
                    whereConditions.push("s.faculty = $".concat(paramIndex));
                    queryParams.push(filters.faculty);
                    paramIndex++;
                }
                if (filters.course) {
                    whereConditions.push("EXISTS (\n                SELECT 1 FROM tuition_course_items tci \n                WHERE tci.tuition_record_id = tr.id AND tci.course_code = $".concat(paramIndex, "\n            )"));
                    queryParams.push(filters.course);
                    paramIndex++;
                }
                if (filters.paymentStatus) {
                    whereConditions.push("tr.payment_status = $".concat(paramIndex));
                    queryParams.push(filters.paymentStatus);
                    paramIndex++;
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                tr.id,\n                tr.student_id,\n                s.full_name as student_name,\n                s.faculty,\n                s.program,\n                tr.semester,\n                tr.total_amount,\n                tr.paid_amount,\n                tr.outstanding_amount,\n                tr.payment_status,\n                tr.due_date,\n                tr.created_at,\n                COALESCE(\n                    JSON_AGG(\n                        JSON_BUILD_OBJECT(\n                            'course_code', tci.course_code,\n                            'course_name', tci.course_name,\n                            'credits', tci.credits,\n                            'fee_type', tci.fee_type,\n                            'amount', tci.amount\n                        )\n                    ) FILTER (WHERE tci.id IS NOT NULL), \n                    '[]'::json\n                ) as courses\n            FROM tuition_records tr\n            JOIN students s ON tr.student_id = s.student_id\n            LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id\n            WHERE ".concat(whereConditions.join(' AND '), "\n            GROUP BY tr.id, s.full_name, s.faculty, s.program\n            ORDER BY tr.created_at DESC\n            LIMIT $").concat(paramIndex, " OFFSET $").concat(paramIndex + 1, "\n        "), __spreadArray(__spreadArray([], queryParams, true), [limit, offset], false))];
            case 1:
                paymentData = _c.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT COUNT(DISTINCT tr.id) as total\n            FROM tuition_records tr\n            JOIN students s ON tr.student_id = s.student_id\n            ".concat(filters.course ? 'LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id' : '', "\n            WHERE ").concat(whereConditions.join(' AND '), "\n        "), queryParams.slice(0, -2))];
            case 2:
                totalCount = _c.sent();
                return [2 /*return*/, {
                        data: paymentData.map(function (item) { return (__assign(__assign({}, item), { total_amount: parseFloat(item.total_amount), paid_amount: parseFloat(item.paid_amount), outstanding_amount: parseFloat(item.outstanding_amount), courses: typeof item.courses === 'string' ? JSON.parse(item.courses) : item.courses })); }),
                        pagination: {
                            page: page,
                            limit: limit,
                            total: parseInt(((_a = totalCount[0]) === null || _a === void 0 ? void 0 : _a.total) || 0),
                            totalPages: Math.ceil(parseInt(((_b = totalCount[0]) === null || _b === void 0 ? void 0 : _b.total) || 0) / limit)
                        }
                    }];
            case 3:
                error_3 = _c.sent();
                console.error('Error getting all payment status:', error_3);
                _c.label = 4;
            case 4:
                _c.trys.push([4, 6, , 7]);
                return [4 /*yield*/, financialService_1.financialService.getAllStudentPayments(filters)];
            case 5: return [2 /*return*/, _c.sent()];
            case 6:
                fallbackError_2 = _c.sent();
                throw new errorHandler_1.AppError(500, 'Error retrieving payment status data');
            case 7: return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getAllPaymentStatus = getAllPaymentStatus;
var getStudentPaymentStatus = function (studentId) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentData, error_4, fallbackError_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 7]);
                if (!studentId) {
                    throw new errorHandler_1.AppError(400, 'Student ID is required');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                tr.*,\n                s.full_name as student_name,\n                s.faculty,\n                s.program,\n                s.email,\n                s.phone,\n                COALESCE(\n                    JSON_AGG(\n                        JSON_BUILD_OBJECT(\n                            'id', tci.id,\n                            'course_code', tci.course_code,\n                            'course_name', tci.course_name,\n                            'credits', tci.credits,\n                            'fee_type', tci.fee_type,\n                            'amount', tci.amount,\n                            'paid_amount', tci.paid_amount,\n                            'status', tci.status\n                        )\n                    ) FILTER (WHERE tci.id IS NOT NULL), \n                    '[]'::json\n                ) as courses,\n                COALESCE(\n                    (SELECT JSON_AGG(\n                        JSON_BUILD_OBJECT(\n                            'id', pr.id,\n                            'amount', pr.amount,\n                            'payment_date', pr.payment_date,\n                            'payment_method', pr.payment_method,\n                            'receipt_number', pr.receipt_number,\n                            'notes', pr.notes\n                        )\n                    ) FROM payment_receipts pr WHERE pr.tuition_record_id = tr.id),\n                    '[]'::json\n                ) as payment_history\n            FROM tuition_records tr\n            JOIN students s ON tr.student_id = s.student_id\n            LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id\n            WHERE tr.student_id = $1\n            GROUP BY tr.id, s.full_name, s.faculty, s.program, s.email, s.phone\n            ORDER BY tr.semester DESC\n        ", [studentId])];
            case 1:
                paymentData = _a.sent();
                if (paymentData.length === 0) {
                    throw new errorHandler_1.AppError(404, 'Student payment records not found');
                }
                return [2 /*return*/, paymentData.map(function (record) { return (__assign(__assign({}, record), { total_amount: parseFloat(record.total_amount), paid_amount: parseFloat(record.paid_amount), outstanding_amount: parseFloat(record.outstanding_amount), courses: typeof record.courses === 'string' ? JSON.parse(record.courses) : record.courses, payment_history: typeof record.payment_history === 'string' ? JSON.parse(record.payment_history) : record.payment_history })); })];
            case 2:
                error_4 = _a.sent();
                if (error_4 instanceof errorHandler_1.AppError)
                    throw error_4;
                console.error('Error getting student payment status:', error_4);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, financialService_1.financialService.getStudentPayment(studentId)];
            case 4: return [2 /*return*/, _a.sent()];
            case 5:
                fallbackError_3 = _a.sent();
                throw new errorHandler_1.AppError(500, 'Error retrieving student payment status');
            case 6: return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getStudentPaymentStatus = getStudentPaymentStatus;
var updatePaymentStatus = function (studentId, paymentData) { return __awaiter(void 0, void 0, void 0, function () {
    var currentRecord, record, newPaidAmount, newOutstandingAmount, receiptNumber, error_5, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 12, , 13]);
                // Validate input data
                if (!paymentData.studentId || !paymentData.semester) {
                    throw new errorHandler_1.AppError(400, 'Missing required payment data');
                }
                if (!['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(paymentData.status)) {
                    throw new errorHandler_1.AppError(400, 'Invalid payment status');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT * FROM tuition_records \n            WHERE student_id = $1 AND semester = $2\n        ", [studentId, paymentData.semester])];
            case 1:
                currentRecord = _a.sent();
                if (currentRecord.length === 0) {
                    throw new errorHandler_1.AppError(404, 'Tuition record not found');
                }
                record = currentRecord[0];
                newPaidAmount = parseFloat(record.paid_amount) + paymentData.amount;
                newOutstandingAmount = parseFloat(record.total_amount) - newPaidAmount;
                // Validate payment amount
                if (paymentData.amount < 0) {
                    throw new errorHandler_1.AppError(400, 'Payment amount cannot be negative');
                }
                if (paymentData.amount > newOutstandingAmount) {
                    throw new errorHandler_1.AppError(400, 'Payment amount exceeds outstanding amount');
                }
                // Start transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('BEGIN')];
            case 2:
                // Start transaction
                _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, 9, , 11]);
                // Update tuition record
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE tuition_records \n                SET \n                    paid_amount = $1,\n                    outstanding_amount = $2,\n                    payment_status = $3,\n                    updated_at = NOW()\n                WHERE student_id = $4 AND semester = $5\n            ", [
                        newPaidAmount,
                        Math.max(0, newOutstandingAmount),
                        paymentData.status,
                        studentId,
                        paymentData.semester
                    ])];
            case 4:
                // Update tuition record
                _a.sent();
                receiptNumber = paymentData.receiptNumber;
                if (!(paymentData.amount > 0 && !receiptNumber)) return [3 /*break*/, 6];
                receiptNumber = "RCP-".concat(Date.now(), "-").concat(studentId);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    INSERT INTO payment_receipts (\n                        tuition_record_id,\n                        student_id,\n                        amount,\n                        payment_method,\n                        receipt_number,\n                        payment_date,\n                        notes,\n                        created_at\n                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())\n                ", [
                        record.id,
                        studentId,
                        paymentData.amount,
                        paymentData.paymentMethod,
                        receiptNumber,
                        paymentData.paymentDate,
                        paymentData.notes || ''
                    ])];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: 
            // Create detailed audit log
            return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO payment_audit_logs (\n                    tuition_record_id,\n                    student_id,\n                    action,\n                    amount,\n                    previous_amount,\n                    previous_status,\n                    new_status,\n                    payment_method,\n                    receipt_number,\n                    notes,\n                    performed_by,\n                    created_at\n                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())\n            ", [
                    record.id,
                    studentId,
                    'PAYMENT_UPDATED',
                    paymentData.amount,
                    record.paid_amount,
                    record.payment_status,
                    paymentData.status,
                    paymentData.paymentMethod,
                    receiptNumber,
                    paymentData.notes || '',
                    'financial-system'
                ])];
            case 7:
                // Create detailed audit log
                _a.sent();
                // Commit transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('COMMIT')];
            case 8:
                // Commit transaction
                _a.sent();
                return [2 /*return*/, {
                        success: true,
                        message: 'Payment status updated successfully',
                        receiptNumber: receiptNumber,
                        audit: {
                            action: 'PAYMENT_UPDATED',
                            amount: paymentData.amount,
                            previousAmount: record.paid_amount,
                            previousStatus: record.payment_status,
                            newStatus: paymentData.status,
                            timestamp: new Date().toISOString()
                        }
                    }];
            case 9:
                error_5 = _a.sent();
                // Rollback on error
                return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
            case 10:
                // Rollback on error
                _a.sent();
                throw error_5;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_6 = _a.sent();
                if (error_6 instanceof errorHandler_1.AppError)
                    throw error_6;
                console.error('Error updating payment status:', error_6);
                throw new errorHandler_1.AppError(500, 'Error updating payment status');
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.updatePaymentStatus = updatePaymentStatus;
// Tuition Management Functions
var getTuitionSettings = function (semester) { return __awaiter(void 0, void 0, void 0, function () {
    var settings, baseSetting, fees, error_7, fallbackError_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 7]);
                if (!semester) {
                    throw new errorHandler_1.AppError(400, 'Semester is required');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                ts.*,\n                tf.fee_type,\n                tf.amount as fee_amount,\n                tf.description as fee_description,\n                tf.is_mandatory\n            FROM tuition_settings ts\n            LEFT JOIN tuition_fees tf ON ts.id = tf.tuition_setting_id\n            WHERE ts.semester = $1\n            ORDER BY tf.fee_type\n        ", [semester])];
            case 1:
                settings = _a.sent();
                if (settings.length === 0) {
                    // Return default settings if none found
                    return [2 /*return*/, {
                            semester: semester,
                            baseTuitionPerCredit: 500000,
                            fees: [],
                            discounts: [],
                            paymentDeadlines: {
                                early: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                                regular: new Date(new Date().setMonth(new Date().getMonth() + 2)),
                                late: new Date(new Date().setMonth(new Date().getMonth() + 3))
                            }
                        }];
                }
                baseSetting = settings[0];
                fees = settings.filter(function (s) { return s.fee_type; }).map(function (s) { return ({
                    type: s.fee_type,
                    amount: parseFloat(s.fee_amount),
                    description: s.fee_description,
                    mandatory: s.is_mandatory
                }); });
                return [2 /*return*/, {
                        semester: semester,
                        baseTuitionPerCredit: parseFloat(baseSetting.base_tuition_per_credit),
                        fees: fees,
                        discounts: baseSetting.discounts ? JSON.parse(baseSetting.discounts) : [],
                        paymentDeadlines: baseSetting.payment_deadlines ? JSON.parse(baseSetting.payment_deadlines) : {},
                        settings: {
                            lateFeePercentage: parseFloat(baseSetting.late_fee_percentage || 0),
                            earlyDiscountPercentage: parseFloat(baseSetting.early_discount_percentage || 0)
                        }
                    }];
            case 2:
                error_7 = _a.sent();
                if (error_7 instanceof errorHandler_1.AppError)
                    throw error_7;
                console.error('Error getting tuition settings:', error_7);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, financialService_1.financialService.getTuitionSettings(semester)];
            case 4: return [2 /*return*/, _a.sent()];
            case 5:
                fallbackError_4 = _a.sent();
                throw new errorHandler_1.AppError(500, 'Error retrieving tuition settings');
            case 6: return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getTuitionSettings = getTuitionSettings;
var updateTuitionSettings = function (semester, settings) { return __awaiter(void 0, void 0, void 0, function () {
    var existingSettings, settingId, newSetting, _i, _a, fee, error_8, fallbackError_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 17]);
                if (!semester || !settings) {
                    throw new errorHandler_1.AppError(400, 'Semester and settings are required');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT id FROM tuition_settings WHERE semester = $1\n        ", [semester])];
            case 1:
                existingSettings = _b.sent();
                settingId = void 0;
                if (!(existingSettings.length > 0)) return [3 /*break*/, 3];
                settingId = existingSettings[0].id;
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE tuition_settings \n                SET \n                    base_tuition_per_credit = $1,\n                    late_fee_percentage = $2,\n                    early_discount_percentage = $3,\n                    discounts = $4,\n                    payment_deadlines = $5,\n                    updated_at = NOW()\n                WHERE semester = $6\n            ", [
                        settings.baseTuitionPerCredit,
                        settings.lateFeePercentage || 0,
                        settings.earlyDiscountPercentage || 0,
                        JSON.stringify(settings.discounts || []),
                        JSON.stringify(settings.paymentDeadlines || {}),
                        semester
                    ])];
            case 2:
                _b.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO tuition_settings (\n                    semester,\n                    base_tuition_per_credit,\n                    late_fee_percentage,\n                    early_discount_percentage,\n                    discounts,\n                    payment_deadlines,\n                    created_at\n                ) VALUES ($1, $2, $3, $4, $5, $6, NOW())\n                RETURNING id\n            ", [
                    semester,
                    settings.baseTuitionPerCredit,
                    settings.lateFeePercentage || 0,
                    settings.earlyDiscountPercentage || 0,
                    JSON.stringify(settings.discounts || []),
                    JSON.stringify(settings.paymentDeadlines || {})
                ])];
            case 4:
                newSetting = _b.sent();
                settingId = newSetting[0].id;
                _b.label = 5;
            case 5:
                if (!(settings.fees && Array.isArray(settings.fees))) return [3 /*break*/, 10];
                // Delete existing fees
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                DELETE FROM tuition_fees WHERE tuition_setting_id = $1\n            ", [settingId])];
            case 6:
                // Delete existing fees
                _b.sent();
                _i = 0, _a = settings.fees;
                _b.label = 7;
            case 7:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                fee = _a[_i];
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    INSERT INTO tuition_fees (\n                        tuition_setting_id,\n                        fee_type,\n                        amount,\n                        description,\n                        is_mandatory,\n                        created_at\n                    ) VALUES ($1, $2, $3, $4, $5, NOW())\n                ", [
                        settingId,
                        fee.type,
                        fee.amount,
                        fee.description || '',
                        fee.mandatory || false
                    ])];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 7];
            case 10: 
            // Log the settings update
            return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            INSERT INTO audit_logs (\n                action_type,\n                details,\n                user_id,\n                created_at\n            ) VALUES ($1, $2, $3, NOW())\n        ", [
                    'TUITION_SETTINGS_UPDATED',
                    "Tuition settings updated for semester ".concat(semester),
                    'financial-system'
                ])];
            case 11:
                // Log the settings update
                _b.sent();
                return [2 /*return*/, {
                        success: true,
                        message: 'Tuition settings updated successfully'
                    }];
            case 12:
                error_8 = _b.sent();
                if (error_8 instanceof errorHandler_1.AppError)
                    throw error_8;
                console.error('Error updating tuition settings:', error_8);
                _b.label = 13;
            case 13:
                _b.trys.push([13, 15, , 16]);
                return [4 /*yield*/, financialService_1.financialService.updateTuitionSettings(semester, settings)];
            case 14: return [2 /*return*/, _b.sent()];
            case 15:
                fallbackError_5 = _b.sent();
                throw new errorHandler_1.AppError(500, 'Error updating tuition settings');
            case 16: return [3 /*break*/, 17];
            case 17: return [2 /*return*/];
        }
    });
}); };
exports.updateTuitionSettings = updateTuitionSettings;
// Financial Reports
var generateFinancialReport = function (reportType, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var semester, _a, error_9;
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
                error_9 = _b.sent();
                if (error_9 instanceof errorHandler_1.AppError)
                    throw error_9;
                console.error('Error generating financial report:', error_9);
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
var validatePayment = function (studentId, amount, semester) { return __awaiter(void 0, void 0, void 0, function () {
    var record, errors, warnings, expectedAmount, difference, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT * FROM tuition_records \n            WHERE student_id = $1 AND semester = $2\n        ", [studentId, semester])];
            case 1:
                record = _a.sent();
                if (!record) {
                    return [2 /*return*/, {
                            isValid: false,
                            errors: ['Tuition record not found'],
                            warnings: [],
                            details: {
                                amount: amount,
                                expectedAmount: 0,
                                difference: amount,
                                status: 'INVALID'
                            }
                        }];
                }
                errors = [];
                warnings = [];
                expectedAmount = parseFloat(record.outstanding_amount);
                difference = expectedAmount - amount;
                if (amount < 0) {
                    errors.push('Payment amount cannot be negative');
                }
                if (amount > expectedAmount) {
                    errors.push('Payment amount exceeds outstanding amount');
                }
                if (difference > 0 && difference < 100000) { // Less than 100k VND difference
                    warnings.push("Payment amount is less than outstanding amount by ".concat(difference.toLocaleString(), " VND"));
                }
                return [2 /*return*/, {
                        isValid: errors.length === 0,
                        errors: errors,
                        warnings: warnings,
                        details: {
                            amount: amount,
                            expectedAmount: expectedAmount,
                            difference: difference,
                            status: errors.length > 0 ? 'INVALID' : warnings.length > 0 ? 'WARNING' : 'VALID'
                        }
                    }];
            case 2:
                error_10 = _a.sent();
                console.error('Error validating payment:', error_10);
                return [2 /*return*/, {
                        isValid: false,
                        errors: ['Error validating payment'],
                        warnings: [],
                        details: {
                            amount: amount,
                            expectedAmount: 0,
                            difference: amount,
                            status: 'INVALID'
                        }
                    }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.validatePayment = validatePayment;
var getPaymentAuditTrail = function (studentId, semester) { return __awaiter(void 0, void 0, void 0, function () {
    var auditLogs, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                id,\n                tuition_record_id,\n                student_id,\n                action,\n                amount,\n                previous_amount,\n                previous_status,\n                new_status,\n                payment_method,\n                receipt_number,\n                notes,\n                performed_by,\n                created_at as timestamp\n            FROM payment_audit_logs\n            WHERE student_id = $1 \n            AND tuition_record_id IN (\n                SELECT id FROM tuition_records \n                WHERE student_id = $1 AND semester = $2\n            )\n            ORDER BY created_at DESC\n        ", [studentId, semester])];
            case 1:
                auditLogs = _a.sent();
                return [2 /*return*/, auditLogs.map(function (log) { return ({
                        id: log.id,
                        tuitionRecordId: log.tuition_record_id,
                        studentId: log.student_id,
                        action: log.action,
                        amount: parseFloat(log.amount),
                        previousAmount: log.previous_amount ? parseFloat(log.previous_amount) : undefined,
                        previousStatus: log.previous_status,
                        newStatus: log.new_status,
                        paymentMethod: log.payment_method,
                        receiptNumber: log.receipt_number,
                        notes: log.notes,
                        performedBy: log.performed_by,
                        timestamp: log.timestamp
                    }); })];
            case 2:
                error_11 = _a.sent();
                console.error('Error getting payment audit trail:', error_11);
                throw new errorHandler_1.AppError(500, 'Error retrieving payment audit trail');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPaymentAuditTrail = getPaymentAuditTrail;
var calculateTuition = function (studentId, semester, courses) { return __awaiter(void 0, void 0, void 0, function () {
    var settings_1, baseAmount_1, feeItems, studentInfo_1, applicableDiscounts, discounts, feesTotal, discountsTotal, totalAmount, finalAmount, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, exports.getTuitionSettings)(semester)];
            case 1:
                settings_1 = _a.sent();
                baseAmount_1 = courses.reduce(function (total, course) { return total + (course.credits * settings_1.baseTuitionPerCredit); }, 0);
                feeItems = settings_1.fees.map(function (fee) { return ({
                    type: fee.type,
                    amount: fee.amount,
                    description: fee.description,
                    isMandatory: fee.mandatory
                }); });
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                sv.masosinhvien,\n                sv.vungxa,\n                sv.dienchinhsach,\n                sv.xeploaihocbong\n            FROM sinhvien sv\n            WHERE sv.masosinhvien = $1\n        ", [studentId])];
            case 2:
                studentInfo_1 = _a.sent();
                applicableDiscounts = settings_1.discounts
                    .filter(function (discount) {
                    // Check if student meets discount conditions
                    if (discount.conditions) {
                        return discount.conditions.every(function (condition) {
                            switch (condition.type) {
                                case 'remote_area':
                                    return (studentInfo_1 === null || studentInfo_1 === void 0 ? void 0 : studentInfo_1.vungxa) === condition.value;
                                case 'poor_family':
                                    return (studentInfo_1 === null || studentInfo_1 === void 0 ? void 0 : studentInfo_1.dienchinhsach) === condition.value;
                                case 'excellent_student':
                                    return (studentInfo_1 === null || studentInfo_1 === void 0 ? void 0 : studentInfo_1.xeploaihocbong) === condition.value;
                                default:
                                    return false;
                            }
                        });
                    }
                    return true;
                })
                    .sort(function (a, b) { return b.percentage - a.percentage; }) // Sort by highest percentage first
                    .slice(0, settings_1.settings.maxTotalDiscount);
                discounts = applicableDiscounts.map(function (discount) { return ({
                    type: discount.type,
                    percentage: discount.percentage,
                    amount: (baseAmount_1 * discount.percentage) / 100,
                    description: discount.description,
                    isPriority: discount.priority
                }); });
                feesTotal = feeItems.reduce(function (total, fee) { return total + fee.amount; }, 0);
                discountsTotal = discounts.reduce(function (total, discount) { return total + discount.amount; }, 0);
                totalAmount = baseAmount_1 + feesTotal;
                finalAmount = Math.max(0, totalAmount - discountsTotal);
                return [2 /*return*/, {
                        baseAmount: baseAmount_1,
                        fees: feeItems,
                        discounts: discounts,
                        feesTotal: feesTotal,
                        discountsTotal: discountsTotal,
                        totalAmount: totalAmount,
                        finalAmount: finalAmount,
                        adjustments: [],
                        dueDate: new Date().toISOString()
                    }];
            case 3:
                error_12 = _a.sent();
                console.error('Error calculating tuition:', error_12);
                throw new Error('Failed to calculate tuition');
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.calculateTuition = calculateTuition;
// Tuition Settings Management
var validateTuitionSetting = function (setting) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, overlappingSettings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = [];
                // Validate required fields
                if (!setting.faculty)
                    errors.push('Faculty is required');
                if (!setting.program)
                    errors.push('Program is required');
                if (!setting.semester)
                    errors.push('Semester is required');
                if (!setting.academicYear)
                    errors.push('Academic year is required');
                if (!setting.effectiveDate)
                    errors.push('Effective date is required');
                if (!setting.expiryDate)
                    errors.push('Expiry date is required');
                // Validate credit cost
                if (typeof setting.creditCost !== 'number' || setting.creditCost <= 0) {
                    errors.push('Credit cost must be a positive number');
                }
                // Validate dates
                if (setting.effectiveDate >= setting.expiryDate) {
                    errors.push('Effective date must be before expiry date');
                }
                // Validate semester format
                if (!/^(Spring|Summer|Fall)\s\d{4}$/.test(setting.semester)) {
                    errors.push('Invalid semester format. Expected format: Spring/Summer/Fall YYYY');
                }
                // Validate academic year format
                if (!/^\d{4}-\d{4}$/.test(setting.academicYear)) {
                    errors.push('Invalid academic year format. Expected format: YYYY-YYYY');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        SELECT * FROM tuition_settings \n        WHERE faculty = $1 \n        AND program = $2 \n        AND semester = $3 \n        AND academic_year = $4\n        AND (\n            (effective_date <= $5 AND expiry_date >= $5)\n            OR (effective_date <= $6 AND expiry_date >= $6)\n            OR (effective_date >= $5 AND expiry_date <= $6)\n        )\n    ", [
                        setting.faculty,
                        setting.program,
                        setting.semester,
                        setting.academicYear,
                        setting.effectiveDate,
                        setting.expiryDate
                    ])];
            case 1:
                overlappingSettings = _a.sent();
                if (overlappingSettings.length > 0) {
                    errors.push('Tuition setting overlaps with existing settings for the same faculty and program');
                }
                return [2 /*return*/, {
                        isValid: errors.length === 0,
                        errors: errors
                    }];
        }
    });
}); };
exports.validateTuitionSetting = validateTuitionSetting;
// Payment Conditions Validation
var validatePaymentConditions = function (studentId, semester, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, warnings, paymentHistory, tuitionRecord_1, outstandingAmount, latePayments, recentPayments, holds, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = [];
                warnings = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT * FROM payment_receipts \n            WHERE student_id = $1 \n            ORDER BY payment_date DESC\n        ", [studentId])];
            case 2:
                paymentHistory = _a.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT * FROM tuition_records \n            WHERE student_id = $1 AND semester = $2\n        ", [studentId, semester])];
            case 3:
                tuitionRecord_1 = _a.sent();
                if (!tuitionRecord_1) {
                    errors.push('No tuition record found for the specified semester');
                    return [2 /*return*/, { isValid: false, errors: errors, warnings: warnings }];
                }
                outstandingAmount = parseFloat(tuitionRecord_1.outstanding_amount);
                if (amount > outstandingAmount) {
                    errors.push("Payment amount (".concat(amount, ") exceeds outstanding amount (").concat(outstandingAmount, ")"));
                }
                latePayments = paymentHistory.filter(function (payment) {
                    var paymentDate = new Date(payment.payment_date);
                    var dueDate = new Date(tuitionRecord_1.due_date);
                    return paymentDate > dueDate;
                });
                if (latePayments.length > 0) {
                    warnings.push('Student has history of late payments');
                }
                recentPayments = paymentHistory.filter(function (payment) {
                    var paymentDate = new Date(payment.payment_date);
                    var thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return paymentDate >= thirtyDaysAgo;
                });
                if (recentPayments.length >= 3) {
                    warnings.push('Student has made multiple payments in the last 30 days');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT * FROM payment_holds \n            WHERE student_id = $1 AND is_active = true\n        ", [studentId])];
            case 4:
                holds = _a.sent();
                if (holds.length > 0) {
                    errors.push('Student has active payment holds');
                }
                return [2 /*return*/, {
                        isValid: errors.length === 0,
                        errors: errors,
                        warnings: warnings
                    }];
            case 5:
                error_13 = _a.sent();
                console.error('Error validating payment conditions:', error_13);
                errors.push('Error validating payment conditions');
                return [2 /*return*/, { isValid: false, errors: errors, warnings: warnings }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.validatePaymentConditions = validatePaymentConditions;
var FinancialManager = /** @class */ (function () {
    function FinancialManager() {
    }
    return FinancialManager;
}());
exports.FinancialManager = FinancialManager;
exports.default = new FinancialManager();
// Tuition Settings Management
var deleteTuitionSetting = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            DELETE FROM tuition_settings WHERE id = $1\n        ", [id])];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                console.error('Error deleting tuition setting:', error_14);
                throw new errorHandler_1.AppError(500, 'Error deleting tuition setting');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteTuitionSetting = deleteTuitionSetting;
// Payment Receipts Management
var getAllReceipts = function (studentId, semester) { return __awaiter(void 0, void 0, void 0, function () {
    var whereConditions, queryParams, paramIndex, whereClause, receipts, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                whereConditions = [];
                queryParams = [];
                paramIndex = 1;
                if (studentId) {
                    whereConditions.push("student_id = $".concat(paramIndex));
                    queryParams.push(studentId);
                    paramIndex++;
                }
                if (semester) {
                    whereConditions.push("semester = $".concat(paramIndex));
                    queryParams.push(semester);
                    paramIndex++;
                }
                whereClause = whereConditions.length > 0
                    ? "WHERE ".concat(whereConditions.join(' AND '))
                    : '';
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT * FROM payment_receipts\n            ".concat(whereClause, "\n            ORDER BY payment_date DESC\n        "), queryParams)];
            case 1:
                receipts = _a.sent();
                return [2 /*return*/, receipts];
            case 2:
                error_15 = _a.sent();
                console.error('Error getting receipts:', error_15);
                throw new errorHandler_1.AppError(500, 'Error retrieving receipts');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllReceipts = getAllReceipts;
var getReceiptById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var receipt, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT * FROM payment_receipts WHERE id = $1\n        ", [id])];
            case 1:
                receipt = _a.sent();
                return [2 /*return*/, receipt];
            case 2:
                error_16 = _a.sent();
                console.error('Error getting receipt:', error_16);
                throw new errorHandler_1.AppError(500, 'Error retrieving receipt');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getReceiptById = getReceiptById;
var createReceipt = function (receiptData) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            INSERT INTO payment_receipts (\n                student_id,\n                amount,\n                payment_method,\n                receipt_number,\n                payment_date,\n                notes,\n                created_at\n            ) VALUES ($1, $2, $3, $4, $5, $6, NOW())\n            RETURNING *\n        ", [
                        receiptData.studentId,
                        receiptData.amount,
                        receiptData.paymentMethod,
                        receiptData.receiptNumber,
                        receiptData.paymentDate,
                        receiptData.notes
                    ])];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result[0]];
            case 2:
                error_17 = _a.sent();
                console.error('Error creating receipt:', error_17);
                throw new errorHandler_1.AppError(500, 'Error creating receipt');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createReceipt = createReceipt;
