// src/routes/financial/financial.routes.ts
import { Router } from 'express';
import * as financialController from '../../controllers/financialController/financialController';
import defaultFinancialController from '../../controllers/financialController/financialController';

const router = Router();

// Middleware is already applied in index.ts for all financial routes

// Dashboard
router.get('/dashboard', financialController.getDashboard);

// Payment Status Management  
router.get('/payment-status', financialController.getAllPaymentStatus);
router.get('/payment-status/:studentId', financialController.getStudentPaymentStatus);
router.put('/payment-status/:studentId', financialController.updatePaymentStatus);

// Tuition Adjustment
router.get('/tuition-adjustment', financialController.getTuitionSettings);
router.put('/tuition-adjustment', financialController.updateTuitionSettings);

// Unpaid Report
router.get('/unpaid-report', defaultFinancialController.getUnpaidTuitionReport);

export default router;