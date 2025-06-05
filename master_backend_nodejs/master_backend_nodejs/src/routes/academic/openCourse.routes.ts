import { Router } from 'express';
import { OpenCourseController } from '../../controllers/academic/openCourse.controller';

const router = Router();

// Get all courses
router.get('/', OpenCourseController.getAllCourses);

// Get course by ID
router.get('/:id', OpenCourseController.getCourseById);

// Create new course
router.post('/', OpenCourseController.createCourse);

// Update course
router.put('/:id', OpenCourseController.updateCourse);

// Delete course
router.delete('/:id', OpenCourseController.deleteCourse);

// Get courses by status
router.get('/status/:status', OpenCourseController.getCoursesByStatus);

// Get courses by semester
router.get('/semester', OpenCourseController.getCoursesBySemester);

// Update course status
router.patch('/:id/status', OpenCourseController.updateCourseStatus);

export default router; 