// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/Trong
// Sử dụng biến môi trường cho secret key
const secretKey = process.env.JWT_SECRET || '1234567890';

// Định nghĩa interface cho payload của token
<<<<<<< HEAD
=======
const secretKey = process.env.JWT_SECRET || '1234567890';

>>>>>>> origin/Trung
=======
>>>>>>> origin/Trong
interface UserPayload {
    id: number;
    role: string;
}

// Add type declaration for the user property on Request
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    // Check both cookie and Authorization header
<<<<<<< HEAD
<<<<<<< HEAD
    const token = 
        (req.headers.authorization && req.headers.authorization.split(' ')[1]) || 
=======
    const token =
        (req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
>>>>>>> origin/Trung
=======
    const token = 
        (req.headers.authorization && req.headers.authorization.split(' ')[1]) || 
>>>>>>> origin/Trong
        req.cookies?.auth_token;

    if (!token) {
        res.status(401).json({ error: 'No token provided' });
<<<<<<< HEAD
<<<<<<< HEAD
        return;
=======
        return; // Don't return the response object
>>>>>>> origin/Trung
=======
        return;
>>>>>>> origin/Trong
    }

    try {
        const decoded = jwt.verify(token, secretKey) as UserPayload;
        req.user = decoded;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/Trong
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ error: 'Failed to authenticate token' });
<<<<<<< HEAD
=======
        next(); // Call next() to continue
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(403).json({ error: 'Failed to authenticate token' });
        // Don't return the response object
>>>>>>> origin/Trung
=======
>>>>>>> origin/Trong
    }
};

export const authorizeRoles = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ error: 'Insufficient permissions' });
        }
    };
};