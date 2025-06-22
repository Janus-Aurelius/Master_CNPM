"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/financial/dashboardRoutes.ts
var express_1 = require("express");
var dashboardController_1 = require("../../controllers/financialController/dashboardController");
var auth_1 = require("../../middleware/auth");
var router = (0, express_1.Router)();
// Apply authentication middleware
router.use(auth_1.authenticateToken);
// Routes
router.get('/overview', dashboardController_1.financialDashboardController.getOverview.bind(dashboardController_1.financialDashboardController));
router.get('/recent-payments', dashboardController_1.financialDashboardController.getRecentPayments.bind(dashboardController_1.financialDashboardController));
router.get('/faculty-stats', dashboardController_1.financialDashboardController.getFacultyStats.bind(dashboardController_1.financialDashboardController));
exports.default = router;
