// src/routes/financial/financial.routes.ts
import { Router } from 'express';
import financialController from '../../controllers/financialController/financialController';
import { validatePayment } from '../../middleware/validatePayment';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// Middleware is already applied in index.ts for all financial routes

// Dashboard
router.get('/dashboard', financialController.getDashboard);

// Payment Status Management
router.get('/payment-status', authenticateToken, financialController.getAllPaymentStatus);
router.get('/payment-status/:studentId', authenticateToken, financialController.getStudentPaymentStatus);
router.put('/payment-status/:studentId', authenticateToken, validatePayment, financialController.updatePaymentStatus);

// Tuition Management
router.get('/tuition-settings', authenticateToken, financialController.getTuitionSettings);
router.post('/tuition-settings', authenticateToken, financialController.createTuitionSetting);
router.put('/tuition-settings/:id', authenticateToken, financialController.updateTuitionSetting);
router.delete('/tuition-settings/:id', authenticateToken, financialController.deleteTuitionSetting);

// Payment Receipts
router.get('/receipts', authenticateToken, financialController.getAllReceipts);
router.get('/receipts/:id', authenticateToken, financialController.getReceiptById);
router.post('/receipts', authenticateToken, validatePayment, financialController.createReceipt);

// Payment Audit
router.get('/audit-logs', authenticateToken, financialController.getAuditLogs);
router.get('/audit-logs/:studentId', authenticateToken, financialController.getStudentAuditLogs);

export default router;