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
var program_business_1 = require("../business/academicBusiness/program.business");
var database_1 = require("../config/database");
var database_error_1 = require("../utils/errors/database.error");
var validation_error_1 = require("../utils/errors/validation.error");
// Mock XLSX module before importing
jest.mock('xlsx', function () { return ({
    read: jest.fn().mockReturnValue({
        SheetNames: ['Sheet1'],
        Sheets: {
            Sheet1: {}
        }
    }),
    utils: {
        sheet_to_json: jest.fn().mockReturnValue([])
    }
}); });
// Mock the Database class
jest.mock('../config/database');
describe('ProgramBusiness', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    var mockPrograms = [
        {
            id: 1,
            maNganh: 'CNTT',
            maMonHoc: 'CS101',
            maHocKy: 'HK1',
            ghiChu: 'Môn học bắt buộc'
        },
        {
            id: 2,
            maNganh: 'CNTT',
            maMonHoc: 'CS102',
            maHocKy: 'HK1',
            ghiChu: 'Môn học tự chọn'
        }
    ];
    var newProgramData = {
        maNganh: 'CNTT',
        maMonHoc: 'CS103',
        maHocKy: 'HK1',
        ghiChu: 'Môn học mới'
    };
    describe('getAllPrograms', function () {
        it('should return all programs', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValue(mockPrograms);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getAllPrograms()];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockPrograms);
                        expect(database_1.Database.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error when database fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.getAllPrograms()).rejects.toThrow(database_error_1.DatabaseError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getProgramById', function () {
        it('should return program by id', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValue([mockPrograms[0]]);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getProgramById(1)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockPrograms[0]);
                        expect(database_1.Database.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return null for non-existent program', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValue([]);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getProgramById(999)];
                    case 1:
                        result = _a.sent();
                        expect(result).toBeNull();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('createProgram', function () {
        it('should create a new program', function () { return __awaiter(void 0, void 0, void 0, function () {
            var expectedProgram, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedProgram = __assign({ id: 3 }, newProgramData);
                        database_1.Database.query.mockResolvedValue([expectedProgram]);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.createProgram(newProgramData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(expectedProgram);
                        expect(database_1.Database.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO chuongtrinhhoc'), [
                            newProgramData.maNganh,
                            newProgramData.maMonHoc,
                            newProgramData.maHocKy,
                            newProgramData.ghiChu
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw validation error for invalid data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidData = {
                            maNganh: '',
                            maMonHoc: '',
                            maHocKy: ''
                        };
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.createProgram(invalidData)).rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('updateProgram', function () {
        var updateData = {
            maNganh: 'CNTT',
            ghiChu: 'Cập nhật ghi chú'
        };
        it('should update an existing program', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query
                            .mockResolvedValueOnce([mockPrograms[0]]) // for getProgramById
                            .mockResolvedValueOnce([__assign(__assign({}, mockPrograms[0]), updateData)]); // for update
                        return [4 /*yield*/, program_business_1.ProgramBusiness.updateProgram(1, updateData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(__assign(__assign({}, mockPrograms[0]), updateData));
                        expect(database_1.Database.query).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent program', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValue([]); // for getProgramById
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.updateProgram(999, updateData))
                                .rejects.toThrow('Program not found')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('deleteProgram', function () {
        it('should delete an existing program', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockResolvedValue([{ maNganh: 'CNTT', maMonHoc: 'CS101', maHocKy: 'HK1' }]);
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.deleteProgram('CNTT', 'CS101', 'HK1')).resolves.not.toThrow()];
                    case 1:
                        _a.sent();
                        expect(database_1.Database.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM chuongtrinhhoc'), ['CNTT', 'CS101', 'HK1']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error when database fails', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.deleteProgram('CNTT', 'CS101', 'HK1')).rejects.toThrow(database_error_1.DatabaseError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('processExcelData', function () {
        var mockFile = {
            buffer: Buffer.from('mock data'),
            originalname: 'test.xlsx'
        };
        it('should process valid Excel data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockExcelData, expectedProgram, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockExcelData = [
                            {
                                'Mã ngành': 'CNTT',
                                'Mã môn học': 'CS101',
                                'Mã học kỳ': 'HK1',
                                'Ghi chú': 'Môn học bắt buộc'
                            }
                        ];
                        expectedProgram = {
                            id: 1,
                            maNganh: 'CNTT',
                            maMonHoc: 'CS101',
                            maHocKy: 'HK1',
                            ghiChu: 'Môn học bắt buộc'
                        };
                        jest.spyOn(program_business_1.ProgramBusiness, 'createProgram').mockResolvedValue(expectedProgram);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.processExcelData(mockFile)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveLength(1);
                        expect(result[0]).toEqual(expectedProgram);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw validation error for invalid Excel data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockExcelData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockExcelData = [
                            {
                                'Mã ngành': '',
                                'Mã môn học': '',
                                'Mã học kỳ': ''
                            }
                        ];
                        jest.spyOn(program_business_1.ProgramBusiness, 'validateProgramData').mockReturnValue(['Mã ngành là bắt buộc', 'Mã môn học là bắt buộc', 'Mã học kỳ là bắt buộc']);
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.processExcelData(mockFile))
                                .rejects.toThrow(validation_error_1.ValidationError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
