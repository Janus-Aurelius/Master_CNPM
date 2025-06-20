// Auth Controller for master_cnpm database
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUserById, verifyPassword, blacklistToken, isTokenBlacklisted } from '../services/userService';
import bcrypt from 'bcrypt';
import { Database } from '../config/database';
import { config } from '../config';

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES = '24h';

// Map database group codes to roles
const GROUP_TO_ROLE: Record<string, string> = {
  'N1': 'admin',
  'N2': 'academic',
  'N3': 'student',
  'N4': 'financial'
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('=== Login Request ===');
    console.log('Request body:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'
      });
    }

    console.log('Attempting database connection...');
    // Query user from database
    const result = await Database.query(
      'SELECT * FROM NGUOIDUNG WHERE TenDangNhap = $1',
      [username]
    );    console.log('Database query result:', result);
    console.log('📋 Raw user object from DB:', JSON.stringify(result[0], null, 2));

    const user = result[0];

    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập không tồn tại'
      });
    }
      console.log('🔍 User fields:', {
      UserID: user.UserID || user.userid,
      TenDangNhap: user.TenDangNhap || user.tendangnhap,
      MaSoSinhVien: user.MaSoSinhVien || user.masosinhvien,
      MaNhom: user.MaNhom || user.manhom
    });
      // Chuẩn hóa các field từ database (PostgreSQL có thể trả về lowercase)
    const userId = user.UserID || user.userid;
    const userUsername = user.TenDangNhap || user.tendangnhap;
    const studentId = user.MaSoSinhVien || user.masosinhvien;
    const groupCode = user.MaNhom || user.manhom;    // Check password (note: database column is lowercase)
    const isPasswordValid = password === (user.MatKhau || user.matkhau);
    console.log('Password validation:', { 
      isPasswordValid, 
      providedPassword: password, 
      storedPassword: user.MatKhau || user.matkhau 
    });

    if (!isPasswordValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // Map group code to role (sử dụng field đã chuẩn hóa)
    const role = GROUP_TO_ROLE[groupCode] || 'unknown';
    console.log('Mapped role:', { groupCode, role });    console.log('Generating JWT tokens...');
    // Generate JWT token (sử dụng fields đã chuẩn hóa)
    const token = jwt.sign(
      { 
        id: userId,
        username: userUsername,
        role: role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        id: userId,
        username: userUsername,
        role: role
      },
      JWT_SECRET + '_refresh',
      { expiresIn: '7d' }
    );

    // Determine redirect URL based on role
    let redirectUrl = '/';
    switch (role) {
      case 'admin':
        redirectUrl = '/admin';
        break;
      case 'academic':
        redirectUrl = '/academic';
        break;
      case 'student':
        redirectUrl = '/student';
        break;
      case 'financial':
        redirectUrl = '/financial';
        break;
    }    console.log('Login successful:', { 
      username: userUsername, 
      role,
      redirectUrl 
    });
    
    const responseData = {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: userId,
          username: userUsername,
          role: role,
          studentId: studentId
        },
        token,
        refreshToken,
        redirectUrl
      }
    };
    
    console.log('🎯 Backend sending response:', JSON.stringify(responseData, null, 2));
    console.log('👤 User object being sent:', responseData.data.user);
    
    res.json(responseData);

  } catch (error) {
    console.error('=== Login Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra khi đăng nhập',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      blacklistToken(token);
    }

    res.json({ 
      success: true, 
      message: 'Đăng xuất thành công' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server nội bộ' 
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token không được cung cấp' 
      });
    }

    const decoded = jwt.verify(refreshToken, JWT_SECRET + '_refresh') as any;
    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Người dùng không tồn tại' 
      });
    }

    const newToken = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      success: true,
      token: newToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Refresh token không hợp lệ' 
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.user?.id?.toString() || '');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Người dùng không tồn tại' 
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server nội bộ' 
    });
  }
};