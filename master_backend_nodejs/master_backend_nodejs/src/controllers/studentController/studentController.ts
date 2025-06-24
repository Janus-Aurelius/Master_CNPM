import { Request, Response } from 'express';
import { IStudent, IStudentSchedule } from '../../models/student_related/studentInterface';
import { IStudentOverview } from '../../models/student_related/studentDashboardInterface';
import { IRegistration, IRegistrationDetail } from '../../models/student_related/studentEnrollmentInterface';
import { IPaymentRequest } from '../../models/student_related/studentPaymentInterface';
import { dashboardService } from '../../services/studentService/dashboardService';
import { studentService } from '../../services/studentService/studentService';
import { tuitionService } from '../../services/studentService/tuitionService';
import tuitionManager from '../../business/studentBusiness/tuitionManager';
import registrationManager from '../../business/studentBusiness/registrationManager';
import { AppError } from '../../middleware/errorHandler';


interface IStudentController {
    // Dashboard & Schedule
    getDashboard(req: Request, res: Response): Promise<Response>;
    getStudentInfo(req: Request, res: Response): Promise<Response>;  // Nouveau endpoint
    getTimeTable(req: Request, res: Response): Promise<Response>;
      // Subject Registration
    getAvailableSubjects(req: Request, res: Response): Promise<Response>;
    getRecommendedSubjects(req: Request, res: Response): Promise<Response>;
    getClassifiedSubjects(req: Request, res: Response): Promise<Response>;  // Phân loại môn học theo chương trình
    searchSubjects(req: Request, res: Response): Promise<Response>;
    registerSubject(req: Request, res: Response): Promise<Response>;
    
    // Enrolled Subjects Management
    getEnrolledCourses(req: Request, res: Response): Promise<Response>;
    cancelRegistration(req: Request, res: Response): Promise<Response>;
    
    // Student profile routes
    register(req: Request, res: Response): Promise<Response>;
    updateProfile(req: Request, res: Response): Promise<Response>;    
    registerCourses(req: Request, res: Response): Promise<Response>;
    getRegisteredCourses(req: Request, res: Response): Promise<Response>;

    // Tuition Payment - NEW METHODS
    getTuitionStatus(req: Request, res: Response): Promise<Response>;
    makePayment(req: Request, res: Response): Promise<Response>;
    getPaymentHistory(req: Request, res: Response): Promise<Response>;

    // Get current semester
    getCurrentSemester(req: Request, res: Response): Promise<Response>;

    // Check registration status
    checkRegistrationStatus(req: Request, res: Response): Promise<Response>;

    // Confirm registration
    confirmRegistration(req: Request, res: Response): Promise<Response>;

    // Check confirmation status
    checkConfirmationStatus(req: Request, res: Response): Promise<Response>;
}

// Helper function to resolve studentId from request
async function getStudentIdFromRequest(req: Request): Promise<string | null> {
    // Priority: params -> body -> user token
    let studentId = req.params?.studentId || req.body?.studentId || req.user?.studentId || req.user?.id;

    // If the ID is a User ID (e.g., U103), map it to a Student ID (e.g., SV0001)
    if (studentId && studentId.toUpperCase().startsWith('U')) {
        console.log(`🔄 Mapping User ID ${studentId} to Student ID...`);
        const mappedId = await studentService.mapUserIdToStudentId(studentId);
        if (mappedId) {
            console.log(`✅ Mapped ${studentId} to ${mappedId}`);
            return mappedId;
        } else {
            console.log(`⚠️ Failed to map User ID ${studentId}. It might not exist.`);
            return null; // Return null if mapping fails
        }
    }

    return studentId || null;
}

class StudentController implements IStudentController {    public async getDashboard(req: Request, res: Response): Promise<Response> {        try {
            // Lấy studentId từ req.user (đã xác thực)
            const studentId = req.user?.studentId;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin studentId trong token' });
            }
            const dashboard = await dashboardService.getStudentOverview(studentId);if (!dashboard) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy dashboard của sinh viên' });
            }
            
