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
exports.searchCourses = exports.deleteCourse = exports.updateCourse = exports.addCourse = exports.getCourseById = exports.getCourses = void 0;
// src/services/courseService.ts
var databaseService_1 = require("../database/databaseService");
var database_1 = require("../../config/database");
var getCourses = function () { return __awaiter(void 0, void 0, void 0, function () {
    var courses, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                c.MaMonHoc as \"courseId\",\n                c.TenMonHoc as \"courseName\",\n                c.MaLoaiMon as \"courseTypeId\",\n                c.SoTiet as \"totalHours\",\n                l.TenLoaiMon as \"courseTypeName\",\n                l.SoTietMotTC as \"hoursPerCredit\",\n                l.SoTienMotTC as \"pricePerCredit\",\n                ROUND(c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0), 2) as \"totalCredits\",\n                ROUND((c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0)) * l.SoTienMotTC, 2) as \"totalPrice\"\n            FROM MONHOC c\n            JOIN LOAIMON l ON c.MaLoaiMon = l.MaLoaiMon\n            ORDER BY c.MaMonHoc\n        ")];
            case 1:
                courses = _a.sent();
                return [2 /*return*/, courses];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching courses:', error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCourses = getCourses;
var getCourseById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var course, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Service - getCourseById called with ID:', id);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                c.MaMonHoc as \"courseId\",\n                c.TenMonHoc as \"courseName\",\n                c.MaLoaiMon as \"courseTypeId\",\n                c.SoTiet as \"totalHours\",\n                l.TenLoaiMon as \"courseTypeName\",\n                l.SoTietMotTC as \"hoursPerCredit\",\n                l.SoTienMotTC as \"pricePerCredit\",\n                ROUND(c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0), 2) as \"totalCredits\",\n                ROUND((c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0)) * l.SoTienMotTC, 2) as \"totalPrice\"\n            FROM MONHOC c\n            JOIN LOAIMON l ON c.MaLoaiMon = l.MaLoaiMon\n            WHERE c.MaMonHoc = $1\n        ", [id])];
            case 1:
                course = _a.sent();
                console.log('Service - getCourseById result:', course);
                return [2 /*return*/, course];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching course by id:', error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCourseById = getCourseById;
var addCourse = function (course) { return __awaiter(void 0, void 0, void 0, function () {
    var newCourse, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                // Thêm course vào database
                return [4 /*yield*/, databaseService_1.DatabaseService.insert('MONHOC', {
                        MaMonHoc: course.courseId,
                        TenMonHoc: course.courseName,
                        MaLoaiMon: course.courseTypeId,
                        SoTiet: course.totalHours
                    })];
            case 1:
                // Thêm course vào database
                _a.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                c.MaMonHoc as \"courseId\",\n                c.TenMonHoc as \"courseName\",\n                c.MaLoaiMon as \"courseTypeId\",\n                c.SoTiet as \"totalHours\",\n                l.TenLoaiMon as \"courseTypeName\",\n                l.SoTietMotTC as \"hoursPerCredit\",\n                l.SoTienMotTC as \"pricePerCredit\",\n                ROUND(c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0), 2) as \"totalCredits\",\n                ROUND((c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0)) * l.SoTienMotTC, 2) as \"totalPrice\"\n            FROM MONHOC c\n            JOIN LOAIMON l ON c.MaLoaiMon = l.MaLoaiMon\n            WHERE c.MaMonHoc = $1\n        ", [course.courseId])];
            case 2:
                newCourse = _a.sent();
                return [2 /*return*/, newCourse];
            case 3:
                error_3 = _a.sent();
                console.error('Error adding course:', error_3);
                throw error_3;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addCourse = addCourse;
var updateCourse = function (id, courseData) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData, updatedCourse, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updateData = {};
                if (courseData.courseName)
                    updateData.TenMonHoc = courseData.courseName;
                if (courseData.courseTypeId)
                    updateData.MaLoaiMon = courseData.courseTypeId;
                if (courseData.totalHours)
                    updateData.SoTiet = courseData.totalHours;
                // Update course
                return [4 /*yield*/, databaseService_1.DatabaseService.update('MONHOC', updateData, { MaMonHoc: id })];
            case 1:
                // Update course
                _a.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                c.MaMonHoc as \"courseId\",\n                c.TenMonHoc as \"courseName\",\n                c.MaLoaiMon as \"courseTypeId\",\n                c.SoTiet as \"totalHours\",\n                l.TenLoaiMon as \"courseTypeName\",\n                l.SoTietMotTC as \"hoursPerCredit\",\n                l.SoTienMotTC as \"pricePerCredit\",\n                ROUND(c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0), 2) as \"totalCredits\",\n                ROUND((c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0)) * l.SoTienMotTC, 2) as \"totalPrice\"\n            FROM MONHOC c\n            JOIN LOAIMON l ON c.MaLoaiMon = l.MaLoaiMon\n            WHERE c.MaMonHoc = $1\n        ", [id])];
            case 2:
                updatedCourse = _a.sent();
                return [2 /*return*/, updatedCourse];
            case 3:
                error_4 = _a.sent();
                console.error('Error updating course:', error_4);
                throw error_4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateCourse = updateCourse;
