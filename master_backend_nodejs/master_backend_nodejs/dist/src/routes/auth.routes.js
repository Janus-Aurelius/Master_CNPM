"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
var express_1 = require("express");
var maintenance_1 = require("../middleware/maintenance");
// Import controller functions
var authController = require('../controllers/authController');
var router = (0, express_1.Router)();
/**
 * @route   POST /auth/login
 * @desc    Đăng nhập và nhận JWT token
 * @access  Public
 */
router.post('/login', maintenance_1.checkMaintenance, authController.login);
/**
 * @route   POST /auth/logout
 * @desc    Đăng xuất (vô hiệu hóa token)
 * @access  Public
 */
router.post('/logout', authController.logout);
/**
 * @route   GET /verify
 * @desc    Xác thực token hiện tại
 * @access  Private
 */
router.get('/verify', authController.verifyToken);
/**
 * @route   POST /refresh
 * @desc    Làm mới token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);
exports.default = router;
