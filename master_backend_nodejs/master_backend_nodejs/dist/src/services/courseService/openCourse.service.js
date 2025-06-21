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
                        query = "\n                SELECT \n                    dm.MaHocKy as semesterId,\n                    dm.MaMonHoc as courseId,\n                    dm.SiSoToiThieu as minStudents,\n                    dm.SiSoToiDa as maxStudents,\n                    dm.SoSVDaDangKy as currentStudents,\n                    dm.Thu as dayOfWeek,\n                    dm.TietBatDau as startPeriod,\n                    dm.TietKetThuc as endPeriod,\n                    mh.TenMonHoc as courseName,\n                    mh.MaLoaiMon as courseTypeId,\n                    lm.TenLoaiMon as courseTypeName,\n                    mh.SoTiet as totalHours,\n                    lm.SoTietMotTC as hoursPerCredit,\n                    lm.SoTienMotTC as pricePerCredit,\n                    CASE \n                        WHEN dm.SoSVDaDangKy < dm.SiSoToiDa THEN true \n                        ELSE false \n                    END as isAvailable\n                FROM DANHSACHMONHOCMO dm\n                JOIN MONHOC mh ON dm.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                ORDER BY dm.MaHocKy, dm.MaMonHoc\n            ";
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
    OpenCourseService.getCourseById = function (semesterId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT \n                    dm.MaHocKy as semesterId,\n                    dm.MaMonHoc as courseId,\n                    dm.SiSoToiThieu as minStudents,\n                    dm.SiSoToiDa as maxStudents,\n                    dm.SoSVDaDangKy as currentStudents,\n                    dm.Thu as dayOfWeek,\n                    dm.TietBatDau as startPeriod,\n                    dm.TietKetThuc as endPeriod,\n                    mh.TenMonHoc as courseName,\n                    mh.MaLoaiMon as courseTypeId,\n                    lm.TenLoaiMon as courseTypeName,\n                    mh.SoTiet as totalHours,\n                    lm.SoTietMotTC as hoursPerCredit,\n                    lm.SoTienMotTC as pricePerCredit,\n                    CASE \n                        WHEN dm.SoSVDaDangKy < dm.SiSoToiDa THEN true \n                        ELSE false \n                    END as isAvailable\n                FROM DANHSACHMONHOCMO dm\n                JOIN MONHOC mh ON dm.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE dm.MaHocKy = $1 AND dm.MaMonHoc = $2\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [semesterId, courseId])];
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
            var query, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                INSERT INTO DANHSACHMONHOCMO (\n                    MaHocKy,\n                    MaMonHoc,\n                    SiSoToiThieu,\n                    SiSoToiDa,\n                    SoSVDaDangKy,\n                    Thu,\n                    TietBatDau,\n                    TietKetThuc\n                ) VALUES (\n                    $1, $2, $3, $4, $5, $6, $7, $8\n                ) RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                courseData.semesterId,
                                courseData.courseId,
                                courseData.minStudents,
                                courseData.maxStudents,
                                courseData.currentStudents || 0,
                                courseData.dayOfWeek,
                                courseData.startPeriod,
                                courseData.endPeriod
                            ])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 2:
                        error_3 = _a.sent();
                        throw new database_error_1.DatabaseError('Error creating open course');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.mapToIOfferedCourse = function (data) {
        return {
            semesterId: data.semesterId || data.semester_id,
            courseId: data.courseId || data.course_id,
            minStudents: data.minStudents || data.min_students,
            maxStudents: data.maxStudents || data.max_students,
            currentStudents: data.currentStudents || data.current_students,
            dayOfWeek: data.dayOfWeek || data.day_of_week,
            startPeriod: data.startPeriod || data.start_period,
            endPeriod: data.endPeriod || data.end_period,
            courseName: data.courseName || data.course_name,
            courseTypeId: data.courseTypeId || data.course_type_id,
            courseTypeName: data.courseTypeName || data.course_type_name,
            totalHours: data.totalHours || data.total_hours,
            hoursPerCredit: data.hoursPerCredit || data.hours_per_credit,
            pricePerCredit: data.pricePerCredit || data.price_per_credit,
            isAvailable: data.isAvailable || data.is_available,
            registrationStartDate: data.registrationStartDate || data.registration_start_date,
            registrationEndDate: data.registrationEndDate || data.registration_end_date
        };
    };
    OpenCourseService.updateCourse = function (id, courseData) {
        return __awaiter(this, void 0, void 0, function () {
            var currentCourse, query, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getCourseById(courseData.semesterId || '', courseData.courseId || '')];
                    case 1:
                        currentCourse = _a.sent();
                        if (!currentCourse) {
                            throw new Error('Course not found');
                        }
                        query = "\n                UPDATE DANHSACHMONHOCMO \n                SET SiSoToiThieu = COALESCE($3, SiSoToiThieu),\n                    SiSoToiDa = COALESCE($4, SiSoToiDa),\n                    SoSVDaDangKy = COALESCE($5, SoSVDaDangKy),\n                    Thu = COALESCE($6, Thu),\n                    TietBatDau = COALESCE($7, TietBatDau),\n                    TietKetThuc = COALESCE($8, TietKetThuc)\n                WHERE MaHocKy = $1 AND MaMonHoc = $2\n                RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                courseData.semesterId || currentCourse.semesterId,
                                courseData.courseId || currentCourse.courseId,
                                courseData.minStudents,
                                courseData.maxStudents,
                                courseData.currentStudents,
                                courseData.dayOfWeek,
                                courseData.startPeriod,
                                courseData.endPeriod
                            ])];
                    case 2:
                        result = _a.sent();
                        if (!result[0]) {
                            throw new Error('Course not found');
                        }
                        return [2 /*return*/, result[0]];
                    case 3:
                        error_4 = _a.sent();
                        throw new database_error_1.DatabaseError('Error updating open course');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OpenCourseService.deleteCourse = function (semesterId, courseId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'DELETE FROM DANHSACHMONHOCMO WHERE MaHocKy = $1 AND MaMonHoc = $2';
                        return [4 /*yield*/, database_1.Database.query(query, [semesterId, courseId])];
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
    OpenCourseService.getCoursesBySemester = function (semester, academicYear) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT \n                    dm.MaHocKy as semesterId,\n                    dm.MaMonHoc as courseId,\n                    dm.SiSoToiThieu as minStudents,\n                    dm.SiSoToiDa as maxStudents,\n                    dm.SoSVDaDangKy as currentStudents,\n                    dm.Thu as dayOfWeek,\n                    dm.TietBatDau as startPeriod,\n                    dm.TietKetThuc as endPeriod,\n                    mh.TenMonHoc as courseName,\n                    mh.MaLoaiMon as courseTypeId,\n                    lm.TenLoaiMon as courseTypeName,\n                    mh.SoTiet as totalHours,\n                    lm.SoTietMotTC as hoursPerCredit,\n                    lm.SoTienMotTC as pricePerCredit,\n                    CASE \n                        WHEN dm.SoSVDaDangKy < dm.SiSoToiDa THEN true \n                        ELSE false \n                    END as isAvailable\n                FROM DANHSACHMONHOCMO dm\n                JOIN MONHOC mh ON dm.MaMonHoc = mh.MaMonHoc\n                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon\n                WHERE dm.MaHocKy LIKE $1\n                ORDER BY dm.MaHocKy, dm.MaMonHoc\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, ["%".concat(semester, "%")])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching courses by semester');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OpenCourseService;
}());
exports.OpenCourseService = OpenCourseService;
