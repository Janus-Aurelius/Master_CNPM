// src/business/financialBusiness/dashboardBusiness.ts
import { FinancialDashboardService } from '../../services/financialService/dashboardService';

export class FinancialDashboardBusiness {
    private dashboardService: FinancialDashboardService;

    constructor() {
        this.dashboardService = new FinancialDashboardService();
    }    /**
     * Get dashboard overview with validation
     */
    async getDashboardOverview(semesterId?: string) {
        try {
            // Get basic stats
            const stats = await this.dashboardService.getDashboardStats(semesterId);
            
            // Get overdue payments
            const overduePayments = await this.dashboardService.getOverduePayments(semesterId);

            // Calculate additional metrics from overview data
            const overview = stats.overview;
            const totalStudents = overview?.total_students || 0;
            const paidStudents = overview?.paid_students || 0;
            const paymentRate = totalStudents > 0 ? (paidStudents / totalStudents * 100) : 0;
            
            const totalTuition = parseFloat(overview?.total_tuition || '0');
            const totalCollected = parseFloat(overview?.total_collected || '0');
            const collectionRate = totalTuition > 0 ? (totalCollected / totalTuition * 100) : 0;

            return {
                success: true,
                data: {
                    overview: {
                        totalStudents,
                        paidStudents: overview?.paid_students || 0,
                        partialStudents: overview?.partial_students || 0,
                        unpaidStudents: overview?.unpaid_students || 0,
                        paymentRate: Math.round(paymentRate * 100) / 100,
                        collectionRate: Math.round(collectionRate * 100) / 100
                    },
                    financial: {
                        totalTuition,
                        totalCollected,
                        totalOutstanding: parseFloat(overview?.total_outstanding || '0')
                    },
                    trends: stats.monthlyTrends || [],
                    facultyStats: stats.facultyStats || [],
                    overduePayments: overduePayments || []
                }
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get dashboard overview: ${error?.message || 'Unknown error'}`
            };
        }
    }    /**
     * Get semester comparison data
     */
    async getSemesterComparison(currentSemesterId: string, previousSemesterId: string) {
        try {
            const [currentStats, previousStats] = await Promise.all([
                this.dashboardService.getDashboardStats(currentSemesterId),
                this.dashboardService.getDashboardStats(previousSemesterId)
            ]);

            const currentOverview = currentStats.overview;
            const previousOverview = previousStats.overview;
            
            const currentTotal = parseFloat(currentOverview?.total_collected || '0');
            const previousTotal = parseFloat(previousOverview?.total_collected || '0');
            
            const growth = previousTotal > 0 ? 
                ((currentTotal - previousTotal) / previousTotal * 100) : 0;

            return {
                success: true,
                data: {
                    current: {
                        semesterId: currentSemesterId,
                        totalStudents: currentOverview?.total_students || 0,
                        totalCollected: currentTotal,
                        paymentRate: currentOverview?.total_students > 0 ? 
                            (currentOverview.paid_students / currentOverview.total_students * 100) : 0
                    },
                    previous: {
                        semesterId: previousSemesterId,
                        totalStudents: previousOverview?.total_students || 0,
                        totalCollected: previousTotal,
                        paymentRate: previousOverview?.total_students > 0 ? 
                            (previousOverview.paid_students / previousOverview.total_students * 100) : 0
                    },
                    growth: Math.round(growth * 100) / 100
                }
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get semester comparison: ${error?.message || 'Unknown error'}`
            };
        }
    }    /**
     * Get payment analytics with date range
     */
    async getPaymentAnalytics(filters?: {
        semesterId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        groupBy?: 'day' | 'week' | 'month';
    }) {
        try {
            // Use revenue analytics with date range
            const startDate = filters?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
            const endDate = filters?.dateTo || new Date();
            
            const analytics = await this.dashboardService.getRevenueAnalytics(startDate, endDate);
            
            return {
                success: true,
                data: analytics
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get payment analytics: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Export dashboard data to CSV/Excel format
     */
    async exportDashboardData(semesterId?: string, format: 'csv' | 'excel' = 'csv') {
        try {
            const stats = await this.dashboardService.getDashboardStats(semesterId);
            const overduePayments = await this.dashboardService.getOverduePayments(semesterId);
            
            const overview = stats.overview;
            
            // Prepare export data structure
            const exportData = {
                summary: {
                    totalStudents: overview?.total_students || 0,
                    paidStudents: overview?.paid_students || 0,
                    partialStudents: overview?.partial_students || 0,
                    unpaidStudents: overview?.unpaid_students || 0,
                    totalTuition: overview?.total_tuition || 0,
                    totalCollected: overview?.total_collected || 0,
                    totalOutstanding: overview?.total_outstanding || 0
                },
                overdueDetails: overduePayments,
                facultyStats: stats.facultyStats,
                monthlyTrends: stats.monthlyTrends
            };

            return {
                success: true,
                data: exportData,
                format
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to export dashboard data: ${error?.message || 'Unknown error'}`
            };
        }
    }
}
