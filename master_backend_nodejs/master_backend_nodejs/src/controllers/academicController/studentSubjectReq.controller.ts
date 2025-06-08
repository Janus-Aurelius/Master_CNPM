import { Request, Response } from 'express';
import { StudentSubjectReqBusiness } from '../../business/academicBusiness/studentSubjectReq.business';
import { RequestStatus } from '../../models/academic_related/studentSubjectReq';

export class StudentSubjectReqController {
    static async getAllRequests(req: Request, res: Response) {
        try {
            const requests = await StudentSubjectReqBusiness.getAllRequests();
            res.status(200).json({ success: true, data: requests });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching requests', error });
        }
    }

    static async getRequestById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const request = await StudentSubjectReqBusiness.getRequestById(Number(id));
            if (!request) {
                return res.status(404).json({ success: false, message: 'Request not found' });
            }
            res.status(200).json({ success: true, data: request });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching request', error });
        }
    }

    static async createRequest(req: Request, res: Response) {
        try {
            const requestData = req.body;
            const newRequest = await StudentSubjectReqBusiness.createRequest(requestData);
            res.status(201).json({ success: true, data: newRequest });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error creating request', error });
        }
    }

    static async updateRequestStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!Object.values(RequestStatus).includes(status)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid status value' 
                });
            }

            const updatedRequest = await StudentSubjectReqBusiness.updateRequestStatus(
                Number(id),
                status
            );
            res.status(200).json({ success: true, data: updatedRequest });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error updating request status', error });
        }
    }

    static async getRequestsByStudentId(req: Request, res: Response) {
        try {
            let studentId: string | undefined = undefined;
            if (req.user?.role === 'student') {
                studentId = req.user.studentId;
            } else {
                studentId = req.params.studentId;
            }
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId' });
            }
            const requests = await StudentSubjectReqBusiness.getRequestsByStudentId(studentId);
            res.status(200).json({ success: true, data: requests });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching student requests', error });
        }
    }

    static async getRequestsByStatus(req: Request, res: Response) {
        try {
            const { status } = req.params;
            if (!Object.values(RequestStatus).includes(status as RequestStatus)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid status value' 
                });
            }

            const requests = await StudentSubjectReqBusiness.getRequestsByStatus(status as RequestStatus);
            res.status(200).json({ success: true, data: requests });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching requests by status', error });
        }
    }
} 