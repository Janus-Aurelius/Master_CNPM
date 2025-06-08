"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.userManager = void 0;
var UserService_1 = __importDefault(require("../../services/adminService/UserService"));
var errorHandler_1 = require("../../middleware/errorHandler");
var DashboardService = __importStar(require("../../services/adminService/dashboardService"));
var databaseService_1 = require("../../services/database/databaseService");
var UserManager = /** @class */ (function () {
    function UserManager() {
    }
    UserManager.prototype.getAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, UserService_1.default.getAllUsers()];
            });
        });
    };
    UserManager.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, UserService_1.default.getUserById(id)];
            });
        });
    };
    UserManager.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, UserService_1.default.getAllUsers()];
                    case 1:
                        existingUsers = _a.sent();
                        if (existingUsers.some(function (user) { return user.email === userData.email; })) {
                            throw new errorHandler_1.AppError(400, 'Email already exists');
                        }
                        return [2 /*return*/, UserService_1.default.createUser(__assign(__assign({}, userData), { createdAt: new Date(), updatedAt: new Date() }))];
                }
            });
        });
    };
    UserManager.prototype.updateUser = function (id, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, UserService_1.default.getAllUsers()];
                    case 1:
                        existingUsers = _a.sent();
                        if (userData.email && existingUsers.some(function (user) { return user.email === userData.email && user.id !== id; })) {
                            throw new errorHandler_1.AppError(400, 'Email already exists');
                        }
                        return [2 /*return*/, UserService_1.default.updateUser(id, userData)];
                }
            });
        });
    };
    UserManager.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, UserService_1.default.deleteUser(id)];
            });
        });
    };
    UserManager.prototype.changeUserStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, UserService_1.default.updateUser(id, { status: status })];
            });
        });
    };
    UserManager.prototype.getDashboardStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userStats, systemStats, recentActivity, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 6]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    COUNT(*) as total_users,\n                    COUNT(CASE WHEN status = true THEN 1 END) as active_users,\n                    COUNT(CASE WHEN status = false THEN 1 END) as inactive_users,\n                    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,\n                    COUNT(CASE WHEN role = 'academic_staff' THEN 1 END) as academic_staff,\n                    COUNT(CASE WHEN role = 'financial_staff' THEN 1 END) as financial_staff,\n                    COUNT(CASE WHEN role = 'student' THEN 1 END) as students\n                FROM users\n            ")];
                    case 1:
                        userStats = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT \n                    COUNT(DISTINCT student_id) as total_students,\n                    COUNT(DISTINCT subject_code) as total_subjects,\n                    COUNT(*) as total_courses\n                FROM open_courses\n            ")];
                    case 2:
                        systemStats = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    'user_created' as type,\n                    'New user: ' || name || ' (' || role || ')' as description,\n                    created_at as timestamp,\n                    'System' as user\n                FROM users \n                WHERE created_at >= NOW() - INTERVAL '7 days'\n                ORDER BY created_at DESC\n                LIMIT 5\n            ")];
                    case 3:
                        recentActivity = _a.sent();
                        return [2 /*return*/, {
                                userStatistics: userStats || {
                                    total_users: 0,
                                    active_users: 0,
                                    inactive_users: 0,
                                    admin_users: 0,
                                    academic_staff: 0,
                                    financial_staff: 0,
                                    students: 0
                                },
                                systemStatistics: systemStats || {
                                    total_students: 0,
                                    total_subjects: 0,
                                    total_courses: 0
                                },
                                recentActivity: recentActivity || [],
                                systemHealth: {
                                    databaseStatus: 'healthy',
                                    serverUptime: process.uptime(),
                                    memoryUsage: process.memoryUsage(),
                                    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                                }
                            }];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error fetching dashboard stats:', error_1);
                        return [4 /*yield*/, DashboardService.getDashboardStats()];
                    case 5: 
                    // Fallback to service call
                    return [2 /*return*/, _a.sent()];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.getSystemConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configs, configMap_1, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT setting_key, setting_value, setting_type \n                FROM system_settings \n                WHERE setting_key IN (\n                    'max_users', 'allowed_domains', 'password_min_length',\n                    'password_require_numbers', 'password_require_special_chars',\n                    'session_timeout', 'maintenance_mode', 'backup_frequency'\n                )\n            ")];
                    case 1:
                        configs = _c.sent();
                        configMap_1 = {};
                        configs.forEach(function (config) {
                            var value = config.setting_value;
                            if (config.setting_type === 'number') {
                                value = parseInt(value, 10);
                            }
                            else if (config.setting_type === 'boolean') {
                                value = value === 'true';
                            }
                            else if (config.setting_type === 'json') {
                                value = JSON.parse(value);
                            }
                            configMap_1[config.setting_key] = value;
                        });
                        return [2 /*return*/, {
                                maxUsers: configMap_1.max_users || 1000,
                                allowedDomains: configMap_1.allowed_domains || ['@example.com', '@admin.com'],
                                passwordPolicy: {
                                    minLength: configMap_1.password_min_length || 8,
                                    requireNumbers: (_a = configMap_1.password_require_numbers) !== null && _a !== void 0 ? _a : true,
                                    requireSpecialChars: (_b = configMap_1.password_require_special_chars) !== null && _b !== void 0 ? _b : true
                                },
                                sessionTimeout: configMap_1.session_timeout || 3600,
                                maintenanceMode: configMap_1.maintenance_mode || false,
                                backupFrequency: configMap_1.backup_frequency || 'daily'
                            }];
                    case 2:
                        error_2 = _c.sent();
                        console.error('Error fetching system config:', error_2);
                        // Fallback to default config
                        return [2 /*return*/, {
                                maxUsers: 1000,
                                allowedDomains: ['@example.com', '@admin.com'],
                                passwordPolicy: {
                                    minLength: 8,
                                    requireNumbers: true,
                                    requireSpecialChars: true
                                },
                                sessionTimeout: 3600,
                                maintenanceMode: false, backupFrequency: 'daily'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.updateSystemConfig = function (configKey, configValue) {
        return __awaiter(this, void 0, void 0, function () {
            var settingType, settingValue, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        settingType = 'string';
                        settingValue = configValue;
                        if (typeof configValue === 'number') {
                            settingType = 'number';
                            settingValue = configValue.toString();
                        }
                        else if (typeof configValue === 'boolean') {
                            settingType = 'boolean';
                            settingValue = configValue.toString();
                        }
                        else if (typeof configValue === 'object') {
                            settingType = 'json';
                            settingValue = JSON.stringify(configValue);
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ($1, $2, $3, NOW())\n                ON CONFLICT (setting_key) \n                DO UPDATE SET \n                    setting_value = EXCLUDED.setting_value,\n                    setting_type = EXCLUDED.setting_type,\n                    updated_at = NOW()\n            ", [configKey, settingValue, settingType])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: 'System configuration updated successfully' }];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error updating system config:', error_3);
                        throw new errorHandler_1.AppError(500, 'Error updating system configuration');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.getAuditLogs = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var auditLogs, error_4;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    id,\n                    user_id,\n                    action,\n                    resource,\n                    details,\n                    ip_address,\n                    created_at\n                FROM audit_logs \n                ORDER BY created_at DESC \n                LIMIT $1\n            ", [limit])];
                    case 1:
                        auditLogs = _a.sent();
                        return [2 /*return*/, auditLogs || []];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error fetching audit logs:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.createAuditLog = function (userId, action, resource, details, ipAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO audit_logs (user_id, action, resource, details, ip_address, created_at)\n                VALUES ($1, $2, $3, $4, $5, NOW())\n            ", [userId, action, resource, details, ipAddress])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error creating audit log:', error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserManager;
}());
exports.userManager = new UserManager();
