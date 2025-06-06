// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUserById, blacklistToken, isTokenBlacklisted } from '../services/userService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES = '24h';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Bỏ qua trường role từ frontend (nếu có)

    // Kiểm tra email
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email không được để trống' 
      });
    }

    // Lấy thông tin người dùng từ mock service
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không đúng' 
      });
    }

    // Trong môi trường phát triển, kiểm tra mật khẩu đơn giản
    // Trong thực tế, cần sử dụng bcrypt
    if (password !== user.passwordHash) {
      return res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không đúng' 
      });
    }

    // Định nghĩa đường dẫn chuyển hướng dựa trên vai trò từ database
    const redirectMap: Record<string, string> = {
      'student': '/student',
      'financial': '/financial',
      'academic': '/academic',
      'admin': '/admin'
    };
    
    // Lấy đường dẫn chuyển hướng dựa vào vai trò từ database
    const redirectUrl = redirectMap[user.role] || '/';

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // Tạo refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Trả về thông tin người dùng và token
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      refreshToken,
      redirectUrl // Trả về đường dẫn chuyển hướng để frontend có thể redirect
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã có lỗi xảy ra khi đăng nhập' 
    });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // Thêm token vào blacklist nếu có
    if (token) {
      blacklistToken(token);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Đăng xuất thành công' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Đã có lỗi xảy ra khi đăng xuất' 
    });
  }
};

export const verifyToken = (req: Request, res: Response) => {
  try {
    // Token đã được xác thực trong middleware authenticateToken
    const user = req.user;
    res.status(200).json({ 
      success: true, 
      valid: true, 
      user 
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      valid: false 
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: refreshTokenValue } = req.body;

    if (!refreshTokenValue) {
      return res.status(400).json({ 
        success: false,
        message: 'Refresh token không được để trống' 
      });
    }

    // Kiểm tra token có trong blacklist không
    if (isTokenBlacklisted(refreshTokenValue)) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token đã hết hạn hoặc đã bị vô hiệu hóa' 
      });
    }

    // Xác thực refresh token
    const decoded = jwt.verify(refreshTokenValue, JWT_SECRET) as any;
    
    // Lấy thông tin người dùng
    const user = await getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token không hợp lệ' 
      });
    }

    // Tạo JWT token mới
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.status(200).json({ 
      success: true,
      token: newToken 
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Refresh token không hợp lệ hoặc đã hết hạn' 
    });
  }
};
