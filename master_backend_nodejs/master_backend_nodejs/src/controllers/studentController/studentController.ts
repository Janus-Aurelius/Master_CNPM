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

class StudentController implements IStudentController {    public async getDashboard(req: Request, res: Response): Promise<void> {
        try {
            // Lấy studentId từ req.user (đã xác thực)
            const studentId = req.user?.studentId;
            if (!studentId) {
                res.status(400).json({ success: false, message: 'Missing studentId in user token' });
                return;
            }
            const dashboard = await dashboardService.getStudentOverview(studentId);
            if (!dashboard) {
                res.status(404).json({ success: false, message: 'Student dashboard not found' });
                return;
            }
            const response = {
                ...dashboard,
                schedule: dashboard.upcomingClasses
            };
            res.status(200).json({ success: true, data: response });
        } catch (error: unknown) {
            console.error(`Error getting dashboard: ${error}`);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }    public async getTimeTable(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            if (!studentId) {
                res.status(400).json({ success: false, message: 'Missing studentId in user token' });
                return;
            }
            const schedule = await dashboardService.getStudentSchedule(studentId);
            if (!schedule) {
                res.status(404).json({ success: false, message: 'Student schedule not found' });
                return;
            }
            res.status(200).json({ success: true, data: schedule.subjects });
        } catch (error: unknown) {
            console.error(`Error getting timetable: ${error}`);
            res.status(500).json({ success: false, message: 'Internal server error' });
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
            const studentId = req.user?.studentId;
            const { courseId, semester } = req.body;
            if (!studentId || !courseId) {
                res.status(400).json({ success: false, message: 'Missing studentId or courseId' });
                return;
            }
            const semesterParam = semester || 'HK1 2023-2024';
            await registrationManager.registerSubject(studentId, courseId, semesterParam);
            res.status(201).json({ success: true, message: 'Subject registered successfully' });
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
            const studentId = req.user?.studentId;
            if (!studentId) {
                res.status(400).json({ success: false, message: 'Missing studentId in user token' });
                return;
            }
            const history = await academicRequestService.getRequestsByStudent(studentId);
            res.status(200).json({ success: true, data: history });
        } catch (error: unknown) {
            console.error(`Error getting request history: ${error}`);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getEnrolledSubjects(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
            if (!studentId) {
                res.status(400).json({ success: false, message: 'Missing studentId in user token' });
                return;
            }
            const enrolledSubjects = await enrollmentManager.getEnrolledSubjects(studentId, semester);
            res.status(200).json({ success: true, data: enrolledSubjects });
        } catch (error: any) {
            console.error('Error getting enrolled subjects:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }    public async getSubjectDetails(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            const { courseId } = req.params;
            if (!studentId || !courseId) {
                res.status(400).json({ success: false, message: 'Missing studentId or courseId' });
                return;
            }
            const enrolledSubjects = await enrollmentManager.getEnrolledSubjects(studentId, 'HK1 2023-2024');
            const enrolledSubject = enrolledSubjects.find(subject => subject.enrollment.courseId === courseId);
            if (!enrolledSubject) {
                res.status(404).json({ success: false, message: 'Subject not found or student not enrolled' });
                return;
            }
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
            res.status(500).json({ success: false, message: 'Internal server error' });
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
            const studentId = req.user?.studentId;
            const updateData = req.body;
            if (!studentId) {
                res.status(400).json({ success: false, message: 'Missing studentId in user token' });
                return;
            }
            // Simulate update logic
            res.status(200).json({ success: true, message: 'Profile updated successfully' });
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
            const studentId = req.user?.studentId;
            const { courseIds, semester, academicYear } = req.body;
            if (!studentId || !Array.isArray(courseIds) || courseIds.length === 0) {
                res.status(400).json({ success: false, message: 'Missing studentId or courseIds' });
                return;
            }
            // Simulate course registration logic
            res.status(201).json({ success: true, message: 'Courses registered successfully' });
        } catch (error: any) {
            console.error('Error registering courses:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getRegisteredCourses(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            const semester = req.query.semester as string;
            if (!studentId) {
                res.status(400).json({ success: false, message: 'Missing studentId in user token' });
                return;
            }
            // Simulate getting registered courses logic
            res.status(200).json({ success: true, data: [] });
        } catch (error: any) {
            console.error('Error getting registered courses:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getGrades(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            if (!studentId) {
                res.status(400).json({ success: false, message: 'Missing studentId in user token' });
                return;
            }
            const grades = await gradeService.getStudentGrades(studentId);
            res.status(200).json({ success: true, data: grades });
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
            const studentId = req.user?.studentId;
            const { semester, courses } = req.body; // courses: TuitionCourseItem[]
            if (!studentId || !semester || !Array.isArray(courses) || courses.length === 0) {
                res.status(400).json({ success: false, message: 'Missing studentId, semester, or courses' });
                return;
            }
            const record = await tuitionPaymentManager.confirmRegistration(studentId, semester, courses);
            res.status(201).json({ success: true, data: record });
        } catch (error: any) {
            console.error('Error confirming registration:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async payTuition(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            const { tuitionRecordId, amount } = req.body;
            if (!studentId || !tuitionRecordId || typeof amount !== 'number' || amount < 0) {
                res.status(400).json({ success: false, message: 'Missing studentId, tuitionRecordId, or invalid amount' });
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
            const studentId = req.user?.studentId;
            const { tuitionRecordId, newCourses } = req.body; // newCourses: TuitionCourseItem[]
            if (!studentId || !tuitionRecordId || !Array.isArray(newCourses) || newCourses.length === 0) {
                res.status(400).json({ success: false, message: 'Missing studentId, tuitionRecordId, or newCourses' });
                return;
            }
            const record = await tuitionPaymentManager.editRegistration(tuitionRecordId, newCourses);
            res.status(200).json({ success: true, data: record });
        } catch (error: any) {
            console.error('Error editing registration:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getTuitionRecordsByStudent(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            if (!studentId) {
                res.status(400).json({ success: false, message: 'Missing studentId in user token' });
                return;
            }
            const records = await tuitionPaymentManager.getTuitionRecordsByStudent(studentId);
            res.status(200).json({ success: true, data: records });
        } catch (error: any) {
            console.error('Error getting tuition records:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async getPaymentReceiptsByRecord(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            const { tuitionRecordId } = req.query;
            if (!studentId || !tuitionRecordId) {
                res.status(400).json({ success: false, message: 'Missing studentId or tuitionRecordId' });
                return;
            }
            const receipts = await tuitionPaymentManager.getPaymentReceiptsByRecord(tuitionRecordId as string);
            res.status(200).json({ success: true, data: receipts });
        } catch (error: any) {
            console.error('Error getting payment receipts:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    public async cancelRegistration(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.user?.studentId;
            const { courseId } = req.body;
            if (!studentId || !courseId) {
                res.status(400).json({ success: false, message: 'Missing studentId or courseId' });
                return;
            }
            await enrollmentManager.cancelRegistration(studentId, courseId);
            res.status(200).json({ success: true, message: 'Registration cancelled successfully' });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({ success: false, message: error.message });
            } else {
                console.error('Error cancelling registration:', error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }
}

export default new StudentController();
