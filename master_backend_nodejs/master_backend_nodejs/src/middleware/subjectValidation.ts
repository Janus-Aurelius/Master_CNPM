import { Request, Response, NextFunction } from 'express';

export const validateSubjectData = (req: Request, res: Response, next: NextFunction): void => {
    const { subjectCode, name, credits, type, department, lecturer, schedule } = req.body;
    
    const errors = [];
    if (!subjectCode) errors.push('Subject code is required');
    if (!name) errors.push('Subject name is required');
    if (!credits) errors.push('Credits is required');
    if (!type) errors.push('Type is required');
    if (!department) errors.push('Department is required');
    if (!lecturer) errors.push('Lecturer is required');
    
    if (!schedule) {
        errors.push('Schedule is required');
    } else {
        if (!schedule.day) errors.push('Day is required');
        if (!schedule.session) errors.push('Session is required');
        if (!schedule.fromTo) errors.push('Time is required');
        if (!schedule.room) errors.push('Room is required');
    }
    
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