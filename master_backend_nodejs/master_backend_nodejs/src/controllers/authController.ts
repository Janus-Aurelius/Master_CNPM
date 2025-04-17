// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const secretKey = process.env.JWT_SECRET || '1234567890';
const TOKEN_EXPIRY = '24h';

// Static user store for demonstration
const users: User[] = [
    { id: 1, email: 'student@example.com', name: 'Student User', role: 'student', password: 'password', status: true },
    { id: 2, email: 'financial@example.com', name: 'Financial Dept', role: 'financial', password: 'password', status: true },
    { id: 3, email: 'academic@example.com', name: 'Academic Dept', role: 'academic', password: 'password', status: true },
    { id: 4, email: 'admin@example.com', name: 'Administrator', role: 'admin', password: 'password', status: true },
];

// Role to dashboard URL mapping
const ROLE_REDIRECTS: Record<string, string> = {
    'student': '/auth/student/dashboard',
    'academic': '/api/academic/dashboard',
    'financial': '/api/financial/dashboard',
    'admin': '/api/admin/dashboard'
};

// Implement the missing function
const findUserByCredentials = async (email: string, password: string): Promise<User | null> => {
    // In a real application, you would hash and check passwords securely
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByCredentials(email, password);

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            secretKey,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production'
        });

        // Use the ROLE_REDIRECTS map
        const redirectUrl = ROLE_REDIRECTS[user.role] || '/';

        res.json({
            success: true,
            token,
            redirectUrl,
            user: {
                id: user.id,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};