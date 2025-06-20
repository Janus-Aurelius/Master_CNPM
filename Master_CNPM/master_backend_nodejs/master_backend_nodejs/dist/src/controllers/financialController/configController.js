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
exports.financialConfigController = exports.FinancialConfigController = void 0;
var configBusiness_1 = require("../../business/financialBusiness/configBusiness");
var FinancialConfigController = /** @class */ (function () {
    function FinancialConfigController() {
        this.configBusiness = new configBusiness_1.FinancialConfigBusiness();
    }
    /**
     * GET /api/financial/config/priority-objects
     * Get all priority objects
     */
    FinancialConfigController.prototype.getPriorityObjects = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configBusiness.getPriorityObjects()];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data,
                                total: result.total
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_1 === null || error_1 === void 0 ? void 0 : error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * POST /api/financial/config/priority-objects
     * Create a new priority object
     */
    FinancialConfigController.prototype.createPriorityObject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, priorityId, priorityName, discountAmount, result, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, priorityId = _a.priorityId, priorityName = _a.priorityName, discountAmount = _a.discountAmount;
                        if (!priorityId || !priorityName || discountAmount === undefined) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Priority ID, name, and discount amount are required'
                                })];
                        }
                        return [4 /*yield*/, this.configBusiness.createPriorityObject({
                                priorityId: priorityId,
                                priorityName: priorityName,
                                discountAmount: parseFloat(discountAmount)
                            })];
                    case 1:
                        result = _b.sent();
                        if (result.success) {
                            res.status(201).json({
                                success: true,
                                message: result.message
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_2 === null || error_2 === void 0 ? void 0 : error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * PUT /api/financial/config/priority-objects/:priorityId
     * Update a priority object
     */
    FinancialConfigController.prototype.updatePriorityObject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var priorityId, _a, priorityName, discountAmount, updateData, result, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        priorityId = req.params.priorityId;
                        _a = req.body, priorityName = _a.priorityName, discountAmount = _a.discountAmount;
                        if (!priorityId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Priority ID is required'
                                })];
                        }
                        updateData = {};
                        if (priorityName !== undefined) {
                            updateData.priorityName = priorityName;
                        }
                        if (discountAmount !== undefined) {
                            updateData.discountAmount = parseFloat(discountAmount);
                        }
                        return [4 /*yield*/, this.configBusiness.updatePriorityObject(priorityId, updateData)];
                    case 1:
                        result = _b.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                message: result.message
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_3 === null || error_3 === void 0 ? void 0 : error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * DELETE /api/financial/config/priority-objects/:priorityId
     * Delete a priority object
     */
    FinancialConfigController.prototype.deletePriorityObject = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var priorityId, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        priorityId = req.params.priorityId;
                        if (!priorityId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Priority ID is required'
                                })];
                        }
                        return [4 /*yield*/, this.configBusiness.deletePriorityObject(priorityId)];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                message: result.message
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_4 === null || error_4 === void 0 ? void 0 : error_4.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/config/course-types
     * Get all course types with pricing
     */
    FinancialConfigController.prototype.getCourseTypes = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configBusiness.getCourseTypes()];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data,
                                total: result.total
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_5 === null || error_5 === void 0 ? void 0 : error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * PUT /api/financial/config/course-types/:courseTypeId/price
     * Update course type price (no new course types allowed)
     */
    FinancialConfigController.prototype.updateCourseTypePrice = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var courseTypeId, newPrice, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        courseTypeId = req.params.courseTypeId;
                        newPrice = req.body.newPrice;
                        if (!courseTypeId) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Course type ID is required'
                                })];
                        }
                        if (newPrice === undefined) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'New price is required'
                                })];
                        }
                        return [4 /*yield*/, this.configBusiness.updateCourseTypePrice(courseTypeId, parseFloat(newPrice))];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                message: result.message
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_6 === null || error_6 === void 0 ? void 0 : error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * PUT /api/financial/config/course-types/batch-price-update
     * Batch update course type prices
     */
    FinancialConfigController.prototype.batchUpdateCourseTypePrices = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updates = req.body.updates;
                        if (!updates || !Array.isArray(updates)) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Updates array is required'
                                })];
                        }
                        return [4 /*yield*/, this.configBusiness.batchUpdateCourseTypePrices(updates)];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data,
                                message: result.message
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_7 === null || error_7 === void 0 ? void 0 : error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/config/payment-deadline
     * Get payment deadline from current semester
     */
    FinancialConfigController.prototype.getPaymentDeadline = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configBusiness.getPaymentDeadline()];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_8 === null || error_8 === void 0 ? void 0 : error_8.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/config/semester
     * Get semester configuration
     */
    FinancialConfigController.prototype.getSemesterConfig = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var semesterId, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        semesterId = req.query.semesterId;
                        return [4 /*yield*/, this.configBusiness.getSemesterConfig(semesterId)];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data
                            });
                        }
                        else {
                            res.status(404).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_9 === null || error_9 === void 0 ? void 0 : error_9.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * GET /api/financial/config/summary
     * Get configuration summary
     */
    FinancialConfigController.prototype.getConfigSummary = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configBusiness.getConfigSummary()];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            res.json({
                                success: true,
                                data: result.data
                            });
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: result.message
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        res.status(500).json({
                            success: false,
                            message: 'Internal server error',
                            error: error_10 === null || error_10 === void 0 ? void 0 : error_10.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return FinancialConfigController;
}());
exports.FinancialConfigController = FinancialConfigController;
exports.financialConfigController = new FinancialConfigController();
