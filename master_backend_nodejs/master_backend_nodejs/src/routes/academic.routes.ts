// src/routes/student.routes.ts
<<<<<<< HEAD
import { Request, Response, Router } from 'express';
import { SubjectController } from '../controllers/academic/subject.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateSubjectData } from '../middleware/subjectValidation';
import { get } from 'http';

const router = Router();

// Protect all routes
router.use(authenticateToken, authorizeRoles(['academic']));

// Student tabs
router.get('/dashboard', (req: Request, res: Response): void => {
    res.json({data:'Academic affairs deparment dashboard'});
});

router.get('/programsMgm', (req: Request, res: Response): void => {
    res.json({ data: 'Academic affairs deparment program management' });
});

router.get('/studentSubjectReq', (req: Request, res: Response): void => {
    res.json({ data: 'Academic affairs deparment student subject request management' });
});

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
=======
import {Request, Response, Router} from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Protect all student routes
router.use(authenticateToken, authorizeRoles(['academic']));

// Student tabs
router.get('/dashboard', (req: Request, res: Response) => {res.json({data:'Academic affairs deparment dashboard'});});
router.get('/programsMgm', (req: Request, res: Response) => {res.json({ data: 'Academic affairs deparment program management' });});
router.get('/subjectMgm', (req: Request, res: Response) => {res.json({ data: 'Academic affairs deparment subject management' });});
router.get('/studentSubjectReq', (req: Request, res: Response) => {res.json({ data: 'Academic affairs deparment student subject request management' });});
router.get('/openCourseMgm', (req: Request, res: Response) => {res.json({ data: 'Academic affairs deparment open courses management' });});
>>>>>>> origin/Trong

export default router;