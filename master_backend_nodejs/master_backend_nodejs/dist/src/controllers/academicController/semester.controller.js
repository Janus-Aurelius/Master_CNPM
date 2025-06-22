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
exports.semesterController = void 0;
var term_service_1 = require("../../services/academicService/term.service");
var databaseService_1 = require("../../services/database/databaseService");
exports.semesterController = {
    // GET /api/academic/semesters
    getAllSemesters: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var semesters, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, term_service_1.semesterService.getAllSemesters()];
                case 1:
                    semesters = _a.sent();
                    res.json({
                        success: true,
                        data: semesters,
                        message: 'Semesters retrieved successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error in getAllSemesters:', error_1);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // GET /api/academic/semesters/:id
    getSemesterById: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, semester, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, term_service_1.semesterService.getSemesterById(id)];
                case 1:
                    semester = _a.sent();
                    if (!semester) {
                        res.status(404).json({
                            success: false,
                            message: 'Semester not found'
                        });
                        return [2 /*return*/];
                    }
                    res.json({
                        success: true,
                        data: semester,
                        message: 'Semester retrieved successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error in getSemesterById:', error_2);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_2 instanceof Error ? error_2.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // POST /api/academic/semesters
    createSemester: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var semesterData, newSemester, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    semesterData = req.body;
                    // Basic validation
                    if (!semesterData.semesterId || !semesterData.termNumber || !semesterData.startDate ||
                        !semesterData.endDate || !semesterData.status || !semesterData.academicYear) {
                        res.status(400).json({
                            success: false,
                            message: 'Missing required fields'
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, term_service_1.semesterService.createSemester(semesterData)];
                case 1:
                    newSemester = _a.sent();
                    res.status(201).json({
                        success: true,
                        data: newSemester,
                        message: 'Semester created successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error in createSemester:', error_3);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_3 instanceof Error ? error_3.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, // PUT /api/academic/semesters/:id
    updateSemester: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, semesterData, updatedSemester, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    semesterData = req.body;
                    return [4 /*yield*/, term_service_1.semesterService.updateSemester(id, semesterData)];
                case 1:
                    updatedSemester = _a.sent();
                    res.json({
                        success: true,
                        data: updatedSemester,
                        message: 'Semester updated successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error in updateSemester:', error_4);
                    if (error_4 instanceof Error && error_4.message === 'Semester not found') {
                        res.status(404).json({
                            success: false,
                            message: 'Semester not found'
                        });
                        return [2 /*return*/];
                    }
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_4 instanceof Error ? error_4.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // DELETE /api/academic/semesters/:id
    deleteSemester: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    return [4 /*yield*/, term_service_1.semesterService.deleteSemester(id)];
                case 1:
                    _a.sent();
                    res.json({
                        success: true,
                        message: 'Semester deleted successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error in deleteSemester:', error_5);
                    if (error_5 instanceof Error) {
                        if (error_5.message === 'Semester not found') {
                            res.status(404).json({
                                success: false,
                                message: 'Semester not found'
                            });
                            return [2 /*return*/];
                        }
                        if (error_5.message === 'Không thể xóa học kỳ đã có phiếu đăng ký') {
                            res.status(400).json({
                                success: false,
                                message: 'Không thể xóa học kỳ đã có phiếu đăng ký'
                            });
                            return [2 /*return*/];
                        }
                    }
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_5 instanceof Error ? error_5.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // GET /api/academic/semesters/search?q=searchTerm
    searchSemesters: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var q, semesters, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    q = req.query.q;
                    if (!q || typeof q !== 'string') {
                        res.status(400).json({
                            success: false,
                            message: 'Search query is required'
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, term_service_1.semesterService.searchSemesters(q)];
                case 1:
                    semesters = _a.sent();
                    res.json({
                        success: true,
                        data: semesters,
                        message: 'Search completed successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error in searchSemesters:', error_6);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_6 instanceof Error ? error_6.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // GET /api/academic/semesters/year/:year
    getSemestersByYear: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var year, academicYear, semesters, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    year = req.params.year;
                    academicYear = parseInt(year);
                    if (isNaN(academicYear)) {
                        res.status(400).json({
                            success: false,
                            message: 'Invalid year parameter'
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, term_service_1.semesterService.getSemestersByYear(academicYear)];
                case 1:
                    semesters = _a.sent();
                    res.json({
                        success: true,
                        data: semesters,
                        message: 'Semesters retrieved successfully'
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.error('Error in getSemestersByYear:', error_7);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_7 instanceof Error ? error_7.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // PUT /api/academic/semesters/:id/status
    updateSemesterStatus: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, status_1, validStatuses, result, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    id = req.params.id;
                    status_1 = req.body.status;
                    validStatuses = ['Đang diễn ra', 'Đóng'];
                    if (!validStatuses.includes(status_1)) {
                        res.status(400).json({
                            success: false,
                            message: 'Invalid status. Must be one of: Đang diễn ra, Đóng'
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, term_service_1.semesterService.updateSemesterStatus(id, status_1)];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        res.status(404).json({
                            success: false,
                            message: 'Semester not found'
                        });
                        return [2 /*return*/];
                    }
                    res.json({
                        success: true,
                        data: result,
                        message: "Semester status updated to \"".concat(status_1, "\" successfully")
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    console.error('Error in updateSemesterStatus:', error_8);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_8 instanceof Error ? error_8.message : 'Unknown error'
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // GET /api/academic/semesters/current
    getCurrentSemester: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var currentSemester, semester, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, databaseService_1.DatabaseService.getCurrentSemester()];
                case 1:
                    currentSemester = _a.sent();
                    return [4 /*yield*/, term_service_1.semesterService.getSemesterById(currentSemester)];
                case 2:
                    semester = _a.sent();
                    if (!semester) {
                        res.status(404).json({
                            success: false,
                            message: 'Current semester not found'
                        });
                        return [2 /*return*/];
                    }
                    res.json({
                        success: true,
                        data: semester,
                        message: 'Current semester retrieved successfully'
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _a.sent();
                    console.error('Error in getCurrentSemester:', error_9);
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error',
                        error: error_9 instanceof Error ? error_9.message : 'Unknown error'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
