// src/routes/financial/dashboardRoutes.ts
import { Router, Request, Response } from 'express';
import { financialDashboardController } from '../../controllers/financialController/dashboardController';

const router = Router();

// Dashboard overview
router.get('/overview', async (req: Request, res: Response) => {
    await financialDashboardController.getDashboardOverview(req, res);
});

// Semester comparison
router.get('/comparison', async (req: Request, res: Response) => {
    await financialDashboardController.getSemesterComparison(req, res);
});

// Payment analytics
router.get('/analytics', async (req: Request, res: Response) => {
    await financialDashboardController.getPaymentAnalytics(req, res);
});

// Export dashboard data
router.get('/export', async (req: Request, res: Response) => {
    await financialDashboardController.exportDashboardData(req, res);
});

export default router;
