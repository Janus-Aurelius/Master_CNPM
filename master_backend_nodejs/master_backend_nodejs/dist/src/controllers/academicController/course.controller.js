"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getCourseTypesOnly = exports.getCourseFormData = exports.getCourseTypesHandler = exports.deleteCourseHandler = exports.updateCourseHandler = exports.createCourseHandler = exports.getCourseByIdHandler = exports.getCoursesHandler = void 0;
var courseBusiness = __importStar(require("../../business/academicBusiness/course.business"));
var academicStructure_service_1 = require("../../services/academicService/academicStructure.service");
var getCoursesHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var courses, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, courseBusiness.listCourses()];
            case 1:
                courses = _a.sent();
                res.json({ success: true, data: courses });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ success: false, message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCoursesHandler = getCoursesHandler;
var getCourseByIdHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, course, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, courseBusiness.getCourseById(id)];
            case 1:
                course = _a.sent();
                if (!course) {
                    res.status(404).json({ success: false, message: 'Course not found' });
                    return [2 /*return*/];
                }
                res.json({ success: true, data: course });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ success: false, message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCourseByIdHandler = getCourseByIdHandler;
var createCourseHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var courseData, newCourse, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                courseData = req.body;
                return [4 /*yield*/, courseBusiness.createCourse(courseData)];
            case 1:
                newCourse = _a.sent();
                res.status(201).json({ success: true, data: newCourse });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error in createCourseHandler:', error_3);
                if (error_3.message && error_3.message.includes('Mã môn học đã tồn tại')) {
                    res.status(400).json({ success: false, message: error_3.message });
                }
                else if (error_3.code === '23503' && error_3.constraint === 'monhoc_maloaimon_fkey') {
                    res.status(400).json({
                        success: false,
                        message: 'Mã loại môn không hợp lệ. Vui lòng kiểm tra lại.'
                    });
                }
                else if (error_3.code === '23503') {
                    // Các lỗi foreign key khác
                    res.status(400).json({
                        success: false,
                        message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.'
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: error_3.message || 'Failed to create course'
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createCourseHandler = createCourseHandler;
var updateCourseHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, courseData, updatedCourse, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                courseData = req.body;
                return [4 /*yield*/, courseBusiness.updateCourse(id, courseData)];
            case 1:
                updatedCourse = _a.sent();
                if (!updatedCourse) {
                    res.status(404).json({ success: false, message: 'Course not found' });
                    return [2 /*return*/];
                }
                res.json({ success: true, data: updatedCourse });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error in updateCourseHandler:', error_4);
                // Xử lý lỗi foreign key constraint cho mã loại môn
                if (error_4.code === '23503' && error_4.constraint === 'monhoc_maloaimon_fkey') {
                    res.status(400).json({
                        success: false,
                        message: 'Mã loại môn không hợp lệ. Vui lòng kiểm tra lại.'
                    });
                }
                else if (error_4.code === '23503') {
                    // Các lỗi foreign key khác
                    res.status(400).json({
                        success: false,
                        message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.'
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error_4.message || 'Failed to update course'
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateCourseHandler = updateCourseHandler;
var deleteCourseHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, success, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                console.log('DELETE request received for course ID:', id);
                return [4 /*yield*/, courseBusiness.deleteCourse(id)];
            case 1:
                success = _a.sent();
                if (!success) {
                    console.log('Course not found:', id);
                    res.status(404).json({ success: false, message: 'Course not found' });
                    return [2 /*return*/];
                }
                console.log('Course deleted successfully:', id);
                res.json({
                    success: true,
                    message: 'Môn học và các dữ liệu liên quan đã được xóa thành công'
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error in deleteCourseHandler:', error_5);
                // Xử lý lỗi foreign key constraint
                if (error_5.code === '23503') {
                    res.status(400).json({
                        success: false,
                        message: 'Không thể xóa môn học vì có dữ liệu liên quan trong hệ thống'
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error_5.message || 'Failed to delete course'
                    });
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteCourseHandler = deleteCourseHandler;
// Course Type management for course forms
var getCourseTypesHandler = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var courseTypes, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, academicStructure_service_1.AcademicStructureService.getAllCourseTypes()];
            case 1:
                courseTypes = _a.sent();
                res.json({ success: true, data: courseTypes });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error getting course types:', error_6);
                res.status(500).json({ success: false, message: 'Failed to fetch course types' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCourseTypesHandler = getCourseTypesHandler;
var getCourseFormData = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var courseTypes, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, academicStructure_service_1.AcademicStructureService.getAllCourseTypes()];
            case 1:
                courseTypes = _a.sent();
                res.json({
                    success: true,
                    data: { courseTypes: courseTypes },
                    message: 'Course form data fetched successfully'
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error getting course form data:', error_7);
                res.status(500).json({ success: false, message: 'Failed to fetch course form data' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCourseFormData = getCourseFormData;
var getCourseTypesOnly = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var DatabaseService, courseTypes, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                DatabaseService = require('../../services/database/databaseService').DatabaseService;
                return [4 /*yield*/, DatabaseService.query("\n            SELECT MaLoaiMon as \"id\", TenLoaiMon as \"name\", SoTietMotTC as \"hoursPerCredit\"\n            FROM LOAIMON \n            ORDER BY MaLoaiMon\n        ")];
            case 1:
                courseTypes = _a.sent();
                res.json({
                    success: true,
                    data: courseTypes,
                    message: 'Course types fetched successfully'
                });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error getting course types:', error_8);
                res.status(500).json({ success: false, message: 'Failed to fetch course types' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCourseTypesOnly = getCourseTypesOnly;
