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
            // Debug: Xem thông tin từ request
            console.log('🔍 Debug - req.body:', req.body);
            console.log('🔍 Debug - req.params:', req.params);
            console.log('🔍 Debug - req.user:', req.user);
            console.log('🔍 Debug - req.user.studentId:', req.user?.studentId);
            console.log('🔍 Debug - req.user.id:', req.user?.id);
            console.log('🔍 Debug - req.user.username:', req.user?.username);
            
            // Lấy studentId từ request body/params trước, sau đó mới lấy từ token
            let studentId = req.body?.studentId || req.params?.studentId || req.user?.studentId;
            
            // Nếu không có studentId từ request, thử lấy từ user token
            if (!studentId) {
                studentId = req.user?.id;
                
                // Nếu có username và username bắt đầu bằng 'sv', convert thành format SV0xxx
                if (!studentId && req.user?.username) {
                    const username = req.user.username.toLowerCase();
                    if (username.startsWith('sv')) {
                        // Convert sv0001 -> SV0001
                        studentId = username.toUpperCase();
                        console.log('🔄 Converted username to studentId:', studentId);
                    }
                }
            }
            
            if (!studentId) {
                console.log('❌ No studentId found in request or token:', { body: req.body, params: req.params, user: req.user });                return res.status(400).json({ 
                    success: false, 
                    message: 'Thiếu thông tin studentId trong request hoặc token',
                    debug: { body: req.body, params: req.params, user: req.user }
                });
            }

            console.log('🎓 Getting student info for studentId:', studentId);
            const studentInfo = await studentService.getStudentInfo(studentId);
            
            if (!studentInfo) {
                console.log('❌ Student not found in database for ID:', studentId);
                return res.status(404).json({ success: false, message: 'Student not found' });
            }

            console.log('✅ Raw student info from database:', studentInfo);

            // Format response để phù hợp với frontend
            const response = {
                studentId: studentInfo.studentId,
                name: studentInfo.fullName,
                major: studentInfo.majorId,
                majorName: studentInfo.majorName || studentInfo.majorId,
                email: studentInfo.email,
                phone: studentInfo.phone
            };
            
            console.log('✅ Formatted response:', response);
            return res.status(200).json({ success: true, data: response });        } catch (error: unknown) {
            console.error('❌ Error getting student info:', error);
            const message = error instanceof Error ? error.message : 'Lỗi hệ thống';
            return res.status(500).json({ success: false, message });
        }
    }    public async getTimeTable(req: Request, res: Response): Promise<Response> {
        try {
            const { DatabaseService } = await import('../../services/database/databaseService');
            const studentId = req.user?.studentId || req.query.studentId as string;
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            
            console.log(`🔵 [StudentController] getTimeTable called for student: ${studentId}, semester: ${semester}`);
            
            if (!studentId) {                return res.status(400).json({ 
                    success: false, 
                    message: 'Thiếu thông tin studentId trong token hoặc query' 
                });
            }
              // Lấy thông tin sinh viên
            const student = await studentService.getStudentInfo(studentId);
            if (!student) {                return res.status(404).json({ 
                    success: false, 
                    message: 'Không tìm thấy sinh viên' 
                });
            }
            
            // Lấy thời khóa biểu
            const timetableData = await dashboardService.getStudentTimetable(studentId, semester);
            
            console.log(`✅ [StudentController] Retrieved ${timetableData.length} courses for timetable`);
              return res.status(200).json({ 
                success: true, 
                message: 'Lấy thời khóa biểu thành công',
                data: {
                    student: {
                        studentId: student.studentId,
                        name: student.fullName,
                        major: student.majorId,
                        majorName: student.majorId // TODO: Map to actual major name
                    },
                    semester: semester,
                    courses: timetableData
                }
            });
        } catch (error: unknown) {
            console.error(`❌ [StudentController] Error getting timetable:`, error);            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi hệ thống',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }    public async getAvailableSubjects(req: Request, res: Response): Promise<Response> {
        try {
            const { DatabaseService } = await import('../../services/database/databaseService');
            // Optional query parameters with defaults
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            const studentId = req.query.studentId as string;
            
            console.log('🔍 Getting available subjects for:', { semester, studentId });
            
            // Sử dụng getAvailableCourses thay vì getAvailableSubjects
            const result = await registrationManager.getAvailableCourses(semester);
            
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
            });
        } catch (error: any) {            console.error('❌ Error getting available subjects:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống',
                error: error.message
            });
        }
    }    public async searchSubjects(req: Request, res: Response): Promise<Response> {
        try {
            const { DatabaseService } = await import('../../services/database/databaseService');
            const searchQuery = req.query.query as string;
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            const studentId = req.query.studentId as string;
            
            console.log('🔍 Searching subjects:', { searchQuery, semester, studentId });
            
            // Tạm thời sử dụng getAvailableCourses và filter client-side
            // TODO: Implement proper search in registrationManager
            const result = await registrationManager.getAvailableCourses(semester);
            
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
            
            // Simple client-side filtering
            let filteredData = result.data || [];
            if (searchQuery) {
                filteredData = filteredData.filter((course: any) => 
                    course.courseName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.courseId?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            
            return res.status(200).json({
                success: true,
                data: filteredData
            });        } catch (error: any) {
            console.error('❌ Error searching subjects:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống',
                error: error.message
            });        }    }

    public async registerSubject(req: Request, res: Response): Promise<Response> {
        try {
            console.log('🔵 [StudentController] registerSubject called');
            console.log('🔵 [StudentController] req.body:', req.body);
            console.log('🔵 [StudentController] req.user:', req.user);
              
            // Lấy studentId từ req.body thay vì req.user
            const { studentId, courseId, semester, semesterId } = req.body; // Accept both semester and semesterId
            
            if (!studentId || !courseId) {
                console.log('❌ [StudentController] Missing studentId or courseId');
                console.log('🔍 [StudentController] studentId:', studentId, 'courseId:', courseId);
                return res.status(400).json({ success: false, message: 'Thiếu thông tin studentId hoặc courseId' });
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semesterParam = semesterId || semester || await DatabaseService.getCurrentSemester();
            console.log('🔵 [StudentController] Calling registerSubject with:', {
                studentId,
                courseId,
                semesterParam
            });
            
            const result = await registrationManager.registerSubject(studentId, courseId, semesterParam);
            
            console.log('🔵 [StudentController] Registration result:', result);
            
            if (result.success) {
                console.log('✅ [StudentController] Registration successful');
                return res.status(201).json({ success: true, message: result.message });
            } else {
                console.log('❌ [StudentController] Registration failed:', result.message);
                return res.status(409).json({ success: false, message: result.message });
            }} catch (error: any) {
            console.error('❌ [StudentController] Registration error:', error);
            if (error.message.includes('already registered')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('required')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.includes('available')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.includes('Trùng lịch học') || error.message.includes('conflict') || error.message.includes('lịch học')) {
                // Handle schedule conflict errors
                return res.status(409).json({
                    success: false,
                    message: error.message
                });            } else {
                console.error('Error registering subject:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi hệ thống'
                });
            }
        }
    }

    public async getEnrolledCourses(req: Request, res: Response): Promise<Response> {
        try {
            const { DatabaseService } = await import('../../services/database/databaseService');
            // Thử lấy studentId từ nhiều nguồn khác nhau
            const studentId = req.user?.studentId || req.user?.id || req.params?.studentId || req.query?.studentId;
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            
            console.log('🔍 [StudentController] getEnrolledCourses - req.user:', req.user);
            console.log('🔍 [StudentController] getEnrolledCourses - extracted studentId:', studentId);
              if (!studentId) {
                console.log('❌ [StudentController] No studentId found in request');
                return res.status(400).json({ success: false, message: 'Thiếu thông tin studentId trong token' });
            }
            
            console.log('📚 [StudentController] Getting enrolled courses for student:', studentId, 'semester:', semester);
            const enrolledCourses = await registrationManager.getEnrolledCourses(studentId, semester);
            
            console.log('✅ [StudentController] Enrolled courses result:', enrolledCourses);
            return res.status(200).json(enrolledCourses);
        } catch (error: any) {            console.error('Error getting enrolled courses:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống'
            });
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
            // Ưu tiên lấy studentId từ body trước, sau đó từ token
            const studentId = req.body?.studentId || req.user?.studentId || req.user?.id;
            const { courseId } = req.body;
            
            console.log('🔍 [StudentController] cancelRegistration - req.user:', req.user);
            console.log('🔍 [StudentController] cancelRegistration - req.body:', req.body);
            console.log('🔍 [StudentController] cancelRegistration - extracted studentId:', studentId);
            
            if (!studentId || !courseId) {
                console.log('❌ [StudentController] Missing studentId or courseId');
                return res.status(400).json({ success: false, message: 'Thiếu thông tin studentId hoặc courseId' });
            }
            
            console.log('❌ [StudentController] Cancelling registration for student:', studentId, 'course:', courseId);
            const result = await registrationManager.cancelRegistration(studentId, courseId);
            
            console.log('✅ [StudentController] Cancel registration result:', result);
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, message: error.message });
            } else {
                console.error('Error cancelling registration:', error);
                return res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
            }
        }
    }public async getRecommendedSubjects(req: Request, res: Response): Promise<Response> {
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
            // Debug: Xem thông tin từ request (giống getStudentInfo và getRecommendedSubjects)
            console.log('🔍 Debug getClassifiedSubjects - req.body:', req.body);
            console.log('🔍 Debug getClassifiedSubjects - req.params:', req.params);
            console.log('🔍 Debug getClassifiedSubjects - req.user:', req.user);
            
            // Lấy studentId từ request body/params trước, sau đó mới lấy từ token
            let studentId = req.body?.studentId || req.params?.studentId || req.user?.studentId;
            
            // Nếu không có studentId từ request, thử lấy từ user token
            if (!studentId) {
                studentId = req.user?.id;
                
                // Nếu có username và username bắt đầu bằng 'sv', convert thành format SV0xxx
                if (!studentId && req.user?.username) {
                    const username = req.user.username.toLowerCase();
                    if (username.startsWith('sv')) {
                        // Convert sv0001 -> SV0001
                        studentId = username.toUpperCase();
                        console.log('🔄 Converted username to studentId:', studentId);                    }
                }
            }

            const { DatabaseService } = await import('../../services/database/databaseService');
            const semester = (req.query.semester as string) || await DatabaseService.getCurrentSemester();
            
            console.log('📚 Getting classified subjects for:', { semester, studentId });
            
            if (!studentId) {
                console.log('❌ No studentId found in request or token:', { body: req.body, params: req.params, user: req.user });                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin studentId trong request hoặc token',
                    debug: { body: req.body, params: req.params, user: req.user }
                });
            }
            
            // Sử dụng getRecommendedCourses để lấy môn học đã phân loại
            const result = await registrationManager.getRecommendedCourses(studentId, semester);
            
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                    error: result.error
                });
            }
            
            // Phân loại môn học theo việc thuộc chương trình đào tạo của sinh viên hay không
            const courses = result.data?.all || [];
            const inProgramSubjects = result.data?.inProgram || [];
            const notInProgramSubjects = result.data?.notInProgram || [];
            
            const classifiedSubjects = {
                inProgram: inProgramSubjects,
                notInProgram: notInProgramSubjects,
                summary: {
                    totalInProgram: inProgramSubjects.length,
                    totalNotInProgram: notInProgramSubjects.length,
                    totalSubjects: courses.length
                }
            };
            
            console.log('✅ Classified subjects:', {
                inProgram: classifiedSubjects.inProgram.length,
                notInProgram: classifiedSubjects.notInProgram.length,
                total: classifiedSubjects.summary.totalSubjects
            });
            
            return res.status(200).json({ 
                success: true, 
                data: classifiedSubjects 
            });
        } catch (error: any) {
            console.error('❌ Error getting classified subjects:', error);            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống',
                error: error.message
            });
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
}

export default new StudentController();
