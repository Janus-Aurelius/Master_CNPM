import { Router } from 'express';
import { studentController } from '../../controllers/academicController/student.controller';

const router = Router();

router.get('/', studentController.getStudents);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.get('/search', studentController.searchStudents);

export default router; 