// src/services/financialService/dashboardService.ts
import { DatabaseService } from '../database/databaseService';

export class FinancialDashboardService {
    constructor() {}

    /**
     * Get dashboard statistics for a semester
     */
    async getDashboardStats(semesterId?: string) {
        try {
            const query = `
                SELECT 
                    COUNT(DISTINCT s.student_id) as total_students,
                    COUNT(DISTINCT CASE WHEN p.status = 'PAID' THEN s.student_id END) as paid_students,
                    COUNT(DISTINCT CASE WHEN p.status = 'PARTIAL' THEN s.student_id END) as partial_students,
                    SUM(t.amount) as total_tuition,
                    SUM(p.amount_paid) as total_collected
                FROM students s
                LEFT JOIN tuition t ON s.student_id = t.student_id
                LEFT JOIN payments p ON t.tuition_id = p.tuition_id
                ${semesterId ? 'WHERE t.semester_id = $1' : ''}
            `;

            const params = semesterId ? [semesterId] : [];
            const result = await DatabaseService.query(query, params);
            return result[0];
        } catch (error) {
            throw new Error('Database error in getDashboardStats');
        }
    }

    async getSemesterComparisonData() {
        try {
            const query = `
                SELECT 
                    s.semester_id,
                    s.name as semester_name,
                    SUM(p.amount_paid) as total_collected,
                    (SUM(p.amount_paid) / SUM(t.amount) * 100) as collection_rate
                FROM semesters s
                LEFT JOIN tuition t ON s.semester_id = t.semester_id
                LEFT JOIN payments p ON t.tuition_id = p.tuition_id
                GROUP BY s.semester_id, s.name
                ORDER BY s.semester_id DESC
                LIMIT 4
            `;

            const result = await DatabaseService.query(query);
            return result;
        } catch (error) {
            throw new Error('Database error in getSemesterComparisonData');
        }
    }

    /**
     * Get overdue payments report
     */
    async getOverduePayments(semesterId?: string) {
        let targetSemester = semesterId;
        if (!targetSemester) {
            const currentSemester = await DatabaseService.queryOne(`
                SELECT MaHocKy FROM HOCKYNAMHOC 
                WHERE TrangThaiHocKy = 'active' 
                LIMIT 1
            `);
            targetSemester = currentSemester?.MaHocKy;
        }

        return await DatabaseService.query(`
            SELECT 
                pd.MaPhieuDangKy,
                pd.MaSoSinhVien,
                sv.HoTen as student_name,
                pd.SoTienPhaiDong,
                pd.SoTienDaDong,
                pd.SoTienConLai,
                hk.ThoiHanDongHP as due_date
            FROM PHIEUDANGKY pd
            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
            JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy
            WHERE pd.MaHocKy = $1 
            AND pd.SoTienConLai > 0 
            AND hk.ThoiHanDongHP < CURRENT_DATE
        `, [targetSemester]);
    }

    /**
     * Get revenue analytics
     */
    async getRevenueAnalytics(startDate: Date, endDate: Date) {
        return await DatabaseService.query(`
            SELECT 
                DATE(pt.NgayLap) as payment_date,
                COUNT(pt.MaPhieuThu) as payment_count,
                SUM(pt.SoTienDong) as daily_revenue,
                AVG(pt.SoTienDong) as avg_payment_amount
            FROM PHIEUTHUHP pt
            WHERE pt.NgayLap BETWEEN $1 AND $2
            GROUP BY DATE(pt.NgayLap)
            ORDER BY payment_date
        `, [startDate, endDate]);
    }

    async getOverview() {
        try {
            console.log('[getOverview Service] Querying totalDebtStudents and totalDebt');
            const [debtRow] = await DatabaseService.query(`
                SELECT COUNT(DISTINCT pd.MaSoSinhVien) AS totalDebtStudents,
                       SUM(pd.SoTienConLai) AS totalDebt
                FROM PHIEUDANGKY pd
                WHERE pd.SoTienConLai > 0
            `);
            console.log('[getOverview Service] debtRow:', debtRow);

            console.log('[getOverview Service] Querying todayTransactions and todayRevenue');
            const [todayRow] = await DatabaseService.query(`
                SELECT COUNT(*) AS todayTransactions,
                       SUM(SoTienDong) AS todayRevenue
                FROM PHIEUTHUHP
                WHERE NgayLap = CURRENT_DATE
            `);
            console.log('[getOverview Service] todayRow:', todayRow);

            return {
                totalDebtStudents: Number(debtRow.totaldebtstudents) || 0,
                totalDebt: Number(debtRow.totaldebt) || 0,
                todayTransactions: Number(todayRow.todaytransactions) || 0,
                todayRevenue: Number(todayRow.todayrevenue) || 0,
            };
        } catch (err) {
            console.error('[getOverview Service] Error:', err);
            throw err;
        }
    }

    async getRecentPayments(limit = 5) {
        return await DatabaseService.query(`
            SELECT pd.MaSoSinhVien AS studentId,
                   sv.HoTen AS studentName,
                   pt.SoTienDong AS amount,
                   pt.PhuongThuc AS method,
                   pt.NgayLap AS time
            FROM PHIEUTHUHP pt
            JOIN PHIEUDANGKY pd ON pt.MaPhieuDangKy = pd.MaPhieuDangKy
            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
            ORDER BY pt.NgayLap DESC
            LIMIT $1
        `, [limit]);
    }

    async getFacultyStats() {
        return await DatabaseService.query(`
            SELECT k.TenKhoa AS facultyName,
                   COUNT(DISTINCT sv.MaSoSinhVien) AS totalStudents,
                   COUNT(DISTINCT CASE WHEN pd.SoTienConLai > 0 THEN sv.MaSoSinhVien END) AS debtStudents,
                   ROUND(
                       COUNT(DISTINCT CASE WHEN pd.SoTienConLai > 0 THEN sv.MaSoSinhVien END)::numeric
                       / NULLIF(COUNT(DISTINCT sv.MaSoSinhVien), 0) * 100, 1
                   ) AS debtPercent
            FROM KHOA k
            JOIN NGANHHOC nh ON k.MaKhoa = nh.MaKhoa
            JOIN SINHVIEN sv ON nh.MaNganh = sv.MaNganh
            LEFT JOIN PHIEUDANGKY pd ON sv.MaSoSinhVien = pd.MaSoSinhVien
            GROUP BY k.TenKhoa
            ORDER BY k.TenKhoa
        `);
    }
}

export const financialDashboardService = new FinancialDashboardService();
