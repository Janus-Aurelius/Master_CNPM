import { ITuitionRecord } from '../../models/student_related/studentPaymentInterface';
import { DatabaseService } from '../database/databaseService';

export const financialService = {
    async countTotalStudents(): Promise<number> {
        const result = await DatabaseService.queryOne(`SELECT COUNT(DISTINCT student_id) as count FROM tuition_records`);
        return result?.count || 0;
    },
    async countStudentsByPaymentStatus(status: string): Promise<number> {
        const result = await DatabaseService.queryOne(`SELECT COUNT(*) as count FROM tuition_records WHERE status = $1`, [status]);
        return result?.count || 0;
    },
    async getTotalRevenue(): Promise<number> {
        const result = await DatabaseService.queryOne(`SELECT SUM(paid_amount) as total FROM tuition_records`);
        return result?.total || 0;
    },
    async getOutstandingAmount(): Promise<number> {
        const result = await DatabaseService.queryOne(`SELECT SUM(total_amount - paid_amount) as outstanding FROM tuition_records`);
        return result?.outstanding || 0;
    },
    async getAllStudentPayments(filters: { semester?: string, faculty?: string, course?: string }): Promise<any[]> {
        let query = `SELECT * FROM tuition_records`;
        const conditions = [];
        const params = [];
        if (filters.semester) { conditions.push('semester = $' + (params.length + 1)); params.push(filters.semester); }
        if (filters.faculty) { conditions.push('faculty = $' + (params.length + 1)); params.push(filters.faculty); }
        if (filters.course) { conditions.push('course = $' + (params.length + 1)); params.push(filters.course); }
        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        return await DatabaseService.query(query, params);
    },
    async getStudentPayment(studentId: string): Promise<any | null> {
        const result = await DatabaseService.queryOne(`SELECT * FROM tuition_records WHERE student_id = $1`, [studentId]);
        return result || null;
    },
    async updateStudentPayment(studentId: string, paymentData: { paymentStatus: string, amountPaid: number, semester: string }): Promise<boolean> {
        try {
            await DatabaseService.query(`UPDATE tuition_records SET status = $1, paid_amount = $2, semester = $3 WHERE student_id = $4`, [paymentData.paymentStatus, paymentData.amountPaid, paymentData.semester, studentId]);
            return true;
        } catch {
            return false;
        }
    },
    async getTuitionSettings(semester: string): Promise<any> {
        const result = await DatabaseService.queryOne(`SELECT * FROM tuition_settings WHERE semester = $1`, [semester]);
        return result || null;
    },
    async updateTuitionSettings(semester: string, settings: any): Promise<boolean> {
        try {
            await DatabaseService.query(`UPDATE tuition_settings SET price_per_credit = $1, base_fee = $2, laboratory_fee = $3, library_fee = $4 WHERE semester = $5`, [settings.pricePerCredit, settings.baseFee, settings.laboratoryFee, settings.libraryFee, semester]);
            return true;
        } catch {
            return false;
        }
    },
    async createTuitionRecord(tuitionData: {
        studentId: string;
        courseId: string;
        semester: string;
        amount: number;
        breakdown: Array<{ description: string; amount: number }>;
        dueDate: Date;
        status: string;
    }): Promise<{ id: string; success: boolean }> {
        try {
            // Create tuition record in database
            const tuitionRecord = await DatabaseService.insert('tuition_records', {
                student_id: tuitionData.studentId,
                semester: tuitionData.semester,
                total_amount: tuitionData.amount,
                paid_amount: 0,
                remaining_amount: tuitionData.amount,
                status: tuitionData.status.toLowerCase(),
                due_date: tuitionData.dueDate
            });

            // Create course items for this tuition record
            if (tuitionData.courseId) {
                const course = await DatabaseService.queryOne(`
                    SELECT oc.*, s.subject_name, s.credits 
                    FROM open_courses oc 
                    JOIN subjects s ON oc.subject_id = s.id 
                    WHERE oc.id = $1
                `, [parseInt(tuitionData.courseId)]);

                if (course) {
                    await DatabaseService.insert('tuition_course_items', {
                        tuition_record_id: tuitionRecord.id,
                        course_id: parseInt(tuitionData.courseId),
                        course_name: course.subject_name,
                        credits: course.credits,
                        price: tuitionData.amount
                    });
                }
            }

            return {
                id: tuitionRecord.id,
                success: true
            };
        } catch (error) {
            console.error('Error creating tuition record:', error);
            return {
                id: '',
                success: false
            };
        }
    },
    async getUnpaidTuitionReport(semester: string, year: string): Promise<{ studentId: string, remainingAmount: number }[]> {
        try {
            const semesterQuery = `${semester} ${year}`;
            const unpaidRecords = await DatabaseService.query(`
                SELECT student_id, remaining_amount 
                FROM tuition_records 
                WHERE semester = $1 AND status != 'paid'
            `, [semesterQuery]);

            return unpaidRecords.map((r: any) => ({ 
                studentId: r.student_id, 
                remainingAmount: r.remaining_amount 
            }));
        } catch (error) {
            console.error('Error getting unpaid tuition report:', error);
            return [];
        }
    }
};