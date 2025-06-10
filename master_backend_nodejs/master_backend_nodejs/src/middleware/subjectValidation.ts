import { Request, Response, NextFunction } from 'express';

export const validateSubjectData = (req: Request, res: Response, next: NextFunction): void => {
    const { subjectId, subjectName, subjectTypeId, totalHours } = req.body;
    
    const errors = [];
    if (!subjectId) errors.push('Subject ID is required');
    if (!subjectName) errors.push('Subject name is required');
    if (!subjectTypeId) errors.push('Subject type is required');
    if (!totalHours) errors.push('Total hours is required');
    
    if (errors.length > 0) {
        res.status(400).json({ 
            success: false, 
            message: 'Validation failed',
            errors 
        });
        return;
    }
    
    next();
};