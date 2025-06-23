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

// Thêm 2 route mới cho dashboard
router.get('/semesters', financialDashboardController.getSemesters.bind(financialDashboardController));
router.get('/faculty-stats', financialDashboardController.getFacultyStatsBySemester.bind(financialDashboardController));

export default router;