var deleteCourse = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Service - deleteCourse called with ID:', id);
                return [4 /*yield*/, database_1.Database.withClient(function (client) { return __awaiter(void 0, void 0, void 0, function () {
                        var deleteCTPDKResult, deleteDSMHMOResult, deleteMainResult, success, error_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 6, , 8]);
                                    return [4 /*yield*/, client.query('BEGIN')];
                                case 1:
                                    _a.sent();
                                    // Bước 1: Xóa từ bảng CT_PHIEUDANGKY trước (cascade delete)
                                    console.log('Step 1: Deleting from CT_PHIEUDANGKY...');
                                    return [4 /*yield*/, client.query('DELETE FROM CT_PHIEUDANGKY WHERE MaMonHoc = $1', [id])];
                                case 2:
                                    deleteCTPDKResult = _a.sent();
                                    console.log('Deleted CT_PHIEUDANGKY rows:', deleteCTPDKResult.rowCount);
                                    // Bước 2: Xóa từ bảng DANHSACHMONHOCMO
                                    console.log('Step 2: Deleting from DANHSACHMONHOCMO...');
                                    return [4 /*yield*/, client.query('DELETE FROM DANHSACHMONHOCMO WHERE MaMonHoc = $1', [id])];
                                case 3:
                                    deleteDSMHMOResult = _a.sent();
                                    console.log('Deleted DANHSACHMONHOCMO rows:', deleteDSMHMOResult.rowCount);
                                    // Bước 3: Cuối cùng xóa từ bảng MONHOC
                                    console.log('Step 3: Deleting from MONHOC...');
                                    return [4 /*yield*/, client.query('DELETE FROM MONHOC WHERE MaMonHoc = $1', [id])];
                                case 4:
                                    deleteMainResult = _a.sent();
                                    console.log('Deleted MONHOC rows:', deleteMainResult.rowCount);
                                    return [4 /*yield*/, client.query('COMMIT')];
                                case 5:
                                    _a.sent();
                                    success = deleteMainResult.rowCount > 0;
                                    console.log('Final delete result:', success);
                                    return [2 /*return*/, success];
                                case 6:
                                    error_6 = _a.sent();
                                    return [4 /*yield*/, client.query('ROLLBACK')];
                                case 7:
                                    _a.sent();
                                    throw error_6;
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting course:', error_5);
                throw error_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCourse = deleteCourse;
var searchCourses = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var courses, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                c.MaMonHoc as \"subjectId\",\n                c.TenMonHoc as \"subjectName\",\n                c.MaLoaiMon as \"subjectTypeId\",\n                c.SoTiet as \"totalHours\",\n                l.TenLoaiMon as \"subjectTypeName\",\n                l.SoTietMotTC as \"hoursPerCredit\",\n                l.SoTienMotTC as \"costPerCredit\"\n            FROM MONHOC c\n            JOIN LOAIMON l ON c.MaLoaiMon = l.MaLoaiMon\n            WHERE \n                c.TrangThai = 'active' AND\n                (\n                    LOWER(c.TenMonHoc) LIKE LOWER($1) OR\n                    LOWER(c.MaMonHoc) LIKE LOWER($1)\n                )\n            ORDER BY c.MaMonHoc\n        ", ["%".concat(query, "%")])];
            case 1:
                courses = _a.sent();
                return [2 /*return*/, courses];
            case 2:
                error_7 = _a.sent();
                console.error('Error searching courses:', error_7);
                throw error_7;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchCourses = searchCourses;
