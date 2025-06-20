import { IRegistration, IRegistrationDetail } from '../../models/student_related/studentEnrollmentInterface';
import { IOfferedCourse } from '../../models/academic_related/openCourse';
import { DatabaseService } from '../database/databaseService';

export const registrationService = {    // Lấy danh sách môn học sinh viên đã đăng ký trong học kỳ
    async getRegisteredCourses(studentId: string, semesterId: string): Promise<IRegistrationDetail[]> {
        try {
            const registeredCourses = await DatabaseService.query(`
                SELECT 
                    ct.MaPhieuDangKy as "registrationId",
                    ct.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    lm.SoTiet as "credits",
                    lm.TenLoaiMon as "courseType",
                    lm.SoTienMotTC as "fee",
                    pd.NgayLap as "registrationDate",
                    hk.TenHocKy as "semesterName"
                FROM CT_PHIEUDANGKY ct
                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy
                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy
                WHERE pd.MaSoSinhVien = $1 AND pd.MaHocKy = $2
                ORDER BY ct.MaMonHoc
            `, [studentId, semesterId]);

            return registeredCourses.map(course => ({
                registrationId: course.registrationId,
                courseId: course.courseId,
                courseName: course.courseName,
                credits: course.credits,
                courseType: course.courseType,
                fee: course.fee
            }));
        } catch (error) {
            console.error('Error getting registered courses:', error);
            throw error;
        }
    },    // Lấy chi tiết môn học đã đăng ký
    async getCourseRegistrationDetails(studentId: string, courseId: string): Promise<IRegistrationDetail | null> {
        try {
            const courseDetail = await DatabaseService.queryOne(`
                SELECT 
                    ct.MaPhieuDangKy as "registrationId",
                    ct.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    lm.SoTiet as "credits",
                    lm.TenLoaiMon as "courseType",
                    lm.SoTienMotTC as "fee",
                    pd.NgayLap as "registrationDate",
                    hk.TenHocKy as "semesterName"
                FROM CT_PHIEUDANGKY ct
                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy
                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                JOIN HOCKYNAMHOC hk ON pd.MaHocKy = hk.MaHocKy
                WHERE pd.MaSoSinhVien = $1 AND ct.MaMonHoc = $2
            `, [studentId, courseId]);

            if (!courseDetail) return null;

            return {
                registrationId: courseDetail.registrationId,
                courseId: courseDetail.courseId,
                courseName: courseDetail.courseName,
                credits: courseDetail.credits,
                courseType: courseDetail.courseType,
                fee: courseDetail.fee
            };
        } catch (error) {
            console.error('Error getting course registration details:', error);
            throw error;
        }
    },    // Đăng ký môn học cho sinh viên
    async registerCourse(studentId: string, courseId: string, semesterId: string): Promise<boolean> {
        try {
            // Kiểm tra môn học có trong danh sách mở không
            const offeredCourse = await DatabaseService.queryOne(`
                SELECT MaHocKy, MaMonHoc 
                FROM DANHSACHMONHOCMO 
                WHERE MaHocKy = $1 AND MaMonHoc = $2
            `, [semesterId, courseId]);

            if (!offeredCourse) {
                throw new Error('Môn học này không có trong danh sách mở');
            }

            // Kiểm tra sinh viên đã có phiếu đăng ký chưa
            let registration = await DatabaseService.queryOne(`
                SELECT MaPhieuDangKy 
                FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1 AND MaHocKy = $2
            `, [studentId, semesterId]);

            // Nếu chưa có, tạo phiếu đăng ký mới
            if (!registration) {
                const newRegistrationId = `PDK_${studentId}_${semesterId}`;
                await DatabaseService.query(`
                    INSERT INTO PHIEUDANGKY (MaPhieuDangKy, NgayLap, MaSoSinhVien, MaHocKy, SoTienDangKy, SoTienPhaiDong, SoTienDaDong, SoTinChiToiDa)
                    VALUES ($1, NOW(), $2, $3, 0, 0, 0, 24)
                `, [newRegistrationId, studentId, semesterId]);
                registration = { MaPhieuDangKy: newRegistrationId };
            }

            // Kiểm tra đã đăng ký môn này chưa
            const existingDetail = await DatabaseService.queryOne(`
                SELECT MaPhieuDangKy 
                FROM CT_PHIEUDANGKY 
                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2
            `, [registration.MaPhieuDangKy, courseId]);

            if (existingDetail) {
                throw new Error('Sinh viên đã đăng ký môn học này rồi');
            }

            // Thêm môn học vào chi tiết phiếu đăng ký
            await DatabaseService.query(`
                INSERT INTO CT_PHIEUDANGKY (MaPhieuDangKy, MaHocKy, MaMonHoc)
                VALUES ($1, $2, $3)
            `, [registration.MaPhieuDangKy, semesterId, courseId]);

            // Cập nhật số tiền đăng ký
            const courseInfo = await DatabaseService.queryOne(`
                SELECT lm.SoTienMotTC, lm.SoTiet
                FROM MONHOC mh
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                WHERE mh.MaMonHoc = $1
            `, [courseId]);

            if (courseInfo) {
                const courseFee = courseInfo.SoTienMotTC * (courseInfo.SoTiet / courseInfo.SoTietMotTC || 1);
                await DatabaseService.query(`
                    UPDATE PHIEUDANGKY 
                    SET SoTienDangKy = SoTienDangKy + $1,
                        SoTienPhaiDong = SoTienPhaiDong + $1
                    WHERE MaPhieuDangKy = $2
                `, [courseFee, registration.MaPhieuDangKy]);
            }

            // Log đăng ký
            const student = await DatabaseService.queryOne(
                `SELECT HoTen FROM SINHVIEN WHERE MaSoSinhVien = $1`, [studentId]
            );
            const course = await DatabaseService.queryOne(
                `SELECT TenMonHoc FROM MONHOC WHERE MaMonHoc = $1`, [courseId]
            );

            await DatabaseService.query(
                `INSERT INTO REGISTRATION_LOG (MaSoSinhVien, TenSinhVien, MaMonHoc, TenMonHoc, LoaiYeuCau)
                 VALUES ($1, $2, $3, $4, 'register')`,
                [studentId, student?.HoTen || '', courseId, course?.TenMonHoc || '']
            );

            return true;
        } catch (error) {
            console.error('Error registering course:', error);
            throw error;
        }
    },

    // Hủy đăng ký môn học
    async cancelCourseRegistration(studentId: string, courseId: string, semesterId: string): Promise<boolean> {        try {
            // Tìm phiếu đăng ký của sinh viên trong học kỳ
            const registration = await DatabaseService.queryOne(`
                SELECT MaPhieuDangKy 
                FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1 AND MaHocKy = $2
            `, [studentId, semesterId]);

            if (!registration) {
                throw new Error('Không tìm thấy phiếu đăng ký');
            }

            // Kiểm tra môn học có trong chi tiết phiếu đăng ký không
            const registrationDetail = await DatabaseService.queryOne(`
                SELECT MaPhieuDangKy
                FROM CT_PHIEUDANGKY
                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2
            `, [registration.MaPhieuDangKy, courseId]);

            if (!registrationDetail) {
                throw new Error('Sinh viên chưa đăng ký môn học này');
            }

            // Xóa môn học khỏi chi tiết phiếu đăng ký
            await DatabaseService.query(`
                DELETE FROM CT_PHIEUDANGKY
                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2
            `, [registration.MaPhieuDangKy, courseId]);

            // Cập nhật lại số tiền trong phiếu đăng ký
            const courseInfo = await DatabaseService.queryOne(`
                SELECT lm.SoTienMotTC, lm.SoTiet
                FROM MONHOC mh
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                WHERE mh.MaMonHoc = $1
            `, [courseId]);

            if (courseInfo) {
                const courseFee = courseInfo.SoTienMotTC * (courseInfo.SoTiet / courseInfo.SoTietMotTC || 1);
                await DatabaseService.query(`
                    UPDATE PHIEUDANGKY 
                    SET SoTienDangKy = SoTienDangKy - $1,
                        SoTienPhaiDong = SoTienPhaiDong - $1
                    WHERE MaPhieuDangKy = $2
                `, [courseFee, registration.MaPhieuDangKy]);
            }

            // Log hủy đăng ký
            const student = await DatabaseService.queryOne(
                `SELECT HoTen FROM SINHVIEN WHERE MaSoSinhVien = $1`, [studentId]
            );
            const course = await DatabaseService.queryOne(
                `SELECT TenMonHoc FROM MONHOC WHERE MaMonHoc = $1`, [courseId]
            );

            await DatabaseService.query(
                `INSERT INTO REGISTRATION_LOG (MaSoSinhVien, TenSinhVien, MaMonHoc, TenMonHoc, LoaiYeuCau)
                 VALUES ($1, $2, $3, $4, 'cancel')`,
                [studentId, student?.HoTen || '', courseId, course?.TenMonHoc || '']
            );

            return true;        } catch (error) {
            console.error('Error canceling course registration:', error);
            throw error;
        }
    },

    // Lấy lịch sử đăng ký của sinh viên
    async getRegistrationHistory(studentId: string): Promise<IRegistration[]> {
        try {
            const registrations = await DatabaseService.query(`
                SELECT 
                    pd.MaPhieuDangKy as "registrationId",
                    pd.NgayLap as "registrationDate",
                    pd.MaSoSinhVien as "studentId",
                    pd.MaHocKy as "semesterId",
                    pd.SoTienDangKy as "registrationAmount",
                    pd.SoTienPhaiDong as "requiredAmount",
                    pd.SoTienDaDong as "paidAmount",
                    (pd.SoTienPhaiDong - pd.SoTienDaDong) as "remainingAmount",
                    pd.SoTinChiToiDa as "maxCredits"
                FROM PHIEUDANGKY pd
                WHERE pd.MaSoSinhVien = $1
                ORDER BY pd.NgayLap DESC
            `, [studentId]);

            return registrations;
        } catch (error) {
            console.error('Error getting registration history:', error);
            throw error;
        }
    },

    // Kiểm tra sinh viên đã đăng ký môn học chưa
    async checkCourseRegistrationStatus(studentId: string, courseId: string, semesterId: string): Promise<boolean> {
        try {
            const registration = await DatabaseService.queryOne(`
                SELECT ct.MaPhieuDangKy
                FROM CT_PHIEUDANGKY ct
                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy
                WHERE pd.MaSoSinhVien = $1 AND ct.MaMonHoc = $2 AND pd.MaHocKy = $3
            `, [studentId, courseId, semesterId]);

            return !!registration;
        } catch (error) {
            console.error('Error checking course registration status:', error);
            throw error;
        }
    },    // Lấy danh sách môn học có thể đăng ký (DANHSACHMONHOCMO)
    async getAvailableCourses(semesterId: string): Promise<IOfferedCourse[]> {
        try {
            const availableCourses = await DatabaseService.query(`
                SELECT 
                    dsm.MaHocKy as "semesterId",
                    dsm.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    lm.SoTiet as "credits",
                    lm.TenLoaiMon as "courseType",
                    lm.SoTienMotTC as "feePerCredit"
                FROM DANHSACHMONHOCMO dsm
                JOIN MONHOC mh ON dsm.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                WHERE dsm.MaHocKy = $1
                ORDER BY mh.TenMonHoc
            `, [semesterId]);

            return availableCourses;
        } catch (error) {
            console.error('Error getting available courses:', error);
            throw error;
        }
    },

    // Đăng ký nhiều môn học cùng lúc
    async registerCourses(data: { studentId: string; courseIds: string[]; semesterId: string }): Promise<{ success: boolean; message: string; details?: any }> {
        try {
            const { studentId, courseIds, semesterId } = data;
            const results = [];
            let successCount = 0;
            let failCount = 0;

            for (const courseId of courseIds) {
                try {
                    await this.registerCourse(studentId, courseId, semesterId);
                    results.push({ courseId, success: true, message: 'Đăng ký thành công' });
                    successCount++;
                } catch (error) {
                    results.push({ courseId, success: false, message: error instanceof Error ? error.message : 'Lỗi không xác định' });
                    failCount++;
                }
            }

            return {
                success: successCount > 0,
                message: `Đăng ký thành công ${successCount}/${courseIds.length} môn học`,
                details: results
            };
        } catch (error) {
            console.error('Error registering multiple courses:', error);
            throw error;
        }
    },

    // Hủy đăng ký môn học (alias cho cancelCourseRegistration)
    async unregisterCourse(studentId: string, courseId: string, semesterId: string): Promise<boolean> {
        return await this.cancelCourseRegistration(studentId, courseId, semesterId);
    },

    // Lấy thông tin phiếu đăng ký
    async getRegistrationInfo(studentId: string, semesterId: string): Promise<IRegistration | null> {
        try {
            const registration = await DatabaseService.queryOne(`
                SELECT 
                    pd.MaPhieuDangKy as "registrationId",
                    pd.NgayLap as "registrationDate",
                    pd.MaSoSinhVien as "studentId",
                    pd.MaHocKy as "semesterId",
                    pd.SoTienDangKy as "registrationAmount",
                    pd.SoTienPhaiDong as "requiredAmount",
                    pd.SoTienDaDong as "paidAmount",
                    (pd.SoTienPhaiDong - pd.SoTienDaDong) as "remainingAmount",
                    pd.SoTinChiToiDa as "maxCredits"
                FROM PHIEUDANGKY pd
                WHERE pd.MaSoSinhVien = $1 AND pd.MaHocKy = $2
            `, [studentId, semesterId]);

            return registration;
        } catch (error) {
            console.error('Error getting registration info:', error);
            throw error;
        }
    }
};
