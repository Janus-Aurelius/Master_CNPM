"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Sử dụng biến môi trường hoặc giá trị mặc định
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Middleware để xác thực JWT token
var authenticateToken = function (req, res, next) {
    var _a;
    try {
        // Lấy token từ header Authorization hoặc cookie (hỗ trợ cả hai)
        var authHeader = req.headers['authorization'];
        var token = (authHeader && authHeader.split(' ')[1]) || // Bearer TOKEN
            ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.auth_token); // Hỗ trợ cookie
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Yêu cầu đăng nhập'
            });
            return;
        }
        // Xác thực token
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
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
