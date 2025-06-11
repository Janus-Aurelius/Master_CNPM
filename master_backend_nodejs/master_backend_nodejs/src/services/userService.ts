// User Service for master_cnpm database
import { DatabaseService } from './database/databaseService';
import bcrypt from 'bcrypt';

/**
 * User Service adapted for final_cnpm database structure
 */

// Token blacklist để quản lý đăng xuất
const tokenBlacklist = new Set<string>();

/**
 * Map database roles to application roles
 */
const roleMapping: Record<string, string> = {
    'admin': 'admin',
    'academic': 'academic',
    'student': 'student',
    'financial': 'financial'
};

/**
 * Get user by email from master_cnpm database
 */
export const getUserByEmail = async (email: string) => {
    try {
        // Query users table with role information
        const dbUser = await DatabaseService.queryOne(`
            SELECT 
                u.UserID,
                u.TenDangNhap,
                u.MatKhau,
                u.MaNhom,
                u.MaSoSinhVien
            FROM NGUOIDUNG u
            WHERE u.TenDangNhap = $1
        `, [email]);

        if (dbUser) {
            return {
                id: dbUser.UserID,
                email: dbUser.TenDangNhap,
                name: dbUser.TenDangNhap,
                role: dbUser.MaNhom,
                passwordHash: dbUser.MatKhau,
                status: dbUser.MaSoSinhVien
            };
        }

        return null;
    } catch (error) {
        console.error('Database error in getUserByEmail:', error);
        return null;
    }
};

/**
 * Get user by ID from master_cnpm database
 */
export const getUserById = async (id: string) => {
    try {
        const dbUser = await DatabaseService.queryOne(`
            SELECT 
                u.UserID,
                u.TenDangNhap,
                u.MatKhau,
                u.MaNhom,
                u.MaSoSinhVien
            FROM NGUOIDUNG u
            WHERE u.UserID = $1
        `, [id]);

        if (dbUser) {
            return {
                id: dbUser.UserID,
                email: dbUser.TenDangNhap,
                name: dbUser.TenDangNhap,
                role: dbUser.MaNhom,
                passwordHash: dbUser.MatKhau,
                status: dbUser.MaSoSinhVien
            };
        }

        return null;
    } catch (error) {
        console.error('Database error in getUserById:', error);
        return null;
    }
};

/**
 * Verify password - check if it's plain text or hashed
 */
export const verifyPassword = async (inputPassword: string, storedPassword: string): Promise<boolean> => {
    try {
        // Check if stored password is hashed (starts with $2b$)
        if (storedPassword.startsWith('$2b$')) {
            return await bcrypt.compare(inputPassword, storedPassword);
        } else {
            // Plain text comparison for existing data
            return inputPassword === storedPassword;
        }
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
};

// Token blacklist functions
export const blacklistToken = (token: string) => {
    tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token: string): boolean => {
    return tokenBlacklist.has(token);
};