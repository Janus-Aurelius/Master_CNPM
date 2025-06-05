import { Request, Response } from 'express';
import { IStudent, IStudentSchedule } from '../models/student_related/studentInterface';
import { IStudentOverview, IAcademicRequest } from '../models/student_related/studentDashboardInterface';
import { IEnrollment, IEnrolledSubject } from '../models/student_related/studentEnrollmentInterface';
import { dashboardService } from '../services/studentServices/dashboardService';
import { academicRequestService } from '../services/studentServices/academicRequestService';
import { gradeService } from '../services/studentServices/gradeService';
import { registrationManager, enrollmentManager } from '../business/studentManager';
import { tuitionPaymentManager } from '../business/studentManager/tuitionPaymentManager';

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

    // Đóng học phí (có thể đóng thiếu/dư)
    payTuition(req: Request, res: Response): Promise<void>;

    // Chỉnh sửa đăng ký (thêm/xóa môn)
    editRegistration(req: Request, res: Response): Promise<void>;

    // Lấy danh sách phiếu học phí của sinh viên
    getTuitionRecordsByStudent(req: Request, res: Response): Promise<void>;

    // Lấy lịch sử phiếu thu
    getPaymentReceiptsByRecord(req: Request, res: Response): Promise<void>;
}

class StudentController implements IStudentController {
    // Dashboard & Schedule
    public async getDashboard(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const overview = await dashboardService.getStudentOverview(studentId);
            if (!overview) {
                res.status(404).json({
                    success: false,
                    message: "Student dashboard not found"
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: overview
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    public async getTimeTable(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const schedule = await dashboardService.getStudentSchedule(studentId);
            if (!schedule) {
                res.status(404).json({
                    success: false,
                    message: "Student schedule not found"
                });
                return;
            }
            // Sửa tại đây: kiểm tra schedule.subjects tồn tại
            res.status(200).json({
                success: true,
                data: Array.isArray((schedule as any).subjects) ? (schedule as any).subjects : []
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    public async getAvailableSubjects(req: Request, res: Response): Promise<void> {
        try {
            // Lấy semester mặc định nếu không truyền
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
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
            const semester = (req.query.semester as string) || 'HK1 2023-2024';
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
            if (
                error.message === 'Subject not found' ||
                error.message === 'Subject is full' ||
                error.message === 'Vượt quá số tín chỉ tối đa mỗi đợt đăng ký'
            ) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message || "Error registering subject"
                });
            }
        }
    }

    // Academic Request
    public async createRequest(req: Request, res: Response): Promise<void> {
        try {
            const request = await academicRequestService.createRequest(req.body);
            res.status(201).json({
                success: true,
                data: request
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({
                success: false,
                message: errorMessage
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
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    // Enrolled Subjects Management
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

    // Student profile routes
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const studentData = req.body;
            // TODO: Implement student registration
            res.status(201).json({
                success: true,
                message: "Student registered successfully"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error registering student"
            });
        }
    }

    public async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const updateData = req.body;
            // TODO: Implement profile update
            res.status(200).json({
                success: true,
                message: "Profile updated successfully"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error updating profile"
            });
        }
    }

    public async registerCourses(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseIds, semester, academicYear } = req.body;
            // TODO: Implement course registration
            res.status(201).json({
                success: true,
                message: "Courses registered successfully"
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error registering courses"
            });
        }
    }

    public async getRegisteredCourses(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const semester = req.query.semester as string;
            // TODO: Implement get registered courses
            res.status(200).json({
                success: true,
                data: []
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Error fetching registered courses"
            });
        }
    }

    // Grades
    public async getGrades(req: Request, res: Response): Promise<void> {
        try {
            const studentId = req.params.studentId;
            const grades = await gradeService.getStudentGrades(studentId);
            res.status(200).json({
                success: true,
                data: grades
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({
                success: false,
                message: errorMessage
            });
        }
    }

    // Xác nhận đăng ký, tạo phiếu học phí
    public async confirmRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, semester, courses } = req.body; // courses: TuitionCourseItem[]
            const record = await tuitionPaymentManager.confirmRegistration(studentId, semester, courses);
            res.status(201).json({ success: true, data: record });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Error confirming registration' });
        }
    }

    // Đóng học phí (có thể đóng thiếu/dư)
    public async payTuition(req: Request, res: Response): Promise<void> {
        try {
            const { tuitionRecordId, amount } = req.body;
            if (typeof amount !== 'number' || amount < 0) {
                res.status(400).json({ success: false, message: 'Invalid payment amount' });
                return;
            }
            const result = await tuitionPaymentManager.payTuition(tuitionRecordId, amount);
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            if (error.message === 'Invalid payment amount') {
                res.status(400).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: error.message || 'Error paying tuition' });
            }
        }
    }

    // Chỉnh sửa đăng ký (thêm/xóa môn)
    public async editRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { tuitionRecordId, newCourses } = req.body; // newCourses: TuitionCourseItem[]
            const record = await tuitionPaymentManager.editRegistration(tuitionRecordId, newCourses);
            res.status(200).json({ success: true, data: record });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Error editing registration' });
        }
    }

    // Lấy danh sách phiếu học phí của sinh viên
    public async getTuitionRecordsByStudent(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.query;
            const records = await tuitionPaymentManager.getTuitionRecordsByStudent(studentId as string);
            res.status(200).json({ success: true, data: records });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Error getting tuition records' });
        }
    }

    // Lấy lịch sử phiếu thu
    public async getPaymentReceiptsByRecord(req: Request, res: Response): Promise<void> {
        try {
            const { tuitionRecordId } = req.query;
            const receipts = await tuitionPaymentManager.getPaymentReceiptsByRecord(tuitionRecordId as string);
            res.status(200).json({ success: true, data: receipts });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Error getting payment receipts' });
        }
    }

    // Hủy đăng ký môn học (giữ lại logic này)
    public async cancelRegistration(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, courseId } = req.body;
            await enrollmentManager.cancelRegistration(studentId, courseId);
            res.status(200).json({
                success: true,
                message: "Hủy đăng ký thành công!"
            });
        } catch (error: any) {
            if (error.message === 'Enrollment not found') {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message || "Error cancelling registration"
                });
            }
        }
    }
}

export default new StudentController();