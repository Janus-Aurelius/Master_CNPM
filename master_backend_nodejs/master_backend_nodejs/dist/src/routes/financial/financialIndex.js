"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/financial/financialIndex.ts
var express_1 = require("express");
var dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
var paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
var configRoutes_1 = __importDefault(require("./configRoutes"));
var router = (0, express_1.Router)();
// Mount sub-routes
router.use('/dashboard', dashboardRoutes_1.default);
router.use('/payment', paymentRoutes_1.default);
router.use('/config', configRoutes_1.default);
// Health check endpoint for financial module
router.get('/health', function (req, res) {
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
exports.default = router;
