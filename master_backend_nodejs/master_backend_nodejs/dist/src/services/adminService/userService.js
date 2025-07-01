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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersByName = exports.updateStudentInfo = exports.updateStudentDepartment = exports.getLastUser = exports.updateSystemConfig = exports.getDashboardStats = exports.getSystemConfigs = exports.changeUserStatus = exports.deleteUser = exports.updateUser = exports.createUser = exports.getStudentById = exports.getUserCount = exports.getAllUsers = exports.isTokenBlacklisted = exports.blacklistToken = exports.verifyPassword = exports.getUserById = exports.getUserByUsername = exports.getUserByEmail = void 0;
// User Service for master_cnpm database
var databaseService_1 = require("../database/databaseService");
var bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * User Service adapted for final_cnpm database structure
 */
// Token blacklist để quản lý đăng xuất
var tokenBlacklist = new Set();
/**
 * Get user by email from master_cnpm database
 */
var getUserByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var username;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = email.split('@')[0];
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT * FROM NGUOIDUNG WHERE TenDangNhap = $1", [username])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getUserByEmail = getUserByEmail;
/**
 * Get user by TenDangNhap (username/email) from master_cnpm database
 */
var getUserByUsername = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT * FROM NGUOIDUNG WHERE TenDangNhap = $1", [username])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getUserByUsername = getUserByUsername;
/**
 * Get user by UserID from master_cnpm database
 */
var getUserById = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT * FROM NGUOIDUNG WHERE MaSoSinhVien = $1", [userId])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getUserById = getUserById;
/**
 * Verify password - check if it's plain text or hashed
 */
