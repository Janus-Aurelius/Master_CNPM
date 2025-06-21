// src/routes/financial/dashboardRoutes.ts
import { Router } from 'express';
import { financialDashboardController } from '../../controllers/financialController/dashboardController';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// Apply authentication middleware
router.use(authenticateToken);

// Routes
router.get('/overview', financialDashboardController.getOverview.bind(financialDashboardController));
router.get('/recent-payments', financialDashboardController.getRecentPayments.bind(financialDashboardController));
router.get('/faculty-stats', financialDashboardController.getFacultyStats.bind(financialDashboardController));

export default router;
