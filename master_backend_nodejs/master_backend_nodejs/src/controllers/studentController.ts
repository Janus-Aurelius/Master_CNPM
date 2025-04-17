import { Request, Response } from 'express';
import { IStudent, IStudentDashboard } from '../models/student_related/student.interface';
import { IStudentRequest, ICourseRegistrationRequest } from '../models/student_related/student-request.interface';
import { IEnrollment, IEnrolledSubject } from '../models/student_related/student-enrollment.interface';
import { IPayment, ITuitionInfo } from '../models/student_related/student-payment.interface';
import { dashboardManager, registrationManager, enrollmentManager, tuitionFeeManager } from '../business/studentManager';

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
    
    // Tuition Management
    getTuitionInfo(req: Request, res: Response): Promise<void>;
    getPaymentHistory(req: Request, res: Response): Promise<void>;
}

class StudentController implements IStudentController {
    // Dashboard & Schedule
    public async getDashboard(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const dashboardData = await dashboardManager.getStudentDashboard(studentId);
            
            res.status(200).json({
                success: true,
                data: dashboardData
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error fetching dashboard data"
            });
        }
    }

    public async getTimeTable(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const semester = req.query.semester as string;
            
            const schedule = await dashboardManager.getTimeTable(studentId, semester);
            
            res.status(200).json({
                success: true,
                data: schedule
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error fetching timetable"
            });
        }
    }

    // Subject Registration
    public async getAvailableSubjects(req: Request, res: Response): Promise<void> {
        try {
            const semester = req.query.semester as string;
            const subjects = await registrationManager.getAvailableSubjects(semester);
            
            res.status(200).json({
                success: true,
                data: subjects
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error fetching available subjects"
            });
        }
    }

    public async searchSubjects(req: Request, res: Response): Promise<void> {
        try {
            const searchQuery = req.query.query as string;
            const semester = req.query.semester as string;
            const subjects = await registrationManager.searchSubjects(searchQuery, semester);
            
            res.status(200).json({
                success: true,
                data: subjects
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error searching subjects"
            });
        }
    }

    public async registerSubject(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseId } = req.body;
            await registrationManager.registerSubject(studentId, courseId);
            
            res.status(201).json({
                success: true,
                message: "Đăng ký thành công!"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error registering subject"
            });
        }
    }

    // Academic Request
    public async createRequest(req: Request, res: Response): Promise<void> {
        try {
            const requestData: IStudentRequest = req.body;
            // TODO: Create request using service
            
            res.status(201).json({
                success: true,
                message: "Request created successfully"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error creating request"
            });
        }
    }

    public async getRequestHistory(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            // TODO: Get request history from service
            
            res.status(200).json({
                success: true,
                data: []
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching request history"
            });
        }
    }

    // Enrolled Subjects Management
    public async getEnrolledSubjects(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const semester = req.query.semester as string;
            
            const enrolledSubjects = await enrollmentManager.getEnrolledSubjects(studentId, semester);
            
            res.status(200).json({
                success: true,
                data: enrolledSubjects
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error fetching enrolled subjects"
            });
        }
    }

    public async getSubjectDetails(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseId } = req.params;
            // TODO: Get subject details from service
            
            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching subject details"
            });
        }
    }

    // Tuition Management
    public async getTuitionInfo(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const semester = req.query.semester as string;
            const tuitionInfo = await tuitionFeeManager.getTuitionInfo(studentId, semester);
            
            if (!tuitionInfo) {
                res.status(200).json({
                    success: false,
                    message: "Error fetching tuition information: Student not found"
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: tuitionInfo
            });
        } catch (error) {
            res.status(200).json({
                success: false,
                message: "Error fetching tuition information"
            });
        }
    }

    public async getPaymentHistory(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const paymentHistory = await tuitionFeeManager.getPaymentHistory(studentId);
            
            res.status(200).json({
                success: true,
                data: paymentHistory
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error fetching payment history"
            });
        }
    }

    public async cancelRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseId } = req.body;
            await enrollmentManager.cancelRegistration(studentId, courseId);
            
            res.status(200).json({
                success: true,
                message: "Hủy đăng ký thành công!"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error cancelling registration"
            });
        }
    }
}

export default new StudentController();