// src/business/financialBusiness/tuitionManager.ts
import { financialService } from '../../services/financialService/financialService';
import { DatabaseService } from '../../services/database/databaseService';
import { AppError } from '../../middleware/errorHandler';
import { 
    ITuitionCalculation,
    ITuitionCalculationExtended,
    TuitionCourseItem
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

// Tuition Calculation Functions
export const calculateTuitionForStudent = async (
    studentId: string,
    semester: string,
    courseList?: TuitionCourseItem[]
): Promise<ITuitionCalculationExtended> => {
    try {
        if (!studentId || !semester) {
            throw new AppError(400, 'Student ID and semester are required');
        }

        // Get student information
        const student = await DatabaseService.queryOne(`
            SELECT s.*, dt.discount_percentage, dt.discount_amount, dt.priority_name
            FROM students s
            LEFT JOIN doituonguutien dt ON s.priority_object_id = dt.priority_object_id
            WHERE s.student_id = $1
        `, [studentId]);

        if (!student) {
            throw new AppError(404, 'Student not found');
        }

        let totalTuition = 0;
        let courses: TuitionCourseItem[] = [];

        if (courseList && courseList.length > 0) {
            // Use provided course list
            courses = courseList;
        } else {
            // Get enrolled courses for the semester
            const enrolled = await DatabaseService.query(`
                SELECT 
                    c.course_code,
                    c.course_name,
                    c.credits,
                    lm.credit_price,
                    lm.type_name as fee_type
                FROM enrollments e
                JOIN courses c ON e.course_code = c.course_code
                LEFT JOIN loaimon lm ON c.course_type_id = lm.course_type_id
                WHERE e.student_id = $1 AND e.semester = $2
            `, [studentId, semester]);

            courses = enrolled.map((course: any) => ({
                courseCode: course.course_code,
                courseName: course.course_name,
                credits: course.credits,
                creditPrice: parseFloat(course.credit_price || 0),
                feeType: course.fee_type || 'REGULAR',
                amount: course.credits * parseFloat(course.credit_price || 0)
            }));
        }

        // Calculate total tuition from courses
        totalTuition = courses.reduce((total, course) => total + course.amount, 0);

        // Apply priority discount if available
        let discountAmount = 0;
        let discountPercentage = 0;

        if (student.discount_percentage) {
            discountPercentage = parseFloat(student.discount_percentage);
            discountAmount = totalTuition * (discountPercentage / 100);
        } else if (student.discount_amount) {
            discountAmount = parseFloat(student.discount_amount);
            discountPercentage = (discountAmount / totalTuition) * 100;
        }

        const finalAmount = totalTuition - discountAmount;

        // Additional fees (administrative, lab, etc.)
        const additionalFees = await DatabaseService.query(`
            SELECT fee_type, amount, description
            FROM semester_fees
            WHERE semester = $1 AND is_active = true
        `, [semester]);

        const additionalFeesAmount = additionalFees.reduce(
            (total: number, fee: any) => total + parseFloat(fee.amount),
            0
        );

        const result: ITuitionCalculationExtended = {
            studentId,
            semester,
            baseTuition: totalTuition,
            discountAmount,
            discountPercentage,
            additionalFees: additionalFeesAmount,
            totalAmount: finalAmount + additionalFeesAmount,
            courses,
            priorityObject: student.priority_name || null,
            calculatedAt: new Date(),
            breakdown: {
                courseFees: totalTuition,
                discounts: discountAmount,
                additionalCharges: additionalFeesAmount,
                netAmount: finalAmount + additionalFeesAmount
            },
            feeStructure: additionalFees.map((fee: any) => ({
                type: fee.fee_type,
                amount: parseFloat(fee.amount),
                description: fee.description
            }))
        };

        return result;
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error calculating tuition:', error);
        throw new AppError(500, 'Error calculating tuition for student');
    }
};

export const createTuitionRecord = async (
    tuitionData: ITuitionCalculationExtended
): Promise<any> => {
    try {
        // Start transaction
        await DatabaseService.query('BEGIN');

        try {
            // Check if record already exists
            const existing = await DatabaseService.queryOne(`
                SELECT id FROM tuition_records 
                WHERE student_id = $1 AND semester = $2
            `, [tuitionData.studentId, tuitionData.semester]);

            if (existing) {
                throw new AppError(409, 'Tuition record already exists for this semester');
            }

            // Create tuition record
            const tuitionRecord = await DatabaseService.query(`
                INSERT INTO tuition_records (
                    student_id,
                    semester,
                    total_amount,
                    paid_amount,
                    outstanding_amount,
                    discount_amount,
                    discount_percentage,
                    additional_fees,
                    payment_status,
                    due_date,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
                RETURNING *
            `, [
                tuitionData.studentId,
                tuitionData.semester,
                tuitionData.totalAmount,
                0, // paid_amount starts at 0
                tuitionData.totalAmount, // outstanding_amount equals total initially
                tuitionData.discountAmount || 0,
                tuitionData.discountPercentage || 0,
                tuitionData.additionalFees || 0,
                'PENDING',
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            ]);

            const recordId = tuitionRecord[0].id;

            // Create course items
            if (tuitionData.courses && tuitionData.courses.length > 0) {
                for (const course of tuitionData.courses) {
                    await DatabaseService.query(`
                        INSERT INTO tuition_course_items (
                            tuition_record_id,
                            course_code,
                            course_name,
                            credits,
                            fee_type,
                            amount,
                            paid_amount,
                            status,
                            created_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                    `, [
                        recordId,
                        course.courseCode,
                        course.courseName,
                        course.credits,
                        course.feeType,
                        course.amount,
                        0, // paid_amount starts at 0
                        'PENDING'
                    ]);
                }
            }

            // Commit transaction
            await DatabaseService.query('COMMIT');

            return {
                success: true,
                tuitionRecordId: recordId,
                message: 'Tuition record created successfully',
                data: tuitionRecord[0]
            };
        } catch (error) {
            // Rollback on error
            await DatabaseService.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error creating tuition record:', error);
        throw new AppError(500, 'Error creating tuition record');
    }
};

export const updateTuitionRecord = async (
    studentId: string,
    semester: string,
    updateData: Partial<ITuitionCalculationExtended>
): Promise<any> => {
    try {
        // Get existing record
        const existing = await DatabaseService.queryOne(`
            SELECT * FROM tuition_records 
            WHERE student_id = $1 AND semester = $2
        `, [studentId, semester]);

        if (!existing) {
            throw new AppError(404, 'Tuition record not found');
        }

        // Start transaction
        await DatabaseService.query('BEGIN');

        try {
            // Update main record
            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;

            if (updateData.totalAmount !== undefined) {
                updateFields.push(`total_amount = $${paramIndex}`);
                updateValues.push(updateData.totalAmount);
                paramIndex++;
            }

            if (updateData.discountAmount !== undefined) {
                updateFields.push(`discount_amount = $${paramIndex}`);
                updateValues.push(updateData.discountAmount);
                paramIndex++;
            }

            if (updateData.discountPercentage !== undefined) {
                updateFields.push(`discount_percentage = $${paramIndex}`);
                updateValues.push(updateData.discountPercentage);
                paramIndex++;
            }

            if (updateData.additionalFees !== undefined) {
                updateFields.push(`additional_fees = $${paramIndex}`);
                updateValues.push(updateData.additionalFees);
                paramIndex++;
            }

            if (updateFields.length > 0) {
                updateFields.push(`updated_at = NOW()`);
                updateValues.push(studentId, semester);

                await DatabaseService.query(`
                    UPDATE tuition_records 
                    SET ${updateFields.join(', ')}
                    WHERE student_id = $${paramIndex} AND semester = $${paramIndex + 1}
                `, updateValues);
            }

            // Update course items if provided
            if (updateData.courses && updateData.courses.length > 0) {
                // Delete existing course items
                await DatabaseService.query(`
                    DELETE FROM tuition_course_items 
                    WHERE tuition_record_id = $1
                `, [existing.id]);

                // Insert new course items
                for (const course of updateData.courses) {
                    await DatabaseService.query(`
                        INSERT INTO tuition_course_items (
                            tuition_record_id,
                            course_code,
                            course_name,
                            credits,
                            fee_type,
                            amount,
                            paid_amount,
                            status,
                            created_at
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                    `, [
                        existing.id,
                        course.courseCode,
                        course.courseName,
                        course.credits,
                        course.feeType,
                        course.amount,
                        0, // Reset paid amount
                        'PENDING'
                    ]);
                }
            }

            // Commit transaction
            await DatabaseService.query('COMMIT');

            return {
                success: true,
                message: 'Tuition record updated successfully'
            };
        } catch (error) {
            // Rollback on error
            await DatabaseService.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error updating tuition record:', error);
        throw new AppError(500, 'Error updating tuition record');
    }
};

export const getTuitionRecord = async (
    studentId: string,
    semester?: string
): Promise<any> => {
    try {
        const currentSemester = semester || getCurrentSemester();

        const record = await DatabaseService.queryOne(`
            SELECT 
                tr.*,
                s.full_name as student_name,
                s.faculty,
                s.program,
                dt.priority_name,
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
                ) as courses
            FROM tuition_records tr
            JOIN students s ON tr.student_id = s.student_id
            LEFT JOIN doituonguutien dt ON s.priority_object_id = dt.priority_object_id
            LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id
            WHERE tr.student_id = $1 AND tr.semester = $2
            GROUP BY tr.id, s.full_name, s.faculty, s.program, dt.priority_name
        `, [studentId, currentSemester]);

        if (!record) {
            throw new AppError(404, 'Tuition record not found');
        }

        return {
            ...record,
            total_amount: parseFloat(record.total_amount),
            paid_amount: parseFloat(record.paid_amount),
            outstanding_amount: parseFloat(record.outstanding_amount),
            discount_amount: parseFloat(record.discount_amount || 0),
            additional_fees: parseFloat(record.additional_fees || 0),
            courses: typeof record.courses === 'string' ? JSON.parse(record.courses) : record.courses
        };
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error getting tuition record:', error);
        throw new AppError(500, 'Error retrieving tuition record');
    }
};

export const deleteTuitionRecord = async (
    studentId: string,
    semester: string
): Promise<any> => {
    try {
        // Check if record exists and has no payments
        const record = await DatabaseService.queryOne(`
            SELECT * FROM tuition_records 
            WHERE student_id = $1 AND semester = $2
        `, [studentId, semester]);

        if (!record) {
            throw new AppError(404, 'Tuition record not found');
        }

        if (parseFloat(record.paid_amount) > 0) {
            throw new AppError(400, 'Cannot delete tuition record with existing payments');
        }

        // Start transaction
        await DatabaseService.query('BEGIN');

        try {
            // Delete course items first
            await DatabaseService.query(`
                DELETE FROM tuition_course_items 
                WHERE tuition_record_id = $1
            `, [record.id]);

            // Delete main record
            await DatabaseService.query(`
                DELETE FROM tuition_records 
                WHERE student_id = $1 AND semester = $2
            `, [studentId, semester]);

            // Commit transaction
            await DatabaseService.query('COMMIT');

            return {
                success: true,
                message: 'Tuition record deleted successfully'
            };
        } catch (error) {
            // Rollback on error
            await DatabaseService.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error deleting tuition record:', error);
        throw new AppError(500, 'Error deleting tuition record');
    }
};

// Tuition Adjustment Functions
export const adjustTuition = async (
    studentId: string,
    semester: string,
    adjustmentData: {
        type: 'DISCOUNT' | 'SURCHARGE' | 'CORRECTION';
        amount: number;
        reason: string;
        performedBy: string;
    }
): Promise<any> => {
    try {
        // Get existing record
        const record = await DatabaseService.queryOne(`
            SELECT * FROM tuition_records 
            WHERE student_id = $1 AND semester = $2
        `, [studentId, semester]);

        if (!record) {
            throw new AppError(404, 'Tuition record not found');
        }

        // Calculate new amounts
        const currentTotal = parseFloat(record.total_amount);
        const currentPaid = parseFloat(record.paid_amount);
        
        let newTotal: number;
        if (adjustmentData.type === 'DISCOUNT') {
            newTotal = currentTotal - Math.abs(adjustmentData.amount);
        } else if (adjustmentData.type === 'SURCHARGE') {
            newTotal = currentTotal + Math.abs(adjustmentData.amount);
        } else { // CORRECTION
            newTotal = adjustmentData.amount; // Direct correction to total
        }

        if (newTotal < 0) {
            throw new AppError(400, 'Adjusted tuition cannot be negative');
        }

        const newOutstanding = Math.max(0, newTotal - currentPaid);

        // Start transaction
        await DatabaseService.query('BEGIN');

        try {
            // Update tuition record
            await DatabaseService.query(`
                UPDATE tuition_records 
                SET 
                    total_amount = $1,
                    outstanding_amount = $2,
                    updated_at = NOW()
                WHERE student_id = $3 AND semester = $4
            `, [newTotal, newOutstanding, studentId, semester]);

            // Create adjustment log
            await DatabaseService.query(`
                INSERT INTO tuition_adjustments (
                    tuition_record_id,
                    student_id,
                    adjustment_type,
                    amount,
                    previous_total,
                    new_total,
                    reason,
                    performed_by,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            `, [
                record.id,
                studentId,
                adjustmentData.type,
                adjustmentData.amount,
                currentTotal,
                newTotal,
                adjustmentData.reason,
                adjustmentData.performedBy
            ]);

            // Commit transaction
            await DatabaseService.query('COMMIT');

            return {
                success: true,
                message: 'Tuition adjusted successfully',
                adjustment: {
                    type: adjustmentData.type,
                    amount: adjustmentData.amount,
                    previousTotal: currentTotal,
                    newTotal: newTotal,
                    reason: adjustmentData.reason
                }
            };
        } catch (error) {
            // Rollback on error
            await DatabaseService.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        if (error instanceof AppError) throw error;
        console.error('Error adjusting tuition:', error);
        throw new AppError(500, 'Error adjusting tuition');
    }
};

// Bulk operations
export const calculateTuitionForMultipleStudents = async (
    studentIds: string[],
    semester: string
): Promise<any[]> => {
    try {
        const results = [];

        for (const studentId of studentIds) {
            try {
                const calculation = await calculateTuitionForStudent(studentId, semester);
                results.push({
                    studentId,
                    success: true,
                    data: calculation
                });
            } catch (error) {
                results.push({
                    studentId,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        return results;
    } catch (error) {
        console.error('Error calculating tuition for multiple students:', error);
        throw new AppError(500, 'Error calculating tuition for multiple students');
    }
};

export const createTuitionRecordsForSemester = async (
    semester: string,
    filters?: {
        faculty?: string;
        program?: string;
        year?: number;
    }
): Promise<any> => {
    try {
        // Get students based on filters
        let whereConditions = ['1 = 1'];
        let queryParams = [];
        let paramIndex = 1;

        if (filters?.faculty) {
            whereConditions.push(`faculty = $${paramIndex}`);
            queryParams.push(filters.faculty);
            paramIndex++;
        }

        if (filters?.program) {
            whereConditions.push(`program = $${paramIndex}`);
            queryParams.push(filters.program);
            paramIndex++;
        }

        if (filters?.year) {
            whereConditions.push(`student_year = $${paramIndex}`);
            queryParams.push(filters.year);
            paramIndex++;
        }

        const students = await DatabaseService.query(`
            SELECT student_id FROM students 
            WHERE ${whereConditions.join(' AND ')} 
            AND status = 'ACTIVE'
        `, queryParams);

        const results = [];
        let successCount = 0;
        let errorCount = 0;

        for (const student of students) {
            try {
                const calculation = await calculateTuitionForStudent(student.student_id, semester);
                await createTuitionRecord(calculation);
                results.push({
                    studentId: student.student_id,
                    success: true
                });
                successCount++;
            } catch (error) {
                results.push({
                    studentId: student.student_id,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
                errorCount++;
            }
        }

        return {
            success: true,
            summary: {
                totalStudents: students.length,
                successCount,
                errorCount
            },
            details: results
        };
    } catch (error) {
        console.error('Error creating tuition records for semester:', error);
        throw new AppError(500, 'Error creating tuition records for semester');
    }
};

export default {
    calculateTuitionForStudent,
    createTuitionRecord,
    updateTuitionRecord,
    getTuitionRecord,
    deleteTuitionRecord,
    adjustTuition,
    calculateTuitionForMultipleStudents,
    createTuitionRecordsForSemester
};
