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
exports.OpenCourseBusiness = void 0;
var validation_error_1 = require("../../utils/errors/validation.error");
var openCourse_service_1 = require("../../services/courseService/openCourse.service");
var OpenCourseBusiness = /** @class */ (function () {
    function OpenCourseBusiness() {
    }
    OpenCourseBusiness.getAllCourses = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, openCourse_service_1.OpenCourseService.getAllCourses()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenCourseBusiness.getCourseById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, openCourse_service_1.OpenCourseService.getCourseById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenCourseBusiness.createCourse = function (courseData) {
        return __awaiter(this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errors = this.validateCourseData(courseData);
                        if (errors.length > 0) {
                            throw new validation_error_1.ValidationError(errors.join(', '));
                        }
                        // Validate dates
                        this.validateDates(courseData);
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.createCourse(courseData)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenCourseBusiness.updateCourse = function (id, courseData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingCourse, updatedData, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCourseById(id)];
                    case 1:
                        existingCourse = _a.sent();
                        if (!existingCourse) {
                            throw new validation_error_1.ValidationError('Course not found');
                        }
                        updatedData = __assign(__assign({}, existingCourse), courseData);
                        errors = this.validateCourseData(updatedData);
                        if (errors.length > 0) {
                            throw new validation_error_1.ValidationError(errors.join(', '));
                        }
                        // Validate dates if they are being updated
                        if (courseData.startDate || courseData.endDate ||
                            courseData.registrationStartDate || courseData.registrationEndDate) {
                            this.validateDates(updatedData);
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.updateCourse(id, courseData)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenCourseBusiness.deleteCourse = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var course;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCourseById(id)];
                    case 1:
                        course = _a.sent();
                        if (!course) {
                            throw new validation_error_1.ValidationError('Course not found');
                        }
                        if (course.currentStudents > 0) {
                            throw new validation_error_1.ValidationError('Cannot delete course with registered students');
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.deleteCourse(id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseBusiness.getCoursesByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, openCourse_service_1.OpenCourseService.getCoursesByStatus(status)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenCourseBusiness.getCoursesBySemester = function (semester, academicYear) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!semester || !academicYear) {
                            throw new validation_error_1.ValidationError('Semester and academic year are required');
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.getCoursesBySemester(semester, academicYear)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenCourseBusiness.updateCourseStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var course;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCourseById(id)];
                    case 1:
                        course = _a.sent();
                        if (!course) {
                            throw new validation_error_1.ValidationError('Course not found');
                        }
                        // Validate status transition
                        if (course.status === 'cancelled' && status !== 'cancelled') {
                            throw new validation_error_1.ValidationError('Cannot change status of a cancelled course');
                        }
                        if (status === 'closed' && course.currentStudents === 0) {
                            throw new validation_error_1.ValidationError('Cannot close a course with no registered students');
                        }
                        return [4 /*yield*/, openCourse_service_1.OpenCourseService.updateCourseStatus(id, status)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenCourseBusiness.validateCourseData = function (courseData) {
        var errors = [];
        if (!courseData.subjectCode)
            errors.push('Subject code is required');
        if (!courseData.subjectName)
            errors.push('Subject name is required');
        if (!courseData.semester)
            errors.push('Semester is required');
        if (!courseData.academicYear)
            errors.push('Academic year is required');
        if (typeof courseData.maxStudents !== 'number' || courseData.maxStudents <= 0) {
            errors.push('Maximum students must be a positive number');
        }
        if (typeof courseData.currentStudents !== 'number' || courseData.currentStudents < 0) {
            errors.push('Current students must be a non-negative number');
        }
        if (courseData.maxStudents && courseData.currentStudents &&
            courseData.currentStudents > courseData.maxStudents) {
            errors.push('Current students cannot exceed maximum students');
        }
        if (!courseData.lecturer)
            errors.push('Lecturer is required');
        if (!courseData.schedule)
            errors.push('Schedule is required');
        if (!courseData.room)
            errors.push('Room is required');
        if (!courseData.status || !['open', 'closed', 'cancelled'].includes(courseData.status)) {
            errors.push('Valid status is required');
        }
        if (!courseData.prerequisites || !Array.isArray(courseData.prerequisites)) {
            errors.push('Prerequisites must be an array');
        }
        return errors;
    };
    OpenCourseBusiness.validateDates = function (courseData) {
        var errors = [];
        if (courseData.startDate && courseData.endDate) {
            var startDate = new Date(courseData.startDate);
            var endDate = new Date(courseData.endDate);
            if (startDate >= endDate) {
                errors.push('Start date must be before end date');
            }
        }
        if (courseData.registrationStartDate && courseData.registrationEndDate) {
            var regStartDate = new Date(courseData.registrationStartDate);
            var regEndDate = new Date(courseData.registrationEndDate);
            if (regStartDate >= regEndDate) {
                errors.push('Registration start date must be before registration end date');
            }
        }
        if (courseData.registrationEndDate && courseData.startDate) {
            var regEndDate = new Date(courseData.registrationEndDate);
            var startDate = new Date(courseData.startDate);
            if (regEndDate >= startDate) {
                errors.push('Registration end date must be before course start date');
            }
        }
        if (errors.length > 0) {
            throw new validation_error_1.ValidationError(errors.join(', '));
        }
    };
    return OpenCourseBusiness;
}());
exports.OpenCourseBusiness = OpenCourseBusiness;
