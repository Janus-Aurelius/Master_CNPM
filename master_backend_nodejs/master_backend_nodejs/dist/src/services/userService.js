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
exports.isTokenBlacklisted = exports.blacklistToken = exports.verifyPassword = exports.getUserById = exports.getUserByEmail = void 0;
// User Service for master_cnpm database
var databaseService_1 = require("./database/databaseService");
var bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * User Service adapted for final_cnpm database structure
 */
// Token blacklist để quản lý đăng xuất
var tokenBlacklist = new Set();
/**
 * Map database roles to application roles
 */
var roleMapping = {
    'admin': 'admin',
    'academic': 'academic',
    'student': 'student',
    'financial': 'financial'
};
/**
 * Get user by email from master_cnpm database
 */
var getUserByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var dbUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                u.id,\n                u.email,\n                u.name,\n                u.password,\n                u.role,\n                u.status\n            FROM users u\n            WHERE u.email = $1\n        ", [email])];
            case 1:
                dbUser = _a.sent();
                if (dbUser) {
                    return [2 /*return*/, {
                            id: dbUser.id,
                            email: dbUser.email,
                            name: dbUser.name,
                            role: dbUser.role,
                            passwordHash: dbUser.password,
                            status: dbUser.status
                        }];
                }
                return [2 /*return*/, null];
            case 2:
                error_1 = _a.sent();
                console.error('Database error in getUserByEmail:', error_1);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserByEmail = getUserByEmail;
/**
 * Get user by ID from master_cnpm database
 */
var getUserById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var dbUser, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT \n                u.id,\n                u.email,\n                u.name,\n                u.password,\n                u.role,\n                u.status\n            FROM users u\n            WHERE u.id = $1\n        ", [id])];
            case 1:
                dbUser = _a.sent();
                if (dbUser) {
                    return [2 /*return*/, {
                            id: dbUser.id,
                            email: dbUser.email,
                            name: dbUser.name,
                            role: dbUser.role,
                            passwordHash: dbUser.password,
                            status: dbUser.status
                        }];
                }
                return [2 /*return*/, null];
            case 2:
                error_2 = _a.sent();
                console.error('Database error in getUserById:', error_2);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserById = getUserById;
/**
 * Verify password - check if it's plain text or hashed
 */
var verifyPassword = function (inputPassword, storedPassword) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
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
                error_3 = _a.sent();
                console.error('Password verification error:', error_3);
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
