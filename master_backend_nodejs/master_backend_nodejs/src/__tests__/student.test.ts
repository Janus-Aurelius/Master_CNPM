import request from 'supertest';
import express from 'express';
import studentRoutes from '../routes/student/student.routes';
import { describe, it, expect, beforeAll } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { dashboardService } from '../services/studentService/dashboardService';
import { subjectRegistrationService, subjects } from '../services/studentService/subjectRegistrationService';
import { enrollmentService, enrollments, enrolledSubjects } from '../services/studentService/enrollmentService';
import { gradeService, grades } from '../services/studentService/gradeService';
import { studentTuitionPaymentService, tuitionRecords, paymentReceipts } from '../services/studentService/studentTuitionPaymentService';
import { IEnrolledSubject, IEnrollment } from '../models/student_related/studentEnrollmentInterface';
import { IGrade } from '../models/student_related/studentDashboardInterface';
import { IStudentOverview } from '../models/student_related/studentDashboardInterface';
import { ITuitionRecord } from '../models/student_related/studentPaymentInterface';

// Mock authentication middleware
jest.mock('../middleware/auth', () => ({
    authenticateToken: (req: any, res: any, next: any) => {
        // Mock user data from token
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Yêu cầu đăng nhập' 
            });
        }
        
        try {
            const decoded = jwt.verify(token, '1234567890');
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ 
                success: false,
                message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' 
            });
        }
    },
    authorizeRoles: (roles: string[]) => {
        return (req: any, res: any, next: any) => {
            if (!req.user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Yêu cầu đăng nhập' 
                });
            }
            
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Bạn không có quyền truy cập chức năng này' 
                });
            }
            
            next();
        };
    }
}));

const app = express();
app.use(express.json());
app.use('/api/students', studentRoutes);

// Mock token for testing
const secretKey = '1234567890';
const mockToken = jwt.sign(
    { id: 'SV001', role: 'student' },
    secretKey,
    { expiresIn: '1h' }
);

// Mock data
const mockStudent = {
    studentId: 'SV001',
    name: 'Test Student',
    email: 'test@example.com',
    class: 'IT1',
    major: 'Information Technology'
};

const mockSchedule = {
    student: mockStudent,
    subjects: [
        {
            id: 'IT001',
            name: 'Introduction to Programming',
            lecturer: 'Dr. Smith',
            day: 'Monday',
            session: '1-3',
            room: 'A101'
        }
    ]
};

const mockSubject = {
    subjectId: 'IT001',
    subjectName: 'Introduction to Programming',
    subjectTypeId: 'LT',
    totalHours: 45,
    description: 'Basic programming concepts',
    prerequisiteSubjects: [],
    type: 'Required' as 'Required' | 'Elective',
    department: 'Information Technology',
    lecturer: 'Dr. Smith',
    schedule: {
        day: 'Monday',
        session: '1-3',
        fromTo: '07:00-09:30',
        room: 'A101'
    }
};

const mockEnrollment: IEnrollment = {
    id: 'ENR001',
    studentId: 'SV001',
    courseId: 'IT001',
    courseName: 'Introduction to Programming',
    semester: 'HK1 2023-2024',
    isEnrolled: true, // Using boolean instead of status enum
    credits: 3
};

const mockGrade = {
    studentId: 'SV001',
    subjectId: 'IT001',
    subjectName: 'Introduction to Programming',
    midtermGrade: 8.5,
    finalGrade: 9.0,
    totalGrade: 8.8,
    letterGrade: 'A'
};

const mockTuitionRecord = {
    id: 'TR001',
    studentId: 'SV001',
    semester: 'HK1 2023-2024',
    totalAmount: 3000000,
    paidAmount: 0,
    outstandingAmount: 3000000,
    paymentStatus: 'UNPAID' as 'UNPAID' | 'PARTIAL' | 'PAID',
    remainingAmount: 3000000,
    status: 'PENDING' as 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERPAID',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    courses: [
        {
            courseId: 'IT001',
            courseName: 'Introduction to Programming',
            credits: 3,
            amount: 3000000,
            semester: 'HK1 2023-2024',
            academicYear: '2023-2024'
        }
    ]
};

