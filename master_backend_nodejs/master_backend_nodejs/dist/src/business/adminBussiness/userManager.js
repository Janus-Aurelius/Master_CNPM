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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userManager = void 0;
var errorHandler_1 = require("../../middleware/errorHandler");
var userService = __importStar(require("../../services/AdminService/userService"));
var UserManager = /** @class */ (function () {
    function UserManager() {
    }
    UserManager.prototype.getAllUsers = function () {
        return __awaiter(this, arguments, void 0, function (page, limit, filters) {
            var offset, whereConditions, queryParams, paramIndex, whereClause, totalCount, total, users, error_1;
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
                        if ((filters === null || filters === void 0 ? void 0 : filters.status) === true || (filters === null || filters === void 0 ? void 0 : filters.status) === false) {
                            whereConditions.push("nguoidung.TrangThai = $".concat(paramIndex));
                            queryParams.push(filters.status ? 'active' : 'inactive');
                            paramIndex++;
                        }
                        if ((filters === null || filters === void 0 ? void 0 : filters.role) && filters.role !== 'all') {
                            whereConditions.push("nguoidung.MaNhom = $".concat(paramIndex));
                            queryParams.push(filters.role);
                            paramIndex++;
                        }
                        if (filters === null || filters === void 0 ? void 0 : filters.search) {
                            whereConditions.push("(nguoidung.UserID ILIKE $".concat(paramIndex, " OR nguoidung.TenDangNhap ILIKE $").concat(paramIndex, " OR sinhvien.HoTen ILIKE $").concat(paramIndex, ")"));
                            queryParams.push("%".concat(filters.search, "%"));
                            paramIndex++;
                        }
                        whereClause = whereConditions.length > 0
                            ? "WHERE ".concat(whereConditions.join(' AND '))
                            : '';
                        console.log('Request params:', { page: page, limit: limit, filters: filters });
                        console.log('Final whereClause:', whereClause);
                        console.log('Final queryParams:', queryParams);
                        return [4 /*yield*/, userService.getUserCount(whereClause, queryParams)];
                    case 1:
                        totalCount = _a.sent();
                        total = parseInt((totalCount === null || totalCount === void 0 ? void 0 : totalCount.total) || '0');
                        return [4 /*yield*/, userService.getAllUsers(whereClause, queryParams, limit, offset)];
                    case 2:
                        users = _a.sent();
                        return [2 /*return*/, {
                                users: users || [],
                                total: total,
                                page: page,
                                totalPages: Math.ceil(total / limit)
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error in getAllUsers:', error_1);
                        throw new errorHandler_1.AppError(500, 'Error retrieving users: ' + error_1.message);
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
                        return [4 /*yield*/, userService.getUserById(id)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, {
                                users: user ? [user] : [],
                                total: user ? 1 : 0,
                                page: 1,
                                totalPages: 1
                            }];
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
            var existingUser, student, lastUser, newUserId, num, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Validate studentId thay vì email
                        if (!userData.studentId)
                            throw new errorHandler_1.AppError(400, 'Student ID is required');
                        return [4 /*yield*/, userService.getUserByUsername(userData.studentId)];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser)
                            throw new errorHandler_1.AppError(400, 'User already exists');
                        if (!(userData.role === 'N3')) return [3 /*break*/, 3];
                        return [4 /*yield*/, userService.getStudentById(userData.studentId)];
                    case 2:
                        student = _a.sent();
                        if (!student)
                            throw new errorHandler_1.AppError(400, 'Student does not exist');
                        _a.label = 3;
                    case 3: return [4 /*yield*/, userService.getLastUser()];
                    case 4:
                        lastUser = _a.sent();
                        newUserId = 'U001';
                        if (lastUser && lastUser.UserID) {
                            num = parseInt(lastUser.UserID.replace('U', '')) + 1;
                            newUserId = 'U' + num.toString().padStart(3, '0');
                        }
                        return [4 /*yield*/, userService.createUser({
                                username: userData.studentId,
                                userId: newUserId,
                                password: '123456',
                                role: userData.role || '',
                                studentId: userData.studentId,
                                status: userData.status ? 'active' : 'inactive'
                            })];
                    case 5:
                        result = _a.sent();
                        if (!result)
                            throw new errorHandler_1.AppError(500, 'Failed to create user');
                        return [2 /*return*/, result];
                }
            });
        });
    };
    UserManager.prototype.updateUser = function (id, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(userData.role === 'N3' && userData.studentid && userData.name && userData.department)) return [3 /*break*/, 2];
                        return [4 /*yield*/, userService.updateStudentInfo(userData.studentid, userData.name, userData.department)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, userService.updateUser(id, {
                            status: userData.status
                        })];
                    case 3:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                }
            });
        });
    };
    UserManager.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userService.deleteUser(id)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.length > 0];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error deleting user:', error_3);
                        throw new errorHandler_1.AppError(500, 'Error deleting user and related data');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.changeUserStatus = function (id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userService.changeUserStatus(id, status)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[0] || null];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error changing user status:', error_4);
                        throw new errorHandler_1.AppError(500, 'Error changing user status');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.getDashboardStats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var stats, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userService.getDashboardStats()];
                    case 1:
                        stats = _a.sent();
                        return [2 /*return*/, stats || {
                                totalStudents: 0,
                                pendingPayments: 0,
                                newRegistrations: 0,
                                systemAlerts: 0
                            }];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error fetching dashboard stats:', error_5);
                        // Fallback to service call with same interface
                        return [2 /*return*/, {
                                totalStudents: 0,
                                pendingPayments: 0,
                                newRegistrations: 0,
                                systemAlerts: 0
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.getSystemConfig = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configs, configMap_1, error_6;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userService.getSystemConfigs()];
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
                        error_6 = _c.sent();
                        console.error('Error fetching system config:', error_6);
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
            var settingType, settingValue, error_7;
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
                        return [4 /*yield*/, userService.updateSystemConfig(configKey, settingValue, settingType)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: 'System configuration updated successfully' }];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Error updating system config:', error_7);
                        throw new errorHandler_1.AppError(500, 'Error updating system configuration');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserManager.prototype.searchUsersByName = function (searchTerm) {
        return __awaiter(this, void 0, void 0, function () {
            var normalizedSearchTerm, whereConditions, queryParams, paramIndex, whereClause, results, mappedResults, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Validate search term
                        if (!searchTerm || searchTerm.trim().length === 0) {
                            return [2 /*return*/, []];
                        }
                        normalizedSearchTerm = searchTerm.trim().toLowerCase();
                        // Kiểm tra độ dài tối thiểu
                        if (normalizedSearchTerm.length < 2) {
                            return [2 /*return*/, []];
                        }
                        whereConditions = [];
                        queryParams = [];
                        paramIndex = 1;
                        // Tìm kiếm theo tên sinh viên
                        whereConditions.push("LOWER(sinhvien.HoTen) LIKE LOWER($".concat(paramIndex, ")"));
                        queryParams.push("%".concat(normalizedSearchTerm, "%"));
                        paramIndex++;
                        // Thêm điều kiện chỉ lấy sinh viên (MaNhom = 'N3')
                        whereConditions.push("nguoidung.MaNhom = $".concat(paramIndex));
                        queryParams.push('N3');
                        whereClause = whereConditions.length > 0
                            ? "WHERE ".concat(whereConditions.join(' AND '))
                            : '';
                        return [4 /*yield*/, userService.getAllUsers(whereClause, queryParams, 10, // Giới hạn 10 kết quả
                            0 // Không cần offset vì đây là tìm kiếm
                            )];
                    case 1:
                        results = _a.sent();
                        mappedResults = results.map(function (user) { return ({
                            id: user.id,
                            name: user.name || user.studentId, // Fallback to studentId if name is null
                            studentId: user.studentId,
                            role: user.role,
                            status: user.status,
                            department: user.department
                        }); });
                        return [2 /*return*/, mappedResults];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error in searchUsersByName:', error_8);
                        throw new errorHandler_1.AppError(500, 'Error searching users: ' + error_8.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Thêm phương thức mới để xử lý tìm kiếm nâng cao
    UserManager.prototype.advancedSearch = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var whereConditions, queryParams, paramIndex, whereClause, totalCount, total, users, mappedResults, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        whereConditions = [];
                        queryParams = [];
                        paramIndex = 1;
                        // Xử lý tìm kiếm theo tên
                        if (params.searchTerm && params.searchTerm.trim().length >= 2) {
                            whereConditions.push("(LOWER(sinhvien.HoTen) LIKE LOWER($".concat(paramIndex, ") OR LOWER(nguoidung.TenDangNhap) LIKE LOWER($").concat(paramIndex, "))"));
                            queryParams.push("%".concat(params.searchTerm.trim().toLowerCase(), "%"));
                            paramIndex++;
                        }
                        // Xử lý lọc theo vai trò
                        if (params.role && params.role !== 'all') {
                            whereConditions.push("nguoidung.MaNhom = $".concat(paramIndex));
                            queryParams.push(params.role);
                            paramIndex++;
                        }
                        // Xử lý lọc theo trạng thái
                        if (params.status !== undefined) {
                            whereConditions.push("nguoidung.TrangThai = $".concat(paramIndex));
                            queryParams.push(params.status ? 'active' : 'inactive');
                            paramIndex++;
                        }
                        // Xử lý lọc theo khoa
                        if (params.department) {
                            whereConditions.push("khoa.TenKhoa = $".concat(paramIndex));
                            queryParams.push(params.department);
                            paramIndex++;
                        }
                        whereClause = whereConditions.length > 0
                            ? "WHERE ".concat(whereConditions.join(' AND '))
                            : '';
                        return [4 /*yield*/, userService.getUserCount(whereClause, queryParams)];
                    case 1:
                        totalCount = _a.sent();
                        total = parseInt((totalCount === null || totalCount === void 0 ? void 0 : totalCount.total) || '0');
                        return [4 /*yield*/, userService.getAllUsers(whereClause, queryParams, 10, // Giới hạn 10 kết quả cho tìm kiếm
                            0 // Không cần offset
                            )];
                    case 2:
                        users = _a.sent();
                        mappedResults = users.map(function (user) { return ({
                            id: user.id,
                            name: user.name || user.studentId,
                            studentId: user.studentId,
                            role: user.role,
                            status: user.status,
                            department: user.department
                        }); });
                        return [2 /*return*/, {
                                users: mappedResults,
                                total: total
                            }];
                    case 3:
                        error_9 = _a.sent();
                        console.error('Error in advancedSearch:', error_9);
                        throw new errorHandler_1.AppError(500, 'Error performing advanced search: ' + error_9.message);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return UserManager;
}());
exports.userManager = new UserManager();
