import express from 'express';
import {
    getCoursesHandler,
    getCourseByIdHandler,
    createCourseHandler,
    updateCourseHandler,
    deleteCourseHandler
} from '../controllers/courseController';

const router = express.Router();

// Course routes
router.get('/', (req, res, next) => getCoursesHandler(req, res, next));
router.get('/:id', (req, res, next) => getCourseByIdHandler(req, res, next));
router.post('/', (req, res, next) => createCourseHandler(req, res, next));
router.put('/:id', (req, res, next) => updateCourseHandler(req, res, next));
router.delete('/:id', (req, res, next) => deleteCourseHandler(req, res, next));

export default router; 