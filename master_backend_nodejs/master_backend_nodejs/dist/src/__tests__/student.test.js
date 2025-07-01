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
var registrationService_1 = require("../services/studentService/registrationService");
var registrationManager_1 = require("../business/studentBusiness/registrationManager");
var databaseService_1 = require("../services/database/databaseService");
// Mock DatabaseService
jest.mock('../services/database/databaseService', function () { return ({
    DatabaseService: {
        query: jest.fn(),
        queryOne: jest.fn(),
    }
}); });
var mockDatabaseService = databaseService_1.DatabaseService;
describe('Student Course Registration System', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('RegistrationService', function () {
        var mockStudentId = 'SV001';
        var mockSemesterId = 'HK001';
        var mockCourseId = 'MH001';
        describe('getAvailableCourses', function () {
            it('should return available courses for a semester', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockCourses, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockCourses = [
                                {
                                    courseId: 'MH001',
                                    courseName: 'Lập trình Web',
                                    credits: 3,
                                    courseType: 'Bắt buộc',
                                    fee: 1500000,
                                    semesterId: 'HK001',
                                    minStudents: 10,
                                    maxStudents: 40,
                                    currentStudents: 25,
                                    status: 'OPEN',
                                    prerequisiteCourses: [],
                                    schedules: [],
                                    dayOfWeek: 2,
                                    startPeriod: 1,
                                    endPeriod: 3
                                }
                            ];
                            mockDatabaseService.query.mockResolvedValueOnce(mockCourses);
                            return [4 /*yield*/, registrationService_1.registrationService.getAvailableCourses(mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockCourses);
                            expect(mockDatabaseService.query).toHaveBeenCalledWith(expect.stringContaining('DANHSACHMONHOCMO'), [mockSemesterId]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should handle database errors', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockDatabaseService.query.mockRejectedValueOnce(new Error('Database connection failed'));
                            return [4 /*yield*/, expect(registrationService_1.registrationService.getAvailableCourses(mockSemesterId))
                                    .rejects.toThrow('Database connection failed')];
                        case 1:
                            _a.sent();
                            expect(mockDatabaseService.query).toHaveBeenCalledWith(expect.stringContaining('DANHSACHMONHOCMO'), [mockSemesterId]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('getRegisteredCourses', function () {
            it('should return registered courses for a student', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockRegisteredCourses, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockRegisteredCourses = [
                                {
                                    registrationId: 'PDK_SV001_HK001',
                                    courseId: 'MH001',
                                    courseName: 'Lập trình Web',
                                    credits: 3,
                                    courseType: 'Bắt buộc',
                                    fee: 1500000
                                }
                            ];
                            mockDatabaseService.query.mockResolvedValueOnce(mockRegisteredCourses);
                            return [4 /*yield*/, registrationService_1.registrationService.getRegisteredCourses(mockStudentId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockRegisteredCourses);
                            expect(mockDatabaseService.query).toHaveBeenCalledWith(expect.stringContaining('CT_PHIEUDANGKY'), [mockStudentId, mockSemesterId]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('registerCourse', function () {
            it('should successfully register a course for new registration', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Mock offered course exists
                            mockDatabaseService.queryOne
                                .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: mockCourseId }) // offered course check
                                .mockResolvedValueOnce(null) // no existing registration
                                .mockResolvedValueOnce(null) // no existing course registration
                                .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 }) // course info
                                .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' }) // student info
                                .mockResolvedValueOnce({ MaMonHoc: mockCourseId, TenMonHoc: 'Lập trình Web' }); // course info
                            mockDatabaseService.query
                                .mockResolvedValueOnce([]) // insert registration
                                .mockResolvedValueOnce([]) // insert registration detail
                                .mockResolvedValueOnce([]) // update registration amount
                                .mockResolvedValueOnce([]); // insert activity log
                            return [4 /*yield*/, registrationService_1.registrationService.registerCourse(mockStudentId, mockCourseId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result).toBe(true);
                            expect(mockDatabaseService.query).toHaveBeenCalledTimes(4);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should successfully register a course for existing registration', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Mock offered course exists and existing registration exists
                            mockDatabaseService.queryOne
                                .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: mockCourseId }) // offered course check
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing registration
                                .mockResolvedValueOnce(null) // no existing course registration
                                .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 }) // course info
                                .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' }) // student info
                                .mockResolvedValueOnce({ MaMonHoc: mockCourseId, TenMonHoc: 'Lập trình Web' }); // course info
                            mockDatabaseService.query
                                .mockResolvedValueOnce([]) // insert registration detail
                                .mockResolvedValueOnce([]) // update registration amount
                                .mockResolvedValueOnce([]); // insert activity log
                            return [4 /*yield*/, registrationService_1.registrationService.registerCourse(mockStudentId, mockCourseId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result).toBe(true);
                            expect(mockDatabaseService.query).toHaveBeenCalledTimes(3);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw error if course is not offered', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockDatabaseService.queryOne.mockResolvedValueOnce(null); // no offered course
                            return [4 /*yield*/, expect(registrationService_1.registrationService.registerCourse(mockStudentId, mockCourseId, mockSemesterId))
                                    .rejects.toThrow('Môn học này không có trong danh sách mở')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw error if course is already registered', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockDatabaseService.queryOne
                                .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: mockCourseId }) // offered course check
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing registration
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }); // existing course registration
                            return [4 /*yield*/, expect(registrationService_1.registrationService.registerCourse(mockStudentId, mockCourseId, mockSemesterId))
                                    .rejects.toThrow('Sinh viên đã đăng ký môn học này rồi')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('cancelCourseRegistration', function () {
            it('should successfully cancel course registration', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockDatabaseService.queryOne
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing registration
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing course registration
                                .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 }) // course info
                                .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' }) // student info
                                .mockResolvedValueOnce({ MaMonHoc: mockCourseId, TenMonHoc: 'Lập trình Web' }); // course info
                            mockDatabaseService.query
                                .mockResolvedValueOnce([]) // delete registration detail
                                .mockResolvedValueOnce([]) // update registration amount
                                .mockResolvedValueOnce([]); // insert activity log
                            return [4 /*yield*/, registrationService_1.registrationService.cancelCourseRegistration(mockStudentId, mockCourseId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result).toBe(true);
                            expect(mockDatabaseService.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM CT_PHIEUDANGKY'), ['PDK_SV001_HK001', mockCourseId]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw error if registration not found', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockDatabaseService.queryOne.mockResolvedValueOnce(null); // no registration
                            return [4 /*yield*/, expect(registrationService_1.registrationService.cancelCourseRegistration(mockStudentId, mockCourseId, mockSemesterId))
                                    .rejects.toThrow('Không tìm thấy phiếu đăng ký')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should throw error if course not registered', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockDatabaseService.queryOne
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing registration
                                .mockResolvedValueOnce(null); // no course registration
                            return [4 /*yield*/, expect(registrationService_1.registrationService.cancelCourseRegistration(mockStudentId, mockCourseId, mockSemesterId))
                                    .rejects.toThrow('Sinh viên chưa đăng ký môn học này')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('registerCourses (batch)', function () {
            it('should register multiple courses successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
                var courseIds, requestData, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            courseIds = ['MH001', 'MH002'];
                            requestData = { studentId: mockStudentId, courseIds: courseIds, semesterId: mockSemesterId };
                            // Mock for first course
                            mockDatabaseService.queryOne
                                .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: 'MH001' })
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' })
                                .mockResolvedValueOnce(null)
                                .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 })
                                .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' })
                                .mockResolvedValueOnce({ MaMonHoc: 'MH001', TenMonHoc: 'Course 1' })
                                // Mock for second course
                                .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: 'MH002' })
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' })
                                .mockResolvedValueOnce(null)
                                .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 })
                                .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' })
                                .mockResolvedValueOnce({ MaMonHoc: 'MH002', TenMonHoc: 'Course 2' });
                            mockDatabaseService.query.mockResolvedValue([]);
                            return [4 /*yield*/, registrationService_1.registrationService.registerCourses(requestData)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.details).toHaveLength(2);
                            expect(result.details[0].success).toBe(true);
                            expect(result.details[1].success).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should handle partial success', function () { return __awaiter(void 0, void 0, void 0, function () {
                var courseIds, requestData, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            courseIds = ['MH001', 'MH002'];
                            requestData = { studentId: mockStudentId, courseIds: courseIds, semesterId: mockSemesterId };
                            // Mock for first course (success)
                            mockDatabaseService.queryOne
                                .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: 'MH001' })
                                .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' })
                                .mockResolvedValueOnce(null)
                                .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 })
                                .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' })
                                .mockResolvedValueOnce({ MaMonHoc: 'MH001', TenMonHoc: 'Course 1' })
                                // Mock for second course (failure)
                                .mockResolvedValueOnce(null); // no offered course
                            mockDatabaseService.query.mockResolvedValue([]);
                            return [4 /*yield*/, registrationService_1.registrationService.registerCourses(requestData)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true); // Still success because at least one course registered
                            expect(result.details).toHaveLength(2);
                            expect(result.details[0].success).toBe(true);
                            expect(result.details[1].success).toBe(false);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('getRegistrationInfo', function () {
            it('should return registration information', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockRegistration, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockRegistration = {
                                registrationId: 'PDK_SV001_HK001',
                                registrationDate: new Date('2025-06-17T02:00:31.807Z'),
                                studentId: 'SV001',
                                semesterId: 'HK001',
                                maxCredits: 24,
                                registrationAmount: 1500000,
                                requiredAmount: 1500000,
                                paidAmount: 0,
                                remainingAmount: 1500000
                            };
                            mockDatabaseService.queryOne.mockResolvedValueOnce(mockRegistration);
                            return [4 /*yield*/, registrationService_1.registrationService.getRegistrationInfo(mockStudentId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result).toEqual(mockRegistration);
                            expect(mockDatabaseService.queryOne).toHaveBeenCalledWith(expect.stringContaining('PHIEUDANGKY'), [mockStudentId, mockSemesterId]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('RegistrationManager', function () {
        var mockStudentId = 'SV001';
        var mockSemesterId = 'HK001';
        var mockCourseId = 'MH001';
        describe('getAvailableCourses', function () {
            it('should return success response with available courses', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockCourses, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockCourses = [{ courseId: 'MH001', courseName: 'Test Course' }];
                            mockDatabaseService.query.mockResolvedValueOnce(mockCourses);
                            return [4 /*yield*/, registrationManager_1.registrationManager.getAvailableCourses(mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.data).toEqual(mockCourses);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error response for empty semester ID', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, registrationManager_1.registrationManager.getAvailableCourses('')];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(false);
                            expect(result.message).toBe('Mã học kỳ không được để trống');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should handle service errors', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockDatabaseService.query.mockRejectedValueOnce(new Error('Database error'));
                            return [4 /*yield*/, registrationManager_1.registrationManager.getAvailableCourses(mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(false);
                            expect(result.message).toBe('Không thể lấy danh sách môn học');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('getRegisteredCourses', function () {
            it('should return success response with registered courses', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockCourses, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockCourses = [{ courseId: 'MH001', courseName: 'Test Course' }];
                            mockDatabaseService.query.mockResolvedValueOnce(mockCourses);
                            return [4 /*yield*/, registrationManager_1.registrationManager.getRegisteredCourses(mockStudentId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.data).toEqual(mockCourses);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error response for empty student ID', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, registrationManager_1.registrationManager.getRegisteredCourses('', mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(false);
                            expect(result.message).toBe('Mã sinh viên không được để trống');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('registerCourses', function () {
            beforeEach(function () {
                // Mock successful semester and student existence check
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaHocKy: mockSemesterId, TrangThaiHocKy: 'ACTIVE' }) // semester check
                    .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId }); // student check
            });
            it('should return success response for successful registration', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockResult, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockResult = { success: true, message: 'Đăng ký thành công 1/1 môn học', details: [{ courseId: mockCourseId, success: true, message: 'Đăng ký thành công' }] };
                            jest.spyOn(registrationService_1.registrationService, 'registerCourses').mockResolvedValueOnce(mockResult);
                            return [4 /*yield*/, registrationManager_1.registrationManager.registerCourses(mockStudentId, [mockCourseId], mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.data).toEqual(mockResult.details);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error response for registration failure', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Mock semester not found
                            mockDatabaseService.queryOne.mockReset().mockResolvedValueOnce(null);
                            return [4 /*yield*/, registrationManager_1.registrationManager.registerCourses(mockStudentId, [mockCourseId], mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(false);
                            expect(result.message).toBe('Học kỳ không tồn tại');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should validate required parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, registrationManager_1.registrationManager.registerCourses('', [mockCourseId], mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(false);
                            expect(result.message).toBe('Thông tin đăng ký không đầy đủ');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('unregisterCourse', function () {
            beforeEach(function () {
                // Mock successful student existence check
                mockDatabaseService.queryOne.mockResolvedValueOnce({ MaSoSinhVien: mockStudentId });
            });
            it('should return success response for successful cancellation', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(registrationService_1.registrationService, 'cancelCourseRegistration').mockResolvedValueOnce(true);
                            return [4 /*yield*/, registrationManager_1.registrationManager.unregisterCourse(mockStudentId, mockCourseId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.message).toBe('Hủy đăng ký môn học thành công');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return error response for cancellation failure', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(registrationService_1.registrationService, 'cancelCourseRegistration').mockRejectedValueOnce(new Error('Registration not found'));
                            return [4 /*yield*/, registrationManager_1.registrationManager.unregisterCourse(mockStudentId, mockCourseId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(false);
                            expect(result.message).toBe('Lỗi trong quá trình hủy đăng ký');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('getRegistrationSummary', function () {
            it('should return registration summary', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockRegistration, mockCourses, expectedSummary, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockRegistration = {
                                registrationId: 'PDK_SV001_HK001',
                                registrationDate: new Date(),
                                studentId: mockStudentId,
                                semesterId: mockSemesterId,
                                registrationAmount: 1500000,
                                requiredAmount: 1500000,
                                paidAmount: 0,
                                remainingAmount: 1500000,
                                maxCredits: 24
                            };
                            mockCourses = [
                                {
                                    registrationId: 'PDK_SV001_HK001',
                                    courseId: 'MH001',
                                    courseName: 'Test Course',
                                    credits: 3,
                                    courseType: 'Bắt buộc',
                                    fee: 1500000
                                }
                            ];
                            expectedSummary = {
                                registration: mockRegistration,
                                courses: mockCourses,
                                statistics: {
                                    totalCourses: 1,
                                    totalCredits: 3,
                                    totalFee: 1500000
                                }
                            };
                            jest.spyOn(registrationService_1.registrationService, 'getRegistrationInfo').mockResolvedValueOnce(mockRegistration);
                            jest.spyOn(registrationService_1.registrationService, 'getRegisteredCourses').mockResolvedValueOnce(mockCourses);
                            return [4 /*yield*/, registrationManager_1.registrationManager.getRegistrationSummary(mockStudentId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.data).toEqual(expectedSummary);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('Compatibility aliases', function () {
            beforeEach(function () {
                // Mock successful student existence check
                mockDatabaseService.queryOne.mockResolvedValueOnce({ MaSoSinhVien: mockStudentId });
            });
            it('should support getAvailableSubjects alias', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockCourses, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockCourses = [{ courseId: 'MH001', courseName: 'Test Course' }];
                            mockDatabaseService.query.mockResolvedValueOnce(mockCourses);
                            return [4 /*yield*/, registrationManager_1.registrationManager.getAvailableSubjects(mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.data).toEqual(mockCourses);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should support registerSubject alias', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockResult, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockResult = { success: true, message: 'Đăng ký thành công 1/1 môn học', details: [{ courseId: mockCourseId, success: true, message: 'Đăng ký thành công' }] };
                            jest.spyOn(registrationService_1.registrationService, 'registerCourses').mockResolvedValueOnce(mockResult);
                            return [4 /*yield*/, registrationManager_1.registrationManager.registerSubject(mockStudentId, mockCourseId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should support getEnrolledCourses alias', function () { return __awaiter(void 0, void 0, void 0, function () {
                var mockCourses, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            mockCourses = [{ courseId: 'MH001', courseName: 'Test Course' }];
                            mockDatabaseService.query.mockResolvedValueOnce(mockCourses);
                            return [4 /*yield*/, registrationManager_1.registrationManager.getEnrolledCourses(mockStudentId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.data).toEqual(mockCourses);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should support cancelRegistration alias', function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jest.spyOn(registrationService_1.registrationService, 'cancelCourseRegistration').mockResolvedValueOnce(true);
                            return [4 /*yield*/, registrationManager_1.registrationManager.cancelRegistration(mockStudentId, mockCourseId, mockSemesterId)];
                        case 1:
                            result = _a.sent();
                            expect(result.success).toBe(true);
                            expect(result.message).toBe('Hủy đăng ký môn học thành công');
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
