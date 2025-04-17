import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { AdminController } from '../controllers/admin/user.controller';
import { AdminBusiness } from '../business/admin/user.manager';
import { User } from '../models/user';

// Mock AdminBusiness
jest.mock('../business/admin/user.manager', () => {
    return {
        AdminBusiness: jest.fn().mockImplementation(() => ({
            getAllUsers: jest.fn(),
            getUserById: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn()
        }))
    };
});

describe('AdminController', () => {
    let adminController: AdminController;
    let mockAdminBusiness: jest.Mocked<AdminBusiness>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockUser: User;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Initialize controller and mocks
        adminController = new AdminController();
        mockAdminBusiness = new AdminBusiness() as jest.Mocked<AdminBusiness>;
        adminController['adminBusiness'] = mockAdminBusiness;

        // Setup mock response
        mockResponse = {
            json: jest.fn().mockReturnThis() as unknown as Response['json'],
            status: jest.fn().mockReturnThis() as unknown as Response['status']
        };

        // Setup mock user
        mockUser = {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'student',
            status: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            // Setup
            mockAdminBusiness.getAllUsers.mockResolvedValue([mockUser]);
            mockRequest = {};

            // Execute
            await adminController.getAllUsers(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockAdminBusiness.getAllUsers).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: [mockUser]
            });
        });

        it('should handle errors', async () => {
            // Setup
            const error = new Error('Database error');
            mockAdminBusiness.getAllUsers.mockRejectedValue(error);
            mockRequest = {};

            // Execute
            await adminController.getAllUsers(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Database error'
            });
        });
    });

    describe('getUserById', () => {
        it('should return user by id', async () => {
            // Setup
            mockAdminBusiness.getUserById.mockResolvedValue(mockUser);
            mockRequest = {
                params: { id: '1' }
            };

            // Execute
            await adminController.getUserById(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockAdminBusiness.getUserById).toHaveBeenCalledWith(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser
            });
        });

        it('should handle user not found', async () => {
            // Setup
            const error = new Error('User not found');
            mockAdminBusiness.getUserById.mockRejectedValue(error);
            mockRequest = {
                params: { id: '999' }
            };

            // Execute
            await adminController.getUserById(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'User not found'
            });
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            // Setup
            const newUser = { ...mockUser, id: 2 };
            mockAdminBusiness.createUser.mockResolvedValue(newUser);
            mockRequest = {
                body: {
                    name: 'New User',
                    email: 'new@example.com',
                    password: 'password123',
                    role: 'student'
                }
            };

            // Execute
            await adminController.createUser(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockAdminBusiness.createUser).toHaveBeenCalledWith({
                ...mockRequest.body,
                status: true
            });
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: newUser
            });
        });

        it('should handle validation errors', async () => {
            // Setup
            const error = new Error('Invalid user data');
            mockAdminBusiness.createUser.mockRejectedValue(error);
            mockRequest = {
                body: {
                    name: 'Invalid User'
                    // Missing required fields
                }
            };

            // Execute
            await adminController.createUser(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Invalid user data'
            });
        });
    });

    describe('updateUser', () => {
        it('should update an existing user', async () => {
            // Setup
            const updatedUser = { ...mockUser, name: 'Updated User' };
            mockAdminBusiness.updateUser.mockResolvedValue(updatedUser);
            mockRequest = {
                params: { id: '1' },
                body: {
                    name: 'Updated User'
                }
            };

            // Execute
            await adminController.updateUser(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockAdminBusiness.updateUser).toHaveBeenCalledWith(1, mockRequest.body);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: updatedUser
            });
        });

        it('should handle user not found during update', async () => {
            // Setup
            const error = new Error('User not found');
            mockAdminBusiness.updateUser.mockRejectedValue(error);
            mockRequest = {
                params: { id: '999' },
                body: {
                    name: 'Updated User'
                }
            };

            // Execute
            await adminController.updateUser(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'User not found'
            });
        });
    });

    describe('deleteUser', () => {
        it('should delete an existing user', async () => {
            // Setup
            mockAdminBusiness.deleteUser.mockResolvedValue(true);
            mockRequest = {
                params: { id: '1' }
            };

            // Execute
            await adminController.deleteUser(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockAdminBusiness.deleteUser).toHaveBeenCalledWith(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                message: 'User deleted successfully'
            });
        });

        it('should handle user not found during deletion', async () => {
            // Setup
            const error = new Error('User not found');
            mockAdminBusiness.deleteUser.mockRejectedValue(error);
            mockRequest = {
                params: { id: '999' }
            };

            // Execute
            await adminController.deleteUser(mockRequest as Request, mockResponse as Response);

            // Verify
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'User not found'
            });
        });
    });
}); 