import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Payment validation rules based on IPaymentData interface
const paymentValidationRules = (): ValidationChain[] => {
    return [
        body('studentId')
            .isString()
            .notEmpty()
            .withMessage('Student ID is required'),
        body('amount')
            .isNumeric()
            .notEmpty()
            .withMessage('Amount is required')
            .isFloat({ min: 1 })
            .withMessage('Amount must be greater than 0'),
        body('paymentMethod')
            .isString()
            .notEmpty()
            .withMessage('Payment method is required')
            .isIn(['cash', 'bank_transfer', 'momo', 'vnpay'])
            .withMessage('Invalid payment method. Must be: cash, bank_transfer, momo, vnpay'),
        body('semester')
            .isString()
            .notEmpty()
            .withMessage('Semester is required'),
        body('status')
            .optional()
            .isString()
            .isIn(['PAID', 'PARTIAL', 'UNPAID'])
            .withMessage('Invalid payment status. Must be: PAID, PARTIAL, UNPAID'),
        body('paymentDate')
            .isISO8601()
            .withMessage('Invalid payment date format (ISO8601 required)'),
        body('notes')
            .optional()
            .isString()
            .isLength({ max: 500 })
            .withMessage('Notes must be a string and cannot exceed 500 characters'),
        body('receiptNumber')
            .optional()
            .isString()
            .isLength({ max: 50 })
            .withMessage('Receipt number cannot exceed 50 characters')
    ];
};

// Priority object validation rules
const priorityObjectValidationRules = (): ValidationChain[] => {
    return [
        body('priorityId')
            .isString()
            .notEmpty()
            .withMessage('Priority ID is required')
            .isLength({ max: 20 })
            .withMessage('Priority ID cannot exceed 20 characters'),
        body('priorityName')
            .isString()
            .notEmpty()
            .withMessage('Priority name is required')
            .isLength({ max: 100 })
            .withMessage('Priority name cannot exceed 100 characters'),
        body('discountAmount')
            .isNumeric()
            .notEmpty()
            .withMessage('Discount amount is required')
            .isFloat({ min: 0, max: 50000000 })
            .withMessage('Discount amount must be between 0 and 50,000,000 VND')
    ];
};

// Course type price validation rules
const courseTypePriceValidationRules = (): ValidationChain[] => {
    return [
        body('newPrice')
            .isNumeric()
            .notEmpty()
            .withMessage('New price is required')
            .isFloat({ min: 100000, max: 5000000 })
            .withMessage('Price per credit must be between 100,000 and 5,000,000 VND')
    ];
};

// Batch course type price update validation
const batchCourseTypePriceValidationRules = (): ValidationChain[] => {
    return [
        body('updates')
            .isArray({ min: 1 })
            .withMessage('Updates array is required and must contain at least one item'),
        body('updates.*.courseTypeId')
            .isString()
            .notEmpty()
            .withMessage('Course type ID is required for each update'),
        body('updates.*.newPrice')
            .isNumeric()
            .isFloat({ min: 100000, max: 5000000 })
            .withMessage('New price must be between 100,000 and 5,000,000 VND for each update')
    ];
};

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
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
export const validatePayment = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(paymentValidationRules().map(validation => validation.run(req)));
    validate(req, res, next);
};

export const validatePriorityObject = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(priorityObjectValidationRules().map(validation => validation.run(req)));
    validate(req, res, next);
};

export const validateCourseTypePrice = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(courseTypePriceValidationRules().map(validation => validation.run(req)));
    validate(req, res, next);
};

export const validateBatchCourseTypePrice = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(batchCourseTypePriceValidationRules().map(validation => validation.run(req)));
    validate(req, res, next);
};