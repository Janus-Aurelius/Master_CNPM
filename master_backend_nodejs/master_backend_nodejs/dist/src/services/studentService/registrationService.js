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
exports.registrationService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.registrationService = {
    getRegisteredCourses: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registeredCourses, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    ct.MaPhieuDangKy as \"registrationId\",\n                    ct.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    lm.SoTiet as \"credits\",\n                    lm.TenLoaiMon as \"courseType\",\n                    lm.SoTienMotTC as \"fee\",\n                    pd.NgayLap as \"registrationDate\",\n                    hk.TenHocKy as \"semesterName\"\n                FROM CT_PHIEUDANGKY ct\n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy\n                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy\n                WHERE pd.MaSoSinhVien = $1 AND pd.MaHocKy = $2\n                ORDER BY ct.MaMonHoc\n            ", [studentId, semesterId])];
                    case 1:
                        registeredCourses = _a.sent();
                        return [2 /*return*/, registeredCourses.map(function (course) { return ({
                                registrationId: course.registrationId,
                                courseId: course.courseId,
                                courseName: course.courseName,
                                credits: course.credits,
                                courseType: course.courseType,
                                fee: course.fee
                            }); })];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting registered courses:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, // Lấy chi tiết môn học đã đăng ký
    getCourseRegistrationDetails: function (studentId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseDetail, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    ct.MaPhieuDangKy as \"registrationId\",\n                    ct.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    lm.SoTiet as \"credits\",\n                    lm.TenLoaiMon as \"courseType\",\n                    lm.SoTienMotTC as \"fee\",\n                    pd.NgayLap as \"registrationDate\",\n                    hk.TenHocKy as \"semesterName\"\n                FROM CT_PHIEUDANGKY ct\n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy\n                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy\n                WHERE pd.MaSoSinhVien = $1 AND ct.MaMonHoc = $2\n            ", [studentId, courseId])];
                    case 1:
                        courseDetail = _a.sent();
                        if (!courseDetail)
                            return [2 /*return*/, null];
                        return [2 /*return*/, {
                                registrationId: courseDetail.registrationId,
                                courseId: courseDetail.courseId,
                                courseName: courseDetail.courseName,
                                credits: courseDetail.credits,
                                courseType: courseDetail.courseType,
                                fee: courseDetail.fee
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting course registration details:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, // Đăng ký môn học cho sinh viên
    registerCourse: function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var offeredCourse, registration, newRegistrationId, existingDetail, courseInfo, courseFee, student, course, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaHocKy, MaMonHoc \n                FROM DANHSACHMONHOCMO \n                WHERE MaHocKy = $1 AND MaMonHoc = $2\n            ", [semesterId, courseId])];
                    case 1:
                        offeredCourse = _a.sent();
                        if (!offeredCourse) {
                            throw new Error('Môn học này không có trong danh sách mở');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy \n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 2:
                        registration = _a.sent();
                        if (!!registration) return [3 /*break*/, 4];
                        newRegistrationId = "PDK_".concat(studentId, "_").concat(semesterId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    INSERT INTO PHIEUDANGKY (MaPhieuDangKy, NgayLap, MaSoSinhVien, MaHocKy, SoTienDangKy, SoTienPhaiDong, SoTienDaDong, SoTinChiToiDa)\n                    VALUES ($1, NOW(), $2, $3, 0, 0, 0, 24)\n                ", [newRegistrationId, studentId, semesterId])];
                    case 3:
                        _a.sent();
                        registration = { MaPhieuDangKy: newRegistrationId };
                        _a.label = 4;
                    case 4: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy \n                FROM CT_PHIEUDANGKY \n                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2\n            ", [registration.MaPhieuDangKy, courseId])];
                    case 5:
                        existingDetail = _a.sent();
                        if (existingDetail) {
                            throw new Error('Sinh viên đã đăng ký môn học này rồi');
                        }
                        // Thêm môn học vào chi tiết phiếu đăng ký
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO CT_PHIEUDANGKY (MaPhieuDangKy, MaHocKy, MaMonHoc)\n                VALUES ($1, $2, $3)\n            ", [registration.MaPhieuDangKy, semesterId, courseId])];
                    case 6:
                        // Thêm môn học vào chi tiết phiếu đăng ký
                        _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT lm.SoTienMotTC, lm.SoTiet\n                FROM MONHOC mh\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE mh.MaMonHoc = $1\n            ", [courseId])];
                    case 7:
                        courseInfo = _a.sent();
                        if (!courseInfo) return [3 /*break*/, 9];
                        courseFee = courseInfo.SoTienMotTC * (courseInfo.SoTiet / courseInfo.SoTietMotTC || 1);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    UPDATE PHIEUDANGKY \n                    SET SoTienDangKy = SoTienDangKy + $1,\n                        SoTienPhaiDong = SoTienPhaiDong + $1\n                    WHERE MaPhieuDangKy = $2\n                ", [courseFee, registration.MaPhieuDangKy])];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT HoTen FROM SINHVIEN WHERE MaSoSinhVien = $1", [studentId])];
                    case 10:
                        student = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT TenMonHoc FROM MONHOC WHERE MaMonHoc = $1", [courseId])];
                    case 11:
                        course = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO REGISTRATION_LOG (MaSoSinhVien, TenSinhVien, MaMonHoc, TenMonHoc, LoaiYeuCau)\n                 VALUES ($1, $2, $3, $4, 'register')", [studentId, (student === null || student === void 0 ? void 0 : student.HoTen) || '', courseId, (course === null || course === void 0 ? void 0 : course.TenMonHoc) || ''])];
                    case 12:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 13:
                        error_3 = _a.sent();
                        console.error('Error registering course:', error_3);
                        throw error_3;
                    case 14: return [2 /*return*/];
                }
            });
        });
    },
    // Hủy đăng ký môn học
    cancelCourseRegistration: function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, registrationDetail, courseInfo, courseFee, student, course, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy \n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        if (!registration) {
                            throw new Error('Không tìm thấy phiếu đăng ký');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy\n                FROM CT_PHIEUDANGKY\n                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2\n            ", [registration.MaPhieuDangKy, courseId])];
                    case 2:
                        registrationDetail = _a.sent();
                        if (!registrationDetail) {
                            throw new Error('Sinh viên chưa đăng ký môn học này');
                        }
                        // Xóa môn học khỏi chi tiết phiếu đăng ký
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                DELETE FROM CT_PHIEUDANGKY\n                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2\n            ", [registration.MaPhieuDangKy, courseId])];
                    case 3:
                        // Xóa môn học khỏi chi tiết phiếu đăng ký
                        _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT lm.SoTienMotTC, lm.SoTiet\n                FROM MONHOC mh\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE mh.MaMonHoc = $1\n            ", [courseId])];
                    case 4:
                        courseInfo = _a.sent();
                        if (!courseInfo) return [3 /*break*/, 6];
                        courseFee = courseInfo.SoTienMotTC * (courseInfo.SoTiet / courseInfo.SoTietMotTC || 1);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    UPDATE PHIEUDANGKY \n                    SET SoTienDangKy = SoTienDangKy - $1,\n                        SoTienPhaiDong = SoTienPhaiDong - $1\n                    WHERE MaPhieuDangKy = $2\n                ", [courseFee, registration.MaPhieuDangKy])];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT HoTen FROM SINHVIEN WHERE MaSoSinhVien = $1", [studentId])];
                    case 7:
                        student = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT TenMonHoc FROM MONHOC WHERE MaMonHoc = $1", [courseId])];
                    case 8:
                        course = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO REGISTRATION_LOG (MaSoSinhVien, TenSinhVien, MaMonHoc, TenMonHoc, LoaiYeuCau)\n                 VALUES ($1, $2, $3, $4, 'cancel')", [studentId, (student === null || student === void 0 ? void 0 : student.HoTen) || '', courseId, (course === null || course === void 0 ? void 0 : course.TenMonHoc) || ''])];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 10:
                        error_4 = _a.sent();
                        console.error('Error canceling course registration:', error_4);
                        throw error_4;
                    case 11: return [2 /*return*/];
                }
            });
        });
    },
    // Lấy lịch sử đăng ký của sinh viên
    getRegistrationHistory: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var registrations, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    pd.MaPhieuDangKy as \"registrationId\",\n                    pd.NgayLap as \"registrationDate\",\n                    pd.MaSoSinhVien as \"studentId\",\n                    pd.MaHocKy as \"semesterId\",\n                    pd.SoTienDangKy as \"registrationAmount\",\n                    pd.SoTienPhaiDong as \"requiredAmount\",\n                    pd.SoTienDaDong as \"paidAmount\",\n                    (pd.SoTienPhaiDong - pd.SoTienDaDong) as \"remainingAmount\",\n                    pd.SoTinChiToiDa as \"maxCredits\"\n                FROM PHIEUDANGKY pd\n                WHERE pd.MaSoSinhVien = $1\n                ORDER BY pd.NgayLap DESC\n            ", [studentId])];
                    case 1:
                        registrations = _a.sent();
                        return [2 /*return*/, registrations];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting registration history:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Kiểm tra sinh viên đã đăng ký môn học chưa
    checkCourseRegistrationStatus: function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT ct.MaPhieuDangKy\n                FROM CT_PHIEUDANGKY ct\n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy\n                WHERE pd.MaSoSinhVien = $1 AND ct.MaMonHoc = $2 AND pd.MaHocKy = $3\n            ", [studentId, courseId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        return [2 /*return*/, !!registration];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error checking course registration status:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, // Lấy danh sách môn học có thể đăng ký (DANHSACHMONHOCMO)
    getAvailableCourses: function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var availableCourses, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    dsm.MaHocKy as \"semesterId\",\n                    dsm.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    lm.SoTiet as \"credits\",\n                    lm.TenLoaiMon as \"courseType\",\n                    lm.SoTienMotTC as \"feePerCredit\"\n                FROM DANHSACHMONHOCMO dsm\n                JOIN MONHOC mh ON dsm.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE dsm.MaHocKy = $1\n                ORDER BY mh.TenMonHoc\n            ", [semesterId])];
                    case 1:
                        availableCourses = _a.sent();
                        return [2 /*return*/, availableCourses];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error getting available courses:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Đăng ký nhiều môn học cùng lúc
    registerCourses: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, courseIds, semesterId, results, successCount, failCount, _i, courseIds_1, courseId, error_8, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        studentId = data.studentId, courseIds = data.courseIds, semesterId = data.semesterId;
                        results = [];
                        successCount = 0;
                        failCount = 0;
                        _i = 0, courseIds_1 = courseIds;
                        _a.label = 1;
                    case 1:
                        if (!(_i < courseIds_1.length)) return [3 /*break*/, 6];
                        courseId = courseIds_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.registerCourse(studentId, courseId, semesterId)];
                    case 3:
                        _a.sent();
                        results.push({ courseId: courseId, success: true, message: 'Đăng ký thành công' });
                        successCount++;
                        return [3 /*break*/, 5];
                    case 4:
                        error_8 = _a.sent();
                        results.push({ courseId: courseId, success: false, message: error_8 instanceof Error ? error_8.message : 'Lỗi không xác định' });
                        failCount++;
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, {
                            success: successCount > 0,
                            message: "\u0110\u0103ng k\u00FD th\u00E0nh c\u00F4ng ".concat(successCount, "/").concat(courseIds.length, " m\u00F4n h\u1ECDc"),
                            details: results
                        }];
                    case 7:
                        error_9 = _a.sent();
                        console.error('Error registering multiple courses:', error_9);
                        throw error_9;
                    case 8: return [2 /*return*/];
                }
            });
        });
    },
    // Hủy đăng ký môn học (alias cho cancelCourseRegistration)
    unregisterCourse: function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cancelCourseRegistration(studentId, courseId, semesterId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
    // Lấy thông tin phiếu đăng ký
    getRegistrationInfo: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    pd.MaPhieuDangKy as \"registrationId\",\n                    pd.NgayLap as \"registrationDate\",\n                    pd.MaSoSinhVien as \"studentId\",\n                    pd.MaHocKy as \"semesterId\",\n                    pd.SoTienDangKy as \"registrationAmount\",\n                    pd.SoTienPhaiDong as \"requiredAmount\",\n                    pd.SoTienDaDong as \"paidAmount\",\n                    (pd.SoTienPhaiDong - pd.SoTienDaDong) as \"remainingAmount\",\n                    pd.SoTinChiToiDa as \"maxCredits\"\n                FROM PHIEUDANGKY pd\n                WHERE pd.MaSoSinhVien = $1 AND pd.MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        return [2 /*return*/, registration];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error getting registration info:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
