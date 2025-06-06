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
// Now import XLSX after mocking
var XLSX = __importStar(require("xlsx"));
// Mock the Database class
jest.mock('../config/database');
describe('ProgramBusiness', function () {
    // Sample Course objects for testing
    var sampleCourses = [
        {
            id: 1,
            name: 'Lập trình cơ bản',
            lecturer: 'Nguyễn Văn A',
            day: 'Monday',
            session: '1-3',
            fromTo: '07:00-09:30',
            credits: 3,
            location: 'A1-101'
        },
        {
            id: 2,
            name: 'Cấu trúc dữ liệu',
            lecturer: 'Trần Thị B',
            day: 'Tuesday',
            session: '4-6',
            fromTo: '13:00-15:30',
            credits: 3,
            location: 'A1-102'
        },
        {
            id: 3,
            name: 'Thuật toán',
            lecturer: 'Lê Văn C',
            day: 'Wednesday',
            session: '1-3',
            fromTo: '07:00-09:30',
            credits: 3,
            location: 'A1-103'
        }
    ];
    // Mock data
    var mockPrograms = [
        {
            id: '1',
            name_year: 'Kỹ thuật phần mềm 2023',
            department: 'Công nghệ phần mềm',
            major: 'Kỹ thuật phần mềm',
            courseList: [sampleCourses[0], sampleCourses[1], sampleCourses[2]],
            totalCredit: 145,
            status: 'active'
        },
        {
            id: '2',
            name_year: 'Khoa học máy tính 2023',
            department: 'Khoa học máy tính',
            major: 'Khoa học máy tính',
            courseList: [sampleCourses[0], sampleCourses[1], sampleCourses[2]],
            totalCredit: 140,
            status: 'active'
        }
    ];
    var newProgramData = {
        name_year: 'An toàn thông tin 2023',
        department: 'An toàn thông tin',
        major: 'An toàn thông tin',
        courseList: [sampleCourses[0], sampleCourses[1]],
        totalCredit: 135,
        status: 'active'
    };
    beforeEach(function () {
        jest.clearAllMocks();
    });
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
                        expect(database_1.Database.query).toHaveBeenCalledWith('SELECT * FROM programs ORDER BY id');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database error', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getProgramById('1')];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(mockPrograms[0]);
                        expect(database_1.Database.query).toHaveBeenCalledWith('SELECT * FROM programs WHERE id = $1', ['1']);
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
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getProgramById('999')];
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
                        expectedProgram = __assign({ id: '3' }, newProgramData);
                        database_1.Database.query.mockResolvedValue([expectedProgram]);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.createProgram(newProgramData)];
                    case 1:
                        result = _a.sent();
                        expect(result).toEqual(expectedProgram);
                        expect(database_1.Database.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO programs'), expect.arrayContaining([
                            newProgramData.name_year,
                            newProgramData.department,
                            newProgramData.major,
                            JSON.stringify(newProgramData.courseList),
                            newProgramData.totalCredit,
                            newProgramData.status
                        ]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should validate required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidData = {
                            name_year: '',
                            department: 'Test',
                            major: '',
                            courseList: [],
                            totalCredit: 0,
                            status: 'invalid'
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
            totalCredit: 150,
            status: 'inactive'
        };
        beforeEach(function () {
            jest.clearAllMocks();
        });
        it('should update an existing program', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query
                            .mockResolvedValueOnce([mockPrograms[0]]) // for getProgramById
                            .mockResolvedValueOnce([__assign(__assign({}, mockPrograms[0]), updateData)]); // for update
                        return [4 /*yield*/, program_business_1.ProgramBusiness.updateProgram('1', updateData)];
                    case 1:
                        result = _a.sent();
                        expect(result.totalCredit).toBe(150);
                        expect(result.status).toBe('inactive');
                        expect(database_1.Database.query).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw error for non-existent program', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock getProgramById to return empty array (program not found)
                        database_1.Database.query.mockResolvedValueOnce([]);
                        // This will cause ValidationError in the business logic
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.updateProgram('999', updateData))
                                .rejects.toThrow('Program not found')];
                    case 1:
                        // This will cause ValidationError in the business logic
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
                        database_1.Database.query.mockResolvedValue({ rowCount: 1 });
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.deleteProgram('1')).resolves.not.toThrow()];
                    case 1:
                        _a.sent();
                        expect(database_1.Database.query).toHaveBeenCalledWith('DELETE FROM programs WHERE id = $1', ['1']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle database error during deletion', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        database_1.Database.query.mockRejectedValue(new Error('Database error'));
                        return [4 /*yield*/, expect(program_business_1.ProgramBusiness.deleteProgram('1')).rejects.toThrow(database_error_1.DatabaseError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('processExcelData', function () {
        var mockFile = {
            buffer: Buffer.from('dummy excel data'),
            originalname: 'test.xlsx',
            mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            fieldname: 'file',
            encoding: '7bit',
            size: 100,
            destination: 'uploads/',
            filename: 'test.xlsx',
            path: 'uploads/test.xlsx'
        };
        var mockExcelData = [
            {
                'Program Name and Year': 'Trí tuệ nhân tạo 2023',
                'Department': 'Khoa học máy tính',
                'Major': 'Trí tuệ nhân tạo',
                'Course List': 'AI1234,AI2345,AI3456',
                'Total Credits': '135',
                'Status': 'Active'
            }
        ];
        var expectedProgram = {
            id: '4',
            name_year: 'Trí tuệ nhân tạo 2023',
            department: 'Khoa học máy tính',
            major: 'Trí tuệ nhân tạo',
            courseList: [sampleCourses[0], sampleCourses[1], sampleCourses[2]],
            totalCredit: 135,
            status: 'active'
        };
        beforeEach(function () {
            // Update the mock values for each test
            XLSX.utils.sheet_to_json.mockReturnValue(mockExcelData);
            jest.spyOn(program_business_1.ProgramBusiness, 'createProgram').mockResolvedValue(expectedProgram);
        });
        it('should process valid Excel data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, program_business_1.ProgramBusiness.processExcelData(mockFile)];
                    case 1:
                        result = _a.sent();
                        expect(result).toHaveLength(1);
                        expect(result[0]).toEqual(expectedProgram);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle invalid Excel data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var invalidExcelData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidExcelData = [{
                                'Program Name and Year': '',
                                'Department': '',
                                'Major': '',
                                'Course List': '',
                                'Total Credits': 'invalid',
                                'Status': 'invalid'
                            }];
                        // Override the mock for this test
                        XLSX.utils.sheet_to_json.mockReturnValue(invalidExcelData);
                        // Mock validateProgramData to return errors
                        jest.spyOn(program_business_1.ProgramBusiness, 'validateProgramData').mockReturnValue(['Program name and year is required', 'Department is required']);
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
