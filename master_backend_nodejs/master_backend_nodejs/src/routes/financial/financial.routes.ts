// src/routes/financial/financial.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth';
import financialRoutes from './financialIndex';

const router = Router();

// Apply authentication middleware to all financial routes
router.use(authenticateToken);

// Mount the new refactored financial routes
router.use('/', financialRoutes);

export default router;