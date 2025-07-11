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
exports.MaintenanceController = void 0;
var maintenanceManager_1 = require("../../business/AdminBussiness/maintenanceManager");
var errorHandler_1 = require("../../middleware/errorHandler");
var MaintenanceController = /** @class */ (function () {
    function MaintenanceController() {
    }
    MaintenanceController.prototype.getMaintenanceStatus = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var status_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, maintenanceManager_1.maintenanceManager.getStatus()];
                    case 1:
                        status_1 = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: status_1
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        next(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceController.prototype.enableMaintenance = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var message, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        message = req.body.message;
                        return [4 /*yield*/, maintenanceManager_1.maintenanceManager.enable(message)];
                    case 1:
                        _a.sent();
                        res.status(200).json({
                            success: true,
                            message: 'Maintenance mode enabled'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        next(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceController.prototype.disableMaintenance = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, maintenanceManager_1.maintenanceManager.disable()];
                    case 1:
                        _a.sent();
                        res.status(200).json({
                            success: true,
                            message: 'Maintenance mode disabled'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        next(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceController.prototype.updateMaintenanceMessage = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var message, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        message = req.body.message;
                        if (!message) {
                            throw new errorHandler_1.AppError(400, 'Message is required');
                        }
                        return [4 /*yield*/, maintenanceManager_1.maintenanceManager.updateMessage(message)];
                    case 1:
                        _a.sent();
                        res.status(200).json({
                            success: true,
                            message: 'Maintenance message updated'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        next(error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceController.prototype.addAllowedIP = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var ip, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ip = req.body.ip;
                        if (!ip) {
                            throw new errorHandler_1.AppError(400, 'IP address is required');
                        }
                        return [4 /*yield*/, maintenanceManager_1.maintenanceManager.addAllowedIP(ip)];
                    case 1:
                        _a.sent();
                        res.status(200).json({
                            success: true,
                            message: 'IP address added to allowed list'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        next(error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceController.prototype.removeAllowedIP = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var ip, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ip = req.body.ip;
                        if (!ip) {
                            throw new errorHandler_1.AppError(400, 'IP address is required');
                        }
                        return [4 /*yield*/, maintenanceManager_1.maintenanceManager.removeAllowedIP(ip)];
                    case 1:
                        _a.sent();
                        res.status(200).json({
                            success: true,
                            message: 'IP address removed from allowed list'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        next(error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MaintenanceController.prototype.toggleMaintenance = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var enable, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        enable = req.body.enable;
                        if (!enable) return [3 /*break*/, 2];
                        return [4 /*yield*/, maintenanceManager_1.maintenanceManager.enable("Máy chủ đang bảo trì")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, maintenanceManager_1.maintenanceManager.disable()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        res.status(200).json({ maintenanceMode: enable });
                        return [3 /*break*/, 6];
                    case 5:
                        error_7 = _a.sent();
                        next(error_7);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return MaintenanceController;
}());
exports.MaintenanceController = MaintenanceController;
exports.default = new MaintenanceController();
