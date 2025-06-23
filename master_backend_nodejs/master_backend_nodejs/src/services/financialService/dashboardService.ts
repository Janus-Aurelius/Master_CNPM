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
            `;            const params = semesterId ? [semesterId] : [];
            const result = await DatabaseService.query(query, params);
            return result[0];
        } catch (error) {
            throw new Error('Database error in getDashboardStats');
        }
    }

    /**
     * Get enhanced dashboard statistics using your dynamic calculation logic
     */
    async getDashboardStatsEnhanced(semesterId?: string) {
        try {
            // Get current semester if not provided
            let targetSemester = semesterId;
            if (!targetSemester) {
                const currentSemester = await DatabaseService.queryOne(`
                    SELECT MaHocKy FROM HOCKYNAMHOC 
                    WHERE TrangThaiHocKy = 'active' 
                    LIMIT 1
                `);
                targetSemester = currentSemester?.mahocky;
            }

            if (!targetSemester) {
                throw new Error('No active semester found');
            }

            // Get payment statistics using your dynamic calculation
            const stats = await DatabaseService.queryOne(`
                WITH PaymentCalculations AS (
                    SELECT 
                        pd.MaSoSinhVien,
                        -- SoTienPhaiDong calculation
                        COALESCE(
                            (SELECT SUM(
                                (mh.SoTiet::decimal / lm.SoTietMotTC) * lm.SoTienMotTC * (1 - COALESCE(dt.MucGiamHocPhi, 0))
                            )
                            FROM CT_PHIEUDANGKY ct
                            JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                            JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                            JOIN SINHVIEN sv2 ON pd.MaSoSinhVien = sv2.MaSoSinhVien
                            JOIN DOITUONGUUTIEN dt ON sv2.MaDoiTuongUT = dt.MaDoiTuong
                            WHERE ct.MaPhieuDangKy = pd.MaPhieuDangKy), 0
                        ) AS total_amount,
                        -- SoTienDaDong calculation  
                        COALESCE(
                            (SELECT SUM(pt.SoTienDong) 
                             FROM PHIEUTHUHP pt 
                             WHERE pt.MaPhieuDangKy = pd.MaPhieuDangKy), 0
                        ) AS paid_amount
                    FROM PHIEUDANGKY pd
                    WHERE pd.MaHocKy = $1
                )
                SELECT 
                    COUNT(DISTINCT MaSoSinhVien) as total_students,
                    COUNT(DISTINCT CASE WHEN (total_amount - paid_amount) <= 0 THEN MaSoSinhVien END) as paid_students,
                    COUNT(DISTINCT CASE WHEN (total_amount - paid_amount) > 0 THEN MaSoSinhVien END) as unpaid_students,
                    SUM(total_amount - paid_amount) as total_outstanding,
                    SUM(total_amount) as total_tuition,
                    SUM(paid_amount) as total_collected
                FROM PaymentCalculations
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

            // Get payment status by faculty using dynamic calculation
            const facultyStats = await DatabaseService.query(`
                WITH FacultyPayments AS (
                    SELECT 
                        k.MaKhoa,
                        k.TenKhoa as faculty_name,
                        pd.MaSoSinhVien,
                        COALESCE(
                            (SELECT SUM(
                                (mh.SoTiet::decimal / lm.SoTietMotTC) * lm.SoTienMotTC * (1 - COALESCE(dt.MucGiamHocPhi, 0))
                            )
                            FROM CT_PHIEUDANGKY ct
                            JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                            JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                            JOIN SINHVIEN sv2 ON pd.MaSoSinhVien = sv2.MaSoSinhVien
                            JOIN DOITUONGUUTIEN dt ON sv2.MaDoiTuongUT = dt.MaDoiTuong
                            WHERE ct.MaPhieuDangKy = pd.MaPhieuDangKy), 0
                        ) - COALESCE(
                            (SELECT SUM(pt.SoTienDong) 
                             FROM PHIEUTHUHP pt 
                             WHERE pt.MaPhieuDangKy = pd.MaPhieuDangKy), 0
                        ) AS remaining_amount
                    FROM PHIEUDANGKY pd
                    JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
                    JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh
                    JOIN KHOA k ON nh.MaKhoa = k.MaKhoa
                    WHERE pd.MaHocKy = $1
                )
                SELECT 
                    faculty_name,
                    COUNT(DISTINCT MaSoSinhVien) as total_students,
                    SUM(remaining_amount) as total_outstanding
                FROM FacultyPayments
                GROUP BY MaKhoa, faculty_name
                ORDER BY total_outstanding DESC
            `, [targetSemester]);

            return {
                semester: targetSemester,
                overview: stats,
                monthlyTrends,
                facultyStats
            };
        } catch (error) {
            throw new Error('Database error in getDashboardStatsEnhanced');
        }
    }    async getSemesterComparisonData() {
        try {
            // Using real schema for semester comparison with dynamic calculation
            const query = `
                WITH SemesterPayments AS (
                    SELECT 
                        hk.MaHocKy,
                        hk.HocKyThu,
                        hk.NamHoc,
                        pd.MaPhieuDangKy,
                        COALESCE(
                            (SELECT SUM(pt.SoTienDong) 
                             FROM PHIEUTHUHP pt 
                             WHERE pt.MaPhieuDangKy = pd.MaPhieuDangKy), 0
                        ) AS total_collected,
                        COUNT(DISTINCT pd.MaSoSinhVien) AS total_students
                    FROM HOCKYNAMHOC hk
                    LEFT JOIN PHIEUDANGKY pd ON hk.MaHocKy = pd.MaHocKy
                    GROUP BY hk.MaHocKy, hk.HocKyThu, hk.NamHoc, pd.MaPhieuDangKy
                )
                SELECT 
                    MaHocKy as semester_id,
                    CONCAT('HK', HocKyThu, ' ', NamHoc) as semester_name,
                    SUM(total_collected) as total_collected,
                    SUM(total_students) as total_students
                FROM SemesterPayments
                GROUP BY MaHocKy, HocKyThu, NamHoc
                ORDER BY NamHoc DESC, HocKyThu DESC
                LIMIT 4
            `;const result = await DatabaseService.query(query);
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
        }        return await DatabaseService.query(`
            WITH OverdueCalculations AS (
                SELECT 
                    pd.MaPhieuDangKy,
                    pd.MaSoSinhVien,
                    sv.HoTen as student_name,
                    sv.Email,
                    sv.SoDienThoai,
                    k.TenKhoa as faculty,
                    nh.TenNganh as program,
                    -- Dynamic SoTienPhaiDong calculation
                    COALESCE(
                        (SELECT SUM(
                            (mh.SoTiet::decimal / lm.SoTietMotTC) * lm.SoTienMotTC * (1 - COALESCE(dt.MucGiamHocPhi, 0))
                        )
                        FROM CT_PHIEUDANGKY ct
                        JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                        JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                        JOIN SINHVIEN sv2 ON pd.MaSoSinhVien = sv2.MaSoSinhVien
                        JOIN DOITUONGUUTIEN dt ON sv2.MaDoiTuongUT = dt.MaDoiTuong
                        WHERE ct.MaPhieuDangKy = pd.MaPhieuDangKy), 0
                    ) AS SoTienPhaiDong,
                    -- Dynamic SoTienDaDong calculation
                    COALESCE(
                        (SELECT SUM(pt.SoTienDong) 
                         FROM PHIEUTHUHP pt 
                         WHERE pt.MaPhieuDangKy = pd.MaPhieuDangKy), 0
                    ) AS SoTienDaDong,
                    hk.ThoiHanDongHP as due_date
                FROM PHIEUDANGKY pd
                JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
                JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh
                JOIN KHOA k ON nh.MaKhoa = k.MaKhoa
                JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy
                WHERE pd.MaHocKy = $1 AND hk.ThoiHanDongHP < CURRENT_DATE
            )
            SELECT *,
                   (SoTienPhaiDong - SoTienDaDong) AS SoTienConLai
            FROM OverdueCalculations 
            WHERE (SoTienPhaiDong - SoTienDaDong) > 0
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
            // Tính toán động tổng nợ, tổng đã thu, số sinh viên nợ, ...
            const [row] = await DatabaseService.query(`
                WITH PaymentCalculations AS (
                    SELECT 
                        pd.masosinhvien,
                        -- Tổng phải đóng động
                        COALESCE((
                            SELECT SUM((mh.sotiet::decimal / lm.sotietmottc) * lm.sotienmottc * (1 - COALESCE(dt.mucgiamhocphi, 0)))
                            FROM ct_phieudangky ct
                            JOIN monhoc mh ON ct.mamonhoc = mh.mamonhoc
                            JOIN loaimon lm ON mh.maloaimon = lm.maloaimon
                            JOIN sinhvien sv2 ON pd.masosinhvien = sv2.masosinhvien
                            JOIN doituonguutien dt ON sv2.madoituongut = dt.madoituong
                            WHERE ct.maphieudangky = pd.maphieudangky
                        ), 0) AS total_amount,
                        -- Tổng đã đóng động
                        COALESCE((
                            SELECT SUM(pt.sotiendong)
                            FROM phieuthuhp pt
                            WHERE pt.maphieudangky = pd.maphieudangky
                        ), 0) AS paid_amount
                    FROM phieudangky pd
                )
                SELECT
                    COUNT(*) FILTER (WHERE (total_amount - paid_amount) > 0) AS totaldebtstudents,
                    SUM(total_amount - paid_amount) AS totaldebt,
                    SUM(paid_amount) AS totalcollected,
                    COUNT(*) FILTER (WHERE (total_amount - paid_amount) <= 0) AS totalpaidstudents,
                    COUNT(*) AS totalstudents
                FROM PaymentCalculations
            `);

            // Giao dịch và doanh thu hôm nay (tính động)
            const [todayRow] = await DatabaseService.query(`
                SELECT COUNT(*) AS todaytransactions, SUM(sotiendong) AS todayrevenue
                FROM phieuthuhp
                WHERE ngaylap = CURRENT_DATE
            `);

            return {
                totalDebtStudents: Number(row.totaldebtstudents) || 0,
                totalDebt: Number(row.totaldebt) || 0,
                todayTransactions: Number(todayRow.todaytransactions) || 0,
                todayRevenue: Number(todayRow.todayrevenue) || 0,
                totalCollected: Number(row.totalcollected) || 0,
                totalPaidStudents: Number(row.totalpaidstudents) || 0,
                totalStudents: Number(row.totalstudents) || 0,
            };
        } catch (err) {
            console.error('[getOverview Service] Error:', err);
            throw err;
        }
    }

    async getRecentPayments(limit = 5) {
        // Lấy các giao dịch gần đây, mapping động
        const rows = await DatabaseService.query(`
            SELECT pd.masosinhvien AS studentid,
                   sv.hoten AS studentname,
                   pt.sotiendong AS amount,
                   pt.phuongthuc AS method,
                   pt.ngaylap AS time
            FROM phieuthuhp pt
            JOIN phieudangky pd ON pt.maphieudangky = pd.maphieudangky
            JOIN sinhvien sv ON pd.masosinhvien = sv.masosinhvien
            ORDER BY pt.ngaylap DESC
            LIMIT $1
        `, [limit]);
        return rows;
    }

    async getFacultyStats() {
        // Thống kê theo khoa, tính động tổng nợ, tổng đã thu, ...
        const rows = await DatabaseService.query(`
            WITH FacultyPayments AS (
                SELECT 
                    k.makhoa,
                    k.tenkhoa AS facultyname,
                    pd.masosinhvien,
                    COALESCE((
                        SELECT SUM((mh.sotiet::decimal / lm.sotietmottc) * lm.sotienmottc * (1 - COALESCE(dt.mucgiamhocphi, 0)))
                        FROM ct_phieudangky ct
                        JOIN monhoc mh ON ct.mamonhoc = mh.mamonhoc
                        JOIN loaimon lm ON mh.maloaimon = lm.maloaimon
                        JOIN sinhvien sv2 ON pd.masosinhvien = sv2.masosinhvien
                        JOIN doituonguutien dt ON sv2.madoituongut = dt.madoituong
                        WHERE ct.maphieudangky = pd.maphieudangky
                    ), 0) AS total_amount,
                    COALESCE((
                        SELECT SUM(pt.sotiendong)
                        FROM phieuthuhp pt
                        WHERE pt.maphieudangky = pd.maphieudangky
                    ), 0) AS paid_amount
                FROM phieudangky pd
                JOIN sinhvien sv ON pd.masosinhvien = sv.masosinhvien
                JOIN nganhhoc nh ON sv.manganh = nh.manganh
                JOIN khoa k ON nh.makhoa = k.makhoa
            )
            SELECT 
                facultyname,
                COUNT(DISTINCT masosinhvien) AS totalstudents,
                COUNT(DISTINCT masosinhvien) FILTER (WHERE (total_amount - paid_amount) > 0) AS debtstudents,
                ROUND(
                    COUNT(DISTINCT masosinhvien) FILTER (WHERE (total_amount - paid_amount) > 0)::numeric
                    / NULLIF(COUNT(DISTINCT masosinhvien), 0) * 100, 1
                ) AS debtpercent
            FROM FacultyPayments
            GROUP BY facultyname
            ORDER BY facultyname
        `);
        return rows;
    }

    async getSemestersWithRegistration() {
        // Chỉ lấy các học kỳ mà có PHIEUDANGKY, trả về đúng tên trường camelCase
        const rows = await DatabaseService.query(`
            SELECT hk.MaHocKy AS "semesterId", CONCAT('HK', hk.HocKyThu, ' ', hk.NamHoc) AS "semesterName", hk.HocKyThu AS "HocKyThu", hk.NamHoc AS "NamHoc"
            FROM HOCKYNAMHOC hk
            JOIN PHIEUDANGKY pd ON hk.MaHocKy = pd.MaHocKy
            GROUP BY hk.MaHocKy, hk.HocKyThu, hk.NamHoc
            ORDER BY hk.NamHoc DESC, hk.HocKyThu DESC
        `);
        return rows;
    }

    async getFacultyStatsBySemester(semesterId: string) {
        // Luôn lấy tất cả các khoa, số liệu theo từng học kỳ
        const rows = await DatabaseService.query(`
            WITH FacultyPayments AS (
                SELECT 
                    k.makhoa,
                    k.tenkhoa AS facultyname,
                    pd.masosinhvien,
                    COALESCE((
                        SELECT SUM((mh.sotiet::decimal / lm.sotietmottc) * lm.sotienmottc * (1 - COALESCE(dt.mucgiamhocphi, 0)))
                        FROM ct_phieudangky ct
                        JOIN monhoc mh ON ct.mamonhoc = mh.mamonhoc
                        JOIN loaimon lm ON mh.maloaimon = lm.maloaimon
                        JOIN sinhvien sv2 ON pd.masosinhvien = sv2.masosinhvien
                        JOIN doituonguutien dt ON sv2.madoituongut = dt.madoituong
                        WHERE ct.maphieudangky = pd.maphieudangky
                    ), 0) AS total_amount,
                    COALESCE((
                        SELECT SUM(pt.sotiendong)
                        FROM phieuthuhp pt
                        WHERE pt.maphieudangky = pd.maphieudangky
                    ), 0) AS paid_amount
                FROM khoa k
                LEFT JOIN nganhhoc nh ON k.makhoa = nh.makhoa
                LEFT JOIN sinhvien sv ON nh.manganh = sv.manganh
                LEFT JOIN phieudangky pd ON sv.masosinhvien = pd.masosinhvien AND pd.mahocky = $1
            )
            SELECT 
                facultyname,
                COUNT(DISTINCT masosinhvien) AS totalstudents,
                COUNT(DISTINCT masosinhvien) FILTER (WHERE (total_amount - paid_amount) > 0) AS debtstudents,
                ROUND(
                    COUNT(DISTINCT masosinhvien) FILTER (WHERE (total_amount - paid_amount) > 0)::numeric
                    / NULLIF(COUNT(DISTINCT masosinhvien), 0) * 100, 1
                ) AS debtpercent
            FROM FacultyPayments
            GROUP BY facultyname
            ORDER BY facultyname
        `, [semesterId]);
        return rows;
    }
}

export const financialDashboardService = new FinancialDashboardService();
