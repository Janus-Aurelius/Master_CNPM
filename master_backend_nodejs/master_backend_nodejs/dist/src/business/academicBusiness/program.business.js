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
var program_service_1 = require("../../services/courseService/program.service");
var validation_error_1 = require("../../utils/errors/validation.error");
var XLSX = __importStar(require("xlsx"));
var ProgramBusiness = /** @class */ (function () {
    function ProgramBusiness() {
    }
    ProgramBusiness.getAllPrograms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, program_service_1.ProgramService.getAllPrograms()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in ProgramBusiness.getAllPrograms:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.getProgramById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, program_service_1.ProgramService.getProgramById(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error in ProgramBusiness.getProgramById:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.createProgram = function (programData) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        errors = this.validateProgramData(programData);
                        if (errors.length > 0) {
                            throw new validation_error_1.ValidationError("Invalid program data: ".concat(errors.join(', ')));
                        }
                        return [4 /*yield*/, program_service_1.ProgramService.createProgram(programData)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error in ProgramBusiness.createProgram:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.updateProgram = function (maNganh, maMonHoc, maHocKy, programData) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        errors = this.validateProgramData(__assign(__assign({}, programData), { maNganh: maNganh, maMonHoc: maMonHoc, maHocKy: maHocKy }));
                        if (errors.length > 0) {
                            throw new validation_error_1.ValidationError("Invalid program data: ".concat(errors.join(', ')));
                        }
                        return [4 /*yield*/, program_service_1.ProgramService.updateProgram(maNganh, maMonHoc, maHocKy, programData)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error in ProgramBusiness.updateProgram:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.deleteProgram = function (maNganh, maMonHoc, maHocKy) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, program_service_1.ProgramService.deleteProgram(maNganh, maMonHoc, maHocKy)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error in ProgramBusiness.deleteProgram:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.getProgramsByNganh = function (maNganh) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, program_service_1.ProgramService.getProgramsByNganh(maNganh)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error in ProgramBusiness.getProgramsByNganh:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.getProgramsByHocKy = function (maHocKy) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, program_service_1.ProgramService.getProgramsByHocKy(maHocKy)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error in ProgramBusiness.getProgramsByHocKy:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.validateProgramData = function (programData) {
        var errors = [];
        if (!programData.maNganh)
            errors.push('Mã ngành là bắt buộc');
        if (!programData.maMonHoc)
            errors.push('Mã môn học là bắt buộc');
        if (!programData.maHocKy)
            errors.push('Mã học kỳ là bắt buộc');
        return errors;
    };
    ProgramBusiness.processExcelData = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, sheetName, sheet, data, programs, _i, data_1, row, program, errors, _a, _b, error_8;
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
                        error_8 = _c.sent();
                        if (error_8 instanceof validation_error_1.ValidationError) {
                            throw error_8;
                        }
                        throw new Error('Error processing Excel file');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ProgramBusiness.mapExcelRowToProgram = function (row) {
        return {
            maNganh: row['Mã ngành'],
            maMonHoc: row['Mã môn học'],
            maHocKy: row['Mã học kỳ'],
            ghiChu: row['Ghi chú'] || ''
        };
    };
    return ProgramBusiness;
}());
exports.ProgramBusiness = ProgramBusiness;
