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
exports.financialService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.financialService = {
    countTotalStudents: function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(DISTINCT student_id) as count FROM tuition_records")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.count) || 0];
                }
            });
        });
    },
    countStudentsByPaymentStatus: function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(*) as count FROM tuition_records WHERE status = $1", [status])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.count) || 0];
                }
            });
        });
    },
    getTotalRevenue: function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT SUM(paid_amount) as total FROM tuition_records")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.total) || 0];
                }
            });
        });
    },
    getOutstandingAmount: function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT SUM(total_amount - paid_amount) as outstanding FROM tuition_records")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.outstanding) || 0];
                }
            });
        });
    },
    getAllStudentPayments: function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var query, conditions, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT * FROM tuition_records";
                        conditions = [];
                        params = [];
                        if (filters.semester) {
                            conditions.push('semester = $' + (params.length + 1));
                            params.push(filters.semester);
                        }
                        if (filters.faculty) {
                            conditions.push('faculty = $' + (params.length + 1));
                            params.push(filters.faculty);
                        }
                        if (filters.course) {
                            conditions.push('course = $' + (params.length + 1));
                            params.push(filters.course);
                        }
                        if (conditions.length > 0)
                            query += ' WHERE ' + conditions.join(' AND ');
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    getStudentPayment: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT * FROM tuition_records WHERE student_id = $1", [studentId])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result || null];
                }
            });
        });
    },
    updateStudentPayment: function (studentId, paymentData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("UPDATE tuition_records SET status = $1, paid_amount = $2, semester = $3 WHERE student_id = $4", [paymentData.paymentStatus, paymentData.amountPaid, paymentData.semester, studentId])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getTuitionSettings: function (semester) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT * FROM tuition_settings WHERE semester = $1", [semester])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result || null];
                }
            });
        });
    },
    updateTuitionSettings: function (semester, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("UPDATE tuition_settings SET price_per_credit = $1, base_fee = $2, laboratory_fee = $3, library_fee = $4 WHERE semester = $5", [settings.pricePerCredit, settings.baseFee, settings.laboratoryFee, settings.libraryFee, semester])];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    createTuitionRecord: function (tuitionData) {
        return __awaiter(this, void 0, void 0, function () {
            var tuitionRecord, course, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.insert('tuition_records', {
                                student_id: tuitionData.studentId,
                                semester: tuitionData.semester,
                                total_amount: tuitionData.amount,
                                paid_amount: 0,
                                remaining_amount: tuitionData.amount,
                                status: tuitionData.status.toLowerCase(),
                                due_date: tuitionData.dueDate
                            })];
                    case 1:
                        tuitionRecord = _a.sent();
                        if (!tuitionData.courseId) return [3 /*break*/, 4];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                    SELECT oc.*, s.subject_name, s.credits \n                    FROM open_courses oc \n                    JOIN subjects s ON oc.subject_id = s.id \n                    WHERE oc.id = $1\n                ", [parseInt(tuitionData.courseId)])];
                    case 2:
                        course = _a.sent();
                        if (!course) return [3 /*break*/, 4];
                        return [4 /*yield*/, databaseService_1.DatabaseService.insert('tuition_course_items', {
                                tuition_record_id: tuitionRecord.id,
                                course_id: parseInt(tuitionData.courseId),
                                course_name: course.subject_name,
                                credits: course.credits,
                                price: tuitionData.amount
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, {
                            id: tuitionRecord.id,
                            success: true
                        }];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error creating tuition record:', error_1);
                        return [2 /*return*/, {
                                id: '',
                                success: false
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    getUnpaidTuitionReport: function (semester, year) {
        return __awaiter(this, void 0, void 0, function () {
            var semesterQuery, unpaidRecords, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        semesterQuery = "".concat(semester, " ").concat(year);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT student_id, remaining_amount \n                FROM tuition_records \n                WHERE semester = $1 AND status != 'paid'\n            ", [semesterQuery])];
                    case 1:
                        unpaidRecords = _a.sent();
                        return [2 /*return*/, unpaidRecords.map(function (r) { return ({
                                studentId: r.student_id,
                                remainingAmount: r.remaining_amount
                            }); })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting unpaid tuition report:', error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
