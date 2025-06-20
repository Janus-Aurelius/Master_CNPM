import { registrationService } from '../services/studentService/registrationService';
import { registrationManager } from '../business/studentBusiness/registrationManager';
import { DatabaseService } from '../services/database/databaseService';

// Mock DatabaseService
jest.mock('../services/database/databaseService', () => ({
    DatabaseService: {
        query: jest.fn(),
        queryOne: jest.fn(),
    }
}));

const mockDatabaseService = DatabaseService as jest.Mocked<typeof DatabaseService>;

describe('Student Course Registration System', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('RegistrationService', () => {
        const mockStudentId = 'SV001';
        const mockSemesterId = 'HK001';
        const mockCourseId = 'MH001';

        describe('getAvailableCourses', () => {
            it('should return available courses for a semester', async () => {
                const mockCourses = [
                    {
                        courseId: 'MH001',
                        courseName: 'Lập trình Web',
                        credits: 3,
                        courseType: 'Bắt buộc',
                        fee: 1500000,
                        semesterId: 'HK001',
                        minStudents: 10,
                        maxStudents: 40,
                        currentStudents: 25,
                        status: 'OPEN',
                        prerequisiteCourses: [],
                        schedules: [],
                        dayOfWeek: 2,
                        startPeriod: 1,
                        endPeriod: 3
                    }
                ];

                mockDatabaseService.query.mockResolvedValueOnce(mockCourses);

                const result = await registrationService.getAvailableCourses(mockSemesterId);

                expect(result).toEqual(mockCourses);
                expect(mockDatabaseService.query).toHaveBeenCalledWith(
                    expect.stringContaining('DANHSACHMONHOCMO'),
                    [mockSemesterId]
                );
            });

            it('should handle database errors', async () => {
                mockDatabaseService.query.mockRejectedValueOnce(new Error('Database connection failed'));

                await expect(registrationService.getAvailableCourses(mockSemesterId))
                    .rejects.toThrow('Database connection failed');

                expect(mockDatabaseService.query).toHaveBeenCalledWith(
                    expect.stringContaining('DANHSACHMONHOCMO'),
                    [mockSemesterId]
                );
            });
        });        describe('getRegisteredCourses', () => {
            it('should return registered courses for a student', async () => {
                const mockRegisteredCourses = [
                    {
                        registrationId: 'PDK_SV001_HK001',
                        courseId: 'MH001',
                        courseName: 'Lập trình Web',
                        credits: 3,
                        courseType: 'Bắt buộc',
                        fee: 1500000
                    }
                ];

                mockDatabaseService.query.mockResolvedValueOnce(mockRegisteredCourses);

                const result = await registrationService.getRegisteredCourses(mockStudentId, mockSemesterId);

                expect(result).toEqual(mockRegisteredCourses);
                expect(mockDatabaseService.query).toHaveBeenCalledWith(
                    expect.stringContaining('CT_PHIEUDANGKY'),
                    [mockStudentId, mockSemesterId]
                );
            });
        });

        describe('registerCourse', () => {
            it('should successfully register a course for new registration', async () => {
                // Mock offered course exists
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: mockCourseId }) // offered course check
                    .mockResolvedValueOnce(null) // no existing registration
                    .mockResolvedValueOnce(null) // no existing course registration
                    .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 }) // course info
                    .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' }) // student info
                    .mockResolvedValueOnce({ MaMonHoc: mockCourseId, TenMonHoc: 'Lập trình Web' }); // course info

                mockDatabaseService.query
                    .mockResolvedValueOnce([]) // insert registration
                    .mockResolvedValueOnce([]) // insert registration detail
                    .mockResolvedValueOnce([]) // update registration amount
                    .mockResolvedValueOnce([]); // insert activity log

                const result = await registrationService.registerCourse(mockStudentId, mockCourseId, mockSemesterId);

                expect(result).toBe(true);
                expect(mockDatabaseService.query).toHaveBeenCalledTimes(4);
            });

            it('should successfully register a course for existing registration', async () => {
                // Mock offered course exists and existing registration exists
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: mockCourseId }) // offered course check
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing registration
                    .mockResolvedValueOnce(null) // no existing course registration
                    .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 }) // course info
                    .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' }) // student info
                    .mockResolvedValueOnce({ MaMonHoc: mockCourseId, TenMonHoc: 'Lập trình Web' }); // course info

                mockDatabaseService.query
                    .mockResolvedValueOnce([]) // insert registration detail
                    .mockResolvedValueOnce([]) // update registration amount
                    .mockResolvedValueOnce([]); // insert activity log

                const result = await registrationService.registerCourse(mockStudentId, mockCourseId, mockSemesterId);

                expect(result).toBe(true);
                expect(mockDatabaseService.query).toHaveBeenCalledTimes(3);
            });

            it('should throw error if course is not offered', async () => {
                mockDatabaseService.queryOne.mockResolvedValueOnce(null); // no offered course

                await expect(registrationService.registerCourse(mockStudentId, mockCourseId, mockSemesterId))
                    .rejects.toThrow('Môn học này không có trong danh sách mở');
            });

            it('should throw error if course is already registered', async () => {
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: mockCourseId }) // offered course check
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing registration
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }); // existing course registration

                await expect(registrationService.registerCourse(mockStudentId, mockCourseId, mockSemesterId))
                    .rejects.toThrow('Sinh viên đã đăng ký môn học này rồi');
            });
        });

        describe('cancelCourseRegistration', () => {
            it('should successfully cancel course registration', async () => {
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing registration
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing course registration
                    .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 }) // course info
                    .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' }) // student info
                    .mockResolvedValueOnce({ MaMonHoc: mockCourseId, TenMonHoc: 'Lập trình Web' }); // course info

                mockDatabaseService.query
                    .mockResolvedValueOnce([]) // delete registration detail
                    .mockResolvedValueOnce([]) // update registration amount
                    .mockResolvedValueOnce([]); // insert activity log

                const result = await registrationService.cancelCourseRegistration(mockStudentId, mockCourseId, mockSemesterId);

                expect(result).toBe(true);
                expect(mockDatabaseService.query).toHaveBeenCalledWith(
                    expect.stringContaining('DELETE FROM CT_PHIEUDANGKY'),
                    ['PDK_SV001_HK001', mockCourseId]
                );
            });

            it('should throw error if registration not found', async () => {
                mockDatabaseService.queryOne.mockResolvedValueOnce(null); // no registration

                await expect(registrationService.cancelCourseRegistration(mockStudentId, mockCourseId, mockSemesterId))
                    .rejects.toThrow('Không tìm thấy phiếu đăng ký');
            });

            it('should throw error if course not registered', async () => {
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' }) // existing registration
                    .mockResolvedValueOnce(null); // no course registration

                await expect(registrationService.cancelCourseRegistration(mockStudentId, mockCourseId, mockSemesterId))
                    .rejects.toThrow('Sinh viên chưa đăng ký môn học này');
            });
        });        describe('registerCourses (batch)', () => {
            it('should register multiple courses successfully', async () => {
                const courseIds = ['MH001', 'MH002'];
                const requestData = { studentId: mockStudentId, courseIds, semesterId: mockSemesterId };
                
                // Mock for first course
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: 'MH001' })
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' })
                    .mockResolvedValueOnce(null)
                    .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 })
                    .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' })
                    .mockResolvedValueOnce({ MaMonHoc: 'MH001', TenMonHoc: 'Course 1' })
                    // Mock for second course
                    .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: 'MH002' })
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' })
                    .mockResolvedValueOnce(null)
                    .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 })
                    .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' })
                    .mockResolvedValueOnce({ MaMonHoc: 'MH002', TenMonHoc: 'Course 2' });

                mockDatabaseService.query.mockResolvedValue([]);

                const result = await registrationService.registerCourses(requestData);

                expect(result.success).toBe(true);
                expect(result.details).toHaveLength(2);
                expect(result.details[0].success).toBe(true);
                expect(result.details[1].success).toBe(true);
            });

            it('should handle partial success', async () => {
                const courseIds = ['MH001', 'MH002'];
                const requestData = { studentId: mockStudentId, courseIds, semesterId: mockSemesterId };
                
                // Mock for first course (success)
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaHocKy: mockSemesterId, MaMonHoc: 'MH001' })
                    .mockResolvedValueOnce({ MaPhieuDangKy: 'PDK_SV001_HK001' })
                    .mockResolvedValueOnce(null)
                    .mockResolvedValueOnce({ SoTienMotTC: 500000, SoTiet: 3 })
                    .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId, HoTen: 'Nguyen Van A' })
                    .mockResolvedValueOnce({ MaMonHoc: 'MH001', TenMonHoc: 'Course 1' })
                    // Mock for second course (failure)
                    .mockResolvedValueOnce(null); // no offered course

                mockDatabaseService.query.mockResolvedValue([]);

                const result = await registrationService.registerCourses(requestData);

                expect(result.success).toBe(true); // Still success because at least one course registered
                expect(result.details).toHaveLength(2);
                expect(result.details[0].success).toBe(true);
                expect(result.details[1].success).toBe(false);
            });
        });

        describe('getRegistrationInfo', () => {
            it('should return registration information', async () => {
                const mockRegistration = {
                    registrationId: 'PDK_SV001_HK001',
                    registrationDate: new Date('2025-06-17T02:00:31.807Z'),
                    studentId: 'SV001',
                    semesterId: 'HK001',
                    maxCredits: 24,
                    registrationAmount: 1500000,
                    requiredAmount: 1500000,
                    paidAmount: 0,
                    remainingAmount: 1500000
                };

                mockDatabaseService.queryOne.mockResolvedValueOnce(mockRegistration);

                const result = await registrationService.getRegistrationInfo(mockStudentId, mockSemesterId);

                expect(result).toEqual(mockRegistration);
                expect(mockDatabaseService.queryOne).toHaveBeenCalledWith(
                    expect.stringContaining('PHIEUDANGKY'),
                    [mockStudentId, mockSemesterId]
                );
            });
        });
    });

    describe('RegistrationManager', () => {
        const mockStudentId = 'SV001';
        const mockSemesterId = 'HK001';
        const mockCourseId = 'MH001';

        describe('getAvailableCourses', () => {
            it('should return success response with available courses', async () => {
                const mockCourses = [{ courseId: 'MH001', courseName: 'Test Course' }];
                mockDatabaseService.query.mockResolvedValueOnce(mockCourses);

                const result = await registrationManager.getAvailableCourses(mockSemesterId);

                expect(result.success).toBe(true);
                expect(result.data).toEqual(mockCourses);
            });

            it('should return error response for empty semester ID', async () => {
                const result = await registrationManager.getAvailableCourses('');

                expect(result.success).toBe(false);
                expect(result.message).toBe('Mã học kỳ không được để trống');
            });

            it('should handle service errors', async () => {
                mockDatabaseService.query.mockRejectedValueOnce(new Error('Database error'));

                const result = await registrationManager.getAvailableCourses(mockSemesterId);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Không thể lấy danh sách môn học');
            });
        });

        describe('getRegisteredCourses', () => {
            it('should return success response with registered courses', async () => {
                const mockCourses = [{ courseId: 'MH001', courseName: 'Test Course' }];
                mockDatabaseService.query.mockResolvedValueOnce(mockCourses);

                const result = await registrationManager.getRegisteredCourses(mockStudentId, mockSemesterId);

                expect(result.success).toBe(true);
                expect(result.data).toEqual(mockCourses);
            });

            it('should return error response for empty student ID', async () => {
                const result = await registrationManager.getRegisteredCourses('', mockSemesterId);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Mã sinh viên không được để trống');
            });
        });        describe('registerCourses', () => {
            beforeEach(() => {
                // Mock successful semester and student existence check
                mockDatabaseService.queryOne
                    .mockResolvedValueOnce({ MaHocKy: mockSemesterId, TrangThaiHocKy: 'ACTIVE' }) // semester check
                    .mockResolvedValueOnce({ MaSoSinhVien: mockStudentId }); // student check
            });            it('should return success response for successful registration', async () => {
                const mockResult = { success: true, message: 'Đăng ký thành công 1/1 môn học', details: [{ courseId: mockCourseId, success: true, message: 'Đăng ký thành công' }] };
                jest.spyOn(registrationService, 'registerCourses').mockResolvedValueOnce(mockResult);

                const result = await registrationManager.registerCourses(mockStudentId, [mockCourseId], mockSemesterId);

                expect(result.success).toBe(true);
                expect(result.data).toEqual(mockResult.details);
            });

            it('should return error response for registration failure', async () => {
                // Mock semester not found
                mockDatabaseService.queryOne.mockReset().mockResolvedValueOnce(null);

                const result = await registrationManager.registerCourses(mockStudentId, [mockCourseId], mockSemesterId);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Học kỳ không tồn tại');
            });

            it('should validate required parameters', async () => {
                const result = await registrationManager.registerCourses('', [mockCourseId], mockSemesterId);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Thông tin đăng ký không đầy đủ');
            });
        });

        describe('unregisterCourse', () => {
            beforeEach(() => {
                // Mock successful student existence check
                mockDatabaseService.queryOne.mockResolvedValueOnce({ MaSoSinhVien: mockStudentId });
            });

            it('should return success response for successful cancellation', async () => {
                jest.spyOn(registrationService, 'cancelCourseRegistration').mockResolvedValueOnce(true);

                const result = await registrationManager.unregisterCourse(mockStudentId, mockCourseId, mockSemesterId);

                expect(result.success).toBe(true);
                expect(result.message).toBe('Hủy đăng ký môn học thành công');
            });

            it('should return error response for cancellation failure', async () => {
                jest.spyOn(registrationService, 'cancelCourseRegistration').mockRejectedValueOnce(new Error('Registration not found'));

                const result = await registrationManager.unregisterCourse(mockStudentId, mockCourseId, mockSemesterId);

                expect(result.success).toBe(false);
                expect(result.message).toBe('Lỗi trong quá trình hủy đăng ký');
            });
        });        describe('getRegistrationSummary', () => {
            it('should return registration summary', async () => {
                const mockRegistration = {
                    registrationId: 'PDK_SV001_HK001',
                    registrationDate: new Date(),
                    studentId: mockStudentId,
                    semesterId: mockSemesterId,
                    registrationAmount: 1500000,
                    requiredAmount: 1500000,
                    paidAmount: 0,
                    remainingAmount: 1500000,
                    maxCredits: 24
                };
                const mockCourses = [
                    {
                        registrationId: 'PDK_SV001_HK001',
                        courseId: 'MH001',
                        courseName: 'Test Course',
                        credits: 3,
                        courseType: 'Bắt buộc',
                        fee: 1500000
                    }
                ];
                const expectedSummary = {
                    registration: mockRegistration,
                    courses: mockCourses,
                    statistics: {
                        totalCourses: 1,
                        totalCredits: 3,
                        totalFee: 1500000
                    }
                };

                jest.spyOn(registrationService, 'getRegistrationInfo').mockResolvedValueOnce(mockRegistration);
                jest.spyOn(registrationService, 'getRegisteredCourses').mockResolvedValueOnce(mockCourses);

                const result = await registrationManager.getRegistrationSummary(mockStudentId, mockSemesterId);

                expect(result.success).toBe(true);
                expect(result.data).toEqual(expectedSummary);
            });
        });

        describe('Compatibility aliases', () => {
            beforeEach(() => {
                // Mock successful student existence check
                mockDatabaseService.queryOne.mockResolvedValueOnce({ MaSoSinhVien: mockStudentId });
            });

            it('should support getAvailableSubjects alias', async () => {
                const mockCourses = [{ courseId: 'MH001', courseName: 'Test Course' }];
                mockDatabaseService.query.mockResolvedValueOnce(mockCourses);

                const result = await registrationManager.getAvailableSubjects(mockSemesterId);

                expect(result.success).toBe(true);
                expect(result.data).toEqual(mockCourses);
            });            it('should support registerSubject alias', async () => {
                const mockResult = { success: true, message: 'Đăng ký thành công 1/1 môn học', details: [{ courseId: mockCourseId, success: true, message: 'Đăng ký thành công' }] };
                jest.spyOn(registrationService, 'registerCourses').mockResolvedValueOnce(mockResult);

                const result = await registrationManager.registerSubject(mockStudentId, mockCourseId, mockSemesterId);

                expect(result.success).toBe(true);
            });

            it('should support getEnrolledCourses alias', async () => {
                const mockCourses = [{ courseId: 'MH001', courseName: 'Test Course' }];
                mockDatabaseService.query.mockResolvedValueOnce(mockCourses);

                const result = await registrationManager.getEnrolledCourses(mockStudentId, mockSemesterId);

                expect(result.success).toBe(true);
                expect(result.data).toEqual(mockCourses);
            });

            it('should support cancelRegistration alias', async () => {
                jest.spyOn(registrationService, 'cancelCourseRegistration').mockResolvedValueOnce(true);

                const result = await registrationManager.cancelRegistration(mockStudentId, mockCourseId, mockSemesterId);

                expect(result.success).toBe(true);
                expect(result.message).toBe('Hủy đăng ký môn học thành công');
            });
        });
    });
});
