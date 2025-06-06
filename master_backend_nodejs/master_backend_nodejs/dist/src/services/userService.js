"use strict";
// src/services/userService.ts
/**
 * Mock User Service
 *
 * Trong môi trường production thực tế, service này sẽ kết nối với database
 * để lấy và lưu thông tin người dùng. Đối với đồ án nhỏ, chúng ta sử dụng
 * mock data để đơn giản hóa.
 */
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
exports.isTokenBlacklisted = exports.blacklistToken = exports.getUserById = exports.getUserByEmail = void 0;
// Mock user database - Quyền được xác định dựa trên email
var users = [
    {
        id: 1,
        email: 'student@uit.edu.vn',
        name: 'Nguyễn Văn A',
        role: 'student', // Sinh viên
        passwordHash: 'password' // Trong thực tế, đây phải là mật khẩu đã hash
    },
    {
        id: 2,
        email: 'financial@uit.edu.vn',
        name: 'Trần Thị B',
        role: 'financial', // Phòng tài chính
        passwordHash: 'password'
    },
    {
        id: 3,
        email: 'academic@uit.edu.vn',
        name: 'Lê Văn C',
        role: 'academic', // Phòng đào tạo
        passwordHash: 'password'
    },
    {
        id: 4,
        email: 'admin@uit.edu.vn',
        name: 'Phạm Quang D',
        role: 'admin', // Quản trị viên
        passwordHash: 'password'
    },
    // Thêm nhiều người dùng với các vai trò khác nhau để kiểm tra
    {
        id: 5,
        email: 'student123@uit.edu.vn',
        name: 'Hoàng Thị E',
        role: 'student',
        passwordHash: 'password'
    },
];
// Token blacklist để quản lý đăng xuất
var tokenBlacklist = new Set();
/**
 * Lấy thông tin người dùng theo email
 */
var getUserByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = users.find(function (u) { return u.email === email; });
        return [2 /*return*/, user || null];
    });
}); };
exports.getUserByEmail = getUserByEmail;
/**
 * Lấy thông tin người dùng theo ID
 */
var getUserById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = users.find(function (u) { return u.id === id; });
        return [2 /*return*/, user || null];
    });
}); };
exports.getUserById = getUserById;
/**
 * Thêm token vào blacklist khi đăng xuất
 */
var blacklistToken = function (token) {
    tokenBlacklist.add(token);
};
exports.blacklistToken = blacklistToken;
/**
 * Kiểm tra xem token có trong blacklist không
 */
var isTokenBlacklisted = function (token) {
    return tokenBlacklist.has(token);
};
exports.isTokenBlacklisted = isTokenBlacklisted;
