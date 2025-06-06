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
exports.ProgramService = void 0;
var database_1 = require("../../config/database");
var database_error_1 = require("../../utils/errors/database.error");
var ProgramService = /** @class */ (function () {
    function ProgramService() {
    }
    ProgramService.getAllPrograms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'SELECT * FROM programs ORDER BY id';
                        return [4 /*yield*/, database_1.Database.query(query)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching programs');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.getProgramById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'SELECT * FROM programs WHERE id = $1';
                        return [4 /*yield*/, database_1.Database.query(query, [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                    case 2:
                        error_2 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching program by ID');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.createProgram = function (programData) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                INSERT INTO programs (\n                    name_year, department, major, \n                    course_list, total_credit, status\n                ) VALUES ($1, $2, $3, $4, $5, $6)\n                RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                programData.name_year,
                                programData.department,
                                programData.major,
                                JSON.stringify(programData.courseList),
                                programData.totalCredit,
                                programData.status
                            ])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 2:
                        error_3 = _a.sent();
                        throw new database_error_1.DatabaseError('Error creating program');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.updateProgram = function (id, programData) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                UPDATE programs \n                SET name_year = COALESCE($1, name_year), \n                    department = COALESCE($2, department), \n                    major = COALESCE($3, major),\n                    course_list = COALESCE($4, course_list), \n                    total_credit = COALESCE($5, total_credit), \n                    status = COALESCE($6, status)\n                WHERE id = $7\n                RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                programData.name_year,
                                programData.department,
                                programData.major,
                                programData.courseList ? JSON.stringify(programData.courseList) : null,
                                programData.totalCredit,
                                programData.status,
                                id
                            ])];
                    case 1:
                        result = _a.sent();
                        if (!result[0]) {
                            throw new Error('Program not found');
                        }
                        return [2 /*return*/, result[0]];
                    case 2:
                        error_4 = _a.sent();
                        throw new database_error_1.DatabaseError('Error updating program');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.deleteProgram = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'DELETE FROM programs WHERE id = $1 RETURNING id';
                        return [4 /*yield*/, database_1.Database.query(query, [id])];
                    case 1:
                        result = _a.sent();
                        if (!result[0]) {
                            throw new Error('Program not found');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        throw new database_error_1.DatabaseError('Error deleting program');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.getProgramsByDepartment = function (department) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'SELECT * FROM programs WHERE department = $1 ORDER BY name_year';
                        return [4 /*yield*/, database_1.Database.query(query, [department])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching programs by department');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.getProgramsByStatus = function (status) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'SELECT * FROM programs WHERE status = $1 ORDER BY name_year';
                        return [4 /*yield*/, database_1.Database.query(query, [status])];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        throw new database_error_1.DatabaseError('Error fetching programs by status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.updateProgramStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                UPDATE programs \n                SET status = $1\n                WHERE id = $2\n                RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [status, id])];
                    case 1:
                        result = _a.sent();
                        if (!result[0]) {
                            throw new Error('Program not found');
                        }
                        return [2 /*return*/, result[0]];
                    case 2:
                        error_8 = _a.sent();
                        throw new database_error_1.DatabaseError('Error updating program status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProgramService;
}());
exports.ProgramService = ProgramService;
