// src/routes/academic.routes.ts
import { Request, Response, Router } from 'express';
import { AcademicDashboardController } from '../../controllers/academicController/dashboard.controller';
import * as courseController from '../../controllers/academicController/course.controller';
import { studentController } from '../../controllers/academicController/student.controller';
import { authenticateToken, authorizeRoles } from '../../middleware/auth';
import { ProgramController } from '../../controllers/academicController/program.controller';
import studentRoutes from './student.routes';
import courseRoutes from './course.routes';
import openCourseRoutes from './openCourse.routes';

const router = Router();

// Protect all routes
router.use(authenticateToken, authorizeRoles(['academic']));

// Dashboard Routes
router.get('/dashboard', (req: Request, res: Response): void => {
    AcademicDashboardController.getDashboardOverview(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/dashboard/stats', (req: Request, res: Response): void => {
    AcademicDashboardController.getQuickStats(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/dashboard/activities', (req: Request, res: Response): void => {
    AcademicDashboardController.getRecentActivities(req, res).catch(err => {
        console.error(err);        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

// Course Management Routes
router.get('/courseMgm', courseController.getCoursesHandler);
router.get('/courseMgm/:id', courseController.getCourseByIdHandler);
router.post('/courseMgm', courseController.createCourseHandler);
router.put('/courseMgm/:id', courseController.updateCourseHandler);
router.delete('/courseMgm/:id', courseController.deleteCourseHandler);

router.get('/programsMgm', ProgramController.getAllPrograms);
router.post('/programsMgm', ProgramController.createProgram);
router.put('/programsMgm/:maNganh/:maMonHoc/:maHocKy', ProgramController.updateProgram);
router.delete('/programsMgm/:maNganh/:maMonHoc/:maHocKy', ProgramController.deleteProgram);
router.get('/programsMgm/nganh/:maNganh', ProgramController.getProgramsByNganh);
router.get('/programsMgm/hocky/:maHocKy', ProgramController.getProgramsByHocKy);
router.get('/programsMgm/validate-semester/:maHocKy', ProgramController.validateSemester);

router.get('/openCourseMgm', (req: Request, res: Response): void => {
    res.json({ data: 'Academic affairs deparment open courses management' });
});

// Legacy subject routes have been removed - use course management instead

// Academic Structure Routes - for dropdown data
router.get('/faculties', (req: Request, res: Response): void => {
    studentController.getFaculties(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/majors', (req: Request, res: Response): void => {
    studentController.getMajors(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/majors/faculty/:facultyId', (req: Request, res: Response): void => {
    studentController.getMajorsByFaculty(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/provinces', (req: Request, res: Response): void => {
    studentController.getProvinces(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/priority-groups', (req: Request, res: Response): void => {
    studentController.getPriorityGroups(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

// Course Types (already in course controller)
router.get('/course-types', courseController.getCourseTypesHandler);

// Combined form data endpoints
router.get('/student-form-data', (req: Request, res: Response): void => {
    studentController.getStudentFormData(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/course-form-data', courseController.getCourseFormData);

// Mount student routes at /api/students
router.use('/students', studentRoutes);

// Mount course routes at /api/academic/courses
router.use('/courses', courseRoutes);

// Mount open course routes at /api/academic/open-courses
router.use('/open-courses', openCourseRoutes);

export default router;