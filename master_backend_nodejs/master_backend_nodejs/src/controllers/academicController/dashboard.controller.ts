// src/controllers/academicController/dashboard.controller.ts
import { Request, Response } from 'express';
import { AcademicDashboardBusiness } from '../../business/academicBusiness/dashboard.business';

export class AcademicDashboardController {
    static async getDashboardOverview(req: Request, res: Response) {
        try {
            const overview = await AcademicDashboardBusiness.getDashboardOverview();
            res.status(200).json({ success: true, data: overview });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching dashboard overview', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    static async getQuickStats(req: Request, res: Response) {
        try {
            const stats = await AcademicDashboardBusiness.getQuickStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching quick stats', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    static async getRecentActivities(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 5;
            const activities = await AcademicDashboardBusiness.getRecentActivities(limit);
            res.status(200).json({ success: true, data: activities });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching recent activities', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }

    static async getStudentRequests(req: Request, res: Response) {
        try {
            const requests = await AcademicDashboardBusiness.getStudentRequests();
            res.status(200).json({ success: true, data: requests });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching student requests', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }
}
