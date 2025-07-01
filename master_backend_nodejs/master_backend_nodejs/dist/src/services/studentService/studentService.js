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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentService = void 0;
var databaseService_1 = require("../database/databaseService");
exports.studentService = { getStudentInfo: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, userToStudentMapping, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        console.log('🔍 [studentService] Getting student info for ID:', studentId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    s.MaSoSinhVien as \"studentId\",\n                    s.HoTen as \"fullName\",\n                    s.NgaySinh as \"dateOfBirth\",\n                    s.GioiTinh as \"gender\",\n                    s.QueQuan as \"hometown\",\n                    s.MaHuyen as \"districtId\",\n                    s.MaDoiTuongUT as \"priorityObjectId\",\n                    s.MaNganh as \"majorId\",\n                    s.Email as \"email\",\n                    s.SoDienThoai as \"phone\",\n                    'active' as \"status\",\n                    -- Th\u00EAm th\u00F4ng tin t\u00EAn ng\u00E0nh\n                    CASE \n                        WHEN s.MaNganh = 'CNPM' THEN 'C\u00F4ng ngh\u1EC7 ph\u1EA7n m\u1EC1m'\n                        WHEN s.MaNganh = 'KHMT' THEN 'Khoa h\u1ECDc m\u00E1y t\u00EDnh' \n                        WHEN s.MaNganh = 'HTTT' THEN 'H\u1EC7 th\u1ED1ng th\u00F4ng tin'\n                        WHEN s.MaNganh = 'CNTT' THEN 'C\u00F4ng ngh\u1EC7 th\u00F4ng tin'\n                        WHEN s.MaNganh = 'TMDT' THEN 'Th\u01B0\u01A1ng m\u1EA1i \u0111i\u1EC7n t\u1EED'\n                        WHEN s.MaNganh = 'KTPM' THEN 'K\u1EF9 thu\u1EADt ph\u1EA7n m\u1EC1m'\n                        WHEN s.MaNganh = 'VMC' THEN 'Vi\u1EC5n th\u00F4ng Multimedia'\n                        WHEN s.MaNganh = 'CNTT_Nhat' THEN 'C\u00F4ng ngh\u1EC7 th\u00F4ng tin (ti\u1EBFng Nh\u1EADt)'\n                        ELSE s.MaNganh\n                    END as \"majorName\"\n                FROM SINHVIEN s\n                WHERE s.MaSoSinhVien = $1            ", [studentId])];
                    case 1:
                        student = _a.sent();
                        console.log('🔍 [studentService] Raw database result:', student);
                        if (!!student) return [3 /*break*/, 4];
                        console.log('⚠️ [studentService] Student not found directly, trying fallback mapping from NGUOIDUNG...'); // Thử tìm trong bảng NGUOIDUNG để lấy masosinhvien
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                    SELECT \n                        n.userid,\n                        n.tendangnhap,\n                        n.masosinhvien as \"mappedStudentId\"\n                    FROM NGUOIDUNG n\n                    WHERE n.userid = $1 OR UPPER(n.tendangnhap) = UPPER($1)\n                ", [studentId])];
                    case 2:
                        userToStudentMapping = _a.sent();
                        console.log('🔍 [studentService] User mapping result:', userToStudentMapping);
                        if (!(userToStudentMapping === null || userToStudentMapping === void 0 ? void 0 : userToStudentMapping.mappedStudentId)) return [3 /*break*/, 4];
                        console.log('🔄 [studentService] Found mapping, trying with:', userToStudentMapping.mappedStudentId);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                        SELECT \n                            s.MaSoSinhVien as \"studentId\",\n                            s.HoTen as \"fullName\",\n                            s.NgaySinh as \"dateOfBirth\",\n                            s.GioiTinh as \"gender\",\n                            s.QueQuan as \"hometown\",\n                            s.MaHuyen as \"districtId\",\n                            s.MaDoiTuongUT as \"priorityObjectId\",\n                            s.MaNganh as \"majorId\",\n                            s.Email as \"email\",\n                            s.SoDienThoai as \"phone\",\n                            'active' as \"status\",\n                            CASE \n                                WHEN s.MaNganh = 'CNPM' THEN 'C\u00F4ng ngh\u1EC7 ph\u1EA7n m\u1EC1m'\n                                WHEN s.MaNganh = 'KHMT' THEN 'Khoa h\u1ECDc m\u00E1y t\u00EDnh' \n                                WHEN s.MaNganh = 'HTTT' THEN 'H\u1EC7 th\u1ED1ng th\u00F4ng tin'\n                                WHEN s.MaNganh = 'CNTT' THEN 'C\u00F4ng ngh\u1EC7 th\u00F4ng tin'\n                                WHEN s.MaNganh = 'TMDT' THEN 'Th\u01B0\u01A1ng m\u1EA1i \u0111i\u1EC7n t\u1EED'\n                                WHEN s.MaNganh = 'KTPM' THEN 'K\u1EF9 thu\u1EADt ph\u1EA7n m\u1EC1m'\n                                WHEN s.MaNganh = 'VMC' THEN 'Vi\u1EC5n th\u00F4ng Multimedia'\n                                WHEN s.MaNganh = 'CNTT_Nhat' THEN 'C\u00F4ng ngh\u1EC7 th\u00F4ng tin (ti\u1EBFng Nh\u1EADt)'\n                                ELSE s.MaNganh\n                            END as \"majorName\"\n                        FROM SINHVIEN s\n                        WHERE s.MaSoSinhVien = $1\n                    ", [userToStudentMapping.mappedStudentId])];
                    case 3:
                        student = _a.sent();
                        console.log('🔍 [studentService] Fallback query result:', student);
                        _a.label = 4;
                    case 4:
                        if (!student) {
                            console.log('❌ [studentService] No student found even after fallback mapping for ID:', studentId);
                            return [2 /*return*/, null];
                        }
                        result = {
                            studentId: student.studentId,
                            fullName: student.fullName,
                            dateOfBirth: student.dateOfBirth,
                            gender: student.gender,
                            hometown: student.hometown,
                            districtId: student.districtId,
                            priorityObjectId: student.priorityObjectId,
                            majorId: student.majorId,
                            email: student.email,
                            phone: student.phone,
                            majorName: student.majorName // Thêm tên ngành
                        };
                        console.log('✅ [studentService] Processed result:', result);
                        return [2 /*return*/, result];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Error getting student info:', error_1);
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    }, updateStudentInfo: function (studentId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingStudent, updateData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getStudentInfo(studentId)];
                    case 1:
                        existingStudent = _a.sent();
                        if (!existingStudent)
                            return [2 /*return*/, null];
                        updateData = {};
                        if (data.fullName)
                            updateData.HoTen = data.fullName;
                        if (data.email)
                            updateData.Email = data.email;
                        if (data.phone)
                            updateData.SoDienThoai = data.phone;
                        if (data.gender)
                            updateData.GioiTinh = data.gender;
                        if (data.hometown)
                            updateData.QueQuan = data.hometown;
                        if (data.districtId)
                            updateData.MaHuyen = data.districtId;
                        if (data.priorityObjectId)
                            updateData.MaDoiTuongUT = data.priorityObjectId;
                        if (data.majorId)
                            updateData.MaNganh = data.majorId;
                        if (data.address)
                            updateData.DiaChi = data.address;
                        // Update student trong bảng SINHVIEN
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE SINHVIEN \n                SET ".concat(Object.keys(updateData).map(function (key, index) { return "".concat(key, " = $").concat(index + 1); }).join(', '), "\n                WHERE MaSoSinhVien = $").concat(Object.keys(updateData).length + 1, "\n            "), __spreadArray(__spreadArray([], Object.values(updateData), true), [studentId], false))];
                    case 2:
                        // Update student trong bảng SINHVIEN
                        _a.sent();
                        // Return updated student
                        return [2 /*return*/, this.getStudentInfo(studentId)];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error updating student info:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, createStudent: function (studentData) {
        return __awaiter(this, void 0, void 0, function () {
            var studentId, createdStudent, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        studentId = "SV".concat(Date.now().toString().slice(-6));
                        // Insert student vào bảng SINHVIEN
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO SINHVIEN (\n                    MaSoSinhVien,\n                    HoTen,\n                    NgaySinh,\n                    GioiTinh,\n                    QueQuan,\n                    MaHuyen,\n                    MaDoiTuongUT,\n                    MaNganh,\n                    Email,\n                    SoDienThoai,\n                    DiaChi\n                ) VALUES (\n                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11\n                )\n            ", [
                                studentId,
                                studentData.fullName,
                                studentData.dateOfBirth,
                                studentData.gender,
                                studentData.hometown,
                                studentData.districtId,
                                studentData.priorityObjectId,
                                studentData.majorId,
                                studentData.email,
                                studentData.phone,
                                studentData.address
                            ])];
                    case 1:
                        // Insert student vào bảng SINHVIEN
                        _a.sent();
                        return [4 /*yield*/, this.getStudentInfo(studentId)];
                    case 2:
                        createdStudent = _a.sent();
                        if (!createdStudent) {
                            throw new Error('Failed to get created student');
                        }
                        return [2 /*return*/, createdStudent];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error creating student:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, deleteStudent: function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingStudent, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getStudentInfo(studentId)];
                    case 1:
                        existingStudent = _a.sent();
                        if (!existingStudent)
                            return [2 /*return*/, false];
                        // Delete student từ bảng SINHVIEN
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                DELETE FROM SINHVIEN \n                WHERE MaSoSinhVien = $1\n            ", [studentId])];
                    case 2:
                        // Delete student từ bảng SINHVIEN
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error deleting student:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, getAllStudents: function () {
        return __awaiter(this, void 0, void 0, function () {
            var students, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    s.MaSoSinhVien as \"studentId\",\n                    s.HoTen as \"fullName\",\n                    s.NgaySinh as \"dateOfBirth\",\n                    s.GioiTinh as \"gender\",\n                    s.QueQuan as \"hometown\",\n                    s.MaHuyen as \"districtId\",\n                    s.MaDoiTuongUT as \"priorityObjectId\",\n                    s.MaNganh as \"majorId\",\n                    s.Email as \"email\",\n                    s.SoDienThoai as \"phone\",\n                    s.DiaChi as \"address\",\n                    -- Th\u00EAm th\u00F4ng tin t\u00EAn ng\u00E0nh\n                    CASE \n                        WHEN s.MaNganh = 'CNPM' THEN 'C\u00F4ng ngh\u1EC7 ph\u1EA7n m\u1EC1m'\n                        WHEN s.MaNganh = 'KHMT' THEN 'Khoa h\u1ECDc m\u00E1y t\u00EDnh' \n                        WHEN s.MaNganh = 'HTTT' THEN 'H\u1EC7 th\u1ED1ng th\u00F4ng tin'\n                        WHEN s.MaNganh = 'CNTT' THEN 'C\u00F4ng ngh\u1EC7 th\u00F4ng tin'\n                        WHEN s.MaNganh = 'TMDT' THEN 'Th\u01B0\u01A1ng m\u1EA1i \u0111i\u1EC7n t\u1EED'\n                        WHEN s.MaNganh = 'KTPM' THEN 'K\u1EF9 thu\u1EADt ph\u1EA7n m\u1EC1m'\n                        WHEN s.MaNganh = 'VMC' THEN 'Vi\u1EC5n th\u00F4ng Multimedia'\n                        WHEN s.MaNganh = 'CNTT_Nhat' THEN 'C\u00F4ng ngh\u1EC7 th\u00F4ng tin (ti\u1EBFng Nh\u1EADt)'\n                        ELSE s.MaNganh\n                    END as \"majorName\"\n                FROM SINHVIEN s\n            ")];
                    case 1:
                        students = _a.sent();
                        return [2 /*return*/, students.map(function (student) { return ({
                                studentId: student.studentId,
                                fullName: student.fullName,
                                dateOfBirth: student.dateOfBirth,
                                gender: student.gender,
                                hometown: student.hometown,
                                districtId: student.districtId,
                                priorityObjectId: student.priorityObjectId,
                                majorId: student.majorId,
                                email: student.email,
                                phone: student.phone,
                                address: student.address,
                                majorName: student.majorName
                            }); })];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error getting all students:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
