"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/financial/financial.routes.ts
var express_1 = require("express");
var financialController_1 = __importDefault(require("../../controllers/financialController/financialController"));
var auth_1 = require("../../middleware/auth");
var router = (0, express_1.Router)();
// === PRIORITY OBJECT ROUTES ===
router.get('/priority-objects', auth_1.authenticateToken, financialController_1.default.getAllPriorityObjects);
router.get('/priority-objects/:id', auth_1.authenticateToken, financialController_1.default.getPriorityObjectById);
router.post('/priority-objects', auth_1.authenticateToken, financialController_1.default.createPriorityObject);
router.put('/priority-objects/:id', auth_1.authenticateToken, financialController_1.default.updatePriorityObject);
router.delete('/priority-objects/:id', auth_1.authenticateToken, financialController_1.default.deletePriorityObject);
// === COURSE TYPE ROUTES ===
router.get('/course-types', auth_1.authenticateToken, financialController_1.default.getAllCourseTypes);
router.get('/course-types/:id', auth_1.authenticateToken, financialController_1.default.getCourseTypeById);
router.post('/course-types', auth_1.authenticateToken, financialController_1.default.createCourseType);
router.put('/course-types/:id', auth_1.authenticateToken, financialController_1.default.updateCourseType);
router.delete('/course-types/:id', auth_1.authenticateToken, financialController_1.default.deleteCourseType);
router.get('/course-types/:id/courses', auth_1.authenticateToken, financialController_1.default.getCoursesUsingType);
exports.default = router;
