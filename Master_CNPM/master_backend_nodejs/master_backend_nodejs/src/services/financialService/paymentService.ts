// src/services/financialService/paymentService.ts
import { DatabaseService } from '../database/databaseService';
import { Database } from '../../config/database';
import { IPaymentHistory, IPaymentData } from '../../models/student_related/studentPaymentInterface';

export class FinancialPaymentService {
    /**
     * Get payment status for all students in a semester
     */
    async getPaymentStatusList(semesterId: string, filters?: {
        paymentStatus?: 'paid' | 'partial' | 'unpaid' | 'overdue';
        studentId?: string;
        offset?: number;
        limit?: number;
        semesterId?: string;
    }): Promise<{ data: any[], total: number }> {
        console.log('[getPaymentStatusList] semesterId:', semesterId);
        console.log('[getPaymentStatusList] filters:', filters);

        let whereClause = 'WHERE 1=1';
        const params: any[] = [];
        let paramIndex = 1;
        
        let semesterNumber: string | undefined;
        let year: string | undefined;

        if (filters?.semesterId) {
            // VD: "HK2_2024"
            const match = filters.semesterId.match(/^HK(\d+)_(\d{4})$/);
            if (match) {
                semesterNumber = match[1]; // "2"
                year = match[2];           // "2024"
            }
        }
        
        if (filters?.semesterId && semesterNumber && year) {
            // Nếu chọn đúng 1 học kỳ 1 năm
            whereClause += ` AND pd.MaHocKy = $${paramIndex}`;
            params.push(filters.semesterId);
            paramIndex++;
        } else if (semesterNumber) {
            // Nếu chỉ chọn học kỳ (lọc tất cả năm)
            whereClause += ` AND pd.MaHocKy LIKE $${paramIndex}`;
            params.push(`HK${semesterNumber}_%`);
            paramIndex++;
        } else if (year) {
            // Nếu chỉ chọn năm (lọc tất cả học kỳ)
            whereClause += ` AND pd.MaHocKy LIKE $${paramIndex}`;
            params.push(`%_${year}`);
            paramIndex++;
        }
        
        // Các filter khác (studentId, status, ...)
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
                pd.MaSoSinhVien AS "studentId",
                sv.HoTen AS "studentName",
                k.TenKhoa AS "faculty",
                nh.TenNganh AS "major",
                hk.NamHoc AS "year",
                CONCAT('Học kỳ ', hk.HocKyThu) AS "semester",
                pd.MaHocKy AS "semesterId",
                pd.SoTienPhaiDong AS "sotienphaidong",
                pd.SoTienConLai AS "sotienconlai",
                pd.SoTienDaDong AS "sotiendadong",
                CASE 
                    WHEN pd.SoTienConLai = 0 THEN 'Đã nộp đủ'
                    WHEN pd.SoTienDaDong = 0 THEN 'Chưa nộp đủ'
                    ELSE 'Quá hạn'
                END AS "status"
            FROM PHIEUDANGKY pd
            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
            JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh
            JOIN KHOA k ON nh.MaKhoa = k.MaKhoa
            JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy
            ${whereClause}
            ORDER BY pd.MaSoSinhVien
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        params.push(limit, offset);

        console.log('[getPaymentStatusList] params:', params);

        const data = await DatabaseService.query(dataQuery, params);
        
        // Thêm log để kiểm tra dữ liệu thô từ DB
        console.log('[getPaymentStatusList] Raw DB data:', data);

        // Log dữ liệu sau khi mapping
        const mappedData = data.map(row => ({
            id: row.studentId,
            studentId: row.studentId,
            studentName: row.studentName,
            faculty: row.faculty,
            major: row.major,
            year: row.year,
            semester: row.semester,
            semesterId: row.semesterId,
            sotienphaidong: parseFloat(row.sotienphaidong),
            sotienconlai: parseFloat(row.sotienconlai),
            status: row.status,
            paymentHistory: [],
            isOverdue: false
        }));
        console.log('[getPaymentStatusList] Mapped data:', mappedData);

        // Lấy paymentHistory cho từng phiếu đăng ký
        const dataWithHistory = await Promise.all(mappedData.map(async (row) => {
            const paymentHistory = await this.getPaymentHistory(row.studentId, row.semesterId);
            return {
                ...row,
                paymentHistory: paymentHistory.map(p => ({
                    id: p.paymentId,
                    date: p.paymentDate,
                    amount: p.amount,
                    method: p.method || ''
                }))
            };
        }));

        return {
            data: dataWithHistory,
            total: parseInt(total)
        };
    }

