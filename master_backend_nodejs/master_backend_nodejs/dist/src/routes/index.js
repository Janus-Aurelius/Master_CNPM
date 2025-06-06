"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var student_routes_1 = __importDefault(require("./student/student.routes"));
var router = (0, express_1.Router)();
// Student routes
router.use('/student', student_routes_1.default);
// Các route khác sẽ được thêm vào sau khi hoàn thiện
// router.use('/auth', authRoutes);
// router.use('/academic', academicRoutes);
// router.use('/financial', financialRoutes);
// router.use('/admin', adminRoutes);
exports.default = router;
