// src/business/financialBusiness/financialManager.ts
import { financialService } from '../../services/financialService/financialService';
import { DatabaseService } from '../../services/database/databaseService';
import { AppError } from '../../middleware/errorHandler';
import { 
    ITuitionRecord, 
    TuitionCourseItem, 
    ITuitionPaymentReceipt,
    IPaymentValidation,
    IPaymentAudit,
    ITuitionCalculation,
    IPaymentData
} from '../../models/student_related/studentPaymentInterface';

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

// Payment Status Management
export const getAllPaymentStatus = async (filters: { 
    semester?: string, 
    faculty?: string, 
    course?: string,
    paymentStatus?: string,
    page?: number,
    limit?: number
}) => {
    try {
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const offset = (page - 1) * limit;

        let whereConditions = ['tr.semester = $1'];
        let queryParams: any[] = [filters.semester || getCurrentSemester()];
        let paramIndex = 2;

        if (filters.faculty) {
            whereConditions.push(`s.faculty = $${paramIndex}`);
            queryParams.push(filters.faculty);
            paramIndex++;
        }

        if (filters.course) {
            whereConditions.push(`EXISTS (
                SELECT 1 FROM tuition_course_items tci 
                WHERE tci.tuition_record_id = tr.id AND tci.course_code = $${paramIndex}
            )`);
            queryParams.push(filters.course);
            paramIndex++;
        }

        if (filters.paymentStatus) {
            whereConditions.push(`tr.payment_status = $${paramIndex}`);
            queryParams.push(filters.paymentStatus);
            paramIndex++;
        }

        const paymentData = await DatabaseService.query(`
            SELECT 
                tr.id,
                tr.student_id,
                s.full_name as student_name,
                s.faculty,
                s.program,
                tr.semester,
                tr.total_amount,
                tr.paid_amount,
                tr.outstanding_amount,
                tr.payment_status,
                tr.due_date,
                tr.created_at,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'course_code', tci.course_code,
                            'course_name', tci.course_name,
                            'credits', tci.credits,
                            'fee_type', tci.fee_type,
                            'amount', tci.amount
                        )
                    ) FILTER (WHERE tci.id IS NOT NULL), 
                    '[]'::json
                ) as courses
            FROM tuition_records tr
            JOIN students s ON tr.student_id = s.student_id
            LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id
            WHERE ${whereConditions.join(' AND ')}
            GROUP BY tr.id, s.full_name, s.faculty, s.program
            ORDER BY tr.created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `, [...queryParams, limit, offset]);

        const totalCount = await DatabaseService.query(`
            SELECT COUNT(DISTINCT tr.id) as total
            FROM tuition_records tr
            JOIN students s ON tr.student_id = s.student_id
            ${filters.course ? 'LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id' : ''}
            WHERE ${whereConditions.join(' AND ')}
        `, queryParams.slice(0, -2));

        return {
            data: paymentData.map((item: any) => ({
                ...item,
                total_amount: parseFloat(item.total_amount),
                paid_amount: parseFloat(item.paid_amount),
                outstanding_amount: parseFloat(item.outstanding_amount),
                courses: typeof item.courses === 'string' ? JSON.parse(item.courses) : item.courses
            })),
            pagination: {
                page,
                limit,
                total: parseInt(totalCount[0]?.total || 0),
                totalPages: Math.ceil(parseInt(totalCount[0]?.total || 0) / limit)
            }
        };
    } catch (error) {
        console.error('Error getting all payment status:', error);
        // Fallback to original service
        try {
            return await financialService.getAllStudentPayments(filters);
        } catch (fallbackError) {
            throw new AppError(500, 'Error retrieving payment status data');
        }
    }
};

