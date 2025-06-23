// User Service for master_cnpm database
import { DatabaseService } from '../database/databaseService';
import bcrypt from 'bcrypt';
import { IUser } from '../../models/user';

/**
 * User Service adapted for final_cnpm database structure
 */

// Token blacklist để quản lý đăng xuất
const tokenBlacklist = new Set<string>();



/**
 * Get user by email from master_cnpm database
 */
export const getUserByEmail = async (email: string) => {
    const username = email.split('@')[0];
    return await DatabaseService.queryOne<IUser>(
        `SELECT * FROM NGUOIDUNG WHERE TenDangNhap = $1`, [username]
    );
};

/**
 * Get user by TenDangNhap (username/email) from master_cnpm database
 */
export const getUserByUsername = async (username: string) => {
    return await DatabaseService.queryOne<IUser>(`SELECT * FROM NGUOIDUNG WHERE TenDangNhap = $1`, [username]);
};

/**
 * Get user by UserID from master_cnpm database
 */
export const getUserById = async (userId: string) => {
    return await DatabaseService.queryOne<IUser>(`SELECT * FROM NGUOIDUNG WHERE MaSoSinhVien = $1`, [userId]);
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

export const getAllUsers = async (
    whereClause: string,
    queryParams: any[],
    limit: number,
    offset: number
) => {
    try {
        console.log('Query params:', queryParams);
        console.log('Where clause:', whereClause);
        
        const result = await DatabaseService.query(`
            SELECT
                nguoidung.UserID AS id,
                COALESCE(sinhvien.HoTen, nguoidung.TenDangNhap) AS name,
                nguoidung.TenDangNhap AS studentId,
                nguoidung.MaNhom AS role,
                nguoidung.TrangThai AS status,
                COALESCE(khoa.TenKhoa, 'Phòng ban') AS department
            FROM NGUOIDUNG nguoidung
            LEFT JOIN SINHVIEN sinhvien ON nguoidung.MaSoSinhVien = sinhvien.MaSoSinhVien
            LEFT JOIN NGANHHOC nganh ON sinhvien.MaNganh = nganh.MaNganh
            LEFT JOIN KHOA khoa ON nganh.MaKhoa = khoa.MaKhoa
            ${whereClause}
            ORDER BY nguoidung.UserID DESC
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
        `, [...queryParams, limit, offset]);
        
        console.log('Query result:', result);
        return result;
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
    }
};

export const getUserCount = async (whereClause: string, queryParams: any[]) => {
    try {
        const result = await DatabaseService.queryOne<{ total: string }>(
            `SELECT COUNT(*) as total 
             FROM NGUOIDUNG nguoidung
             LEFT JOIN SINHVIEN sinhvien ON nguoidung.MaSoSinhVien = sinhvien.MaSoSinhVien
             LEFT JOIN NGANHHOC nganh ON sinhvien.MaNganh = nganh.MaNganh
             LEFT JOIN KHOA khoa ON nganh.MaKhoa = khoa.MaKhoa
             ${whereClause}`,
            queryParams
        );
        console.log('Count result:', result);
        return result;
    } catch (error) {
        console.error('Error in getUserCount:', error);
        throw error;
    }
};

export const getStudentById = async (studentId: string) => {
    return await DatabaseService.queryOne(
        `SELECT MaSoSinhVien FROM SINHVIEN WHERE MaSoSinhVien = $1`, [studentId]
    );
};

export const createUser = async (user: {
    username: string, userId: string, password: string, role: string, studentId?: string, status?: string
}) => {
    const query = user.role === 'N3' 
        ? `INSERT INTO NGUOIDUNG (TenDangNhap, UserID, MatKhau, MaNhom, MaSoSinhVien, TrangThai)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
        : `INSERT INTO NGUOIDUNG (TenDangNhap, UserID, MatKhau, MaNhom, TrangThai)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const params = user.role === 'N3' 
        ? [user.username, user.userId, user.password, user.role, user.studentId, user.status || 'active']
        : [user.username, user.userId, user.password, user.role, user.status || 'active'];

    return await DatabaseService.queryOne<IUser>(query, params);
};

export const updateUser = async (id: string, user: { name?: string, departmentId?: string, status?: string }) => {
    // Chỉ update các trường cho phép
    return await DatabaseService.query<IUser>(
        `UPDATE NGUOIDUNG 
         SET TrangThai = COALESCE($1, TrangThai)
         WHERE UserID = $2
         RETURNING *`,
        [user.status, id]
    );
};

export const deleteUser = async (id: string) => {
    try {
        await DatabaseService.query('BEGIN');

        const userQuery = `
            SELECT MaSoSinhVien 
            FROM NGUOIDUNG 
            WHERE UserID = $1
        `;
        const userResult = await DatabaseService.query(userQuery, [id]);
        const maSoSinhVien = userResult[0]?.MaSoSinhVien;

        if (maSoSinhVien) {
            // Xóa các phiếu đăng ký liên quan
            await DatabaseService.query(
                'DELETE FROM PHIEUDANGKY WHERE MaSoSinhVien = $1',
                [maSoSinhVien]
            );
        }

        // Xóa user
        const result = await DatabaseService.query(
            'DELETE FROM NGUOIDUNG WHERE UserID = $1 RETURNING *',
            [id]
        );

        await DatabaseService.query('COMMIT');
        return result;
    } catch (error) {
        await DatabaseService.query('ROLLBACK');
        console.error('Error in deleteUser:', error);
        throw error;
    }
};

export const changeUserStatus = async (id: string, status: boolean) => {
    return await DatabaseService.query<IUser>(
        `UPDATE NGUOIDUNG SET TrangThai = $1 WHERE id = $2 RETURNING *`,
        [status, id]
    );
};

export const getSystemConfigs = async () => {
    return await DatabaseService.query(`
        SELECT setting_key, setting_value, setting_type 
        FROM system_settings 
        WHERE setting_key IN (
            'max_users', 'allowed_domains', 'password_min_length',
            'password_require_numbers', 'password_require_special_chars',
            'session_timeout', 'maintenance_mode', 'backup_frequency'
        )
    `);
};

export const getDashboardStats = async () => {
    return await DatabaseService.queryOne(`
        SELECT 
            (SELECT COUNT(*) FROM NGUOIDUNG WHERE MaNhom = 'N3') as "totalStudents",
            (SELECT COUNT(*) FROM PHIEUDANGKY WHERE SoTienConLai > 0) as "pendingPayments",
            (SELECT COUNT(*) FROM PHIEUDANGKY WHERE NgayLap >= CURRENT_DATE - INTERVAL '7 days') as "newRegistrations",
            (SELECT COUNT(*) FROM AUDIT_LOGS WHERE action_type = 'ERROR' AND created_at >= CURRENT_DATE - INTERVAL '7 days') as "systemAlerts"
    `);
};

export const updateSystemConfig = async (configKey: string, settingValue: any, settingType: string) => {
    return await DatabaseService.query(`
        INSERT INTO system_settings (setting_key, setting_value, setting_type, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (setting_key) 
        DO UPDATE SET 
            setting_value = EXCLUDED.setting_value,
            setting_type = EXCLUDED.setting_type,
            updated_at = NOW()
    `, [configKey, settingValue, settingType]);
};

export const getLastUser = async () => {
    return await DatabaseService.queryOne(
        'SELECT UserID FROM NGUOIDUNG ORDER BY UserID DESC LIMIT 1'
    );
};

export const updateStudentDepartment = async (studentId: string, newMajorId: string) => {
    return await DatabaseService.query(
        `UPDATE SINHVIEN SET MaNganh = $1 WHERE MaSoSinhVien = $2 RETURNING *`,
        [newMajorId, studentId]
    );
};

export const updateStudentInfo = async (studentId: string, name: string, majorId: string) => {
    return await DatabaseService.query(
        `UPDATE SINHVIEN SET HoTen = $1, MaNganh = $2 WHERE LOWER(MaSoSinhVien) = LOWER($3) RETURNING *`,
        [name, majorId, studentId]
    );
};

export const searchUsersByName = async (searchTerm: string) => {
    try {
        const result = await DatabaseService.query(`
            SELECT DISTINCT
                nguoidung.UserID AS id,
                COALESCE(sinhvien.HoTen, nguoidung.TenDangNhap) AS name,
                nguoidung.TenDangNhap AS studentId,
                nguoidung.MaNhom AS role,
                nguoidung.TrangThai AS status,
                COALESCE(khoa.TenKhoa, 'Phòng ban') AS department
            FROM NGUOIDUNG nguoidung
            LEFT JOIN SINHVIEN sinhvien ON nguoidung.MaSoSinhVien = sinhvien.MaSoSinhVien
            LEFT JOIN NGANHHOC nganh ON sinhvien.MaNganh = nganh.MaNganh
            LEFT JOIN KHOA khoa ON nganh.MaKhoa = khoa.MaKhoa
            WHERE LOWER(sinhvien.HoTen) LIKE LOWER($1)
            LIMIT 10
        `, [`%${searchTerm}%`]);
        
        return result;
    } catch (error) {
        console.error('Error in searchUsersByName:', error);
        throw error;
    }
};