    /**
     * Get payment history for a specific student
     */
    async getPaymentHistory(studentId: string, semesterId?: string): Promise<IPaymentHistory[]> {
        const query = `
            SELECT 
                pt.MaPhieuThu as payment_id,
                pt.NgayLap as payment_date,
                pt.SoTienDong as amount,
                pt.PhuongThuc as method,
                pd.MaSoSinhVien as student_id
            FROM PHIEUTHUHP pt
            JOIN PHIEUDANGKY pd ON pt.MaPhieuDangKy = pd.MaPhieuDangKy
            WHERE pd.MaSoSinhVien = $1
            ${semesterId ? 'AND pd.MaHocKy = $2' : ''}
            ORDER BY pt.NgayLap DESC
        `;
        const params: any[] = [studentId];
        if (semesterId) {
            params.push(semesterId);
        }

        const result = await DatabaseService.query(query, params);
        
        return result.map(row => ({
            paymentId: row.payment_id,
            paymentDate: row.payment_date instanceof Date
                ? row.payment_date.toISOString().split('T')[0]
                : (typeof row.payment_date === 'string' && row.payment_date.includes('T')
                    ? row.payment_date.split('T')[0]
                    : row.payment_date),
            amount: parseFloat(row.amount),
            method: row.method,
            registrationId : row.registration_id
        }));
    }

    /**
     * Thêm phiếu thu học phí và cập nhật phiếu đăng ký
     */
    async confirmPayment(paymentData: IPaymentData, createdBy: string): Promise<{ success: boolean, paymentId?: string, message?: string }> {
        return Database.withClient(async (client) => {
            try {
                await client.query('BEGIN');

                // 1. Lấy MaPhieuDangKy từ PHIEUDANGKY
                const regRes = await client.query(
                    `SELECT MaPhieuDangKy FROM PHIEUDANGKY WHERE MaSoSinhVien = $1 AND MaHocKy = $2`,
                    [paymentData.studentId, paymentData.semester]
                );
                if (!regRes.rows.length) {
                    throw new Error('Không tìm thấy phiếu đăng ký');
                }
                const maPhieuDangKy = regRes.rows[0].maphieudangky;

                // 2. Thêm phiếu thu học phí (PHIEUTHUHP)
                const insertPaymentQuery = `
                    INSERT INTO PHIEUTHUHP (MaPhieuDangKy, NgayLap, SoTienDong, PhuongThuc)
                    VALUES ($1, $2, $3, $4)
                    RETURNING MaPhieuThu
                `;
                const paymentResult = await client.query(insertPaymentQuery, [
                    maPhieuDangKy,
                    paymentData.paymentDate,
                    paymentData.amount,
                    paymentData.paymentMethod
                ]);
                const paymentId = paymentResult.rows[0].maphieuthu;

                // 3. Cập nhật PHIEUDANGKY
                const updateRegistrationQuery = `
                    UPDATE PHIEUDANGKY
                    SET 
                        SoTienDaDong = SoTienDaDong + $1,
                        SoTienConLai = SoTienPhaiDong - (SoTienDaDong + $1)
                    WHERE MaPhieuDangKy = $2
                `;
                await client.query(updateRegistrationQuery, [
                    paymentData.amount,
                    maPhieuDangKy
                ]);

                await client.query('COMMIT');
                return {
                    success: true,
                    paymentId,
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

        console.log('[getPaymentAudit] SQL:', dataQuery);
        console.log('[getPaymentAudit] params:', params);

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
