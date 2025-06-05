import { Router } from 'express';
import { StudentSubjectReqController } from '../../controllers/academic/studentSubjectReq.controller';

const router = Router();

// Get all requests
router.get('/', StudentSubjectReqController.getAllRequests);

// Get request by ID
router.get('/:id', StudentSubjectReqController.getRequestById);

// Create new request
router.post('/', StudentSubjectReqController.createRequest);

// Update request status
router.patch('/:id/status', StudentSubjectReqController.updateRequestStatus);

// Get requests by student ID
router.get('/student/:studentId', StudentSubjectReqController.getRequestsByStudentId);

// Get requests by status
router.get('/status/:status', StudentSubjectReqController.getRequestsByStatus);

export default router; 