import { Router } from 'express';
import { OpenCourseController } from '../../controllers/academicController/openCourse.controller';
import * as courseController from '../../controllers/academicController/course.controller';
import { semesterController } from '../../controllers/academicController/semester.controller';

const router = Router();

// Get all open courses
router.get('/', OpenCourseController.getAllCourses);

// Get available courses for dropdown (public endpoint)
router.get('/available-courses', courseController.getCoursesHandler);

// Get available semesters for dropdown (public endpoint)
router.get('/available-semesters', semesterController.getAllSemesters);

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