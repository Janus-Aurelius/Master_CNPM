import express from 'express';
import {
    getCoursesHandler,
    getCourseByIdHandler,
    createCourseHandler,
    updateCourseHandler,
    deleteCourseHandler,
    getCourseTypesOnly
} from '../../controllers/academicController/course.controller';

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
    console.log(`Course route: ${req.method} ${req.path}`);
    next();
});

// Course routes
router.get('/', getCoursesHandler);
router.get('/types', getCourseTypesOnly); // Phải đặt trước /:id để tránh conflict
router.get('/:id', getCourseByIdHandler);
router.post('/', createCourseHandler);
router.put('/:id', updateCourseHandler);
router.delete('/:id', deleteCourseHandler);

export default router; 