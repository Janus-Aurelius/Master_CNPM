// src/routes/financial/financial.routes.ts
import { Router } from 'express';
import financialController from '../../controllers/financialController/financialController';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// === PRIORITY OBJECT ROUTES ===
router.get('/priority-objects', authenticateToken, financialController.getAllPriorityObjects);
router.get('/priority-objects/:id', authenticateToken, financialController.getPriorityObjectById);
router.post('/priority-objects', authenticateToken, financialController.createPriorityObject);
router.put('/priority-objects/:id', authenticateToken, financialController.updatePriorityObject);
router.delete('/priority-objects/:id', authenticateToken, financialController.deletePriorityObject);

// === COURSE TYPE ROUTES ===
router.get('/course-types', authenticateToken, financialController.getAllCourseTypes);
router.get('/course-types/:id', authenticateToken, financialController.getCourseTypeById);
router.post('/course-types', authenticateToken, financialController.createCourseType);
router.put('/course-types/:id', authenticateToken, financialController.updateCourseType);
router.delete('/course-types/:id', authenticateToken, financialController.deleteCourseType);
router.get('/course-types/:id/courses', authenticateToken, financialController.getCoursesUsingType);

export default router;