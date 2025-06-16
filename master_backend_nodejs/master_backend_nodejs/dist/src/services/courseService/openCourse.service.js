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
exports.OpenCourseService = void 0;
var database_1 = require("../../config/database");
var database_error_1 = require("../../utils/errors/database.error");
var OpenCourseService = /** @class */ (function () {
    function OpenCourseService() {
    }
    OpenCourseService.getAllCourses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'SELECT * FROM open_courses ORDER BY created_at DESC';
                        return [4 /*yield*/, database_1.Database.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching open courses');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.getCourseById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'SELECT * FROM open_courses WHERE id = $1';
                        return [4 /*yield*/, database_1.Database.query(query, [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                    case 2:
                        error_2 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching open course by ID');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.createCourse = function (courseData) {
        return __awaiter(this, void 0, void 0, function () {
            var query, values, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                INSERT INTO open_courses (\n                    subject_id,\n                    semester_id,\n                    subject_name,\n                    subject_type_id,\n                    total_hours,\n                    max_students,\n                    current_students,\n                    lecturer,\n                    schedule,\n                    status,\n                    start_date,\n                    end_date,\n                    registration_start_date,\n                    registration_end_date,\n                    prerequisites,\n                    description,\n                    created_at,\n                    updated_at\n                ) VALUES (\n                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()\n                ) RETURNING *\n            ";
                        values = [
                            courseData.subjectId,
                            courseData.semesterId,
                            courseData.subjectName,
                            courseData.subjectTypeId,
                            courseData.totalHours,
                            courseData.maxStudents,
                            courseData.currentStudents,
                            courseData.lecturer,
                            courseData.schedule ? JSON.stringify(courseData.schedule) : null,
                            courseData.status || 'open',
                            courseData.startDate,
                            courseData.endDate,
                            courseData.registrationStartDate,
                            courseData.registrationEndDate,
                            courseData.prerequisites ? JSON.stringify(courseData.prerequisites) : null,
                            courseData.description
                        ];
                        return [4 /*yield*/, database_1.Database.query(query, values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, this.mapToIOfferedSubject(result)];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error creating course:', error_3);
                        throw new database_error_1.DatabaseError('Failed to create course');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.mapToIOfferedSubject = function (data) {
        return {
            subjectId: data.subject_id,
            semesterId: data.semester_id,
            subjectName: data.subject_name,
            subjectTypeId: data.subject_type_id,
            totalHours: data.total_hours,
            maxStudents: data.max_students,
            currentStudents: data.current_students,
            lecturer: data.lecturer,
            schedule: data.schedule ? JSON.parse(data.schedule) : undefined,
            status: data.status,
            startDate: data.start_date,
            endDate: data.end_date,
            registrationStartDate: data.registration_start_date,
            registrationEndDate: data.registration_end_date,
            prerequisites: data.prerequisites ? JSON.parse(data.prerequisites) : undefined,
            description: data.description,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
    };
    OpenCourseService.updateCourse = function (id, courseData) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                UPDATE open_courses \n                SET subject_id = COALESCE($1, subject_id),\n                    subject_name = COALESCE($2, subject_name),\n                    semester_id = COALESCE($3, semester_id),\n                    max_students = COALESCE($4, max_students),\n                    current_students = COALESCE($5, current_students),\n                    lecturer = COALESCE($6, lecturer),\n                    schedule = COALESCE($7, schedule),\n                    status = COALESCE($8, status),\n                    start_date = COALESCE($9, start_date),\n                    end_date = COALESCE($10, end_date),\n                    registration_start_date = COALESCE($11, registration_start_date),\n                    registration_end_date = COALESCE($12, registration_end_date),\n                    prerequisites = COALESCE($13, prerequisites),\n                    description = COALESCE($14, description),\n                    updated_at = CURRENT_TIMESTAMP\n                WHERE id = $15\n                RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                courseData.subjectId,
                                courseData.subjectName,
                                courseData.semesterId,
                                courseData.maxStudents,
                                courseData.currentStudents,
                                courseData.lecturer,
                                courseData.schedule ? JSON.stringify(courseData.schedule) : null,
                                courseData.status,
                                courseData.startDate,
                                courseData.endDate,
                                courseData.registrationStartDate,
                                courseData.registrationEndDate,
                                courseData.prerequisites ? JSON.stringify(courseData.prerequisites) : null,
                                courseData.description,
                                id
                            ])];
                    case 1:
                        result = _a.sent();
                        if (!result[0]) {
                            throw new Error('Course not found');
                        }
                        return [2 /*return*/, result[0]];
                    case 2:
                        error_4 = _a.sent();
                        throw new database_error_1.DatabaseError('Error updating open course');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.deleteCourse = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'DELETE FROM open_courses WHERE id = $1';
                        return [4 /*yield*/, database_1.Database.query(query, [id])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        throw new database_error_1.DatabaseError('Error deleting open course');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.getCoursesByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'SELECT * FROM open_courses WHERE status = $1 ORDER BY created_at DESC';
                        return [4 /*yield*/, database_1.Database.query(query, [status])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching courses by status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.getCoursesBySemester = function (semester, academicYear) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'SELECT * FROM open_courses WHERE semester = $1 AND academic_year = $2 ORDER BY created_at DESC';
                        return [4 /*yield*/, database_1.Database.query(query, [semester, academicYear])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching courses by semester');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.updateCourseStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                UPDATE open_courses \n                SET status = $1,\n                    updated_at = CURRENT_TIMESTAMP\n                WHERE id = $2\n                RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [status, id])];
                    case 1:
                        result = _a.sent();
                        if (!result[0]) {
                            throw new Error('Course not found');
                        }
                        return [2 /*return*/, result[0]];
                    case 2:
                        error_8 = _a.sent();
                        throw new database_error_1.DatabaseError('Error updating course status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OpenCourseService;
}());
exports.OpenCourseService = OpenCourseService;
