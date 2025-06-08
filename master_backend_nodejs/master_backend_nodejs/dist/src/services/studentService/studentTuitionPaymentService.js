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
exports.studentTuitionPaymentService = exports.paymentReceipts = exports.tuitionRecords = void 0;
var databaseService_1 = require("../database/databaseService");
// TODO: Thay thế bằng thao tác database thực tế
var tuitionRecords = [];
exports.tuitionRecords = tuitionRecords;
var paymentReceipts = [];
exports.paymentReceipts = paymentReceipts;
exports.studentTuitionPaymentService = {
    // Tạo phiếu học phí mới khi xác nhận đăng ký
    createTuitionRecord: function (studentId, semester, courses) {
        return __awaiter(this, void 0, void 0, function () {
            var totalAmount, recordId, insertedRecord, _i, courses_1, course, newRecord, error_1, totalAmount, newRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        totalAmount = courses.reduce(function (sum, c) { return sum + c.price; }, 0);
                        recordId = "TR_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 6));
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                INSERT INTO tuition_records (\n                    id, student_id, semester, total_amount, paid_amount, \n                    remaining_amount, status, created_at, updated_at\n                ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())\n                RETURNING *\n            ", [recordId, studentId, semester, totalAmount, 0, totalAmount, 'PENDING'])];
                    case 1:
                        insertedRecord = _a.sent();
                        _i = 0, courses_1 = courses;
                        _a.label = 2;
                    case 2:
                        if (!(_i < courses_1.length)) return [3 /*break*/, 5];
                        course = courses_1[_i];
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    INSERT INTO tuition_course_items (\n                        tuition_record_id, course_id, course_name, \n                        credits, price, created_at\n                    ) VALUES ($1, $2, $3, $4, $5, NOW())\n                ", [recordId, course.courseId, course.courseName, course.credits, course.price])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        newRecord = {
                            id: recordId,
                            studentId: studentId,
                            semester: semester,
                            totalAmount: totalAmount,
                            paidAmount: 0,
                            remainingAmount: totalAmount,
                            status: 'PENDING',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            courses: courses
                        };
                        // Fallback to in-memory storage
                        tuitionRecords.push(newRecord);
                        return [2 /*return*/, newRecord];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error creating tuition record:', error_1);
                        totalAmount = courses.reduce(function (sum, c) { return sum + c.price; }, 0);
                        newRecord = {
                            id: Math.random().toString(36).substr(2, 9),
                            studentId: studentId,
                            semester: semester,
                            totalAmount: totalAmount,
                            paidAmount: 0,
                            remainingAmount: totalAmount,
                            status: 'PENDING',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            courses: courses
                        };
                        tuitionRecords.push(newRecord);
                        return [2 /*return*/, newRecord];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    // Đóng học phí (có thể đóng thiếu, đủ, dư)
    payTuition: function (tuitionRecordId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var record, newPaidAmount, newRemainingAmount, status_1, receiptId, updatedRecord, receipt, error_2, record, status_2, receipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (typeof amount !== 'number' || amount < 0) {
                            throw new Error('Invalid payment amount');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM tuition_records WHERE id = $1\n            ", [tuitionRecordId])];
                    case 1:
                        record = _a.sent();
                        if (!record) {
                            // Fallback to in-memory
                            record = tuitionRecords.find(function (r) { return r.id === tuitionRecordId; });
                            if (!record)
                                throw new Error('Tuition record not found');
                        }
                        newPaidAmount = record.paid_amount + amount;
                        newRemainingAmount = record.total_amount - newPaidAmount;
                        status_1 = 'PENDING';
                        if (newPaidAmount === record.total_amount)
                            status_1 = 'PAID';
                        else if (newPaidAmount > record.total_amount)
                            status_1 = 'OVERPAID';
                        else if (newPaidAmount > 0)
                            status_1 = 'PARTIAL';
                        // Update tuition record in database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE tuition_records \n                SET paid_amount = $1, remaining_amount = $2, status = $3, updated_at = NOW()\n                WHERE id = $4\n            ", [newPaidAmount, newRemainingAmount, status_1, tuitionRecordId])];
                    case 2:
                        // Update tuition record in database
                        _a.sent();
                        receiptId = "PR_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 6));
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO payment_receipts (\n                    id, tuition_record_id, amount, payment_date, status, created_at\n                ) VALUES ($1, $2, $3, NOW(), $4, NOW())\n            ", [receiptId, tuitionRecordId, amount, 'SUCCESS'])];
                    case 3:
                        _a.sent();
                        updatedRecord = {
                            id: record.id,
                            studentId: record.student_id,
                            semester: record.semester,
                            totalAmount: record.total_amount,
                            paidAmount: newPaidAmount,
                            remainingAmount: newRemainingAmount,
                            status: status_1,
                            createdAt: record.created_at,
                            updatedAt: new Date().toISOString(),
                            courses: [] // Will be loaded separately if needed
                        };
                        receipt = {
                            id: receiptId,
                            tuitionRecordId: tuitionRecordId,
                            amount: amount,
                            paymentDate: new Date().toISOString(),
                            status: 'SUCCESS'
                        };
                        return [2 /*return*/, { record: updatedRecord, receipt: receipt }];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error processing payment:', error_2);
                        record = tuitionRecords.find(function (r) { return r.id === tuitionRecordId; });
                        if (!record)
                            throw new Error('Tuition record not found');
                        record.paidAmount += amount;
                        record.remainingAmount = record.totalAmount - record.paidAmount;
                        status_2 = 'PENDING';
                        if (record.paidAmount === record.totalAmount)
                            status_2 = 'PAID';
                        else if (record.paidAmount > record.totalAmount)
                            status_2 = 'OVERPAID';
                        else if (record.paidAmount > 0)
                            status_2 = 'PARTIAL';
                        record.status = status_2;
                        record.updatedAt = new Date().toISOString();
                        receipt = {
                            id: Math.random().toString(36).substr(2, 9),
                            tuitionRecordId: record.id,
                            amount: amount,
                            paymentDate: new Date().toISOString(),
                            status: 'SUCCESS'
                        };
                        paymentReceipts.push(receipt);
                        return [2 /*return*/, { record: record, receipt: receipt }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    // Chỉnh sửa đăng ký (thêm/xóa môn học)
    editRegistration: function (tuitionRecordId, newCourses) {
        return __awaiter(this, void 0, void 0, function () {
            var record, newTotalAmount, newRemainingAmount, status_3, _i, newCourses_1, course, updatedRecord, error_3, record, status_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM tuition_records WHERE id = $1\n            ", [tuitionRecordId])];
                    case 1:
                        record = _a.sent();
                        if (!record) {
                            // Fallback to in-memory
                            record = tuitionRecords.find(function (r) { return r.id === tuitionRecordId; });
                            if (!record)
                                throw new Error('Tuition record not found');
                        }
                        newTotalAmount = newCourses.reduce(function (sum, c) { return sum + c.price; }, 0);
                        newRemainingAmount = newTotalAmount - record.paid_amount;
                        status_3 = 'PENDING';
                        if (record.paid_amount === newTotalAmount)
                            status_3 = 'PAID';
                        else if (record.paid_amount > newTotalAmount)
                            status_3 = 'OVERPAID';
                        else if (record.paid_amount > 0)
                            status_3 = 'PARTIAL';
                        // Update tuition record in database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE tuition_records \n                SET total_amount = $1, remaining_amount = $2, status = $3, updated_at = NOW()\n                WHERE id = $4\n            ", [newTotalAmount, newRemainingAmount, status_3, tuitionRecordId])];
                    case 2:
                        // Update tuition record in database
                        _a.sent();
                        // Delete old course items
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                DELETE FROM tuition_course_items WHERE tuition_record_id = $1\n            ", [tuitionRecordId])];
                    case 3:
                        // Delete old course items
                        _a.sent();
                        _i = 0, newCourses_1 = newCourses;
                        _a.label = 4;
                    case 4:
                        if (!(_i < newCourses_1.length)) return [3 /*break*/, 7];
                        course = newCourses_1[_i];
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    INSERT INTO tuition_course_items (\n                        tuition_record_id, course_id, course_name, \n                        credits, price, created_at\n                    ) VALUES ($1, $2, $3, $4, $5, NOW())\n                ", [tuitionRecordId, course.courseId, course.courseName, course.credits, course.price])];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        updatedRecord = {
                            id: tuitionRecordId,
                            studentId: record.student_id,
                            semester: record.semester,
                            totalAmount: newTotalAmount,
                            paidAmount: record.paid_amount,
                            remainingAmount: newRemainingAmount,
                            status: status_3,
                            createdAt: record.created_at,
                            updatedAt: new Date().toISOString(),
                            courses: newCourses
                        };
                        return [2 /*return*/, updatedRecord];
                    case 8:
                        error_3 = _a.sent();
                        console.error('Error editing registration:', error_3);
                        record = tuitionRecords.find(function (r) { return r.id === tuitionRecordId; });
                        if (!record)
                            throw new Error('Tuition record not found');
                        record.courses = newCourses;
                        record.totalAmount = newCourses.reduce(function (sum, c) { return sum + c.price; }, 0);
                        record.remainingAmount = record.totalAmount - record.paidAmount;
                        status_4 = 'PENDING';
                        if (record.paidAmount === record.totalAmount)
                            status_4 = 'PAID';
                        else if (record.paidAmount > record.totalAmount)
                            status_4 = 'OVERPAID';
                        else if (record.paidAmount > 0)
                            status_4 = 'PARTIAL';
                        record.status = status_4;
                        record.updatedAt = new Date().toISOString();
                        return [2 /*return*/, record];
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
    // Lấy phiếu học phí theo studentId
    getTuitionRecordsByStudent: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var records, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    tr.*,\n                    json_agg(\n                        json_build_object(\n                            'courseId', tci.course_id,\n                            'courseName', tci.course_name,\n                            'credits', tci.credits,\n                            'price', tci.price\n                        )\n                    ) as courses\n                FROM tuition_records tr\n                LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id\n                WHERE tr.student_id = $1\n                GROUP BY tr.id, tr.student_id, tr.semester, tr.total_amount, \n                         tr.paid_amount, tr.remaining_amount, tr.status, \n                         tr.created_at, tr.updated_at\n                ORDER BY tr.created_at DESC\n            ", [studentId])];
                    case 1:
                        records = _a.sent();
                        if (records && records.length > 0) {
                            return [2 /*return*/, records.map(function (record) { return ({
                                    id: record.id,
                                    studentId: record.student_id,
                                    semester: record.semester,
                                    totalAmount: record.total_amount,
                                    paidAmount: record.paid_amount,
                                    remainingAmount: record.remaining_amount,
                                    status: record.status,
                                    createdAt: record.created_at,
                                    updatedAt: record.updated_at,
                                    courses: record.courses || []
                                }); })];
                        }
                        // Fallback to in-memory data
                        return [2 /*return*/, tuitionRecords.filter(function (r) { return r.studentId === studentId; })];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting tuition records:', error_4);
                        return [2 /*return*/, tuitionRecords.filter(function (r) { return r.studentId === studentId; })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Lấy lịch sử phiếu thu
    getPaymentReceiptsByRecord: function (tuitionRecordId) {
        return __awaiter(this, void 0, void 0, function () {
            var receipts, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT * FROM payment_receipts \n                WHERE tuition_record_id = $1\n                ORDER BY payment_date DESC\n            ", [tuitionRecordId])];
                    case 1:
                        receipts = _a.sent();
                        if (receipts && receipts.length > 0) {
                            return [2 /*return*/, receipts.map(function (receipt) { return ({
                                    id: receipt.id,
                                    tuitionRecordId: receipt.tuition_record_id,
                                    amount: receipt.amount,
                                    paymentDate: receipt.payment_date,
                                    status: receipt.status
                                }); })];
                        }
                        // Fallback to in-memory data
                        return [2 /*return*/, paymentReceipts.filter(function (r) { return r.tuitionRecordId === tuitionRecordId; })];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting payment receipts:', error_5);
                        return [2 /*return*/, paymentReceipts.filter(function (r) { return r.tuitionRecordId === tuitionRecordId; })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