export const getStudentPaymentStatus = async (studentId: string) => {
    try {
        if (!studentId) {
            throw new AppError(400, 'Student ID is required');
        }

        // Get comprehensive payment status from database
        const paymentData = await DatabaseService.query(`
            SELECT 
                tr.*,
                s.full_name as student_name,
                s.faculty,
                s.program,
                s.email,
                s.phone,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', tci.id,
                            'course_code', tci.course_code,
                            'course_name', tci.course_name,
                            'credits', tci.credits,
                            'fee_type', tci.fee_type,
                            'amount', tci.amount,
                            'paid_amount', tci.paid_amount,
                            'status', tci.status
                        )
                    ) FILTER (WHERE tci.id IS NOT NULL), 
                    '[]'::json
                ) as courses,
                COALESCE(
                    (SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', pr.id,
                            'amount', pr.amount,
                            'payment_date', pr.payment_date,
                            'payment_method', pr.payment_method,
                            'receipt_number', pr.receipt_number,
                            'notes', pr.notes
                        )
                    ) FROM payment_receipts pr WHERE pr.tuition_record_id = tr.id),
                    '[]'::json
                ) as payment_history
            FROM tuition_records tr
            JOIN students s ON tr.student_id = s.student_id
            LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id
            WHERE tr.student_id = $1
            GROUP BY tr.id, s.full_name, s.faculty, s.program, s.email, s.phone
            ORDER BY tr.semester DESC
        `, [studentId]);

        if (paymentData.length === 0) {
            throw new AppError(404, 'Student payment records not found');
        }

        return paymentData.map((record: any) => ({
            ...record,
            total_amount: parseFloat(record.total_amount),
            paid_amount: parseFloat(record.paid_amount),
            outstanding_amount: parseFloat(record.outstanding_amount),
            courses: typeof record.courses === 'string' ? JSON.parse(record.courses) : record.courses,
            payment_history: typeof record.payment_history === 'string' ? JSON.parse(record.payment_history) : record.payment_history
        }));
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error getting student payment status:', error);
        // Fallback to service layer
        try {
            return await financialService.getStudentPayment(studentId);
        } catch (fallbackError) {
            throw new AppError(500, 'Error retrieving student payment status');
        }
    }
};

