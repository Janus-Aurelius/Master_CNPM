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
exports.UserController = void 0;
var userManager_1 = require("../../business/AdminBussiness/userManager");
var errorHandler_1 = require("../../middleware/errorHandler");
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        this.searchUsersByName = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var searchTerm, users, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        searchTerm = req.query.searchTerm;
                        if (!searchTerm) {
                            res.status(400).json({
                                success: false,
                                message: 'Search term is required'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, userManager_1.userManager.searchUsersByName(searchTerm)];
                    case 1:
                        users = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: users
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        next(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.advancedSearch = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, searchTerm, role, status_1, department, results, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, searchTerm = _a.searchTerm, role = _a.role, status_1 = _a.status, department = _a.department;
                        return [4 /*yield*/, userManager_1.userManager.advancedSearch({
                                searchTerm: searchTerm,
                                role: role,
                                status: status_1 === 'true',
                                department: department
                            })];
                    case 1:
                        results = _b.sent();
                        res.status(200).json({
                            success: true,
                            data: results
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        next(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    }
    UserController.prototype.getAllUsers = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var page, limit, filters, users, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        page = parseInt(req.query.page) || 1;
                        limit = parseInt(req.query.limit) || 10;
                        filters = {
                            role: req.query.role,
                            status: req.query.status === 'true' ? true :
                                req.query.status === 'false' ? false : undefined,
                            search: req.query.search
                        };
                        console.log('Request params:', { page: page, limit: limit, filters: filters });
                        return [4 /*yield*/, userManager_1.userManager.getAllUsers(page, limit, filters)];
                    case 1:
                        users = _a.sent();
                        res.status(200).json({
                            success: true,
                            data: users
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.error('Error in getAllUsers controller:', err_1);
                        next(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.getUserById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, userManager_1.userManager.getUserById(id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new errorHandler_1.AppError(404, 'User not found');
                        res.status(200).json({
                            success: true,
                            data: user
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
    UserController.prototype.createUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userData, newUser, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userData = req.body;
                        return [4 /*yield*/, userManager_1.userManager.createUser(userData)];
                    case 1:
                        newUser = _a.sent();
                        res.status(201).json({
                            success: true,
                            data: newUser
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
    UserController.prototype.updateUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userData, updatedUser, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        userData = req.body;
                        return [4 /*yield*/, userManager_1.userManager.updateUser(id, userData)];
                    case 1:
                        updatedUser = _a.sent();
                        if (!updatedUser)
                            throw new errorHandler_1.AppError(404, 'User not found');
                        res.status(200).json({
                            success: true,
                            data: updatedUser
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
    UserController.prototype.deleteUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, success, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, userManager_1.userManager.deleteUser(id)];
                    case 1:
                        success = _a.sent();
                        if (!success)
                            throw new errorHandler_1.AppError(404, 'User not found');
                        res.status(200).json({
                            success: true,
                            message: 'User deleted successfully'
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
    UserController.prototype.changeUserStatus = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, status_2, updatedUser, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        status_2 = req.body.status;
                        return [4 /*yield*/, userManager_1.userManager.changeUserStatus(id, status_2)];
                    case 1:
                        updatedUser = _a.sent();
                        if (!updatedUser)
                            throw new errorHandler_1.AppError(404, 'User not found');
                        res.status(200).json({
                            success: true,
                            data: updatedUser
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        next(error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return UserController;
}());
exports.UserController = UserController;
