import { ITuitionRecord, ITuitionPaymentReceipt, TuitionCourseItem } from '../../models/student_related/studentPaymentInterface';
import { DatabaseService } from '../database/databaseService';

export const studentTuitionPaymentService = {
    async getTuitionRecords(studentId: string): Promise<ITuitionRecord[]> {
        return await DatabaseService.query(`SELECT * FROM tuition_records WHERE student_id = $1`, [studentId]);
    },
    async getPaymentReceipts(studentId: string): Promise<ITuitionPaymentReceipt[]> {
        return await DatabaseService.query(`SELECT * FROM payment_receipts WHERE student_id = $1`, [studentId]);
    },
    async payTuition(tuitionRecordId: string, amount: number): Promise<{ record: ITuitionRecord, receipt: ITuitionPaymentReceipt }> {
        if (typeof amount !== 'number' || amount < 0) {
            throw new Error('Invalid payment amount');
        }
        const record = await DatabaseService.queryOne(`SELECT * FROM tuition_records WHERE id = $1`, [tuitionRecordId]);
        if (!record) throw new Error('Tuition record not found');
        const newPaidAmount = record.paid_amount + amount;
        const newRemainingAmount = record.total_amount - newPaidAmount;
        let status: ITuitionRecord['status'] = 'PENDING';
        if (newPaidAmount === record.total_amount) status = 'PAID';
        else if (newPaidAmount > record.total_amount) status = 'OVERPAID';
        else if (newPaidAmount > 0) status = 'PARTIAL';
        try {
            await DatabaseService.query(`UPDATE tuition_records SET paid_amount = $1, remaining_amount = $2, status = $3, updated_at = NOW() WHERE id = $4`, [newPaidAmount, newRemainingAmount, status, tuitionRecordId]);
        } catch {
            throw new Error('Failed to update tuition record');
        }
        const receiptId = `PR_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        try {
            await DatabaseService.query(`INSERT INTO payment_receipts (id, tuition_record_id, student_id, amount, payment_date, status, created_at) VALUES ($1, $2, $3, $4, NOW(), $5, NOW())`, [receiptId, tuitionRecordId, record.student_id, amount, 'SUCCESS']);
        } catch {
            throw new Error('Failed to create payment receipt');
        }
        const updatedRecord = await DatabaseService.queryOne(`SELECT * FROM tuition_records WHERE id = $1`, [tuitionRecordId]);
        const receipt = await DatabaseService.queryOne(`SELECT * FROM payment_receipts WHERE id = $1`, [receiptId]);
        return { record: updatedRecord, receipt };
    },
    // Tạo phiếu học phí mới khi xác nhận đăng ký
    async createTuitionRecord(studentId: string, semester: string, courses: TuitionCourseItem[]): Promise<ITuitionRecord> {
        try {
            const totalAmount = courses.reduce((sum, c) => sum + c.price, 0);
            const recordId = `TR_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
            
            // Insert tuition record into database
            const insertedRecord = await DatabaseService.queryOne(`
                INSERT INTO tuition_records (
                    id, student_id, semester, total_amount, paid_amount, 
                    remaining_amount, status, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
                RETURNING *
            `, [recordId, studentId, semester, totalAmount, 0, totalAmount, 'PENDING']);

            // Insert course items
            for (const course of courses) {
                await DatabaseService.query(`
                    INSERT INTO tuition_course_items (
                        tuition_record_id, course_id, course_name, 
                        credits, price, created_at
                    ) VALUES ($1, $2, $3, $4, $5, NOW())
                `, [recordId, course.courseId, course.courseName, course.credits, course.price]);
            }

            const newRecord: ITuitionRecord = {
                id: recordId,
                studentId,
                semester,
                totalAmount,
                paidAmount: 0,
                remainingAmount: totalAmount,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                courses
            };

            return newRecord;
        } catch (error) {
            console.error('Error creating tuition record:', error);
            // Fallback to original implementation
            const totalAmount = courses.reduce((sum, c) => sum + c.price, 0);
            const newRecord: ITuitionRecord = {
                id: Math.random().toString(36).substr(2, 9),
                studentId,
                semester,
                totalAmount,
                paidAmount: 0,
                remainingAmount: totalAmount,
                status: 'PENDING',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                courses
            };
            return newRecord;
        }
    },

    // Chỉnh sửa đăng ký (thêm/xóa môn học)
    async editRegistration(tuitionRecordId: string, newCourses: TuitionCourseItem[]): Promise<ITuitionRecord> {
        try {
            // Get current record from database
            let record = await DatabaseService.queryOne(`
                SELECT * FROM tuition_records WHERE id = $1
            `, [tuitionRecordId]);

            if (!record) {
                throw new Error('Tuition record not found');
            }

            const newTotalAmount = newCourses.reduce((sum, c) => sum + c.price, 0);
            const newRemainingAmount = newTotalAmount - record.paid_amount;

            // Update status based on payment
            let status: ITuitionRecord['status'] = 'PENDING';
            if (record.paid_amount === newTotalAmount) status = 'PAID';
            else if (record.paid_amount > newTotalAmount) status = 'OVERPAID';
            else if (record.paid_amount > 0) status = 'PARTIAL';

            // Update tuition record in database
            await DatabaseService.query(`
                UPDATE tuition_records 
                SET total_amount = $1, remaining_amount = $2, status = $3, updated_at = NOW()
                WHERE id = $4
            `, [newTotalAmount, newRemainingAmount, status, tuitionRecordId]);

            // Delete old course items
            await DatabaseService.query(`
                DELETE FROM tuition_course_items WHERE tuition_record_id = $1
            `, [tuitionRecordId]);

            // Insert new course items
            for (const course of newCourses) {
                await DatabaseService.query(`
                    INSERT INTO tuition_course_items (
                        tuition_record_id, course_id, course_name, 
                        credits, price, created_at
                    ) VALUES ($1, $2, $3, $4, $5, NOW())
                `, [tuitionRecordId, course.courseId, course.courseName, course.credits, course.price]);
            }

            const updatedRecord: ITuitionRecord = {
                id: tuitionRecordId,
                studentId: record.student_id,
                semester: record.semester,
                totalAmount: newTotalAmount,
                paidAmount: record.paid_amount,
                remainingAmount: newRemainingAmount,
                status,
                createdAt: record.created_at,
                updatedAt: new Date().toISOString(),
                courses: newCourses
            };

            return updatedRecord;
        } catch (error) {
            console.error('Error editing registration:', error);
            // Fallback to original implementation
            const record = await DatabaseService.queryOne(`SELECT * FROM tuition_records WHERE id = $1`, [tuitionRecordId]);
            if (!record) throw new Error('Tuition record not found');
            
            record.courses = newCourses;
            record.totalAmount = newCourses.reduce((sum, c) => sum + c.price, 0);
            record.remainingAmount = record.totalAmount - record.paidAmount;
            
            let status: ITuitionRecord['status'] = 'PENDING';
            if (record.paidAmount === record.totalAmount) status = 'PAID';
            else if (record.paidAmount > record.totalAmount) status = 'OVERPAID';
            else if (record.paidAmount > 0) status = 'PARTIAL';
            record.status = status;
            record.updatedAt = new Date().toISOString();
            return record;
        }
    },

    // Lấy phiếu học phí theo studentId
    async getTuitionRecordsByStudent(studentId: string): Promise<ITuitionRecord[]> {
        try {
            const records = await DatabaseService.query(`
                SELECT 
                    tr.*,
                    json_agg(
                        json_build_object(
                            'courseId', tci.course_id,
                            'courseName', tci.course_name,
                            'credits', tci.credits,
                            'price', tci.price
                        )
                    ) as courses
                FROM tuition_records tr
                LEFT JOIN tuition_course_items tci ON tr.id = tci.tuition_record_id
                WHERE tr.student_id = $1
                GROUP BY tr.id, tr.student_id, tr.semester, tr.total_amount, 
                         tr.paid_amount, tr.remaining_amount, tr.status, 
                         tr.created_at, tr.updated_at
                ORDER BY tr.created_at DESC
            `, [studentId]);

            if (records && records.length > 0) {
                return records.map(record => ({
                    id: record.id,
                    studentId: record.student_id,
                    semester: record.semester,
                    totalAmount: record.total_amount,
                    paidAmount: record.paid_amount,
                    remainingAmount: record.remaining_amount,
                    status: record.status,
                    createdAt: record.created_at,
                    updatedAt: record.updated_at,
                    courses: record.courses || []
                }));
            }

            return [];
        } catch (error) {
            console.error('Error getting tuition records:', error);
            return [];
        }
    },

    // Lấy lịch sử phiếu thu
    async getPaymentReceiptsByRecord(tuitionRecordId: string): Promise<ITuitionPaymentReceipt[]> {
        try {
            const receipts = await DatabaseService.query(`
                SELECT * FROM payment_receipts 
                WHERE tuition_record_id = $1
                ORDER BY payment_date DESC
            `, [tuitionRecordId]);

            if (receipts && receipts.length > 0) {
                return receipts.map(receipt => ({
                    id: receipt.id,
                    tuitionRecordId: receipt.tuition_record_id,
                    amount: receipt.amount,
                    paymentDate: receipt.payment_date,
                    status: receipt.status
                }));
            }

            return [];
        } catch (error) {
            console.error('Error getting payment receipts:', error);
            return [];
        }
    }
};

