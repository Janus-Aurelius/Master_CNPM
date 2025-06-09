import { Request, Response } from 'express';
import { IStudent, IStudentSchedule } from '../../models/student_related/studentInterface';
import { IStudentOverview, IAcademicRequest } from '../../models/student_related/studentDashboardInterface';
import { IEnrollment, IEnrolledSubject } from '../../models/student_related/studentEnrollmentInterface';
import { dashboardService } from '../../services/studentService/dashboardService';
import { academicRequestService } from '../../services/studentService/academicRequestService';
import { gradeService } from '../../services/studentService/gradeService';
import registrationManager from '../../business/studentBusiness/registrationManager';
import enrollmentManager from '../../business/studentBusiness/enrollmentManager';
import { tuitionPaymentManager } from '../../business/studentBusiness/tuitionPaymentManager';
import { studentTuitionPaymentService } from '../../services/studentService/studentTuitionPaymentService';
import { TuitionCourseItem } from '../../models/student_related/studentPaymentInterface';
import { AppError } from '../../middleware/errorHandler';


interface IStudentController {
    // Dashboard & Schedule
    getDashboard(req: Request, res: Response): Promise<Response>;
    getTimeTable(req: Request, res: Response): Promise<Response>;
    
    // Subject Registration
    getAvailableSubjects(req: Request, res: Response): Promise<Response>;
    searchSubjects(req: Request, res: Response): Promise<Response>;
    registerSubject(req: Request, res: Response): Promise<Response>;
    
    // Academic Request
    createRequest(req: Request, res: Response): Promise<Response>;
    getRequestHistory(req: Request, res: Response): Promise<Response>;
    
    // Enrolled Subjects Management
    getEnrolledSubjects(req: Request, res: Response): Promise<Response>;
    getSubjectDetails(req: Request, res: Response): Promise<Response>;
    cancelRegistration(req: Request, res: Response): Promise<Response>;
    
    // Student profile routes
    register(req: Request, res: Response): Promise<Response>;
    updateProfile(req: Request, res: Response): Promise<Response>;
    registerCourses(req: Request, res: Response): Promise<Response>;
    getRegisteredCourses(req: Request, res: Response): Promise<Response>;

    // Grades
    getGrades(req: Request, res: Response): Promise<Response>;

    // Xác nhận đăng ký, tạo phiếu học phí
    confirmRegistration(req: Request, res: Response): Promise<Response>;
    
    // Thanh toán học phí
    payTuition(req: Request, res: Response): Promise<Response>;
    
    // Sửa đăng ký
    editRegistration(req: Request, res: Response): Promise<Response>;
    
    // Lấy danh sách phiếu học phí theo sinh viên
    getTuitionRecordsByStudent(req: Request, res: Response): Promise<Response>;
    
    // Lấy danh sách biên lai thanh toán theo phiếu học phí
    getPaymentReceiptsByRecord(req: Request, res: Response): Promise<Response>;
}

