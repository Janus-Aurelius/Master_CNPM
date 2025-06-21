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
exports.FinancialConfigBusiness = void 0;
// src/business/financialBusiness/configBusiness.ts
var configService_1 = require("../../services/financialService/configService");
var FinancialConfigBusiness = /** @class */ (function () {
    function FinancialConfigBusiness() {
        this.configService = new configService_1.FinancialConfigService();
    }
    /**
     * Get all priority objects with validation
     */
    FinancialConfigBusiness.prototype.getPriorityObjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var priorityObjects, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configService.getPriorityObjects()];
                    case 1:
                        priorityObjects = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: priorityObjects,
                                total: priorityObjects.length
                            }];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get priority objects: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create priority object with business validation
     */
    FinancialConfigBusiness.prototype.createPriorityObject = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var validation, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        validation = this.validatePriorityObjectData(data);
                        if (!validation.isValid) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: validation.errors.join(', ')
                                }];
                        }
                        // Business rule: Discount amount should be reasonable (0 to 50M VND)
                        if (data.discountAmount < 0 || data.discountAmount > 50000000) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Discount amount must be between 0 and 50,000,000 VND'
                                }];
                        }
                        return [4 /*yield*/, this.configService.createPriorityObject(data)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create priority object: ".concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update priority object with validation
     */
    FinancialConfigBusiness.prototype.updatePriorityObject = function (priorityId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!priorityId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Priority ID is required'
                                }];
                        }
                        // Validate discount amount if provided
                        if (data.discountAmount !== undefined) {
                            if (data.discountAmount < 0 || data.discountAmount > 50000000) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Discount amount must be between 0 and 50,000,000 VND'
                                    }];
                            }
                        }
                        // Validate priority name if provided
                        if (data.priorityName !== undefined) {
                            if (!data.priorityName.trim()) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Priority name cannot be empty'
                                    }];
                            }
                            if (data.priorityName.length > 100) {
                                return [2 /*return*/, {
                                        success: false,
                                        message: 'Priority name cannot exceed 100 characters'
                                    }];
                            }
                        }
                        return [4 /*yield*/, this.configService.updatePriorityObject(priorityId, data)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to update priority object: ".concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete priority object with business rules
     */
    FinancialConfigBusiness.prototype.deletePriorityObject = function (priorityId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!priorityId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Priority ID is required'
                                }];
                        }
                        return [4 /*yield*/, this.configService.deletePriorityObject(priorityId)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to delete priority object: ".concat((error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all course types with their pricing
     */
    FinancialConfigBusiness.prototype.getCourseTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var courseTypes, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configService.getCourseTypes()];
                    case 1:
                        courseTypes = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: courseTypes,
                                total: courseTypes.length
                            }];
                    case 2:
                        error_5 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get course types: ".concat((error_5 === null || error_5 === void 0 ? void 0 : error_5.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update course type price with validation (no new types allowed)
     */
    FinancialConfigBusiness.prototype.updateCourseTypePrice = function (courseTypeId, newPrice) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (!courseTypeId) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Course type ID is required'
                                }];
                        }
                        // Validate price
                        if (newPrice <= 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Price must be greater than 0'
                                }];
                        }
                        // Business rule: Price should be reasonable (100,000 to 5,000,000 VND per credit)
                        if (newPrice < 100000 || newPrice > 5000000) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Price per credit must be between 100,000 and 5,000,000 VND'
                                }];
                        }
                        return [4 /*yield*/, this.configService.updateCourseTypePrice(courseTypeId, newPrice)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to update course type price: ".concat((error_6 === null || error_6 === void 0 ? void 0 : error_6.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get payment deadline information
     */
    FinancialConfigBusiness.prototype.getPaymentDeadline = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deadlineInfo, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configService.getPaymentDeadline()];
                    case 1:
                        deadlineInfo = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: deadlineInfo
                            }];
                    case 2:
                        error_7 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get payment deadline: ".concat((error_7 === null || error_7 === void 0 ? void 0 : error_7.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get semester configuration
     */
    FinancialConfigBusiness.prototype.getSemesterConfig = function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var config, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configService.getSemesterConfig(semesterId)];
                    case 1:
                        config = _a.sent();
                        if (!config) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: semesterId ? 'Semester not found' : 'No active semester found'
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                data: config
                            }];
                    case 2:
                        error_8 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get semester config: ".concat((error_8 === null || error_8 === void 0 ? void 0 : error_8.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get configuration summary dashboard
     */
    FinancialConfigBusiness.prototype.getConfigSummary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var summary, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.configService.getConfigSummary()];
                    case 1:
                        summary = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: summary
                            }];
                    case 2:
                        error_9 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to get config summary: ".concat((error_9 === null || error_9 === void 0 ? void 0 : error_9.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validate priority object data
     */
    FinancialConfigBusiness.prototype.validatePriorityObjectData = function (data) {
        var errors = [];
        if (!data.priorityId || !data.priorityId.trim()) {
            errors.push('Priority ID is required');
        }
        if (data.priorityId && data.priorityId.length > 20) {
            errors.push('Priority ID cannot exceed 20 characters');
        }
        if (!data.priorityName || !data.priorityName.trim()) {
            errors.push('Priority name is required');
        }
        if (data.priorityName && data.priorityName.length > 100) {
            errors.push('Priority name cannot exceed 100 characters');
        }
        if (data.discountAmount === undefined || data.discountAmount === null) {
            errors.push('Discount amount is required');
        }
        if (typeof data.discountAmount !== 'number') {
            errors.push('Discount amount must be a number');
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };
    /**
     * Batch update course type prices
     */
    FinancialConfigBusiness.prototype.batchUpdateCourseTypePrices = function (updates) {
        return __awaiter(this, void 0, void 0, function () {
            var results, successCount, errorCount, _i, updates_1, update, result, error_10, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!updates || updates.length === 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'No updates provided'
                                }];
                        }
                        results = [];
                        successCount = 0;
                        errorCount = 0;
                        _i = 0, updates_1 = updates;
                        _a.label = 1;
                    case 1:
                        if (!(_i < updates_1.length)) return [3 /*break*/, 6];
                        update = updates_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.updateCourseTypePrice(update.courseTypeId, update.newPrice)];
                    case 3:
                        result = _a.sent();
                        results.push({
                            courseTypeId: update.courseTypeId,
                            success: result.success,
                            message: result.message
                        });
                        if (result.success) {
                            successCount++;
                        }
                        else {
                            errorCount++;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_10 = _a.sent();
                        results.push({
                            courseTypeId: update.courseTypeId,
                            success: false,
                            message: (error_10 === null || error_10 === void 0 ? void 0 : error_10.message) || 'Unknown error'
                        });
                        errorCount++;
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, {
                            success: errorCount === 0,
                            data: {
                                results: results,
                                summary: {
                                    total: updates.length,
                                    successful: successCount,
                                    failed: errorCount
                                }
                            },
                            message: "Batch update completed: ".concat(successCount, " successful, ").concat(errorCount, " failed")
                        }];
                    case 7:
                        error_11 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to batch update course type prices: ".concat((error_11 === null || error_11 === void 0 ? void 0 : error_11.message) || 'Unknown error')
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return FinancialConfigBusiness;
}());
exports.FinancialConfigBusiness = FinancialConfigBusiness;
