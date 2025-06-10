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
var userManager_1 = require("../../business/adminBussiness/userManager");
var activitylogManager_1 = require("../../business/adminBussiness/activitylogManager");
var AdminController = /** @class */ (function () {
    function AdminController() {
    }
    AdminController.prototype.getActivityLog = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var page, size, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        page = parseInt(req.query.page) || 1;
                        size = parseInt(req.query.size) || 10;
                        return [4 /*yield*/, activitylogManager_1.activitylogManager.getActivityLogs(page, size)];
                    case 1:
                        result = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: result
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
    AdminController.prototype.getDashboard = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userManager_1.userManager.getDashboardStats()];
                    case 1:
                        stats = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: stats
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
    AdminController.prototype.getUserManagement = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, search, role_1, page, size, _b, userList, total, currentPage, totalPages, users, searchLower_1, pageNum, pageSize, start, pagedUsers, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.query, search = _a.search, role_1 = _a.role, page = _a.page, size = _a.size;
                        return [4 /*yield*/, userManager_1.userManager.getAllUsers()];
                    case 1:
                        _b = _c.sent(), userList = _b.users, total = _b.total, currentPage = _b.page, totalPages = _b.totalPages;
                        users = userList;
                        // Filter by role
                        if (role_1 && typeof role_1 === 'string') {
                            users = users.filter(function (user) { return user.role === role_1; });
                        }
                        // Filter by search (name or email)
                        if (search && typeof search === 'string') {
                            searchLower_1 = search.toLowerCase();
                            users = users.filter(function (user) {
                                return user.name.toLowerCase().includes(searchLower_1) ||
                                    user.email.toLowerCase().includes(searchLower_1);
                            });
                        }
                        pageNum = page ? parseInt(page) : 1;
                        pageSize = size ? parseInt(size) : 10;
                        start = (pageNum - 1) * pageSize;
                        pagedUsers = users.slice(start, start + pageSize);
                        res.status(200).json({
                            success: true,
                            data: pagedUsers,
                            total: total,
                            page: pageNum,
                            size: pageSize
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _c.sent();
                        next(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AdminController.prototype.getConfig = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var config, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userManager_1.userManager.getSystemConfig()];
                    case 1:
                        config = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: config
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
    return AdminController;
}());
exports.default = new AdminController();
