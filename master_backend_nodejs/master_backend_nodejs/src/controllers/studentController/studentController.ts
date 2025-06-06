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

interface Subject {
    id: string;
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
}

interface IStudentController {
    // Dashboard & Schedule
    getDashboard(req: Request, res: Response): Promise<void>;
    getTimeTable(req: Request, res: Response): Promise<void>;
    
    // Subject Registration
    getAvailableSubjects(req: Request, res: Response): Promise<void>;
    searchSubjects(req: Request, res: Response): Promise<void>;
    registerSubject(req: Request, res: Response): Promise<void>;
    
    // Academic Request
    createRequest(req: Request, res: Response): Promise<void>;
    getRequestHistory(req: Request, res: Response): Promise<void>;
    
    // Enrolled Subjects Management
    getEnrolledSubjects(req: Request, res: Response): Promise<void>;
    getSubjectDetails(req: Request, res: Response): Promise<void>;
    cancelRegistration(req: Request, res: Response): Promise<void>;
    
    // Student profile routes
    register(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    registerCourses(req: Request, res: Response): Promise<void>;
    getRegisteredCourses(req: Request, res: Response): Promise<void>;

    // Grades
    getGrades(req: Request, res: Response): Promise<void>;

    // Xác nhận đăng ký, tạo phiếu học phí
    confirmRegistration(req: Request, res: Response): Promise<void>;
    
    // Thanh toán học phí
    payTuition(req: Request, res: Response): Promise<void>;
    
    // Sửa đăng ký
    editRegistration(req: Request, res: Response): Promise<void>;
    
    // Lấy danh sách phiếu học phí theo sinh viên
    getTuitionRecordsByStudent(req: Request, res: Response): Promise<void>;
    
    // Lấy danh sách biên lai thanh toán theo phiếu học phí
    getPaymentReceiptsByRecord(req: Request, res: Response): Promise<void>;
}

class StudentController implements IStudentController {
    public async getDashboard(req: Request, res: Response): Promise<void> {
        try {
            // Use authenticated user ID from token instead of URL parameter
            const studentId = (req as any).user.id;
            const dashboard = await dashboardService.getStudentOverview(studentId);
            
            if (!dashboard) {
                res.status(404).json({
                    success: false,
                    message: 'Student dashboard not found'
                });
                return;
            }

            // Add schedule property to match test expectations
            const response = {
                ...dashboard,
                schedule: dashboard.upcomingClasses // Map upcomingClasses to schedule
            };

            res.status(200).json({
                success: true,
                data: response
            });
        } catch (error: unknown) {
            console.error(`Error getting dashboard: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }    public async getTimeTable(req: Request, res: Response): Promise<void> {
        try {
            // Use authenticated user ID from token instead of URL parameter
            const studentId = (req as any).user.id;
            const schedule = await dashboardService.getStudentSchedule(studentId);
            
            if (!schedule) {
                res.status(404).json({
                    success: false,
                    message: 'Student schedule not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: schedule.subjects // Return the subjects array instead of the whole schedule
            });
        } catch (error: unknown) {
            console.error(`Error getting timetable: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async getAvailableSubjects(req: Request, res: Response): Promise<void> {
        try {
            // Optional query parameters with defaults
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
            const subjects = await registrationManager.getAvailableSubjects(semester);
            res.status(200).json({
                success: true,
                data: subjects
            });
        } catch (error: any) {
            console.error('Error getting available subjects:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async searchSubjects(req: Request, res: Response): Promise<void> {
        try {
            const searchQuery = req.query.query as string;
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
            const subjects = await registrationManager.searchSubjects(searchQuery, semester);
            res.status(200).json({
                success: true,
                data: subjects
            });
        } catch (error: any) {
            console.error('Error searching subjects:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }    public async registerSubject(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseId, semester } = req.body;
            const semesterParam = semester || 'HK1 2023-2024'; // Use provided semester or default
            await registrationManager.registerSubject(studentId, courseId, semesterParam);
            res.status(201).json({
                success: true,
                message: 'Subject registered successfully'
            });
        } catch (error: any) {
            if (error.message.includes('already registered')) {
                res.status(409).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('required')) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            } else if (error.message.includes('available')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                console.error('Error registering subject:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
    }

    public async createRequest(req: Request, res: Response): Promise<void> {
        try {
            const request = await academicRequestService.createRequest(req.body);
            res.status(201).json({
                success: true,
                data: request
            });
        } catch (error: unknown) {
            console.error(`Error creating request: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async getRequestHistory(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const history = await academicRequestService.getRequestHistory(studentId);
            res.status(200).json({
                success: true,
                data: history
            });
        } catch (error: unknown) {
            console.error(`Error getting request history: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async getEnrolledSubjects(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
            const enrolledSubjects = await enrollmentManager.getEnrolledSubjects(studentId, semester);
            res.status(200).json({
                success: true,
                data: enrolledSubjects
            });
        } catch (error: any) {
            console.error('Error getting enrolled subjects:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }    public async getSubjectDetails(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseId } = req.params;
            
            // Check if student is enrolled in this subject
            const enrolledSubjects = await enrollmentManager.getEnrolledSubjects(studentId, 'HK1 2023-2024');
            const enrolledSubject = enrolledSubjects.find(subject => subject.enrollment.courseId === courseId);
            
            if (!enrolledSubject) {
                res.status(404).json({
                    success: false,
                    message: 'Subject not found or student not enrolled'
                });
                return;
            }
            
            // Get grades for this subject using the correct method name
            const grades = await gradeService.getStudentGrades(studentId);
            const subjectGrade = grades.find((grade: any) => grade.subjectId === courseId);
              res.status(200).json({
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
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async register(req: Request, res: Response): Promise<void> {
        try {
            const studentData = req.body;
            // Simulate registration logic
            res.status(201).json({
                success: true,
                message: 'Student registered successfully'
            });
        } catch (error: any) {
            console.error('Error registering student:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const updateData = req.body;
            // Simulate update logic
            res.status(200).json({
                success: true,
                message: 'Profile updated successfully'
            });
        } catch (error: any) {
            console.error('Error updating profile:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async registerCourses(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseIds, semester, academicYear } = req.body;
            // Simulate course registration logic
            res.status(201).json({
                success: true,
                message: 'Courses registered successfully'
            });
        } catch (error: any) {
            console.error('Error registering courses:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async getRegisteredCourses(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const semester = req.query.semester as string;
            // Simulate getting registered courses logic
            res.status(200).json({
                success: true,
                data: []
            });
        } catch (error: any) {
            console.error('Error getting registered courses:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async getGrades(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const grades = await gradeService.getStudentGrades(studentId);
            res.status(200).json({
                success: true,
                data: grades
            });
        } catch (error: unknown) {
            console.error(`Error getting grades: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    public async confirmRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, semester, courses } = req.body; // courses: TuitionCourseItem[]
            const record = await tuitionPaymentManager.confirmRegistration(studentId, semester, courses);
            res.status(201).json({ success: true, data: record });
        } catch (error: any) {
            console.error('Error confirming registration:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async payTuition(req: Request, res: Response): Promise<void> {
        try {
            const { tuitionRecordId, amount } = req.body;
            if (typeof amount !== 'number' || amount < 0) {
                res.status(400).json({ success: false, message: 'Invalid amount' });
                return;
            }
            
            // Simulate payment logic
            res.status(200).json({ success: true, message: 'Payment processed successfully' });
        } catch (error: any) {
            console.error('Error processing payment:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async editRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { tuitionRecordId, newCourses } = req.body; // newCourses: TuitionCourseItem[]
            const record = await tuitionPaymentManager.editRegistration(tuitionRecordId, newCourses);
            res.status(200).json({ success: true, data: record });
        } catch (error: any) {
            console.error('Error editing registration:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getTuitionRecordsByStudent(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.query;
            const records = await tuitionPaymentManager.getTuitionRecordsByStudent(studentId as string);
            res.status(200).json({ success: true, data: records });
        } catch (error: any) {
            console.error('Error getting tuition records:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getPaymentReceiptsByRecord(req: Request, res: Response): Promise<void> {
        try {
            const { tuitionRecordId } = req.query;
            const receipts = await tuitionPaymentManager.getPaymentReceiptsByRecord(tuitionRecordId as string);
            res.status(200).json({ success: true, data: receipts });
        } catch (error: any) {
            console.error('Error getting payment receipts:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async cancelRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseId } = req.body;
            await enrollmentManager.cancelRegistration(studentId, courseId);
            res.status(200).json({
                success: true,
                message: 'Registration cancelled successfully'
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                console.error('Error cancelling registration:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
    }
}

export default new StudentController();
