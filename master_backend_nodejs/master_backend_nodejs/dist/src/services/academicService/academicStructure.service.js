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
exports.AcademicStructureService = void 0;
var databaseService_1 = require("../database/databaseService");
var AcademicStructureService = /** @class */ (function () {
    function AcademicStructureService() {
    }
    // Faculty Services
    AcademicStructureService.getAllFaculties = function () {
        return __awaiter(this, void 0, void 0, function () {
            var faculties, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaKhoa as facultyId,\n                    TenKhoa as facultyName\n                FROM KHOA\n                ORDER BY TenKhoa\n            ")];
                    case 1:
                        faculties = _a.sent();
                        return [2 /*return*/, faculties];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error fetching faculties:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicStructureService.getFacultyById = function (facultyId) {
        return __awaiter(this, void 0, void 0, function () {
            var faculty, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    MaKhoa as facultyId,\n                    TenKhoa as facultyName\n                FROM KHOA\n                WHERE MaKhoa = $1\n            ", [facultyId])];
                    case 1:
                        faculty = _a.sent();
                        return [2 /*return*/, faculty];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error fetching faculty by id:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Major Services
    AcademicStructureService.getAllMajors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var majors, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    ng.MaNganh as maNganh,\n                    ng.TenNganh as tenNganh,\n                    ng.MaKhoa as maKhoa,\n                    k.TenKhoa as tenKhoa\n                FROM NGANHHOC ng\n                JOIN KHOA k ON ng.MaKhoa = k.MaKhoa\n                ORDER BY k.TenKhoa, ng.TenNganh\n            ")];
                    case 1:
                        majors = _a.sent();
                        return [2 /*return*/, majors];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error fetching majors:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicStructureService.getMajorsByFaculty = function (facultyId) {
        return __awaiter(this, void 0, void 0, function () {
            var majors, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    ng.MaNganh as maNganh,\n                    ng.TenNganh as tenNganh,\n                    ng.MaKhoa as maKhoa,\n                    k.TenKhoa as tenKhoa\n                FROM NGANHHOC ng\n                JOIN KHOA k ON ng.MaKhoa = k.MaKhoa\n                WHERE ng.MaKhoa = $1\n                ORDER BY ng.TenNganh\n            ", [facultyId])];
                    case 1:
                        majors = _a.sent();
                        return [2 /*return*/, majors];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error fetching majors by faculty:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Course Type Services
    AcademicStructureService.getAllCourseTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var courseTypes, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaLoaiMon as courseTypeId,\n                    TenLoaiMon as courseTypeName,\n                    SoTietMotTC as hoursPerCredit,\n                    SoTienMotTC as pricePerCredit\n                FROM LOAIMON\n                ORDER BY TenLoaiMon\n            ")];
                    case 1:
                        courseTypes = _a.sent();
                        return [2 /*return*/, courseTypes];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error fetching course types:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Geographic Services
    AcademicStructureService.getAllProvinces = function () {
        return __awaiter(this, void 0, void 0, function () {
            var provinces, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaTinh as maTinh,\n                    TenTinh as tenTinh\n                FROM TINH\n                ORDER BY TenTinh\n            ")];
                    case 1:
                        provinces = _a.sent();
                        return [2 /*return*/, provinces];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error fetching provinces:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicStructureService.getDistrictsByProvince = function (provinceId) {
        return __awaiter(this, void 0, void 0, function () {
            var districts, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    h.MaHuyen as maHuyen,\n                    h.TenHuyen as tenHuyen,\n                    h.MaTinh as maTinh,\n                    t.TenTinh as tenTinh\n                FROM HUYEN h\n                JOIN TINH t ON h.MaTinh = t.MaTinh\n                WHERE h.MaTinh = $1\n                ORDER BY h.TenHuyen\n            ", [provinceId])];
                    case 1:
                        districts = _a.sent();
                        return [2 /*return*/, districts];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error fetching districts by province:', error_7);
                        throw error_7;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicStructureService.getAllDistricts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var districts, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    h.MaHuyen as maHuyen,\n                    h.TenHuyen as tenHuyen,\n                    h.MaTinh as maTinh,\n                    t.TenTinh as tenTinh\n                FROM HUYEN h\n                JOIN TINH t ON h.MaTinh = t.MaTinh\n                ORDER BY t.TenTinh, h.TenHuyen\n            ")];
                    case 1:
                        districts = _a.sent();
                        return [2 /*return*/, districts];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error fetching districts:', error_8);
                        throw error_8;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Priority Group Services
    AcademicStructureService.getAllPriorityGroups = function () {
        return __awaiter(this, void 0, void 0, function () {
            var priorityGroups, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    MaDoiTuong as maDoiTuong,\n                    TenDoiTuong as tenDoiTuong,\n                    MucGiamHocPhi as mucGiamHocPhi\n                FROM DOITUONGUUTIEN\n                ORDER BY TenDoiTuong\n            ")];
                    case 1:
                        priorityGroups = _a.sent();
                        return [2 /*return*/, priorityGroups];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error fetching priority groups:', error_9);
                        throw error_9;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AcademicStructureService.getPriorityGroupById = function (priorityId) {
        return __awaiter(this, void 0, void 0, function () {
            var priorityGroup, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    MaDoiTuong as maDoiTuong,\n                    TenDoiTuong as tenDoiTuong,\n                    MucGiamHocPhi as mucGiamHocPhi\n                FROM DOITUONGUUTIEN\n                WHERE MaDoiTuong = $1\n            ", [priorityId])];
                    case 1:
                        priorityGroup = _a.sent();
                        return [2 /*return*/, priorityGroup];
                    case 2:
                        error_10 = _a.sent();
                        console.error('Error fetching priority group by id:', error_10);
                        throw error_10;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AcademicStructureService;
}());
exports.AcademicStructureService = AcademicStructureService;
