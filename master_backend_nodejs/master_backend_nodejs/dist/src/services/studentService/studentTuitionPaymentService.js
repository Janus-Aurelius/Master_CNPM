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
exports.paymentReceipts = exports.tuitionRecords = exports.studentTuitionPaymentService = void 0;
var databaseService_1 = require("../database/databaseService");
var errorHandler_1 = require("../../middleware/errorHandler");
var uuid_1 = require("uuid");
exports.studentTuitionPaymentService = {
    getTuitionRecords: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var records, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT * FROM tuition_records \n                WHERE student_id = $1\n                ORDER BY created_at DESC\n            ", [studentId])];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (record) { return ({
                                id: record.id,
                                studentId: record.student_id,
                                semester: record.semester,
                                totalAmount: parseFloat(record.total_amount),
                                paidAmount: parseFloat(record.paid_amount),
                                outstandingAmount: parseFloat(record.outstanding_amount),
                                paymentStatus: record.payment_status,
                                courses: record.courses,
                                createdAt: record.created_at,
                                updatedAt: record.updated_at
                            }); })];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting tuition records:', error_1);
                        throw new errorHandler_1.AppError(500, 'Error retrieving tuition records');
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getPaymentReceipts: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var receipts, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT * FROM payment_receipts \n                WHERE student_id = $1\n                ORDER BY payment_date DESC\n            ", [studentId])];
                    case 1:
                        receipts = _a.sent();
                        return [2 /*return*/, receipts.map(function (receipt) { return ({
                                id: receipt.id,
                                tuitionRecordId: receipt.tuition_record_id,
                                studentId: receipt.student_id,
                                amount: parseFloat(receipt.amount),
                                paymentMethod: receipt.payment_method,
                                receiptNumber: receipt.receipt_number,
                                paymentDate: receipt.payment_date,
                                notes: receipt.notes,
                                createdAt: receipt.created_at
                            }); })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting payment receipts:', error_2);
                        throw new errorHandler_1.AppError(500, 'Error retrieving payment receipts');
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    payTuition: function (tuitionRecordId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var record, paymentStatus, newPaidAmount, newOutstandingAmount, receiptNumber, receipt, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM tuition_records WHERE id = $1\n            ", [tuitionRecordId])];
                    case 1:
                        record = _a.sent();
                        if (!record) {
                            throw new errorHandler_1.AppError(404, 'Tuition record not found');
                        }
                        paymentStatus = 'UNPAID';
                        newPaidAmount = parseFloat(record.paid_amount) + amount;
                        newOutstandingAmount = parseFloat(record.total_amount) - newPaidAmount;
                        if (newPaidAmount >= parseFloat(record.total_amount)) {
                            paymentStatus = 'PAID';
                        }
                        else if (newPaidAmount > 0) {
                            paymentStatus = 'PARTIAL';
                        }
                        // Update tuition record
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE tuition_records \n                SET \n                    paid_amount = $1,\n                    outstanding_amount = $2,\n                    payment_status = $3,\n                    updated_at = NOW()\n                WHERE id = $4\n            ", [newPaidAmount, newOutstandingAmount, paymentStatus, tuitionRecordId])];
                    case 2:
                        // Update tuition record
                        _a.sent();
                        receiptNumber = "RCP-".concat(Date.now(), "-").concat(record.student_id);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                INSERT INTO payment_receipts (\n                    tuition_record_id,\n                    student_id,\n                    amount,\n                    payment_method,\n                    receipt_number,\n                    payment_date,\n                    created_at\n                ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())\n                RETURNING *\n            ", [tuitionRecordId, record.student_id, amount, 'CASH', receiptNumber])];
                    case 3:
                        receipt = _a.sent();
                        return [2 /*return*/, {
                                record: {
                                    id: record.id,
                                    studentId: record.student_id,
                                    semester: record.semester,
                                    totalAmount: parseFloat(record.total_amount),
                                    paidAmount: newPaidAmount,
                                    outstandingAmount: newOutstandingAmount,
                                    paymentStatus: paymentStatus,
                                    courses: record.courses,
                                    createdAt: record.created_at,
                                    updatedAt: new Date().toISOString()
                                },
                                receipt: {
                                    id: receipt.id,
                                    tuitionRecordId: receipt.tuition_record_id,
                                    studentId: receipt.student_id,
                                    amount: parseFloat(receipt.amount),
                                    paymentMethod: receipt.payment_method,
                                    receiptNumber: receipt.receipt_number,
                                    paymentDate: receipt.payment_date,
                                    notes: receipt.notes,
                                    createdAt: receipt.created_at
                                }
                            }];
                    case 4:
                        error_3 = _a.sent();
                        console.error('Error paying tuition:', error_3);
                        throw new errorHandler_1.AppError(500, 'Error processing tuition payment');
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // Tạo phiếu học phí mới khi xác nhận đăng ký
    createTuitionRecord: function (studentId, semester, courses) {
        return __awaiter(this, void 0, void 0, function () {
            var uniqueCourses, now, academicYear, coursesWithInfo, recordId, totalAmount, newRecord, _i, coursesWithInfo_1, course;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uniqueCourses = Array.from(new Map(courses.map(function (c) { return [c.courseId, c]; })).values());
                        if (uniqueCourses.length !== courses.length) {
                            throw new Error('Có môn học bị trùng trong danh sách đăng ký!');
                        }
                        now = new Date();
                        academicYear = "".concat(now.getFullYear(), "-").concat(now.getFullYear() + 1);
                        coursesWithInfo = uniqueCourses.map(function (c) { return (__assign(__assign({}, c), { semester: c.semester || semester, academicYear: c.academicYear || academicYear })); });
                        recordId = (0, uuid_1.v4)();
                        totalAmount = coursesWithInfo.reduce(function (total, course) { return total + course.amount; }, 0);
                        newRecord = {
                            id: recordId,
                            studentId: studentId,
                            semester: semester,
                            totalAmount: totalAmount,
                            paidAmount: 0,
                            outstandingAmount: totalAmount,
                            paymentStatus: 'UNPAID',
                            courses: coursesWithInfo,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        // Lưu xuống database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO tuition_records (id, student_id, semester, total_amount, paid_amount, outstanding_amount, payment_status, created_at, updated_at)\n             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [recordId, studentId, semester, totalAmount, 0, totalAmount, 'UNPAID', newRecord.createdAt, newRecord.updatedAt])];
                    case 1:
                        // Lưu xuống database
                        _a.sent();
                        _i = 0, coursesWithInfo_1 = coursesWithInfo;
                        _a.label = 2;
                    case 2:
                        if (!(_i < coursesWithInfo_1.length)) return [3 /*break*/, 5];
                        course = coursesWithInfo_1[_i];
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO tuition_courses (tuition_record_id, course_id, course_name, amount, semester, academic_year)\n                 VALUES ($1, $2, $3, $4, $5, $6)", [recordId, course.courseId, course.courseName, course.amount, course.semester, course.academicYear])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, newRecord];
                }
            });
        });
    },
    // Chỉnh sửa đăng ký (thêm/xóa môn học)
    editRegistration: function (tuitionRecordId, newCourses) {
        return __awaiter(this, void 0, void 0, function () {
            var currentRecord, newTotalAmount, newOutstandingAmount, paymentStatus, updatedRecord, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM tuition_records WHERE id = $1\n            ", [tuitionRecordId])];
                    case 1:
                        currentRecord = _a.sent();
                        if (!currentRecord) {
                            throw new errorHandler_1.AppError(404, 'Tuition record not found');
                        }
                        newTotalAmount = newCourses.reduce(function (total, course) { return total + course.amount; }, 0);
                        newOutstandingAmount = newTotalAmount - parseFloat(currentRecord.paid_amount);
                        paymentStatus = 'UNPAID';
                        if (parseFloat(currentRecord.paid_amount) >= newTotalAmount) {
                            paymentStatus = 'PAID';
                        }
                        else if (parseFloat(currentRecord.paid_amount) > 0) {
                            paymentStatus = 'PARTIAL';
                        }
                        updatedRecord = {
                            id: currentRecord.id,
                            studentId: currentRecord.student_id,
                            semester: currentRecord.semester,
                            totalAmount: newTotalAmount,
                            paidAmount: parseFloat(currentRecord.paid_amount),
                            outstandingAmount: newOutstandingAmount,
                            paymentStatus: paymentStatus,
                            courses: newCourses,
                            createdAt: currentRecord.created_at,
                            updatedAt: new Date().toISOString()
                        };
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE tuition_records \n                SET \n                    total_amount = $1,\n                    outstanding_amount = $2,\n                    payment_status = $3,\n                    courses = $4,\n                    updated_at = $5\n                WHERE id = $6\n            ", [
                                updatedRecord.totalAmount,
                                updatedRecord.outstandingAmount,
                                updatedRecord.paymentStatus,
                                JSON.stringify(updatedRecord.courses),
                                updatedRecord.updatedAt,
                                updatedRecord.id
                            ])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, updatedRecord];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error editing registration:', error_4);
                        throw new errorHandler_1.AppError(500, 'Error updating tuition record');
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Lấy phiếu học phí theo studentId
    getTuitionRecordsByStudent: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var records, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT * FROM tuition_records \n                WHERE student_id = $1\n                ORDER BY created_at DESC\n            ", [studentId])];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (record) { return ({
                                id: record.id,
                                studentId: record.student_id,
                                semester: record.semester,
                                totalAmount: parseFloat(record.total_amount),
                                paidAmount: parseFloat(record.paid_amount),
                                outstandingAmount: parseFloat(record.outstanding_amount),
                                paymentStatus: record.payment_status,
                                courses: record.courses,
                                createdAt: record.created_at,
                                updatedAt: record.updated_at
                            }); })];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting tuition records by student:', error_5);
                        throw new errorHandler_1.AppError(500, 'Error retrieving tuition records');
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Lấy lịch sử phiếu thu
    getPaymentReceiptsByRecord: function (tuitionRecordId) {
        return __awaiter(this, void 0, void 0, function () {
            var receipts, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT * FROM payment_receipts \n                WHERE tuition_record_id = $1\n                ORDER BY payment_date DESC\n            ", [tuitionRecordId])];
                    case 1:
                        receipts = _a.sent();
                        return [2 /*return*/, receipts.map(function (receipt) { return ({
                                id: receipt.id,
                                tuitionRecordId: receipt.tuition_record_id,
                                studentId: receipt.student_id,
                                amount: parseFloat(receipt.amount),
                                paymentMethod: receipt.payment_method,
                                receiptNumber: receipt.receipt_number,
                                paymentDate: receipt.payment_date,
                                notes: receipt.notes,
                                createdAt: receipt.created_at
                            }); })];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error getting payment receipts by record:', error_6);
                        throw new errorHandler_1.AppError(500, 'Error retrieving payment receipts');
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
exports.tuitionRecords = [];
exports.paymentReceipts = [];
