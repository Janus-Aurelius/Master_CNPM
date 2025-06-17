// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { securityService } from '../services/AdminService/systemService';
import { AppError } from './errorHandler';


// Sử dụng biến môi trường hoặc giá trị mặc định
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Khai báo lại type cho payload của token (dựa trên cấu trúc đã dùng)
type UserPayload = {
  id: string;
  username: string;
  role: string;
  [key: string]: any;
};

// Khai báo type cho request.user
declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

// Middleware để xác thực JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = 
        (authHeader && authHeader.split(' ')[1]) ||
        req.cookies?.auth_token;
    if (!token) {
      res.status(401).json({ 
          success: false,
          message: 'Yêu cầu đăng nhập' 
      });
      return;
    }
    // Xác thực token
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    // Validate payload
    if (!decoded.id || !decoded.role || !decoded.username) {
      res.status(403).json({ 
          success: false,
          message: 'Token không hợp lệ' 
      });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Lỗi xác thực token:', error);
    res.status(403).json({ 
        success: false,
        message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' 
    });
  }
};

// Middleware để kiểm tra vai trò
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ 
            success: false,
            message: 'Yêu cầu đăng nhập' 
        });
        return;
      }
      
      if (!roles.includes(req.user.role)) {
        res.status(403).json({ 
            success: false,
            message: 'Bạn không có quyền truy cập chức năng này' 
        });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Lỗi phân quyền:', error);
      res.status(500).json({ 
          success: false,
          message: 'Đã có lỗi xảy ra khi kiểm tra quyền' 
      });
    }
  };
};

export const checkIPRestriction = async (req: Request, res: Response, next: NextFunction) => {
    const config = await securityService.getSecuritySettings();
    if (config.ipRestriction) {
        const allowedIPs = Array.isArray(config.allowedIPs) ? config.allowedIPs : [];
        const clientIP = req.ip || req.connection.remoteAddress;
        if (!allowedIPs.includes(clientIP)) {
            return res.status(403).json({ success: false, message: 'IP của bạn không được phép đăng nhập' });
        }
    }
    next();
};

export const checkLoginAttempts = async (req: Request, res: Response, next: NextFunction) => {
    const config = await securityService.getSecuritySettings();
    if (req.user) {
        if (req.user.failed_login_attempts >= config.loginAttempts) {
            throw new AppError(403, 'Tài khoản đã bị khóa do đăng nhập sai quá nhiều lần');
        }
    }
    next();
};

export const checkPasswordExpiry = async (req: Request, res: Response, next: NextFunction) => {
    const config = await securityService.getSecuritySettings();
    if (config.passwordExpiry > 0) {
        const user = req.user;
        if (user) {
            const lastChange = user.last_password_change || user.created_at;
            const daysSinceChange = (Date.now() - new Date(lastChange).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceChange > config.passwordExpiry) {
                throw new AppError(403, 'Mật khẩu đã hết hạn, vui lòng đổi mật khẩu');
            }
        }
    }
    next();
};

export const generateToken = async (payload: UserPayload) => {
    const securityConfig = await securityService.getSecuritySettings();
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: securityConfig.sessionTimeout * 60 });
    return token;
};



