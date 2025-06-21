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
     */
    public async getRegisteredCourses(studentId: string, semesterId?: string): Promise<IRegistrationManagerResponse> {        try {
            if (!studentId) {
                return {
                    success: false,
                    message: 'Mã sinh viên không được để trống'
                };
            }

            const courses = await registrationService.getRegisteredCourses(studentId, semesterId || '');
            
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
     */
    public async registerCourses(studentId: string, courseIds: string[], semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            // Validate inputs
            if (!studentId || !courseIds || courseIds.length === 0 || !semesterId) {
                return {
                    success: false,
                    message: 'Thông tin đăng ký không đầy đủ'
                };
            }

            // Check if semester exists
            const semester = await DatabaseService.queryOne(`
                SELECT MaHocKy, TrangThaiHocKy, ThoiHanDongHP
                FROM HOCKYNAMHOC
                WHERE MaHocKy = $1
            `, [semesterId]);

            if (!semester) {
                return {
                    success: false,
                    message: 'Học kỳ không tồn tại'
                };
            }

            // Check student exists
            const student = await DatabaseService.queryOne(`
                SELECT MaSoSinhVien FROM SINHVIEN WHERE MaSoSinhVien = $1
            `, [studentId]);

            if (!student) {
                return {
                    success: false,
                    message: 'Sinh viên không tồn tại trong hệ thống'
                };
            }

            // Perform registration
            const result = await registrationService.registerCourses({
                studentId,
                courseIds,
                semesterId
            });

            return {
                success: result.success,
                message: result.message,
                data: result.details
            };

        } catch (error) {
            console.error('Error in registerCourses:', error);
            return {
                success: false,
                message: 'Lỗi trong quá trình đăng ký môn học',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Hủy đăng ký môn học
     */
    public async unregisterCourse(studentId: string, courseId: string, semesterId: string): Promise<IRegistrationManagerResponse> {
        try {
            if (!studentId || !courseId || !semesterId) {
                return {
                    success: false,
                    message: 'Thông tin hủy đăng ký không đầy đủ'
                };
            }

            const success = await registrationService.unregisterCourse(studentId, courseId, semesterId);

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
        return await this.registerCourses(studentId, [courseId], semesterId);
    }

    public async getEnrolledCourses(studentId: string, semesterId?: string): Promise<IRegistrationManagerResponse> {
        return await this.getRegisteredCourses(studentId, semesterId);
    }

    public async cancelRegistration(studentId: string, courseId: string, semesterId?: string): Promise<IRegistrationManagerResponse> {
        const semester = semesterId || 'HK1_2024'; // Default semester if not provided
        return await this.unregisterCourse(studentId, courseId, semester);
    }
}

export const registrationManager = new RegistrationManager();
export default registrationManager;