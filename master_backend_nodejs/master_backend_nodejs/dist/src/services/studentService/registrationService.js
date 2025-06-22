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
exports.registrationService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.registrationService = {
    // Lấy danh sách môn học sinh viên đã đăng ký trong học kỳ
    getRegisteredCourses: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registeredCourses, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    ct.MaPhieuDangKy as \"registrationId\",\n                    ct.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    mh.SoTiet as \"credits\",\n                    lm.TenLoaiMon as \"courseType\",\n                    lm.SoTienMotTC as \"fee\",\n                    pd.NgayLap as \"registrationDate\",\n                    hk.TenHocKy as \"semesterName\"\n                FROM CT_PHIEUDANGKY ct\n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy\n                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy\n                WHERE pd.MaSoSinhVien = $1 AND pd.MaHocKy = $2\n                ORDER BY ct.MaMonHoc\n            ", [studentId, semesterId])];
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
    },
    // Kiểm tra PHIEUDANGKY đã tồn tại chưa
    checkRegistrationExists: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy \n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        return [2 /*return*/, !!registration];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error checking registration exists:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Tạo PHIEUDANGKY cho sinh viên
    createRegistration: function (studentId_1, semesterId_1) {
        return __awaiter(this, arguments, void 0, function (studentId, semesterId, maxCredits) {
            var exists, newRegistrationId, error_3;
            if (maxCredits === void 0) { maxCredits = 24; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.checkRegistrationExists(studentId, semesterId)];
                    case 1:
                        exists = _a.sent();
                        if (exists) {
                            throw new Error('Sinh viên đã có phiếu đăng ký cho học kỳ này');
                        }
                        newRegistrationId = "PDK_".concat(studentId, "_").concat(semesterId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO PHIEUDANGKY (MaPhieuDangKy, NgayLap, MaSoSinhVien, MaHocKy, SoTienConLai, SoTinChiToiDa)\n                VALUES ($1, NOW(), $2, $3, 0, $4)\n            ", [newRegistrationId, studentId, semesterId, maxCredits])];
                    case 2:
                        _a.sent();
                        console.log("\u2705 [RegistrationService] Created registration with ID: ".concat(newRegistrationId));
                        return [2 /*return*/, newRegistrationId];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error creating registration:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    // Lấy danh sách môn học đã đăng ký với thông tin chi tiết từ DANHSACHMONHOCMO
    getEnrolledCoursesWithSchedule: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var actualSemesterId, _a, actualStudentId, userMapping, debugPhieuDangKy, debugCtPhieuDangKy, enrolledCourses, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        _a = semesterId;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, databaseService_1.DatabaseService.getCurrentSemester()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        actualSemesterId = _a;
                        console.log('🔍 [RegistrationService] Getting enrolled courses with schedule for student:', studentId, 'semester:', actualSemesterId);
                        actualStudentId = studentId;
                        if (!studentId.startsWith('U')) return [3 /*break*/, 4];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                    SELECT n.masosinhvien as \"mappedStudentId\"\n                    FROM NGUOIDUNG n\n                    WHERE n.userid = $1 OR UPPER(n.tendangnhap) = UPPER($1)\n                ", [studentId])];
                    case 3:
                        userMapping = _b.sent();
                        if (userMapping && userMapping.mappedStudentId) {
                            actualStudentId = userMapping.mappedStudentId;
                            console.log('✅ [RegistrationService] Converted to Student ID:', actualStudentId);
                        }
                        else {
                            console.log('❌ [RegistrationService] Could not find mapping for User ID:', studentId);
                            return [2 /*return*/, []];
                        }
                        _b.label = 4;
                    case 4: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT * FROM PHIEUDANGKY WHERE MaSoSinhVien = $1\n            ", [actualStudentId])];
                    case 5:
                        debugPhieuDangKy = _b.sent();
                        console.log('🔍 [Debug] PHIEUDANGKY records for student:', debugPhieuDangKy);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT ct.*, pd.MaSoSinhVien \n                FROM CT_PHIEUDANGKY ct \n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy \n                WHERE pd.MaSoSinhVien = $1\n            ", [actualStudentId])];
                    case 6:
                        debugCtPhieuDangKy = _b.sent();
                        console.log('🔍 [Debug] CT_PHIEUDANGKY records for student:', debugCtPhieuDangKy);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    ct.MaPhieuDangKy as \"registrationId\",\n                    ct.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    mh.SoTiet as \"credits\",\n                    lm.TenLoaiMon as \"courseType\",\n                    lm.SoTienMotTC as \"feePerCredit\",\n                    pd.NgayLap as \"registrationDate\",\n                    pd.MaHocKy as \"semesterName\",\n                    -- Th\u00F4ng tin t\u1EEB DANHSACHMONHOCMO\n                    dsmhm.Thu as \"dayOfWeek\",\n                    dsmhm.TietBatDau as \"startPeriod\",\n                    dsmhm.TietKetThuc as \"endPeriod\"\n                FROM CT_PHIEUDANGKY ct\n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy\n                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon                LEFT JOIN DANHSACHMONHOCMO dsmhm ON ct.MaMonHoc = dsmhm.MaMonHoc AND ct.MaHocKy = dsmhm.MaHocKy\n                WHERE pd.MaSoSinhVien = $1 AND pd.MaHocKy = $2\n                ORDER BY ct.MaMonHoc            ", [actualStudentId, actualSemesterId])];
                    case 7:
                        enrolledCourses = _b.sent();
                        console.log('🔍 [RegistrationService] Query parameters:', { actualStudentId: actualStudentId, actualSemesterId: actualSemesterId });
                        console.log('✅ [RegistrationService] Found enrolled courses:', enrolledCourses.length);
                        console.log('📋 [RegistrationService] Enrolled courses data:', enrolledCourses);
                        return [2 /*return*/, enrolledCourses.map(function (course) { return ({
                                id: course.courseId,
                                courseId: course.courseId,
                                courseName: course.courseName,
                                credits: course.credits,
                                courseType: course.courseType,
                                feePerCredit: course.feePerCredit,
                                registrationId: course.registrationId,
                                registrationDate: course.registrationDate,
                                semesterName: course.semesterName,
                                dayOfWeek: course.dayOfWeek,
                                startPeriod: course.startPeriod,
                                endPeriod: course.endPeriod,
                                lecturer: 'Chưa xác định', // Bỏ cột này vì không có trong DB
                                classroom: 'Chưa xác định', // Bỏ cột này vì không có trong DB
                                // Tính toán thông tin hiển thị
                                day: course.dayOfWeek ? "Th\u1EE9 ".concat(course.dayOfWeek) : 'Chưa xác định',
                                fromTo: course.startPeriod && course.endPeriod ?
                                    "Ti\u1EBFt ".concat(course.startPeriod, "-").concat(course.endPeriod) : 'Chưa xác định',
                                fee: course.feePerCredit ? course.feePerCredit * (course.credits / 15 || 1) : 0
                            }); })];
                    case 8:
                        error_4 = _b.sent();
                        console.error('❌ [RegistrationService] Error getting enrolled courses with schedule:', error_4);
                        throw error_4;
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
    // Lấy chi tiết môn học đã đăng ký
    getCourseRegistrationDetails: function (studentId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseDetail, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    ct.MaPhieuDangKy as \"registrationId\",\n                    ct.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    mh.SoTiet as \"credits\",\n                    lm.TenLoaiMon as \"courseType\",\n                    lm.SoTienMotTC as \"fee\",\n                    pd.NgayLap as \"registrationDate\",\n                    hk.TenHocKy as \"semesterName\"\n                FROM CT_PHIEUDANGKY ct\n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy\n                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy\n                WHERE pd.MaSoSinhVien = $1 AND ct.MaMonHoc = $2\n            ", [studentId, courseId])];
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
                        error_5 = _a.sent();
                        console.error('Error getting course registration details:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, // Đăng ký môn học cho sinh viên
    registerCourse: function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var offeredCourse, registration, registrationId, existingDetail, newCourseSchedule, registeredCourses, _i, registeredCourses_1, existingCourse, newStart, newEnd, existingStart, existingEnd, courseInfo, courseFee, student, course, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 12, , 13]);
                        console.log("\uD83D\uDD35 [RegistrationService] registerCourse called with:", {
                            studentId: studentId,
                            courseId: courseId,
                            semesterId: semesterId
                        });
                        // Kiểm tra môn học có trong danh sách mở không
                        console.log("\uD83D\uDD35 [RegistrationService] Checking if course ".concat(courseId, " is offered in semester ").concat(semesterId));
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaHocKy, MaMonHoc \n                FROM DANHSACHMONHOCMO \n                WHERE MaHocKy = $1 AND MaMonHoc = $2\n            ", [semesterId, courseId])];
                    case 1:
                        offeredCourse = _a.sent();
                        console.log("\uD83D\uDD35 [RegistrationService] Offered course query result:", offeredCourse);
                        if (!offeredCourse) {
                            console.log("\u274C [RegistrationService] Course ".concat(courseId, " is not offered in semester ").concat(semesterId));
                            throw new Error('Môn học này không có trong danh sách mở');
                        }
                        // Kiểm tra sinh viên đã có phiếu đăng ký chưa
                        console.log("\uD83D\uDD35 [RegistrationService] Checking existing registration for student ".concat(studentId));
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy \n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 2:
                        registration = _a.sent();
                        console.log("\uD83D\uDD35 [RegistrationService] Existing registration:", registration);
                        // Nếu chưa có PHIEUDANGKY, không cho phép đăng ký
                        if (!registration) {
                            console.log("\u274C [RegistrationService] No registration found for student ".concat(studentId, " in semester ").concat(semesterId));
                            throw new Error('Chưa mở đăng ký học phần cho học kỳ này. Vui lòng liên hệ phòng đào tạo.');
                        }
                        // Kiểm tra đã đăng ký môn này chưa
                        console.log("\uD83D\uDD35 [RegistrationService] Checking if course ".concat(courseId, " is already registered"));
                        registrationId = registration.maphieudangky || registration.MaPhieuDangKy;
                        console.log("\uD83D\uDD35 [RegistrationService] Using registration ID:", registrationId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy \n                FROM CT_PHIEUDANGKY \n                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2\n            ", [registrationId, courseId])];
                    case 3:
                        existingDetail = _a.sent();
                        console.log("\uD83D\uDD35 [RegistrationService] Existing detail:", existingDetail);
                        if (existingDetail) {
                            console.log("\u274C [RegistrationService] Course ".concat(courseId, " is already registered"));
                            throw new Error('Bạn đã đăng ký môn học này rồi!');
                        }
                        // Kiểm tra trùng lịch học
                        console.log("\uD83D\uDD35 [RegistrationService] Checking schedule conflicts for course ".concat(courseId));
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT Thu as \"thu\", TietBatDau as \"tietBatDau\", TietKetThuc as \"tietKetThuc\", MaMonHoc as \"maMonHoc\"\n                FROM DANHSACHMONHOCMO\n                WHERE MaHocKy = $1 AND MaMonHoc = $2\n            ", [semesterId, courseId])];
                    case 4:
                        newCourseSchedule = _a.sent();
                        if (!newCourseSchedule) return [3 /*break*/, 6];
                        console.log("\uD83D\uDD35 [RegistrationService] New course schedule:", newCourseSchedule);
                        // Lấy tất cả môn học đã đăng ký của sinh viên trong kỳ này
                        console.log("\uD83D\uDD0D [RegistrationService] Query for registered courses with params: registrationId=".concat(registrationId, ", semesterId=").concat(semesterId));
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    SELECT ds.Thu as \"thu\", ds.TietBatDau as \"tietBatDau\", ds.TietKetThuc as \"tietKetThuc\", \n                           ds.MaMonHoc as \"maMonHoc\", mh.TenMonHoc as \"tenMonHoc\"\n                    FROM CT_PHIEUDANGKY ct\n                    JOIN DANHSACHMONHOCMO ds ON ct.MaMonHoc = ds.MaMonHoc AND ct.MaHocKy = ds.MaHocKy\n                    JOIN MONHOC mh ON ds.MaMonHoc = mh.MaMonHoc\n                    WHERE ct.MaPhieuDangKy = $1 AND ct.MaHocKy = $2\n                ", [registrationId, semesterId])];
                    case 5:
                        registeredCourses = _a.sent();
                        console.log("\uD83D\uDD35 [RegistrationService] Already registered courses:", registeredCourses);
                        // Kiểm tra xung đột lịch học
                        for (_i = 0, registeredCourses_1 = registeredCourses; _i < registeredCourses_1.length; _i++) {
                            existingCourse = registeredCourses_1[_i];
                            console.log("\uD83D\uDD0D [RegistrationService] Checking conflict: New(Thu=".concat(newCourseSchedule.thu, ", ").concat(newCourseSchedule.tietBatDau, "-").concat(newCourseSchedule.tietKetThuc, ") vs Existing(Thu=").concat(existingCourse.thu, ", ").concat(existingCourse.tietBatDau, "-").concat(existingCourse.tietKetThuc, ")"));
                            if (existingCourse.thu === newCourseSchedule.thu) {
                                newStart = newCourseSchedule.tietBatDau;
                                newEnd = newCourseSchedule.tietKetThuc;
                                existingStart = existingCourse.tietBatDau;
                                existingEnd = existingCourse.tietKetThuc;
                                // Kiểm tra overlap: có bất kỳ tiết nào trùng không
                                // Overlap xảy ra khi các khoảng thời gian giao nhau
                                // [newStart, newEnd] và [existingStart, existingEnd] giao nhau khi:
                                // newStart <= existingEnd && existingStart <= newEnd
                                console.log("\uD83D\uDD0D [RegistrationService] Conflict check details: newStart=".concat(newStart, ", newEnd=").concat(newEnd, ", existingStart=").concat(existingStart, ", existingEnd=").concat(existingEnd));
                                if (newStart <= existingEnd && existingStart <= newEnd) {
                                    console.log("\u274C [RegistrationService] Schedule conflict detected with course ".concat(existingCourse.maMonHoc));
                                    throw new Error("Kh\u00F4ng th\u1EC3 \u0111\u0103ng k\u00FD v\u00EC tr\u00F9ng l\u1ECBch h\u1ECDc v\u1EDBi m\u00F4n \"".concat(existingCourse.tenMonHoc, "\" (Th\u1EE9 ").concat(existingCourse.thu, ", ti\u1EBFt ").concat(existingStart, "-").concat(existingEnd, ")"));
                                }
                                else {
                                    console.log("\u2705 [RegistrationService] No conflict with course ".concat(existingCourse.maMonHoc));
                                }
                            }
                        }
                        _a.label = 6;
                    case 6:
                        console.log("\uD83D\uDD35 [RegistrationService] Adding course ".concat(courseId, " to registration details"));
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO CT_PHIEUDANGKY (MaPhieuDangKy, MaHocKy, MaMonHoc)\n                VALUES ($1, $2, $3)\n            ", [registrationId, semesterId, courseId])];
                    case 7:
                        _a.sent();
                        console.log("\u2705 [RegistrationService] Successfully added course to registration details");
                        // Cập nhật số tiền đăng ký
                        console.log("\uD83D\uDD35 [RegistrationService] Getting course info for fee calculation");
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT lm.SoTienMotTC, mh.SoTiet, lm.SoTietMotTC\n                FROM MONHOC mh\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE mh.MaMonHoc = $1\n            ", [courseId])];
                    case 8:
                        courseInfo = _a.sent();
                        if (courseInfo) {
                            courseFee = courseInfo.sotienmottc || courseInfo.SoTienMotTC * ((courseInfo.sotiet || courseInfo.SoTiet) / (courseInfo.sotietmottc || courseInfo.SoTietMotTC) || 1);
                            // Schema chỉ có SoTienConLai, không có SoTienDangKy/SoTienPhaiDong
                            // Tạm thời skip việc update số tiền, chỉ log
                            console.log("\uD83D\uDCB0 [RegistrationService] Course fee calculated: ".concat(courseFee, " for course ").concat(courseId));
                            // Nếu cần update SoTienConLai, uncomment dòng dưới:
                            // await DatabaseService.query(`UPDATE PHIEUDANGKY SET SoTienConLai = SoTienConLai - $1 WHERE MaPhieuDangKy = $2`, [courseFee, registrationId]);
                        } // Log đăng ký
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT HoTen as \"studentName\" FROM SINHVIEN WHERE MaSoSinhVien = $1", [studentId])];
                    case 9:
                        student = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT TenMonHoc as \"courseName\" FROM MONHOC WHERE MaMonHoc = $1", [courseId])];
                    case 10:
                        course = _a.sent();
                        console.log("\uD83D\uDD0D [RegistrationService] Log data - Student:", student, "Course:", course);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO REGISTRATION_LOG (MaSoSinhVien, TenSinhVien, MaMonHoc, TenMonHoc, LoaiYeuCau)\n                 VALUES ($1, $2, $3, $4, 'register')", [studentId, (student === null || student === void 0 ? void 0 : student.studentName) || 'Unknown Student', courseId, (course === null || course === void 0 ? void 0 : course.courseName) || 'Unknown Course'])];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 12:
                        error_6 = _a.sent();
                        console.error('Error registering course:', error_6);
                        throw error_6;
                    case 13: return [2 /*return*/];
                }
            });
        });
    },
    // Hủy đăng ký môn học
    cancelCourseRegistration: function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, registrationId, registrationDetail, remainingCourses, courseInfo, courseFee, student, course, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        console.log("\uD83D\uDD0D [RegistrationService] Cancelling registration: Student=".concat(studentId, ", Course=").concat(courseId, ", Semester=").concat(semesterId)); // Tìm phiếu đăng ký của sinh viên trong học kỳ
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy as \"registrationId\"\n                FROM PHIEUDANGKY \n                WHERE MaSoSinhVien = $1 AND MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        console.log("\uD83D\uDD0D [RegistrationService] Found registration:", registration);
                        if (!registration) {
                            throw new Error('Không tìm thấy phiếu đăng ký');
                        }
                        registrationId = registration.registrationId;
                        console.log("\uD83D\uDD0D [RegistrationService] Using registration ID: ".concat(registrationId));
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaPhieuDangKy\n                FROM CT_PHIEUDANGKY\n                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2\n            ", [registrationId, courseId])];
                    case 2:
                        registrationDetail = _a.sent();
                        console.log("\uD83D\uDD0D [RegistrationService] Found registration detail:", registrationDetail);
                        if (!registrationDetail) {
                            throw new Error('Sinh viên chưa đăng ký môn học này');
                        } // Xóa môn học khỏi chi tiết phiếu đăng ký
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                DELETE FROM CT_PHIEUDANGKY\n                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2\n            ", [registrationId, courseId])];
                    case 3:
                        _a.sent();
                        console.log("\u2705 [RegistrationService] Successfully deleted course ".concat(courseId, " from registration ").concat(registrationId));
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count\n                FROM CT_PHIEUDANGKY\n                WHERE MaPhieuDangKy = $1\n            ", [registrationId])];
                    case 4:
                        remainingCourses = _a.sent();
                        console.log("\uD83D\uDD0D [RegistrationService] Remaining courses in registration: ".concat((remainingCourses === null || remainingCourses === void 0 ? void 0 : remainingCourses.count) || 0));
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT lm.SoTienMotTC, mh.SoTiet, lm.SoTietMotTC\n                FROM MONHOC mh\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE mh.MaMonHoc = $1\n            ", [courseId])];
                    case 5:
                        courseInfo = _a.sent();
                        if (courseInfo) {
                            courseFee = courseInfo.SoTienMotTC * (courseInfo.SoTiet / courseInfo.SoTietMotTC || 1);
                            console.log("\uD83D\uDCB0 [RegistrationService] Course fee to refund: ".concat(courseFee, " for course ").concat(courseId));
                            // Nếu cần update SoTienConLai, uncomment dòng dưới:
                            // await DatabaseService.query(`UPDATE PHIEUDANGKY SET SoTienConLai = SoTienConLai + $1 WHERE MaPhieuDangKy = $2`, [courseFee, registrationId]);
                        } // Log hủy đăng ký
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT HoTen as \"studentName\" FROM SINHVIEN WHERE MaSoSinhVien = $1", [studentId])];
                    case 6:
                        student = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT TenMonHoc as \"courseName\" FROM MONHOC WHERE MaMonHoc = $1", [courseId])];
                    case 7:
                        course = _a.sent();
                        console.log("\uD83D\uDD0D [RegistrationService] Log data - Student:", student, "Course:", course);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO REGISTRATION_LOG (MaSoSinhVien, TenSinhVien, MaMonHoc, TenMonHoc, LoaiYeuCau)\n                 VALUES ($1, $2, $3, $4, 'cancel')", [studentId, (student === null || student === void 0 ? void 0 : student.studentName) || 'Unknown Student', courseId, (course === null || course === void 0 ? void 0 : course.courseName) || 'Unknown Course'])];
                    case 8:
                        _a.sent();
                        console.log("\u2705 [RegistrationService] Successfully cancelled registration for course ".concat(courseId, " (").concat((course === null || course === void 0 ? void 0 : course.courseName) || 'Unknown', ") for student ").concat(studentId));
                        return [2 /*return*/, true];
                    case 9:
                        error_7 = _a.sent();
                        console.error('Error canceling course registration:', error_7);
                        throw error_7;
                    case 10: return [2 /*return*/];
                }
            });
        });
    },
    // Lấy lịch sử đăng ký của sinh viên
    getRegistrationHistory: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var registrations, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    pd.MaPhieuDangKy as \"registrationId\",\n                    pd.NgayLap as \"registrationDate\",\n                    pd.MaSoSinhVien as \"studentId\",\n                    pd.MaHocKy as \"semesterId\",\n                    pd.SoTienConLai as \"remainingAmount\",\n                    pd.SoTinChiToiDa as \"maxCredits\"\n                FROM PHIEUDANGKY pd\n                WHERE pd.MaSoSinhVien = $1\n                ORDER BY pd.NgayLap DESC\n            ", [studentId])];
                    case 1:
                        registrations = _a.sent();
                        return [2 /*return*/, registrations];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error getting registration history:', error_8);
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    // Kiểm tra sinh viên đã đăng ký môn học chưa
    checkCourseRegistrationStatus: function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT ct.MaPhieuDangKy\n                FROM CT_PHIEUDANGKY ct\n                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy\n                WHERE pd.MaSoSinhVien = $1 AND ct.MaMonHoc = $2 AND pd.MaHocKy = $3\n            ", [studentId, courseId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        return [2 /*return*/, !!registration];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error checking course registration status:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, // Lấy danh sách môn học có thể đăng ký (DANHSACHMONHOCMO)
    getAvailableCourses: function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var availableCourses, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("                SELECT \n                    dsm.MaHocKy as \"semesterId\",\n                    dsm.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    mh.SoTiet as \"credits\",\n                    lm.TenLoaiMon as \"courseType\",\n                    lm.SoTienMotTC as \"feePerCredit\"\n                FROM DANHSACHMONHOCMO dsm\n                JOIN MONHOC mh ON dsm.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE dsm.MaHocKy = $1\n                ORDER BY mh.TenMonHoc\n            ", [semesterId])];
                    case 1:
                        availableCourses = _a.sent();
                        return [2 /*return*/, availableCourses];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error getting available courses:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, // Đăng ký nhiều môn học cùng lúc
    registerCourses: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, courseIds, semesterId, results, successCount, failCount, _i, courseIds_1, courseId, error_11, errorMessage, failedResult, result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        console.log('🔵 [RegistrationService] registerCourses called with:', data);
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
                        console.log("\uD83D\uDD35 [RegistrationService] Registering course ".concat(courseId, " for student ").concat(studentId));
                        return [4 /*yield*/, this.registerCourse(studentId, courseId, semesterId)];
                    case 3:
                        _a.sent();
                        results.push({ courseId: courseId, success: true, message: 'Đăng ký thành công' });
                        successCount++;
                        console.log("\u2705 [RegistrationService] Successfully registered course ".concat(courseId));
                        return [3 /*break*/, 5];
                    case 4:
                        error_11 = _a.sent();
                        console.error("\u274C [RegistrationService] Failed to register course ".concat(courseId, ":"), error_11);
                        errorMessage = error_11 instanceof Error ? error_11.message : 'Lỗi không xác định';
                        results.push({ courseId: courseId, success: false, message: errorMessage });
                        failCount++;
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        // Nếu chỉ đăng ký 1 môn và thất bại, trả về thông báo lỗi cụ thể
                        if (courseIds.length === 1 && failCount === 1) {
                            failedResult = results[0];
                            return [2 /*return*/, {
                                    success: false,
                                    message: failedResult.message,
                                    details: results
                                }];
                        }
                        result = {
                            success: successCount > 0,
                            message: failCount > 0 ?
                                "\u0110\u0103ng k\u00FD th\u00E0nh c\u00F4ng ".concat(successCount, "/").concat(courseIds.length, " m\u00F4n h\u1ECDc. ").concat(failCount, " m\u00F4n th\u1EA5t b\u1EA1i.") :
                                "\u0110\u0103ng k\u00FD th\u00E0nh c\u00F4ng ".concat(successCount, "/").concat(courseIds.length, " m\u00F4n h\u1ECDc"),
                            details: results
                        };
                        console.log('🔵 [RegistrationService] Final result:', result);
                        return [2 /*return*/, result];
                    case 7:
                        error_12 = _a.sent();
                        console.error('❌ [RegistrationService] Error registering multiple courses:', error_12);
                        throw error_12;
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
            var registration, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    pd.MaPhieuDangKy as \"registrationId\",\n                    pd.NgayLap as \"registrationDate\",                    pd.MaSoSinhVien as \"studentId\",\n                    pd.MaHocKy as \"semesterId\",\n                    pd.SoTienConLai as \"remainingAmount\",\n                    pd.SoTinChiToiDa as \"maxCredits\"\n                FROM PHIEUDANGKY pd\n                WHERE pd.MaSoSinhVien = $1 AND pd.MaHocKy = $2\n            ", [studentId, semesterId])];
                    case 1:
                        registration = _a.sent();
                        return [2 /*return*/, registration];
                    case 2:
                        error_13 = _a.sent();
                        console.error('Error getting registration info:', error_13);
                        throw error_13;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, // Lấy môn học theo chương trình học của sinh viên
    getRecommendedCourses: function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var actualStudentId, userMapping, totalCourses, student, availableCourses, coursesWithCategory, inProgramCount, notInProgramCount, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        console.log('🎯 [RegistrationService] Getting recommended courses for student:', studentId, 'semester:', semesterId);
                        actualStudentId = studentId;
                        if (!studentId.startsWith('U')) return [3 /*break*/, 2];
                        console.log('🔄 [RegistrationService] Converting User ID to Student ID...');
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                    SELECT \n                        n.userid,\n                        n.tendangnhap,\n                        n.masosinhvien as \"mappedStudentId\"\n                    FROM NGUOIDUNG n\n                    WHERE n.userid = $1 OR UPPER(n.tendangnhap) = UPPER($1)\n                ", [studentId])];
                    case 1:
                        userMapping = _a.sent();
                        console.log('🔍 [RegistrationService] User mapping result:', userMapping);
                        if (userMapping && userMapping.mappedStudentId) {
                            actualStudentId = userMapping.mappedStudentId;
                            console.log('✅ [RegistrationService] Converted to Student ID:', actualStudentId);
                        }
                        else {
                            console.log('❌ [RegistrationService] Could not find mapping for User ID:', studentId);
                            return [2 /*return*/, []];
                        }
                        _a.label = 2;
                    case 2:
                        console.log('🔍 [RegistrationService] Using Student ID:', actualStudentId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count FROM DANHSACHMONHOCMO WHERE MaHocKy = $1\n            ", [semesterId])];
                    case 3:
                        totalCourses = _a.sent();
                        console.log('📊 [RegistrationService] Total courses in DANHSACHMONHOCMO for semester:', totalCourses);
                        if (!totalCourses || totalCourses.count === 0) {
                            console.log('❌ [RegistrationService] No courses found in DANHSACHMONHOCMO for semester:', semesterId);
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT sv.MaNganh, nh.TenNganh\n                FROM SINHVIEN sv\n                JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh\n                WHERE sv.MaSoSinhVien = $1\n            ", [actualStudentId])];
                    case 4:
                        student = _a.sent();
                        if (!student) {
                            console.log('❌ [RegistrationService] Student not found with ID:', actualStudentId);
                            return [2 /*return*/, []];
                        }
                        console.log('👨‍🎓 [RegistrationService] Student major:', student); // Lấy tất cả môn học mở trong học kỳ và phân loại theo chương trình đào tạo
                        console.log('🔍 [RegistrationService] Getting all available courses with program classification...');
                        console.log('🔍 [RegistrationService] Query parameters:', [semesterId, student.manganh]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    dsmhm.MaHocKy as \"semesterId\",\n                    dsmhm.MaMonHoc as \"courseId\",\n                    mh.TenMonHoc as \"courseName\",\n                    mh.SoTiet as \"credits\",\n                    lm.SoTienMotTC as \"pricePerCredit\",\n                    lm.TenLoaiMon as \"courseType\",\n                    dsmhm.Thu as \"dayOfWeek\",\n                    dsmhm.TietBatDau as \"startPeriod\",\n                    dsmhm.TietKetThuc as \"endPeriod\",\n                    dsmhm.SiSoToiThieu as \"minStudents\",\n                    dsmhm.SiSoToiDa as \"maxStudents\",\n                    dsmhm.SoSVDaDangKy as \"currentEnrollment\",\n                    CASE \n                        WHEN EXISTS (\n                            SELECT 1 FROM CHUONGTRINHHOC cth \n                            WHERE cth.MaMonHoc = dsmhm.MaMonHoc \n                            AND cth.MaNganh = $2\n                            AND cth.MaHocKy = $1\n                        ) THEN 'inProgram'\n                        ELSE 'notInProgram'\n                    END as \"courseCategory\"\n                FROM DANHSACHMONHOCMO dsmhm\n                JOIN MONHOC mh ON dsmhm.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE dsmhm.MaHocKy = $1\n                ORDER BY \n                    CASE \n                        WHEN EXISTS (\n                            SELECT 1 FROM CHUONGTRINHHOC cth \n                            WHERE cth.MaMonHoc = dsmhm.MaMonHoc \n                            AND cth.MaNganh = $2\n                            AND cth.MaHocKy = $1\n                        ) THEN 0 \n                        ELSE 1 \n                    END,\n                    mh.TenMonHoc\n            ", [semesterId, student.manganh])];
                    case 5:
                        availableCourses = _a.sent();
                        console.log('📚 [RegistrationService] Found available courses:', availableCourses.length);
                        console.log('🔍 [RegistrationService] Sample courses with raw data:', availableCourses.slice(0, 5));
                        coursesWithCategory = availableCourses.map(function (course) { return (__assign(__assign({}, course), { fee: course.pricePerCredit ?
                                course.pricePerCredit * (course.credits / 15 || 1) : 0, isInProgram: course.courseCategory === 'inProgram', schedule: "Th\u1EE9 ".concat(course.dayOfWeek, ", ti\u1EBFt ").concat(course.startPeriod, "-").concat(course.endPeriod) })); });
                        console.log('✅ [RegistrationService] Processed courses with categories:', coursesWithCategory.length);
                        inProgramCount = coursesWithCategory.filter(function (c) { return c.isInProgram; }).length;
                        notInProgramCount = coursesWithCategory.filter(function (c) { return !c.isInProgram; }).length;
                        console.log("\uD83D\uDCCA [RegistrationService] InProgram: ".concat(inProgramCount, ", NotInProgram: ").concat(notInProgramCount));
                        return [2 /*return*/, coursesWithCategory];
                    case 6:
                        error_14 = _a.sent();
                        console.error('❌ [RegistrationService] Error getting recommended courses:', error_14);
                        throw error_14;
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
};
