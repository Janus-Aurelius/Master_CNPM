"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/financial/financial.routes.ts
var express_1 = require("express");
var financialController_1 = __importDefault(require("../../controllers/financialController/financialController"));
var validatePayment_1 = require("../../middleware/validatePayment");
var auth_1 = require("../../middleware/auth");
var router = (0, express_1.Router)();
// Middleware is already applied in index.ts for all financial routes
// Dashboard
router.get('/dashboard', financialController_1.default.getDashboard);
// Payment Status Management
router.get('/payment-status', auth_1.authenticateToken, financialController_1.default.getAllPaymentStatus);
router.get('/payment-status/:studentId', auth_1.authenticateToken, financialController_1.default.getStudentPaymentStatus);
router.put('/payment-status/:studentId', auth_1.authenticateToken, validatePayment_1.validatePayment, financialController_1.default.updatePaymentStatus);
// Tuition Management
router.get('/tuition-settings', auth_1.authenticateToken, financialController_1.default.getTuitionSettings);
router.post('/tuition-settings', auth_1.authenticateToken, financialController_1.default.createTuitionSetting);
router.put('/tuition-settings/:id', auth_1.authenticateToken, financialController_1.default.updateTuitionSetting);
router.delete('/tuition-settings/:id', auth_1.authenticateToken, financialController_1.default.deleteTuitionSetting);
// Payment Receipts
router.get('/receipts', auth_1.authenticateToken, financialController_1.default.getAllReceipts);
router.get('/receipts/:id', auth_1.authenticateToken, financialController_1.default.getReceiptById);
router.post('/receipts', auth_1.authenticateToken, validatePayment_1.validatePayment, financialController_1.default.createReceipt);
// Payment Audit
router.get('/audit-logs', auth_1.authenticateToken, financialController_1.default.getAuditLogs);
router.get('/audit-logs/:studentId', auth_1.authenticateToken, financialController_1.default.getStudentAuditLogs);
exports.default = router;
