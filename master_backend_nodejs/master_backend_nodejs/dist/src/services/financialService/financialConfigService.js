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
exports.courseTypeService = exports.priorityObjectService = void 0;
var databaseService_1 = require("../database/databaseService");
/**
 * Service for managing priority objects (DOITUONGUUTIEN table)
 */
exports.priorityObjectService = {
    /**
     * Get all priority objects
     */
    getAllPriorityObjects: function () {
        return __awaiter(this, void 0, void 0, function () {
            var records, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaDoiTuong as \"priorityId\",\n                    TenDoiTuong as \"priorityName\",\n                    MucGiamHocPhi as \"discountAmount\"\n                FROM DOITUONGUUTIEN\n                ORDER BY TenDoiTuong\n            ")];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error getting priority objects:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get priority object by ID
     */
    getPriorityObjectById: function (priorityId) {
        return __awaiter(this, void 0, void 0, function () {
            var record, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    MaDoiTuong as \"priorityId\",\n                    TenDoiTuong as \"priorityName\",\n                    MucGiamHocPhi as \"discountAmount\"\n                FROM DOITUONGUUTIEN\n                WHERE MaDoiTuong = $1\n            ", [priorityId])];
                    case 1:
                        record = _a.sent();
                        return [2 /*return*/, record];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting priority object by ID:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Create new priority object
     */
    createPriorityObject: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var newId, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newId = "DT".concat(Date.now());
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                INSERT INTO DOITUONGUUTIEN (MaDoiTuong, TenDoiTuong, MucGiamHocPhi)\n                VALUES ($1, $2, $3)\n                RETURNING \n                    MaDoiTuong as \"priorityId\",\n                    TenDoiTuong as \"priorityName\",\n                    MucGiamHocPhi as \"discountAmount\"\n            ", [newId, data.priorityName, data.discountAmount])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error creating priority object:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update priority object
     */
    updatePriorityObject: function (priorityId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var setClauses, values, paramIndex, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        setClauses = [];
                        values = [];
                        paramIndex = 1;
                        if (data.priorityName !== undefined) {
                            setClauses.push("TenDoiTuong = $".concat(paramIndex));
                            values.push(data.priorityName);
                            paramIndex++;
                        }
                        if (data.discountAmount !== undefined) {
                            setClauses.push("MucGiamHocPhi = $".concat(paramIndex));
                            values.push(data.discountAmount);
                            paramIndex++;
                        }
                        if (setClauses.length === 0) {
                            throw new Error('No data to update');
                        }
                        values.push(priorityId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                UPDATE DOITUONGUUTIEN \n                SET ".concat(setClauses.join(', '), "\n                WHERE MaDoiTuong = $").concat(paramIndex, "\n                RETURNING \n                    MaDoiTuong as \"priorityId\",\n                    TenDoiTuong as \"priorityName\",\n                    MucGiamHocPhi as \"discountAmount\"\n            "), values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error updating priority object:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Delete priority object
     */
    deletePriorityObject: function (priorityId) {
        return __awaiter(this, void 0, void 0, function () {
            var studentCount, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count FROM SINHVIEN WHERE MaDoiTuongUT = $1\n            ", [priorityId])];
                    case 1:
                        studentCount = _a.sent();
                        if (parseInt(studentCount.count) > 0) {
                            throw new Error('Cannot delete priority object: students are still using it');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                DELETE FROM DOITUONGUUTIEN WHERE MaDoiTuong = $1\n                RETURNING MaDoiTuong\n            ", [priorityId])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, !!result];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error deleting priority object:', error_5);
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
/**
 * Service for managing course types (LOAIMON table)
 */
exports.courseTypeService = {
    /**
     * Get all course types
     */
    getAllCourseTypes: function () {
        return __awaiter(this, void 0, void 0, function () {
            var records, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaLoaiMon as \"courseTypeId\",\n                    TenLoaiMon as \"courseTypeName\",\n                    SoTietMotTC as \"hoursPerCredit\",\n                    SoTienMotTC as \"pricePerCredit\"\n                FROM LOAIMON\n                ORDER BY TenLoaiMon\n            ")];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error getting course types:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get course type by ID
     */
    getCourseTypeById: function (courseTypeId) {
        return __awaiter(this, void 0, void 0, function () {
            var record, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    MaLoaiMon as \"courseTypeId\",\n                    TenLoaiMon as \"courseTypeName\",\n                    SoTietMotTC as \"hoursPerCredit\",\n                    SoTienMotTC as \"pricePerCredit\"\n                FROM LOAIMON\n                WHERE MaLoaiMon = $1\n            ", [courseTypeId])];
                    case 1:
                        record = _a.sent();
                        return [2 /*return*/, record];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error getting course type by ID:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Create new course type
     */
    createCourseType: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var newId, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newId = "LM".concat(Date.now());
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                INSERT INTO LOAIMON (MaLoaiMon, TenLoaiMon, SoTietMotTC, SoTienMotTC)\n                VALUES ($1, $2, $3, $4)\n                RETURNING \n                    MaLoaiMon as \"courseTypeId\",\n                    TenLoaiMon as \"courseTypeName\",\n                    SoTietMotTC as \"hoursPerCredit\",\n                    SoTienMotTC as \"pricePerCredit\"\n            ", [newId, data.courseTypeName, data.hoursPerCredit, data.pricePerCredit])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error creating course type:', error_8);
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Update course type
     */
    updateCourseType: function (courseTypeId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var setClauses, values, paramIndex, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        setClauses = [];
                        values = [];
                        paramIndex = 1;
                        if (data.courseTypeName !== undefined) {
                            setClauses.push("TenLoaiMon = $".concat(paramIndex));
                            values.push(data.courseTypeName);
                            paramIndex++;
                        }
                        if (data.hoursPerCredit !== undefined) {
                            setClauses.push("SoTietMotTC = $".concat(paramIndex));
                            values.push(data.hoursPerCredit);
                            paramIndex++;
                        }
                        if (data.pricePerCredit !== undefined) {
                            setClauses.push("SoTienMotTC = $".concat(paramIndex));
                            values.push(data.pricePerCredit);
                            paramIndex++;
                        }
                        if (setClauses.length === 0) {
                            throw new Error('No data to update');
                        }
                        values.push(courseTypeId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                UPDATE LOAIMON \n                SET ".concat(setClauses.join(', '), "\n                WHERE MaLoaiMon = $").concat(paramIndex, "\n                RETURNING \n                    MaLoaiMon as \"courseTypeId\",\n                    TenLoaiMon as \"courseTypeName\",\n                    SoTietMotTC as \"hoursPerCredit\",\n                    SoTienMotTC as \"pricePerCredit\"\n            "), values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error updating course type:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Delete course type
     */
    deleteCourseType: function (courseTypeId) {
        return __awaiter(this, void 0, void 0, function () {
            var courseCount, result, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count FROM MONHOC WHERE MaLoaiMon = $1\n            ", [courseTypeId])];
                    case 1:
                        courseCount = _a.sent();
                        if (parseInt(courseCount.count) > 0) {
                            throw new Error('Cannot delete course type: courses are still using it');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                DELETE FROM LOAIMON WHERE MaLoaiMon = $1\n                RETURNING MaLoaiMon\n            ", [courseTypeId])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, !!result];
                    case 3:
                        error_10 = _a.sent();
                        console.error('Error deleting course type:', error_10);
                        throw error_10;
                    case 4: return [2 /*return*/];
                }
            });
        });
    },
    /**
     * Get courses using this course type
     */
    getCoursesUsingType: function (courseTypeId) {
        return __awaiter(this, void 0, void 0, function () {
            var courses, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaMonHoc as \"courseId\",\n                    TenMonHoc as \"courseName\",\n                    SoTiet as \"totalHours\"\n                FROM MONHOC\n                WHERE MaLoaiMon = $1\n                ORDER BY TenMonHoc\n            ", [courseTypeId])];
                    case 1:
                        courses = _a.sent();
                        return [2 /*return*/, courses];
                    case 2:
                        error_11 = _a.sent();
                        console.error('Error getting courses using type:', error_11);
                        throw error_11;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
