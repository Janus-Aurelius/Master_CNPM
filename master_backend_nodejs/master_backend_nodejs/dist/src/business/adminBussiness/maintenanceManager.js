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
exports.maintenanceManager = void 0;
var errorHandler_1 = require("../../middleware/errorHandler");
var databaseService_1 = require("../../services/database/databaseService");
var MaintenanceManager = /** @class */ (function () {
    function MaintenanceManager() {
        this.isMaintenanceMode = false;
        this.maintenanceMessage = '';
        this.allowedIPs = [];
    }
    MaintenanceManager.prototype.getStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            var maintenanceSettings, settings_1, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT setting_key, setting_value \n                FROM system_settings \n                WHERE setting_key IN ('maintenance_mode', 'maintenance_message', 'maintenance_allowed_ips')\n            ")];
                    case 1:
                        maintenanceSettings = _b.sent();
                        settings_1 = {};
                        maintenanceSettings.forEach(function (setting) {
                            if (setting.setting_key === 'maintenance_allowed_ips') {
                                settings_1[setting.setting_key] = setting.setting_value ? JSON.parse(setting.setting_value) : [];
                            }
                            else if (setting.setting_key === 'maintenance_mode') {
                                settings_1[setting.setting_key] = setting.setting_value === 'true';
                            }
                            else {
                                settings_1[setting.setting_key] = setting.setting_value;
                            }
                        });
                        _a = {
                            isMaintenanceMode: settings_1.maintenance_mode || this.isMaintenanceMode,
                            message: settings_1.maintenance_message || this.maintenanceMessage,
                            allowedIPs: settings_1.maintenance_allowed_ips || this.allowedIPs,
                            lastUpdated: new Date().toISOString()
                        };
                        return [4 /*yield*/, this.getSystemHealth()];
                    case 2: return [2 /*return*/, (_a.systemStatus = _b.sent(),
                            _a)];
                    case 3:
                        error_1 = _b.sent();
                        console.error('Error getting maintenance status:', error_1);
                        // Fallback to in-memory values
                        return [2 /*return*/, {
                                isMaintenanceMode: this.isMaintenanceMode,
                                message: this.maintenanceMessage,
                                allowedIPs: this.allowedIPs
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.enable = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this.isMaintenanceMode = true;
                        this.maintenanceMessage = message || 'System is under maintenance';
                        // Update database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ('maintenance_mode', 'true', 'boolean', NOW())\n                ON CONFLICT (setting_key) \n                DO UPDATE SET setting_value = 'true', updated_at = NOW()\n            ")];
                    case 1:
                        // Update database
                        _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ('maintenance_message', $1, 'string', NOW())\n                ON CONFLICT (setting_key) \n                DO UPDATE SET setting_value = $1, updated_at = NOW()\n            ", [this.maintenanceMessage])];
                    case 2:
                        _a.sent();
                        // Log the maintenance activation
                        return [4 /*yield*/, this.logMaintenanceAction('ENABLED', "Maintenance mode enabled: ".concat(this.maintenanceMessage))];
                    case 3:
                        // Log the maintenance activation
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error enabling maintenance mode:', error_2);
                        throw new errorHandler_1.AppError(500, 'Error enabling maintenance mode');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.disable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        this.isMaintenanceMode = false;
                        this.maintenanceMessage = '';
                        // Update database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ('maintenance_mode', 'false', 'boolean', NOW())\n                ON CONFLICT (setting_key) \n                DO UPDATE SET setting_value = 'false', updated_at = NOW()\n            ")];
                    case 1:
                        // Update database
                        _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ('maintenance_message', '', 'string', NOW())\n                ON CONFLICT (setting_key) \n                DO UPDATE SET setting_value = '', updated_at = NOW()\n            ")];
                    case 2:
                        _a.sent();
                        // Log the maintenance deactivation
                        return [4 /*yield*/, this.logMaintenanceAction('DISABLED', 'Maintenance mode disabled')];
                    case 3:
                        // Log the maintenance deactivation
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _a.sent();
                        console.error('Error disabling maintenance mode:', error_3);
                        throw new errorHandler_1.AppError(500, 'Error disabling maintenance mode');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.updateMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!message) {
                            throw new errorHandler_1.AppError(400, 'Message is required');
                        }
                        this.maintenanceMessage = message;
                        // Update database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ('maintenance_message', $1, 'string', NOW())\n                ON CONFLICT (setting_key) \n                DO UPDATE SET setting_value = $1, updated_at = NOW()\n            ", [message])];
                    case 1:
                        // Update database
                        _a.sent();
                        // Log the message update
                        return [4 /*yield*/, this.logMaintenanceAction('MESSAGE_UPDATED', "Maintenance message updated: ".concat(message))];
                    case 2:
                        // Log the message update
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        if (error_4 instanceof errorHandler_1.AppError)
                            throw error_4;
                        console.error('Error updating maintenance message:', error_4);
                        throw new errorHandler_1.AppError(500, 'Error updating maintenance message');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.addAllowedIP = function (ip) {
        return __awaiter(this, void 0, void 0, function () {
            var result, currentIPs, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!ip) {
                            throw new errorHandler_1.AppError(400, 'IP address is required');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT setting_value FROM system_settings \n                WHERE setting_key = 'maintenance_allowed_ips'\n            ")];
                    case 1:
                        result = _a.sent();
                        currentIPs = [];
                        if (result.length > 0 && result[0].setting_value) {
                            currentIPs = JSON.parse(result[0].setting_value);
                        }
                        if (!!currentIPs.includes(ip)) return [3 /*break*/, 4];
                        currentIPs.push(ip);
                        this.allowedIPs = currentIPs;
                        // Update database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                    VALUES ('maintenance_allowed_ips', $1, 'json', NOW())\n                    ON CONFLICT (setting_key) \n                    DO UPDATE SET setting_value = $1, updated_at = NOW()\n                ", [JSON.stringify(currentIPs)])];
                    case 2:
                        // Update database
                        _a.sent();
                        // Log the IP addition
                        return [4 /*yield*/, this.logMaintenanceAction('IP_ADDED', "Added IP to allowed list: ".concat(ip))];
                    case 3:
                        // Log the IP addition
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_5 = _a.sent();
                        if (error_5 instanceof errorHandler_1.AppError)
                            throw error_5;
                        console.error('Error adding IP to allowed list:', error_5);
                        throw new errorHandler_1.AppError(500, 'Error adding IP to allowed list');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.removeAllowedIP = function (ip) {
        return __awaiter(this, void 0, void 0, function () {
            var result, currentIPs, filteredIPs, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!ip) {
                            throw new errorHandler_1.AppError(400, 'IP address is required');
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT setting_value FROM system_settings \n                WHERE setting_key = 'maintenance_allowed_ips'\n            ")];
                    case 1:
                        result = _a.sent();
                        currentIPs = [];
                        if (result.length > 0 && result[0].setting_value) {
                            currentIPs = JSON.parse(result[0].setting_value);
                        }
                        filteredIPs = currentIPs.filter(function (allowedIP) { return allowedIP !== ip; });
                        this.allowedIPs = filteredIPs;
                        // Update database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ('maintenance_allowed_ips', $1, 'json', NOW())\n                ON CONFLICT (setting_key) \n                DO UPDATE SET setting_value = $1, updated_at = NOW()\n            ", [JSON.stringify(filteredIPs)])];
                    case 2:
                        // Update database
                        _a.sent();
                        // Log the IP removal
                        return [4 /*yield*/, this.logMaintenanceAction('IP_REMOVED', "Removed IP from allowed list: ".concat(ip))];
                    case 3:
                        // Log the IP removal
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_6 = _a.sent();
                        if (error_6 instanceof errorHandler_1.AppError)
                            throw error_6;
                        console.error('Error removing IP from allowed list:', error_6);
                        throw new errorHandler_1.AppError(500, 'Error removing IP from allowed list');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.getSystemHealth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbCheck, isDatabaseHealthy, systemMetrics, error_7;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query('SELECT 1 as alive')];
                    case 1:
                        dbCheck = _d.sent();
                        isDatabaseHealthy = dbCheck.length > 0;
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    COUNT(*) as total_users \n                FROM users\n                UNION ALL\n                SELECT COUNT(*) as active_sessions \n                FROM user_sessions \n                WHERE expires_at > NOW()\n                UNION ALL\n                SELECT COUNT(*) as pending_requests \n                FROM academic_requests \n                WHERE status = 'pending'\n            ")];
                    case 2:
                        systemMetrics = _d.sent();
                        return [2 /*return*/, {
                                database: isDatabaseHealthy ? 'healthy' : 'unhealthy',
                                uptime: process.uptime(),
                                memory: process.memoryUsage(),
                                timestamp: new Date().toISOString(),
                                metrics: {
                                    totalUsers: ((_a = systemMetrics[0]) === null || _a === void 0 ? void 0 : _a.total_users) || 0,
                                    activeSessions: ((_b = systemMetrics[1]) === null || _b === void 0 ? void 0 : _b.active_sessions) || 0,
                                    pendingRequests: ((_c = systemMetrics[2]) === null || _c === void 0 ? void 0 : _c.pending_requests) || 0
                                }
                            }];
                    case 3:
                        error_7 = _d.sent();
                        console.error('Error getting system health:', error_7);
                        return [2 /*return*/, {
                                database: 'unhealthy',
                                uptime: process.uptime(),
                                memory: process.memoryUsage(),
                                timestamp: new Date().toISOString(),
                                error: 'Health check failed'
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.logMaintenanceAction = function (action, details) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO audit_logs (\n                    action_type, \n                    details, \n                    created_at,\n                    user_id,\n                    ip_address,\n                    user_agent\n                ) VALUES ($1, $2, NOW(), 'system', 'system', 'maintenance-manager')\n            ", [action, details])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Error logging maintenance action:', error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.getMaintenanceHistory = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var history_1, error_9;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    action_type,\n                    details,\n                    created_at,\n                    user_id\n                FROM audit_logs \n                WHERE action_type IN ('ENABLED', 'DISABLED', 'MESSAGE_UPDATED', 'IP_ADDED', 'IP_REMOVED')\n                ORDER BY created_at DESC \n                LIMIT $1\n            ", [limit])];
                    case 1:
                        history_1 = _a.sent();
                        return [2 /*return*/, history_1.map(function (log) { return ({
                                action: log.action_type,
                                details: log.details,
                                timestamp: log.created_at,
                                userId: log.user_id
                            }); })];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Error getting maintenance history:', error_9);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.scheduleMaintenanceWindow = function (startTime, endTime, message) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Store scheduled maintenance in database
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)\n                VALUES ('scheduled_maintenance', $1, 'json', NOW())\n                ON CONFLICT (setting_key) \n                DO UPDATE SET setting_value = $1, updated_at = NOW()\n            ", [JSON.stringify({
                                    startTime: startTime.toISOString(),
                                    endTime: endTime.toISOString(),
                                    message: message,
                                    scheduled: true
                                })])];
                    case 1:
                        // Store scheduled maintenance in database
                        _a.sent();
                        return [4 /*yield*/, this.logMaintenanceAction('SCHEDULED', "Maintenance scheduled from ".concat(startTime.toISOString(), " to ").concat(endTime.toISOString(), ": ").concat(message))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                scheduledWindow: {
                                    startTime: startTime.toISOString(),
                                    endTime: endTime.toISOString(),
                                    message: message
                                }
                            }];
                    case 3:
                        error_10 = _a.sent();
                        console.error('Error scheduling maintenance window:', error_10);
                        throw new errorHandler_1.AppError(500, 'Error scheduling maintenance window');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.getScheduledMaintenance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT setting_value FROM system_settings \n                WHERE setting_key = 'scheduled_maintenance'\n            ")];
                    case 1:
                        result = _a.sent();
                        if (result.length > 0 && result[0].setting_value) {
                            return [2 /*return*/, JSON.parse(result[0].setting_value)];
                        }
                        return [2 /*return*/, null];
                    case 2:
                        error_11 = _a.sent();
                        console.error('Error getting scheduled maintenance:', error_11);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceManager.prototype.isInMaintenanceMode = function () {
        return this.isMaintenanceMode;
    };
    MaintenanceManager.prototype.getMaintenanceMessage = function () {
        return this.maintenanceMessage;
    };
    MaintenanceManager.prototype.getAllowedIPs = function () {
        return __spreadArray([], this.allowedIPs, true);
    };
    MaintenanceManager.prototype.isIPAllowed = function (ip) {
        return this.allowedIPs.includes(ip);
    };
    return MaintenanceManager;
}());
exports.maintenanceManager = new MaintenanceManager();
