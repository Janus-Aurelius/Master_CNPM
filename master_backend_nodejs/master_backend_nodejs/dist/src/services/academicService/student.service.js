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
exports.studentService = void 0;
var database_1 = require("../../config/database");
// Helper functions to convert names to codes
var convertNameToCode = function (name, table, nameColumn, codeColumn) { return __awaiter(void 0, void 0, void 0, function () {
    var result, code, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!name || name.trim() === '')
                    return [2 /*return*/, ''];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("Converting \"".concat(name, "\" using query: SELECT ").concat(codeColumn, " FROM ").concat(table, " WHERE TRIM(").concat(nameColumn, ") = '").concat(name.trim(), "'"));
                return [4 /*yield*/, database_1.db.query("SELECT ".concat(codeColumn, " FROM ").concat(table, " WHERE TRIM(").concat(nameColumn, ") = $1"), [name.trim()])];
            case 2:
                result = _a.sent();
                console.log('Query result:', result.rows);
                if (result.rows.length > 0) {
                    code = result.rows[0][codeColumn.toLowerCase()];
                    console.log("Found code: ".concat(code, " for name: ").concat(name));
                    return [2 /*return*/, code];
                }
                else {
                    console.warn("No code found for ".concat(name, " in ").concat(table, ".").concat(nameColumn));
                    return [2 /*return*/, '']; // Return empty if not found instead of original name
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error converting ".concat(name, " to code:"), error_1);
                return [2 /*return*/, '']; // Return empty if error
            case 4: return [2 /*return*/];
        }
    });
}); };
var getMajorCode = function (majorName) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('getMajorCode called with:', majorName);
                return [4 /*yield*/, convertNameToCode(majorName, 'NGANHHOC', 'TenNganh', 'MaNganh')];
            case 1:
                result = _a.sent();
                console.log('getMajorCode result:', result);
                return [2 /*return*/, result];
        }
    });
}); };
var getDistrictCode = function (districtName) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('getDistrictCode called with:', districtName);
                return [4 /*yield*/, convertNameToCode(districtName, 'HUYEN', 'TenHuyen', 'MaHuyen')];
            case 1:
                result = _a.sent();
                console.log('getDistrictCode result:', result);
                return [2 /*return*/, result];
        }
    });
}); };
var getPriorityObjectCode = function (priorityName) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('getPriorityObjectCode called with:', priorityName);
                return [4 /*yield*/, convertNameToCode(priorityName, 'DOITUONGUUTIEN', 'TenDoiTuong', 'MaDoiTuong')];
            case 1:
                result = _a.sent();
                console.log('getPriorityObjectCode result:', result);
                return [2 /*return*/, result];
        }
    });
}); };
exports.studentService = {
    getStudents: function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    sv.MaSoSinhVien, sv.HoTen, sv.NgaySinh, sv.GioiTinh, sv.QueQuan, \n                    sv.MaHuyen, sv.MaDoiTuongUT, sv.MaNganh, sv.Email, sv.SoDienThoai, sv.Status,\n                    dt.TenDoiTuong,\n                    h.TenHuyen,\n                    t.TenTinh,\n                    nh.TenNganh,\n                    k.TenKhoa\n                FROM SINHVIEN sv\n                LEFT JOIN DOITUONGUUTIEN dt ON sv.MaDoiTuongUT = dt.MaDoiTuong\n                LEFT JOIN HUYEN h ON sv.MaHuyen = h.MaHuyen\n                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh\n                LEFT JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh\n                LEFT JOIN KHOA k ON nh.MaKhoa = k.MaKhoa\n            ")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows.map(function (row) { return ({
                            studentId: row.masosinhvien,
                            fullName: row.hoten,
                            dateOfBirth: row.ngaysinh,
                            gender: row.gioitinh,
                            hometown: row.tentinh || row.quequan, // Tên tỉnh
                            districtId: row.tenhuyen || row.mahuyen, // Tên huyện
                            priorityObjectId: row.tendoituong || row.madoituongut, // Tên đối tượng
                            majorId: row.tennganh || row.manganh, // Tên ngành
                            email: row.email || '',
                            phone: row.sodienthoai || '',
                            status: row.status === 'active' ? 'đang học' : 'thôi học',
                            faculty: row.tenkhoa || '' // Tên khoa
                        }); })];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error in getStudents:', error_2);
                    throw new Error('Failed to fetch students');
                case 3: return [2 /*return*/];
            }
        });
    }); }, createStudent: function (student) { return __awaiter(void 0, void 0, void 0, function () {
        var dbStatus, majorCode, districtCode, priorityCode, result, row, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    dbStatus = student.status === 'đang học' ? 'active' : 'inactive';
                    console.log('Original student data:', {
                        majorId: student.majorId,
                        districtId: student.districtId,
                        priorityObjectId: student.priorityObjectId
                    });
                    return [4 /*yield*/, getMajorCode(student.majorId)];
                case 1:
                    majorCode = _a.sent();
                    return [4 /*yield*/, getDistrictCode(student.districtId)];
                case 2:
                    districtCode = _a.sent();
                    return [4 /*yield*/, getPriorityObjectCode(student.priorityObjectId)];
                case 3:
                    priorityCode = _a.sent();
                    console.log('Converted codes:', {
                        majorCode: majorCode,
                        districtCode: districtCode,
                        priorityCode: priorityCode
                    });
                    return [4 /*yield*/, database_1.db.query('INSERT INTO SINHVIEN (MaSoSinhVien, HoTen, NgaySinh, GioiTinh, QueQuan, MaHuyen, MaDoiTuongUT, MaNganh, Email, SoDienThoai, Status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [student.studentId, student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone, dbStatus])];
                case 4:
                    result = _a.sent();
                    row = result.rows[0];
                    return [2 /*return*/, {
                            studentId: row.masosinhvien,
                            fullName: row.hoten,
                            dateOfBirth: row.ngaysinh,
                            gender: row.gioitinh,
                            hometown: row.quequan,
                            districtId: row.mahuyen,
                            priorityObjectId: row.madoituongut,
                            majorId: row.manganh,
                            email: row.email || '',
                            phone: row.sodienthoai || '',
                            status: row.status === 'active' ? 'đang học' : 'thôi học'
                        }];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error in createStudent:', error_3);
                    throw new Error('Failed to create student');
                case 6: return [2 /*return*/];
            }
        });
    }); }, updateStudent: function (id, student) { return __awaiter(void 0, void 0, void 0, function () {
        var dbStatus, majorCode, districtCode, priorityCode, result, row, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    dbStatus = student.status === 'đang học' ? 'active' : 'inactive';
                    return [4 /*yield*/, getMajorCode(student.majorId)];
                case 1:
                    majorCode = _a.sent();
                    return [4 /*yield*/, getDistrictCode(student.districtId)];
                case 2:
                    districtCode = _a.sent();
                    return [4 /*yield*/, getPriorityObjectCode(student.priorityObjectId)];
                case 3:
                    priorityCode = _a.sent();
                    return [4 /*yield*/, database_1.db.query('UPDATE SINHVIEN SET HoTen = $1, NgaySinh = $2, GioiTinh = $3, QueQuan = $4, MaHuyen = $5, MaDoiTuongUT = $6, MaNganh = $7, Email = $8, SoDienThoai = $9, Status = $10 WHERE MaSoSinhVien = $11 RETURNING *', [student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone, dbStatus, id])];
                case 4:
                    result = _a.sent();
                    if (result.rows.length === 0) {
                        throw new Error('Student not found');
                    }
                    row = result.rows[0];
                    return [2 /*return*/, {
                            studentId: row.masosinhvien,
                            fullName: row.hoten,
                            dateOfBirth: row.ngaysinh,
                            gender: row.gioitinh,
                            hometown: row.quequan,
                            districtId: row.mahuyen,
                            priorityObjectId: row.madoituongut,
                            majorId: row.manganh,
                            email: row.email || '',
                            phone: row.sodienthoai || '',
                            status: row.status === 'active' ? 'đang học' : 'thôi học'
                        }];
                case 5:
                    error_4 = _a.sent();
                    console.error('Error in updateStudent:', error_4);
                    throw error_4;
                case 6: return [2 /*return*/];
            }
        });
    }); },
    deleteStudent: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query('DELETE FROM SINHVIEN WHERE MaSoSinhVien = $1 RETURNING *', [id])];
                case 1:
                    result = _a.sent();
                    if (result.rows.length === 0) {
                        throw new Error('Student not found');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error in deleteStudent:', error_5);
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    searchStudents: function (query) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    sv.MaSoSinhVien, sv.HoTen, sv.NgaySinh, sv.GioiTinh, sv.QueQuan, \n                    sv.MaHuyen, sv.MaDoiTuongUT, sv.MaNganh, sv.Email, sv.SoDienThoai, sv.Status,\n                    dt.TenDoiTuong,\n                    h.TenHuyen,\n                    t.TenTinh,\n                    nh.TenNganh,\n                    k.TenKhoa\n                FROM SINHVIEN sv\n                LEFT JOIN DOITUONGUUTIEN dt ON sv.MaDoiTuongUT = dt.MaDoiTuong\n                LEFT JOIN HUYEN h ON sv.MaHuyen = h.MaHuyen\n                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh\n                LEFT JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh\n                LEFT JOIN KHOA k ON nh.MaKhoa = k.MaKhoa\n                WHERE sv.HoTen ILIKE $1 OR sv.MaSoSinhVien ILIKE $1\n            ", ["%".concat(query, "%")])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows.map(function (row) { return ({
                            studentId: row.masosinhvien,
                            fullName: row.hoten,
                            dateOfBirth: row.ngaysinh,
                            gender: row.gioitinh,
                            hometown: row.tentinh || row.quequan,
                            districtId: row.tenhuyen || row.mahuyen,
                            priorityObjectId: row.tendoituong || row.madoituongut,
                            majorId: row.tennganh || row.manganh, // Tên ngành
                            email: row.email || '',
                            phone: row.sodienthoai || '',
                            status: row.status === 'active' ? 'đang học' : 'thôi học',
                            faculty: row.tenkhoa || '' // Tên khoa
                        }); })];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error in searchStudents:', error_6);
                    throw new Error('Failed to search students');
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
