// src/routes/student.routes.ts
import express from 'express';
import userController from '../controllers/userController';
import maintenanceController from '../controllers/maintenanceController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { checkMaintenance } from '../middleware/maintenance';

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken, authorizeRoles(['admin']));

// Admin dashboard routes
router.get('/dashboard', (req: express.Request, res: express.Response) => {
    res.json({ data: 'Admin dashboard' });
});

router.get('/userManagement', (req: express.Request, res: express.Response) => {
    res.json({ data: 'Admin user management' });
});

router.get('/config', (req: express.Request, res: express.Response) => {
    res.json({ data: 'Admin server configuration' });
});

// User management routes
router.get('/users', (req: express.Request, res: express.Response) => {
    userController.getAllUsers(req, res);
});

router.get('/users/:id', (req: express.Request, res: express.Response) => {
    userController.getUserById(req, res);
});

router.post('/users', (req: express.Request, res: express.Response) => {
    userController.createUser(req, res);
});

router.put('/users/:id', (req: express.Request, res: express.Response) => {
    userController.updateUser(req, res);
});

router.delete('/users/:id', (req: express.Request, res: express.Response) => {
    userController.deleteUser(req, res);
});

router.patch('/users/:id/status', (req: express.Request, res: express.Response) => {
    userController.changeUserStatus(req, res);
});

// Maintenance routes
router.get('/maintenance/status', (req: express.Request, res: express.Response) => {
    maintenanceController.getMaintenanceStatus(req, res);
});

router.post('/maintenance/enable', (req: express.Request, res: express.Response) => {
    maintenanceController.enableMaintenance(req, res);
});

router.post('/maintenance/disable', (req: express.Request, res: express.Response) => {
    maintenanceController.disableMaintenance(req, res);
});

router.put('/maintenance/message', (req: express.Request, res: express.Response) => {
    maintenanceController.updateMaintenanceMessage(req, res);
});

router.post('/maintenance/allowed-ips', (req: express.Request, res: express.Response) => {
    maintenanceController.addAllowedIP(req, res);
});

router.delete('/maintenance/allowed-ips', (req: express.Request, res: express.Response) => {
    maintenanceController.removeAllowedIP(req, res);
});

export default router;