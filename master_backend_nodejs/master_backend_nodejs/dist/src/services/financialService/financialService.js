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
exports.financialService = void 0;
var studentTuitionPaymentService_1 = require("../studentService/studentTuitionPaymentService");
// Mock data cho financial department
var mockStudentPayments = [
    {
        studentId: "23524325",
        fullName: "Nguyễn Văn A",
        faculty: "Công nghệ thông tin",
        major: "Khoa học máy tính",
        course: "K18",
        paymentStatus: "PAID",
        semester: "HK1 2024-2025",
        totalAmount: 2100000,
        paidAmount: 2100000
    },
    {
        studentId: "22524234",
        fullName: "Trần Thị B",
        faculty: "Công nghệ thông tin",
        major: "Kỹ thuật phần mềm",
        course: "K17",
        paymentStatus: "PARTIAL",
        semester: "HK1 2024-2025",
        totalAmount: 2100000,
        paidAmount: 1000000
    },
    {
        studentId: "23524324",
        fullName: "Lê Văn C",
        faculty: "Cơ điện tử",
        major: "Cơ điện tử",
        course: "K17",
        paymentStatus: "UNPAID",
        semester: "HK1 2024-2025",
        totalAmount: 2100000,
        paidAmount: 0
    }
];
var mockTuitionSettings = {
    "HK1 2024-2025": {
        pricePerCredit: 150000,
        baseFee: 500000,
        laboratoryFee: 200000,
        libraryFee: 100000
    }
};
exports.financialService = {
    // Dashboard functions
    countTotalStudents: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mockStudentPayments.length];
            });
        });
    },
    countStudentsByPaymentStatus: function (status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mockStudentPayments.filter(function (student) { return student.paymentStatus === status; }).length];
            });
        });
    },
    getTotalRevenue: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mockStudentPayments.reduce(function (total, student) { return total + student.paidAmount; }, 0)];
            });
        });
    },
    getOutstandingAmount: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mockStudentPayments.reduce(function (total, student) {
                        return total + (student.totalAmount - student.paidAmount);
                    }, 0)];
            });
        });
    },
    // Payment Status Management
    getAllStudentPayments: function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredPayments;
            return __generator(this, function (_a) {
                filteredPayments = __spreadArray([], mockStudentPayments, true);
                if (filters.semester) {
                    filteredPayments = filteredPayments.filter(function (p) { return p.semester === filters.semester; });
                }
                if (filters.faculty) {
                    filteredPayments = filteredPayments.filter(function (p) { return p.faculty === filters.faculty; });
                }
                if (filters.course) {
                    filteredPayments = filteredPayments.filter(function (p) { return p.course === filters.course; });
                }
                return [2 /*return*/, filteredPayments];
            });
        });
    },
    getStudentPayment: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mockStudentPayments.find(function (student) { return student.studentId === studentId; }) || null];
            });
        });
    },
    updateStudentPayment: function (studentId, paymentData) {
        return __awaiter(this, void 0, void 0, function () {
            var studentIndex;
            return __generator(this, function (_a) {
                studentIndex = mockStudentPayments.findIndex(function (student) { return student.studentId === studentId; });
                if (studentIndex === -1)
                    return [2 /*return*/, false];
                mockStudentPayments[studentIndex] = __assign(__assign({}, mockStudentPayments[studentIndex]), { paymentStatus: paymentData.paymentStatus, paidAmount: paymentData.amountPaid, semester: paymentData.semester });
                return [2 /*return*/, true];
            });
        });
    },
    // Tuition Settings Management
    getTuitionSettings: function (semester) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, mockTuitionSettings[semester] || null];
            });
        });
    },
    updateTuitionSettings: function (semester, settings) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                mockTuitionSettings[semester] = settings;
                return [2 /*return*/, true];
            });
        });
    },
    // Existing function
    getUnpaidTuitionReport: function (semester, year) {
        return __awaiter(this, void 0, void 0, function () {
            var semesterQuery;
            return __generator(this, function (_a) {
                semesterQuery = "".concat(semester, " ").concat(year);
                return [2 /*return*/, studentTuitionPaymentService_1.tuitionRecords
                        .filter(function (r) { return r.semester === semesterQuery && r.status !== 'PAID'; })
                        .map(function (r) { return ({ studentId: r.studentId, remainingAmount: r.remainingAmount }); })];
            });
        });
    }
};
