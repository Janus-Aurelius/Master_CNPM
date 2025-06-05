import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const registrationValidationRules = (): ValidationChain[] => {
    return [
        body('studentId')
            .isString()
            .notEmpty()
            .withMessage('Student ID is required')
            .matches(/^\d{8}$/)
            .withMessage('Student ID must be 8 digits'),
        body('courseId')
            .isString()
            .notEmpty()
            .withMessage('Course ID is required')
            .matches(/^[A-Z]{2}\d{3}$/)
            .withMessage('Course ID must be 2 uppercase letters followed by 3 digits'),
        body('semester')
            .isString()
            .notEmpty()
            .withMessage('Semester is required')
            .matches(/^HK[1-3] \d{4}-\d{4}$/)
            .withMessage('Semester must be in format: HK1 2023-2024')
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

export const validateRegistration = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(registrationValidationRules().map(validation => validation.run(req)));
    validate(req, res, next);
}; 