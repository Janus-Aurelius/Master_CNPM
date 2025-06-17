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
exports.tuitionService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.tuitionService = {
    /**
     * Get tuition status for student in a semester
     * Shows registered courses, amounts, payment history
     */
    getTuitionStatus: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, courses, discount, paymentHistory, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    MaPhieuDangKy as \"registrationId\",\n                    NgayLap as \"registrationDate\",\n                    MaSoSinhVien as \"studentId\", \n                    MaHocKy as \"semesterId\",\n                    SoTienDangKy as \"registrationAmount\",\n                    SoTienPhaiDong as \"requiredAmount\",\n                    SoTienDaDong as \"paidAmount\",\n                    SoTienConLai as \"remainingAmount\",\n                    SoTinChiToiDa as \"maxCredits\"\n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.getRegisteredCoursesWithFees(registration.registrationId)];
                    case 2:
                        courses = _a.sent();
                        return [4 /*yield*/, this.getStudentDiscount(studentId)];
                    case 3:
                        discount = _a.sent();
                        return [4 /*yield*/, this.getPaymentHistory(registration.registrationId)];
                    case 4:
                        paymentHistory = _a.sent();
                        return [2 /*return*/, {
                                registration: registration,
                                courses: courses,
                                discount: discount,
                                paymentHistory: paymentHistory
                            }];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error getting tuition status:', error_1);
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get registered courses with calculated fees
     */
    getRegisteredCoursesWithFees: function (registrationId) {
        return __awaiter(this, void 0, void 0, function () {
            var courses, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    mh.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    mh.SoTiet as \"credits\",\n                    lm.SoTienMotTC as \"pricePerCredit\",\n                    lm.SoTietMotTC as \"creditsPerUnit\",\n                    lm.TenLoaiMon as \"courseType\"\n                FROM CT_PHIEUDANGKY ct\n                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE ct.MaPhieuDangKy = $1\n                ORDER BY mh.TenMonHoc\n            ", [registrationId])];
                    case 1:
                        courses = _a.sent();
                        return [2 /*return*/, courses.map(function (course) { return ({
                                courseId: course.courseId,
                                courseName: course.courseName,
                                credits: course.credits,
                                pricePerCredit: course.pricePerCredit,
                                totalFee: _this.calculateCourseFee(course.credits, course.pricePerCredit, course.creditsPerUnit),
                                courseType: course.courseType
                            }); })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting registered courses:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get student discount from priority object
     */
    getStudentDiscount: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var discountInfo, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    dt.TenDoiTuong as \"priorityType\",\n                    dt.MucGiamHocPhi as \"discountAmount\"\n                FROM SINHVIEN sv\n                JOIN DOITUONGUUTIEN dt ON sv.MaDoiTuongUT = dt.MaDoiTuong\n                WHERE sv.MaSoSinhVien = $1\n            ", [studentId])];
                    case 1:
                        discountInfo = _a.sent();
                        if (!discountInfo || !discountInfo.discountAmount) {
                            return [2 /*return*/, null];
                        }
                        // Convert absolute discount to percentage (assuming it's percentage for now)
                        return [2 /*return*/, {
                                type: discountInfo.priorityType,
                                percentage: discountInfo.discountAmount,
                                amount: 0 // Will be calculated when applying to total
                            }];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error getting student discount:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get payment history from PHIEUTHUHP
     */
    getPaymentHistory: function (registrationId) {
        return __awaiter(this, void 0, void 0, function () {
            var payments, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaPhieuThu as \"paymentId\",\n                    NgayLap as \"paymentDate\",\n                    SoTienDong as \"amount\",\n                    MaPhieuDangKy as \"registrationId\"\n                FROM PHIEUTHUHP \n                WHERE MaPhieuDangKy = $1\n                ORDER BY NgayLap DESC\n            ", [registrationId])];
                    case 1:
                        payments = _a.sent();
                        return [2 /*return*/, payments];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error getting payment history:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Make a payment
     */
    makePayment: function (paymentRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, paymentId, newPaidAmount, newRemainingAmount, status_1, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT SoTienDaDong, SoTienConLai, SoTienPhaiDong \n                FROM PHIEUDANGKY \n                WHERE MaPhieuDangKy = $1\n            ", [paymentRequest.registrationId])];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            throw new Error('Registration not found');
                        }
                        // Validate payment amount
                        if (paymentRequest.amount > registration.SoTienConLai) {
                            throw new Error('Payment amount exceeds remaining amount');
                        }
                        paymentId = "THU_".concat(Date.now(), "_").concat(paymentRequest.registrationId);
                        // Insert payment record
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO PHIEUTHUHP (MaPhieuThu, NgayLap, MaPhieuDangKy, SoTienDong)\n                VALUES ($1, NOW(), $2, $3)\n            ", [paymentId, paymentRequest.registrationId, paymentRequest.amount])];
                    case 2:
                        // Insert payment record
                        _a.sent();
                        newPaidAmount = registration.SoTienDaDong + paymentRequest.amount;
                        newRemainingAmount = registration.SoTienPhaiDong - newPaidAmount;
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE PHIEUDANGKY \n                SET SoTienDaDong = $1, SoTienConLai = $2\n                WHERE MaPhieuDangKy = $3\n            ", [newPaidAmount, newRemainingAmount, paymentRequest.registrationId])];
                    case 3:
                        _a.sent();
                        status_1 = 'unpaid';
                        if (newRemainingAmount <= 0) {
                            status_1 = 'paid';
                        }
                        else if (newPaidAmount > 0) {
                            status_1 = 'partial';
                        }
                        return [2 /*return*/, {
                                success: true,
                                paymentId: paymentId,
                                newPaidAmount: newPaidAmount,
                                newRemainingAmount: newRemainingAmount,
                                status: status_1
                            }];
                    case 4:
                        error_5 = _a.sent();
                        console.error('Error making payment:', error_5);
                        throw error_5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Calculate tuition with discount applied
     */
    calculateTuitionWithDiscount: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, baseAmount, discount, discountAmount, discountDetails, finalAmount, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT SoTienDangKy FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            throw new Error('Registration not found');
                        }
                        baseAmount = registration.SoTienDangKy;
                        return [4 /*yield*/, this.getStudentDiscount(studentId)];
                    case 2:
                        discount = _a.sent();
                        discountAmount = 0;
                        discountDetails = null;
                        if (discount) {
                            // Apply percentage discount
                            discountAmount = (baseAmount * discount.percentage) / 100;
                            discountDetails = {
                                type: discount.type,
                                rate: discount.percentage
                            };
                        }
                        finalAmount = baseAmount - discountAmount;
                        return [2 /*return*/, {
                                baseAmount: baseAmount,
                                discountAmount: discountAmount,
                                finalAmount: finalAmount,
                                discountDetails: discountDetails
                            }];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error calculating tuition:', error_6);
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Helper: Calculate course fee
     */
    calculateCourseFee: function (credits, pricePerCredit, creditsPerUnit) {
        var actualCredits = credits / (creditsPerUnit || 1);
        return actualCredits * pricePerCredit;
    },
    /**
     * Get all outstanding tuitions (for financial department)
     */
    getOutstandingTuitions: function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT \n                    pd.MaHocKy as \"semesterId\",\n                    pd.MaSoSinhVien as \"studentId\", \n                    pd.MaPhieuDangKy as \"registrationId\",\n                    sv.HoTen as \"studentName\",\n                    pd.SoTienPhaiDong as \"requiredAmount\",\n                    pd.SoTienDaDong as \"paidAmount\",\n                    pd.SoTienConLai as \"remainingAmount\"\n                FROM PHIEUDANGKY pd\n                JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien\n                WHERE pd.SoTienConLai > 0\n            ";
                        params = [];
                        if (semesterId) {
                            query += " AND pd.MaHocKy = $1";
                            params.push(semesterId);
                        }
                        query += " ORDER BY pd.NgayLap DESC";
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, params)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error getting outstanding tuitions:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
