// src/routes/admin.routes.ts
import express, { RequestHandler } from 'express';
import { UserController } from '../controllers/AdminController/userController';
import maintenanceController from '../controllers/AdminController/maintenanceController';
import adminController from '../controllers/AdminController/adminController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { checkMaintenance } from '../middleware/maintenance';

const router = express.Router();
const userController = new UserController();

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
router.get('/userManagement', (req, res, next) => adminController.getUserManagement(req, res, next));
router.get('/config', (req, res, next) => adminController.getConfig(req, res, next));

// User management routes
router.get('/users', (req, res, next) => userController.getAllUsers(req, res, next));
router.get('/users/:id', (req, res, next) => userController.getUserById(req, res, next));
router.post('/users', (req, res, next) => userController.createUser(req, res, next));
router.put('/users/:id', (req, res, next) => userController.updateUser(req, res, next));
router.delete('/users/:id', (req, res, next) => userController.deleteUser(req, res, next));
router.patch('/users/:id/status', (req, res, next) => userController.changeUserStatus(req, res, next));

// Maintenance routes (excluded from maintenance check)
router.get('/maintenance/status', (req, res, next) => maintenanceController.getMaintenanceStatus(req, res, next));
router.post('/maintenance/enable', (req, res, next) => maintenanceController.enableMaintenance(req, res, next));
router.post('/maintenance/disable', (req, res, next) => maintenanceController.disableMaintenance(req, res, next));
router.put('/maintenance/message', (req, res, next) => maintenanceController.updateMaintenanceMessage(req, res, next));
router.post('/maintenance/allowed-ips', (req, res, next) => maintenanceController.addAllowedIP(req, res, next));
router.delete('/maintenance/allowed-ips', (req, res, next) => maintenanceController.removeAllowedIP(req, res, next));

export default router;