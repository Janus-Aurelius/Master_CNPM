// src/business/financialBusiness/dashboardManager.ts
import { DatabaseService } from '../../services/database/databaseService';
import { financialService } from '../../services/financialService/financialService';
import { AppError } from '../../middleware/errorHandler';

// Utility function to get current semester
const getCurrentSemester = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed
    
    if (month >= 1 && month <= 5) {
        return `Spring ${year}`;
    } else if (month >= 6 && month <= 8) {
        return `Summer ${year}`;
    } else {
        return `Fall ${year}`;
    }
};

// Dashboard
export const getDashboardData = async () => {
    try {
        // Get dashboard data with database integration
        const dashboardData = await DatabaseService.query(`
            SELECT 
                COUNT(DISTINCT tr.student_id) as total_students,
                COUNT(DISTINCT CASE WHEN tr.payment_status = 'PAID' THEN tr.student_id END) as paid_students,
                COUNT(DISTINCT CASE WHEN tr.payment_status = 'PARTIAL' THEN tr.student_id END) as partial_students,
                COUNT(DISTINCT CASE WHEN tr.payment_status = 'UNPAID' THEN tr.student_id END) as unpaid_students,
                SUM(CASE WHEN tr.payment_status = 'PAID' THEN tr.total_amount ELSE 0 END) as total_revenue,
                SUM(CASE WHEN tr.payment_status IN ('UNPAID', 'PARTIAL') THEN tr.outstanding_amount ELSE 0 END) as outstanding_amount
            FROM tuition_records tr
            WHERE tr.semester = $1
        `, [getCurrentSemester()]);

        const monthlyRevenue = await DatabaseService.query(`
            SELECT 
                EXTRACT(MONTH FROM pr.payment_date) as month,
                SUM(pr.amount) as revenue
            FROM payment_receipts pr
            WHERE EXTRACT(YEAR FROM pr.payment_date) = EXTRACT(YEAR FROM NOW())
            GROUP BY EXTRACT(MONTH FROM pr.payment_date)
            ORDER BY month
        `);

        const data = dashboardData[0] || {};
        
        return {
            studentCounts: {
                total: parseInt(data.total_students || 0),
                paid: parseInt(data.paid_students || 0),
                partial: parseInt(data.partial_students || 0),
                unpaid: parseInt(data.unpaid_students || 0)
            },
            financialSummary: {
                totalRevenue: parseFloat(data.total_revenue || 0),
                outstandingAmount: parseFloat(data.outstanding_amount || 0),
                collectionRate: data.total_students > 0 ? 
                    ((parseInt(data.paid_students || 0) + 0.5 * parseInt(data.partial_students || 0)) / parseInt(data.total_students)) * 100 : 0
            },
            monthlyRevenue: monthlyRevenue.map((item: any) => ({
                month: item.month,
                revenue: parseFloat(item.revenue || 0)
            }))
        };
    } catch (error) {
        console.error('Error in financial dashboard:', error);
        // Fallback to service layer
        try {
            const totalStudents = await financialService.countTotalStudents();
            const paidStudents = await financialService.countStudentsByPaymentStatus('PAID');
            const partialStudents = await financialService.countStudentsByPaymentStatus('PARTIAL');
            const unpaidStudents = await financialService.countStudentsByPaymentStatus('UNPAID');
            
            const totalRevenue = await financialService.getTotalRevenue();
            const outstandingAmount = await financialService.getOutstandingAmount();
            
            return {
                studentCounts: {
                    total: totalStudents,
                    paid: paidStudents,
                    partial: partialStudents,
                    unpaid: unpaidStudents
                },
                financialSummary: {
                    totalRevenue,
                    outstandingAmount,
                    collectionRate: totalStudents > 0 ? 
                        ((paidStudents + 0.5 * partialStudents) / totalStudents) * 100 : 0
                }
            };
        } catch (fallbackError) {
            console.error('Error in financial business layer fallback:', fallbackError);
            throw new AppError(500, 'Error retrieving financial dashboard data');
        }
    }
};

// Advanced Financial Analytics
export const getFinancialAnalytics = async (timeframe: 'monthly' | 'quarterly' | 'yearly' = 'monthly') => {
    try {
        let interval = 'month';
        if (timeframe === 'quarterly') interval = 'quarter';
        if (timeframe === 'yearly') interval = 'year';

        const analytics = await DatabaseService.query(`
            SELECT 
                DATE_TRUNC($1, pr.payment_date) as period,
                COUNT(pr.id) as total_payments,
                SUM(pr.amount) as total_amount,
                AVG(pr.amount) as average_payment,
                COUNT(DISTINCT pr.student_id) as unique_students
            FROM payment_receipts pr
            WHERE pr.payment_date >= NOW() - INTERVAL '12 months'
            GROUP BY DATE_TRUNC($1, pr.payment_date)
            ORDER BY period DESC
        `, [interval]);

        const feeDistribution = await DatabaseService.query(`
            SELECT 
                tci.fee_type,
                COUNT(*) as count,
                SUM(tci.amount) as total_amount,
                AVG(tci.amount) as average_amount
            FROM tuition_course_items tci
            JOIN tuition_records tr ON tci.tuition_record_id = tr.id
            WHERE tr.semester = $1
            GROUP BY tci.fee_type
            ORDER BY total_amount DESC
        `, [getCurrentSemester()]);

        return {
            timeframe,
            trends: analytics.map((item: any) => ({
                period: item.period,
                totalPayments: parseInt(item.total_payments),
                totalAmount: parseFloat(item.total_amount),
                averagePayment: parseFloat(item.average_payment),
                uniqueStudents: parseInt(item.unique_students)
            })),
            feeDistribution: feeDistribution.map((item: any) => ({
                feeType: item.fee_type,
                count: parseInt(item.count),
                totalAmount: parseFloat(item.total_amount),
                averageAmount: parseFloat(item.average_amount)
            }))
        };
    } catch (error) {
        console.error('Error getting financial analytics:', error);
        throw new AppError(500, 'Error retrieving financial analytics');
    }
};

