import { ITuitionRecord, ITuitionPaymentReceipt, TuitionCourseItem } from '../../models/student_related/studentPaymentInterface';
import { DatabaseService } from '../database/databaseService';
import { AppError } from '../../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

export const studentTuitionPaymentService = {
    async getTuitionRecords(studentId: string): Promise<ITuitionRecord[]> {
        try {
            const records = await DatabaseService.query(`
                SELECT * FROM tuition_records 
                WHERE student_id = $1
                ORDER BY created_at DESC
            `, [studentId]);

            return records.map(record => ({
                id: record.id,
                studentId: record.student_id,
                semester: record.semester,
                totalAmount: parseFloat(record.total_amount),
                paidAmount: parseFloat(record.paid_amount),
                outstandingAmount: parseFloat(record.outstanding_amount),
                paymentStatus: record.payment_status,
                courses: record.courses,
                createdAt: record.created_at,
                updatedAt: record.updated_at
            }));
        } catch (error) {
            console.error('Error getting tuition records:', error);
            throw new AppError(500, 'Error retrieving tuition records');
        }
    },

    async getPaymentReceipts(studentId: string): Promise<ITuitionPaymentReceipt[]> {
        try {
            const receipts = await DatabaseService.query(`
                SELECT * FROM payment_receipts 
                WHERE student_id = $1
                ORDER BY payment_date DESC
            `, [studentId]);

            return receipts.map(receipt => ({
                id: receipt.id,
                tuitionRecordId: receipt.tuition_record_id,
                studentId: receipt.student_id,
                amount: parseFloat(receipt.amount),
                paymentMethod: receipt.payment_method,
                receiptNumber: receipt.receipt_number,
                paymentDate: receipt.payment_date,
                notes: receipt.notes,
                createdAt: receipt.created_at
            }));
        } catch (error) {
            console.error('Error getting payment receipts:', error);
            throw new AppError(500, 'Error retrieving payment receipts');
        }
    },

    async payTuition(tuitionRecordId: string, amount: number): Promise<{ record: ITuitionRecord, receipt: ITuitionPaymentReceipt }> {
        try {
            const record = await DatabaseService.queryOne(`
                SELECT * FROM tuition_records WHERE id = $1
            `, [tuitionRecordId]);

            if (!record) {
                throw new AppError(404, 'Tuition record not found');
            }

            let paymentStatus: ITuitionRecord['paymentStatus'] = 'UNPAID';
            const newPaidAmount = parseFloat(record.paid_amount) + amount;
            const newOutstandingAmount = parseFloat(record.total_amount) - newPaidAmount;

            if (newPaidAmount >= parseFloat(record.total_amount)) {
                paymentStatus = 'PAID';
            } else if (newPaidAmount > 0) {
                paymentStatus = 'PARTIAL';
            }

            // Update tuition record
            await DatabaseService.query(`
                UPDATE tuition_records 
                SET 
                    paid_amount = $1,
                    outstanding_amount = $2,
                    payment_status = $3,
                    updated_at = NOW()
                WHERE id = $4
            `, [newPaidAmount, newOutstandingAmount, paymentStatus, tuitionRecordId]);

            // Create payment receipt
            const receiptNumber = `RCP-${Date.now()}-${record.student_id}`;
            const receipt = await DatabaseService.queryOne(`
                INSERT INTO payment_receipts (
                    tuition_record_id,
                    student_id,
                    amount,
                    payment_method,
                    receipt_number,
                    payment_date,
                    created_at
                ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                RETURNING *
            `, [tuitionRecordId, record.student_id, amount, 'CASH', receiptNumber]);

            return {
                record: {
                    id: record.id,
                    studentId: record.student_id,
                    semester: record.semester,
                    totalAmount: parseFloat(record.total_amount),
                    paidAmount: newPaidAmount,
                    outstandingAmount: newOutstandingAmount,
                    paymentStatus,
                    courses: record.courses,
                    createdAt: record.created_at,
                    updatedAt: new Date().toISOString()
                },
                receipt: {
                    id: receipt.id,
                    tuitionRecordId: receipt.tuition_record_id,
                    studentId: receipt.student_id,
                    amount: parseFloat(receipt.amount),
                    paymentMethod: receipt.payment_method,
                    receiptNumber: receipt.receipt_number,
                    paymentDate: receipt.payment_date,
                    notes: receipt.notes,
                    createdAt: receipt.created_at
                }
            };
        } catch (error) {
            console.error('Error paying tuition:', error);
            throw new AppError(500, 'Error processing tuition payment');
        }
    },
    // Tạo phiếu học phí mới khi xác nhận đăng ký
    async createTuitionRecord(studentId: string, semester: string, courses: TuitionCourseItem[]): Promise<ITuitionRecord> {
        // Check trùng môn học
        const uniqueCourses = Array.from(new Map(courses.map(c => [c.courseId, c])).values());
        if (uniqueCourses.length !== courses.length) {
            throw new Error('Có môn học bị trùng trong danh sách đăng ký!');
        }

        // Bổ sung semester/academicYear cho từng course nếu chưa có
        const now = new Date();
        const academicYear = `${now.getFullYear()}-${now.getFullYear() + 1}`;
        const coursesWithInfo = uniqueCourses.map(c => ({
            ...c,
            semester: c.semester || semester,
            academicYear: c.academicYear || academicYear
        }));

        // Tạo UUID
        const recordId = uuidv4();

        // Tính tổng tiền
        const totalAmount = coursesWithInfo.reduce((total, course) => total + course.amount, 0);

        // Tạo record
        const newRecord: ITuitionRecord = {
            id: recordId,
            studentId,
            semester,
            totalAmount,
            paidAmount: 0,
            outstandingAmount: totalAmount,
            paymentStatus: 'UNPAID',
            courses: coursesWithInfo,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Lưu xuống database
        await DatabaseService.query(
            `INSERT INTO tuition_records (id, student_id, semester, total_amount, paid_amount, outstanding_amount, payment_status, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [recordId, studentId, semester, totalAmount, 0, totalAmount, 'UNPAID', newRecord.createdAt, newRecord.updatedAt]
        );

        for (const course of coursesWithInfo) {
            await DatabaseService.query(
                `INSERT INTO tuition_courses (tuition_record_id, course_id, course_name, amount, semester, academic_year)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [recordId, course.courseId, course.courseName, course.amount, course.semester, course.academicYear]
            );
        }

        return newRecord;
    },

    // Chỉnh sửa đăng ký (thêm/xóa môn học)
    async editRegistration(tuitionRecordId: string, newCourses: TuitionCourseItem[]): Promise<ITuitionRecord> {
        try {
            // Get current record
            const currentRecord = await DatabaseService.queryOne(`
                SELECT * FROM tuition_records WHERE id = $1
            `, [tuitionRecordId]);

            if (!currentRecord) {
                throw new AppError(404, 'Tuition record not found');
            }

            // Calculate new total amount
            const newTotalAmount = newCourses.reduce((total, course) => total + course.amount, 0);
            const newOutstandingAmount = newTotalAmount - parseFloat(currentRecord.paid_amount);

            let paymentStatus: ITuitionRecord['paymentStatus'] = 'UNPAID';
            if (parseFloat(currentRecord.paid_amount) >= newTotalAmount) {
                paymentStatus = 'PAID';
            } else if (parseFloat(currentRecord.paid_amount) > 0) {
                paymentStatus = 'PARTIAL';
            }

            // Update record
            const updatedRecord: ITuitionRecord = {
                id: currentRecord.id,
                studentId: currentRecord.student_id,
                semester: currentRecord.semester,
                totalAmount: newTotalAmount,
                paidAmount: parseFloat(currentRecord.paid_amount),
                outstandingAmount: newOutstandingAmount,
                paymentStatus,
                courses: newCourses,
                createdAt: currentRecord.created_at,
                updatedAt: new Date().toISOString()
            };

            await DatabaseService.query(`
                UPDATE tuition_records 
                SET 
                    total_amount = $1,
                    outstanding_amount = $2,
                    payment_status = $3,
                    courses = $4,
                    updated_at = $5
                WHERE id = $6
            `, [
                updatedRecord.totalAmount,
                updatedRecord.outstandingAmount,
                updatedRecord.paymentStatus,
                JSON.stringify(updatedRecord.courses),
                updatedRecord.updatedAt,
                updatedRecord.id
            ]);

            return updatedRecord;
        } catch (error) {
            console.error('Error editing registration:', error);
            throw new AppError(500, 'Error updating tuition record');
        }
    },

    // Lấy phiếu học phí theo studentId
    async getTuitionRecordsByStudent(studentId: string): Promise<ITuitionRecord[]> {
        try {
            const records = await DatabaseService.query(`
                SELECT * FROM tuition_records 
                WHERE student_id = $1
                ORDER BY created_at DESC
            `, [studentId]);

            return records.map(record => ({
                id: record.id,
                studentId: record.student_id,
                semester: record.semester,
                totalAmount: parseFloat(record.total_amount),
                paidAmount: parseFloat(record.paid_amount),
                outstandingAmount: parseFloat(record.outstanding_amount),
                paymentStatus: record.payment_status,
                courses: record.courses,
                createdAt: record.created_at,
                updatedAt: record.updated_at
            }));
        } catch (error) {
            console.error('Error getting tuition records by student:', error);
            throw new AppError(500, 'Error retrieving tuition records');
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

            return receipts.map(receipt => ({
                id: receipt.id,
                tuitionRecordId: receipt.tuition_record_id,
                studentId: receipt.student_id,
                amount: parseFloat(receipt.amount),
                paymentMethod: receipt.payment_method,
                receiptNumber: receipt.receipt_number,
                paymentDate: receipt.payment_date,
                notes: receipt.notes,
                createdAt: receipt.created_at
            }));
        } catch (error) {
            console.error('Error getting payment receipts by record:', error);
            throw new AppError(500, 'Error retrieving payment receipts');
        }
    }
};

