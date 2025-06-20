// src/routes/auth.routes.ts
import { Router, RequestHandler } from 'express';
import { checkMaintenance } from '../middleware/maintenance';
import * as authController from '../controllers/authController';

const router = Router();

/**
 * @route   POST /auth/login
 * @desc    Đăng nhập và nhận JWT token
 * @access  Public
 */
router.post('/login', checkMaintenance as RequestHandler, authController.login as RequestHandler);

/**
 * @route   POST /auth/logout
 * @desc    Đăng xuất (vô hiệu hóa token)
 * @access  Public
 */
router.post('/logout', authController.logout as RequestHandler);

/**
 * @route   GET /verify
 * @desc    Xác thực token hiện tại
 * @access  Private
 */
router.get('/verify', authController.me as RequestHandler);

/**
 * @route   POST /refresh
 * @desc    Làm mới token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken as RequestHandler);

export default router;