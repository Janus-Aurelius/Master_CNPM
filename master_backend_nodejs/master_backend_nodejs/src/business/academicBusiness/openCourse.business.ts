import { IOfferedSubject } from '../../models/academic_related/openCourse';
import { ValidationError } from '../../utils/errors/validation.error';
import { OpenCourseService } from '../../services/courseService/openCourse.service';

export class OpenCourseBusiness {
    static async getAllCourses(): Promise<IOfferedSubject[]> {
        return await OpenCourseService.getAllCourses();
    }

    static async getCourseById(id: number): Promise<IOfferedSubject | null> {
        return await OpenCourseService.getCourseById(id);
    }

    static async createCourse(courseData: Omit<IOfferedSubject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IOfferedSubject> {
        const errors = this.validateCourseData(courseData);
        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }

        // Validate dates
        this.validateDates(courseData);

        return await OpenCourseService.createCourse(courseData);
    }

    static async updateCourse(id: number, courseData: Partial<IOfferedSubject>): Promise<IOfferedSubject> {
        const existingCourse = await this.getCourseById(id);
        if (!existingCourse) {
            throw new ValidationError('Course not found');
        }

        const updatedData = { ...existingCourse, ...courseData };
        const errors = this.validateCourseData(updatedData);
        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }

        // Validate dates if they are being updated
        if (courseData.startDate || courseData.endDate || 
            courseData.registrationStartDate || courseData.registrationEndDate) {
            this.validateDates(updatedData);
        }

        return await OpenCourseService.updateCourse(id, courseData);
    }

    static async deleteCourse(id: number): Promise<void> {
        const course = await this.getCourseById(id);
        if (!course) {
            throw new ValidationError('Course not found');
        }


        await OpenCourseService.deleteCourse(id);
    }

    static async getCoursesByStatus(status: IOfferedSubject['status']): Promise<IOfferedSubject[]> {
        return await OpenCourseService.getCoursesByStatus(status);
    }

    static async getCoursesBySemester(semester: string, academicYear: string): Promise<IOfferedSubject[]> {
        if (!semester || !academicYear) {
            throw new ValidationError('Semester and academic year are required');
        }
        return await OpenCourseService.getCoursesBySemester(semester, academicYear);
    }

    static async updateCourseStatus(id: number, status: IOfferedSubject['status']): Promise<IOfferedSubject> {
        const course = await this.getCourseById(id);
        if (!course) {
            throw new ValidationError('Course not found');
        }

        // Validate status transition
        if (course.status === 'cancelled' && status !== 'cancelled') {
            throw new ValidationError('Cannot change status of a cancelled course');
        }

        if (status === 'closed' && course.currentStudents === 0) {
            throw new ValidationError('Cannot close a course with no registered students');
        }

        return await OpenCourseService.updateCourseStatus(id, status);
    }

    private static validateCourseData(courseData: Partial<IOfferedSubject>): string[] {
        const errors: string[] = [];

        if (!courseData.subjectId) {
            errors.push('Subject ID is required');
        }

        if (!courseData.semesterId) {
            errors.push('Semester ID is required');
        }

        if (courseData.schedule) {
            const { day, session, room } = courseData.schedule;
            if (!day || !session || !room) {
                errors.push('Schedule must include day, session, and room');
            }
        }

        if (courseData.maxStudents && courseData.maxStudents <= 0) {
            errors.push('Maximum students must be greater than 0');
        }

        if (courseData.currentStudents && courseData.currentStudents < 0) {
            errors.push('Current students cannot be negative');
        }

        if (courseData.currentStudents && courseData.maxStudents && 
            courseData.currentStudents > courseData.maxStudents) {
            errors.push('Current students cannot exceed maximum students');
        }

        return errors;
    }

    private static validateDates(courseData: Partial<IOfferedSubject>): void {
        const errors: string[] = [];

        if (courseData.startDate && courseData.endDate) {
            const start = new Date(courseData.startDate);
            const end = new Date(courseData.endDate);
            if (end <= start) {
                errors.push('End date must be after start date');
            }
        }

        if (courseData.registrationStartDate && courseData.registrationEndDate) {
            const regStart = new Date(courseData.registrationStartDate);
            const regEnd = new Date(courseData.registrationEndDate);
            if (regEnd <= regStart) {
                errors.push('Registration end date must be after registration start date');
            }
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }
    }
} 