import { Request, Response } from 'express';
import { IStudent, IStudentSchedule } from '../../models/student_related/studentInterface';
import { IStudentOverview } from '../../models/student_related/studentDashboardInterface';
import { IRegistration, IRegistrationDetail } from '../../models/student_related/studentEnrollmentInterface';
import { IPaymentRequest } from '../../models/student_related/studentPaymentInterface';
import { dashboardService } from '../../services/studentService/dashboardService';
import tuitionManager from '../../business/studentBusiness/tuitionManager';
import registrationManager from '../../business/studentBusiness/registrationManager';
import { AppError } from '../../middleware/errorHandler';


interface IStudentController {
    // Dashboard & Schedule
    getDashboard(req: Request, res: Response): Promise<Response>;
    getTimeTable(req: Request, res: Response): Promise<Response>;
    
    // Subject Registration
    getAvailableSubjects(req: Request, res: Response): Promise<Response>;
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
}

class StudentController implements IStudentController {    public async getDashboard(req: Request, res: Response): Promise<Response> {
        try {
            // Lấy studentId từ req.user (đã xác thực)
            const studentId = req.user?.studentId;
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            const dashboard = await dashboardService.getStudentOverview(studentId);            if (!dashboard) {
                return res.status(404).json({ success: false, message: 'Student dashboard not found' });
            }
            
            return res.status(200).json({ success: true, data: dashboard });
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
            return res.status(200).json({ success: true, data: schedule.courses });
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
        }    }

    public async getEnrolledCourses(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
            if (!studentId) {
                return res.status(400).json({ success: false, message: 'Missing studentId in user token' });
            }
            const enrolledCourses = await registrationManager.getEnrolledCourses(studentId, semester);
            return res.status(200).json({ success: true, data: enrolledCourses });
        } catch (error: any) {
            console.error('Error getting enrolled courses:', error);            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
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
    }    public async getRegisteredCourses(req: Request, res: Response): Promise<Response> {
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
        }    }

    // === TUITION PAYMENT METHODS ===

    public async getTuitionStatus(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { semesterId } = req.query;
            
            if (!studentId || !semesterId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Missing studentId or semesterId' 
                });
            }

            const tuitionStatus = await tuitionManager.getStudentTuitionStatus(studentId, semesterId as string);
            
            if (!tuitionStatus) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'No registration found for this semester' 
                });
            }

            return res.status(200).json({ success: true, data: tuitionStatus });
        } catch (error: any) {
            console.error('Error getting tuition status:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    public async makePayment(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const paymentRequest: IPaymentRequest = req.body;

            if (!studentId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Missing studentId in user token' 
                });
            }

            // Validate payment request
            if (!paymentRequest.registrationId || !paymentRequest.amount || paymentRequest.amount <= 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid payment request' 
                });
            }

            const paymentResponse = await tuitionManager.processPayment(paymentRequest);
            
            return res.status(200).json({ 
                success: true, 
                data: paymentResponse,
                message: 'Payment processed successfully'
            });
        } catch (error: any) {
            console.error('Error making payment:', error);
            return res.status(500).json({ 
                success: false, 
                message: error.message || 'Internal server error' 
            });
        }
    }    public async getPaymentHistory(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { semesterId } = req.query;
            
            if (!studentId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Missing studentId in user token' 
                });
            }

            const paymentHistory = await tuitionManager.getPaymentHistory(studentId, semesterId as string);
            
            return res.status(200).json({ 
                success: true, 
                data: paymentHistory 
            });
        } catch (error: any) {
            console.error('Error getting payment history:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Internal server error' 
            });
        }
    }

    public async cancelRegistration(req: Request, res: Response): Promise<Response> {
        try {
            const studentId = req.user?.studentId;
            const { courseId } = req.body;
            if (!studentId || !courseId) {
                return res.status(400).json({ success: false, message: 'Missing studentId or courseId' });
            }
            await registrationManager.cancelRegistration(studentId, courseId);
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
