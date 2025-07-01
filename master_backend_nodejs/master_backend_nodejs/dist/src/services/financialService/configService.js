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
exports.FinancialConfigService = void 0;
// src/services/financialService/configService.ts
var databaseService_1 = require("../database/databaseService");
var FinancialConfigService = /** @class */ (function () {
    function FinancialConfigService() {
    }
    /**
     * Get all priority objects (đối tượng ưu tiên)
     */
    FinancialConfigService.prototype.getPriorityObjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT \n                MaDoiTuong as priority_id,\n                TenDoiTuong as priority_name,\n                MucGiamHocPhi as discount_amount\n            FROM DOITUONGUUTIEN\n            ORDER BY TenDoiTuong\n        ";
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(function (row) { return ({
                                priorityId: row.priority_id,
                                priorityName: row.priority_name,
                                discountAmount: parseFloat(row.discount_amount)
                            }); })];
                }
            });
        });
    };
    /**
     * Create a new priority object
     */
    FinancialConfigService.prototype.createPriorityObject = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var exists, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.exists('DOITUONGUUTIEN', {
                                MaDoiTuong: data.priorityId
                            })];
                    case 1:
                        exists = _a.sent();
                        if (exists) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Priority object ID already exists'
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.insert('DOITUONGUUTIEN', {
                                MaDoiTuong: data.priorityId,
                                TenDoiTuong: data.priorityName,
                                MucGiamHocPhi: data.discountAmount
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: 'Priority object created successfully'
                            }];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create priority object: ".concat((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || 'Unknown error')
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update a priority object
     */
    FinancialConfigService.prototype.updatePriorityObject = function (priorityId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updateData = {};
                        if (data.priorityName !== undefined) {
                            updateData.TenDoiTuong = data.priorityName;
                        }
                        if (data.discountAmount !== undefined) {
                            updateData.MucGiamHocPhi = data.discountAmount;
                        }
                        if (Object.keys(updateData).length === 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'No data to update'
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.update('DOITUONGUUTIEN', updateData, { MaDoiTuong: priorityId })];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Priority object not found'
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                message: 'Priority object updated successfully'
                            }];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to update priority object: ".concat((error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete a priority object
     */
    FinancialConfigService.prototype.deletePriorityObject = function (priorityId) {
        return __awaiter(this, void 0, void 0, function () {
            var isUsed, deletedCount, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT COUNT(*) as count \n                FROM SINHVIEN \n                WHERE MaDoiTuong = $1\n            ", [priorityId])];
                    case 1:
                        isUsed = _a.sent();
                        if (isUsed && parseInt(isUsed.count) > 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Cannot delete priority object: it is being used by students'
                                }];
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.delete('DOITUONGUUTIEN', {
                                MaDoiTuong: priorityId
                            })];
                    case 2:
                        deletedCount = _a.sent();
                        if (deletedCount === 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Priority object not found'
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                message: 'Priority object deleted successfully'
                            }];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to delete priority object: ".concat((error_3 === null || error_3 === void 0 ? void 0 : error_3.message) || 'Unknown error')
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get all course types with their pricing
     */
    FinancialConfigService.prototype.getCourseTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT \n                MaLoaiMon as course_type_id,\n                TenLoaiMon as course_type_name,\n                SoTietMotTC as hours_per_credit,\n                SoTienMotTC as price_per_credit\n            FROM LOAIMON\n            ORDER BY TenLoaiMon\n        ";
                        return [4 /*yield*/, databaseService_1.DatabaseService.query(query)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.map(function (row) { return ({
                                courseTypeId: row.course_type_id,
                                courseTypeName: row.course_type_name,
                                hoursPerCredit: parseInt(row.hours_per_credit),
                                pricePerCredit: parseFloat(row.price_per_credit)
                            }); })];
                }
            });
        });
    };
    /**
     * Update course type pricing (only allow changing price, not adding new types)
     */
    FinancialConfigService.prototype.updateCourseTypePrice = function (courseTypeId, newPrice) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, databaseService_1.DatabaseService.update('LOAIMON', { SoTienMotTC: newPrice }, { MaLoaiMon: courseTypeId })];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Course type not found'
                                }];
                        }
                        return [2 /*return*/, {
                                success: true,
                                message: 'Course type price updated successfully'
                            }];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to update course type price: ".concat((error_4 === null || error_4 === void 0 ? void 0 : error_4.message) || 'Unknown error')
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get payment deadline from current active semester
     */
    FinancialConfigService.prototype.getPaymentDeadline = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT \n                HanDongHocPhi as deadline,\n                TenHocKy as semester_name\n            FROM HOCKYNAMHOC \n            WHERE TrangThaiHocKy = 'active' \n            ORDER BY ThoiGianBatDau DESC \n            LIMIT 1\n        ";
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne(query)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, {
                                    deadline: null,
                                    semesterName: null
                                }];
                        }
                        return [2 /*return*/, {
                                deadline: result.deadline,
                                semesterName: result.semester_name
                            }];
                }
            });
        });
    };
    /**
     * Get semester configuration details
     */
    FinancialConfigService.prototype.getSemesterConfig = function (semesterId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = [];
                        if (semesterId) {
                            query = "\n                SELECT \n                    MaHocKy as semester_id,\n                    TenHocKy as semester_name,\n                    ThoiGianBatDau as start_date,\n                    ThoiGianKetThuc as end_date,\n                    HanDongHocPhi as payment_deadline,\n                    TrangThaiHocKy as status\n                FROM HOCKYNAMHOC \n                WHERE MaHocKy = $1\n            ";
                            params = [semesterId];
                        }
                        else {
                            query = "\n                SELECT \n                    MaHocKy as semester_id,\n                    TenHocKy as semester_name,\n                    ThoiGianBatDau as start_date,\n                    ThoiGianKetThuc as end_date,\n                    HanDongHocPhi as payment_deadline,\n                    TrangThaiHocKy as status\n                FROM HOCKYNAMHOC \n                WHERE TrangThaiHocKy = 'active' \n                ORDER BY ThoiGianBatDau DESC \n                LIMIT 1\n            ";
                        }
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne(query, params)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get financial configuration summary
     */
    FinancialConfigService.prototype.getConfigSummary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var priorityCount, courseTypeCount, semesterInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT COUNT(*) as count FROM DOITUONGUUTIEN\n        ")];
                    case 1:
                        priorityCount = _a.sent();
                        return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT COUNT(*) as count FROM LOAIMON\n        ")];
                    case 2:
                        courseTypeCount = _a.sent();
                        return [4 /*yield*/, this.getSemesterConfig()];
                    case 3:
                        semesterInfo = _a.sent();
                        return [2 /*return*/, {
                                priorityObjectsCount: parseInt((priorityCount === null || priorityCount === void 0 ? void 0 : priorityCount.count) || '0'),
                                courseTypesCount: parseInt((courseTypeCount === null || courseTypeCount === void 0 ? void 0 : courseTypeCount.count) || '0'),
                                currentSemester: semesterInfo,
                                paymentDeadline: (semesterInfo === null || semesterInfo === void 0 ? void 0 : semesterInfo.payment_deadline) || null
                            }];
                }
            });
        });
    };
    return FinancialConfigService;
}());
exports.FinancialConfigService = FinancialConfigService;
