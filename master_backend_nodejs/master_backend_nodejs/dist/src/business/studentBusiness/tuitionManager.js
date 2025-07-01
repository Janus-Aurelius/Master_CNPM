"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
     */ TuitionManager.prototype.getStudentTuitionStatus = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var actualStudentId, semester, _a, tuitionStatus, statusWithWarnings, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!studentId) {
                            throw new Error('Student ID is required');
                        }
                        return [4 /*yield*/, this.resolveStudentId(studentId)];
                    case 1:
                        actualStudentId = _b.sent();
                        _a = semesterId;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getCurrentSemester()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        semester = _a;
                        return [4 /*yield*/, tuitionService_1.tuitionService.getTuitionStatus(actualStudentId, semester)];
                    case 4:
                        tuitionStatus = _b.sent();
                        if (!tuitionStatus) {
                            return [2 /*return*/, null];
                        }
                        statusWithWarnings = this.applyPaymentDeadlineRules(tuitionStatus);
                        return [2 /*return*/, statusWithWarnings];
                    case 5:
                        error_1 = _b.sent();
                        console.error('Error in tuition manager getting student tuition status:', error_1);
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Process a payment with business validations
     */
    TuitionManager.prototype.processPayment = function (paymentRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentResponse, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // Validate payment request
                        this.validatePaymentRequest(paymentRequest);
                        // Additional business validation
                        return [4 /*yield*/, this.validatePaymentAmount(paymentRequest)];
                    case 1:
                        // Additional business validation
                        _a.sent();
                        return [4 /*yield*/, tuitionService_1.tuitionService.makePayment(paymentRequest)];
                    case 2:
                        paymentResponse = _a.sent();
                        // Apply post-payment business rules
                        return [4 /*yield*/, this.applyPostPaymentRules(paymentResponse)];
                    case 3:
                        // Apply post-payment business rules
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
    };
    /**
     * Get payment history with business formatting
     */ TuitionManager.prototype.getPaymentHistory = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var actualStudentId, registration, history_1, allRegistrationIds, allHistory, _i, allRegistrationIds_1, regId, history_2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        if (!studentId) {
                            throw new Error('Student ID is required');
                        }
                        return [4 /*yield*/, this.resolveStudentId(studentId)];
                    case 1:
                        actualStudentId = _a.sent();
                        if (!semesterId) return [3 /*break*/, 4];
                        return [4 /*yield*/, tuitionService_1.tuitionService.getRegistrationBySemester(actualStudentId, semesterId)];
                    case 2:
                        registration = _a.sent();
                        if (!registration) {
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, tuitionService_1.tuitionService.getPaymentHistory(registration.registrationId)];
                    case 3:
                        history_1 = _a.sent();
                        // Apply business formatting and categorization
                        return [2 /*return*/, this.formatPaymentHistory(history_1)];
                    case 4:
                        // Get history for all semesters using service
                        console.log('📋 Getting all registration IDs for student:', actualStudentId);
                        return [4 /*yield*/, tuitionService_1.tuitionService.getAllRegistrationIds(actualStudentId)];
                    case 5:
                        allRegistrationIds = _a.sent();
                        console.log('📋 Found registration IDs:', allRegistrationIds);
                        if (!allRegistrationIds || allRegistrationIds.length === 0) {
                            console.log('📋 No registration IDs found');
                            return [2 /*return*/, []];
                        }
                        allHistory = [];
                        _i = 0, allRegistrationIds_1 = allRegistrationIds;
                        _a.label = 6;
                    case 6:
                        if (!(_i < allRegistrationIds_1.length)) return [3 /*break*/, 9];
                        regId = allRegistrationIds_1[_i];
                        console.log('📋 Getting payment history for registration:', regId);
                        return [4 /*yield*/, tuitionService_1.tuitionService.getPaymentHistory(regId)];
                    case 7:
                        history_2 = _a.sent();
                        console.log('📋 Found payment history:', history_2);
                        allHistory.push.apply(allHistory, history_2);
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9:
                        console.log('📋 Total payment history items:', allHistory.length);
                        // Sort by date and limit to 10 most recent
                        return [2 /*return*/, this.formatPaymentHistory(allHistory)
                                .sort(function (a, b) { return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(); })
                                .slice(0, 10)];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_3 = _a.sent();
                        console.error('Error in tuition manager getting payment history:', error_3);
                        return [2 /*return*/, []]; // Return empty array instead of throwing to prevent cascade errors
                    case 12: return [2 /*return*/];
                }
            });
        });
    }; /**
     * Get tuition status for all semesters of a student
     * Returns formatted data for frontend display, including unopened semesters
     */
    TuitionManager.prototype.getAllTuitionStatus = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var actualStudentId, allSemesters, registrations, registrationMap_1, tuitionRecords, error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!studentId) {
                            throw new Error('Student ID is required');
                        }
                        return [4 /*yield*/, this.resolveStudentId(studentId)];
                    case 1:
                        actualStudentId = _a.sent();
                        console.log('📊 Getting all tuition status for student:', actualStudentId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaHocKy as \"semesterId\",\n                    HocKyThu as \"semesterNumber\", \n                    NamHoc as \"year\",\n                    TrangThaiHocKy as \"semesterStatus\",\n                    ThoiHanDongHP as \"dueDate\"\n                FROM HOCKYNAMHOC \n                ORDER BY NamHoc DESC, HocKyThu DESC\n            ")];
                    case 2:
                        allSemesters = _a.sent();
                        return [4 /*yield*/, tuitionService_1.tuitionService.getAllRegistrations(actualStudentId)];
                    case 3:
                        registrations = _a.sent();
                        console.log('📋 Found all semesters:', allSemesters.length);
                        console.log('📋 Found registrations:', registrations.length);
                        registrationMap_1 = new Map();
                        registrations.forEach(function (reg) {
                            registrationMap_1.set(reg.semesterId, reg);
                        }); // Process all semesters
                        return [4 /*yield*/, Promise.all(allSemesters.map(function (semester) { return __awaiter(_this, void 0, void 0, function () {
                                var registration, formattedSemesterName_1, subjects, formattedSemesterName;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            registration = registrationMap_1.get(semester.semesterId);
                                            if (!registration) {
                                                formattedSemesterName_1 = this.formatSemesterName(semester.semesterId);
                                                return [2 /*return*/, {
                                                        registrationId: null,
                                                        semester: semester.semesterId,
                                                        semesterName: formattedSemesterName_1,
                                                        year: semester.year,
                                                        dueDate: semester.dueDate,
                                                        status: 'not_opened',
                                                        courses: [],
                                                        originalAmount: 0,
                                                        totalAmount: 0,
                                                        paidAmount: 0,
                                                        remainingAmount: 0,
                                                        registrationDate: null,
                                                        discount: null
                                                    }];
                                            }
                                            return [4 /*yield*/, tuitionService_1.tuitionService.getRegisteredCoursesWithFees(registration.registrationId)];
                                        case 1:
                                            subjects = _a.sent();
                                            if (!subjects || subjects.length === 0) {
                                                console.warn('⚠️ No subjects found for registration:', registration.registrationId);
                                                subjects = [];
                                            }
                                            formattedSemesterName = this.formatSemesterName(registration.semesterName);
                                            return [2 /*return*/, {
                                                    registrationId: registration.registrationId,
                                                    semester: registration.semesterId,
                                                    semesterName: formattedSemesterName,
                                                    year: registration.year || semester.year,
                                                    dueDate: registration.dueDate || semester.dueDate,
                                                    status: registration.status || 'unpaid',
                                                    courses: subjects.map(function (subject) { return ({
                                                        courseId: subject.courseId,
                                                        courseName: subject.courseName,
                                                        credits: subject.credits,
                                                        totalPeriods: subject.totalPeriods,
                                                        periodsPerCredit: subject.periodsPerCredit,
                                                        pricePerCredit: subject.pricePerCredit,
                                                        totalFee: subject.totalFee,
                                                        courseType: subject.courseType
                                                    }); }),
                                                    originalAmount: registration.originalAmount || 0,
                                                    totalAmount: registration.totalAmount || 0,
                                                    paidAmount: registration.paidAmount || 0,
                                                    remainingAmount: registration.remainingAmount || (registration.totalAmount || 0),
                                                    registrationDate: registration.registrationDate,
                                                    discount: registration.discount
                                                }];
                                    }
                                });
                            }); }))];
                    case 4:
                        tuitionRecords = _a.sent();
                        console.log('✅ Formatted tuition records with unopened semesters:', tuitionRecords.length);
                        return [2 /*return*/, tuitionRecords];
                    case 5:
                        error_4 = _a.sent();
                        console.error('❌ Error getting all tuition status:', error_4);
                        // Log detailed error for debugging
                        console.error('Error details:', {
                            inputStudentId: studentId,
                            errorMessage: error_4 instanceof Error ? error_4.message : 'Unknown error',
                            stack: error_4 instanceof Error ? error_4.stack : undefined
                        });
                        // In production, should throw error instead of returning mock data
                        throw error_4;
                    case 6: return [2 /*return*/];
                }
            });
        });
    }; /**
     * Get recent payments for dashboard (last 5 transactions)
     */
    TuitionManager.prototype.getRecentPayments = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var actualStudentId, allHistory, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.resolveStudentId(studentId)];
                    case 1:
                        actualStudentId = _a.sent();
                        return [4 /*yield*/, this.getPaymentHistory(actualStudentId)];
                    case 2:
                        allHistory = _a.sent();
                        return [2 /*return*/, allHistory.slice(0, 5)]; // Return only the 5 most recent
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error getting recent payments:', error_5);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }; /**
     * Get tuition summary for financial reporting
     */
    TuitionManager.prototype.getTuitionSummary = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var actualStudentId, semester, _a, status_1, discountAmount, summary, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.resolveStudentId(studentId)];
                    case 1:
                        actualStudentId = _b.sent();
                        _a = semesterId;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getCurrentSemester()];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        semester = _a;
                        return [4 /*yield*/, this.getStudentTuitionStatus(actualStudentId, semester)];
                    case 4:
                        status_1 = _b.sent();
                        if (!status_1) {
                            return [2 /*return*/, null];
                        }
                        discountAmount = status_1.discount ?
                            status_1.registration.registrationAmount * status_1.discount.percentage : 0;
                        summary = {
                            studentId: status_1.registration.studentId,
                            semesterId: semester,
                            totalTuition: status_1.registration.registrationAmount,
                            totalPaid: status_1.registration.paidAmount,
                            remainingBalance: status_1.registration.remainingAmount,
                            totalDiscount: discountAmount,
                            paymentStatus: this.calculateOverallPaymentStatus(status_1),
                            registrationCount: 1, // One registration per semester
                            lastPaymentDate: status_1.paymentHistory.length > 0 ?
                                new Date(status_1.paymentHistory
                                    .sort(function (a, b) { return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(); })[0]
                                    .paymentDate) : undefined
                        };
                        return [2 /*return*/, summary];
                    case 5:
                        error_6 = _b.sent();
                        console.error('Error getting tuition summary:', error_6);
                        return [2 /*return*/, null];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // Private helper methods
    /**
     * Get current active semester - uses ACADEMIC_SETTINGS
     */
    TuitionManager.prototype.getCurrentSemester = function () {
        return __awaiter(this, void 0, void 0, function () {
            var DatabaseService_1, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('../../services/database/databaseService')); })];
                    case 1:
                        DatabaseService_1 = (_a.sent()).DatabaseService;
                        return [4 /*yield*/, DatabaseService_1.getCurrentSemester()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Error getting current semester:', error_7);
                        return [2 /*return*/, 'HK1_2024']; // Fallback if unable to fetch from settings
                    case 4: return [2 /*return*/];
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
    };
    /**
     * Validate payment amount against outstanding balance
     */
    TuitionManager.prototype.validatePaymentAmount = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var registration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tuitionService_1.tuitionService.getRegistrationById(request.registrationId)];
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
    }; /**
     * Format payment history with business logic
     */
    TuitionManager.prototype.formatPaymentHistory = function (history) {
        return history.map(function (payment) { return ({
            paymentId: payment.paymentId,
            paymentDate: payment.paymentDate instanceof Date
                ? payment.paymentDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD string
                : payment.paymentDate, // Keep as is if already string
            amount: payment.amount,
            registrationId: payment.registrationId
        }); });
    };
    /**
     * Business logic for formatting semester names
     */
    TuitionManager.prototype.formatSemesterName = function (semesterName) {
        switch (semesterName) {
            case 'hk1_2024':
                return 'Học kỳ 1';
            case 'hk2_2024':
                return 'Học kỳ 2';
            case 'hk1_2023':
                return 'Học kỳ 1';
            case 'hk2_2023':
                return 'Học kỳ 2';
            default:
                return semesterName;
        }
    }; /**
     * Calculate overall payment status - simplified to only 3 states
     */
    TuitionManager.prototype.calculateOverallPaymentStatus = function (status) {
        if (status.registration.remainingAmount <= 0) {
            return 'paid';
        }
        // Removed partial and overdue logic - simplified to just unpaid
        return 'unpaid';
    };
    /**
     * Helper method to resolve student ID from user ID if needed
     */
    TuitionManager.prototype.resolveStudentId = function (inputId) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!inputId.startsWith('U')) return [3 /*break*/, 2];
                        return [4 /*yield*/, tuitionService_1.tuitionService.mapUserIdToStudentId(inputId)];
                    case 1:
                        studentId = _a.sent();
                        if (!studentId) {
                            throw new Error("No student found for user ID: ".concat(inputId));
                        }
                        console.log("\uD83D\uDD04 Mapped userId ".concat(inputId, " to studentId ").concat(studentId));
                        return [2 /*return*/, studentId];
                    case 2: 
                    // Otherwise assume it's already a studentId
                    return [2 /*return*/, inputId];
                }
            });
        });
    };
    return TuitionManager;
}());
exports.default = new TuitionManager();
