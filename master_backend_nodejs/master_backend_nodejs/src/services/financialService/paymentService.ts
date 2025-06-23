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
        semesterId?: string;
    }): Promise<{ data: any[], total: number }> {
        console.log('[getPaymentStatusList] semesterId:', semesterId);
        console.log('[getPaymentStatusList] filters:', filters);        // Base where clause - always filter by semester first (your approach)
        let whereClause = 'WHERE pd.mahocky = $1';
        const params: any[] = [semesterId];
        let paramIndex = 2;

        // Add student ID filter if provided
        if (filters?.studentId) {
            whereClause += ` AND pd.masosinhvien LIKE $${paramIndex}`;
            params.push(`%${filters.studentId}%`);
            paramIndex++;
        }        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total
            FROM PHIEUDANGKY pd
            JOIN HOCKYNAMHOC hk ON pd.mahocky = hk.mahocky
            ${whereClause}
        `;
        const countResult = await DatabaseService.queryOne(countQuery, params);
        const total = countResult?.total || 0;

        // Get paginated data with dynamic calculation using your logic
        const offset = filters?.offset || 0;
        const limit = filters?.limit || 50;
          const dataQuery = `
            SELECT 
                pd.masosinhvien AS "studentId",
                sv.hoten AS "studentName",
                k.tenkhoa AS "faculty", 
                nh.tennganh AS "major",
                hk.namhoc AS "year",
                CONCAT('Học kỳ ', hk.hockythu) AS "semester",
                pd.mahocky AS "semesterId",
                hk.thoihandonghp AS "dueDate",
                
                -- SoTienPhaiDong calculation using your formula
                COALESCE(
                    (SELECT SUM(
                        (mh.sotiet::decimal / lm.sotietmottc) * lm.sotienmottc * (1 - COALESCE(dt.mucgiamhocphi, 0))
                    )
                    FROM ct_phieudangky ct
                    JOIN monhoc mh ON ct.mamonhoc = mh.mamonhoc
                    JOIN loaimon lm ON mh.maloaimon = lm.maloaimon
                    JOIN sinhvien sv2 ON pd.masosinhvien = sv2.masosinhvien
                    JOIN doituonguutien dt ON sv2.madoituongut = dt.madoituong
                    WHERE ct.maphieudangky = pd.maphieudangky), 0
                ) AS "totalAmount",
                
                -- SoTienDaDong calculation using your formula  
                COALESCE(
                    (SELECT SUM(pt.sotiendong) 
                     FROM phieuthuhp pt 
                     WHERE pt.maphieudangky = pd.maphieudangky), 0
                ) AS "paidAmount"
                
            FROM phieudangky pd
            JOIN sinhvien sv ON pd.masosinhvien = sv.masosinhvien
            JOIN nganhhoc nh ON sv.manganh = nh.manganh
            JOIN khoa k ON nh.makhoa = k.makhoa
            JOIN hockynamhoc hk ON pd.mahocky = hk.mahocky
            ${whereClause}
            ORDER BY pd.masosinhvien
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        params.push(limit, offset);

        console.log('[getPaymentStatusList] SQL:', dataQuery);
        console.log('[getPaymentStatusList] params:', params);

        const data = await DatabaseService.query(dataQuery, params);        
        // Log dữ liệu từ DB để debug
        console.log('[getPaymentStatusList] Raw DB data:', data);

        // Map data với calculated values và filter theo payment status
        const mappedData = await Promise.all(data.map(async (row) => {
            const totalAmount = parseFloat(row.totalAmount) || 0;
            const paidAmount = parseFloat(row.paidAmount) || 0;
            const remainingAmount = totalAmount - paidAmount;
            
            // Determine payment status using your logic
            let paymentStatus = 'unpaid';
            if (remainingAmount <= 0) {
                paymentStatus = 'paid';
            } else if (row.dueDate && new Date(row.dueDate) < new Date()) {
                paymentStatus = 'overdue';
            }
            
            // Get payment history for each student
            const paymentHistory = await this.getPaymentHistory(row.studentId, row.semesterId);
            
            return {
                id: row.studentId,
                studentId: row.studentId,
                studentName: row.studentName,
                faculty: row.faculty,
                major: row.major,
                year: row.year,
                semester: row.semester,
                semesterId: row.semesterId,
                totalAmount,
                paidAmount,
                remainingAmount,
                dueDate: row.dueDate,
                paymentStatus,
                paymentHistory: paymentHistory.map(p => ({
                    id: p.paymentId,
                    date: p.paymentDate,
                    amount: p.amount,
                    method: p.method || ''
                })),
                isOverdue: paymentStatus === 'overdue'
            };
        }));

        // Filter by payment status if specified
        let filteredData = mappedData;
        if (filters?.paymentStatus) {
            filteredData = mappedData.filter(item => {
                switch (filters.paymentStatus) {
                    case 'paid':
                        return item.paymentStatus === 'paid';
                    case 'unpaid':
                        return item.paymentStatus === 'unpaid' || item.paymentStatus === 'overdue';
                    case 'not_opened':
                        // Logic for semester not opened yet - check semester status
                        return false; // Implement logic based on semester state
                    default:
                        return true;
                }
            });
        }

        console.log('[getPaymentStatusList] Final mapped data:', filteredData);

        return {
            data: filteredData,
            total: parseInt(total)
        };
    }

    /**
     * Get payment history for a specific student
     */    async getPaymentHistory(studentId: string, semesterId?: string): Promise<IPaymentHistory[]> {
        const query = `
            SELECT 
                pt.maphieuthu as payment_id,
                pt.ngaylap as payment_date,
                pt.sotiendong as amount,
                pt.phuongthuc as method,
                pd.masosinhvien as student_id
            FROM phieuthuhp pt
            JOIN phieudangky pd ON pt.maphieudangky = pd.maphieudangky
            WHERE pd.masosinhvien = $1
            ${semesterId ? 'AND pd.mahocky = $2' : ''}
            ORDER BY pt.ngaylap DESC
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

                // 1. Lấy số lớn nhất hiện có
                const result = await client.query('SELECT MAX(CAST(SUBSTRING(maphieuthu, 3) AS INTEGER)) as max_num FROM phieuthuhp');
                const nextNum = (result.rows[0].max_num || 0) + 1;
                const maPhieuThu = 'PT' + String(nextNum).padStart(3, '0');

                // 2. Insert với mã này
                const insertPaymentQuery = `
                    INSERT INTO phieuthuhp (maphieuthu, maphieudangky, ngaylap, sotiendong, phuongthuc)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING maphieuthu
                `;
                const paymentResult = await client.query(insertPaymentQuery, [
                    maPhieuThu,
                    maPhieuDangKy,
                    paymentData.paymentDate,
                    paymentData.amount,
                    paymentData.paymentMethod                ]);
                const paymentId = paymentResult.rows[0].maphieuthu;

                // 3. Update PHIEUDANGKY - using your logic: only update SoTienConLai (có thể âm nếu đóng dư)
                // SoTienDaDong is calculated dynamically, not stored
                const updateRegistrationQuery = `
                    UPDATE PHIEUDANGKY
                    SET SoTienConLai = SoTienConLai - $1
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
    }    /**
     * Get list of semesters that have registration data
     */
    async getAvailableSemesters(): Promise<Array<{semesterId: string, count: number}>> {
        const query = `
            SELECT 
                pd.mahocky as semester_id,
                COUNT(*) as student_count
            FROM phieudangky pd
            GROUP BY pd.mahocky
            HAVING COUNT(*) > 0
            ORDER BY pd.mahocky DESC
        `;

        const result = await DatabaseService.query(query);
        
        return result.map(row => ({
            semesterId: row.semester_id,
            count: parseInt(row.student_count)
        }));
    }
}
