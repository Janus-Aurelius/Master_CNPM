// src/routes/financial/paymentRoutes.ts
import { Router, Request, Response } from 'express';
import { financialPaymentController } from '../../controllers/financialController/paymentController';
import { validatePayment } from '../../middleware/validatePayment';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// Get payment status list
router.get('/status', async (req: Request, res: Response) => {
    await financialPaymentController.getPaymentStatusList(req, res);
});

// Get student payment history
router.get('/history/:studentId', async (req: Request, res: Response) => {
    await financialPaymentController.getStudentPaymentHistory(req, res);
});

// Confirm payment (with validation)
router.post('/confirm', 
    authenticateToken,
    validatePayment,
    async (req: Request, res: Response) => {
        await financialPaymentController.confirmPayment(req, res);
    }
);

// Get payment receipt
router.get('/receipt/:paymentId', async (req: Request, res: Response) => {
    await financialPaymentController.getPaymentReceipt(req, res);
});

// Get payment audit trail
router.get('/audit', async (req: Request, res: Response) => {
    await financialPaymentController.getPaymentAudit(req, res);
});

// Get payment statistics
router.get('/statistics', async (req: Request, res: Response) => {
    await financialPaymentController.getPaymentStatistics(req, res);
});

export default router;
