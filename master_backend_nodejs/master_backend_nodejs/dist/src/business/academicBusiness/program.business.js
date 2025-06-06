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
exports.ProgramBusiness = void 0;
var database_1 = require("../../config/database");
var database_error_1 = require("../../utils/errors/database.error");
var validation_error_1 = require("../../utils/errors/validation.error");
var XLSX = __importStar(require("xlsx"));
var ProgramBusiness = /** @class */ (function () {
    function ProgramBusiness() {
    }
    ProgramBusiness.getAllPrograms = function () {
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
    ProgramBusiness.getProgramById = function (id) {
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
    ProgramBusiness.createProgram = function (programData) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, query, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errors = this.validateProgramData(programData);
                        if (errors.length > 0) {
                            throw new validation_error_1.ValidationError(errors.join(', '));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        query = "\n                INSERT INTO programs (\n                    name_year, department, major, \n                    course_list, total_credit, status\n                ) VALUES ($1, $2, $3, $4, $5, $6)\n                RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                programData.name_year,
                                programData.department,
                                programData.major,
                                JSON.stringify(programData.courseList),
                                programData.totalCredit,
                                programData.status
                            ])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 3:
                        error_3 = _a.sent();
                        throw new database_error_1.DatabaseError('Error creating program');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.updateProgram = function (id, programData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingProgram, errors, query, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProgramById(id)];
                    case 1:
                        existingProgram = _a.sent();
                        if (!existingProgram) {
                            throw new validation_error_1.ValidationError('Program not found');
                        }
                        errors = this.validateProgramData(__assign(__assign({}, existingProgram), programData));
                        if (errors.length > 0) {
                            throw new validation_error_1.ValidationError(errors.join(', '));
                        }
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        query = "\n                UPDATE programs \n                SET name_year = $1, department = $2, major = $3,\n                    course_list = $4, total_credit = $5, status = $6\n                WHERE id = $7\n                RETURNING *\n            ";
                        return [4 /*yield*/, database_1.Database.query(query, [
                                programData.name_year || existingProgram.name_year,
                                programData.department || existingProgram.department,
                                programData.major || existingProgram.major,
                                JSON.stringify(programData.courseList || existingProgram.courseList),
                                programData.totalCredit || existingProgram.totalCredit,
                                programData.status || existingProgram.status,
                                id
                            ])];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 4:
                        error_4 = _a.sent();
                        throw new database_error_1.DatabaseError('Error updating program');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.deleteProgram = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = 'DELETE FROM programs WHERE id = $1';
                        return [4 /*yield*/, database_1.Database.query(query, [id])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        throw new database_error_1.DatabaseError('Error deleting program');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.validateProgramData = function (programData) {
        var errors = [];
        if (!programData.name_year)
            errors.push('Program name and year is required');
        if (!programData.department)
            errors.push('Department is required');
        if (!programData.major)
            errors.push('Major is required');
        if (!programData.courseList || !Array.isArray(programData.courseList)) {
            errors.push('Course list must be an array');
        }
        if (typeof programData.totalCredit !== 'number' || programData.totalCredit <= 0) {
            errors.push('Total credit must be a positive number');
        }
        if (!programData.status || !['active', 'inactive'].includes(programData.status)) {
            errors.push('Status must be either active or inactive');
        }
        return errors;
    };
    ProgramBusiness.processExcelData = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, sheetName, sheet, data, programs, _i, data_1, row, program, errors, _a, _b, error_6;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        workbook = XLSX.read(file.buffer);
                        sheetName = workbook.SheetNames[0];
                        sheet = workbook.Sheets[sheetName];
                        data = XLSX.utils.sheet_to_json(sheet);
                        programs = [];
                        _i = 0, data_1 = data;
                        _c.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        row = data_1[_i];
                        program = this.mapExcelRowToProgram(row);
                        errors = this.validateProgramData(program);
                        if (errors.length > 0) {
                            throw new validation_error_1.ValidationError("Invalid program data: ".concat(errors.join(', ')));
                        }
                        _b = (_a = programs).push;
                        return [4 /*yield*/, this.createProgram(program)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, programs];
                    case 5:
                        error_6 = _c.sent();
                        if (error_6 instanceof validation_error_1.ValidationError) {
                            throw error_6;
                        }
                        throw new Error('Error processing Excel file');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.mapExcelRowToProgram = function (row) {
        return {
            name_year: row['Program Name and Year'],
            department: row['Department'],
            major: row['Major'],
            courseList: row['Course List'].split(',').map(function (course) { return course.trim(); }),
            totalCredit: parseInt(row['Total Credits']),
            status: row['Status'].toLowerCase()
        };
    };
    return ProgramBusiness;
}());
exports.ProgramBusiness = ProgramBusiness;
