import { Router } from 'express';
import { OpenCourseController } from '../../controllers/academicController/openCourse.controller';

const router = Router();

// Get all courses
router.get('/', OpenCourseController.getAllCourses);

// Get course by semesterId and courseId
router.get('/:semesterId/:courseId', OpenCourseController.getCourseById);

// Create new course
router.post('/', OpenCourseController.createCourse);

// Update course
router.put('/:semesterId/:courseId', OpenCourseController.updateCourse);

// Delete course
router.delete('/:semesterId/:courseId', OpenCourseController.deleteCourse);

// Get courses by status
router.get('/status/:status', OpenCourseController.getCoursesByStatus);

// Get courses by semester
router.get('/semester', OpenCourseController.getCoursesBySemester);

// Update course status
router.patch('/:semesterId/:courseId/status', OpenCourseController.updateCourseStatus);

export default router;