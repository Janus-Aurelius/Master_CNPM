import express from 'express';
import {
    getCoursesHandler,
    getCourseByIdHandler,
    createCourseHandler,
    updateCourseHandler,
    deleteCourseHandler
} from '../../controllers/academicController/course.controller';

const router = express.Router();

// Course routes
router.get('/', getCoursesHandler);
router.get('/:id', getCourseByIdHandler);
router.post('/', createCourseHandler);
router.put('/:id', updateCourseHandler);
router.delete('/:id', deleteCourseHandler);

export default router; 