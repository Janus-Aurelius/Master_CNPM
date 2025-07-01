"use strict";
// src/business/financialBusiness/financialManager.ts
// Central financial manager - delegates to specialized managers
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustTuition = exports.deleteTuitionRecord = exports.updateTuitionRecord = exports.getTuitionRecord = exports.createTuitionRecord = exports.calculateTuition = exports.createReceipt = exports.getReceiptById = exports.getAllReceipts = exports.validatePaymentConditions = exports.getPaymentAuditTrail = exports.validatePayment = exports.updatePaymentStatus = exports.getStudentPaymentStatus = exports.getAllPaymentStatus = exports.getFinancialAnalytics = exports.getDashboardData = exports.generateFinancialReport = exports.deleteTuitionSetting = exports.validateTuitionSetting = exports.updateTuitionSettings = exports.getTuitionSettings = exports.getCurrentSemester = void 0;
var dashboardManager_1 = __importDefault(require("./dashboardManager"));
var paymentManager_1 = __importDefault(require("./paymentManager"));
var tuitionManager_1 = __importDefault(require("./tuitionManager"));
var databaseService_1 = require("../../services/database/databaseService");
var errorHandler_1 = require("../../middleware/errorHandler");
// Utility function to get current semester
var getCurrentSemester = function () {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; // JavaScript months are 0-indexed
    if (month >= 1 && month <= 5) {
        return "Spring ".concat(year);
    }
    else if (month >= 6 && month <= 8) {
        return "Summer ".concat(year);
    }
    else {
        return "Fall ".concat(year);
    }
};
exports.getCurrentSemester = getCurrentSemester;
// Configuration Management Functions
var getTuitionSettings = function (semester) { return __awaiter(void 0, void 0, void 0, function () {
    var basicConfig, priorityObjects, courseTypes, semesterFees, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!semester) {
                    semester = (0, exports.getCurrentSemester)();
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                semester,\n                base_tuition_rate,\n                late_fee_rate,\n                early_payment_discount,\n                due_date_offset,\n                payment_methods,\n                currency,\n                created_at,\n                updated_at\n            FROM tuition_settings \n            WHERE semester = $1\n        ", [semester])];
            case 1:
                basicConfig = _a.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                priority_object_id,\n                priority_name,\n                discount_amount,\n                discount_percentage,\n                is_active\n            FROM doituonguutien\n            WHERE is_active = true\n            ORDER BY priority_name\n        ")];
            case 2:
                priorityObjects = _a.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                course_type_id,\n                type_name,\n                credit_price,\n                is_active\n            FROM loaimon\n            WHERE is_active = true  \n            ORDER BY type_name\n        ")];
            case 3:
                courseTypes = _a.sent();
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            SELECT \n                fee_type,\n                amount,\n                description,\n                is_mandatory\n            FROM semester_fees\n            WHERE semester = $1 AND is_active = true\n            ORDER BY fee_type\n        ", [semester])];
            case 4:
                semesterFees = _a.sent();
                return [2 /*return*/, {
                        semester: semester,
                        basicConfig: basicConfig[0] || null,
                        priorityObjects: priorityObjects,
                        courseTypes: courseTypes,
                        semesterFees: semesterFees,
                        generatedAt: new Date()
                    }];
            case 5:
                error_1 = _a.sent();
                console.error('Error getting tuition settings:', error_1);
                throw new errorHandler_1.AppError(500, 'Error retrieving tuition settings');
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getTuitionSettings = getTuitionSettings;
var updateTuitionSettings = function (semester, settings) { return __awaiter(void 0, void 0, void 0, function () {
    var existing, _i, _a, fee, error_2, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 17, , 18]);
                // Validate settings
                if (!semester) {
                    throw new errorHandler_1.AppError(400, 'Semester is required');
                }
                if (settings.baseTuitionRate && settings.baseTuitionRate < 0) {
                    throw new errorHandler_1.AppError(400, 'Base tuition rate cannot be negative');
                }
                // Start transaction
                return [4 /*yield*/, databaseService_1.DatabaseService.query('BEGIN')];
            case 1:
                // Start transaction
                _b.sent();
                _b.label = 2;
            case 2:
                _b.trys.push([2, 14, , 16]);
                if (!settings.basicConfig) return [3 /*break*/, 7];
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                    SELECT semester FROM tuition_settings WHERE semester = $1\n                ", [semester])];
            case 3:
                existing = _b.sent();
                if (!existing) return [3 /*break*/, 5];
                // Update existing
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                        UPDATE tuition_settings \n                        SET \n                            base_tuition_rate = COALESCE($1, base_tuition_rate),\n                            late_fee_rate = COALESCE($2, late_fee_rate),\n                            early_payment_discount = COALESCE($3, early_payment_discount),\n                            due_date_offset = COALESCE($4, due_date_offset),\n                            payment_methods = COALESCE($5, payment_methods),\n                            currency = COALESCE($6, currency),\n                            updated_at = NOW()\n                        WHERE semester = $7\n                    ", [
                        settings.basicConfig.baseTuitionRate,
                        settings.basicConfig.lateFeeRate,
                        settings.basicConfig.earlyPaymentDiscount,
                        settings.basicConfig.dueDateOffset,
                        JSON.stringify(settings.basicConfig.paymentMethods),
                        settings.basicConfig.currency,
                        semester
                    ])];
            case 4:
                // Update existing
                _b.sent();
                return [3 /*break*/, 7];
            case 5: 
            // Create new
            return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                        INSERT INTO tuition_settings (\n                            semester,\n                            base_tuition_rate,\n                            late_fee_rate,\n                            early_payment_discount,\n                            due_date_offset,\n                            payment_methods,\n                            currency,\n                            created_at\n                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())\n                    ", [
                    semester,
                    settings.basicConfig.baseTuitionRate || 0,
                    settings.basicConfig.lateFeeRate || 0,
                    settings.basicConfig.earlyPaymentDiscount || 0,
                    settings.basicConfig.dueDateOffset || 30,
                    JSON.stringify(settings.basicConfig.paymentMethods || []),
                    settings.basicConfig.currency || 'VND'
                ])];
            case 6:
                // Create new
                _b.sent();
                _b.label = 7;
            case 7:
                if (!(settings.semesterFees && Array.isArray(settings.semesterFees))) return [3 /*break*/, 12];
                // Remove existing fees for this semester
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                    DELETE FROM semester_fees WHERE semester = $1\n                ", [semester])];
            case 8:
                // Remove existing fees for this semester
                _b.sent();
                _i = 0, _a = settings.semesterFees;
                _b.label = 9;
            case 9:
                if (!(_i < _a.length)) return [3 /*break*/, 12];
                fee = _a[_i];
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n                        INSERT INTO semester_fees (\n                            semester,\n                            fee_type,\n                            amount,\n                            description,\n                            is_mandatory,\n                            is_active,\n                            created_at\n                        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())\n                    ", [
                        semester,
                        fee.feeType,
                        fee.amount,
                        fee.description || '',
                        fee.isMandatory || false,
                        true
                    ])];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 9];
            case 12: 
            // Commit transaction
            return [4 /*yield*/, databaseService_1.DatabaseService.query('COMMIT')];
            case 13:
                // Commit transaction
                _b.sent();
                return [2 /*return*/, {
                        success: true,
                        message: 'Tuition settings updated successfully',
                        semester: semester,
                        updatedAt: new Date()
                    }];
            case 14:
                error_2 = _b.sent();
                // Rollback on error
                return [4 /*yield*/, databaseService_1.DatabaseService.query('ROLLBACK')];
            case 15:
                // Rollback on error
                _b.sent();
                throw error_2;
            case 16: return [3 /*break*/, 18];
            case 17:
                error_3 = _b.sent();
                if (error_3 instanceof errorHandler_1.AppError)
                    throw error_3;
                console.error('Error updating tuition settings:', error_3);
                throw new errorHandler_1.AppError(500, 'Error updating tuition settings');
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.updateTuitionSettings = updateTuitionSettings;
// Validation Functions
var validateTuitionSetting = function (setting) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, warnings, courseType, existing, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                errors = [];
                warnings = [];
                // Validate semester format
                if (!setting.semester || !/^(Spring|Summer|Fall) \d{4}$/.test(setting.semester)) {
                    errors.push('Invalid semester format. Expected format: "Spring 2024"');
                }
                if (!setting.courseTypeId) return [3 /*break*/, 2];
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT course_type_id FROM loaimon WHERE course_type_id = $1\n            ", [setting.courseTypeId])];
            case 1:
                courseType = _a.sent();
                if (!courseType) {
                    errors.push('Course type not found');
                }
                _a.label = 2;
            case 2:
                // Validate credit price
                if (setting.creditPrice < 0) {
                    errors.push('Credit price cannot be negative');
                }
                if (setting.creditPrice > 10000000) { // 10M VND per credit
                    warnings.push('Credit price seems unusually high');
                }
                if (!(setting.semester && setting.courseTypeId)) return [3 /*break*/, 4];
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n                SELECT lm.* FROM loaimon lm\n                WHERE lm.course_type_id = $1\n            ", [setting.courseTypeId])];
            case 3:
                existing = _a.sent();
                if (existing) {
                    warnings.push('Course type already has pricing configured');
                }
                _a.label = 4;
            case 4: return [2 /*return*/, {
                    isValid: errors.length === 0,
                    errors: errors,
                    warnings: warnings
                }];
            case 5:
                error_4 = _a.sent();
                console.error('Error validating tuition setting:', error_4);
                return [2 /*return*/, {
                        isValid: false,
                        errors: ['Error validating tuition setting'],
                        warnings: []
                    }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.validateTuitionSetting = validateTuitionSetting;
var deleteTuitionSetting = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var setting, inUse, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!id) {
                    throw new errorHandler_1.AppError(400, 'Setting ID is required');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT course_type_id FROM loaimon WHERE course_type_id = $1\n        ", [id])];
            case 1:
                setting = _a.sent();
                if (!setting) {
                    throw new errorHandler_1.AppError(404, 'Tuition setting not found');
                }
                return [4 /*yield*/, databaseService_1.DatabaseService.queryOne("\n            SELECT COUNT(*) as count FROM courses WHERE course_type_id = $1\n        ", [id])];
            case 2:
                inUse = _a.sent();
                if (parseInt(inUse.count) > 0) {
                    throw new errorHandler_1.AppError(400, 'Cannot delete tuition setting that is in use by courses');
                }
                // Delete the setting
                return [4 /*yield*/, databaseService_1.DatabaseService.query("\n            UPDATE loaimon SET is_active = false WHERE course_type_id = $1\n        ", [id])];
            case 3:
                // Delete the setting
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                if (error_5 instanceof errorHandler_1.AppError)
                    throw error_5;
                console.error('Error deleting tuition setting:', error_5);
                throw new errorHandler_1.AppError(500, 'Error deleting tuition setting');
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteTuitionSetting = deleteTuitionSetting;
// Report Generation
var generateFinancialReport = function (reportType, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var currentSemester, _a, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                currentSemester = filters.semester || (0, exports.getCurrentSemester)();
                _a = reportType;
                switch (_a) {
                    case 'summary': return [3 /*break*/, 1];
                    case 'detailed': return [3 /*break*/, 3];
                    case 'overdue': return [3 /*break*/, 5];
                }
                return [3 /*break*/, 7];
            case 1: return [4 /*yield*/, generateSummaryReport(currentSemester, filters)];
            case 2: return [2 /*return*/, _b.sent()];
            case 3: return [4 /*yield*/, generateDetailedReport(currentSemester, filters)];
            case 4: return [2 /*return*/, _b.sent()];
            case 5: return [4 /*yield*/, generateOverdueReport(currentSemester, filters)];
            case 6: return [2 /*return*/, _b.sent()];
            case 7: throw new errorHandler_1.AppError(400, 'Invalid report type');
            case 8: return [3 /*break*/, 10];
            case 9:
                error_6 = _b.sent();
                if (error_6 instanceof errorHandler_1.AppError)
                    throw error_6;
                console.error('Error generating financial report:', error_6);
                throw new errorHandler_1.AppError(500, 'Error generating financial report');
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.generateFinancialReport = generateFinancialReport;
var generateSummaryReport = function (semester, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var summary;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        SELECT \n            COUNT(DISTINCT tr.student_id) as total_students,\n            SUM(tr.total_amount) as total_tuition,\n            SUM(tr.paid_amount) as total_paid,\n            SUM(tr.outstanding_amount) as total_outstanding,\n            COUNT(CASE WHEN tr.payment_status = 'PAID' THEN 1 END) as paid_count,\n            COUNT(CASE WHEN tr.payment_status = 'PARTIAL' THEN 1 END) as partial_count,\n            COUNT(CASE WHEN tr.payment_status = 'UNPAID' THEN 1 END) as unpaid_count\n        FROM tuition_records tr\n        JOIN students s ON tr.student_id = s.student_id\n        WHERE tr.semester = $1\n        ".concat(filters.faculty ? 'AND s.faculty = $2' : '', "\n    "), filters.faculty ? [semester, filters.faculty] : [semester])];
            case 1:
                summary = _a.sent();
                return [2 /*return*/, {
                        reportType: 'summary',
                        semester: semester,
                        generatedAt: new Date(),
                        data: summary[0]
                    }];
        }
    });
}); };
var generateDetailedReport = function (semester, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var detailed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        SELECT \n            tr.*,\n            s.full_name,\n            s.faculty,\n            s.program,\n            s.student_year,\n            dt.priority_name\n        FROM tuition_records tr\n        JOIN students s ON tr.student_id = s.student_id\n        LEFT JOIN doituonguutien dt ON s.priority_object_id = dt.priority_object_id\n        WHERE tr.semester = $1\n        ".concat(filters.faculty ? 'AND s.faculty = $2' : '', "\n        ORDER BY s.faculty, s.full_name\n    "), filters.faculty ? [semester, filters.faculty] : [semester])];
            case 1:
                detailed = _a.sent();
                return [2 /*return*/, {
                        reportType: 'detailed',
                        semester: semester,
                        generatedAt: new Date(),
                        data: detailed
                    }];
        }
    });
}); };
var generateOverdueReport = function (semester, filters) { return __awaiter(void 0, void 0, void 0, function () {
    var overdue;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, databaseService_1.DatabaseService.query("\n        SELECT \n            tr.*,\n            s.full_name,\n            s.faculty,\n            s.program,\n            s.email,\n            s.phone,\n            CURRENT_DATE - tr.due_date as days_overdue\n        FROM tuition_records tr\n        JOIN students s ON tr.student_id = s.student_id\n        WHERE tr.semester = $1\n        AND tr.payment_status IN ('UNPAID', 'PARTIAL')\n        AND tr.due_date < CURRENT_DATE\n        ".concat(filters.faculty ? 'AND s.faculty = $2' : '', "\n        ORDER BY days_overdue DESC, tr.outstanding_amount DESC\n    "), filters.faculty ? [semester, filters.faculty] : [semester])];
            case 1:
                overdue = _a.sent();
                return [2 /*return*/, {
                        reportType: 'overdue',
                        semester: semester,
                        generatedAt: new Date(),
                        data: overdue
                    }];
        }
    });
}); };
// Delegate functions to specialized managers
exports.getDashboardData = dashboardManager_1.default.getDashboardData;
exports.getFinancialAnalytics = dashboardManager_1.default.getFinancialAnalytics;
exports.getAllPaymentStatus = paymentManager_1.default.getAllPaymentStatus;
exports.getStudentPaymentStatus = paymentManager_1.default.getStudentPaymentStatus;
exports.updatePaymentStatus = paymentManager_1.default.updatePaymentStatus;
exports.validatePayment = paymentManager_1.default.validatePayment;
exports.getPaymentAuditTrail = paymentManager_1.default.getPaymentAuditTrail;
exports.validatePaymentConditions = paymentManager_1.default.validatePaymentConditions;
exports.getAllReceipts = paymentManager_1.default.getAllReceipts;
exports.getReceiptById = paymentManager_1.default.getReceiptById;
exports.createReceipt = paymentManager_1.default.createReceipt;
exports.calculateTuition = tuitionManager_1.default.calculateTuitionForStudent;
exports.createTuitionRecord = tuitionManager_1.default.createTuitionRecord;
exports.getTuitionRecord = tuitionManager_1.default.getTuitionRecord;
exports.updateTuitionRecord = tuitionManager_1.default.updateTuitionRecord;
exports.deleteTuitionRecord = tuitionManager_1.default.deleteTuitionRecord;
exports.adjustTuition = tuitionManager_1.default.adjustTuition;
// Default export for compatibility
exports.default = {
    getCurrentSemester: exports.getCurrentSemester,
    getTuitionSettings: exports.getTuitionSettings,
    updateTuitionSettings: exports.updateTuitionSettings,
    validateTuitionSetting: exports.validateTuitionSetting,
    deleteTuitionSetting: exports.deleteTuitionSetting,
    generateFinancialReport: exports.generateFinancialReport,
    // Dashboard functions  
    getDashboardData: exports.getDashboardData,
    getFinancialAnalytics: exports.getFinancialAnalytics,
    // Payment functions
    getAllPaymentStatus: exports.getAllPaymentStatus,
    getStudentPaymentStatus: exports.getStudentPaymentStatus,
    updatePaymentStatus: exports.updatePaymentStatus,
    validatePayment: exports.validatePayment,
    getPaymentAuditTrail: exports.getPaymentAuditTrail,
    validatePaymentConditions: exports.validatePaymentConditions,
    getAllReceipts: exports.getAllReceipts,
    getReceiptById: exports.getReceiptById,
    createReceipt: exports.createReceipt,
    // Tuition functions
    calculateTuition: exports.calculateTuition,
    createTuitionRecord: exports.createTuitionRecord,
    getTuitionRecord: exports.getTuitionRecord,
    updateTuitionRecord: exports.updateTuitionRecord,
    deleteTuitionRecord: exports.deleteTuitionRecord,
    adjustTuition: exports.adjustTuition
};
