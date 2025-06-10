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
var databaseService_1 = require("../database/databaseService");
var database_error_1 = require("../../utils/errors/database.error");
var ProgramService = /** @class */ (function () {
    function ProgramService() {
    }
    ProgramService.getAllPrograms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("SELECT * FROM chuongtrinhhoc ORDER BY maNganh, maHocKy")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in getAllPrograms:', error_1);
                        throw new database_error_1.DatabaseError('Failed to fetch programs');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.getProgramById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("SELECT * FROM chuongtrinhhoc WHERE id = $1", [id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error in getProgramById:', error_2);
                        throw new database_error_1.DatabaseError('Failed to fetch program');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.createProgram = function (program) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("INSERT INTO chuongtrinhhoc (maNganh, maMonHoc, maHocKy, ghiChu)\n                 VALUES ($1, $2, $3, $4)\n                 RETURNING *", [program.maNganh, program.maMonHoc, program.maHocKy, program.ghiChu])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error in createProgram:', error_3);
                        throw new database_error_1.DatabaseError('Failed to create program');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.updateProgram = function (maNganh, maMonHoc, maHocKy, program) {
        return __awaiter(this, void 0, void 0, function () {
            var fields, values, idx, sql, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        fields = [];
                        values = [];
                        idx = 1;
                        if (program.ghiChu !== undefined) {
                            fields.push("ghiChu = $".concat(idx++));
                            values.push(program.ghiChu);
                        }
                        if (program.maNganh !== undefined) {
                            fields.push("maNganh = $".concat(idx++));
                            values.push(program.maNganh);
                        }
                        if (program.maMonHoc !== undefined) {
                            fields.push("maMonHoc = $".concat(idx++));
                            values.push(program.maMonHoc);
                        }
                        if (program.maHocKy !== undefined) {
                            fields.push("maHocKy = $".concat(idx++));
                            values.push(program.maHocKy);
                        }
                        // Add more fields if needed
                        if (fields.length === 0) {
                            throw new Error('No fields to update');
                        }
                        // Add composite key to values
                        values.push(maNganh, maMonHoc, maHocKy);
                        sql = "\n                UPDATE chuongtrinhhoc\n                SET ".concat(fields.join(', '), "\n                WHERE maNganh = $").concat(idx++, " AND maMonHoc = $").concat(idx++, " AND maHocKy = $").concat(idx, "\n                RETURNING *\n            ");
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(sql, values)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error in updateProgram:', error_4);
                        throw new database_error_1.DatabaseError('Failed to update program');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.deleteProgram = function (maNganh, maMonHoc, maHocKy) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                DELETE FROM chuongtrinhhoc \n                WHERE manganh = $1 AND mamonhoc = $2 AND mahocky = $3\n                RETURNING *\n            ";
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query, [maNganh, maMonHoc, maHocKy])];
                    case 1:
                        result = _a.sent();
                        if (result.length === 0) {
                            throw new database_error_1.DatabaseError('Program not found');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error in deleteProgram:', error_5);
                        throw new database_error_1.DatabaseError('Failed to delete program');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.getProgramsByNganh = function (maNganh) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("SELECT * FROM chuongtrinhhoc WHERE maNganh = $1 ORDER BY maHocKy", [maNganh])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error in getProgramsByNganh:', error_6);
                        throw new database_error_1.DatabaseError('Failed to fetch programs by nganh');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramService.getProgramsByHocKy = function (maHocKy) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("SELECT * FROM chuongtrinhhoc WHERE maHocKy = $1 ORDER BY maNganh", [maHocKy])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error in getProgramsByHocKy:', error_7);
                        throw new database_error_1.DatabaseError('Failed to fetch programs by hoc ky');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProgramService;
}());
exports.ProgramService = ProgramService;
