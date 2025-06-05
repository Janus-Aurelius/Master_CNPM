import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const studentValidationRules = (): ValidationChain[] => {
    return [
        body('studentId')
            .isString()
            .notEmpty()
            .withMessage('Student ID is required'),
        body('name')
            .isString()
            .notEmpty()
            .withMessage('Name is required'),
        body('email')
            .isEmail()
            .withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        body('class')
            .isString()
            .notEmpty()
            .withMessage('Class is required'),
        body('major')
            .isString()
            .notEmpty()
            .withMessage('Major is required')
    ];
};

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 'error',
            errors: errors.array() 
        });
    }
    next();
};

export const validateStudent = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(studentValidationRules().map(validation => validation.run(req)));
    validate(req, res, next);
}; 