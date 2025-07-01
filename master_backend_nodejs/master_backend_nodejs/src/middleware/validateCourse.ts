import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Tách validation rules
const courseValidationRules = (): ValidationChain[] => {
    return [
        body('name')
            .isString()
            .notEmpty()
            .withMessage('Course name is required'),
        body('credits')
            .isInt({ min: 1 })
            .withMessage('Credits must be a positive integer')
    ];
};

// Tách validation middleware
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

// Export middleware function
export const validateCourse = async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(courseValidationRules().map(validation => validation.run(req)));
    validate(req, res, next);
};