class StudentController implements IStudentController {    public async getDashboard(req: Request, res: Response): Promise<Response> {
        try {
            // Lấy studentId từ req.user (đã xác thực)
            const studentId = req.user?.studentId;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            const dashboard = await dashboardService.getStudentOverview(studentId);
            if (!dashboard) {
                return res.status(404).json({ success: false, message: 'Student dashboard not found' });
            }
            const response = {
                ...dashboard,
                schedule: dashboard.upcomingClasses
            };
            return res.status(200).json({ success: true, data: response });
        } catch (error: unknown) {
            console.error(`Error getting dashboard: ${error}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }    public async getTimeTable(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            const schedule = await dashboardService.getStudentSchedule(studentId);
            if (!schedule) {
                return res.status(404).json({ success: false, message: 'Student schedule not found' });
            }
            return res.status(200).json({ success: true, data: schedule.subjects });
        } catch (error: unknown) {
            console.error(`Error getting timetable: ${error}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getAvailableSubjects(req: Request, res: Response): Promise<Response> {
        try {
            // Optional query parameters with defaults
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
            const subjects = await registrationManager.getAvailableSubjects(semester);
            return res.status(200).json({
                success: true,
                data: subjects
            });
        } catch (error: any) {
            console.error('Error getting available subjects:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async searchSubjects(req: Request, res: Response): Promise<Response> {
        try {
            const searchQuery = req.query.query as string;
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
            const subjects = await registrationManager.searchSubjects(searchQuery, semester);
            return res.status(200).json({
                success: true,
                data: subjects
            });
        } catch (error: any) {
            console.error('Error searching subjects:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }    public async registerSubject(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { courseId, semester } = req.body;
            if (!studentId || !courseId) {
                return res.status(400).json({ success: false, message: 'Missing studentId or courseId' });
            }
            const semesterParam = semester || 'HK1 2023-2024';
            await registrationManager.registerSubject(studentId, courseId, semesterParam);
            return res.status(201).json({ success: true, message: 'Subject registered successfully' });
        } catch (error: any) {
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
            } else {
                console.error('Error registering subject:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
    }

    public async createRequest(req: Request, res: Response): Promise<Response> {
        try {
            const request = await academicRequestService.createRequest(req.body);
            return res.status(201).json({
                success: true,
                data: request
            });
        } catch (error: unknown) {
            console.error(`Error creating request: ${error}`);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async getRequestHistory(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            const history = await academicRequestService.getRequestsByStudent(studentId);
            return res.status(200).json({ success: true, data: history });
        } catch (error: unknown) {
            console.error(`Error getting request history: ${error}`);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getEnrolledSubjects(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            const enrolledSubjects = await enrollmentManager.getEnrolledSubjects(studentId, semester);
            return res.status(200).json({ success: true, data: enrolledSubjects });
        } catch (error: any) {
            console.error('Error getting enrolled subjects:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }    public async getSubjectDetails(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { courseId } = req.params;
            if (!studentId || !courseId) {
                return res.status(400).json({ success: false, message: 'Missing studentId or courseId' });
            }
            const enrolledSubjects = await enrollmentManager.getEnrolledSubjects(studentId, 'HK1 2023-2024');
            const enrolledSubject = enrolledSubjects.find(subject => subject.enrollment.courseId === courseId);
            if (!enrolledSubject) {
                return res.status(404).json({ success: false, message: 'Subject not found or student not enrolled' });
            }
            const grades = await gradeService.getStudentGrades(studentId);
            const subjectGrade = grades.find((grade: any) => grade.subjectId === courseId);
            return res.status(200).json({
                success: true,
                data: {
                    subjectId: courseId,
                    grade: subjectGrade || {
                        subjectId: courseId,
                        midtermGrade: null,
                        finalGrade: null,
                        totalGrade: null,
                        letterGrade: null
                    },
                    subject: enrolledSubject
                }
            });
        } catch (error) {
            console.error('Error getting subject details:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const studentData = req.body;
            // Simulate registration logic
            return res.status(201).json({
                success: true,
                message: 'Student registered successfully'
            });
        } catch (error: any) {
            console.error('Error registering student:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const updateData = req.body;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            // Simulate update logic
            return res.status(200).json({ success: true, message: 'Profile updated successfully' });
        } catch (error: any) {
            console.error('Error updating profile:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async registerCourses(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { courseIds, semester, academicYear } = req.body;
            if (!studentId || !Array.isArray(courseIds) || courseIds.length === 0) {
                return res.status(400).json({ success: false, message: 'Missing studentId or courseIds' });
            }
            // Simulate course registration logic
            return res.status(201).json({ success: true, message: 'Courses registered successfully' });
        } catch (error: any) {
            console.error('Error registering courses:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getRegisteredCourses(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const semester = req.query.semester as string;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            // Simulate getting registered courses logic
            return res.status(200).json({ success: true, data: [] });
        } catch (error: any) {
            console.error('Error getting registered courses:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getGrades(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            const grades = await gradeService.getStudentGrades(studentId);
            return res.status(200).json({ success: true, data: grades });
        } catch (error: unknown) {
            console.error(`Error getting grades: ${error}`);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async confirmRegistration(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const { semester, courses } = req.body; // courses: TuitionCourseItem[]
            const studentId = req.user.id;

            // Validate input
            if (!semester || !courses || !Array.isArray(courses) || courses.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid input data'
                });
            }

            // Create tuition record
            const record = await studentTuitionPaymentService.createTuitionRecord(studentId, semester, courses);

            return res.status(200).json({
                success: true,
                message: 'Registration confirmed and tuition record created',
                data: record
            });
        } catch (error) {
            console.error('Error confirming registration:', error);
            return res.status(500).json({
                success: false,
                message: 'Error confirming registration'
            });
        }
    }

    public async payTuition(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { tuitionRecordId, amount } = req.body;
            if (!studentId || !tuitionRecordId || typeof amount !== 'number' || amount < 0) {
                return res.status(400).json({ success: false, message: 'Missing studentId, tuitionRecordId, or invalid amount' });
            }
            // Simulate payment logic
            return res.status(200).json({ success: true, message: 'Payment processed successfully' });
        } catch (error: any) {
            console.error('Error processing payment:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async editRegistration(req: Request, res: Response): Promise<Response> {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const { tuitionRecordId, newCourses } = req.body; // newCourses: TuitionCourseItem[]
            const studentId = req.user.id;

            // Validate input
            if (!tuitionRecordId || !newCourses || !Array.isArray(newCourses)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid input data'
                });
            }

            // Update tuition record
            const record = await studentTuitionPaymentService.editRegistration(tuitionRecordId, newCourses);

            return res.status(200).json({
                success: true,
                message: 'Registration updated successfully',
                data: record
            });
        } catch (error) {
            console.error('Error editing registration:', error);
            return res.status(500).json({
                success: false,
                message: 'Error editing registration'
            });
        }
    }

    public async getTuitionRecordsByStudent(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            const records = await tuitionPaymentManager.getTuitionRecordsByStudent(studentId);
            return res.status(200).json({ success: true, data: records });
        } catch (error: any) {
            console.error('Error getting tuition records:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getPaymentReceiptsByRecord(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { tuitionRecordId } = req.query;
            if (!studentId || !tuitionRecordId) {
                return res.status(400).json({ success: false, message: 'Missing studentId or tuitionRecordId' });
            }
            const receipts = await tuitionPaymentManager.getPaymentReceiptsByRecord(tuitionRecordId as string);
            return res.status(200).json({ success: true, data: receipts });
        } catch (error: any) {
            console.error('Error getting payment receipts:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async cancelRegistration(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { courseId } = req.body;
            if (!studentId || !courseId) {
                return res.status(400).json({ success: false, message: 'Missing studentId or courseId' });
            }
            await enrollmentManager.cancelRegistration(studentId, courseId);
            return res.status(200).json({ success: true, message: 'Registration cancelled successfully' });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, message: error.message });
            } else {
                console.error('Error cancelling registration:', error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }
}

export default new StudentController();
