"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = require("../../controllers/AdminController/userController");
var maintenanceController_1 = __importDefault(require("../../controllers/AdminController/maintenanceController"));
var adminController_1 = require("../../controllers/AdminController/adminController");
var auth_1 = require("../../middleware/auth");
var maintenance_1 = require("../../middleware/maintenance");
var roleController_1 = require("../../controllers/AdminController/roleController");
var systemController_1 = require("../../controllers/AdminController/systemController");
var router = express_1.default.Router();
var userController = new userController_1.UserController();
var roleController = new roleController_1.RoleController();
// Middleware setup
router.use(auth_1.authenticateToken, (0, auth_1.authorizeRoles)(['admin']));
// Maintenance check middleware (excludes maintenance routes)
router.use(function (req, res, next) {
    if (req.path.startsWith('/maintenance')) {
        next();
    }
    else {
        (0, maintenance_1.checkMaintenance)(req, res, next);
    }
});
// Admin dashboard routes
router.get('/dashboard', function (req, res, next) { return adminController_1.adminController.getDashboard(req, res, next); });
router.get('/config', function (req, res, next) { return adminController_1.adminController.getConfig(req, res, next); });
router.get('/dashboard/audit-logs', function (req, res, next) { return adminController_1.adminController.getAuditLog(req, res, next); });
router.get('/dashboard/recent-activities', function (req, res, next) { return adminController_1.adminController.getRecentActivities(req, res, next); });
router.get('/dashboard/summary', function (req, res, next) { return adminController_1.adminController.getDashboard(req, res, next); });
// User management routes
router.get('/userManagement', function (req, res, next) { return adminController_1.adminController.getUserManagement(req, res, next); });
router.get('/users', function (req, res, next) { return userController.getAllUsers(req, res, next); });
router.get('/users/:id', function (req, res, next) { return userController.getUserById(req, res, next); });
router.post('/users', function (req, res, next) { return userController.createUser(req, res, next); });
router.put('/users/:id', function (req, res, next) { return userController.updateUser(req, res, next); });
router.delete('/users/:id', function (req, res, next) { return userController.deleteUser(req, res, next); });
router.patch('/users/:id/status', function (req, res, next) { return userController.changeUserStatus(req, res, next); });
router.get('/roles', function (req, res, next) { return roleController.getAllRoles(req, res, next); });
router.get('/users/search', function (req, res, next) { return userController.searchUsersByName(req, res, next); });
router.get('/users/advanced-search', function (req, res, next) { return userController.advancedSearch(req, res, next); });
// Maintenance routes (excluded from maintenance check)
router.get('/maintenance/status', function (req, res, next) { return maintenanceController_1.default.getMaintenanceStatus(req, res, next); });
router.post('/maintenance/enable', function (req, res, next) { return maintenanceController_1.default.enableMaintenance(req, res, next); });
router.post('/maintenance/disable', function (req, res, next) { return maintenanceController_1.default.disableMaintenance(req, res, next); });
router.put('/maintenance/message', function (req, res, next) { return maintenanceController_1.default.updateMaintenanceMessage(req, res, next); });
router.post('/maintenance/allowed-ips', function (req, res, next) { return maintenanceController_1.default.addAllowedIP(req, res, next); });
router.delete('/maintenance/allowed-ips', function (req, res, next) { return maintenanceController_1.default.removeAllowedIP(req, res, next); });
router.get('/system/getsecurity', function (req, res, next) { return systemController_1.securityController.getSecuritySettings(req, res, next); });
router.put('/system/updatesecurity', function (req, res, next) { return systemController_1.securityController.updateSecuritySettings(req, res, next); });
router.post('/system/maintenance', function (req, res, next) { return maintenanceController_1.default.toggleMaintenance(req, res, next); });
router.get('/system/audit-logs', function (req, res, next) { return adminController_1.adminController.getAuditLog(req, res, next); });
exports.default = router;
