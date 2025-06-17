"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/financial/financial.routes.ts
var express_1 = require("express");
var auth_1 = require("../../middleware/auth");
var financialIndex_1 = __importDefault(require("./financialIndex"));
var router = (0, express_1.Router)();
// Apply authentication middleware to all financial routes
router.use(auth_1.authenticateToken);
// Mount the new refactored financial routes
router.use('/', financialIndex_1.default);
exports.default = router;
