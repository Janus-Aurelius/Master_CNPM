import { Router, Request, Response } from 'express';
import { studentController } from '../../controllers/academicController/student.controller';

const router = Router();

// Basic CRUD operations
router.get('/', studentController.getStudents as any);
router.post('/', studentController.createStudent as any);
router.put('/:id', studentController.updateStudent as any);
router.delete('/:id', studentController.deleteStudent as any);
router.get('/search', studentController.searchStudents as any);

// Form data and dropdown endpoints
router.get('/form-data', studentController.getStudentFormData as any);
router.get('/majors', studentController.getMajors as any);
router.get('/majors/:facultyId', studentController.getMajorsByFaculty as any);
router.get('/provinces', studentController.getProvinces as any);
router.get('/districts/province/:provinceId', studentController.getDistrictsByProvince as any);
router.get('/priority-groups', studentController.getPriorityGroups as any);

// Registration related endpoints
router.post('/bulk-registration', studentController.createBulkRegistrations as any);
router.get('/registration-status', studentController.checkRegistrationStatus as any);
router.get('/semesters', studentController.getSemesters as any);
router.get('/current-semester', studentController.getCurrentSemester as any);

export default router; 