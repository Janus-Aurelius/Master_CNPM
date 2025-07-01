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
exports.me = exports.refreshToken = exports.logout = exports.login = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var userService_1 = require("../services/AdminService/userService");
var database_1 = require("../config/database");
var config_1 = require("../config");
var maintenanceManager_1 = require("../business/AdminBussiness/maintenanceManager");
var JWT_SECRET = config_1.config.jwtSecret;
var JWT_EXPIRES = '24h';
// Map database group codes to roles
var GROUP_TO_ROLE = {
    'N1': 'admin',
    'N2': 'academic',
    'N3': 'student',
    'N4': 'financial'
};
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, result_1, user_1, result, user, userId, userUsername, studentId, groupCode, isPasswordValid, role, token, refreshToken_1, redirectUrl, responseData, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                console.log('=== Login Request ===');
                console.log('Request body:', req.body);
                _a = req.body, username = _a.username, password = _a.password;
                if (!maintenanceManager_1.maintenanceManager.isInMaintenanceMode()) return [3 /*break*/, 2];
                return [4 /*yield*/, database_1.Database.query('SELECT * FROM NGUOIDUNG WHERE TenDangNhap = $1', [username])];
            case 1:
                result_1 = _b.sent();
                user_1 = result_1[0];
                if (!user_1 || user_1.manhom !== 'N1') {
                    return [2 /*return*/, res.status(503).json({
                            success: false,
                            message: 'Hệ thống đang trong quá trình bảo trì. Chỉ admin mới có thể đăng nhập.'
                        })];
                }
                _b.label = 2;
            case 2:
                if (!username || !password) {
                    console.log('Missing username or password');
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'
                        })];
                }
                console.log('Attempting database connection...');
                return [4 /*yield*/, database_1.Database.query('SELECT * FROM NGUOIDUNG WHERE TenDangNhap = $1', [username])];
            case 3:
                result = _b.sent();
                console.log('Database query result:', result);
                console.log('📋 Raw user object from DB:', JSON.stringify(result[0], null, 2));
                user = result[0];
                if (!user) {
                    console.log('User not found:', username);
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Tên đăng nhập không tồn tại'
                        })];
                }
                console.log('🔍 User fields:', {
                    UserID: user.UserID || user.userid,
                    TenDangNhap: user.TenDangNhap || user.tendangnhap,
                    MaSoSinhVien: user.MaSoSinhVien || user.masosinhvien,
                    MaNhom: user.MaNhom || user.manhom
                });
                userId = user.UserID || user.userid;
                userUsername = user.TenDangNhap || user.tendangnhap;
                studentId = user.MaSoSinhVien || user.masosinhvien;
                groupCode = user.MaNhom || user.manhom;
                // Check account status first
                if ((user.TrangThai || user.trangthai) !== 'active') {
                    return [2 /*return*/, res.status(403).json({
                            success: false,
                            message: 'Tài khoản đã bị vô hiệu hóa'
                        })];
                }
                isPasswordValid = password === (user.MatKhau || user.matkhau);
                console.log('Password validation:', {
                    isPasswordValid: isPasswordValid,
                    providedPassword: password,
                    storedPassword: user.MatKhau || user.matkhau
                });
                if (!isPasswordValid) {
                    console.log('Invalid password for user:', username);
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Mật khẩu không đúng'
                        })];
                }
                role = GROUP_TO_ROLE[groupCode] || 'unknown';
                console.log('Mapped role:', { groupCode: groupCode, role: role });
                console.log('Generating JWT tokens...');
                token = jsonwebtoken_1.default.sign({
                    id: userId,
                    username: userUsername,
                    role: role
                }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
                refreshToken_1 = jsonwebtoken_1.default.sign({
                    id: userId,
                    username: userUsername,
                    role: role
                }, JWT_SECRET + '_refresh', { expiresIn: '7d' });
                redirectUrl = '/';
                switch (role) {
                    case 'admin':
                        redirectUrl = '/admin';
                        break;
                    case 'academic':
                        redirectUrl = '/academic';
                        break;
                    case 'student':
                        redirectUrl = '/student';
                        break;
                    case 'financial':
                        redirectUrl = '/financial';
                        break;
                }
                console.log('Login successful:', {
                    username: userUsername,
                    role: role,
                    redirectUrl: redirectUrl
                });
                responseData = {
                    success: true,
                    message: 'Đăng nhập thành công',
                    data: {
                        user: {
                            id: userId,
                            username: userUsername,
                            role: role,
                            studentId: studentId
                        },
                        token: token,
                        refreshToken: refreshToken_1,
                        redirectUrl: redirectUrl
                    }
                };
                console.log('🎯 Backend sending response:', JSON.stringify(responseData, null, 2));
                console.log('👤 User object being sent:', responseData.data.user);
                res.json(responseData);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error('=== Login Error ===');
                console.error('Error details:', error_1);
                console.error('Error stack:', error_1 instanceof Error ? error_1.stack : 'No stack trace');
                res.status(500).json({
                    success: false,
                    message: 'Đã có lỗi xảy ra khi đăng nhập',
                    error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token;
    var _a;
    return __generator(this, function (_b) {
        try {
            token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (token) {
                (0, userService_1.blacklistToken)(token);
            }
            res.json({
                success: true,
                message: 'Đăng xuất thành công'
            });
        }
        catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server nội bộ'
            });
        }
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
var refreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken_2, decoded, user, newToken, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                refreshToken_2 = req.body.refreshToken;
                if (!refreshToken_2) {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Refresh token không được cung cấp'
                        })];
                }
                decoded = jsonwebtoken_1.default.verify(refreshToken_2, JWT_SECRET + '_refresh');
                return [4 /*yield*/, (0, userService_1.getUserById)(decoded.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Người dùng không tồn tại'
                        })];
                }
                newToken = jsonwebtoken_1.default.sign({
                    id: user.userId,
                    email: user.email,
                    role: user.role
                }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
                res.json({
                    success: true,
                    token: newToken
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Refresh token error:', error_2);
                res.status(401).json({
                    success: false,
                    message: 'Refresh token không hợp lệ'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = refreshToken;
var me = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, userService_1.getUserById)(((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString()) || '')];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({
                            success: false,
                            message: 'Người dùng không tồn tại'
                        })];
                }
                res.json({
                    success: true,
                    user: {
                        id: user.userId,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        status: user.status
                    }
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _c.sent();
                console.error('Get user info error:', error_3);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server nội bộ'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.me = me;
