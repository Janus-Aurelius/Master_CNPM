import { IRegistration, IRegistrationDetail } from '../../models/student_related/studentEnrollmentInterface';
import { IOfferedCourse } from '../../models/academic_related/openCourse';
import { DatabaseService } from '../database/databaseService';

export const registrationService = {
    // Lấy danh sách môn học sinh viên đã đăng ký trong học kỳ
    async getRegisteredCourses(studentId: string, semesterId: string): Promise<IRegistrationDetail[]> {
        try {
            const registeredCourses = await DatabaseService.query(`
                SELECT 
                    ct.MaPhieuDangKy as "registrationId",
                    ct.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    mh.SoTiet as "credits",
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
    },

    // Lấy danh sách môn học đã đăng ký với thông tin chi tiết từ DANHSACHMONHOCMO
    async getEnrolledCoursesWithSchedule(studentId: string, semesterId: string = 'HK1_2024'): Promise<any[]> {
        try {
            console.log('🔍 [RegistrationService] Getting enrolled courses with schedule for student:', studentId, 'semester:', semesterId);
            
            // Kiểm tra xem có cần convert từ User ID sang Student ID không
            let actualStudentId = studentId;
            if (studentId.startsWith('U')) {
                const userMapping = await DatabaseService.queryOne(`
                    SELECT n.masosinhvien as "mappedStudentId"
                    FROM NGUOIDUNG n
                    WHERE n.userid = $1 OR UPPER(n.tendangnhap) = UPPER($1)
                `, [studentId]);
                
                if (userMapping && userMapping.mappedStudentId) {
                    actualStudentId = userMapping.mappedStudentId;
                    console.log('✅ [RegistrationService] Converted to Student ID:', actualStudentId);
                } else {
                    console.log('❌ [RegistrationService] Could not find mapping for User ID:', studentId);
                    return [];
                }
            }            const enrolledCourses = await DatabaseService.query(`
                SELECT 
                    ct.MaPhieuDangKy as "registrationId",
                    ct.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    mh.SoTiet as "credits",
                    lm.TenLoaiMon as "courseType",
                    lm.SoTienMotTC as "feePerCredit",
                    pd.NgayLap as "registrationDate",
                    pd.MaHocKy as "semesterName",
                    -- Thông tin từ DANHSACHMONHOCMO
                    dsmhm.Thu as "dayOfWeek",
                    dsmhm.TietBatDau as "startPeriod",
                    dsmhm.TietKetThuc as "endPeriod"
                FROM CT_PHIEUDANGKY ct
                JOIN PHIEUDANGKY pd ON ct.MaPhieuDangKy = pd.MaPhieuDangKy
                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                LEFT JOIN DANHSACHMONHOCMO dsmhm ON ct.MaMonHoc = dsmhm.MaMonHoc AND ct.MaHocKy = dsmhm.MaHocKy
                WHERE pd.MaSoSinhVien = $1 AND pd.MaHocKy = $2
                ORDER BY ct.MaMonHoc
            `, [actualStudentId, semesterId]);

            console.log('✅ [RegistrationService] Found enrolled courses:', enrolledCourses.length);
              return enrolledCourses.map(course => ({
                id: course.courseId,
                courseId: course.courseId,
                courseName: course.courseName,
                credits: course.credits,
                courseType: course.courseType,
                feePerCredit: course.feePerCredit,
                registrationId: course.registrationId,
                registrationDate: course.registrationDate,
                semesterName: course.semesterName,
                dayOfWeek: course.dayOfWeek,
                startPeriod: course.startPeriod,
                endPeriod: course.endPeriod,
                lecturer: 'Chưa xác định', // Bỏ cột này vì không có trong DB
                classroom: 'Chưa xác định', // Bỏ cột này vì không có trong DB
                // Tính toán thông tin hiển thị
                day: course.dayOfWeek ? `Thứ ${course.dayOfWeek}` : 'Chưa xác định',
                fromTo: course.startPeriod && course.endPeriod ? 
                    `Tiết ${course.startPeriod}-${course.endPeriod}` : 'Chưa xác định',
                fee: course.feePerCredit ? course.feePerCredit * (course.credits / 15 || 1) : 0
            }));
        } catch (error) {
            console.error('❌ [RegistrationService] Error getting enrolled courses with schedule:', error);
            throw error;
        }
    },

    // Lấy chi tiết môn học đã đăng ký
    async getCourseRegistrationDetails(studentId: string, courseId: string): Promise<IRegistrationDetail | null> {
        try {            const courseDetail = await DatabaseService.queryOne(`
                SELECT 
                    ct.MaPhieuDangKy as "registrationId",
                    ct.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    mh.SoTiet as "credits",
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
        }    },    // Đăng ký môn học cho sinh viên
    async registerCourse(studentId: string, courseId: string, semesterId: string): Promise<boolean> {
        try {
            console.log(`🔵 [RegistrationService] registerCourse called with:`, {
                studentId,
                courseId,
                semesterId
            });
            
            // Kiểm tra môn học có trong danh sách mở không
            console.log(`🔵 [RegistrationService] Checking if course ${courseId} is offered in semester ${semesterId}`);
            const offeredCourse = await DatabaseService.queryOne(`
                SELECT MaHocKy, MaMonHoc 
                FROM DANHSACHMONHOCMO 
                WHERE MaHocKy = $1 AND MaMonHoc = $2
            `, [semesterId, courseId]);

            console.log(`🔵 [RegistrationService] Offered course query result:`, offeredCourse);
            if (!offeredCourse) {
                console.log(`❌ [RegistrationService] Course ${courseId} is not offered in semester ${semesterId}`);
                throw new Error('Môn học này không có trong danh sách mở');
            }

            // Kiểm tra sinh viên đã có phiếu đăng ký chưa
            console.log(`🔵 [RegistrationService] Checking existing registration for student ${studentId}`);
            let registration = await DatabaseService.queryOne(`
                SELECT MaPhieuDangKy 
                FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1 AND MaHocKy = $2
            `, [studentId, semesterId]);

            console.log(`🔵 [RegistrationService] Existing registration:`, registration);
            
            // Nếu chưa có, tạo phiếu đăng ký mới
            if (!registration) {
                console.log(`🔵 [RegistrationService] Creating new registration for student ${studentId}`);
                const newRegistrationId = `PDK_${studentId}_${semesterId}`;
                await DatabaseService.query(`
                    INSERT INTO PHIEUDANGKY (MaPhieuDangKy, NgayLap, MaSoSinhVien, MaHocKy, SoTienDangKy, SoTienPhaiDong, SoTienDaDong, SoTinChiToiDa)
                    VALUES ($1, NOW(), $2, $3, 0, 0, 0, 24)
                `, [newRegistrationId, studentId, semesterId]);
                registration = { MaPhieuDangKy: newRegistrationId };
                console.log(`✅ [RegistrationService] Created new registration with ID: ${newRegistrationId}`);
            }            // Kiểm tra đã đăng ký môn này chưa
            console.log(`🔵 [RegistrationService] Checking if course ${courseId} is already registered`);
            const existingDetail = await DatabaseService.queryOne(`
                SELECT MaPhieuDangKy 
                FROM CT_PHIEUDANGKY 
                WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2
            `, [registration.MaPhieuDangKy, courseId]);

            console.log(`🔵 [RegistrationService] Existing detail:`, existingDetail);
            if (existingDetail) {
                console.log(`❌ [RegistrationService] Course ${courseId} is already registered`);
                throw new Error('Bạn đã đăng ký môn học này rồi!');
            }

            // Kiểm tra trùng lịch học
            console.log(`🔵 [RegistrationService] Checking schedule conflicts for course ${courseId}`);
            const newCourseSchedule = await DatabaseService.queryOne(`
                SELECT Thu, TietBatDau, TietKetThuc, MaMonHoc
                FROM DANHSACHMONHOCMO
                WHERE MaHocKy = $1 AND MaMonHoc = $2
            `, [semesterId, courseId]);

            if (newCourseSchedule) {
                // Lấy tất cả môn học đã đăng ký của sinh viên trong kỳ này
                const registeredCourses = await DatabaseService.query(`
                    SELECT ds.Thu, ds.TietBatDau, ds.TietKetThuc, ds.MaMonHoc, mh.TenMonHoc
                    FROM CT_PHIEUDANGKY ct
                    JOIN DANHSACHMONHOCMO ds ON ct.MaMonHoc = ds.MaMonHoc AND ct.MaHocKy = ds.MaHocKy
                    JOIN MONHOC mh ON ds.MaMonHoc = mh.MaMonHoc
                    WHERE ct.MaPhieuDangKy = $1 AND ct.MaHocKy = $2
                `, [registration.MaPhieuDangKy, semesterId]);

                // Kiểm tra xung đột lịch học
                for (const existingCourse of registeredCourses) {
                    if (existingCourse.Thu === newCourseSchedule.Thu) {
                        // Kiểm tra trùng tiết học
                        const newStart = newCourseSchedule.TietBatDau;
                        const newEnd = newCourseSchedule.TietKetThuc;
                        const existingStart = existingCourse.TietBatDau;
                        const existingEnd = existingCourse.TietKetThuc;

                        // Kiểm tra overlap: (start1 <= end2) && (start2 <= end1)
                        if (newStart <= existingEnd && existingStart <= newEnd) {
                            console.log(`❌ [RegistrationService] Schedule conflict detected with course ${existingCourse.MaMonHoc}`);
                            throw new Error(`Trùng lịch học với môn ${existingCourse.TenMonHoc} (Thứ ${existingCourse.Thu}, tiết ${existingStart}-${existingEnd})`);
                        }
                    }
                }
            }

            // Thêm môn học vào chi tiết phiếu đăng ký
            console.log(`🔵 [RegistrationService] Adding course ${courseId} to registration details`);
            await DatabaseService.query(`
                INSERT INTO CT_PHIEUDANGKY (MaPhieuDangKy, MaHocKy, MaMonHoc)
                VALUES ($1, $2, $3)
            `, [registration.MaPhieuDangKy, semesterId, courseId]);            
            
            console.log(`✅ [RegistrationService] Successfully added course to registration details`);
            
            // Cập nhật số tiền đăng ký
            console.log(`🔵 [RegistrationService] Getting course info for fee calculation`);
            const courseInfo = await DatabaseService.queryOne(`
                SELECT lm.SoTienMotTC, mh.SoTiet, lm.SoTietMotTC
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
            `, [registration.MaPhieuDangKy, courseId]);            // Cập nhật lại số tiền trong phiếu đăng ký
            const courseInfo = await DatabaseService.queryOne(`
                SELECT lm.SoTienMotTC, mh.SoTiet, lm.SoTietMotTC
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
            const availableCourses = await DatabaseService.query(`                SELECT 
                    dsm.MaHocKy as "semesterId",
                    dsm.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    mh.SoTiet as "credits",
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
    },    // Đăng ký nhiều môn học cùng lúc
    async registerCourses(data: { studentId: string; courseIds: string[]; semesterId: string }): Promise<{ success: boolean; message: string; details?: any }> {
        try {
            console.log('🔵 [RegistrationService] registerCourses called with:', data);
            
            const { studentId, courseIds, semesterId } = data;
            const results = [];
            let successCount = 0;
            let failCount = 0;

            for (const courseId of courseIds) {
                try {
                    console.log(`🔵 [RegistrationService] Registering course ${courseId} for student ${studentId}`);
                    await this.registerCourse(studentId, courseId, semesterId);
                    results.push({ courseId, success: true, message: 'Đăng ký thành công' });
                    successCount++;
                    console.log(`✅ [RegistrationService] Successfully registered course ${courseId}`);
                } catch (error) {
                    console.error(`❌ [RegistrationService] Failed to register course ${courseId}:`, error);
                    results.push({ courseId, success: false, message: error instanceof Error ? error.message : 'Lỗi không xác định' });
                    failCount++;
                }
            }

            const result = {
                success: successCount > 0,
                message: `Đăng ký thành công ${successCount}/${courseIds.length} môn học`,
                details: results
            };
            
            console.log('🔵 [RegistrationService] Final result:', result);
            return result;
        } catch (error) {
            console.error('❌ [RegistrationService] Error registering multiple courses:', error);
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
    },    // Lấy môn học theo chương trình học của sinh viên
    async getRecommendedCourses(studentId: string, semesterId: string): Promise<any[]> {
        try {
            console.log('🎯 [RegistrationService] Getting recommended courses for student:', studentId, 'semester:', semesterId);
            
            // Kiểm tra xem có cần convert từ User ID sang Student ID không
            let actualStudentId = studentId;            // Nếu studentId bắt đầu bằng 'U' (User ID), convert sang Student ID
            if (studentId.startsWith('U')) {
                console.log('🔄 [RegistrationService] Converting User ID to Student ID...');
                const userMapping = await DatabaseService.queryOne(`
                    SELECT 
                        n.userid,
                        n.tendangnhap,
                        n.masosinhvien as "mappedStudentId"
                    FROM NGUOIDUNG n
                    WHERE n.userid = $1 OR UPPER(n.tendangnhap) = UPPER($1)
                `, [studentId]);
                
                console.log('🔍 [RegistrationService] User mapping result:', userMapping);
                
                if (userMapping && userMapping.mappedStudentId) {
                    actualStudentId = userMapping.mappedStudentId;
                    console.log('✅ [RegistrationService] Converted to Student ID:', actualStudentId);
                } else {
                    console.log('❌ [RegistrationService] Could not find mapping for User ID:', studentId);
                    return [];
                }
            }
            
            console.log('🔍 [RegistrationService] Using Student ID:', actualStudentId);
            
            // Trước tiên kiểm tra có dữ liệu trong DANHSACHMONHOCMO không
            const totalCourses = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count FROM DANHSACHMONHOCMO WHERE MaHocKy = $1
            `, [semesterId]);
            console.log('📊 [RegistrationService] Total courses in DANHSACHMONHOCMO for semester:', totalCourses);
            
            if (!totalCourses || totalCourses.count === 0) {
                console.log('❌ [RegistrationService] No courses found in DANHSACHMONHOCMO for semester:', semesterId);
                return [];
            }
            
            // Lấy ngành của sinh viên
            const student = await DatabaseService.queryOne(`
                SELECT sv.MaNganh, nh.TenNganh
                FROM SINHVIEN sv
                JOIN NGANHHOC nh ON sv.MaNganh = nh.MaNganh
                WHERE sv.MaSoSinhVien = $1
            `, [actualStudentId]);

            if (!student) {
                console.log('❌ [RegistrationService] Student not found with ID:', actualStudentId);
                return [];
            }            console.log('👨‍🎓 [RegistrationService] Student major:', student);            // Lấy tất cả môn học mở trong học kỳ và phân loại theo chương trình đào tạo
            console.log('🔍 [RegistrationService] Getting all available courses with program classification...');
            console.log('🔍 [RegistrationService] Query parameters:', [semesterId, student.manganh]);
            
            const availableCourses = await DatabaseService.query(`
                SELECT 
                    dsmhm.MaHocKy as "semesterId",
                    dsmhm.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    mh.SoTiet as "credits",
                    lm.SoTienMotTC as "pricePerCredit",
                    lm.TenLoaiMon as "courseType",
                    dsmhm.Thu as "dayOfWeek",
                    dsmhm.TietBatDau as "startPeriod",
                    dsmhm.TietKetThuc as "endPeriod",
                    dsmhm.SiSoToiThieu as "minStudents",
                    dsmhm.SiSoToiDa as "maxStudents",
                    dsmhm.SoSVDaDangKy as "currentEnrollment",
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 FROM CHUONGTRINHHOC cth 
                            WHERE cth.MaMonHoc = dsmhm.MaMonHoc 
                            AND cth.MaNganh = $2
                            AND cth.MaHocKy = $1
                        ) THEN 'inProgram'
                        ELSE 'notInProgram'
                    END as "courseCategory"
                FROM DANHSACHMONHOCMO dsmhm
                JOIN MONHOC mh ON dsmhm.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                WHERE dsmhm.MaHocKy = $1
                ORDER BY 
                    CASE 
                        WHEN EXISTS (
                            SELECT 1 FROM CHUONGTRINHHOC cth 
                            WHERE cth.MaMonHoc = dsmhm.MaMonHoc 
                            AND cth.MaNganh = $2
                            AND cth.MaHocKy = $1
                        ) THEN 0 
                        ELSE 1 
                    END,
                    mh.TenMonHoc
            `, [semesterId, student.manganh]);
            
            console.log('📚 [RegistrationService] Found available courses:', availableCourses.length);
            console.log('🔍 [RegistrationService] Sample courses with raw data:', availableCourses.slice(0, 5));
            
            // Xử lý dữ liệu trả về
            const coursesWithCategory = availableCourses.map((course: any) => ({
                ...course,
                fee: course.pricePerCredit ? 
                    course.pricePerCredit * (course.credits / 15 || 1) : 0,
                isInProgram: course.courseCategory === 'inProgram',
                schedule: `Thứ ${course.dayOfWeek}, tiết ${course.startPeriod}-${course.endPeriod}`
            }));
            
            console.log('✅ [RegistrationService] Processed courses with categories:', coursesWithCategory.length);
            const inProgramCount = coursesWithCategory.filter(c => c.isInProgram).length;
            const notInProgramCount = coursesWithCategory.filter(c => !c.isInProgram).length;
            console.log(`📊 [RegistrationService] InProgram: ${inProgramCount}, NotInProgram: ${notInProgramCount}`);
            
            return coursesWithCategory;

        } catch (error) {
            console.error('❌ [RegistrationService] Error getting recommended courses:', error);
            throw error;
        }
    }
};
