// src/types/express/index.d.ts
import express from 'express';

// Chỉ declare global, không export interface ở đây để tránh lỗi linter

declare global {
    namespace Express {
        interface IAuthUser {
            id: number;
            email: string;
            role: 'student' | 'admin' | 'financial' | 'academic';
            studentId?: string; // nếu là sinh viên
            [key: string]: unknown;
        }
        interface Request {
            user?: IAuthUser;
        }
    }
}