import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

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
            .isFloat({ min: 0 })
            .withMessage('Amount must be greater than 0'),
        body('paymentMethod')
            .isString()
            .notEmpty()
            .withMessage('Payment method is required'),
        body('semester')
            .isString()
            .notEmpty()
            .withMessage('Semester is required'),
        body('status')
            .isString()
            .isIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])
            .withMessage('Invalid payment status'),
        body('paymentDate')
            .isISO8601()
            .withMessage('Invalid payment date format'),
        body('notes')
            .optional()
            .isString()
            .withMessage('Notes must be a string')
    ];
};

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

export const validatePayment = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(paymentValidationRules().map(validation => validation.run(req)));
    validate(req, res, next);
}; 