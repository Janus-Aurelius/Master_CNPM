// src/routes/financial/financialIndex.ts
import { Router } from 'express';
import dashboardRoutes from './dashboardRoutes';
import paymentRoutes from './paymentRoutes';
import configRoutes from './configRoutes';

const router = Router();

// Mount sub-routes
router.use('/dashboard', dashboardRoutes);
router.use('/payment', paymentRoutes);
router.use('/config', configRoutes);

// Health check endpoint for financial module
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Financial module is running',
        timestamp: new Date().toISOString(),
        modules: {
            dashboard: 'Available',
            payment: 'Available',
            config: 'Available'
        }
    });
});

export default router;
