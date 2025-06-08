// Auth Controller for final_cnpm database
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUserById, verifyPassword, blacklistToken, isTokenBlacklisted } from '../services/userService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES = '24h';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên đăng nhập và mật khẩu không được để trống' 
      });
    }

    // Get user from database
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không đúng' 
      });
    }

    // Verify password (handles both plain text and hashed passwords)
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không đúng' 
      });
    }

    // Define redirect URLs based on role
    const redirectMap: Record<string, string> = {
      'student': '/student',
      'financial': '/financial',
      'academic': '/academic',
      'admin': '/admin'
    };
    
    const redirectUrl = redirectMap[user.role] || '/';

    // Create JWT tokens
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        studentId: user.studentId 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${user.email} (${user.role})`);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
        groupName: user.groupName
      },
      token,
      refreshToken,
      redirectUrl
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server nội bộ' 
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

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
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
        role: user.role,
        studentId: user.studentId 
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
        studentId: user.studentId,
        groupName: user.groupName
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