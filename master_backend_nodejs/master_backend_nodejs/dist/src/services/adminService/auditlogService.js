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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditlogService = void 0;
// src/services/AdminService/auditlogService.ts
var databaseService_1 = require("../database/databaseService");
var auditlogService = /** @class */ (function () {
    function auditlogService() {
    }
    auditlogService.getAuditLogs = function (page, size) {
        return __awaiter(this, void 0, void 0, function () {
            var countResult, total, logs, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne('SELECT COUNT(*) as total FROM AUDIT_LOGS')];
                    case 1:
                        countResult = _a.sent();
                        total = parseInt((countResult === null || countResult === void 0 ? void 0 : countResult.total) || '0');
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    id,\n                    user_id,\n                    action_type,\n                    created_at,\n                    status,\n                    ip_address,\n                    user_agent\n                FROM AUDIT_LOGS \n                ORDER BY created_at DESC \n                LIMIT $1 OFFSET $2\n            ", [size, (page - 1) * size])];
                    case 2:
                        logs = _a.sent();
                        return [2 /*return*/, {
                                logs: logs || [],
                                total: total,
                                page: page,
                                size: size
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error in AuditlogService.getAuditLogs:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    auditlogService.getRecentActivities = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var activities, error_2;
            if (limit === void 0) { limit = 5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    id,\n                    action_type as message,\n                    created_at as time,\n                    CASE \n                        WHEN action_type = 'ERROR' THEN 'error'\n                        WHEN action_type = 'WARNING' THEN 'warning'\n                        ELSE 'info'\n                    END as severity\n                FROM AUDIT_LOGS\n                ORDER BY created_at DESC\n                LIMIT $1\n            ", [limit])];
                    case 1:
                        activities = _a.sent();
                        return [2 /*return*/, (activities || []).map(function (activity) { return ({
                                id: activity.id,
                                message: activity.message,
                                time: new Date(activity.time).toISOString(),
                                severity: activity.severity
                            }); })];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error in AuditlogService.getRecentActivities:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    auditlogService.createAuditLog = function (logData) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                INSERT INTO AUDIT_LOGS (\n                    user_id,\n                    action_type,\n                    status,\n                    created_at,\n                    ip_address,\n                    user_agent\n                ) VALUES ($1, $2, $3, $4, $5, $6)\n            ", [
                                logData.user_id,
                                logData.action_type,
                                logData.status,
                                logData.created_at || new Date().toISOString(),
                                logData.ip_address || null,
                                logData.user_agent || null
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error creating audit log:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    auditlogService.getAuditLogsByUser = function (userId, page, size) {
        return __awaiter(this, void 0, void 0, function () {
            var countResult, total, logs, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne('SELECT COUNT(*) as total FROM AUDIT_LOGS WHERE user_id = $1', [userId])];
                    case 1:
                        countResult = _a.sent();
                        total = parseInt((countResult === null || countResult === void 0 ? void 0 : countResult.total) || '0');
                        return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                SELECT \n                    id,\n                    user_id,\n                    action_type,\n                    created_at,\n                    ip_address,\n                    user_agent\n                FROM AUDIT_LOGS \n                WHERE user_id = $1\n                ORDER BY created_at DESC \n                LIMIT $2 OFFSET $3\n            ", [userId, size, (page - 1) * size])];
                    case 2:
                        logs = _a.sent();
                        return [2 /*return*/, {
                                logs: logs || [],
                                total: total,
                                page: page,
                                size: size
                            }];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error fetching user audit logs:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return auditlogService;
}());
exports.auditlogService = auditlogService;