var verifyPassword = function (inputPassword, storedPassword) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!storedPassword.startsWith('$2b$')) return [3 /*break*/, 2];
                return [4 /*yield*/, bcrypt_1.default.compare(inputPassword, storedPassword)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: 
            // Plain text comparison for existing data
            return [2 /*return*/, inputPassword === storedPassword];
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error('Password verification error:', error_1);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.verifyPassword = verifyPassword;
// Token blacklist functions
var blacklistToken = function (token) {
    tokenBlacklist.add(token);
};
exports.blacklistToken = blacklistToken;
var isTokenBlacklisted = function (token) {
    return tokenBlacklist.has(token);
};
exports.isTokenBlacklisted = isTokenBlacklisted;
var getAllUsers = function (whereClause, queryParams, limit, offset) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('Query params:', queryParams);
                console.log('Where clause:', whereClause);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT\n                nguoidung.UserID AS id,\n                COALESCE(sinhvien.HoTen, nguoidung.TenDangNhap) AS name,\n                nguoidung.TenDangNhap AS studentId,\n                nguoidung.MaNhom AS role,\n                nguoidung.TrangThai AS status,\n                COALESCE(khoa.TenKhoa, 'Ph\u00F2ng ban') AS department\n            FROM NGUOIDUNG nguoidung\n            LEFT JOIN SINHVIEN sinhvien ON nguoidung.MaSoSinhVien = sinhvien.MaSoSinhVien\n            LEFT JOIN NGANHHOC nganh ON sinhvien.MaNganh = nganh.MaNganh\n            LEFT JOIN KHOA khoa ON nganh.MaKhoa = khoa.MaKhoa\n            ".concat(whereClause, "\n            ORDER BY nguoidung.UserID DESC\n            LIMIT $").concat(queryParams.length + 1, " OFFSET $").concat(queryParams.length + 2, "\n        "), __spreadArray(__spreadArray([], queryParams, true), [limit, offset], false))];
            case 1:
                result = _a.sent();
                console.log('Query result:', result);
                return [2 /*return*/, result];
            case 2:
                error_2 = _a.sent();
                console.error('Error in getAllUsers:', error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var getUserCount = function (whereClause, queryParams) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT COUNT(*) as total \n             FROM NGUOIDUNG nguoidung\n             LEFT JOIN SINHVIEN sinhvien ON nguoidung.MaSoSinhVien = sinhvien.MaSoSinhVien\n             LEFT JOIN NGANHHOC nganh ON sinhvien.MaNganh = nganh.MaNganh\n             LEFT JOIN KHOA khoa ON nganh.MaKhoa = khoa.MaKhoa\n             ".concat(whereClause), queryParams)];
            case 1:
                result = _a.sent();
                console.log('Count result:', result);
                return [2 /*return*/, result];
            case 2:
                error_3 = _a.sent();
                console.error('Error in getUserCount:', error_3);
                throw error_3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserCount = getUserCount;
var getStudentById = function (studentId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("SELECT MaSoSinhVien FROM SINHVIEN WHERE MaSoSinhVien = $1", [studentId])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getStudentById = getStudentById;
var createUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("INSERT INTO NGUOIDUNG (TenDangNhap, UserID, MatKhau, MaNhom, MaSoSinhVien, TrangThai)\n         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [user.username, user.userId, user.password, user.role, user.studentId || null, user.status || 'active'])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.createUser = createUser;
var updateUser = function (id, user) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("UPDATE NGUOIDUNG \n         SET TrangThai = COALESCE($1, TrangThai)\n         WHERE UserID = $2\n         RETURNING *", [user.status, id])];
            case 1: 
            // Chỉ update các trường cho phép
            return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateUser = updateUser;
var deleteUser = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var userQuery, userResult, maSoSinhVien, result, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 9]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query('BEGIN')];
            case 1:
                _b.sent();
                userQuery = "\n            SELECT MaSoSinhVien \n            FROM NGUOIDUNG \n            WHERE UserID = $1\n        ";
                return [4 /*yield*/, databaseService_1.DatabaseService.query(userQuery, [id])];
            case 2:
                userResult = _b.sent();
                maSoSinhVien = (_a = userResult[0]) === null || _a === void 0 ? void 0 : _a.MaSoSinhVien;
                if (!maSoSinhVien) return [3 /*break*/, 4];
                // Xóa các phiếu đăng ký liên quan
                return [4 /*yield*/, databaseService_1.DatabaseService.query('DELETE FROM PHIEUDANGKY WHERE MaSoSinhVien = $1', [maSoSinhVien])];
            case 3:
                // Xóa các phiếu đăng ký liên quan
                _b.sent();
                _b.label = 4;
            case 4: return [4 /*yield*/, databaseService_1.DatabaseService.query('DELETE FROM NGUOIDUNG WHERE UserID = $1 RETURNING *', [id])];
            case 5:
                result = _b.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.query('COMMIT')];
            case 6:
                _b.sent();
                return [2 /*return*/, result];
            case 7:
                error_4 = _b.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
            case 8:
                _b.sent();
                console.error('Error in deleteUser:', error_4);
                throw error_4;
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var changeUserStatus = function (id, status) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("UPDATE NGUOIDUNG SET TrangThai = $1 WHERE id = $2 RETURNING *", [status, id])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.changeUserStatus = changeUserStatus;
var getSystemConfigs = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        SELECT setting_key, setting_value, setting_type \n        FROM system_settings \n        WHERE setting_key IN (\n            'max_users', 'allowed_domains', 'password_min_length',\n            'password_require_numbers', 'password_require_special_chars',\n            'session_timeout', 'maintenance_mode', 'backup_frequency'\n        )\n    ")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getSystemConfigs = getSystemConfigs;
var getDashboardStats = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n        SELECT \n            (SELECT COUNT(*) FROM NGUOIDUNG WHERE MaNhom = 'N3') as \"totalStudents\",\n            (SELECT COUNT(*) FROM PHIEUDANGKY WHERE SoTienConLai > 0) as \"pendingPayments\",\n            (SELECT COUNT(*) FROM PHIEUDANGKY WHERE NgayLap >= CURRENT_DATE - INTERVAL '7 days') as \"newRegistrations\",\n            (SELECT COUNT(*) FROM AUDIT_LOGS WHERE action_type = 'ERROR' AND created_at >= CURRENT_DATE - INTERVAL '7 days') as \"systemAlerts\"\n    ")];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getDashboardStats = getDashboardStats;
var updateSystemConfig = function (configKey, settingValue, settingType) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n        VALUES ($1, $2, $3, NOW())\n        ON CONFLICT (setting_key) \n        DO UPDATE SET \n            setting_value = EXCLUDED.setting_value,\n            setting_type = EXCLUDED.setting_type,\n            updated_at = NOW()\n    ", [configKey, settingValue, settingType])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateSystemConfig = updateSystemConfig;
var getLastUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne('SELECT UserID FROM NGUOIDUNG ORDER BY UserID DESC LIMIT 1')];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getLastUser = getLastUser;
var updateStudentDepartment = function (studentId, newMajorId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("UPDATE SINHVIEN SET MaNganh = $1 WHERE MaSoSinhVien = $2 RETURNING *", [newMajorId, studentId])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateStudentDepartment = updateStudentDepartment;
var updateStudentInfo = function (studentId, name, majorId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("UPDATE SINHVIEN SET HoTen = $1, MaNganh = $2 WHERE LOWER(MaSoSinhVien) = LOWER($3) RETURNING *", [name, majorId, studentId])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateStudentInfo = updateStudentInfo;
var searchUsersByName = function (searchTerm) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT DISTINCT\n                nguoidung.UserID AS id,\n                COALESCE(sinhvien.HoTen, nguoidung.TenDangNhap) AS name,\n                nguoidung.TenDangNhap AS studentId,\n                nguoidung.MaNhom AS role,\n                nguoidung.TrangThai AS status,\n                COALESCE(khoa.TenKhoa, 'Ph\u00F2ng ban') AS department\n            FROM NGUOIDUNG nguoidung\n            LEFT JOIN SINHVIEN sinhvien ON nguoidung.MaSoSinhVien = sinhvien.MaSoSinhVien\n            LEFT JOIN NGANHHOC nganh ON sinhvien.MaNganh = nganh.MaNganh\n            LEFT JOIN KHOA khoa ON nganh.MaKhoa = khoa.MaKhoa\n            WHERE LOWER(sinhvien.HoTen) LIKE LOWER($1)\n            LIMIT 10\n        ", ["%".concat(searchTerm, "%")])];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_5 = _a.sent();
                console.error('Error in searchUsersByName:', error_5);
                throw error_5;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.searchUsersByName = searchUsersByName;
