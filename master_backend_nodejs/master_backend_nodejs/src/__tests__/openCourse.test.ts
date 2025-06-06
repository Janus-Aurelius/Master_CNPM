import { OpenCourseBusiness } from '../business/academicBusiness/openCourse.business';
import { OpenCourseService } from '../services/courseService/openCourse.service';
import { ValidationError } from '../utils/errors/validation.error';
import { DatabaseError } from '../utils/errors/database.error';

// Mock the OpenCourseService
jest.mock('../services/courseService/openCourse.service');

describe('OpenCourseBusiness', () => {
    const mockCourses = [
        {
            id: 1,
            subjectCode: 'CS101',
            subjectName: 'Introduction to Programming',
            semester: 'Fall',
            academicYear: '2024',
            maxStudents: 50,
            currentStudents: 30,
            lecturer: 'Dr. Smith',
            schedule: 'Mon/Wed 10:00-11:30',
            room: 'Room 101',
            status: 'open' as const,
            startDate: '2024-09-01',
            endDate: '2024-12-15',
            registrationStartDate: '2024-08-01',
            registrationEndDate: '2024-08-31',
            prerequisites: ['CS100'],
            description: 'Basic programming concepts',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 2,
            subjectCode: 'CS102',
            subjectName: 'Data Structures',
            semester: 'Fall',
            academicYear: '2024',
            maxStudents: 40,
            currentStudents: 40,
            lecturer: 'Dr. Johnson',
            schedule: 'Tue/Thu 13:00-14:30',
            room: 'Room 102',
            status: 'closed' as const,
            startDate: '2024-09-01',
            endDate: '2024-12-15',
            registrationStartDate: '2024-08-01',
            registrationEndDate: '2024-08-31',
            prerequisites: ['CS101'],
            description: 'Advanced data structures',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllCourses', () => {
        it('should return all courses', async () => {
            (OpenCourseService.getAllCourses as jest.Mock).mockResolvedValue(mockCourses);
            const result = await OpenCourseBusiness.getAllCourses();
            expect(result).toEqual(mockCourses);
            expect(OpenCourseService.getAllCourses).toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            (OpenCourseService.getAllCourses as jest.Mock).mockRejectedValue(new DatabaseError('Database error'));
            await expect(OpenCourseBusiness.getAllCourses()).rejects.toThrow(DatabaseError);
        });
    });

    describe('getCourseById', () => {
        it('should return a course by id', async () => {
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourses[0]);
            const result = await OpenCourseBusiness.getCourseById(1);
            expect(result).toEqual(mockCourses[0]);
            expect(OpenCourseService.getCourseById).toHaveBeenCalledWith(1);
        });

        it('should return null for non-existent course', async () => {
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(null);
            const result = await OpenCourseBusiness.getCourseById(999);
            expect(result).toBeNull();
        });
    });

    describe('createCourse', () => {
        const newCourse = {
            subjectCode: 'CS103',
            subjectName: 'Algorithms',
            semester: 'Spring',
            academicYear: '2025',
            maxStudents: 45,
            currentStudents: 0,
            lecturer: 'Dr. Brown',
            schedule: 'Mon/Wed 14:00-15:30',
            room: 'Room 103',
            status: 'open' as const,
            startDate: '2025-01-15',
            endDate: '2025-05-01',
            registrationStartDate: '2024-12-01',
            registrationEndDate: '2025-01-10',
            prerequisites: ['CS101', 'CS102'],
            description: 'Advanced algorithms'
        };

        it('should create a new course', async () => {
            (OpenCourseService.createCourse as jest.Mock).mockResolvedValue({ ...newCourse, id: 3, createdAt: new Date(), updatedAt: new Date() });
            const result = await OpenCourseBusiness.createCourse(newCourse);
            expect(result).toMatchObject(newCourse);
            expect(OpenCourseService.createCourse).toHaveBeenCalledWith(newCourse);
        });

        it('should validate required fields', async () => {
            const invalidCourse = { ...newCourse, subjectCode: '' };
            await expect(OpenCourseBusiness.createCourse(invalidCourse)).rejects.toThrow(ValidationError);
        });

        it('should validate dates', async () => {
            const invalidDates = {
                ...newCourse,
                startDate: '2025-05-01',
                endDate: '2025-01-15'
            };
            await expect(OpenCourseBusiness.createCourse(invalidDates)).rejects.toThrow(ValidationError);
        });
    });

    describe('updateCourse', () => {
        const updateData = {
            maxStudents: 60,
            description: 'Updated description'
        };

        it('should update an existing course', async () => {
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourses[0]);
            (OpenCourseService.updateCourse as jest.Mock).mockResolvedValue({
                ...mockCourses[0],
                ...updateData
            });

            const result = await OpenCourseBusiness.updateCourse(1, updateData);
            expect(result).toMatchObject(updateData);
            expect(OpenCourseService.updateCourse).toHaveBeenCalledWith(1, updateData);
        });

        it('should throw error for non-existent course', async () => {
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(null);
            await expect(OpenCourseBusiness.updateCourse(999, updateData)).rejects.toThrow(ValidationError);
        });
    });

    describe('deleteCourse', () => {
        it('should delete a course with no registered students', async () => {
            const emptyCourse = { ...mockCourses[0], currentStudents: 0 };
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(emptyCourse);
            await OpenCourseBusiness.deleteCourse(1);
            expect(OpenCourseService.deleteCourse).toHaveBeenCalledWith(1);
        });

        it('should not delete course with registered students', async () => {
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourses[1]);
            await expect(OpenCourseBusiness.deleteCourse(2)).rejects.toThrow(ValidationError);
        });

        it('should throw error for non-existent course', async () => {
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(null);
            await expect(OpenCourseBusiness.deleteCourse(999)).rejects.toThrow(ValidationError);
        });
    });

    describe('getCoursesByStatus', () => {
        it('should return courses by status', async () => {
            (OpenCourseService.getCoursesByStatus as jest.Mock).mockResolvedValue([mockCourses[0]]);
            const result = await OpenCourseBusiness.getCoursesByStatus('open');
            expect(result).toEqual([mockCourses[0]]);
            expect(OpenCourseService.getCoursesByStatus).toHaveBeenCalledWith('open');
        });
    });

    describe('getCoursesBySemester', () => {
        it('should return courses by semester', async () => {
            (OpenCourseService.getCoursesBySemester as jest.Mock).mockResolvedValue(mockCourses);
            const result = await OpenCourseBusiness.getCoursesBySemester('Fall', '2024');
            expect(result).toEqual(mockCourses);
            expect(OpenCourseService.getCoursesBySemester).toHaveBeenCalledWith('Fall', '2024');
        });

        it('should validate required parameters', async () => {
            await expect(OpenCourseBusiness.getCoursesBySemester('', '2024')).rejects.toThrow(ValidationError);
            await expect(OpenCourseBusiness.getCoursesBySemester('Fall', '')).rejects.toThrow(ValidationError);
        });
    });

    describe('updateCourseStatus', () => {
        it('should update course status from open to closed when course has students', async () => {
            const courseWithStudents = { ...mockCourses[0], currentStudents: 30 };
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(courseWithStudents);
            (OpenCourseService.updateCourseStatus as jest.Mock).mockResolvedValue({
                ...courseWithStudents,
                status: 'closed'
            });

            const result = await OpenCourseBusiness.updateCourseStatus(1, 'closed');
            expect(result.status).toBe('closed');
            expect(OpenCourseService.updateCourseStatus).toHaveBeenCalledWith(1, 'closed');
        });

        it('should not update cancelled course', async () => {
            const cancelledCourse = { ...mockCourses[0], status: 'cancelled' as const };
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(cancelledCourse);
            await expect(OpenCourseBusiness.updateCourseStatus(1, 'open')).rejects.toThrow(ValidationError);
        });

        it('should not close empty course', async () => {
            const emptyCourse = { ...mockCourses[0], currentStudents: 0 };
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(emptyCourse);
            await expect(OpenCourseBusiness.updateCourseStatus(1, 'closed')).rejects.toThrow(ValidationError);
        });

        it('should allow cancelling course regardless of student count', async () => {
            const courseWithStudents = { ...mockCourses[0], currentStudents: 30 };
            (OpenCourseService.getCourseById as jest.Mock).mockResolvedValue(courseWithStudents);
            (OpenCourseService.updateCourseStatus as jest.Mock).mockResolvedValue({
                ...courseWithStudents,
                status: 'cancelled'
            });

            const result = await OpenCourseBusiness.updateCourseStatus(1, 'cancelled');
            expect(result.status).toBe('cancelled');
            expect(OpenCourseService.updateCourseStatus).toHaveBeenCalledWith(1, 'cancelled');
        });
    });
}); 