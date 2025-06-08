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
exports.refreshToken = exports.verifyToken = exports.logout = exports.login = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var userService_1 = require("../services/userService");
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
var JWT_EXPIRES = '24h';
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordValid, redirectMap, redirectUrl, token, refreshToken_1, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password;
                // Bỏ qua trường role từ frontend (nếu có)
                // Kiểm tra email
                if (!email) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Email không được để trống'
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
                } // Verify password using bcrypt
                isPasswordValid = false;
                if (!user.passwordHash.startsWith('$2b$')) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.passwordHash)];
            case 2:
                // Database user with hashed password
                isPasswordValid = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                // Mock user with plain text password (for development)
                isPasswordValid = password === user.passwordHash;
                _b.label = 4;
            case 4:
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
                token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
                refreshToken_1 = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
                // Trả về thông tin người dùng và token
                res.status(200).json({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    },
                    token: token,
                    refreshToken: refreshToken_1,
                    redirectUrl: redirectUrl // Trả về đường dẫn chuyển hướng để frontend có thể redirect
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error('Login error:', error_1);
                res.status(500).json({
                    success: false,
                    message: 'Đã có lỗi xảy ra khi đăng nhập'
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res) {
    try {
        // Lấy token từ header
        var authHeader = req.headers['authorization'];
        var token = authHeader && authHeader.split(' ')[1];
        // Thêm token vào blacklist nếu có
        if (token) {
            (0, userService_1.blacklistToken)(token);
        }
        res.status(200).json({
            success: true,
            message: 'Đăng xuất thành công'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra khi đăng xuất'
        });
    }
};
exports.logout = logout;
var verifyToken = function (req, res) {
    try {
        // Token đã được xác thực trong middleware authenticateToken
        var user = req.user;
        res.status(200).json({
            success: true,
            valid: true,
            user: user
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            valid: false
        });
    }
};
exports.verifyToken = verifyToken;
var refreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshTokenValue, decoded, user, newToken, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                refreshTokenValue = req.body.refreshToken;
                if (!refreshTokenValue) {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: 'Refresh token không được để trống'
                        })];
                }
                // Kiểm tra token có trong blacklist không
                if ((0, userService_1.isTokenBlacklisted)(refreshTokenValue)) {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Refresh token đã hết hạn hoặc đã bị vô hiệu hóa'
                        })];
                }
                decoded = jsonwebtoken_1.default.verify(refreshTokenValue, JWT_SECRET);
                return [4 /*yield*/, (0, userService_1.getUserById)(decoded.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({
                            success: false,
                            message: 'Refresh token không hợp lệ'
                        })];
                }
                newToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
                res.status(200).json({
                    success: true,
                    token: newToken
                });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Refresh token error:', error_2);
                res.status(401).json({
                    success: false,
                    message: 'Refresh token không hợp lệ hoặc đã hết hạn'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.refreshToken = refreshToken;
