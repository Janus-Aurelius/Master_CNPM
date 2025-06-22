// Registration Manager - Handles student course registration business logic
import { registrationService } from '../../services/studentService/registrationService';
import { IRegistration } from '../../models/student_related/studentEnrollmentInterface';
import { IOfferedCourse } from '../../models/academic_related/openCourse';
import { DatabaseService } from '../../services/database/databaseService';

interface IRegistrationManagerResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}

class RegistrationManager {
    /**
     * Lấy danh sách môn học mở cho đăng ký
     */
    public async getAvailableCourses(semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            if (!semesterId) {
                return {
                    success: false,
                    message: 'Mã học kỳ không được để trống'
                };
            }

            const courses = await registrationService.getAvailableCourses(semesterId);
            
            return {
                success: true,
                message: `Tìm thấy ${courses.length} môn học có thể đăng ký`,
                data: courses
            };
        } catch (error) {
            console.error('Error in getAvailableCourses:', error);
            return {
                success: false,
                message: 'Không thể lấy danh sách môn học',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Lấy danh sách môn học đã đăng ký của sinh viên
     */    public async getRegisteredCourses(studentId: string, semesterId?: string): Promise<IRegistrationManagerResponse> {        try {
            if (!studentId) {
                return {
                    success: false,
                    message: 'Mã sinh viên không được để trống'
                };
            }

            // Resolve userId to studentId if needed (U103 -> SV0001)
            const actualStudentId = await this.resolveStudentId(studentId);

            const courses = await registrationService.getRegisteredCourses(actualStudentId, semesterId || '');
            
            return {
                success: true,
                message: `Sinh viên đã đăng ký ${courses.length} môn học`,
                data: courses
            };
        } catch (error) {
            console.error('Error in getRegisteredCourses:', error);
            return {
                success: false,
                message: 'Không thể lấy danh sách môn học đã đăng ký',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Đăng ký môn học cho sinh viên
     */    public async registerCourses(studentId: string, courseIds: string[], semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            console.log('🔵 [RegistrationManager] registerCourses called with:', {
                studentId,
                courseIds,
                semesterId
            });
            
            // Validate inputs
            if (!studentId || !courseIds || courseIds.length === 0 || !semesterId) {
                console.log('❌ [RegistrationManager] Invalid inputs');
                return {
                    success: false,
                    message: 'Thông tin đăng ký không đầy đủ'
                };
            }

            // Resolve userId to studentId if needed (U103 -> SV0001)
            const actualStudentId = await this.resolveStudentId(studentId);
            console.log('🔵 [RegistrationManager] Resolved studentId:', actualStudentId);

            // Check if semester exists
            console.log('🔵 [RegistrationManager] Checking semester exists...');
            const semester = await DatabaseService.queryOne(`
                SELECT MaHocKy, TrangThaiHocKy, ThoiHanDongHP
                FROM HOCKYNAMHOC
                WHERE MaHocKy = $1
            `, [semesterId]);

            console.log('🔵 [RegistrationManager] Semester query result:', semester);
            if (!semester) {
                console.log('❌ [RegistrationManager] Semester not found');
                return {
                    success: false,
                    message: 'Học kỳ không tồn tại'
                };
            }            // Check student exists
            console.log('🔵 [RegistrationManager] Checking student exists...');
            const student = await DatabaseService.queryOne(`
                SELECT MaSoSinhVien FROM SINHVIEN WHERE MaSoSinhVien = $1
            `, [actualStudentId]);

            console.log('🔵 [RegistrationManager] Student query result:', student);
            if (!student) {
                console.log('❌ [RegistrationManager] Student not found');
                return {
                    success: false,
                    message: 'Sinh viên không tồn tại trong hệ thống'
                };
            }// Perform registration
            console.log('🔵 [RegistrationManager] Calling registrationService.registerCourses...');
            const result = await registrationService.registerCourses({
                studentId: actualStudentId,
                courseIds,
                semesterId
            });

            console.log('🔵 [RegistrationManager] Registration service result:', result);
            return {
                success: result.success,
                message: result.message,
                data: result.details
            };

        } catch (error) {
            console.error('❌ [RegistrationManager] Error in registerCourses:', error);
            return {
                success: false,
                message: 'Lỗi trong quá trình đăng ký môn học',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Hủy đăng ký môn học
     */    public async unregisterCourse(studentId: string, courseId: string, semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            if (!studentId || !courseId || !semesterId) {
                return {
                    success: false,
                    message: 'Thông tin hủy đăng ký không đầy đủ'
                };
            }

            // Resolve userId to studentId if needed (U103 -> SV0001)
            const actualStudentId = await this.resolveStudentId(studentId);

            const success = await registrationService.unregisterCourse(actualStudentId, courseId, semesterId);

            if (success) {
                return {
                    success: true,
                    message: 'Hủy đăng ký môn học thành công'
                };
            } else {
                return {
                    success: false,
                    message: 'Không thể hủy đăng ký môn học'
                };
            }

        } catch (error) {
            console.error('Error in unregisterCourse:', error);
            return {
                success: false,
                message: 'Lỗi trong quá trình hủy đăng ký',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Lấy thông tin tổng quan đăng ký của sinh viên
     */
    public async getRegistrationSummary(studentId: string, semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            if (!studentId || !semesterId) {
                return {
                    success: false,
                    message: 'Mã sinh viên và học kỳ không được để trống'
                };
            }

            const registration = await registrationService.getRegistrationInfo(studentId, semesterId);
            const courses = await registrationService.getRegisteredCourses(studentId, semesterId);

            const summary = {
                registration: registration,
                courses: courses,                statistics: {
                    totalCourses: courses.length,
                    totalCredits: courses.reduce((sum, course) => sum + (course.credits || 0), 0),
                    totalFee: courses.reduce((sum, course) => sum + (course.fee || 0), 0)
                }
            };            return {
                success: true,
                message: 'Lấy thông tin đăng ký thành công',
                data: summary
            };

        } catch (error) {
            console.error('Error in getRegistrationSummary:', error);
            return {
                success: false,
                message: 'Không thể lấy thông tin tổng quan đăng ký',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Lấy môn học theo chương trình học của sinh viên (gợi ý môn học theo ngành)
     */
    public async getRecommendedCourses(studentId: string, semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            if (!studentId || !semesterId) {
                return {
                    success: false,
                    message: 'Thiếu thông tin sinh viên hoặc học kỳ'
                };
            }

            const courses = await registrationService.getRecommendedCourses(studentId, semesterId);
            
            // Phân loại môn học theo thuộc ngành của sinh viên hoặc không
            const inProgramCourses = courses.filter(course => course.isInProgram);
            const notInProgramCourses = courses.filter(course => !course.isInProgram);
            
            return {
                success: true,
                message: `Tìm thấy ${courses.length} môn học (${inProgramCourses.length} môn thuộc ngành, ${notInProgramCourses.length} môn không thuộc ngành)`,
                data: {
                    all: courses,
                    inProgram: inProgramCourses,
                    notInProgram: notInProgramCourses,
                    summary: {
                        total: courses.length,
                        inProgram: inProgramCourses.length,
                        notInProgram: notInProgramCourses.length
                    }
                }
            };
        } catch (error) {
            console.error('Error in getRecommendedCourses:', error);
            return {
                success: false,
                message: 'Không thể lấy danh sách môn học theo chương trình',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Alias methods for compatibility with controller
     */
    public async getAvailableSubjects(semesterId: string): Promise<IRegistrationManagerResponse> {
        return await this.getAvailableCourses(semesterId);
    }

    public async searchSubjects(query: string, semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            const courses = await registrationService.getAvailableCourses(semesterId);            const filteredCourses = courses.filter(course => 
                (course.courseName && course.courseName.toLowerCase().includes(query.toLowerCase())) ||
                (course.courseId && course.courseId.toLowerCase().includes(query.toLowerCase()))
            );

            return {
                success: true,
                message: `Tìm thấy ${filteredCourses.length} môn học phù hợp`,
                data: filteredCourses
            };
        } catch (error) {
            console.error('Error in searchSubjects:', error);
            return {
                success: false,
                message: 'Không thể tìm kiếm môn học',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    public async registerSubject(studentId: string, courseId: string, semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            const actualStudentId = await this.resolveStudentId(studentId);

            // 1. Get current registration status (max credits and registered credits)
            const registrationStatusResult = await this.checkRegistrationStatus(actualStudentId, semesterId);
            
            // Correctly handle the new structure from checkRegistrationStatus
            if (!registrationStatusResult.success || !registrationStatusResult.data.hasRegistration) {
                return { success: false, message: 'Chưa tới thời gian đăng ký học phần.' };
            }
            const registrationStatus = registrationStatusResult.data;

            // 2. Get credit info for the new course (Corrected query and logic)
            const courseResult = await DatabaseService.queryOne(
                `SELECT SoTiet FROM MONHOC WHERE MaMonHoc = $1`, 
                [courseId]
            );
            if (!courseResult || !courseResult.sotiet) {
                return { success: false, message: 'Môn học không tồn tại hoặc không có thông tin tín chỉ.' };
            }
            const newCourseCredits = Math.round(parseInt(courseResult.sotiet, 10) / 15);

            // 3. Check credit limit
            const { maxCredits, registeredCredits } = registrationStatus;
            if ((registeredCredits + newCourseCredits) > maxCredits) {
                return { 
                    success: false, 
                    message: `Không thể đăng ký, sẽ vượt số tín chỉ tối đa cho phép (${registeredCredits + newCourseCredits} > ${maxCredits}).` 
                };
            }
            
            // 4. If valid, proceed with registration
            const result = await registrationService.registerCourses({
                studentId: actualStudentId,
                courseIds: [courseId],
                semesterId
            });

            return result;

        } catch (error) {
            console.error('❌ Error in registerSubject:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            if (errorMessage.includes('SINHVIEN_DA_DANG_KY_MON_HOC')) {
                 return { success: false, message: 'Bạn đã đăng ký môn học này rồi.' };
            }
            if (errorMessage.includes('TRUNG_LICH')) {
                 return { success: false, message: 'Bị trùng lịch học, vui lòng chọn lại.' };
            }

            return {
                success: false,
                message: 'Lỗi trong quá trình đăng ký môn học.',
                error: errorMessage
            };
        }
    }

    public async getEnrolledCourses(studentId: string, semesterId?: string): Promise<IRegistrationManagerResponse> {
        try {
            if (!studentId) {
                return {
                    success: false,
                    message: 'Mã sinh viên không được để trống'
                };
            }

            // Resolve userId to studentId if needed (U103 -> SV0001)
            const actualStudentId = await this.resolveStudentId(studentId);

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semester = semesterId || await DatabaseService.getCurrentSemester();
            const courses = await registrationService.getEnrolledCoursesWithSchedule(actualStudentId, semester);
            
            return {
                success: true,
                message: `Sinh viên đã đăng ký ${courses.length} môn học`,
                data: courses
            };
        } catch (error) {
            console.error('Error in getEnrolledCourses:', error);
            return {
                success: false,
                message: 'Không thể lấy danh sách môn học đã đăng ký',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    public async cancelRegistration(studentId: string, courseId: string, semesterId?: string): Promise<IRegistrationManagerResponse> {
        const { DatabaseService } = await import('../../services/database/databaseService');
        const actualSemesterId = semesterId || await DatabaseService.getCurrentSemester();
        return await this.unregisterCourse(studentId, courseId, actualSemesterId);
    }

    /**
     * Kiểm tra trạng thái đăng ký của sinh viên
     */
    public async checkRegistrationStatus(studentId: string, semesterId?: string): Promise<any> {
        try {
            const actualStudentId = await this.resolveStudentId(studentId);
            const actualSemesterId = semesterId || await DatabaseService.getCurrentSemester();

            // Corrected query based on the database schema from previous interactions
            const query = `
                SELECT 
                    pdk.MaPhieuDangKy, 
                    pdk.SoTinChiToiDa,
                    COALESCE(
                        (SELECT SUM(mh.SoTiet / 15) 
                         FROM CT_PHIEUDANGKY ct
                         JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                         WHERE ct.MaPhieuDangKy = pdk.MaPhieuDangKy), 
                    0) AS SoTCDaDangKy
                FROM PHIEUDANGKY pdk
                WHERE pdk.MaSoSinhVien = $1 AND pdk.MaHocKy = $2;
            `;

            const result = await DatabaseService.queryOne(query, [actualStudentId, actualSemesterId]);

            if (result) {
                return {
                    success: true,
                    message: "Found registration ticket.",
                    data: {
                        hasRegistration: true,
                        maxCredits: result.sotinchitoida,
                        registeredCredits: Math.round(parseFloat(result.sotcdadangky))
                    }
                };
            } else {
                return { 
                    success: true, // Still success, just no ticket
                    data: { hasRegistration: false, maxCredits: 0, registeredCredits: 0 }
                };
            }
        } catch (error) {
            console.error('❌ Error in checkRegistrationStatus:', error);
            // Return failure on actual database error
            return { 
                success: false, 
                message: 'Error checking registration status.',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Helper method to resolve student ID from user ID if needed
     */
    private async resolveStudentId(inputId: string): Promise<string> {
        // If inputId looks like a userId (starts with U), map it to studentId
        if (inputId.startsWith('U')) {
            const { DatabaseService } = await import('../../services/database/databaseService');
            const user = await DatabaseService.queryOne(`
                SELECT masosinhvien 
                FROM nguoidung 
                WHERE userid = $1
            `, [inputId]);
            
            if (!user?.masosinhvien) {
                throw new Error(`No student found for user ID: ${inputId}`);
            }
            console.log(`🔄 [RegistrationManager] Mapped userId ${inputId} to studentId ${user.masosinhvien}`);
            return user.masosinhvien;
        }
        
        // Otherwise assume it's already a studentId
        return inputId;
    }
}

export const registrationManager = new RegistrationManager();
export default registrationManager;