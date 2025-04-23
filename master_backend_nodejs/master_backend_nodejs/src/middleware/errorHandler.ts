import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    errors?: any[];

    constructor(statusCode: number, message: string, errors?: any[]) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, errors?: any[]) {
        super(400, message, errors);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(401, message);
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Permission denied') {
        super(403, message);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(404, `${resource} not found`);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Log error
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errors: err.errors,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // Handle specific types of errors
    if (err.name === 'ValidationError') { // Mongoose validation error
        return res.status(400).json({
            status: 'fail',
            message: 'Validation Error',
            errors: Object.values(err).map((e: any) => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'fail',
            message: 'Token expired'
        });
    }

    // Handle unexpected errors
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && {
            error: err.message,
            stack: err.stack
        })
    });
}; 