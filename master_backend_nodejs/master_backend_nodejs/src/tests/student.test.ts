import request from 'supertest';
import express from 'express';
import studentRoutes from '../routes/student.routes';
import { describe, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { ITuitionInfo } from '../models/student_related/student-payment.interface';

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
                .get(`/api/students/timetable/${mockStudentId}?semester=${mockSemester}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    // Test Tuition Management endpoints
    describe('Tuition Management', () => {
        it('should get tuition information', async () => {
            const res = await request(app)
                .get(`/api/students/tuition/${mockStudentId}?semester=${mockSemester}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            
            const tuitionInfo = res.body.data as ITuitionInfo;
            expect(tuitionInfo).toHaveProperty('totalAmount');
            expect(tuitionInfo).toHaveProperty('subjects');
            expect(Array.isArray(tuitionInfo.subjects)).toBe(true);

            if (tuitionInfo.subjects.length > 0) {
                const subject = tuitionInfo.subjects[0];
                expect(subject).toHaveProperty('subjectId');
                expect(subject).toHaveProperty('credits');
                expect(subject).toHaveProperty('tuitionPerCredit');
            }
        });

        it('should validate tuition calculation', async () => {
            const res = await request(app)
                .get(`/api/students/tuition/${mockStudentId}?semester=${mockSemester}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            const tuitionInfo = res.body.data as ITuitionInfo;
            let calculatedTotal = 0;
            tuitionInfo.subjects.forEach((subject: ITuitionInfo['subjects'][0]) => {
                calculatedTotal += subject.credits * subject.tuitionPerCredit;
            });
            
            expect(tuitionInfo.totalAmount).toBe(calculatedTotal);
        });

        it('should get payment history', async () => {
            const res = await request(app)
                .get(`/api/students/tuition/history/${mockStudentId}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);

            if (res.body.data.length > 0) {
                const payment = res.body.data[0];
                expect(payment).toHaveProperty('id');
                expect(payment).toHaveProperty('amount');
                expect(payment).toHaveProperty('status');
                expect(payment).toHaveProperty('paymentDate');
            }
        });

        it('should handle invalid student ID', async () => {
            const invalidId = 'INVALID_ID';
            const res = await request(app)
                .get(`/api/students/tuition/${invalidId}?semester=${mockSemester}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Error fetching tuition information');
        });

        it('should handle missing authentication', async () => {
            const res = await request(app)
                .get(`/api/students/tuition/${mockStudentId}?semester=${mockSemester}`);
            
            expect(res.status).toBe(401);
        });
    });

    // Test Subject Registration endpoints
    describe('Subject Registration', () => {
        it('should get available subjects', async () => {
            const res = await request(app)
                .get(`/api/students/subjects/available?semester=${mockSemester}`)
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
    });

    // Test Enrolled Subjects endpoints
    describe('Enrolled Subjects', () => {
        it('should get enrolled subjects', async () => {
            const res = await request(app)
                .get(`/api/students/enrolled/${mockStudentId}?semester=${mockSemester}`)
                .set('Authorization', `Bearer ${mockToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should cancel subject registration', async () => {
            const res = await request(app)
                .delete('/api/students/subjects/cancel')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({
                    studentId: mockStudentId,
                    courseId: 'IT001'
                });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
}); 