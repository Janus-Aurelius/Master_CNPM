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
// Helper function to convert names to codes
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
                    console.log("Found code: ".concat(code));
                    return [2 /*return*/, code];
                }
                else {
                    console.log("No code found for name: ".concat(name));
                    return [2 /*return*/, ''];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error converting name to code for \"".concat(name, "\":"), error_1);
                return [2 /*return*/, ''];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.studentService = {
    getAllStudents: function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    s.MaSoSinhVien as studentId,\n                    s.HoTen as fullName,\n                    s.NgaySinh as dateOfBirth,\n                    s.GioiTinh as gender,\n                    s.QueQuan as hometown,\n                    s.MaHuyen as districtId,\n                    s.MaDoiTuongUT as priorityObjectId,\n                    s.MaNganh as majorId,\n                    s.Email as email,\n                    s.SoDienThoai as phone,\n                    h.TenHuyen as districtName,\n                    t.TenTinh as provinceName,\n                    d.TenDoiTuong as priorityName,\n                    n.TenNganh as majorName,\n                    k.TenKhoa as facultyName\n                FROM SINHVIEN s\n                LEFT JOIN HUYEN h ON s.MaHuyen = h.MaHuyen\n                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh\n                LEFT JOIN DOITUONGUUTIEN d ON s.MaDoiTuongUT = d.MaDoiTuong\n                LEFT JOIN NGANHHOC n ON s.MaNganh = n.MaNganh\n                LEFT JOIN KHOA k ON n.MaKhoa = k.MaKhoa\n                ORDER BY s.MaSoSinhVien\n            ")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows.map(function (row) { return ({
                            studentId: row.studentid,
                            fullName: row.fullname,
                            dateOfBirth: row.dateofbirth,
                            gender: row.gender,
                            hometown: row.hometown,
                            districtId: row.districtid,
                            priorityObjectId: row.priorityobjectid,
                            majorId: row.majorid,
                            email: row.email || '',
                            phone: row.phone || '',
                            districtName: row.districtname,
                            provinceName: row.provincename,
                            priorityName: row.priorityname,
                            majorName: row.majorname,
                            facultyName: row.facultyname
                        }); })];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching students:', error_2);
                    throw new Error('Failed to fetch students');
                case 3: return [2 /*return*/];
            }
        });
    }); },
    getStudentById: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result, row, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    s.MaSoSinhVien as studentId,\n                    s.HoTen as fullName,\n                    s.NgaySinh as dateOfBirth,\n                    s.GioiTinh as gender,\n                    s.QueQuan as hometown,\n                    s.MaHuyen as districtId,\n                    s.MaDoiTuongUT as priorityObjectId,\n                    s.MaNganh as majorId,\n                    s.Email as email,\n                    s.SoDienThoai as phone,\n                    h.TenHuyen as districtName,\n                    t.TenTinh as provinceName,\n                    d.TenDoiTuong as priorityName,\n                    n.TenNganh as majorName,\n                    k.TenKhoa as facultyName\n                FROM SINHVIEN s\n                LEFT JOIN HUYEN h ON s.MaHuyen = h.MaHuyen\n                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh\n                LEFT JOIN DOITUONGUUTIEN d ON s.MaDoiTuongUT = d.MaDoiTuong\n                LEFT JOIN NGANHHOC n ON s.MaNganh = n.MaNganh\n                LEFT JOIN KHOA k ON n.MaKhoa = k.MaKhoa\n                WHERE s.MaSoSinhVien = $1\n            ", [id])];
                case 1:
                    result = _a.sent();
                    if (result.rows.length === 0)
                        return [2 /*return*/, null];
                    row = result.rows[0];
                    return [2 /*return*/, {
                            studentId: row.studentid,
                            fullName: row.fullname,
                            dateOfBirth: row.dateofbirth,
                            gender: row.gender,
                            hometown: row.hometown,
                            districtId: row.districtid,
                            priorityObjectId: row.priorityobjectid,
                            majorId: row.majorid,
                            email: row.email || '',
                            phone: row.phone || '',
                            districtName: row.districtname,
                            provinceName: row.provincename,
                            priorityName: row.priorityname,
                            majorName: row.majorname,
                            facultyName: row.facultyname
                        }];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error fetching student by ID:', error_3);
                    throw new Error('Failed to fetch student');
                case 3: return [2 /*return*/];
            }
        });
    }); },
    createStudent: function (student) { return __awaiter(void 0, void 0, void 0, function () {
        var districtCode, priorityCode, majorCode, result, row, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    console.log('Original student data:', {
                        majorId: student.majorId,
                        districtId: student.districtId,
                        priorityObjectId: student.priorityObjectId
                    });
                    return [4 /*yield*/, convertNameToCode(student.districtName || '', 'HUYEN', 'TenHuyen', 'MaHuyen')];
                case 1:
                    districtCode = _a.sent();
                    return [4 /*yield*/, convertNameToCode(student.priorityName || '', 'DOITUONGUUTIEN', 'TenDoiTuong', 'MaDoiTuong')];
                case 2:
                    priorityCode = _a.sent();
                    return [4 /*yield*/, convertNameToCode(student.majorName || '', 'NGANHHOC', 'TenNganh', 'MaNganh')];
                case 3:
                    majorCode = _a.sent();
                    console.log('Final codes:', {
                        districtCode: districtCode,
                        priorityCode: priorityCode,
                        majorCode: majorCode
                    });
                    return [4 /*yield*/, database_1.db.query('INSERT INTO SINHVIEN (MaSoSinhVien, HoTen, NgaySinh, GioiTinh, QueQuan, MaHuyen, MaDoiTuongUT, MaNganh, Email, SoDienThoai) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [student.studentId, student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone])];
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
                            phone: row.sodienthoai || ''
                        }];
                case 5:
                    error_4 = _a.sent();
                    console.error('Error in createStudent:', error_4);
                    throw new Error('Failed to create student');
                case 6: return [2 /*return*/];
            }
        });
    }); },
    updateStudent: function (id, student) { return __awaiter(void 0, void 0, void 0, function () {
        var districtCode, priorityCode, majorCode, result, row, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, convertNameToCode(student.districtName || '', 'HUYEN', 'TenHuyen', 'MaHuyen')];
                case 1:
                    districtCode = _a.sent();
                    return [4 /*yield*/, convertNameToCode(student.priorityName || '', 'DOITUONGUUTIEN', 'TenDoiTuong', 'MaDoiTuong')];
                case 2:
                    priorityCode = _a.sent();
                    return [4 /*yield*/, convertNameToCode(student.majorName || '', 'NGANHHOC', 'TenNganh', 'MaNganh')];
                case 3:
                    majorCode = _a.sent();
                    return [4 /*yield*/, database_1.db.query("UPDATE SINHVIEN SET \n                    HoTen = $2, NgaySinh = $3, GioiTinh = $4, QueQuan = $5, \n                    MaHuyen = $6, MaDoiTuongUT = $7, MaNganh = $8, \n                    Email = $9, SoDienThoai = $10\n                WHERE MaSoSinhVien = $1 RETURNING *", [id, student.fullName, student.dateOfBirth, student.gender, student.hometown, districtCode, priorityCode, majorCode, student.email, student.phone])];
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
                            phone: row.sodienthoai || ''
                        }];
                case 5:
                    error_5 = _a.sent();
                    console.error('Error in updateStudent:', error_5);
                    throw new Error('Failed to update student');
                case 6: return [2 /*return*/];
            }
        });
    }); },
    deleteStudent: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query('DELETE FROM SINHVIEN WHERE MaSoSinhVien = $1', [id])];
                case 1:
                    result = _a.sent();
                    if (result.rowCount === 0) {
                        throw new Error('Student not found');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error in deleteStudent:', error_6);
                    throw new Error('Failed to delete student');
                case 3: return [2 /*return*/];
            }
        });
    }); },
    searchStudents: function (searchTerm) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.db.query("\n                SELECT \n                    s.MaSoSinhVien as studentId,\n                    s.HoTen as fullName,\n                    s.NgaySinh as dateOfBirth,\n                    s.GioiTinh as gender,\n                    s.QueQuan as hometown,\n                    s.MaHuyen as districtId,\n                    s.MaDoiTuongUT as priorityObjectId,\n                    s.MaNganh as majorId,\n                    s.Email as email,\n                    s.SoDienThoai as phone,\n                    h.TenHuyen as districtName,\n                    t.TenTinh as provinceName,\n                    d.TenDoiTuong as priorityName,\n                    n.TenNganh as majorName,\n                    k.TenKhoa as facultyName\n                FROM SINHVIEN s\n                LEFT JOIN HUYEN h ON s.MaHuyen = h.MaHuyen\n                LEFT JOIN TINH t ON h.MaTinh = t.MaTinh\n                LEFT JOIN DOITUONGUUTIEN d ON s.MaDoiTuongUT = d.MaDoiTuong\n                LEFT JOIN NGANHHOC n ON s.MaNganh = n.MaNganh\n                LEFT JOIN KHOA k ON n.MaKhoa = k.MaKhoa\n                WHERE s.MaSoSinhVien ILIKE $1 OR s.HoTen ILIKE $1\n                ORDER BY s.MaSoSinhVien\n            ", ["%".concat(searchTerm, "%")])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows.map(function (row) { return ({
                            studentId: row.studentid,
                            fullName: row.fullname,
                            dateOfBirth: row.dateofbirth,
                            gender: row.gender,
                            hometown: row.hometown,
                            districtId: row.districtid,
                            priorityObjectId: row.priorityobjectid,
                            majorId: row.majorid,
                            email: row.email || '',
                            phone: row.phone || '',
                            districtName: row.districtname,
                            provinceName: row.provincename,
                            priorityName: row.priorityname,
                            majorName: row.majorname,
                            facultyName: row.facultyname
                        }); })];
                case 2:
                    error_7 = _a.sent();
                    console.error('Error searching students:', error_7);
                    throw new Error('Failed to search students');
                case 3: return [2 /*return*/];
            }
        });
    }); }
};