// Financial Reports
export const generateFinancialReport = async (reportType: 'summary' | 'detailed' | 'overdue', filters: {
    semester?: string,
    startDate?: string,
    endDate?: string,
    faculty?: string
}) => {
    try {
        const semester = filters.semester || getCurrentSemester();
        
        switch (reportType) {
            case 'summary':
                return await generateSummaryReport(semester, filters);
            case 'detailed':
                return await generateDetailedReport(semester, filters);
            case 'overdue':
                return await generateOverdueReport(semester, filters);
            default:
                throw new AppError(400, 'Invalid report type');
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error generating financial report:', error);
        throw new AppError(500, 'Error generating financial report');
    }
};

const generateSummaryReport = async (semester: string, filters: any) => {
    const summaryData = await DatabaseService.query(`
        SELECT 
            COUNT(DISTINCT tr.student_id) as total_students,
            SUM(tr.total_amount) as total_tuition,
            SUM(tr.paid_amount) as total_paid,
            SUM(tr.outstanding_amount) as total_outstanding,
            COUNT(CASE WHEN tr.payment_status = 'PAID' THEN 1 END) as paid_count,
            COUNT(CASE WHEN tr.payment_status = 'PARTIAL' THEN 1 END) as partial_count,
            COUNT(CASE WHEN tr.payment_status = 'UNPAID' THEN 1 END) as unpaid_count
        FROM tuition_records tr
        JOIN students s ON tr.student_id = s.student_id
        WHERE tr.semester = $1
        ${filters.faculty ? 'AND s.faculty = $2' : ''}
    `, filters.faculty ? [semester, filters.faculty] : [semester]);

    return {
        reportType: 'summary',
        semester,
        generatedAt: new Date().toISOString(),
        data: summaryData[0]
    };
};

const generateDetailedReport = async (semester: string, filters: any) => {
    let whereConditions = ['tr.semester = $1'];
    let queryParams: any[] = [semester];
    let paramIndex = 2;

    if (filters.faculty) {
        whereConditions.push(`s.faculty = $${paramIndex}`);
        queryParams.push(filters.faculty);
        paramIndex++;
    }

    if (filters.startDate) {
        whereConditions.push(`tr.created_at >= $${paramIndex}`);
        queryParams.push(filters.startDate);
        paramIndex++;
    }

    if (filters.endDate) {
        whereConditions.push(`tr.created_at <= $${paramIndex}`);
        queryParams.push(filters.endDate);
        paramIndex++;
    }

    const detailedData = await DatabaseService.query(`
        SELECT 
            tr.student_id,
            s.full_name,
            s.faculty,
            s.program,
            tr.total_amount,
            tr.paid_amount,
            tr.outstanding_amount,
            tr.payment_status,
            tr.due_date,
            tr.created_at
        FROM tuition_records tr
        JOIN students s ON tr.student_id = s.student_id
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY s.faculty, s.full_name
    `, queryParams);

    return {
        reportType: 'detailed',
        semester,
        filters,
        generatedAt: new Date().toISOString(),
        data: detailedData.map((item: any) => ({
            ...item,
            total_amount: parseFloat(item.total_amount),
            paid_amount: parseFloat(item.paid_amount),
            outstanding_amount: parseFloat(item.outstanding_amount)
        }))
    };
};

const generateOverdueReport = async (semester: string, filters: any) => {
    const overdueData = await DatabaseService.query(`
        SELECT 
            tr.student_id,
            s.full_name,
            s.faculty,
            s.program,
            s.email,
            s.phone,
            tr.total_amount,
            tr.paid_amount,
            tr.outstanding_amount,
            tr.due_date,
            EXTRACT(DAY FROM NOW() - tr.due_date) as days_overdue
        FROM tuition_records tr
        JOIN students s ON tr.student_id = s.student_id
        WHERE tr.semester = $1 
        AND tr.payment_status IN ('UNPAID', 'PARTIAL')
        AND tr.due_date < NOW()
        ${filters.faculty ? 'AND s.faculty = $2' : ''}
        ORDER BY days_overdue DESC, tr.outstanding_amount DESC
    `, filters.faculty ? [semester, filters.faculty] : [semester]);

    return {
        reportType: 'overdue',
        semester,
        generatedAt: new Date().toISOString(),
        data: overdueData.map((item: any) => ({
            ...item,
            total_amount: parseFloat(item.total_amount),
            paid_amount: parseFloat(item.paid_amount),
            outstanding_amount: parseFloat(item.outstanding_amount),
            days_overdue: parseInt(item.days_overdue)
        }))
    };
};

export default {
    getDashboardData,
    getFinancialAnalytics
};
