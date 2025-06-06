import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class with additional information about HTTP status codes
 */
export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global error handler middleware
 * Handles both AppError instances (operational errors) and unexpected errors
 */
export const errorHandler = (
    err: Error | AppError | any,
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    // Handle AppError instances
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        return;
    }
    
    // Handle standard errors with status property (backward compatibility)
    if (err.status) {
        res.status(err.status).json({
            status: 'error',
            message: err.message || 'Error occurred'
        });
        return;
    }

    // Log all error stacks
    console.error('Error:', err.stack || err);

    // Default case: handle as 500 internal server error
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};
