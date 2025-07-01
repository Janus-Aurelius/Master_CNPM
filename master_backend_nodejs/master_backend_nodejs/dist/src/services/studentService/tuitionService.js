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
exports.tuitionService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.tuitionService = {
    getTuitionStatus: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, courses, registrationAmount, discount, discountMultiplier, requiredAmount, paymentHistory, paidAmount, remainingAmount, enhancedRegistration, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    MaPhieuDangKy as \"registrationId\",\n                    NgayLap as \"registrationDate\",\n                    MaSoSinhVien as \"studentId\", \n                    MaHocKy as \"semesterId\",\n                    SoTinChiToiDa as \"maxCredits\"\n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.getRegisteredCoursesWithFees(registration.registrationId)];
                    case 2:
                        courses = _a.sent();
                        registrationAmount = courses.reduce(function (total, course) { return total + course.totalFee; }, 0);
                        return [4 /*yield*/, this.getStudentDiscount(studentId)];
                    case 3:
                        discount = _a.sent();
                        discountMultiplier = discount ? (1 - discount.percentage) : 1;
                        requiredAmount = registrationAmount * discountMultiplier;
                        return [4 /*yield*/, this.getPaymentHistory(registration.registrationId)];
                    case 4:
                        paymentHistory = _a.sent();
                        paidAmount = paymentHistory.reduce(function (total, payment) { return total + (payment.amount || 0); }, 0);
                        remainingAmount = Math.max(0, requiredAmount - paidAmount);
                        enhancedRegistration = __assign(__assign({}, registration), { registrationAmount: registrationAmount, requiredAmount: requiredAmount, paidAmount: paidAmount, remainingAmount: remainingAmount });
                        return [2 /*return*/, {
                                registration: enhancedRegistration,
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
    }, /**
     * Get registered courses with calculated fees
     */
    getRegisteredCoursesWithFees: function (registrationId) {
        return __awaiter(this, void 0, void 0, function () {
            var courses, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    mh.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    mh.SoTiet as \"totalPeriods\",\n                    lm.SoTienMotTC as \"pricePerCredit\",\n                    lm.SoTietMotTC as \"periodsPerCredit\",\n                    lm.TenLoaiMon as \"courseType\"\n                FROM CT_PHIEUDANGKY ct\n                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE ct.MaPhieuDangKy = $1\n                ORDER BY mh.TenMonHoc\n            ", [registrationId])];
                    case 1:
                        courses = _a.sent();
                        return [2 /*return*/, courses.map(function (course) {
                                // Calculate actual credits: SoTiet / SoTietMotTC
                                var actualCredits = course.totalPeriods / course.periodsPerCredit;
                                var totalFee = actualCredits * course.pricePerCredit;
                                return {
                                    courseId: course.courseId,
                                    courseName: course.courseName,
                                    credits: actualCredits,
                                    totalPeriods: course.totalPeriods,
                                    periodsPerCredit: course.periodsPerCredit,
                                    pricePerCredit: course.pricePerCredit,
                                    totalFee: totalFee,
                                    courseType: course.courseType
                                };
                            })];
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
     */ getStudentDiscount: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var discountInfo, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    dt.TenDoiTuong as \"priorityType\",\n                    dt.MucGiamHocPhi as \"discountPercentage\",\n                    dt.MaDoiTuong as \"priorityCode\"\n                FROM SINHVIEN sv\n                JOIN DOITUONGUUTIEN dt ON sv.MaDoiTuongUT = dt.MaDoiTuong\n                WHERE sv.MaSoSinhVien = $1\n            ", [studentId])];
                    case 1:
                        discountInfo = _a.sent();
                        if (!discountInfo || !discountInfo.discountPercentage) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                type: discountInfo.priorityType,
                                percentage: discountInfo.discountPercentage,
                                amount: 0, // Will be calculated when applying to specific amount
                                code: discountInfo.priorityCode
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
    }, /**
     * Make a payment
     */
    makePayment: function (paymentRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, tuitionStatus, nextIdResult, nextId, paymentId, newPaidAmount, newRemainingAmount, status_1, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    MaPhieuDangKy as \"registrationId\",\n                    MaSoSinhVien as \"studentId\",\n                    MaHocKy as \"semesterId\"\n                FROM PHIEUDANGKY \n                WHERE MaPhieuDangKy = $1\n            ", [paymentRequest.registrationId])];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            throw new Error('Registration not found');
                        }
                        return [4 /*yield*/, this.getTuitionStatus(registration.studentId, registration.semesterId)];
                    case 2:
                        tuitionStatus = _a.sent();
                        if (!tuitionStatus) {
                            throw new Error('Unable to calculate tuition status');
                        }
                        // Validate payment amount
                        if (paymentRequest.amount > tuitionStatus.registration.remainingAmount) {
                            throw new Error('Payment amount exceeds remaining amount');
                        } // Generate payment ID based on existing pattern (PT + number)
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COALESCE(MAX(CAST(SUBSTRING(MaPhieuThu FROM 3) AS INTEGER)), 0) + 1 as next_id\n                FROM PHIEUTHUHP \n                WHERE MaPhieuThu LIKE 'PT%'\n            ")];
                    case 3:
                        nextIdResult = _a.sent();
                        nextId = String((nextIdResult === null || nextIdResult === void 0 ? void 0 : nextIdResult.next_id) || 1).padStart(3, '0');
                        paymentId = "PT".concat(nextId);
                        // Insert payment record with CURRENT_DATE for current date
                        console.log('💳 Creating payment record:', paymentId, 'for registration:', paymentRequest.registrationId, 'amount:', paymentRequest.amount);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO PHIEUTHUHP (MaPhieuThu, NgayLap, MaPhieuDangKy, SoTienDong)\n                VALUES ($1, CURRENT_DATE, $2, $3)\n            ", [paymentId, paymentRequest.registrationId, paymentRequest.amount])];
                    case 4:
                        _a.sent();
                        console.log('✅ Payment record created successfully');
                        newPaidAmount = tuitionStatus.registration.paidAmount + paymentRequest.amount;
                        newRemainingAmount = Math.max(0, tuitionStatus.registration.requiredAmount - newPaidAmount);
                        // Update PHIEUDANGKY with new remaining amount
                        console.log('💰 Updating PHIEUDANGKY with new remaining amount:', newRemainingAmount);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE PHIEUDANGKY \n                SET SoTienConLai = $1 \n                WHERE MaPhieuDangKy = $2\n            ", [newRemainingAmount, paymentRequest.registrationId])];
                    case 5:
                        _a.sent();
                        console.log('✅ PHIEUDANGKY updated successfully'); // Determine status - simplified to only 3 states
                        status_1 = 'unpaid';
                        if (newRemainingAmount <= 0) {
                            status_1 = 'paid';
                        }
                        // Removed partial status - now only unpaid/paid
                        return [2 /*return*/, {
                                success: true,
                                paymentId: paymentId,
                                newPaidAmount: newPaidAmount,
                                newRemainingAmount: newRemainingAmount,
                                status: status_1
                            }];
                    case 6:
                        error_5 = _a.sent();
                        console.error('Error making payment:', error_5);
                        throw error_5;
                    case 7: return [2 /*return*/];
                }
            });
        });
    }, /**
     * Calculate tuition with discount applied
     */
    calculateTuitionWithDiscount: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var tuitionStatus, baseAmount, discount, discountAmount, discountDetails, finalAmount, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getTuitionStatus(studentId, semesterId)];
                    case 1:
                        tuitionStatus = _a.sent();
                        if (!tuitionStatus) {
                            throw new Error('Registration not found');
                        }
                        baseAmount = tuitionStatus.registration.registrationAmount;
                        discount = tuitionStatus.discount;
                        discountAmount = 0;
                        discountDetails = null;
                        if (discount) {
                            // Apply percentage discount
                            discountAmount = baseAmount * discount.percentage;
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
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error calculating tuition:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, /**
     * Helper: Calculate course fee (kept for backward compatibility)
     */
    calculateCourseFee: function (totalPeriods, pricePerCredit, periodsPerCredit) {
        var actualCredits = totalPeriods / (periodsPerCredit || 1);
        return actualCredits * pricePerCredit;
    }, /**
     * Get all outstanding tuitions (for financial department)
     */
    getOutstandingTuitions: function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params, registrations, outstandingTuitions, error_7;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        query = "\n                SELECT DISTINCT\n                    pd.MaHocKy as \"semesterId\",\n                    pd.MaSoSinhVien as \"studentId\", \n                    pd.MaPhieuDangKy as \"registrationId\",\n                    sv.HoTen as \"studentName\"\n                FROM PHIEUDANGKY pd\n                JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien\n                WHERE 1=1\n            ";
                        params = [];
                        if (semesterId) {
                            query += " AND pd.MaHocKy = $1";
                            params.push(semesterId);
                        }
                        query += " ORDER BY pd.NgayLap DESC";
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, params)];
                    case 1:
                        registrations = _a.sent();
                        return [4 /*yield*/, Promise.all(registrations.map(function (reg) { return __awaiter(_this, void 0, void 0, function () {
                                var tuitionStatus;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getTuitionStatus(reg.studentId, reg.semesterId)];
                                        case 1:
                                            tuitionStatus = _a.sent();
                                            if (!tuitionStatus || tuitionStatus.registration.remainingAmount <= 0) {
                                                return [2 /*return*/, null]; // Filter out paid tuitions
                                            }
                                            return [2 /*return*/, {
                                                    semesterId: reg.semesterId,
                                                    studentId: reg.studentId,
                                                    registrationId: reg.registrationId,
                                                    studentName: reg.studentName,
                                                    requiredAmount: tuitionStatus.registration.requiredAmount,
                                                    paidAmount: tuitionStatus.registration.paidAmount,
                                                    remainingAmount: tuitionStatus.registration.remainingAmount
                                                }];
                                    }
                                });
                            }); }))];
                    case 2:
                        outstandingTuitions = _a.sent();
                        // Filter out null values (paid tuitions)
                        return [2 /*return*/, outstandingTuitions.filter(function (item) { return item !== null; })];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Error getting outstanding tuitions:', error_7);
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, /**
     * Get all registrations for a student
     */
    getAllRegistrations: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var registrations, registrationsWithAmounts, error_8;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    pd.MaPhieuDangKy as \"registrationId\",\n                    pd.MaHocKy as \"semesterId\", \n                    pd.MaHocKy as \"semesterName\",\n                    hy.NamHoc as \"year\",\n                    pd.NgayLap as \"registrationDate\",\n                    hy.ThoiHanDongHP as \"dueDate\"\n                FROM PHIEUDANGKY pd\n                LEFT JOIN HOCKYNAMHOC hy ON pd.MaHocKy = hy.MaHocKy\n                WHERE pd.MaSoSinhVien = $1\n                ORDER BY pd.MaHocKy DESC\n            ", [studentId])];
                    case 1:
                        registrations = _a.sent();
                        return [4 /*yield*/, Promise.all(registrations.map(function (reg) { return __awaiter(_this, void 0, void 0, function () {
                                var tuitionStatus, status;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getTuitionStatus(studentId, reg.semesterId)];
                                        case 1:
                                            tuitionStatus = _a.sent();
                                            if (!tuitionStatus) {
                                                return [2 /*return*/, __assign(__assign({}, reg), { originalAmount: 0, totalAmount: 0, paidAmount: 0, remainingAmount: 0, status: 'error' })];
                                            } // Determine status - simplified to only 3 states
                                            status = 'unpaid';
                                            if (tuitionStatus.registration.remainingAmount <= 0) {
                                                status = 'paid';
                                            }
                                            // Removed overdue and partial status - now only unpaid/paid for opened semesters
                                            return [2 /*return*/, __assign(__assign({}, reg), { originalAmount: tuitionStatus.registration.registrationAmount, totalAmount: tuitionStatus.registration.requiredAmount, paidAmount: tuitionStatus.registration.paidAmount, remainingAmount: tuitionStatus.registration.remainingAmount, status: status, discount: tuitionStatus.discount })];
                                    }
                                });
                            }); }))];
                    case 2:
                        registrationsWithAmounts = _a.sent();
                        return [2 /*return*/, registrationsWithAmounts || []];
                    case 3:
                        error_8 = _a.sent();
                        console.error('Error getting all registrations:', error_8);
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get all registration IDs for a student (for payment history)
     */
    getAllRegistrationIds: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var registrations, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT MaPhieuDangKy as \"registrationId\" \n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1\n                ORDER BY NgayLap DESC\n            ", [studentId])];
                    case 1:
                        registrations = _a.sent();
                        return [2 /*return*/, registrations.map(function (reg) { return reg.registrationId; })];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error getting registration IDs:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get registration by student and semester
     */
    getRegistrationBySemester: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy as \"registrationId\" \n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        return [2 /*return*/, registration];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error getting registration by semester:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, /**
     * Get registration by ID for validation
     */
    getRegistrationById: function (registrationId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, tuitionStatus, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    MaSoSinhVien as \"studentId\",\n                    MaHocKy as \"semesterId\"\n                FROM PHIEUDANGKY \n                WHERE MaPhieuDangKy = $1\n            ", [registrationId])];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.getTuitionStatus(registration.studentId, registration.semesterId)];
                    case 2:
                        tuitionStatus = _a.sent();
                        if (!tuitionStatus) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, {
                                studentId: registration.studentId,
                                semesterId: registration.semesterId,
                                remainingAmount: tuitionStatus.registration.remainingAmount
                            }];
                    case 3:
                        error_11 = _a.sent();
                        console.error('Error getting registration by ID:', error_11);
                        throw error_11;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Map userId to studentId
     */
    mapUserIdToStudentId: function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT masosinhvien \n                FROM nguoidung \n                WHERE userid = $1\n            ", [userId])];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.masosinhvien) || null];
                    case 2:
                        error_12 = _a.sent();
                        console.error('Error mapping userId to studentId:', error_12);
                        throw error_12;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
};
