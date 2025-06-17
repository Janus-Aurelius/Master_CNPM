// src/business/financialBusiness/financialManager.ts
// Central financial manager - delegates to specialized managers

import dashboardManager from './dashboardManager';
import paymentManager from './paymentManager';
import tuitionManager from './tuitionManager';
import { DatabaseService } from '../../services/database/databaseService';
import { AppError } from '../../middleware/errorHandler';

// Utility function to get current semester
export const getCurrentSemester = (): string => {
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

// Configuration Management Functions
export const getTuitionSettings = async (semester: string) => {
    try {
        if (!semester) {
            semester = getCurrentSemester();
        }

        // Get basic tuition configuration
        const basicConfig = await DatabaseService.query(`
            SELECT 
                semester,
                base_tuition_rate,
                late_fee_rate,
                early_payment_discount,
                due_date_offset,
                payment_methods,
                currency,
                created_at,
                updated_at
            FROM tuition_settings 
            WHERE semester = $1
        `, [semester]);

        // Get priority objects (discount configurations)
        const priorityObjects = await DatabaseService.query(`
            SELECT 
                priority_object_id,
                priority_name,
                discount_amount,
                discount_percentage,
                is_active
            FROM doituonguutien
            WHERE is_active = true
            ORDER BY priority_name
        `);

        // Get course types and their pricing
        const courseTypes = await DatabaseService.query(`
            SELECT 
                course_type_id,
                type_name,
                credit_price,
                is_active
            FROM loaimon
            WHERE is_active = true  
            ORDER BY type_name
        `);

        // Get semester-specific fees
        const semesterFees = await DatabaseService.query(`
            SELECT 
                fee_type,
                amount,
                description,
                is_mandatory
            FROM semester_fees
            WHERE semester = $1 AND is_active = true
            ORDER BY fee_type
        `, [semester]);

        return {
            semester,
            basicConfig: basicConfig[0] || null,
            priorityObjects,
            courseTypes,
            semesterFees,
            generatedAt: new Date()
        };
    } catch (error) {
        console.error('Error getting tuition settings:', error);
        throw new AppError(500, 'Error retrieving tuition settings');
    }
};

export const updateTuitionSettings = async (semester: string, settings: any) => {
    try {
        // Validate settings
        if (!semester) {
            throw new AppError(400, 'Semester is required');
        }

        if (settings.baseTuitionRate && settings.baseTuitionRate < 0) {
            throw new AppError(400, 'Base tuition rate cannot be negative');
        }

        // Start transaction
        await DatabaseService.query('BEGIN');

        try {
            // Update or create basic tuition settings
            if (settings.basicConfig) {
                const existing = await DatabaseService.queryOne(`
                    SELECT semester FROM tuition_settings WHERE semester = $1
                `, [semester]);

                if (existing) {
                    // Update existing
                    await DatabaseService.query(`
                        UPDATE tuition_settings 
                        SET 
                            base_tuition_rate = COALESCE($1, base_tuition_rate),
                            late_fee_rate = COALESCE($2, late_fee_rate),
                            early_payment_discount = COALESCE($3, early_payment_discount),
                            due_date_offset = COALESCE($4, due_date_offset),
                            payment_methods = COALESCE($5, payment_methods),
                            currency = COALESCE($6, currency),
                            updated_at = NOW()
                        WHERE semester = $7
                    `, [
                        settings.basicConfig.baseTuitionRate,
                        settings.basicConfig.lateFeeRate,
                        settings.basicConfig.earlyPaymentDiscount,
                        settings.basicConfig.dueDateOffset,
                        JSON.stringify(settings.basicConfig.paymentMethods),
                        settings.basicConfig.currency,
                        semester
                    ]);
                } else {
                    // Create new
                    await DatabaseService.query(`
                        INSERT INTO tuition_settings (
                            semester,
                            base_tuition_rate,
                            late_fee_rate,
                            early_payment_discount,
                            due_date_offset,
                            payment_methods,
                            currency,
                            created_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                    `, [
                        semester,
                        settings.basicConfig.baseTuitionRate || 0,
                        settings.basicConfig.lateFeeRate || 0,
                        settings.basicConfig.earlyPaymentDiscount || 0,
                        settings.basicConfig.dueDateOffset || 30,
                        JSON.stringify(settings.basicConfig.paymentMethods || []),
                        settings.basicConfig.currency || 'VND'
                    ]);
                }
            }

            // Update semester fees if provided
            if (settings.semesterFees && Array.isArray(settings.semesterFees)) {
                // Remove existing fees for this semester
                await DatabaseService.query(`
                    DELETE FROM semester_fees WHERE semester = $1
                `, [semester]);

                // Insert new fees
                for (const fee of settings.semesterFees) {
                    await DatabaseService.query(`
                        INSERT INTO semester_fees (
                            semester,
                            fee_type,
                            amount,
                            description,
                            is_mandatory,
                            is_active,
                            created_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
                    `, [
                        semester,
                        fee.feeType,
                        fee.amount,
                        fee.description || '',
                        fee.isMandatory || false,
                        true
                    ]);
                }
            }

            // Commit transaction
            await DatabaseService.query('COMMIT');

            return {
                success: true,
                message: 'Tuition settings updated successfully',
                semester,
                updatedAt: new Date()
            };
        } catch (error) {
            // Rollback on error
            await DatabaseService.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error updating tuition settings:', error);
        throw new AppError(500, 'Error updating tuition settings');
    }
};

// Validation Functions
export const validateTuitionSetting = async (setting: {
    semester: string;
    courseTypeId: string;
    creditPrice: number;
}) => {
    try {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validate semester format
        if (!setting.semester || !/^(Spring|Summer|Fall) \d{4}$/.test(setting.semester)) {
            errors.push('Invalid semester format. Expected format: "Spring 2024"');
        }

        // Validate course type exists
        if (setting.courseTypeId) {
            const courseType = await DatabaseService.queryOne(`
                SELECT course_type_id FROM loaimon WHERE course_type_id = $1
            `, [setting.courseTypeId]);

            if (!courseType) {
                errors.push('Course type not found');
            }
        }

        // Validate credit price
        if (setting.creditPrice < 0) {
            errors.push('Credit price cannot be negative');
        }

        if (setting.creditPrice > 10000000) { // 10M VND per credit
            warnings.push('Credit price seems unusually high');
        }

        // Check for existing settings in the same semester
        if (setting.semester && setting.courseTypeId) {
            const existing = await DatabaseService.queryOne(`
                SELECT lm.* FROM loaimon lm
                WHERE lm.course_type_id = $1
            `, [setting.courseTypeId]);

            if (existing) {
                warnings.push('Course type already has pricing configured');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    } catch (error) {
        console.error('Error validating tuition setting:', error);
        return {
            isValid: false,
            errors: ['Error validating tuition setting'],
            warnings: []
        };
    }
};

export const deleteTuitionSetting = async (id: string): Promise<void> => {
    try {
        if (!id) {
            throw new AppError(400, 'Setting ID is required');
        }

        // Check if setting exists and is not in use
        const setting = await DatabaseService.queryOne(`
            SELECT course_type_id FROM loaimon WHERE course_type_id = $1
        `, [id]);

        if (!setting) {
            throw new AppError(404, 'Tuition setting not found');
        }

        // Check if setting is in use by any courses
        const inUse = await DatabaseService.queryOne(`
            SELECT COUNT(*) as count FROM courses WHERE course_type_id = $1
        `, [id]);

        if (parseInt(inUse.count) > 0) {
            throw new AppError(400, 'Cannot delete tuition setting that is in use by courses');
        }

        // Delete the setting
        await DatabaseService.query(`
            UPDATE loaimon SET is_active = false WHERE course_type_id = $1
        `, [id]);
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error deleting tuition setting:', error);
        throw new AppError(500, 'Error deleting tuition setting');
    }
};

// Report Generation
export const generateFinancialReport = async (reportType: 'summary' | 'detailed' | 'overdue', filters: {
    semester?: string;
    faculty?: string;
    startDate?: string;
    endDate?: string;
}) => {
    try {
        const currentSemester = filters.semester || getCurrentSemester();
        
        switch (reportType) {
            case 'summary':
                return await generateSummaryReport(currentSemester, filters);
            case 'detailed':
                return await generateDetailedReport(currentSemester, filters);
            case 'overdue':
                return await generateOverdueReport(currentSemester, filters);
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
    const summary = await DatabaseService.query(`
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
        generatedAt: new Date(),
        data: summary[0]
    };
};

const generateDetailedReport = async (semester: string, filters: any) => {
    const detailed = await DatabaseService.query(`
        SELECT 
            tr.*,
            s.full_name,
            s.faculty,
            s.program,
            s.student_year,
            dt.priority_name
        FROM tuition_records tr
        JOIN students s ON tr.student_id = s.student_id
        LEFT JOIN doituonguutien dt ON s.priority_object_id = dt.priority_object_id
        WHERE tr.semester = $1
        ${filters.faculty ? 'AND s.faculty = $2' : ''}
        ORDER BY s.faculty, s.full_name
    `, filters.faculty ? [semester, filters.faculty] : [semester]);

    return {
        reportType: 'detailed',
        semester,
        generatedAt: new Date(),
        data: detailed
    };
};

const generateOverdueReport = async (semester: string, filters: any) => {
    const overdue = await DatabaseService.query(`
        SELECT 
            tr.*,
            s.full_name,
            s.faculty,
            s.program,
            s.email,
            s.phone,
            CURRENT_DATE - tr.due_date as days_overdue
        FROM tuition_records tr
        JOIN students s ON tr.student_id = s.student_id
        WHERE tr.semester = $1
        AND tr.payment_status IN ('UNPAID', 'PARTIAL')
        AND tr.due_date < CURRENT_DATE
        ${filters.faculty ? 'AND s.faculty = $2' : ''}
        ORDER BY days_overdue DESC, tr.outstanding_amount DESC
    `, filters.faculty ? [semester, filters.faculty] : [semester]);

    return {
        reportType: 'overdue',
        semester,
        generatedAt: new Date(),
        data: overdue
    };
};

// Delegate functions to specialized managers
export const getDashboardData = dashboardManager.getDashboardData;
export const getFinancialAnalytics = dashboardManager.getFinancialAnalytics;

export const getAllPaymentStatus = paymentManager.getAllPaymentStatus;
export const getStudentPaymentStatus = paymentManager.getStudentPaymentStatus;
export const updatePaymentStatus = paymentManager.updatePaymentStatus;
export const validatePayment = paymentManager.validatePayment;
export const getPaymentAuditTrail = paymentManager.getPaymentAuditTrail;
export const validatePaymentConditions = paymentManager.validatePaymentConditions;
export const getAllReceipts = paymentManager.getAllReceipts;
export const getReceiptById = paymentManager.getReceiptById;
export const createReceipt = paymentManager.createReceipt;

export const calculateTuition = tuitionManager.calculateTuitionForStudent;
export const createTuitionRecord = tuitionManager.createTuitionRecord;
export const getTuitionRecord = tuitionManager.getTuitionRecord;
export const updateTuitionRecord = tuitionManager.updateTuitionRecord;
export const deleteTuitionRecord = tuitionManager.deleteTuitionRecord;
export const adjustTuition = tuitionManager.adjustTuition;

// Default export for compatibility
export default {
    getCurrentSemester,
    getTuitionSettings,
    updateTuitionSettings,
    validateTuitionSetting,
    deleteTuitionSetting,
    generateFinancialReport,
    
    // Dashboard functions  
    getDashboardData,
    getFinancialAnalytics,
    
    // Payment functions
    getAllPaymentStatus,
    getStudentPaymentStatus,
    updatePaymentStatus,
    validatePayment,
    getPaymentAuditTrail,
    validatePaymentConditions,
    getAllReceipts,
    getReceiptById,
    createReceipt,
    
    // Tuition functions
    calculateTuition,
    createTuitionRecord,
    getTuitionRecord,
    updateTuitionRecord,
    deleteTuitionRecord,
    adjustTuition
};
