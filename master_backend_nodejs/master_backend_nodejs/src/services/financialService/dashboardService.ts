// src/services/financialService/dashboardService.ts
import { DatabaseService } from '../database/databaseService';

export class FinancialDashboardService {
    /**
     * Get dashboard statistics for a semester
     */
    async getDashboardStats(semesterId?: string) {
        // If no semester provided, get current active semester
        let targetSemester = semesterId;
        if (!targetSemester) {
            const currentSemester = await DatabaseService.queryOne(`
                SELECT MaHocKy FROM HOCKYNAMHOC 
                WHERE TrangThaiHocKy = 'active' 
                ORDER BY ThoiGianBatDau DESC 
                LIMIT 1
            `);
            targetSemester = currentSemester?.MaHocKy;
        }

        if (!targetSemester) {
            throw new Error('No active semester found');
        }

        // Get payment statistics
        const stats = await DatabaseService.queryOne(`
            SELECT 
                COUNT(DISTINCT pd.MaSoSinhVien) as total_students,
                COUNT(DISTINCT CASE WHEN pd.SoTienConLai = 0 THEN pd.MaSoSinhVien END) as paid_students,
                COUNT(DISTINCT CASE WHEN pd.SoTienConLai > 0 AND pd.SoTienDaDong > 0 THEN pd.MaSoSinhVien END) as partial_students,
                COUNT(DISTINCT CASE WHEN pd.SoTienDaDong = 0 THEN pd.MaSoSinhVien END) as unpaid_students,
                SUM(pd.SoTienPhaiDong) as total_tuition,
                SUM(pd.SoTienDaDong) as total_collected,
                SUM(pd.SoTienConLai) as total_outstanding
            FROM PHIEUDANGKY pd
            WHERE pd.MaHocKy = $1
        `, [targetSemester]);

        // Get monthly payment trends (last 12 months)
        const monthlyTrends = await DatabaseService.query(`
            SELECT 
                EXTRACT(YEAR FROM pt.NgayLap) as year,
                EXTRACT(MONTH FROM pt.NgayLap) as month,
                COUNT(pt.MaPhieuThu) as payment_count,
                SUM(pt.SoTienDong) as total_amount
            FROM PHIEUTHUHP pt
            WHERE pt.NgayLap >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY EXTRACT(YEAR FROM pt.NgayLap), EXTRACT(MONTH FROM pt.NgayLap)
            ORDER BY year DESC, month DESC
        `);

        // Get payment status by faculty
        const facultyStats = await DatabaseService.query(`
            SELECT 
                k.TenKhoa as faculty_name,
                COUNT(DISTINCT pd.MaSoSinhVien) as total_students,
                SUM(pd.SoTienPhaiDong) as total_tuition,
                SUM(pd.SoTienDaDong) as total_collected,
                SUM(pd.SoTienConLai) as total_outstanding
            FROM PHIEUDANGKY pd
            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
            JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh
            JOIN KHOA k ON nh.MaKhoa = k.MaKhoa
            WHERE pd.MaHocKy = $1
            GROUP BY k.MaKhoa, k.TenKhoa
            ORDER BY total_tuition DESC
        `, [targetSemester]);

        return {
            semester: targetSemester,
            overview: stats,
            monthlyTrends,
            facultyStats
        };
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
                ORDER BY ThoiGianBatDau DESC 
                LIMIT 1
            `);
            targetSemester = currentSemester?.MaHocKy;
        }

        return await DatabaseService.query(`
            SELECT 
                pd.MaPhieuDangKy,
                pd.MaSoSinhVien,
                sv.HoTen as student_name,
                sv.Email,
                sv.SoDienThoai,
                k.TenKhoa as faculty,
                nh.TenNganh as program,
                pd.SoTienPhaiDong,
                pd.SoTienDaDong,
                pd.SoTienConLai,
                hk.ThoiHanDongHP as due_date,
                CURRENT_DATE - hk.ThoiHanDongHP as days_overdue
            FROM PHIEUDANGKY pd
            JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
            JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh
            JOIN KHOA k ON nh.MaKhoa = k.MaKhoa
            JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy
            WHERE pd.MaHocKy = $1 
            AND pd.SoTienConLai > 0 
            AND hk.ThoiHanDongHP < CURRENT_DATE
            ORDER BY days_overdue DESC, pd.SoTienConLai DESC
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
}

export const financialDashboardService = new FinancialDashboardService();
