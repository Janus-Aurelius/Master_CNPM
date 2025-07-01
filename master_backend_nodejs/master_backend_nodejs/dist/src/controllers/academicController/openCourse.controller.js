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
exports.OpenCourseController = void 0;
var openCourse_service_1 = require("../../services/courseService/openCourse.service");
var database_error_1 = require("../../utils/errors/database.error");
var validation_error_1 = require("../../utils/errors/validation.error");
var OpenCourseController = /** @class */ (function () {
    function OpenCourseController() {
    }
    OpenCourseController.getAllCourses = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var courses, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log('Getting all open courses...');
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.getAllCourses()];
                    case 1:
                        courses = _a.sent();
                        console.log("Found ".concat(courses.length, " open courses"));
                        res.json(courses);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in getAllCourses:', error_1);
                        if (error_1 instanceof database_error_1.DatabaseError) {
                            res.status(500).json({ success: false, message: error_1.message });
                        }
                        else {
                            res.status(500).json({ success: false, message: 'Internal server error' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseController.getCourseById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semesterId, courseId, course, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, semesterId = _a.semesterId, courseId = _a.courseId;
                        if (!semesterId || !courseId) {
                            res.status(400).json({ error: 'Missing semesterId or courseId' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.getCourseById(semesterId, courseId)];
                    case 1:
                        course = _b.sent();
                        if (!course) {
                            res.status(404).json({ error: 'Course not found' });
                            return [2 /*return*/];
                        }
                        res.json(course);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error in getCourseById:', error_2);
                        if (error_2 instanceof database_error_1.DatabaseError) {
                            res.status(500).json({ error: error_2.message });
                        }
                        else {
                            res.status(500).json({ error: 'Internal server error' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseController.createCourse = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var courseData, course, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        courseData = req.body;
                        console.log('Creating course with data:', courseData);
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.createCourse(courseData)];
                    case 1:
                        course = _b.sent();
                        res.status(201).json({ success: true, data: course });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Error in createCourse:', error_3);
                        console.error('Error type:', typeof error_3);
                        console.error('Error constructor name:', (_a = error_3 === null || error_3 === void 0 ? void 0 : error_3.constructor) === null || _a === void 0 ? void 0 : _a.name);
                        console.error('Error message:', error_3 === null || error_3 === void 0 ? void 0 : error_3.message);
                        if (error_3 instanceof validation_error_1.ValidationError) {
                            res.status(400).json({ success: false, message: error_3.message });
                        }
                        else if (error_3 instanceof database_error_1.DatabaseError) {
                            res.status(500).json({ success: false, message: error_3.message });
                        }
                        else if (error_3 instanceof Error) {
                            // Handle database constraint errors
                            if (error_3.message.includes('duplicate key value violates unique constraint')) {
                                res.status(400).json({ success: false, message: 'Môn học này đã được mở trong học kỳ này' });
                            }
                            else if (error_3.message.includes('violates foreign key constraint')) {
                                if (error_3.message.includes('mamonhoc')) {
                                    res.status(400).json({ success: false, message: 'Mã môn học không tồn tại trong hệ thống' });
                                }
                                else if (error_3.message.includes('mahocky')) {
                                    res.status(400).json({ success: false, message: 'Mã học kỳ không tồn tại trong hệ thống' });
                                }
                                else {
                                    res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
                                }
                            }
                            else {
                                res.status(400).json({ success: false, message: error_3.message });
                            }
                        }
                        else {
                            res.status(500).json({ success: false, message: 'Internal server error' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseController.updateCourse = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semesterId, courseId, courseData, course, error_4;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.params, semesterId = _a.semesterId, courseId = _a.courseId;
                        courseData = req.body;
                        console.log('Updating course with data:', courseData);
                        if (!semesterId || !courseId) {
                            res.status(400).json({ success: false, message: 'Thiếu mã học kỳ hoặc mã môn học' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.updateCourse(semesterId, courseId, courseData)];
                    case 1:
                        course = _c.sent();
                        res.json({ success: true, data: course });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _c.sent();
                        console.error('Error in updateCourse:', error_4);
                        console.error('Error type:', typeof error_4);
                        console.error('Error constructor name:', (_b = error_4 === null || error_4 === void 0 ? void 0 : error_4.constructor) === null || _b === void 0 ? void 0 : _b.name);
                        console.error('Error message:', error_4 === null || error_4 === void 0 ? void 0 : error_4.message);
                        if (error_4 instanceof validation_error_1.ValidationError) {
                            res.status(400).json({ success: false, message: error_4.message });
                        }
                        else if (error_4 instanceof database_error_1.DatabaseError) {
                            res.status(500).json({ success: false, message: error_4.message });
                        }
                        else if (error_4 instanceof Error) {
                            res.status(400).json({ success: false, message: error_4.message });
                        }
                        else {
                            res.status(500).json({ success: false, message: 'Internal server error' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseController.deleteCourse = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semesterId, courseId, error_5;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.params, semesterId = _a.semesterId, courseId = _a.courseId;
                        if (!semesterId || !courseId) {
                            res.status(400).json({ success: false, message: 'Thiếu mã học kỳ hoặc mã môn học' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.deleteCourse(semesterId, courseId)];
                    case 1:
                        _c.sent();
                        res.status(200).json({ success: true, message: 'Xóa môn học thành công' });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _c.sent();
                        console.error('Error in deleteCourse:', error_5);
                        console.error('Error type:', typeof error_5);
                        console.error('Error constructor name:', (_b = error_5 === null || error_5 === void 0 ? void 0 : error_5.constructor) === null || _b === void 0 ? void 0 : _b.name);
                        console.error('Error message:', error_5 === null || error_5 === void 0 ? void 0 : error_5.message);
                        if (error_5 instanceof validation_error_1.ValidationError) {
                            res.status(400).json({ success: false, message: error_5.message });
                        }
                        else if (error_5 instanceof database_error_1.DatabaseError) {
                            res.status(500).json({ success: false, message: error_5.message });
                        }
                        else if (error_5 instanceof Error) {
                            if (error_5.message.includes('violates foreign key constraint')) {
                                res.status(400).json({ success: false, message: 'Không thể xóa môn học này vì đã có sinh viên đăng ký' });
                            }
                            else {
                                res.status(400).json({ success: false, message: error_5.message });
                            }
                        }
                        else {
                            res.status(500).json({ success: false, message: 'Internal server error' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseController.getCoursesBySemester = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semester, academicYear, courses, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, semester = _a.semester, academicYear = _a.academicYear;
                        if (!semester || !academicYear) {
                            res.status(400).json({ error: 'Missing semester or academicYear' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.getCoursesBySemester(semester, academicYear)];
                    case 1:
                        courses = _b.sent();
                        res.json(courses);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        console.error('Error in getCoursesBySemester:', error_6);
                        if (error_6 instanceof database_error_1.DatabaseError) {
                            res.status(500).json({ error: error_6.message });
                        }
                        else {
                            res.status(500).json({ error: 'Internal server error' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseController.updateCourseStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, semesterId, courseId, status_1, course, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, semesterId = _a.semesterId, courseId = _a.courseId;
                        status_1 = req.body.status;
                        if (!semesterId || !courseId) {
                            res.status(400).json({ error: 'Missing semesterId or courseId' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.getCourseById(semesterId, courseId)];
                    case 1:
                        course = _b.sent();
                        if (!course) {
                            res.status(404).json({ error: 'Course not found' });
                            return [2 /*return*/];
                        }
                        res.json(course);
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _b.sent();
                        console.error('Error in updateCourseStatus:', error_7);
                        if (error_7 instanceof database_error_1.DatabaseError) {
                            res.status(500).json({ error: error_7.message });
                        }
                        else {
                            res.status(500).json({ error: 'Internal server error' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseController.getCoursesByStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var status_2, courses, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        status_2 = req.params.status;
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.getAllCourses()];
                    case 1:
                        courses = _a.sent();
                        res.json(courses);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error in getCoursesByStatus:', error_8);
                        if (error_8 instanceof database_error_1.DatabaseError) {
                            res.status(500).json({ error: error_8.message });
                        }
                        else {
                            res.status(500).json({ error: 'Internal server error' });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OpenCourseController;
}());
exports.OpenCourseController = OpenCourseController;
