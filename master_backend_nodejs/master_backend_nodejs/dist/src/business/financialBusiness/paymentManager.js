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
exports.createReceipt = exports.getReceiptById = exports.getAllReceipts = exports.validatePaymentConditions = exports.getPaymentAuditTrail = exports.validatePayment = exports.updatePaymentStatus = exports.getStudentPaymentStatus = exports.getAllPaymentStatus = void 0;
// src/business/financialBusiness/paymentManager.ts
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
// Payment Status Management
var getAllPaymentStatus = function (filters) { return __awaiter(void 0, void 0, void 0, function () {
    var page, limit, offset, whereConditions, queryParams, paramIndex, paymentData, totalCount, error_1, fallbackError_1;
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
                error_1 = _c.sent();
                console.error('Error getting all payment status:', error_1);
                _c.label = 4;
            case 4:
                _c.trys.push([4, 6, , 7]);
                return [4 /*yield*/, financialService_1.financialService.getAllStudentPayments(filters)];
            case 5: return [2 /*return*/, _c.sent()];
            case 6:
                fallbackError_1 = _c.sent();
                throw new errorHandler_1.AppError(500, 'Error retrieving payment status data');
            case 7: return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getAllPaymentStatus = getAllPaymentStatus;
var getStudentPaymentStatus = function (studentId) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentData, error_2, fallbackError_2;
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
                error_2 = _a.sent();
                if (error_2 instanceof errorHandler_1.AppError)
                    throw error_2;
                console.error('Error getting student payment status:', error_2);
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, financialService_1.financialService.getStudentPayment(studentId)];
            case 4: return [2 /*return*/, _a.sent()];
            case 5:
                fallbackError_2 = _a.sent();
                throw new errorHandler_1.AppError(500, 'Error retrieving student payment status');
            case 6: return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getStudentPaymentStatus = getStudentPaymentStatus;
var updatePaymentStatus = function (studentId, paymentData) { return __awaiter(void 0, void 0, void 0, function () {
    var currentRecord, record, newPaidAmount, newOutstandingAmount, receiptNumber, error_3, error_4;
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
                error_3 = _a.sent();
                // Rollback on error
                return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
            case 10:
                // Rollback on error
                _a.sent();
                throw error_3;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_4 = _a.sent();
                if (error_4 instanceof errorHandler_1.AppError)
                    throw error_4;
                console.error('Error updating payment status:', error_4);
                throw new errorHandler_1.AppError(500, 'Error updating payment status');
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.updatePaymentStatus = updatePaymentStatus;
var validatePayment = function (studentId, amount, semester) { return __awaiter(void 0, void 0, void 0, function () {
    var record, errors, warnings, expectedAmount, difference, error_5;
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
                error_5 = _a.sent();
                console.error('Error validating payment:', error_5);
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
    var auditLogs, error_6;
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
                error_6 = _a.sent();
                console.error('Error getting payment audit trail:', error_6);
                throw new errorHandler_1.AppError(500, 'Error retrieving payment audit trail');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPaymentAuditTrail = getPaymentAuditTrail;
// Payment Conditions Validation
var validatePaymentConditions = function (studentId, semester, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, warnings, paymentHistory, tuitionRecord_1, outstandingAmount, latePayments, recentPayments, holds, error_7;
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
                error_7 = _a.sent();
                console.error('Error validating payment conditions:', error_7);
                errors.push('Error validating payment conditions');
                return [2 /*return*/, { isValid: false, errors: errors, warnings: warnings }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.validatePaymentConditions = validatePaymentConditions;
// Payment Receipts Management
var getAllReceipts = function (studentId, semester) { return __awaiter(void 0, void 0, void 0, function () {
    var whereConditions, queryParams, paramIndex, whereClause, receipts, error_8;
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
                error_8 = _a.sent();
                console.error('Error getting receipts:', error_8);
                throw new errorHandler_1.AppError(500, 'Error retrieving receipts');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllReceipts = getAllReceipts;
var getReceiptById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var receipt, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT * FROM payment_receipts WHERE id = $1\n        ", [id])];
            case 1:
                receipt = _a.sent();
                return [2 /*return*/, receipt];
            case 2:
                error_9 = _a.sent();
                console.error('Error getting receipt:', error_9);
                throw new errorHandler_1.AppError(500, 'Error retrieving receipt');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getReceiptById = getReceiptById;
var createReceipt = function (receiptData) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_10;
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
                error_10 = _a.sent();
                console.error('Error creating receipt:', error_10);
                throw new errorHandler_1.AppError(500, 'Error creating receipt');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createReceipt = createReceipt;
exports.default = {
    getAllPaymentStatus: exports.getAllPaymentStatus,
    getStudentPaymentStatus: exports.getStudentPaymentStatus,
    updatePaymentStatus: exports.updatePaymentStatus,
    validatePayment: exports.validatePayment,
    getPaymentAuditTrail: exports.getPaymentAuditTrail,
    validatePaymentConditions: exports.validatePaymentConditions,
    getAllReceipts: exports.getAllReceipts,
    getReceiptById: exports.getReceiptById,
    createReceipt: exports.createReceipt
};
