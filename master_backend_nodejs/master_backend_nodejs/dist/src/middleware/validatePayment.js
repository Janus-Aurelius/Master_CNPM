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
exports.validateBatchCourseTypePrice = exports.validateCourseTypePrice = exports.validatePriorityObject = exports.validatePayment = void 0;
var express_validator_1 = require("express-validator");
// Payment validation rules based on IPaymentData interface
var paymentValidationRules = function () {
    return [
        (0, express_validator_1.body)('studentId')
            .isString()
            .notEmpty()
            .withMessage('Student ID is required'),
        (0, express_validator_1.body)('amount')
            .isNumeric()
            .notEmpty()
            .withMessage('Amount is required')
            .isFloat({ min: 1 })
            .withMessage('Amount must be greater than 0'),
        (0, express_validator_1.body)('paymentMethod')
            .isString()
            .notEmpty()
            .withMessage('Payment method is required')
            .isIn(['cash', 'bank_transfer', 'momo', 'vnpay'])
            .withMessage('Invalid payment method. Must be: cash, bank_transfer, momo, vnpay'),
        (0, express_validator_1.body)('semester')
            .isString()
            .notEmpty()
            .withMessage('Semester is required'), (0, express_validator_1.body)('status')
            .optional()
            .isString()
            .isIn(['PAID', 'UNPAID', 'NOT_OPENED'])
            .withMessage('Invalid payment status. Must be: PAID, UNPAID, NOT_OPENED'),
        (0, express_validator_1.body)('paymentDate')
            .isISO8601()
            .withMessage('Invalid payment date format (ISO8601 required)'),
        (0, express_validator_1.body)('notes')
            .optional()
            .isString()
            .isLength({ max: 500 })
            .withMessage('Notes must be a string and cannot exceed 500 characters'),
        (0, express_validator_1.body)('receiptNumber')
            .optional()
            .isString()
            .isLength({ max: 50 })
            .withMessage('Receipt number cannot exceed 50 characters')
    ];
};
// Priority object validation rules
var priorityObjectValidationRules = function () {
    return [
        (0, express_validator_1.body)('priorityId')
            .isString()
            .notEmpty()
            .withMessage('Priority ID is required')
            .isLength({ max: 20 })
            .withMessage('Priority ID cannot exceed 20 characters'),
        (0, express_validator_1.body)('priorityName')
            .isString()
            .notEmpty()
            .withMessage('Priority name is required')
            .isLength({ max: 100 })
            .withMessage('Priority name cannot exceed 100 characters'),
        (0, express_validator_1.body)('discountAmount')
            .isNumeric()
            .notEmpty()
            .withMessage('Discount amount is required')
            .isFloat({ min: 0, max: 50000000 })
            .withMessage('Discount amount must be between 0 and 50,000,000 VND')
    ];
};
// Course type price validation rules
var courseTypePriceValidationRules = function () {
    return [
        (0, express_validator_1.body)('newPrice')
            .isNumeric()
            .notEmpty()
            .withMessage('New price is required')
            .isFloat({ min: 100000, max: 5000000 })
            .withMessage('Price per credit must be between 100,000 and 5,000,000 VND')
    ];
};
// Batch course type price update validation
var batchCourseTypePriceValidationRules = function () {
    return [
        (0, express_validator_1.body)('updates')
            .isArray({ min: 1 })
            .withMessage('Updates array is required and must contain at least one item'),
        (0, express_validator_1.body)('updates.*.courseTypeId')
            .isString()
            .notEmpty()
            .withMessage('Course type ID is required for each update'),
        (0, express_validator_1.body)('updates.*.newPrice')
            .isNumeric()
            .isFloat({ min: 100000, max: 5000000 })
            .withMessage('New price must be between 100,000 and 5,000,000 VND for each update')
    ];
};
var validate = function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};
// Export validation middlewares
var validatePayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(paymentValidationRules().map(function (validation) { return validation.run(req); }))];
            case 1:
                _a.sent();
                validate(req, res, next);
                return [2 /*return*/];
        }
    });
}); };
exports.validatePayment = validatePayment;
var validatePriorityObject = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(priorityObjectValidationRules().map(function (validation) { return validation.run(req); }))];
            case 1:
                _a.sent();
                validate(req, res, next);
                return [2 /*return*/];
        }
    });
}); };
exports.validatePriorityObject = validatePriorityObject;
var validateCourseTypePrice = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(courseTypePriceValidationRules().map(function (validation) { return validation.run(req); }))];
            case 1:
                _a.sent();
                validate(req, res, next);
                return [2 /*return*/];
        }
    });
}); };
exports.validateCourseTypePrice = validateCourseTypePrice;
var validateBatchCourseTypePrice = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(batchCourseTypePriceValidationRules().map(function (validation) { return validation.run(req); }))];
            case 1:
                _a.sent();
                validate(req, res, next);
                return [2 /*return*/];
        }
    });
}); };
exports.validateBatchCourseTypePrice = validateBatchCourseTypePrice;
