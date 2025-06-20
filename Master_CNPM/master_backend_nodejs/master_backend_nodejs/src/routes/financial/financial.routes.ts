// src/routes/financial/financial.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import financialRoutes from './financialIndex';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

// Apply authentication middleware to all financial routes
router.use(authenticateToken);

// Mount the new refactored financial routes
router.use('/', financialRoutes);

// Mount dashboard routes
router.use('/dashboard', dashboardRoutes);

export default router;