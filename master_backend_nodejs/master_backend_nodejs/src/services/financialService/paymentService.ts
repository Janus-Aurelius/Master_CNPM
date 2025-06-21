// src/services/financialService/paymentService.ts
import { DatabaseService } from '../database/databaseService';
import { Database } from '../../config/database';
import { IPaymentHistory, IPaymentData } from '../../models/student_related/studentPaymentInterface';

export class FinancialPaymentService {
    /**
     * Get payment status for all students in a semester
     */    async getPaymentStatusList(semesterId: string, filters?: {
        paymentStatus?: 'paid' | 'unpaid' | 'not_opened';
        studentId?: string;
        offset?: number;
        limit?: number;
    }): Promise<{ data: any[], total: number }> {
        let whereClause = 'WHERE pd.MaHocKy = $1';
        const params: any[] = [semesterId];
        let paramIndex = 2;        // Add payment status filter - simplified to only 3 states
        if (filters?.paymentStatus) {
            switch (filters.paymentStatus) {
                case 'paid':
                    whereClause += ` AND pd.SoTienConLai = 0`;
                    break;
                case 'unpaid':
                    // Số tiền còn lại > 0 (bao gồm cả partial payment trước đây)
                    whereClause += ` AND pd.SoTienConLai > 0`;
                    break;
                case 'not_opened':
                    // Logic cho học kỳ chưa mở - có thể cần bổ sung logic riêng
                    whereClause += ` AND 1=0`; // Tạm thời không có kết quả cho trường hợp này
                    break;
            }
        }

        // Add student ID filter
        if (filters?.studentId) {
            whereClause += ` AND pd.MaSoSinhVien LIKE $${paramIndex}`;
            params.push(`%${filters.studentId}%`);
            paramIndex++;
        }

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM PHIEUDANGKY pd
            JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy
            ${whereClause}
        `;
        const countResult = await DatabaseService.queryOne(countQuery, params);
        const total = countResult?.total || 0;

        // Get paginated data
        const offset = filters?.offset || 0;
        const limit = filters?.limit || 50;
          const dataQuery = `
            SELECT 
                pd.MaSoSinhVien,
                sv.HoTen,
                pd.MaHocKy,
                pd.SoTienConLai,                hk.HanDongHocPhi,
                CASE 
                    WHEN pd.SoTienConLai = 0 THEN 'paid'
                    ELSE 'unpaid'
                END as payment_status
            FROM PHIEUDANGKY pd
            JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy
            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
            ${whereClause}
            ORDER BY pd.MaSoSinhVien
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        params.push(limit, offset);

        const data = await DatabaseService.query(dataQuery, params);
        
        return {
            data: data.map(row => ({
                studentId: row.MaSoSinhVien,
                studentName: row.HoTen,
                semesterId: row.MaHocKy,
                totalAmount: parseFloat(row.SoTienConLai), // Dùng SoTienConLai làm tổng tiền
                paidAmount: 0, // Không có cột SoTienDaDong nữa
                remainingAmount: parseFloat(row.SoTienConLai),
                dueDate: row.HanDongHocPhi,
                paymentStatus: row.payment_status
            })),
            total: parseInt(total)
        };
    }

    /**
     * Get payment history for a specific student
     */
    async getPaymentHistory(studentId: string, semesterId?: string): Promise<IPaymentHistory[]> {
        let whereClause = 'WHERE pt.MaSoSinhVien = $1';
        const params: any[] = [studentId];

        if (semesterId) {
            whereClause += ' AND pt.MaHocKy = $2';
            params.push(semesterId);
        }

        const query = `
            SELECT 
                pt.MaPhieuThu as payment_id,
                pt.NgayLap as payment_date,
                pt.SoTienDong as amount,
                pt.MaPhieuDangKy as registration_id
            FROM PHIEUTHUHP pt
            ${whereClause}
            ORDER BY pt.NgayLap DESC
        `;

        const result = await DatabaseService.query(query, params);
        
        return result.map(row => ({
            paymentId: row.payment_id,
            paymentDate: row.payment_date,
            amount: parseFloat(row.amount),
            registrationId: row.registration_id
        }));
    }

