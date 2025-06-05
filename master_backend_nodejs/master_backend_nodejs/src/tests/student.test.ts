import request from 'supertest';
import express from 'express';
import studentRoutes from '../routes/studentRoutes';
import { describe, it, expect, beforeAll } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { dashboardService } from '../services/studentServices/dashboardService';
import { subjectRegistrationService, subjects } from '../services/studentServices/subjectRegistrationService';
import { enrollmentService, enrollments, enrolledSubjects } from '../services/studentServices/enrollmentService';
import { gradeService, grades } from '../services/studentServices/gradeService';
import { studentTuitionPaymentService, tuitionRecords, paymentReceipts } from '../services/studentServices/studentTuitionPaymentService';
import { EnrollmentStatus, IEnrolledSubject } from '../models/student_related/studentEnrollmentInterface';
import { IGrade } from '../models/student_related/studentDashboardInterface';
import { IStudentOverview } from '../models/student_related/studentDashboardInterface';
import { ITuitionRecord } from '../models/student_related/studentTuitionPaymentInterface';

const app = express();
app.use(express.json());
app.use('/api/students', studentRoutes);

// Mock token for testing
const secretKey = '1234567890';
const mockToken = jwt.sign(
    { id: '20120123', role: 'student' },
    secretKey,
    { expiresIn: '1h' }
);

// Mock data
const mockStudent = {
    studentId: '20120123',
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
    id: 'IT001',
    name: 'Introduction to Programming',
    lecturer: 'Dr. Smith',
    credits: 3,
    maxStudents: 50,
    currentStudents: 30,
    schedule: [
        {
            day: 'Monday',
            session: '1-3',
            room: 'A101'
        }
    ]
};

const mockEnrollment = {
    id: 'ENR001',
    studentId: '20120123',
    courseId: 'IT001',
    courseName: 'Introduction to Programming',
    semester: 'HK1 2023-2024',
    status: 'registered' as EnrollmentStatus,
    credits: 3
};

const mockGrade = {
    studentId: '20120123',
    subjectId: 'IT001',
    subjectName: 'Introduction to Programming',
    midtermGrade: 8.5,
    finalGrade: 9.0,
    totalGrade: 8.8,
    letterGrade: 'A'
};

const mockTuitionRecord = {
    id: 'TR001',
    studentId: '20120123',
    semester: 'HK1 2023-2024',
    totalAmount: 3000000,
    paidAmount: 0,
    remainingAmount: 3000000,
    status: 'PENDING' as 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERPAID',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    courses: [
        {
            courseId: 'IT001',
            courseName: 'Introduction to Programming',
            credits: 3,
            price: 3000000
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
    enrollments.push(mockEnrollment);
    
    // Fix IEnrolledSubject structure
    const enrolledSubject: IEnrolledSubject = {
        enrollment: mockEnrollment,
        schedule: [
            {
                day: 'Monday',
                startTime: '07:00',
                endTime: '09:30',
                room: 'A101'
            }
        ],
        instructor: 'Dr. Smith'
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
        ],
        recentPayments: [
            {
                id: 'PAY001',
                studentId: '20120123',
                amount: 3000000,
                paymentDate: new Date().toISOString(),
                paymentMethod: 'BANK_TRANSFER',
                status: 'COMPLETED'
            }
        ]
    }];
});

describe('Student API Endpoints', () => {
    const mockStudentId = '20120123';
    const mockSemester = 'HK1 2023-2024';

    // Test Dashboard & Schedule endpoints
    describe('Dashboard & Schedule', () => {
        it('should get student dashboard', async () => {
            const res = await request(app)
                .get(`/api/students/dashboard/${mockStudentId}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('student');
            expect(res.body.data).toHaveProperty('schedule');
        });

        it('should get student timetable', async () => {
            const res = await request(app)
                .get(`/api/students/timetable/${mockStudentId}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should return 404 for non-existent student', async () => {
            const res = await request(app)
                .get('/api/students/dashboard/99999999')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // Test Subject Registration endpoints
    describe('Subject Registration', () => {
        it('should get available subjects', async () => {
            const res = await request(app)
                .get('/api/students/available-subjects')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should search subjects', async () => {
            const res = await request(app)
                .get('/api/students/search-subjects?query=IT')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should register for a subject', async () => {
            const res = await request(app)
                .post('/api/students/register-subject')
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
                .post('/api/students/register-subject')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    studentId: mockStudentId,
                    courseId: 'INVALID'
                });
            
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    // Test Enrolled Subjects endpoints
    describe('Enrolled Subjects', () => {
        it('should get enrolled subjects', async () => {
            const res = await request(app)
                .get(`/api/students/enrolled-subjects/${mockStudentId}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should cancel subject registration', async () => {
            const res = await request(app)
                .post('/api/students/cancel-registration')
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
                .post('/api/students/cancel-registration')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    studentId: mockStudentId,
                    courseId: 'NONEXISTENT'
                });
            
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // Test Grades endpoints
    describe('Grades', () => {
        it('should get student grades', async () => {
            const res = await request(app)
                .get(`/api/students/grades/${mockStudentId}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should get subject grade details', async () => {
            const res = await request(app)
                .get(`/api/students/subject/IT001/grade/${mockStudentId}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('subjectId');
            expect(res.body.data).toHaveProperty('grade');
        });

        it('should return 404 for non-existent grade', async () => {
            const res = await request(app)
                .get(`/api/students/subject/NONEXISTENT/grade/${mockStudentId}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // Test Tuition endpoints
    describe('Tuition', () => {
        it('should confirm registration', async () => {
            const res = await request(app)
                .post('/api/students/confirm-registration')
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
                .post('/api/students/pay-tuition')
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
                .post('/api/students/pay-tuition')
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
                .get('/api/students/tuition-records')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should get payment receipts', async () => {
            const res = await request(app)
                .get('/api/students/payment-receipts')
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
});