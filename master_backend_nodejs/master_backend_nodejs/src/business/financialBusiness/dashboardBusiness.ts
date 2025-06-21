// src/business/financialBusiness/dashboardBusiness.ts
import { FinancialDashboardService } from '../../services/financialService/dashboardService';

export class FinancialDashboardBusiness {
    private dashboardService: FinancialDashboardService;

    constructor() {
        this.dashboardService = new FinancialDashboardService();
    }    /**
     * Get dashboard overview with enhanced calculation validation
     */
    async getDashboardOverview(semesterId?: string) {
        try {
            const stats = await this.dashboardService.getDashboardStatsEnhanced(semesterId);
            
            // Calculate percentages and format data using dynamic calculation results
            const totalStudents = stats.overview.total_students || 0;
            const paidStudents = stats.overview.paid_students || 0;
            const unpaidStudents = stats.overview.unpaid_students || 0;
            
            return {
                success: true,
                data: {
                    semester: stats.semester,
                    overview: {
                        totalStudents,
                        paidStudents,
                        unpaidStudents,
                        paymentRate: totalStudents ? (paidStudents / totalStudents) * 100 : 0,
                    },
                    financial: {
                        totalTuition: stats.overview.total_tuition || 0,
                        totalCollected: stats.overview.total_collected || 0,
                        totalOutstanding: stats.overview.total_outstanding || 0
                    },
                    monthlyTrends: stats.monthlyTrends,
                    facultyStats: stats.facultyStats
                }
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Error processing dashboard overview data: ${error?.message || 'Unknown error'}`
            };
        }
    }/**
     * Get semester comparison data
     */
    async getSemesterComparison() {
        try {
            const data = await this.dashboardService.getSemesterComparisonData();
            return {
                semesters: data.map(item => ({
                    semesterId: item.semester_id,
                    semesterName: item.semester_name,
                    totalCollected: item.total_collected,
                    collectionRate: item.collection_rate
                }))
            };
        } catch (error) {
            throw new Error('Error processing semester comparison data');
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

    async getOverduePayments(semesterId?: string) {
        try {
            const rawData = await this.dashboardService.getOverduePayments(semesterId);

            // Process and categorize overdue payments
            const processedData = rawData.map(payment => ({
                registrationId: payment.MaPhieuDangKy,
                studentId: payment.MaSoSinhVien,
                studentName: payment.student_name,
                amountDue: parseFloat(payment.SoTienPhaiDong),
                amountPaid: parseFloat(payment.SoTienDaDong),
                remainingAmount: parseFloat(payment.SoTienConLai),
                dueDate: payment.due_date,
                daysOverdue: Math.floor(
                    (new Date().getTime() - new Date(payment.due_date).getTime()) / 
                    (1000 * 60 * 60 * 24)
                ),
                status: this.getPaymentStatus(
                    parseFloat(payment.SoTienPhaiDong),
                    parseFloat(payment.SoTienDaDong)
                )
            }));

            // Sort by days overdue and remaining amount
            processedData.sort((a, b) => 
                b.daysOverdue - a.daysOverdue || 
                b.remainingAmount - a.remainingAmount
            );

            return {
                success: true,
                data: {
                    overduePayments: processedData,
                    summary: {
                        totalOverdue: processedData.length,
                        totalAmount: processedData.reduce((sum, p) => sum + p.remainingAmount, 0),
                        averageOverdueDays: Math.round(
                            processedData.reduce((sum, p) => sum + p.daysOverdue, 0) / 
                            processedData.length
                        )
                    }
                }
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get overdue payments: ${error.message}`
            };
        }
    }

    private getPaymentStatus(totalAmount: number, paidAmount: number): string {
        const paymentRatio = paidAmount / totalAmount;
        if (paymentRatio === 0) return 'unpaid';
        if (paymentRatio < 1) return 'partial';
        return 'paid';
    }

    async getFacultyStats() {
        try {
            const stats = await this.dashboardService.getFacultyStats();
            return {
                facultyStats: stats.map(item => ({
                    facultyId: item.faculty_id,
                    facultyName: item.faculty_name,
                    totalStudents: item.total_students,
                    paidStudents: item.paid_students,
                    paymentRate: item.payment_rate
                }))
            };
        } catch (error) {
            throw new Error('Error processing faculty statistics');
        }
    }
}
