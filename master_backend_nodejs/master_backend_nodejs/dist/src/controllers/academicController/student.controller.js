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
exports.studentController = void 0;
var student_business_1 = require("../../business/academicBusiness/student.business");
var academicStructure_service_1 = require("../../services/academicService/academicStructure.service");
exports.studentController = {
    getStudents: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var students, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, student_business_1.studentBusiness.getStudents()];
                case 1:
                    students = _a.sent();
                    res.json({
                        success: true,
                        data: students,
                        message: 'Students fetched successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to fetch students'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    createStudent: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var student, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, student_business_1.studentBusiness.createStudent(req.body)];
                case 1:
                    student = _a.sent();
                    res.status(201).json({
                        success: true,
                        data: student,
                        message: 'Student created successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to create student'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    updateStudent: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var student, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, student_business_1.studentBusiness.updateStudent(req.params.id, req.body)];
                case 1:
                    student = _a.sent();
                    res.json({
                        success: true,
                        data: student,
                        message: 'Student updated successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to update student'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    deleteStudent: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, student_business_1.studentBusiness.deleteStudent(req.params.id)];
                case 1:
                    _a.sent();
                    res.json({
                        success: true,
                        data: null,
                        message: 'Student deleted successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to delete student'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    searchStudents: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var students, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, student_business_1.studentBusiness.searchStudents(req.query.query)];
                case 1:
                    students = _a.sent();
                    res.json({
                        success: true,
                        data: students,
                        message: 'Students searched successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to search students'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // Dropdown data endpoints for student forms
    getFaculties: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var faculties, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, academicStructure_service_1.AcademicStructureService.getAllFaculties()];
                case 1:
                    faculties = _a.sent();
                    res.json({
                        success: true,
                        data: faculties,
                        message: 'Faculties fetched successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error getting faculties:', error_6);
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to fetch faculties'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getMajors: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var majors, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, academicStructure_service_1.AcademicStructureService.getAllMajors()];
                case 1:
                    majors = _a.sent();
                    res.json({
                        success: true,
                        data: majors,
                        message: 'Majors fetched successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error('Error getting majors:', error_7);
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to fetch majors'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getMajorsByFaculty: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var facultyId, majors, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    facultyId = req.params.facultyId;
                    if (!facultyId) {
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                data: null,
                                error: 'Faculty ID is required'
                            })];
                    }
                    return [4 /*yield*/, academicStructure_service_1.AcademicStructureService.getMajorsByFaculty(facultyId)];
                case 1:
                    majors = _a.sent();
                    res.json({
                        success: true,
                        data: majors,
                        message: 'Majors by faculty fetched successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    console.error('Error getting majors by faculty:', error_8);
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to fetch majors by faculty'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getProvinces: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var provinces, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, academicStructure_service_1.AcademicStructureService.getAllProvinces()];
                case 1:
                    provinces = _a.sent();
                    res.json({
                        success: true,
                        data: provinces,
                        message: 'Provinces fetched successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    console.error('Error getting provinces:', error_9);
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to fetch provinces'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getPriorityGroups: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var priorityGroups, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, academicStructure_service_1.AcademicStructureService.getAllPriorityGroups()];
                case 1:
                    priorityGroups = _a.sent();
                    res.json({
                        success: true,
                        data: priorityGroups,
                        message: 'Priority groups fetched successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    console.error('Error getting priority groups:', error_10);
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to fetch priority groups'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // Helper endpoint for all student form data
    getStudentFormData: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, faculties, majors, provinces, districts, priorityGroups, error_11;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Promise.all([
                            academicStructure_service_1.AcademicStructureService.getAllFaculties(),
                            academicStructure_service_1.AcademicStructureService.getAllMajors(),
                            academicStructure_service_1.AcademicStructureService.getAllProvinces(),
                            academicStructure_service_1.AcademicStructureService.getAllDistricts(),
                            academicStructure_service_1.AcademicStructureService.getAllPriorityGroups()
                        ])];
                case 1:
                    _a = _b.sent(), faculties = _a[0], majors = _a[1], provinces = _a[2], districts = _a[3], priorityGroups = _a[4];
                    res.json({
                        success: true,
                        data: {
                            faculties: faculties,
                            majors: majors,
                            provinces: provinces,
                            districts: districts,
                            priorityGroups: priorityGroups
                        },
                        message: 'Student form data fetched successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _b.sent();
                    console.error('Error getting student form data:', error_11);
                    res.status(500).json({
                        success: false,
                        data: null,
                        error: 'Failed to fetch student form data'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
};
