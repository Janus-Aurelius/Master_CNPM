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
exports.FinancialIntegrationService = void 0;
// src/business/shared/financialIntegrationService.ts
var financialService_1 = require("../../services/financialService/financialService");
var subject_business_1 = require("../academicBusiness/subject.business");
var databaseService_1 = require("../../services/database/databaseService");
var FinancialIntegrationService = /** @class */ (function () {
    function FinancialIntegrationService() {
    }
    /**
     * Calculate tuition for a specific course registration
     */
    FinancialIntegrationService.calculateCourseTuition = function (studentId, courseId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var subjects, subject, creditHour, tuitionPerCredit, baseAmount, additionalFees, breakdown, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, subject_business_1.SubjectBusiness.getAllSubjects()];
                    case 1:
                        subjects = _a.sent();
                        subject = subjects.find(function (s) { return s.subjectCode === courseId; });
                        if (!subject) {
                            throw new Error("Subject ".concat(courseId, " not found"));
                        }
                        creditHour = subject.credits || 3;
                        return [4 /*yield*/, this.getTuitionPerCredit(studentId)];
                    case 2:
                        tuitionPerCredit = _a.sent();
                        baseAmount = creditHour * tuitionPerCredit;
                        return [4 /*yield*/, this.calculateAdditionalFees(courseId, semester)];
                    case 3:
                        additionalFees = _a.sent();
                        breakdown = __spreadArray([
                            {
                                description: "Tuition (".concat(creditHour, " credits \u00D7 ").concat(tuitionPerCredit.toLocaleString(), " VND)"),
                                amount: baseAmount
                            }
                        ], additionalFees.breakdown, true);
                        return [2 /*return*/, {
                                baseAmount: baseAmount,
                                additionalFees: additionalFees.total,
                                totalAmount: baseAmount + additionalFees.total,
                                breakdown: breakdown
                            }];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error calculating course tuition:', error_1);
                        return [2 /*return*/, {
                                baseAmount: 0,
                                additionalFees: 0,
                                totalAmount: 0,
                                breakdown: [{ description: 'Error calculating tuition', amount: 0 }]
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create tuition record for course registration
     */
    FinancialIntegrationService.createTuitionRecord = function (studentId, courseId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var tuitionCalculation, tuitionRecord, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.calculateCourseTuition(studentId, courseId, semester)];
                    case 1:
                        tuitionCalculation = _a.sent();
                        if (tuitionCalculation.totalAmount === 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    error: 'Unable to calculate tuition amount'
                                }];
                        }
                        return [4 /*yield*/, financialService_1.financialService.createTuitionRecord({
                                studentId: studentId,
                                courseId: courseId,
                                semester: semester,
                                amount: tuitionCalculation.totalAmount,
                                breakdown: tuitionCalculation.breakdown,
                                dueDate: this.calculateDueDate(semester),
                                status: 'PENDING'
                            })];
                    case 2:
                        tuitionRecord = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                tuitionRecordId: tuitionRecord.id
                            }];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error creating tuition record:', error_2);
                        return [2 /*return*/, {
                                success: false,
                                error: 'Failed to create tuition record'
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check payment eligibility for course registration
     */
    FinancialIntegrationService.checkPaymentEligibility = function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, warnings, paymentInfo, paymentStatus, outstandingAmount, gracePeriodExpired, canRegister, financialHolds, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errors = [];
                        warnings = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, financialService_1.financialService.getStudentPayment(studentId)];
                    case 2:
                        paymentInfo = _a.sent();
                        if (!paymentInfo) {
                            return [2 /*return*/, {
                                    canRegister: true, // Allow registration for new students
                                    paymentStatus: 'UNPAID',
                                    outstandingAmount: 0,
                                    gracePeriodExpired: false,
                                    errors: [],
                                    warnings: ['No payment record found - first-time registration']
                                }];
                        }
                        paymentStatus = 'UNPAID';
                        outstandingAmount = paymentInfo.totalAmount - paymentInfo.paidAmount;
                        if (paymentInfo.paidAmount >= paymentInfo.totalAmount) {
                            paymentStatus = 'PAID';
                        }
                        else if (paymentInfo.paidAmount > 0) {
                            paymentStatus = 'PARTIAL';
                        }
                        else {
                            paymentStatus = 'UNPAID';
                        }
                        return [4 /*yield*/, this.checkGracePeriod(studentId, semester)];
                    case 3:
                        gracePeriodExpired = _a.sent();
                        if (gracePeriodExpired && outstandingAmount > 0) {
                            paymentStatus = 'OVERDUE';
                        }
                        canRegister = true;
                        switch (paymentStatus) {
                            case 'PAID':
                                // All good
                                break;
                            case 'PARTIAL':
                                if (outstandingAmount > 5000000) { // 5M VND threshold
                                    warnings.push("Large outstanding balance: ".concat(outstandingAmount.toLocaleString(), " VND"));
                                }
                                else {
                                    warnings.push("Outstanding balance: ".concat(outstandingAmount.toLocaleString(), " VND"));
                                }
                                break;
                            case 'UNPAID':
                                if (gracePeriodExpired) {
                                    errors.push('Payment grace period has expired');
                                    canRegister = false;
                                }
                                else {
                                    warnings.push('Tuition payment is pending');
                                }
                                break;
                            case 'OVERDUE':
                                errors.push("Payment is overdue. Outstanding amount: ".concat(outstandingAmount.toLocaleString(), " VND"));
                                canRegister = false;
                                break;
                        }
                        return [4 /*yield*/, this.checkFinancialHolds(studentId)];
                    case 4:
                        financialHolds = _a.sent();
                        if (financialHolds.length > 0) {
                            errors.push("Financial holds: ".concat(financialHolds.join(', ')));
                            canRegister = false;
                        }
                        return [2 /*return*/, {
                                canRegister: canRegister,
                                paymentStatus: paymentStatus,
                                outstandingAmount: outstandingAmount,
                                gracePeriodExpired: gracePeriodExpired,
                                errors: errors,
                                warnings: warnings
                            }];
                    case 5:
                        error_3 = _a.sent();
                        console.error('Error checking payment eligibility:', error_3);
                        return [2 /*return*/, {
                                canRegister: false,
                                paymentStatus: 'UNPAID',
                                outstandingAmount: 0,
                                gracePeriodExpired: false,
                                errors: ['Error checking payment status'],
                                warnings: []
                            }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }; // Helper methods
    FinancialIntegrationService.getTuitionPerCredit = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, tuitionRate, defaultRate, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT s.*, p.name_year as program_name\n                FROM students s\n                LEFT JOIN programs p ON s.major = p.major\n                WHERE s.student_id = $1\n            ", [studentId])];
                    case 1:
                        student = _a.sent();
                        if (!student) {
                            return [2 /*return*/, 1500000]; // Default rate
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT tr.rate_per_credit, tr.effective_date\n                FROM tuition_rates tr\n                WHERE tr.program = $1 \n                AND tr.status = 'active'\n                AND tr.effective_date <= CURRENT_DATE\n                ORDER BY tr.effective_date DESC\n                LIMIT 1\n            ", [student.major])];
                    case 2:
                        tuitionRate = _a.sent();
                        if (tuitionRate) {
                            return [2 /*return*/, parseFloat(tuitionRate.rate_per_credit)];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT setting_value FROM system_settings \n                WHERE setting_key = 'default_tuition_per_credit'\n            ")];
                    case 3:
                        defaultRate = _a.sent();
                        return [2 /*return*/, parseFloat((defaultRate === null || defaultRate === void 0 ? void 0 : defaultRate.setting_value) || '1500000')];
                    case 4:
                        error_4 = _a.sent();
                        console.error('Error getting tuition per credit:', error_4);
                        return [2 /*return*/, 1500000]; // Fallback rate
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FinancialIntegrationService.calculateAdditionalFees = function (courseId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var breakdown_1, courseFees, semesterFees, error_5, defaultBreakdown;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        breakdown_1 = [];
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT cf.fee_name, cf.amount, cf.fee_type\n                FROM course_fees cf\n                JOIN open_courses oc ON cf.course_type = oc.type OR cf.subject_code = oc.subject_code\n                WHERE oc.id = $1 AND cf.status = 'active'\n            ", [parseInt(courseId)])];
                    case 1:
                        courseFees = _a.sent();
                        courseFees.forEach(function (fee) {
                            breakdown_1.push({
                                description: fee.fee_name,
                                amount: parseFloat(fee.amount)
                            });
                        });
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT sf.fee_name, sf.amount\n                FROM semester_fees sf\n                WHERE sf.semester = $1 AND sf.status = 'active'\n            ", [semester])];
                    case 2:
                        semesterFees = _a.sent();
                        semesterFees.forEach(function (fee) {
                            breakdown_1.push({
                                description: fee.fee_name,
                                amount: parseFloat(fee.amount)
                            });
                        });
                        // Default fees if no specific fees found
                        if (breakdown_1.length === 0) {
                            breakdown_1.push({ description: 'Administrative fee', amount: 200000 }, { description: 'Insurance fee', amount: 100000 });
                        }
                        return [2 /*return*/, {
                                total: breakdown_1.reduce(function (sum, fee) { return sum + fee.amount; }, 0),
                                breakdown: breakdown_1
                            }];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error calculating additional fees:', error_5);
                        defaultBreakdown = [
                            { description: 'Administrative fee', amount: 200000 },
                            { description: 'Insurance fee', amount: 100000 }
                        ];
                        return [2 /*return*/, {
                                total: defaultBreakdown.reduce(function (sum, fee) { return sum + fee.amount; }, 0),
                                breakdown: defaultBreakdown
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FinancialIntegrationService.checkGracePeriod = function (studentId, semester) {
        return __awaiter(this, void 0, void 0, function () {
            var gracePeriodSettings, gracePeriodDays, registration, enrollmentDate, gracePeriodEnd, error_6, now, defaultGracePeriodEnd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT grace_period_days FROM payment_settings \n                WHERE semester = $1 AND status = 'active'\n            ")];
                    case 1:
                        gracePeriodSettings = _a.sent();
                        gracePeriodDays = (gracePeriodSettings === null || gracePeriodSettings === void 0 ? void 0 : gracePeriodSettings.grace_period_days) || 30;
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MIN(e.enrollment_date) as first_enrollment\n                FROM enrollments e\n                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND e.semester = $2\n            ", [studentId, semester])];
                    case 2:
                        registration = _a.sent();
                        if (!(registration === null || registration === void 0 ? void 0 : registration.first_enrollment)) {
                            return [2 /*return*/, false]; // No registration found, grace period not applicable
                        }
                        enrollmentDate = new Date(registration.first_enrollment);
                        gracePeriodEnd = new Date(enrollmentDate);
                        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + gracePeriodDays);
                        return [2 /*return*/, new Date() > gracePeriodEnd];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error checking grace period:', error_6);
                        now = new Date();
                        defaultGracePeriodEnd = new Date();
                        defaultGracePeriodEnd.setDate(now.getDate() - 30);
                        return [2 /*return*/, now > defaultGracePeriodEnd];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FinancialIntegrationService.checkFinancialHolds = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var holds, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT hold_type, hold_reason, amount\n                FROM financial_holds fh\n                WHERE fh.student_id = (SELECT id FROM students WHERE student_id = $1)\n                AND fh.status = 'active'\n                ORDER BY fh.created_at DESC\n            ", [studentId])];
                    case 1:
                        holds = _a.sent();
                        return [2 /*return*/, holds.map(function (hold) {
                                return "".concat(hold.hold_type, ": ").concat(hold.hold_reason).concat(hold.amount ? " (".concat(parseFloat(hold.amount).toLocaleString(), " VND)") : '');
                            })];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error checking financial holds:', error_7);
                        return [2 /*return*/, []]; // Return no holds on error
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FinancialIntegrationService.calculateDueDate = function (semester) {
        try {
            // Parse semester to determine due date
            // Semester format: "2024-1", "2024-2", etc.
            var _a = semester.split('-').map(Number), year = _a[0], semesterNum = _a[1];
            if (!year || !semesterNum) {
                // Default to 30 days from now
                var defaultDate = new Date();
                defaultDate.setDate(defaultDate.getDate() + 30);
                return defaultDate;
            }
            // Calculate due date based on semester
            var dueDate = new Date();
            if (semesterNum === 1) {
                // First semester: due date in February
                dueDate = new Date(year, 1, 15); // February 15
            }
            else if (semesterNum === 2) {
                // Second semester: due date in July
                dueDate = new Date(year, 6, 15); // July 15
            }
            else if (semesterNum === 3) {
                // Summer semester: due date in September
                dueDate = new Date(year, 8, 15); // September 15
            }
            else {
                // Default to 30 days from now
                dueDate.setDate(dueDate.getDate() + 30);
            }
            return dueDate;
        }
        catch (error) {
            console.error('Error calculating due date:', error);
            // Default to 30 days from now
            var defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 30);
            return defaultDate;
        }
    };
    return FinancialIntegrationService;
}());
exports.FinancialIntegrationService = FinancialIntegrationService;
