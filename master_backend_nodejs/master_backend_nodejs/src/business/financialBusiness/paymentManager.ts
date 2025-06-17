// src/business/financialBusiness/paymentManager.ts
import { financialService } from '../../services/financialService/financialService';
import { DatabaseService } from '../../services/database/databaseService';
import { AppError } from '../../middleware/errorHandler';
import { 
    IPaymentHistory,
    IPaymentData,
    IPaymentValidation,
    IPaymentAudit
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

export default {
    getAllPaymentStatus,
    getStudentPaymentStatus,
    updatePaymentStatus,
    validatePayment,
    getPaymentAuditTrail,
    validatePaymentConditions,
    getAllReceipts,
    getReceiptById,
    createReceipt
};
