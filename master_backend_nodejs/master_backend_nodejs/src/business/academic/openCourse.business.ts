import { OpenCourse } from '../../models/academic_related/openCourse';
import { ValidationError } from '../../utils/errors/validation.error';
import { OpenCourseService } from '../../services/openCourse.service';

export class OpenCourseBusiness {
    static async getAllCourses(): Promise<OpenCourse[]> {
        return await OpenCourseService.getAllCourses();
    }

    static async getCourseById(id: number): Promise<OpenCourse | null> {
        return await OpenCourseService.getCourseById(id);
    }

    static async createCourse(courseData: Omit<OpenCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<OpenCourse> {
        const errors = this.validateCourseData(courseData);
        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }

        // Validate dates
        this.validateDates(courseData);

        return await OpenCourseService.createCourse(courseData);
    }

    static async updateCourse(id: number, courseData: Partial<OpenCourse>): Promise<OpenCourse> {
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

        if (course.currentStudents > 0) {
            throw new ValidationError('Cannot delete course with registered students');
        }

        await OpenCourseService.deleteCourse(id);
    }

    static async getCoursesByStatus(status: OpenCourse['status']): Promise<OpenCourse[]> {
        return await OpenCourseService.getCoursesByStatus(status);
    }

    static async getCoursesBySemester(semester: string, academicYear: string): Promise<OpenCourse[]> {
        if (!semester || !academicYear) {
            throw new ValidationError('Semester and academic year are required');
        }
        return await OpenCourseService.getCoursesBySemester(semester, academicYear);
    }

    static async updateCourseStatus(id: number, status: OpenCourse['status']): Promise<OpenCourse> {
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

    private static validateCourseData(courseData: Partial<OpenCourse>): string[] {
        const errors: string[] = [];
        
        if (!courseData.subjectCode) errors.push('Subject code is required');
        if (!courseData.subjectName) errors.push('Subject name is required');
        if (!courseData.semester) errors.push('Semester is required');
        if (!courseData.academicYear) errors.push('Academic year is required');
        if (typeof courseData.maxStudents !== 'number' || courseData.maxStudents <= 0) {
            errors.push('Maximum students must be a positive number');
        }
        if (typeof courseData.currentStudents !== 'number' || courseData.currentStudents < 0) {
            errors.push('Current students must be a non-negative number');
        }
        if (courseData.maxStudents && courseData.currentStudents && 
            courseData.currentStudents > courseData.maxStudents) {
            errors.push('Current students cannot exceed maximum students');
        }
        if (!courseData.lecturer) errors.push('Lecturer is required');
        if (!courseData.schedule) errors.push('Schedule is required');
        if (!courseData.room) errors.push('Room is required');
        if (!courseData.status || !['open', 'closed', 'cancelled'].includes(courseData.status)) {
            errors.push('Valid status is required');
        }
        if (!courseData.prerequisites || !Array.isArray(courseData.prerequisites)) {
            errors.push('Prerequisites must be an array');
        }

        return errors;
    }

    private static validateDates(courseData: Partial<OpenCourse>): void {
        const errors: string[] = [];

        if (courseData.startDate && courseData.endDate) {
            const startDate = new Date(courseData.startDate);
            const endDate = new Date(courseData.endDate);
            if (startDate >= endDate) {
                errors.push('Start date must be before end date');
            }
        }

        if (courseData.registrationStartDate && courseData.registrationEndDate) {
            const regStartDate = new Date(courseData.registrationStartDate);
            const regEndDate = new Date(courseData.registrationEndDate);
            if (regStartDate >= regEndDate) {
                errors.push('Registration start date must be before registration end date');
            }
        }

        if (courseData.registrationEndDate && courseData.startDate) {
            const regEndDate = new Date(courseData.registrationEndDate);
            const startDate = new Date(courseData.startDate);
            if (regEndDate >= startDate) {
                errors.push('Registration end date must be before course start date');
            }
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }
    }
} 