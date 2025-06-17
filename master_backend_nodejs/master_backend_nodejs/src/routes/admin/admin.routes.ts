import express, { RequestHandler } from 'express';
import { UserController } from '../../controllers/AdminController/userController';
import maintenanceController from '../../controllers/AdminController/maintenanceController';
import { adminController } from '../../controllers/AdminController/adminController';
import { authenticateToken, authorizeRoles } from '../../middleware/auth';
import { checkMaintenance } from '../../middleware/maintenance';
import { RoleController } from '../../controllers/AdminController/roleController';
import { securityController } from '../../controllers/AdminController/systemController';


const router = express.Router();
const userController = new UserController();
const roleController = new RoleController();
// Middleware setup
router.use(authenticateToken, authorizeRoles(['admin']));

// Maintenance check middleware (excludes maintenance routes)
router.use((req, res, next) => {
    if (req.path.startsWith('/maintenance')) {
        next();
    } else {
        checkMaintenance(req, res, next);
    }
});

// Admin dashboard routes
router.get('/dashboard', (req, res, next) => adminController.getDashboard(req, res, next));
router.get('/config', (req, res, next) => adminController.getConfig(req, res, next));
router.get('/dashboard/audit-logs', (req, res, next) => adminController.getAuditLog(req, res, next));
router.get('/dashboard/recent-activities', (req, res, next) => adminController.getRecentActivities(req, res, next));
router.get('/dashboard/summary', (req, res, next) => adminController.getDashboard(req, res, next));

// User management routes
router.get('/userManagement', (req, res, next) => adminController.getUserManagement(req, res, next));
router.get('/users', (req, res, next) => userController.getAllUsers(req, res, next));
router.get('/users/:id', (req, res, next) => userController.getUserById(req, res, next));
router.post('/users', (req, res, next) => userController.createUser(req, res, next));
router.put('/users/:id', (req, res, next) => userController.updateUser(req, res, next));
router.delete('/users/:id', (req, res, next) => userController.deleteUser(req, res, next));
router.patch('/users/:id/status', (req, res, next) => userController.changeUserStatus(req, res, next));
router.get('/roles', (req, res, next) => roleController.getAllRoles(req, res, next));
router.get('/users/search', (req, res, next) => userController.searchUsersByName(req, res, next));
router.get('/users/advanced-search', (req, res, next) => userController.advancedSearch(req, res, next));

// Maintenance routes (excluded from maintenance check)
router.get('/maintenance/status', (req, res, next) => maintenanceController.getMaintenanceStatus(req, res, next));
router.post('/maintenance/enable', (req, res, next) => maintenanceController.enableMaintenance(req, res, next));
router.post('/maintenance/disable', (req, res, next) => maintenanceController.disableMaintenance(req, res, next));
router.put('/maintenance/message', (req, res, next) => maintenanceController.updateMaintenanceMessage(req, res, next));
router.post('/maintenance/allowed-ips', (req, res, next) => maintenanceController.addAllowedIP(req, res, next));
router.delete('/maintenance/allowed-ips', (req, res, next) => maintenanceController.removeAllowedIP(req, res, next));

router.get('/system/getsecurity', (req, res, next) => securityController.getSecuritySettings(req, res, next));
router.put('/system/updatesecurity', (req, res, next) => securityController.updateSecuritySettings(req, res, next));
router.post('/system/maintenance', (req, res, next) => maintenanceController.toggleMaintenance(req, res, next));
router.get('/system/audit-logs', (req, res, next) => adminController.getAuditLog(req, res, next));

export default router;