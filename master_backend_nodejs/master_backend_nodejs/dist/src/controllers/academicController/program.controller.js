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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramController = void 0;
var program_business_1 = require("../../business/academicBusiness/program.business");
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var validation_error_1 = require("../../utils/errors/validation.error");
var database_error_1 = require("../../utils/errors/database.error");
// Configure multer for file upload
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
var upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        }
        else {
            cb(new Error('Only Excel files are allowed'));
        }
    }
}).single('file');
var ProgramController = /** @class */ (function () {
    function ProgramController() {
    }
    ProgramController.getAllPrograms = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var programs, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getAllPrograms()];
                    case 1:
                        programs = _a.sent();
                        res.json({
                            success: true,
                            data: programs
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error in getAllPrograms:', error_1);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramController.getProgramById = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, program, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getProgramById(Number(id))];
                    case 1:
                        program = _a.sent();
                        if (!program) {
                            res.status(404).json({
                                success: false,
                                message: 'Program not found'
                            });
                            return [2 /*return*/];
                        }
                        res.json({ success: true, data: program });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error in getProgramById:', error_2);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramController.createProgram = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var program, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.createProgram(req.body)];
                    case 1:
                        program = _b.sent();
                        res.status(201).json({ success: true, data: program });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Error in createProgram:', error_3);
                        console.error('Error type:', typeof error_3);
                        console.error('Error constructor name:', (_a = error_3 === null || error_3 === void 0 ? void 0 : error_3.constructor) === null || _a === void 0 ? void 0 : _a.name);
                        console.error('Error instanceof ValidationError:', error_3 instanceof validation_error_1.ValidationError);
                        console.error('Error message:', error_3 instanceof Error ? error_3.message : 'Unknown error');
                        if (error_3 instanceof validation_error_1.ValidationError ||
                            (error_3 instanceof Error && error_3.message === 'Mã môn học không tồn tại trong hệ thống')) {
                            res.status(400).json({
                                success: false,
                                message: error_3.message
                            });
                        }
                        else if (error_3 instanceof Error && error_3.message === 'Semester not found') {
                            res.status(400).json({
                                success: false,
                                message: 'Mã học kỳ không tồn tại trong hệ thống'
                            });
                        }
                        else if (error_3 instanceof Error &&
                            (error_3.message.includes('duplicate key value violates unique constraint "chuongtrinhhoc_pkey"') ||
                                error_3.message.includes('already exists'))) {
                            res.status(400).json({
                                success: false,
                                message: 'Môn học này đã có trong chương trình học'
                            });
                        }
                        else {
                            res.status(500).json({
                                success: false,
                                message: 'Internal server error',
                                debug: error_3 instanceof Error ? error_3.message : 'Unknown error'
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramController.updateProgram = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, maNganh, maMonHoc, maHocKy, programData, updated, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, maNganh = _a.maNganh, maMonHoc = _a.maMonHoc, maHocKy = _a.maHocKy;
                        programData = req.body;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, program_business_1.ProgramBusiness.updateProgram(maNganh, maMonHoc, maHocKy, programData)];
                    case 2:
                        updated = _b.sent();
                        res.json({
                            success: true,
                            data: updated
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _b.sent();
                        console.error('Error in updateProgram:', error_4);
                        if (error_4 instanceof validation_error_1.ValidationError) {
                            res.status(400).json({
                                success: false,
                                message: error_4.message
                            });
                        }
                        else if (error_4 instanceof database_error_1.DatabaseError) {
                            res.status(404).json({
                                success: false,
                                message: error_4.message
                            });
                        }
                        else {
                            res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            });
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProgramController.deleteProgram = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, maNganh, maMonHoc, maHocKy, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, maNganh = _a.maNganh, maMonHoc = _a.maMonHoc, maHocKy = _a.maHocKy;
                        return [4 /*yield*/, program_business_1.ProgramBusiness.deleteProgram(maNganh, maMonHoc, maHocKy)];
                    case 1:
                        _b.sent();
                        res.json({
                            success: true,
                            message: 'Program deleted successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _b.sent();
                        console.error('Error in deleteProgram:', error_5);
                        if (error_5 instanceof database_error_1.DatabaseError) {
                            res.status(404).json({
                                success: false,
                                message: error_5.message
                            });
                        }
                        else {
                            res.status(500).json({
                                success: false,
                                message: 'Internal server error'
                            });
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramController.uploadExcelFile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                upload(req, res, function (err) { return __awaiter(_this, void 0, void 0, function () {
                    var processedData, error_6;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    return [2 /*return*/, res.status(400).json({ success: false, message: err.message })];
                                }
                                if (!req.file) {
                                    return [2 /*return*/, res.status(400).json({ success: false, message: 'No file uploaded' })];
                                }
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, program_business_1.ProgramBusiness.processExcelData(req.file)];
                            case 2:
                                processedData = _a.sent();
                                res.status(200).json({ success: true, data: processedData });
                                return [3 /*break*/, 4];
                            case 3:
                                error_6 = _a.sent();
                                console.error('Error in uploadExcelFile:', error_6);
                                if (error_6 instanceof validation_error_1.ValidationError) {
                                    res.status(400).json({
                                        success: false,
                                        message: error_6.message
                                    });
                                }
                                else {
                                    res.status(500).json({
                                        success: false,
                                        message: 'Error processing Excel file'
                                    });
                                }
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    ProgramController.getProgramsByNganh = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var maNganh, programs, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        maNganh = req.params.maNganh;
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getProgramsByNganh(maNganh)];
                    case 1:
                        programs = _a.sent();
                        res.json({ success: true, data: programs });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error in getProgramsByNganh:', error_7);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramController.getProgramsByHocKy = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var maHocKy, programs, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        maHocKy = req.params.maHocKy;
                        return [4 /*yield*/, program_business_1.ProgramBusiness.getProgramsByHocKy(maHocKy)];
                    case 1:
                        programs = _a.sent();
                        res.json({ success: true, data: programs });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error in getProgramsByHocKy:', error_8);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ProgramController.validateSemester = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var maHocKy, exists, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        maHocKy = req.params.maHocKy;
                        return [4 /*yield*/, program_business_1.ProgramBusiness.validateSemester(maHocKy)];
                    case 1:
                        exists = _a.sent();
                        res.json({
                            success: true,
                            data: { exists: exists }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error in validateSemester:', error_9);
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ProgramController;
}());
exports.ProgramController = ProgramController;