    /**
     * Confirm a payment (update payment status)
     */
    async confirmPayment(paymentData: IPaymentData, createdBy: string): Promise<{ success: boolean, paymentId?: string, message?: string }> {
        return Database.withClient(async (client) => {
            try {
                await client.query('BEGIN');

                // Insert new payment record
                const insertPaymentQuery = `
                    INSERT INTO PHIEUTHUHP (
                        MaSoSinhVien, MaHocKy, SoTienDong, NgayLap, 
                        PhuongThucThanhToan, GhiChu, TrangThai, NguoiTao, NgayTao
                    ) VALUES ($1, $2, $3, $4, $5, $6, 'confirmed', $7, CURRENT_TIMESTAMP)
                    RETURNING MaPhieuThu
                `;
                
                const paymentResult = await client.query(insertPaymentQuery, [
                    paymentData.studentId,
                    paymentData.semester,
                    paymentData.amount,
                    paymentData.paymentDate,
                    paymentData.paymentMethod,
                    paymentData.notes,
                    createdBy
                ]);

                const paymentId = paymentResult.rows[0].MaPhieuThu;                // Update registration payment status
                const updateRegistrationQuery = `
                    UPDATE PHIEUDANGKY 
                    SET 
                        SoTienConLai = SoTienConLai - $1
                    WHERE MaSoSinhVien = $2 AND MaHocKy = $3
                `;
                
                await client.query(updateRegistrationQuery, [
                    paymentData.amount,
                    paymentData.studentId,
                    paymentData.semester
                ]);

                await client.query('COMMIT');

                return {
                    success: true,
                    paymentId: paymentId,
                    message: 'Payment confirmed successfully'
                };

            } catch (error: any) {
                await client.query('ROLLBACK');
                return {
                    success: false,
                    message: `Payment confirmation failed: ${error?.message || 'Unknown error'}`
                };
            }
        });
    }

    /**
     * Get payment receipt data
     */
    async getPaymentReceipt(paymentId: string): Promise<any> {
        const query = `
            SELECT 
                pt.MaPhieuThu as payment_id,
                pt.MaSoSinhVien as student_id,
                sv.HoTen as student_name,
                pt.MaHocKy as semester_id,
                hk.TenHocKy as semester_name,
                pt.SoTienDong as amount,
                pt.NgayLap as payment_date,
                pt.PhuongThucThanhToan as payment_method,
                pt.GhiChu as notes,
                pt.NguoiTao as created_by
            FROM PHIEUTHUHP pt
            JOIN SINHVIEN sv ON pt.MaSoSinhVien = sv.MaSoSinhVien
            JOIN HOCKYNAMHOC hk ON pt.MaHocKy = hk.MaHocKy
            WHERE pt.MaPhieuThu = $1
        `;

        return await DatabaseService.queryOne(query, [paymentId]);
    }

    /**
     * Get payment audit trail
     */
    async getPaymentAudit(filters?: {
        studentId?: string;
        semesterId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        offset?: number;
        limit?: number;
    }): Promise<{ data: any[], total: number }> {
        let whereClause = 'WHERE 1=1';
        const params: any[] = [];
        let paramIndex = 1;

        if (filters?.studentId) {
            whereClause += ` AND pt.MaSoSinhVien = $${paramIndex}`;
            params.push(filters.studentId);
            paramIndex++;
        }

        if (filters?.semesterId) {
            whereClause += ` AND pt.MaHocKy = $${paramIndex}`;
            params.push(filters.semesterId);
            paramIndex++;
        }

        if (filters?.dateFrom) {
            whereClause += ` AND pt.NgayLap >= $${paramIndex}`;
            params.push(filters.dateFrom);
            paramIndex++;
        }

        if (filters?.dateTo) {
            whereClause += ` AND pt.NgayLap <= $${paramIndex}`;
            params.push(filters.dateTo);
            paramIndex++;
        }

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM PHIEUTHUHP pt
            ${whereClause}
        `;
        const countResult = await DatabaseService.queryOne(countQuery, params);
        const total = countResult?.total || 0;

        // Get paginated data
        const offset = filters?.offset || 0;
        const limit = filters?.limit || 50;
        
        const dataQuery = `
            SELECT 
                pt.MaPhieuThu as payment_id,
                pt.MaSoSinhVien as student_id,
                sv.HoTen as student_name,
                pt.MaHocKy as semester_id,
                pt.SoTienDong as amount,
                pt.NgayLap as payment_date,
                pt.PhuongThucThanhToan as payment_method,
                pt.TrangThai as status,
                pt.NguoiTao as created_by,
                pt.NgayTao as created_at
            FROM PHIEUTHUHP pt
            JOIN SINHVIEN sv ON pt.MaSoSinhVien = sv.MaSoSinhVien
            ${whereClause}
            ORDER BY pt.NgayLap DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        params.push(limit, offset);

        const data = await DatabaseService.query(dataQuery, params);
        
        return {
            data: data.map(row => ({
                paymentId: row.payment_id,
                studentId: row.student_id,
                studentName: row.student_name,
                semesterId: row.semester_id,
                amount: parseFloat(row.amount),
                paymentDate: row.payment_date,
                paymentMethod: row.payment_method,
                status: row.status,
                createdBy: row.created_by,
                createdAt: row.created_at
            })),
            total: parseInt(total)
        };
    }
}
