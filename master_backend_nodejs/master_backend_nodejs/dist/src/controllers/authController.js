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
var userService_1 = require("../services/userService");
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
var JWT_EXPIRES = '24h';
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid, redirectMap, redirectUrl, token, refreshToken_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                // Validate input
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Tên đăng nhập và mật khẩu không được để trống'
                        })];
                }
                return [4 /*yield*/, (0, userService_1.getUserByEmail)(email)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Thông tin đăng nhập không đúng'
                        })];
                }
                return [4 /*yield*/, (0, userService_1.verifyPassword)(password, user.passwordHash)];
            case 2:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Thông tin đăng nhập không đúng'
                        })];
                }
                redirectMap = {
                    'student': '/student',
                    'financial': '/financial',
                    'academic': '/academic',
                    'admin': '/admin'
                };
                redirectUrl = redirectMap[user.role] || '/';
                token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    studentId: user.studentId
                }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
                refreshToken_1 = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
                console.log("\u2705 User logged in: ".concat(user.email, " (").concat(user.role, ")"));
                res.json({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        studentId: user.studentId,
                        groupName: user.groupName
                    },
                    token: token,
                    refreshToken: refreshToken_1,
                    redirectUrl: redirectUrl
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('Login error:', error_1);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server nội bộ'
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
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
                decoded = jsonwebtoken_1.default.verify(refreshToken_2, JWT_SECRET);
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
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    studentId: user.studentId
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
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        studentId: user.studentId,
                        groupName: user.groupName
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
