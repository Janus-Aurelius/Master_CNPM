import { Router, Request, Response } from 'express';
import { studentController } from '../../controllers/academicController/student.controller';

const router = Router();

router.get('/', studentController.getStudents);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.get('/search', studentController.searchStudents);

// GET /api/academic/students/form-data
router.get('/form-data', studentController.getStudentFormData);

// POST /api/academic/students/bulk-registration
router.post('/bulk-registration', studentController.createBulkRegistrations as any);

// GET /api/academic/students/registration-status
router.get('/registration-status', studentController.checkStudentRegistrationStatus as any);

// GET /api/academic/students/semesters
router.get('/semesters', studentController.getSemesters as any);

// GET /api/academic/students/current-semester
router.get('/current-semester', studentController.getCurrentSemester as any);

export default router; 