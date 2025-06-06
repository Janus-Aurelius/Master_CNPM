import { Router, Request, Response, NextFunction } from 'express';
import { StudentSubjectReqController } from '../../controllers/academicController/studentSubjectReq.controller';

const router = Router();

// Async handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Get all requests
router.get('/', asyncHandler(async (req, res) => {
    await StudentSubjectReqController.getAllRequests(req, res);
}));

// Get requests by status (must be before /:id)
router.get('/status/:status', asyncHandler(async (req, res) => {
    await StudentSubjectReqController.getRequestsByStatus(req, res);
}));

// Get requests by student ID
router.get('/student/:studentId', asyncHandler(async (req, res) => {
    await StudentSubjectReqController.getRequestsByStudentId(req, res);
}));

// Get request by ID
router.get('/:id', asyncHandler(async (req, res) => {
    await StudentSubjectReqController.getRequestById(req, res);
}));

// Create new request
router.post('/', asyncHandler(async (req, res) => {
    await StudentSubjectReqController.createRequest(req, res);
}));

// Update request status
router.patch('/:id/status', asyncHandler(async (req, res) => {
    await StudentSubjectReqController.updateRequestStatus(req, res);
}));

export default router; 