            return res.status(200).json({ success: true, data: dashboard });        } catch (error: unknown) {
            console.error(`Error getting dashboard: ${error}`);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
        }
    }    public async getStudentInfo(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể xác định mã số sinh viên từ request hoặc token.'
                });
            }

            console.log('🎓 Getting student info for final studentId:', studentId);
            const studentInfo = await studentService.getStudentInfo(studentId);

            if (!studentInfo) {
                console.log('❌ Student not found in database for ID:', studentId);
                return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' });
            }

            const responseData = {
                studentId: studentInfo.studentId,
                name: studentInfo.fullName,
                major: studentInfo.majorId,
                majorName: studentInfo.majorName || studentInfo.majorId,
                email: studentInfo.email,
                phone: studentInfo.phone
            };

            return res.status(200).json({ success: true, data: responseData });
        } catch (error: unknown) {
            console.error('❌ Error in getStudentInfo:', error);
            const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
            return res.status(500).json({ success: false, message });
        }
    }    public async getTimeTable(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            
            console.log(`🔵 [StudentController] getTimeTable called for student: ${studentId}, semester: ${semester}`);
            
            const student = await studentService.getStudentInfo(studentId);
            if (!student) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy sinh viên' });
            }
            
            const timetableData = await dashboardService.getStudentTimetable(studentId, semester);
            
            return res.status(200).json({ 
                success: true, 
                message: 'Lấy thời khóa biểu thành công',
                data: {
                    student: {
                        studentId: student.studentId,
                        name: student.fullName,
                        major: student.majorId,
                        majorName: student.majorName
                    },
                    semester: semester,
                    courses: timetableData
                }
            });
        } catch (error: unknown) {
            console.error(`❌ [StudentController] Error getting timetable:`, error);
            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi hệ thống',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }    public async getAvailableSubjects(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            
            console.log('🔍 Getting available subjects for:', { semester, studentId });
            
            const result = await registrationManager.getAvailableCourses(semester);
            
            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message, error: result.error });
            }
            
            return res.status(200).json({ success: true, data: result.data });
        } catch (error: any) {
            console.error('❌ Error getting available subjects:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }    public async searchSubjects(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const searchQuery = req.query.query as string;
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            
            console.log('🔍 Searching subjects:', { searchQuery, semester, studentId });
            
            const result = await registrationManager.getAvailableCourses(semester);
            
            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message, error: result.error });
            }
            
            let filteredData = result.data || [];
            if (searchQuery) {
                filteredData = filteredData.filter((course: any) => 
                    course.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.courseId?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            
            return res.status(200).json({ success: true, data: filteredData });
        } catch (error: any) {
            console.error('❌ Error searching subjects:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }

    public async registerSubject(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { courseId, semester, semesterId } = req.body;
            const effectiveSemester = semester || semesterId;

            console.log('🔵 [StudentController] registerSubject called for student:', studentId);

            if (!courseId || !effectiveSemester) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin courseId hoặc semesterId' });
            }
            
            const result = await registrationManager.registerSubject(studentId, courseId, effectiveSemester);
            
            return res.status(result.success ? 201 : 409).json(result);
        } catch (error: any) {
            console.error('❌ Error registering subject:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }

    public async getEnrolledCourses(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { registrationService } = await import('../../services/studentService/registrationService');
            const enrolledCourses = await registrationService.getEnrolledCoursesWithSchedule(studentId);
            
            return res.status(200).json({ success: true, message: `Sinh viên đã đăng ký ${enrolledCourses.length} môn học`, data: enrolledCourses });
        } catch (error: any) {
            console.error('❌ Error getting enrolled courses:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const studentData = req.body;
            // Simulate registration logic
            return res.status(201).json({
                success: true,
                message: 'Đăng ký sinh viên thành công'
            });        } catch (error: any) {
            console.error('Error registering student:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống'
            });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const updateData = req.body;            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin studentId trong token' });
            }
            // Simulate update logic
            return res.status(200).json({ success: true, message: 'Cập nhật hồ sơ thành công' });
        } catch (error: any) {
            console.error('Error updating profile:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống'
            });
        }
    }

    public async registerCourses(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { courseIds, semester, academicYear } = req.body;
            if (!studentId || !Array.isArray(courseIds) || courseIds.length === 0) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin studentId hoặc courseIds' });
            }
            // Simulate course registration logic
            return res.status(201).json({ success: true, message: 'Đăng ký các môn học thành công' });
        } catch (error: any) {            console.error('Error registering courses:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
        }
    }    public async getRegisteredCourses(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const semester = req.query.semester as string;            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Thiếu thông tin studentId trong token' });
            }            // Simulate getting registered courses logic
            return res.status(200).json({ success: true, data: [] });
        } catch (error: any) {
            console.error('Error getting registered courses:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
        }
    }

    // === TUITION PAYMENT METHODS ===

    public async getTuitionStatus(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId || req.user?.id || req.query?.studentId as string;
            
            if (!studentId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Thiếu thông tin studentId' 
                });
            }

            console.log('🎓 Getting tuition status for studentId:', studentId);

            // Get all semesters for the student
            const allTuitionStatus = await tuitionManager.getAllTuitionStatus(studentId);
            
            if (!allTuitionStatus || allTuitionStatus.length === 0) {
                return res.status(200).json({ 
                    success: true, 
                    data: [],
                    message: 'No tuition records found' 
                });
            }            return res.status(200).json({ success: true, data: allTuitionStatus });
        } catch (error: any) {
            console.error('Error getting tuition status:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi hệ thống' 
            });
        }
    }    public async makePayment(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId || req.user?.id || req.body?.studentId;            const { semesterId, amount, paymentMethod } = req.body;

            if (!studentId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Thiếu thông tin studentId trong token' 
                });
            }

            // Validate payment request
            if (!semesterId || !amount || amount <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid payment request - missing semesterId or amount' 
                });
            }            console.log('💳 Processing payment for student:', studentId, 'semester/registrationId:', semesterId, 'amount:', amount);

            // Check if semesterId is actually a registrationId (starts with "PD")
            let registrationId = semesterId;
            
            if (!semesterId.startsWith('PD')) {
                // This is a real semesterId, need to get registrationId from database
                const registration = await tuitionService.getRegistrationBySemester(studentId, semesterId);
                
                if (!registration) {
                    return res.status(404).json({ 
                        success: false, 
                        message: 'Không tìm thấy phiếu đăng ký cho học kỳ này' 
                    });
                }
                
                registrationId = registration.registrationId;
                console.log('📋 Found registration ID:', registrationId, 'for semester:', semesterId);
            } else {
                console.log('📋 Using provided registration ID directly:', registrationId);
            }

            // Create payment request with proper registrationId
            const paymentRequest: IPaymentRequest = {
                registrationId: registrationId,
                amount: amount,
                paymentMethod: 'bank_transfer',
                notes: `Payment from student ${studentId} for registration ${registrationId}`
            };

            const paymentResponse = await tuitionManager.processPayment(paymentRequest);
            
            return res.status(200).json({ 
                success: true, 
                data: paymentResponse,
                message: 'Thanh toán được xử lý thành công'
            });
        } catch (error: any) {
            console.error('Error making payment:', error);
            return res.status(500).json({ 
                success: false, 
                message: error.message || 'Lỗi hệ thống' 
            });
        }
    }    public async getPaymentHistory(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId || req.user?.id || req.query?.studentId as string;
              if (!studentId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Thiếu thông tin studentId trong token' 
                });
            }

            console.log('📋 Getting payment history for student:', studentId);

            const paymentHistory = await tuitionManager.getPaymentHistory(studentId);
            
            return res.status(200).json({ 
                success: true, 
                data: paymentHistory 
            });        } catch (error: any) {
            console.error('Error getting payment history:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi hệ thống' 
            });
        }
    }    public async cancelRegistration(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { courseId } = req.body;
            if (!courseId) {
                return res.status(400).json({ success: false, message: 'Thiếu mã môn học' });
            }

            // Lấy semesterId từ body, nếu không có thì lấy học kỳ hiện tại
            const { semesterId } = req.body;
            const result = await registrationManager.cancelRegistration(studentId, courseId, semesterId);
            
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error: any) {
            console.error('❌ Error canceling registration:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }

    public async getRecommendedSubjects(req: Request, res: Response): Promise<Response> {
        try {
            // Lấy studentId từ request body/params trước, sau đó từ token
            let studentId = req.body?.studentId || req.params?.studentId || req.user?.studentId;
            
            // Nếu không có studentId từ request, thử lấy từ user token và convert
            if (!studentId) {
                studentId = req.user?.id;
                
                // Nếu có username và username bắt đầu bằng 'sv', convert thành format SV0xxx
                if (!studentId && req.user?.username) {
                    const username = req.user.username.toLowerCase();                    if (username.startsWith('sv')) {
                        studentId = username.toUpperCase();
                    }
                }
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            
            console.log('🎯 Getting recommended subjects for:', { semester, studentId, userFromToken: req.user });
            
            if (!studentId) {            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin studentId trong request hoặc token'
            });
            }
            
            const result = await registrationManager.getRecommendedCourses(studentId, semester);
            
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
            
            return res.status(200).json({
                success: true,
                data: result.data
            });        } catch (error: any) {
            console.error('❌ Error getting recommended subjects:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống',
                error: error.message
            });
        }
    }    public async getClassifiedSubjects(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            
            console.log('📚 Getting classified subjects for:', { studentId, semester });
            
            // Re-using getRecommendedCourses as it returns classified subjects
            const result = await registrationManager.getRecommendedCourses(studentId, semester);
            
            if (result.success) {
                // Transform data to match frontend expectations
                const transformedData = {
                    required: result.data.inProgram || [],
                    elective: result.data.notInProgram || []
                };
                
                return res.status(200).json({ success: true, data: transformedData });
            } else {
                return res.status(400).json({ success: false, message: result.message, error: result.error });
            }
        } catch (error: any) {
            console.error('❌ Error getting classified subjects:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }

    /**
     * Get current semester from system settings
     */
    public async getCurrentSemester(req: Request, res: Response): Promise<Response> {
        try {
            const { DatabaseService } = await import('../../services/database/databaseService');
            const currentSemester = await DatabaseService.getCurrentSemester();
            
            return res.status(200).json({
                success: true,
                data: { currentSemester }
            });
        } catch (error: any) {
            console.error('Error getting current semester:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống khi lấy học kỳ hiện tại'
            });
        }
    }

    // Check registration status
    public async checkRegistrationStatus(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semesterId = (req.query.semesterId as string) || await DatabaseService.getCurrentSemester();

            console.log('🎓 Getting registration status for studentId:', studentId);
            
            const result = await registrationManager.checkRegistrationStatus(studentId, semesterId);
            
            if (result.success) {
                // The frontend now expects the full { success: true, data: { ... } } structure
                return res.status(200).json(result);
            } else {
                return res.status(400).json({ success: false, message: result.message });
            }
        } catch (error: any) {
            console.error('❌ Error checking registration status:', error);
            return res.status(500).json({ success: false, message: 'Lỗi hệ thống', error: error.message });
        }
    }

    // Confirm registration
    public async confirmRegistration(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semesterId = (req.query.semesterId as string) || await DatabaseService.getCurrentSemester();

            console.log('✅ Confirming registration for studentId:', studentId, 'semesterId:', semesterId);
            
            const { registrationService } = await import('../../services/studentService/registrationService');
            const result = await registrationService.confirmRegistration(studentId, semesterId);
            
            return res.status(200).json({
                success: result.success,
                message: result.message
            });
        } catch (error: any) {
            console.error('❌ Error confirming registration:', error);
            return res.status(500).json({ 
                success: false, 
                message: error.message || 'Lỗi hệ thống' 
            });
        }
    }

    // Check confirmation status
    public async checkConfirmationStatus(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = await getStudentIdFromRequest(req);
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Không thể xác định mã số sinh viên.' });
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semesterId = (req.query.semesterId as string) || await DatabaseService.getCurrentSemester();

            console.log('🔍 Checking confirmation status for studentId:', studentId, 'semesterId:', semesterId);
            
            const { registrationService } = await import('../../services/studentService/registrationService');
            const result = await registrationService.checkConfirmationStatus(studentId, semesterId);
            
            return res.status(200).json({
                success: true,
                data: {
                    isConfirmed: result.isConfirmed,
                    message: result.message
                }
            });
        } catch (error: any) {
            console.error('❌ Error checking confirmation status:', error);
            return res.status(500).json({ 
                success: false, 
                message: error.message || 'Lỗi hệ thống' 
            });
        }
    }
}

export default new StudentController();
