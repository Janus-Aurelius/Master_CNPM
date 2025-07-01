import { Router } from 'express';
import { semesterController } from '../../controllers/academicController/semester.controller';
import { authenticateToken, authorizeRoles } from '../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Routes for semester management
router.get('/', semesterController.getAllSemesters);
router.get('/current', semesterController.getCurrentSemester);
router.get('/search', semesterController.searchSemesters);
router.get('/year/:year', semesterController.getSemestersByYear);
router.get('/:id', semesterController.getSemesterById);

// Routes that require academic role
router.post('/', authorizeRoles(['academic', 'admin']), semesterController.createSemester);
router.put('/:id', authorizeRoles(['academic', 'admin']), semesterController.updateSemester);
router.put('/:id/status', authorizeRoles(['academic', 'admin']), semesterController.updateSemesterStatus);
router.delete('/:id', authorizeRoles(['academic', 'admin']), semesterController.deleteSemester);

export default router;
