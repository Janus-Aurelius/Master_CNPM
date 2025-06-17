// src/controllers/financialController/dashboardController.ts
import { Request, Response } from 'express';
import { FinancialDashboardBusiness } from '../../business/financialBusiness/dashboardBusiness';

export class FinancialDashboardController {
    private dashboardBusiness: FinancialDashboardBusiness;

    constructor() {
        this.dashboardBusiness = new FinancialDashboardBusiness();
    }

    /**
     * GET /api/financial/dashboard/overview
     * Get dashboard overview statistics
     */
    async getDashboardOverview(req: Request, res: Response) {
        try {
            const { semesterId } = req.query;
            
            const result = await this.dashboardBusiness.getDashboardOverview(
                semesterId as string
            );

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
     * GET /api/financial/dashboard/comparison
     * Get semester comparison data
     */
    async getSemesterComparison(req: Request, res: Response) {
        try {
            const { currentSemesterId, previousSemesterId } = req.query;

            if (!currentSemesterId || !previousSemesterId) {
                return res.status(400).json({
                    success: false,
                    message: 'Both current and previous semester IDs are required'
                });
            }

            const result = await this.dashboardBusiness.getSemesterComparison(
                currentSemesterId as string,
                previousSemesterId as string
            );

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
}

export const financialDashboardController = new FinancialDashboardController();
