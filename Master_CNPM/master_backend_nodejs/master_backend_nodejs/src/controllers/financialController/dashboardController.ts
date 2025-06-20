// src/controllers/financialController/dashboardController.ts
import { Request, Response } from 'express';
import { FinancialDashboardBusiness } from '../../business/financialBusiness/dashboardBusiness';
import { FinancialDashboardService } from '../../services/financialService/dashboardService';

export class FinancialDashboardController {
    private dashboardBusiness: FinancialDashboardBusiness;
    private service: FinancialDashboardService;

    constructor() {
        this.dashboardBusiness = new FinancialDashboardBusiness();
        this.service = new FinancialDashboardService();
    }

    /**
     * GET /api/financial/dashboard/overview
     * Get dashboard overview statistics
     */
    async getDashboardOverview(req: Request, res: Response) {
        try {
            const semesterId = req.query.semesterId as string;
            const data = await this.dashboardBusiness.getDashboardOverview(semesterId);
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error in getDashboardOverview:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /api/financial/dashboard/comparison
     * Get semester comparison data
     */
    async getSemesterComparison(req: Request, res: Response) {
        try {
            const data = await this.dashboardBusiness.getSemesterComparison();
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error in getSemesterComparison:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /api/financial/dashboard/analytics
     * Get payment analytics with filters
     */
    async getPaymentAnalytics(req: Request, res: Response) {
        try {
            const { semesterId, dateFrom, dateTo, groupBy } = req.query;

            const filters = {
                semesterId: semesterId as string,
                dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
                dateTo: dateTo ? new Date(dateTo as string) : undefined,
                groupBy: groupBy as 'day' | 'week' | 'month'
            };

            const result = await this.dashboardBusiness.getPaymentAnalytics(filters);

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }

    /**
     * GET /api/financial/dashboard/export
     * Export dashboard data
     */
    async exportDashboardData(req: Request, res: Response) {
        try {
            const { semesterId, format } = req.query;

            const result = await this.dashboardBusiness.exportDashboardData(
                semesterId as string,
                (format as 'csv' | 'excel') || 'csv'
            );

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    format: result.format
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }

    async getOverduePayments(req: Request, res: Response) {
        try {
            const { semesterId } = req.query;
            const overdueData = await this.dashboardBusiness.getOverduePayments(
                semesterId as string
            );

            res.json({
                success: true,
                data: overdueData
            });

        } catch (error: any) {
            console.error('Error in getOverduePayments:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tải dữ liệu nợ học phí',
                error: error.message
            });
        }
    }


    async getOverview(req: Request, res: Response) {
        try {
            console.log('[getOverview] Called');
            const data = await this.service.getOverview();
            console.log('[getOverview] Data:', data);
            res.json({ success: true, data });
        } catch (err) {
            console.error('[getOverview] Error:', err);
            res.status(500).json({ success: false, message: 'Server error', error: err instanceof Error ? err.message : err });
        }
    }

    async getRecentPayments(req: Request, res: Response) {
        try {
            const data = await this.service.getRecentPayments();
            res.json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }

    async getFacultyStats(req: Request, res: Response) {
        try {
            const data = await this.service.getFacultyStats();
            res.json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
}

export const financialDashboardController = new FinancialDashboardController();
