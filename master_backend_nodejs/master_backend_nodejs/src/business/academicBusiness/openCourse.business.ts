import { IOfferedCourse } from '../../models/academic_related/openCourse';
import { ValidationError } from '../../utils/errors/validation.error';
import { OpenCourseService } from '../../services/courseService/openCourse.service';

export class OpenCourseBusiness {
    static async getAllCourses(): Promise<IOfferedCourse[]> {
        return await OpenCourseService.getAllCourses();
    }    static async getCourseById(semesterId: string, courseId: string): Promise<IOfferedCourse | null> {
        return await OpenCourseService.getCourseById(semesterId, courseId);
    }

    static async createCourse(courseData: Omit<IOfferedCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<IOfferedCourse> {
        const errors = this.validateCourseData(courseData);
        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }

        // Validate dates
        this.validateDates(courseData);

        return await OpenCourseService.createCourse(courseData);
    }    static async updateCourse(semesterId: string, courseId: string, courseData: Partial<IOfferedCourse>): Promise<IOfferedCourse> {
        const existingCourse = await OpenCourseService.getCourseById(semesterId, courseId);
        if (!existingCourse) {
            throw new ValidationError('Course not found');
        }

        const updatedData = { ...existingCourse, ...courseData };
        const errors = this.validateCourseData(updatedData);
        if (errors.length > 0) {
            throw new ValidationError(errors.join(', '));
        }

        // Validate dates if they are being updated
        if (courseData.registrationStartDate || courseData.registrationEndDate) {
            this.validateDates(updatedData);
        }

        return await OpenCourseService.updateCourse(semesterId, courseId, courseData);
    }    static async deleteCourse(semesterId: string, courseId: string): Promise<void> {
        const course = await OpenCourseService.getCourseById(semesterId, courseId);
        if (!course) {
            throw new ValidationError('Course not found');
        }

        await OpenCourseService.deleteCourse(semesterId, courseId);
    }

    static async getCoursesBySemester(semester: string, academicYear: string): Promise<IOfferedCourse[]> {
        if (!semester || !academicYear) {
            throw new ValidationError('Semester and academic year are required');        }
        return await OpenCourseService.getCoursesBySemester(semester, academicYear);
    }

    private static validateCourseData(courseData: Partial<IOfferedCourse>): string[] {
        const errors: string[] = [];

        if (!courseData.courseId) {
            errors.push('Course ID is required');
        }

        if (!courseData.semesterId) {
            errors.push('Semester ID is required');
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
    }    private static validateDates(courseData: Partial<IOfferedCourse>): void {
        const errors: string[] = [];

        // Validate registration dates if provided
        if (courseData.registrationStartDate && courseData.registrationEndDate) {
            const start = new Date(courseData.registrationStartDate);
            const end = new Date(courseData.registrationEndDate);
            if (end <= start) {
                errors.push('Registration end date must be after start date');
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