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
var openCourse_business_1 = require("../business/academicBusiness/openCourse.business");
var openCourse_service_1 = require("../services/courseService/openCourse.service");
var validation_error_1 = require("../utils/errors/validation.error");
var database_error_1 = require("../utils/errors/database.error");
// Mock the OpenCourseService
jest.mock('../services/courseService/openCourse.service');
describe('OpenCourseBusiness', function () {
    var mockCourses = [
        {
            id: 1,
            subjectId: 'CS101',
            subjectName: 'Introduction to Programming',
            semesterId: '2024-1',
            subjectTypeId: 'CORE',
            totalHours: 45,
            maxStudents: 50,
            currentStudents: 30,
            lecturer: 'Dr. Smith',
            schedule: {
                day: 'Monday',
                session: '1-3',
                room: 'Room 101'
            },
            status: 'open',
            startDate: '2024-09-01',
            endDate: '2024-12-15',
            registrationStartDate: '2024-08-01',
            registrationEndDate: '2024-08-31',
            prerequisites: ['CS100'],
            description: 'Basic programming concepts',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            subjectId: 'CS102',
            subjectName: 'Data Structures',
            semesterId: '2024-1',
            subjectTypeId: 'CORE',
            totalHours: 45,
            maxStudents: 40,
            currentStudents: 40,
            lecturer: 'Dr. Johnson',
            schedule: {
                day: 'Tuesday',
                session: '4-6',
                room: 'Room 102'
            },
            status: 'closed',
            startDate: '2024-09-01',
            endDate: '2024-12-15',
            registrationStartDate: '2024-08-01',
            registrationEndDate: '2024-08-31',
            prerequisites: ['CS101'],
            description: 'Advanced data structures',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('getAllCourses', function () {
        it('should return all courses', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getAllCourses.mockResolvedValue(mockCourses);
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.getAllCourses()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCourses);
                        expect(openCourse_service_1.OpenCourseService.getAllCourses).toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database errors', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getAllCourses.mockRejectedValue(new database_error_1.DatabaseError('Database error'));
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.getAllCourses()).rejects.toThrow(database_error_1.DatabaseError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getCourseById', function () {
        it('should return a course by id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(mockCourses[0]);
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.getCourseById(1)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCourses[0]);
                        expect(openCourse_service_1.OpenCourseService.getCourseById).toHaveBeenCalledWith(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null for non-existent course', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(null);
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.getCourseById(999)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('createCourse', function () {
        var newCourse = {
            subjectId: 'CS103',
            subjectName: 'Algorithms',
            semesterId: '2024-2',
            subjectTypeId: 'CORE',
            totalHours: 45,
            maxStudents: 45,
            currentStudents: 0,
            lecturer: 'Dr. Brown',
            schedule: {
                day: 'Monday',
                session: '4-6',
                room: 'Room 103'
            },
            status: 'open',
            startDate: '2025-01-15',
            endDate: '2025-05-01',
            registrationStartDate: '2024-12-01',
            registrationEndDate: '2025-01-10',
            prerequisites: ['CS101', 'CS102'],
            description: 'Advanced algorithms'
        };
        it('should create a new course', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.createCourse.mockResolvedValue(__assign(__assign({}, newCourse), { id: 3, createdAt: new Date(), updatedAt: new Date() }));
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.createCourse(newCourse)];
                    case 1:
                        result = _a.sent();
                        expect(result).toMatchObject(newCourse);
                        expect(openCourse_service_1.OpenCourseService.createCourse).toHaveBeenCalledWith(newCourse);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidCourse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidCourse = __assign(__assign({}, newCourse), { subjectId: '' });
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.createCourse(invalidCourse)).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate dates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidDates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidDates = __assign(__assign({}, newCourse), { startDate: '2025-05-01', endDate: '2025-01-15' });
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.createCourse(invalidDates)).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateCourse', function () {
        var updateData = {
            maxStudents: 60,
            description: 'Updated description'
        };
        it('should update an existing course', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(mockCourses[0]);
                        openCourse_service_1.OpenCourseService.updateCourse.mockResolvedValue(__assign(__assign({}, mockCourses[0]), updateData));
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.updateCourse(1, updateData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toMatchObject(updateData);
                        expect(openCourse_service_1.OpenCourseService.updateCourse).toHaveBeenCalledWith(1, updateData);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent course', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(null);
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.updateCourse(999, updateData)).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('deleteCourse', function () {
        it('should delete a course with no registered students', function () { return __awaiter(void 0, void 0, void 0, function () {
            var emptyCourse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        emptyCourse = __assign(__assign({}, mockCourses[0]), { currentStudents: 0 });
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(emptyCourse);
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.deleteCourse(1)];
                    case 1:
                        _a.sent();
                        expect(openCourse_service_1.OpenCourseService.deleteCourse).toHaveBeenCalledWith(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not delete course with registered students', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(mockCourses[1]);
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.deleteCourse(2)).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent course', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(null);
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.deleteCourse(999)).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getCoursesByStatus', function () {
        it('should return courses by status', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getCoursesByStatus.mockResolvedValue([mockCourses[0]]);
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.getCoursesByStatus('open')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual([mockCourses[0]]);
                        expect(openCourse_service_1.OpenCourseService.getCoursesByStatus).toHaveBeenCalledWith('open');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getCoursesBySemester', function () {
        it('should return courses by semester', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        openCourse_service_1.OpenCourseService.getCoursesBySemester.mockResolvedValue(mockCourses);
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.getCoursesBySemester('2024-1', '2024')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockCourses);
                        expect(openCourse_service_1.OpenCourseService.getCoursesBySemester).toHaveBeenCalledWith('2024-1', '2024');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate required parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.getCoursesBySemester('', '2024')).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.getCoursesBySemester('2024-1', '')).rejects.toThrow(validation_error_1.ValidationError)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateCourseStatus', function () {
        it('should update course status from open to closed when course has students', function () { return __awaiter(void 0, void 0, void 0, function () {
            var courseWithStudents, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        courseWithStudents = __assign(__assign({}, mockCourses[0]), { currentStudents: 30 });
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(courseWithStudents);
                        openCourse_service_1.OpenCourseService.updateCourseStatus.mockResolvedValue(__assign(__assign({}, courseWithStudents), { status: 'closed' }));
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.updateCourseStatus(1, 'closed')];
                    case 1:
                        result = _a.sent();
                        expect(result.status).toBe('closed');
                        expect(openCourse_service_1.OpenCourseService.updateCourseStatus).toHaveBeenCalledWith(1, 'closed');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update cancelled course', function () { return __awaiter(void 0, void 0, void 0, function () {
            var cancelledCourse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cancelledCourse = __assign(__assign({}, mockCourses[0]), { status: 'cancelled' });
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(cancelledCourse);
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.updateCourseStatus(1, 'open')).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not close empty course', function () { return __awaiter(void 0, void 0, void 0, function () {
            var emptyCourse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        emptyCourse = __assign(__assign({}, mockCourses[0]), { currentStudents: 0 });
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(emptyCourse);
                        return [4 /*yield*/, expect(openCourse_business_1.OpenCourseBusiness.updateCourseStatus(1, 'closed')).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow cancelling course regardless of student count', function () { return __awaiter(void 0, void 0, void 0, function () {
            var courseWithStudents, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        courseWithStudents = __assign(__assign({}, mockCourses[0]), { currentStudents: 30 });
                        openCourse_service_1.OpenCourseService.getCourseById.mockResolvedValue(courseWithStudents);
                        openCourse_service_1.OpenCourseService.updateCourseStatus.mockResolvedValue(__assign(__assign({}, courseWithStudents), { status: 'cancelled' }));
                        return [4 /*yield*/, openCourse_business_1.OpenCourseBusiness.updateCourseStatus(1, 'cancelled')];
                    case 1:
                        result = _a.sent();
                        expect(result.status).toBe('cancelled');
                        expect(openCourse_service_1.OpenCourseService.updateCourseStatus).toHaveBeenCalledWith(1, 'cancelled');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
