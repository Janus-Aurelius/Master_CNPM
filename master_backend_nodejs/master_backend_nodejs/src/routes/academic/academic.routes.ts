// src/routes/academic.routes.ts
import { Request, Response, Router } from 'express';
import { SubjectController } from '../../controllers/academicController/subject.controller';
import { AcademicDashboardController } from '../../controllers/academicController/dashboard.controller';
import * as courseController from '../../controllers/academicController/course.controller';
import { authenticateToken, authorizeRoles } from '../../middleware/auth';
import { validateSubjectData } from '../../middleware/subjectValidation';
import { ProgramController } from '../../controllers/academicController/program.controller';
import studentRoutes from './student.routes';
import courseRoutes from './course.routes';
import openCourseRoutes from './openCourse.routes';
import studentSubjectReqRoutes from './studentSubjectReq.routes';

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
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/dashboard/requests', (req: Request, res: Response): void => {
    AcademicDashboardController.getStudentRequests(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
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

// Subject Management Routes
router.get('/subjectMgm', (req: Request, res: Response): void => {
    SubjectController.getAllSubjects(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.get('/subjectMgm/:id', (req: Request, res: Response): void => {
    SubjectController.getSubjectById(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.post('/subjectMgm', validateSubjectData, (req: Request, res: Response): void => {
    SubjectController.createSubject(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.put('/subjectMgm/:id', validateSubjectData, (req: Request, res: Response): void => {
    SubjectController.updateSubject(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

router.delete('/subjectMgm/:id', (req: Request, res: Response): void => {
    SubjectController.deleteSubject(req, res).catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    });
});

// Mount student routes at /api/students
router.use('/students', studentRoutes);

// Mount course routes at /api/academic/courses
router.use('/courses', courseRoutes);

// Mount open course routes at /api/academic/open-courses
router.use('/open-courses', openCourseRoutes);

// Mount student subject request routes at /api/academic/student-subject-requests
router.use('/student-subject-requests', studentSubjectReqRoutes);

export default router;