export const updatePaymentStatus = async (studentId: string, paymentData: IPaymentData) => {
    try {
        // Validate input data
        if (!paymentData.studentId || !paymentData.semester) {
            throw new AppError(400, 'Missing required payment data');
        }

        if (!['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(paymentData.status)) {
            throw new AppError(400, 'Invalid payment status');
        }

        // Get current tuition record
        const currentRecord = await DatabaseService.query(`
            SELECT * FROM tuition_records 
            WHERE student_id = $1 AND semester = $2
        `, [studentId, paymentData.semester]);

        if (currentRecord.length === 0) {
            throw new AppError(404, 'Tuition record not found');
        }

        const record = currentRecord[0];
        const newPaidAmount = parseFloat(record.paid_amount) + paymentData.amount;
        const newOutstandingAmount = parseFloat(record.total_amount) - newPaidAmount;

        // Validate payment amount
        if (paymentData.amount < 0) {
            throw new AppError(400, 'Payment amount cannot be negative');
        }

        if (paymentData.amount > newOutstandingAmount) {
            throw new AppError(400, 'Payment amount exceeds outstanding amount');
        }

        // Start transaction
        await DatabaseService.query('BEGIN');

        try {
            // Update tuition record
            await DatabaseService.query(`
                UPDATE tuition_records 
                SET 
                    paid_amount = $1,
                    outstanding_amount = $2,
                    payment_status = $3,
                    updated_at = NOW()
                WHERE student_id = $4 AND semester = $5
            `, [
                newPaidAmount,
                Math.max(0, newOutstandingAmount),
                paymentData.status,
                studentId,
                paymentData.semester
            ]);

            // Create payment receipt if amount paid > 0
            let receiptNumber = paymentData.receiptNumber;
            if (paymentData.amount > 0 && !receiptNumber) {
                receiptNumber = `RCP-${Date.now()}-${studentId}`;
                await DatabaseService.query(`
                    INSERT INTO payment_receipts (
                        tuition_record_id,
                        student_id,
                        amount,
                        payment_method,
                        receipt_number,
                        payment_date,
                        notes,
                        created_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                `, [
                    record.id,
                    studentId,
                    paymentData.amount,
                    paymentData.paymentMethod,
                    receiptNumber,
                    paymentData.paymentDate,
                    paymentData.notes || ''
                ]);
            }

            // Create detailed audit log
            await DatabaseService.query(`
                INSERT INTO payment_audit_logs (
                    tuition_record_id,
                    student_id,
                    action,
                    amount,
                    previous_amount,
                    previous_status,
                    new_status,
                    payment_method,
                    receipt_number,
                    notes,
                    performed_by,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
            `, [
                record.id,
                studentId,
                'PAYMENT_UPDATED',
                paymentData.amount,
                record.paid_amount,
                record.payment_status,
                paymentData.status,
                paymentData.paymentMethod,
                receiptNumber,
                paymentData.notes || '',
                'financial-system'
            ]);

            // Commit transaction
            await DatabaseService.query('COMMIT');

            return {
                success: true,
                message: 'Payment status updated successfully',
                receiptNumber,
                audit: {
                    action: 'PAYMENT_UPDATED',
                    amount: paymentData.amount,
                    previousAmount: record.paid_amount,
                    previousStatus: record.payment_status,
                    newStatus: paymentData.status,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            // Rollback on error
            await DatabaseService.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error updating payment status:', error);
        throw new AppError(500, 'Error updating payment status');
    }
};

// Tuition Management Functions
export const getTuitionSettings = async (semester: string) => {
    try {
        if (!semester) {
            throw new AppError(400, 'Semester is required');
        }

        const settings = await DatabaseService.query(`
            SELECT 
                ts.*,
                tf.fee_type,
                tf.amount as fee_amount,
                tf.description as fee_description,
                tf.is_mandatory
            FROM tuition_settings ts
            LEFT JOIN tuition_fees tf ON ts.id = tf.tuition_setting_id
            WHERE ts.semester = $1
            ORDER BY tf.fee_type
        `, [semester]);

        if (settings.length === 0) {
            // Return default settings if none found
            return {
                semester,
                baseTuitionPerCredit: 500000,
                fees: [],
                discounts: [],
                paymentDeadlines: {
                    early: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                    regular: new Date(new Date().setMonth(new Date().getMonth() + 2)),
                    late: new Date(new Date().setMonth(new Date().getMonth() + 3))
                }
            };
        }

        const baseSetting = settings[0];
        const fees = settings.filter(s => s.fee_type).map(s => ({
            type: s.fee_type,
            amount: parseFloat(s.fee_amount),
            description: s.fee_description,
            mandatory: s.is_mandatory
        }));

        return {
            semester,
            baseTuitionPerCredit: parseFloat(baseSetting.base_tuition_per_credit),
            fees,
            discounts: baseSetting.discounts ? JSON.parse(baseSetting.discounts) : [],
            paymentDeadlines: baseSetting.payment_deadlines ? JSON.parse(baseSetting.payment_deadlines) : {},
            settings: {
                lateFeePercentage: parseFloat(baseSetting.late_fee_percentage || 0),
                earlyDiscountPercentage: parseFloat(baseSetting.early_discount_percentage || 0)
            }
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error getting tuition settings:', error);
        // Fallback to service layer
        try {
            return await financialService.getTuitionSettings(semester);
        } catch (fallbackError) {
            throw new AppError(500, 'Error retrieving tuition settings');
        }
    }
};

export const updateTuitionSettings = async (semester: string, settings: any) => {
    try {
        if (!semester || !settings) {
            throw new AppError(400, 'Semester and settings are required');
        }

        // Update or create tuition settings
        const existingSettings = await DatabaseService.query(`
            SELECT id FROM tuition_settings WHERE semester = $1
        `, [semester]);

        let settingId;
        if (existingSettings.length > 0) {
            settingId = existingSettings[0].id;
            await DatabaseService.query(`
                UPDATE tuition_settings 
                SET 
                    base_tuition_per_credit = $1,
                    late_fee_percentage = $2,
                    early_discount_percentage = $3,
                    discounts = $4,
                    payment_deadlines = $5,
                    updated_at = NOW()
                WHERE semester = $6
            `, [
                settings.baseTuitionPerCredit,
                settings.lateFeePercentage || 0,
                settings.earlyDiscountPercentage || 0,
                JSON.stringify(settings.discounts || []),
                JSON.stringify(settings.paymentDeadlines || {}),
                semester
            ]);
        } else {
            const newSetting = await DatabaseService.query(`
                INSERT INTO tuition_settings (
                    semester,
                    base_tuition_per_credit,
                    late_fee_percentage,
                    early_discount_percentage,
                    discounts,
                    payment_deadlines,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
                RETURNING id
            `, [
                semester,
                settings.baseTuitionPerCredit,
                settings.lateFeePercentage || 0,
                settings.earlyDiscountPercentage || 0,
                JSON.stringify(settings.discounts || []),
                JSON.stringify(settings.paymentDeadlines || {})
            ]);
            settingId = newSetting[0].id;
        }

        // Update fees
        if (settings.fees && Array.isArray(settings.fees)) {
            // Delete existing fees
            await DatabaseService.query(`
                DELETE FROM tuition_fees WHERE tuition_setting_id = $1
            `, [settingId]);

            // Insert new fees
            for (const fee of settings.fees) {
                await DatabaseService.query(`
                    INSERT INTO tuition_fees (
                        tuition_setting_id,
                        fee_type,
                        amount,
                        description,
                        is_mandatory,
                        created_at
                    ) VALUES ($1, $2, $3, $4, $5, NOW())
                `, [
                    settingId,
                    fee.type,
                    fee.amount,
                    fee.description || '',
                    fee.mandatory || false
                ]);
            }
        }

        // Log the settings update
        await DatabaseService.query(`
            INSERT INTO audit_logs (
                action_type,
                details,
                user_id,
                created_at
            ) VALUES ($1, $2, $3, NOW())
        `, [
            'TUITION_SETTINGS_UPDATED',
            `Tuition settings updated for semester ${semester}`,
            'financial-system'
        ]);

        return {
            success: true,
            message: 'Tuition settings updated successfully'
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error updating tuition settings:', error);
        // Fallback to service layer
        try {
            return await financialService.updateTuitionSettings(semester, settings);
        } catch (fallbackError) {
            throw new AppError(500, 'Error updating tuition settings');
        }
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

export const validatePayment = async (
    studentId: string,
    amount: number,
    semester: string
): Promise<IPaymentValidation> => {
    try {
        const record = await DatabaseService.queryOne(`
            SELECT * FROM tuition_records 
            WHERE student_id = $1 AND semester = $2
        `, [studentId, semester]);

        if (!record) {
            return {
                isValid: false,
                errors: ['Tuition record not found'],
                warnings: [],
                details: {
                    amount,
                    expectedAmount: 0,
                    difference: amount,
                    status: 'INVALID'
                }
            };
        }

        const errors: string[] = [];
        const warnings: string[] = [];
        const expectedAmount = parseFloat(record.outstanding_amount);
        const difference = expectedAmount - amount;

        if (amount < 0) {
            errors.push('Payment amount cannot be negative');
        }

        if (amount > expectedAmount) {
            errors.push('Payment amount exceeds outstanding amount');
        }

        if (difference > 0 && difference < 100000) { // Less than 100k VND difference
            warnings.push(`Payment amount is less than outstanding amount by ${difference.toLocaleString()} VND`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            details: {
                amount,
                expectedAmount,
                difference,
                status: errors.length > 0 ? 'INVALID' : warnings.length > 0 ? 'WARNING' : 'VALID'
            }
        };
    } catch (error) {
        console.error('Error validating payment:', error);
        return {
            isValid: false,
            errors: ['Error validating payment'],
            warnings: [],
            details: {
                amount,
                expectedAmount: 0,
                difference: amount,
                status: 'INVALID'
            }
        };
    }
};

export const getPaymentAuditTrail = async (
    studentId: string,
    semester: string
): Promise<IPaymentAudit[]> => {
    try {
        const auditLogs = await DatabaseService.query(`
            SELECT 
                id,
                tuition_record_id,
                student_id,
                action,
                amount,
                previous_amount,
                previous_status,
                new_status,
                payment_method,
                receipt_number,
                notes,
                performed_by,
                created_at as timestamp
            FROM payment_audit_logs
            WHERE student_id = $1 
            AND tuition_record_id IN (
                SELECT id FROM tuition_records 
                WHERE student_id = $1 AND semester = $2
            )
            ORDER BY created_at DESC
        `, [studentId, semester]);

        return auditLogs.map(log => ({
            id: log.id,
            tuitionRecordId: log.tuition_record_id,
            studentId: log.student_id,
            action: log.action,
            amount: parseFloat(log.amount),
            previousAmount: log.previous_amount ? parseFloat(log.previous_amount) : undefined,
            previousStatus: log.previous_status,
            newStatus: log.new_status,
            paymentMethod: log.payment_method,
            receiptNumber: log.receipt_number,
            notes: log.notes,
            performedBy: log.performed_by,
            timestamp: log.timestamp
        }));
    } catch (error) {
        console.error('Error getting payment audit trail:', error);
        throw new AppError(500, 'Error retrieving payment audit trail');
    }
};

interface IDiscount {
    type: string;
    percentage: number;
    description: string;
    priority: boolean;
    maxStackable: number;
    conditions?: {
        type: string;
        value: any;
    }[];
}

interface IDiscountResult {
    type: string;
    percentage: number;
    amount: number;
    description: string;
    isPriority: boolean;
}

export const calculateTuition = async (
    studentId: string,
    semester: string,
    courses: TuitionCourseItem[]
): Promise<ITuitionCalculation> => {
    try {
        // Get tuition settings
        const settings = await getTuitionSettings(semester);
        
        // Calculate base amount
        const baseAmount = courses.reduce((total, course) => total + (course.credits * settings.baseTuitionPerCredit), 0);
        
        // Get fee items
        const feeItems = settings.fees.map((fee: { type: string; amount: number; description: string; mandatory: boolean }) => ({
            type: fee.type,
            amount: fee.amount,
            description: fee.description,
            isMandatory: fee.mandatory
        }));

        // Get student info for priority check
        const studentInfo = await DatabaseService.queryOne(`
            SELECT 
                sv.masosinhvien,
                sv.vungxa,
                sv.dienchinhsach,
                sv.xeploaihocbong
            FROM sinhvien sv
            WHERE sv.masosinhvien = $1
        `, [studentId]);

        // Calculate applicable discounts
        const applicableDiscounts = (settings.discounts as IDiscount[])
            .filter((discount: IDiscount) => {
                // Check if student meets discount conditions
                if (discount.conditions) {
                    return discount.conditions.every((condition: { type: string; value: any }) => {
                        switch (condition.type) {
                            case 'remote_area':
                                return studentInfo?.vungxa === condition.value;
                            case 'poor_family':
                                return studentInfo?.dienchinhsach === condition.value;
                            case 'excellent_student':
                                return studentInfo?.xeploaihocbong === condition.value;
                            default:
                                return false;
                        }
                    });
                }
                return true;
            })
            .sort((a: IDiscount, b: IDiscount) => b.percentage - a.percentage) // Sort by highest percentage first
            .slice(0, settings.settings.maxTotalDiscount); // Limit number of applicable discounts

        // Calculate discount amounts
        const discounts = applicableDiscounts.map((discount: IDiscount): IDiscountResult => ({
            type: discount.type,
            percentage: discount.percentage,
            amount: (baseAmount * discount.percentage) / 100,
            description: discount.description,
            isPriority: discount.priority
        }));

        // Calculate totals
        const feesTotal = feeItems.reduce((total: number, fee: { amount: number }) => total + fee.amount, 0);
        const discountsTotal = discounts.reduce((total: number, discount: IDiscountResult) => total + discount.amount, 0);
        const totalAmount = baseAmount + feesTotal;
        const finalAmount = Math.max(0, totalAmount - discountsTotal); // Ensure amount doesn't go below 0

        return {
            baseAmount,
            fees: feeItems,
            discounts,
            feesTotal,
            discountsTotal,
            totalAmount,
            finalAmount
        };
    } catch (error) {
        console.error('Error calculating tuition:', error);
        throw new Error('Failed to calculate tuition');
    }
};

// Tuition Settings Management
export const validateTuitionSetting = async (setting: {
    faculty: string;
    program: string;
    creditCost: number;
    semester: string;
    academicYear: string;
    effectiveDate: Date;
    expiryDate: Date;
}): Promise<{ isValid: boolean; errors: string[] }> => {
    const errors: string[] = [];

    // Validate required fields
    if (!setting.faculty) errors.push('Faculty is required');
    if (!setting.program) errors.push('Program is required');
    if (!setting.semester) errors.push('Semester is required');
    if (!setting.academicYear) errors.push('Academic year is required');
    if (!setting.effectiveDate) errors.push('Effective date is required');
    if (!setting.expiryDate) errors.push('Expiry date is required');

    // Validate credit cost
    if (typeof setting.creditCost !== 'number' || setting.creditCost <= 0) {
        errors.push('Credit cost must be a positive number');
    }

    // Validate dates
    if (setting.effectiveDate >= setting.expiryDate) {
        errors.push('Effective date must be before expiry date');
    }

    // Validate semester format
    if (!/^(Spring|Summer|Fall)\s\d{4}$/.test(setting.semester)) {
        errors.push('Invalid semester format. Expected format: Spring/Summer/Fall YYYY');
    }

    // Validate academic year format
    if (!/^\d{4}-\d{4}$/.test(setting.academicYear)) {
        errors.push('Invalid academic year format. Expected format: YYYY-YYYY');
    }

    // Check for overlapping settings
    const overlappingSettings = await DatabaseService.query(`
        SELECT * FROM tuition_settings 
        WHERE faculty = $1 
        AND program = $2 
        AND semester = $3 
        AND academic_year = $4
        AND (
            (effective_date <= $5 AND expiry_date >= $5)
            OR (effective_date <= $6 AND expiry_date >= $6)
            OR (effective_date >= $5 AND expiry_date <= $6)
        )
    `, [
        setting.faculty,
        setting.program,
        setting.semester,
        setting.academicYear,
        setting.effectiveDate,
        setting.expiryDate
    ]);

    if (overlappingSettings.length > 0) {
        errors.push('Tuition setting overlaps with existing settings for the same faculty and program');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Payment Conditions Validation
export const validatePaymentConditions = async (
    studentId: string,
    semester: string,
    amount: number
): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> => {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
        // Get student's payment history
        const paymentHistory = await DatabaseService.query(`
            SELECT * FROM payment_receipts 
            WHERE student_id = $1 
            ORDER BY payment_date DESC
        `, [studentId]);

        // Get current tuition record
        const tuitionRecord = await DatabaseService.queryOne(`
            SELECT * FROM tuition_records 
            WHERE student_id = $1 AND semester = $2
        `, [studentId, semester]);

        if (!tuitionRecord) {
            errors.push('No tuition record found for the specified semester');
            return { isValid: false, errors, warnings };
        }

        // Check outstanding amount
        const outstandingAmount = parseFloat(tuitionRecord.outstanding_amount);
        if (amount > outstandingAmount) {
            errors.push(`Payment amount (${amount}) exceeds outstanding amount (${outstandingAmount})`);
        }

        // Check for previous late payments
        const latePayments = paymentHistory.filter((payment: any) => {
            const paymentDate = new Date(payment.payment_date);
            const dueDate = new Date(tuitionRecord.due_date);
            return paymentDate > dueDate;
        });

        if (latePayments.length > 0) {
            warnings.push('Student has history of late payments');
        }

        // Check payment frequency
        const recentPayments = paymentHistory.filter((payment: any) => {
            const paymentDate = new Date(payment.payment_date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return paymentDate >= thirtyDaysAgo;
        });

        if (recentPayments.length >= 3) {
            warnings.push('Student has made multiple payments in the last 30 days');
        }

        // Check for payment holds
        const holds = await DatabaseService.query(`
            SELECT * FROM payment_holds 
            WHERE student_id = $1 AND is_active = true
        `, [studentId]);

        if (holds.length > 0) {
            errors.push('Student has active payment holds');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    } catch (error) {
        console.error('Error validating payment conditions:', error);
        errors.push('Error validating payment conditions');
        return { isValid: false, errors, warnings };
    }
};

export class FinancialManager {
    // ... existing code ...
}

export default new FinancialManager();

// Tuition Settings Management
export const deleteTuitionSetting = async (id: string): Promise<void> => {
    try {
        await DatabaseService.query(`
            DELETE FROM tuition_settings WHERE id = $1
        `, [id]);
    } catch (error) {
        console.error('Error deleting tuition setting:', error);
        throw new AppError(500, 'Error deleting tuition setting');
    }
};

// Payment Receipts Management
export const getAllReceipts = async (studentId?: string, semester?: string): Promise<any[]> => {
    try {
        let whereConditions = [];
        let queryParams = [];
        let paramIndex = 1;

        if (studentId) {
            whereConditions.push(`student_id = $${paramIndex}`);
            queryParams.push(studentId);
            paramIndex++;
        }

        if (semester) {
            whereConditions.push(`semester = $${paramIndex}`);
            queryParams.push(semester);
            paramIndex++;
        }

        const whereClause = whereConditions.length > 0 
            ? `WHERE ${whereConditions.join(' AND ')}` 
            : '';

        const receipts = await DatabaseService.query(`
            SELECT * FROM payment_receipts
            ${whereClause}
            ORDER BY payment_date DESC
        `, queryParams);

        return receipts;
    } catch (error) {
        console.error('Error getting receipts:', error);
        throw new AppError(500, 'Error retrieving receipts');
    }
};

export const getReceiptById = async (id: string): Promise<any> => {
    try {
        const receipt = await DatabaseService.queryOne(`
            SELECT * FROM payment_receipts WHERE id = $1
        `, [id]);
        return receipt;
    } catch (error) {
        console.error('Error getting receipt:', error);
        throw new AppError(500, 'Error retrieving receipt');
    }
};

export const createReceipt = async (receiptData: any): Promise<any> => {
    try {
        const result = await DatabaseService.query(`
            INSERT INTO payment_receipts (
                student_id,
                amount,
                payment_method,
                receipt_number,
                payment_date,
                notes,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *
        `, [
            receiptData.studentId,
            receiptData.amount,
            receiptData.paymentMethod,
            receiptData.receiptNumber,
            receiptData.paymentDate,
            receiptData.notes
        ]);

        return result[0];
    } catch (error) {
        console.error('Error creating receipt:', error);
        throw new AppError(500, 'Error creating receipt');
    }
};