import request from 'supertest';
import express from 'express';
import adminRoutes from '../routes/admin.routes';
import { describe, it, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/admin', adminRoutes);

// Mock token for testing
const secretKey = '1234567890';
const mockAdminToken = jwt.sign(
    { id: 'admin001', role: 'admin' },
    secretKey,
    { expiresIn: '1h' }
);

describe('Admin API Endpoints', () => {
    // Test User Management endpoints
    describe('User Management', () => {
        const mockUser = {
            id: 'user001',
            username: 'testuser',
            email: 'test@example.com',
            role: 'student',
            status: 'active'
        };

        it('should get all users', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${mockAdminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        it('should get user by ID', async () => {
            const res = await request(app)
                .get(`/api/admin/users/${mockUser.id}`)
                .set('Authorization', `Bearer ${mockAdminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id', mockUser.id);
        });

        it('should create new user', async () => {
            const res = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send(mockUser);
            
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id');
        });

        it('should update user', async () => {
            const updatedUser = {
                ...mockUser,
                username: 'updateduser'
            };

            const res = await request(app)
                .put(`/api/admin/users/${mockUser.id}`)
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send(updatedUser);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('username', 'updateduser');
        });

        it('should delete user', async () => {
            const res = await request(app)
                .delete(`/api/admin/users/${mockUser.id}`)
                .set('Authorization', `Bearer ${mockAdminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should change user status', async () => {
            const res = await request(app)
                .patch(`/api/admin/users/${mockUser.id}/status`)
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send({ status: 'inactive' });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('status', 'inactive');
        });
    });

    // Test System Maintenance endpoints
    describe('System Maintenance', () => {
        it('should get maintenance status', async () => {
            const res = await request(app)
                .get('/api/admin/maintenance/status')
                .set('Authorization', `Bearer ${mockAdminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('isMaintenanceMode');
            expect(res.body.data).toHaveProperty('message');
            expect(res.body.data).toHaveProperty('allowedIPs');
        });

        it('should enable maintenance mode', async () => {
            const res = await request(app)
                .post('/api/admin/maintenance/enable')
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send({ message: 'System under maintenance' });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should disable maintenance mode', async () => {
            const res = await request(app)
                .post('/api/admin/maintenance/disable')
                .set('Authorization', `Bearer ${mockAdminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update maintenance message', async () => {
            const res = await request(app)
                .put('/api/admin/maintenance/message')
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send({ message: 'New maintenance message' });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should add allowed IP', async () => {
            const res = await request(app)
                .post('/api/admin/maintenance/ip')
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send({ ip: '192.168.1.1' });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should remove allowed IP', async () => {
            const res = await request(app)
                .delete('/api/admin/maintenance/ip')
                .set('Authorization', `Bearer ${mockAdminToken}`)
                .send({ ip: '192.168.1.1' });
            
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should handle unauthorized access', async () => {
            const res = await request(app)
                .get('/api/admin/users');
            
            expect(res.status).toBe(401);
        });

        it('should handle invalid admin token', async () => {
            const invalidToken = jwt.sign(
                { id: 'user001', role: 'student' },
                secretKey,
                { expiresIn: '1h' }
            );

            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${invalidToken}`);
            
            expect(res.status).toBe(403);
        });
    });
}); 