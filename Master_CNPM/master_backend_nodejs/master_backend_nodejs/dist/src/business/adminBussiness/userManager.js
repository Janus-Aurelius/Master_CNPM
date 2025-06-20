"use strict";
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
exports.userManager = void 0;
var errorHandler_1 = require("../../middleware/errorHandler");
var DashboardService = __importStar(require("../../services/AdminService/dashboardService"));
var databaseService_1 = require("../../services/database/databaseService");
var UserManager = /** @class */ (function () {
    function UserManager() {
    }
    UserManager.prototype.getAllUsers = function () {
        return __awaiter(this, arguments, void 0, function (page, limit, filters) {
            var offset, whereConditions, queryParams, paramIndex, whereClause, totalCount, users, error_1;
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        offset = (page - 1) * limit;
                        whereConditions = [];
                        queryParams = [];
                        paramIndex = 1;
                        if (filters === null || filters === void 0 ? void 0 : filters.role) {
                            whereConditions.push("role = $".concat(paramIndex));
                            queryParams.push(filters.role);
                            paramIndex++;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.status) !== undefined) {
                            whereConditions.push("status = $".concat(paramIndex));
                            queryParams.push(filters.status);
                            paramIndex++;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.search) {
                            whereConditions.push("(name ILIKE $".concat(paramIndex, " OR email ILIKE $").concat(paramIndex, ")"));
                            queryParams.push("%".concat(filters.search, "%"));
                            paramIndex++;
                        }
                        whereClause = whereConditions.length > 0
                            ? "WHERE ".concat(whereConditions.join(' AND '))
                            : '';
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as total\n                FROM users\n                ".concat(whereClause, "\n            "), queryParams)];
                    case 1:
                        totalCount = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT *\n                FROM users\n                ".concat(whereClause, "\n                ORDER BY created_at DESC\n                LIMIT $").concat(paramIndex, " OFFSET $").concat(paramIndex + 1, "\n            "), __spreadArray(__spreadArray([], queryParams, true), [limit, offset], false))];
                    case 2:
                        users = _a.sent();
                        return [2 /*return*/, {
                                users: users,
                                total: parseInt((totalCount === null || totalCount === void 0 ? void 0 : totalCount.total) || '0'),
                                page: page,
                                totalPages: Math.ceil(parseInt((totalCount === null || totalCount === void 0 ? void 0 : totalCount.total) || '0') / limit)
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error getting users:', error_1);
                        throw new errorHandler_1.AppError(500, 'Error retrieving users');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM users WHERE id = $1\n            ", [id])];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user || null];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error getting user:', error_2);
                        throw new errorHandler_1.AppError(500, 'Error retrieving user');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT * FROM users WHERE email = $1\n            ", [userData.email])];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new errorHandler_1.AppError(400, 'Email already exists');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO users (name, email, role, status, created_at, updated_at)\n                VALUES ($1, $2, $3, $4, NOW(), NOW())\n                RETURNING *\n            ", [userData.name, userData.email, userData.role, userData.status])];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result[0]];
                    case 3:
                        error_3 = _a.sent();
                        if (error_3 instanceof errorHandler_1.AppError)
                            throw error_3;
                        console.error('Error creating user:', error_3);
                        throw new errorHandler_1.AppError(500, 'Error creating user');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.updateUser = function (id, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!userData.email) return [3 /*break*/, 2];
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                    SELECT * FROM users WHERE email = $1 AND id != $2\n                ", [userData.email, id])];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new errorHandler_1.AppError(400, 'Email already exists');
                        }
                        _a.label = 2;
                    case 2: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE users \n                SET \n                    name = COALESCE($1, name),\n                    email = COALESCE($2, email),\n                    role = COALESCE($3, role),\n                    status = COALESCE($4, status),\n                    updated_at = NOW()\n                WHERE id = $5\n                RETURNING *\n            ", [userData.name, userData.email, userData.role, userData.status, id])];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                    case 4:
                        error_4 = _a.sent();
                        if (error_4 instanceof errorHandler_1.AppError)
                            throw error_4;
                        console.error('Error updating user:', error_4);
                        throw new errorHandler_1.AppError(500, 'Error updating user');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        // Start transaction
                        return [4 /*yield*/, databaseService_1.DatabaseService.query('BEGIN')];
                    case 1:
                        // Start transaction
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, , 8]);
                        // Delete related records first
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    DELETE FROM user_sessions WHERE user_id = $1;\n                    DELETE FROM audit_logs WHERE user_id = $1;\n                    DELETE FROM enrollments WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1);\n                    DELETE FROM tuition_records WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1);\n                    DELETE FROM payment_receipts WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1);\n                    DELETE FROM students WHERE user_id = $1;\n                ", [id])];
                    case 3:
                        // Delete related records first
                        _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    DELETE FROM users WHERE id = $1 RETURNING *\n                ", [id])];
                    case 4:
                        result = _a.sent();
                        // Commit transaction
                        return [4 /*yield*/, databaseService_1.DatabaseService.query('COMMIT')];
                    case 5:
                        // Commit transaction
                        _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 6:
                        error_5 = _a.sent();
                        // Rollback on error
                        return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
                    case 7:
                        // Rollback on error
                        _a.sent();
                        throw error_5;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_6 = _a.sent();
                        console.error('Error deleting user:', error_6);
                        throw new errorHandler_1.AppError(500, 'Error deleting user and related data');
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.changeUserStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                UPDATE users \n                SET \n                    status = $1\n                WHERE id = $2\n                RETURNING *\n            ", [status, id])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error changing user status:', error_7);
                        throw new errorHandler_1.AppError(500, 'Error changing user status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.getDashboardStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userStats, systemStats, recentActivity, error_8;
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
                        error_8 = _a.sent();
                        console.error('Error fetching dashboard stats:', error_8);
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
            var configs, configMap_1, error_9;
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
                        error_9 = _c.sent();
                        console.error('Error fetching system config:', error_9);
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
            var settingType, settingValue, error_10;
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
                        error_10 = _a.sent();
                        console.error('Error updating system config:', error_10);
                        throw new errorHandler_1.AppError(500, 'Error updating system configuration');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.getAuditLogs = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var auditLogs, error_11;
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
                        error_11 = _a.sent();
                        console.error('Error fetching audit logs:', error_11);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.createAuditLog = function (userId, action, resource, details, ipAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO audit_logs (user_id, action, resource, details, ip_address, created_at)\n                VALUES ($1, $2, $3, $4, $5, NOW())\n            ", [userId, action, resource, details, ipAddress])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_12 = _a.sent();
                        console.error('Error creating audit log:', error_12);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserManager;
}());
exports.userManager = new UserManager();
