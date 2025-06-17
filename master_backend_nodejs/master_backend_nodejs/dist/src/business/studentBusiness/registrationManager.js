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
exports.registrationManager = void 0;
// Registration Manager - Handles student course registration business logic
var registrationService_1 = require("../../services/studentService/registrationService");
var databaseService_1 = require("../../services/database/databaseService");
var RegistrationManager = /** @class */ (function () {
    function RegistrationManager() {
    }
    /**
     * Lấy danh sách môn học mở cho đăng ký
     */
    RegistrationManager.prototype.getAvailableCourses = function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var courses, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!semesterId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Mã học kỳ không được để trống'
                                }];
                        }
                        return [4 /*yield*/, registrationService_1.registrationService.getAvailableCourses(semesterId)];
                    case 1:
                        courses = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: "T\u00ECm th\u1EA5y ".concat(courses.length, " m\u00F4n h\u1ECDc c\u00F3 th\u1EC3 \u0111\u0103ng k\u00FD"),
                                data: courses
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in getAvailableCourses:', error_1);
                        return [2 /*return*/, {
                                success: false,
                                message: 'Không thể lấy danh sách môn học',
                                error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Lấy danh sách môn học đã đăng ký của sinh viên
     */
    RegistrationManager.prototype.getRegisteredCourses = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var courses, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!studentId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Mã sinh viên không được để trống'
                                }];
                        }
                        return [4 /*yield*/, registrationService_1.registrationService.getRegisteredCourses(studentId, semesterId || '')];
                    case 1:
                        courses = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: "Sinh vi\u00EAn \u0111\u00E3 \u0111\u0103ng k\u00FD ".concat(courses.length, " m\u00F4n h\u1ECDc"),
                                data: courses
                            }];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error in getRegisteredCourses:', error_2);
                        return [2 /*return*/, {
                                success: false,
                                message: 'Không thể lấy danh sách môn học đã đăng ký',
                                error: error_2 instanceof Error ? error_2.message : 'Unknown error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Đăng ký môn học cho sinh viên
     */
    RegistrationManager.prototype.registerCourses = function (studentId, courseIds, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var semester, student, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // Validate inputs
                        if (!studentId || !courseIds || courseIds.length === 0 || !semesterId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Thông tin đăng ký không đầy đủ'
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaHocKy, TrangThaiHocKy, ThoiHanDongHP\n                FROM HOCKYNAMHOC\n                WHERE MaHocKy = $1\n            ", [semesterId])];
                    case 1:
                        semester = _a.sent();
                        if (!semester) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Học kỳ không tồn tại'
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT MaSoSinhVien FROM SINHVIEN WHERE MaSoSinhVien = $1\n            ", [studentId])];
                    case 2:
                        student = _a.sent();
                        if (!student) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Sinh viên không tồn tại trong hệ thống'
                                }];
                        }
                        return [4 /*yield*/, registrationService_1.registrationService.registerCourses({
                                studentId: studentId,
                                courseIds: courseIds,
                                semesterId: semesterId
                            })];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, {
                                success: result.success,
                                message: result.message,
                                data: result.details
                            }];
                    case 4:
                        error_3 = _a.sent();
                        console.error('Error in registerCourses:', error_3);
                        return [2 /*return*/, {
                                success: false,
                                message: 'Lỗi trong quá trình đăng ký môn học',
                                error: error_3 instanceof Error ? error_3.message : 'Unknown error'
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Hủy đăng ký môn học
     */
    RegistrationManager.prototype.unregisterCourse = function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var success, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!studentId || !courseId || !semesterId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Thông tin hủy đăng ký không đầy đủ'
                                }];
                        }
                        return [4 /*yield*/, registrationService_1.registrationService.unregisterCourse(studentId, courseId, semesterId)];
                    case 1:
                        success = _a.sent();
                        if (success) {
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Hủy đăng ký môn học thành công'
                                }];
                        }
                        else {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Không thể hủy đăng ký môn học'
                                }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error in unregisterCourse:', error_4);
                        return [2 /*return*/, {
                                success: false,
                                message: 'Lỗi trong quá trình hủy đăng ký',
                                error: error_4 instanceof Error ? error_4.message : 'Unknown error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Lấy thông tin tổng quan đăng ký của sinh viên
     */
    RegistrationManager.prototype.getRegistrationSummary = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var registration, courses, summary, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!studentId || !semesterId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Mã sinh viên và học kỳ không được để trống'
                                }];
                        }
                        return [4 /*yield*/, registrationService_1.registrationService.getRegistrationInfo(studentId, semesterId)];
                    case 1:
                        registration = _a.sent();
                        return [4 /*yield*/, registrationService_1.registrationService.getRegisteredCourses(studentId, semesterId)];
                    case 2:
                        courses = _a.sent();
                        summary = {
                            registration: registration,
                            courses: courses, statistics: {
                                totalCourses: courses.length,
                                totalCredits: courses.reduce(function (sum, course) { return sum + (course.credits || 0); }, 0),
                                totalFee: courses.reduce(function (sum, course) { return sum + (course.fee || 0); }, 0)
                            }
                        };
                        return [2 /*return*/, {
                                success: true,
                                message: 'Lấy thông tin đăng ký thành công',
                                data: summary
                            }];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error in getRegistrationSummary:', error_5);
                        return [2 /*return*/, {
                                success: false,
                                message: 'Không thể lấy thông tin tổng quan đăng ký',
                                error: error_5 instanceof Error ? error_5.message : 'Unknown error'
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Alias methods for compatibility with controller
     */
    RegistrationManager.prototype.getAvailableSubjects = function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAvailableCourses(semesterId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RegistrationManager.prototype.searchSubjects = function (query, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var courses, filteredCourses, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, registrationService_1.registrationService.getAvailableCourses(semesterId)];
                    case 1:
                        courses = _a.sent();
                        filteredCourses = courses.filter(function (course) {
                            return (course.courseName && course.courseName.toLowerCase().includes(query.toLowerCase())) ||
                                (course.courseId && course.courseId.toLowerCase().includes(query.toLowerCase()));
                        });
                        return [2 /*return*/, {
                                success: true,
                                message: "T\u00ECm th\u1EA5y ".concat(filteredCourses.length, " m\u00F4n h\u1ECDc ph\u00F9 h\u1EE3p"),
                                data: filteredCourses
                            }];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error in searchSubjects:', error_6);
                        return [2 /*return*/, {
                                success: false,
                                message: 'Không thể tìm kiếm môn học',
                                error: error_6 instanceof Error ? error_6.message : 'Unknown error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RegistrationManager.prototype.registerSubject = function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.registerCourses(studentId, [courseId], semesterId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RegistrationManager.prototype.getEnrolledCourses = function (studentId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRegisteredCourses(studentId, semesterId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RegistrationManager.prototype.cancelRegistration = function (studentId, courseId, semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var semester;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        semester = semesterId || 'HK1_2024';
                        return [4 /*yield*/, this.unregisterCourse(studentId, courseId, semester)];
                    case 1: // Default semester if not provided
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return RegistrationManager;
}());
exports.registrationManager = new RegistrationManager();
exports.default = exports.registrationManager;