// Setup mock data before tests
beforeAll(() => {
    // Clear existing data
    subjects.length = 0;
    enrollments.length = 0;
    enrolledSubjects.length = 0;
    grades.length = 0;
    tuitionRecords.length = 0;
    paymentReceipts.length = 0;

    // Add mock data for each service
    subjects.push(mockSubject);
    enrollments.push(mockEnrollment);    // Fix IEnrolledSubject structure
    const enrolledSubject: IEnrolledSubject = {
        enrollment: mockEnrollment,
        subjectDetails: {
            id: 'IT001',
            name: 'Introduction to Programming',
            lecturer: 'Dr. Smith',
            credits: 3,
            maxStudents: 50,
            currentStudents: 25,
            schedule: [
                {
                    day: 'Monday',
                    session: '1-3',
                    room: 'A101'
                }
            ]
        },grade: {
            midterm: 8.5,
            final: 9.0,
            total: 8.75,
            letter: 'A'
        },
        attendanceRate: 95
    };
    
    enrolledSubjects.push(enrolledSubject);
    grades.push(mockGrade);
    tuitionRecords.push(mockTuitionRecord);

    // Fix IStudentOverview structure
    (dashboardService as any).students = [mockStudent];
    (dashboardService as any).schedules = [mockSchedule];
    (dashboardService as any).overviews = [{
        student: mockStudent,
        enrolledSubjects: 1,
        totalCredits: 3,
        gpa: 8.8,
        upcomingClasses: [
            {
                id: 'IT001',
                name: 'Introduction to Programming',
                lecturer: 'Dr. Smith',
                day: 'Monday',
                startTime: '07:00',
                endTime: '09:30',
                room: 'A101'
            }
        ],        recentPayments: [
            {
                id: 'PAY001',
                studentId: 'SV001',
                amount: 3000000,
                paymentDate: new Date().toISOString(),
                paymentMethod: 'BANK_TRANSFER',
                status: 'COMPLETED'
            }
        ]
    }];
});

describe('Student API Endpoints', () => {
    const mockStudentId = 'SV001';
    const mockSemester = 'HK1 2023-2024';// Test Dashboard & Schedule endpoints
    describe('Dashboard & Schedule', () => {
        it('should get student dashboard', async () => {
            const res = await request(app)
                .get('/api/students/dashboard')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('student');
            expect(res.body.data).toHaveProperty('schedule');
        });

        it('should get student timetable', async () => {
            const res = await request(app)
                .get('/api/students/timetable')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });        it('should return 404 for non-existent student', async () => {
            const invalidToken = jwt.sign(
                { id: '99999999', role: 'student' },
                secretKey,
                { expiresIn: '1h' }
            );
            const res = await request(app)
                .get('/api/students/dashboard')
                .set('Authorization', `Bearer ${invalidToken}`);
            
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });    // Test Subject Registration endpoints
    describe('Subject Registration', () => {
        it('should get available subjects', async () => {
            const res = await request(app)
                .get('/api/students/subjects')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should search subjects', async () => {
            const res = await request(app)
                .get('/api/students/subjects/search?query=IT')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should register for a subject', async () => {
            const res = await request(app)
                .post('/api/students/subjects/register')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    studentId: mockStudentId,
                    courseId: 'IT001'
                });
            
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should return 400 for invalid course ID', async () => {
            const res = await request(app)
                .post('/api/students/subjects/register')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    studentId: mockStudentId,
                    courseId: 'INVALID'
                });
            
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });    // Test Enrolled Subjects endpoints
    describe('Enrolled Subjects', () => {
        it('should get enrolled subjects', async () => {
            const res = await request(app)
                .get('/api/students/enrolled-subjects')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should cancel subject registration', async () => {
            const res = await request(app)
                .post('/api/students/enrolled-subjects/cancel')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    studentId: mockStudentId,
                    courseId: 'IT001'
                });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
        it('should return 404 for non-existent enrollment', async () => {
            const res = await request(app)
                .post('/api/students/enrolled-subjects/cancel')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    studentId: mockStudentId,
                    courseId: 'NONEXISTENT'
                });
            
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });    // Test Grades endpoints
    describe('Grades', () => {
        it('should get student grades', async () => {
            const res = await request(app)
                .get('/api/students/grades')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should get subject grade details', async () => {
            const res = await request(app)
                .get('/api/students/enrolled-subjects/IT001')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('subjectId');
            expect(res.body.data).toHaveProperty('grade');
        });

        it('should return 404 for non-existent grade', async () => {
            const res = await request(app)
                .get('/api/students/enrolled-subjects/NONEXISTENT')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });    // Test Tuition endpoints
    describe('Tuition', () => {
        it('should confirm registration', async () => {
            const res = await request(app)
                .post('/api/students/tuition/confirm')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    studentId: mockStudentId,
                    semester: mockSemester,
                    courses: [
                        {
                            courseId: 'IT001',
                            courseName: 'Introduction to Programming',
                            credits: 3,
                            price: 3000000
                        }
                    ]
                });
            
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should pay tuition', async () => {
            const res = await request(app)
                .post('/api/students/tuition/pay')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    tuitionRecordId: 'TR001',
                    amount: 3000000,
                    paymentMethod: 'BANK_TRANSFER'
                });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 400 for invalid payment amount', async () => {
            const res = await request(app)
                .post('/api/students/tuition/pay')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    tuitionRecordId: 'TR001',
                    amount: -1000000,
                    paymentMethod: 'BANK_TRANSFER'
                });
            
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should get tuition records', async () => {
            const res = await request(app)
                .get('/api/students/tuition')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should get payment receipts', async () => {
            const res = await request(app)
                .get('/api/students/tuition/history/TR001')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
});