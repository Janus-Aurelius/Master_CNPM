// User Service for final_cnpm database
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
    'N1': 'admin',        // Admin
    'N2': 'academic',     // Giảng viên
    'N3': 'student',      // Sinh viên
    'N4': 'financial'     // Kế toán
};

/**
 * Get user by username (tendangnhap) from final_cnpm database
 */
export const getUserByEmail = async (email: string) => {
    try {
        // Query nguoidung table with role information
        const dbUser = await DatabaseService.queryOne(`
            SELECT 
                nd.tendangnhap,
                nd.userid,
                nd.matkhau,
                nd.manhom,
                nd.masosinhvien,
                nnd.tennhom
            FROM nguoidung nd
            LEFT JOIN nhomnguoidung nnd ON nd.manhom = nnd.manhom
            WHERE nd.tendangnhap = $1
        `, [email]);

        if (dbUser) {
            // Get additional info if user is a student
            let additionalInfo = null;
            if (dbUser.masosinhvien) {
                additionalInfo = await DatabaseService.queryOne(`
                    SELECT 
                        sv.hoten,
                        sv.ngaysinh,
                        sv.gioitinh,
                        sv.manganh
                    FROM sinhvien sv
                    WHERE sv.masosinhvien = $1
                `, [dbUser.masosinhvien]);
            }

            return {
                id: dbUser.userid || dbUser.tendangnhap,
                email: dbUser.tendangnhap, // Using tendangnhap as email
                name: additionalInfo?.hoten || dbUser.tennhom || 'User',
                role: roleMapping[dbUser.manhom] || 'user',
                passwordHash: dbUser.matkhau,
                studentId: dbUser.masosinhvien,
                groupId: dbUser.manhom,
                groupName: dbUser.tennhom
            };
        }

        return null;
    } catch (error) {
        console.error('Database error in getUserByEmail:', error);
        return null;
    }
};

/**
 * Get user by ID from final_cnpm database
 */
export const getUserById = async (id: string) => {
    try {
        const dbUser = await DatabaseService.queryOne(`
            SELECT 
                nd.tendangnhap,
                nd.userid,
                nd.matkhau,
                nd.manhom,
                nd.masosinhvien,
                nnd.tennhom
            FROM nguoidung nd
            LEFT JOIN nhomnguoidung nnd ON nd.manhom = nnd.manhom
            WHERE nd.userid = $1 OR nd.tendangnhap = $1
        `, [id]);

        if (dbUser) {
            let additionalInfo = null;
            if (dbUser.masosinhvien) {
                additionalInfo = await DatabaseService.queryOne(`
                    SELECT 
                        sv.hoten,
                        sv.ngaysinh,
                        sv.gioitinh,
                        sv.manganh
                    FROM sinhvien sv
                    WHERE sv.masosinhvien = $1
                `, [dbUser.masosinhvien]);
            }

            return {
                id: dbUser.userid || dbUser.tendangnhap,
                email: dbUser.tendangnhap,
                name: additionalInfo?.hoten || dbUser.tennhom || 'User',
                role: roleMapping[dbUser.manhom] || 'user',
                passwordHash: dbUser.matkhau,
                studentId: dbUser.masosinhvien,
                groupId: dbUser.manhom,
                groupName: dbUser.tennhom
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