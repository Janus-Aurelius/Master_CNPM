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
exports.generateToken = exports.checkPasswordExpiry = exports.checkLoginAttempts = exports.checkIPRestriction = exports.authorizeRoles = exports.authenticateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var systemService_1 = require("../services/AdminService/systemService");
var errorHandler_1 = require("./errorHandler");
// Sử dụng biến môi trường hoặc giá trị mặc định
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Middleware để xác thực JWT token
var authenticateToken = function (req, res, next) {
    var _a;
    try {
        var authHeader = req.headers['authorization'];
        var token = (authHeader && authHeader.split(' ')[1]) ||
            ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Yêu cầu đăng nhập'
            });
            return;
        }
        // Xác thực token
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Validate payload
        if (!decoded.id || !decoded.role || !decoded.username) {
            res.status(403).json({
                success: false,
                message: 'Token không hợp lệ'
            });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Lỗi xác thực token:', error);
        res.status(403).json({
            success: false,
            message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn'
        });
    }
};
exports.authenticateToken = authenticateToken;
// Middleware để kiểm tra vai trò
var authorizeRoles = function (roles) {
    return function (req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'Yêu cầu đăng nhập'
                });
                return;
            }
            if (!roles.includes(req.user.role)) {
                res.status(403).json({
                    success: false,
                    message: 'Bạn không có quyền truy cập chức năng này'
                });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Lỗi phân quyền:', error);
            res.status(500).json({
                success: false,
                message: 'Đã có lỗi xảy ra khi kiểm tra quyền'
            });
        }
    };
};
exports.authorizeRoles = authorizeRoles;
var checkIPRestriction = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var config, allowedIPs, clientIP;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, systemService_1.securityService.getSecuritySettings()];
            case 1:
                config = _a.sent();
                if (config.ipRestriction) {
                    allowedIPs = Array.isArray(config.allowedIPs) ? config.allowedIPs : [];
                    clientIP = req.ip || req.connection.remoteAddress;
                    if (!allowedIPs.includes(clientIP)) {
                        return [2 /*return*/, res.status(403).json({ success: false, message: 'IP của bạn không được phép đăng nhập' })];
                    }
                }
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.checkIPRestriction = checkIPRestriction;
var checkLoginAttempts = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, systemService_1.securityService.getSecuritySettings()];
            case 1:
                config = _a.sent();
                if (req.user) {
                    if (req.user.failed_login_attempts >= config.loginAttempts) {
                        throw new errorHandler_1.AppError(403, 'Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần');
                    }
                }
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.checkLoginAttempts = checkLoginAttempts;
var checkPasswordExpiry = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var config, user, lastChange, daysSinceChange;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, systemService_1.securityService.getSecuritySettings()];
            case 1:
                config = _a.sent();
                if (config.passwordExpiry > 0) {
                    user = req.user;
                    if (user) {
                        lastChange = user.last_password_change || user.created_at;
                        daysSinceChange = (Date.now() - new Date(lastChange).getTime()) / (1000 * 60 * 60 * 24);
                        if (daysSinceChange > config.passwordExpiry) {
                            throw new errorHandler_1.AppError(403, 'Mật khẩu đã hết hạn, vui lòng đổi mật khẩu');
                        }
                    }
                }
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.checkPasswordExpiry = checkPasswordExpiry;
var generateToken = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
    var securityConfig, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, systemService_1.securityService.getSecuritySettings()];
            case 1:
                securityConfig = _a.sent();
                token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: securityConfig.sessionTimeout * 60 });
                return [2 /*return*/, token];
        }
    });
}); };
exports.generateToken = generateToken;
