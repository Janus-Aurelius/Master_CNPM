// src/business/academicBusiness/course.business.ts
import ICourse from "../../models/academic_related/course";
import * as courseService from "../../services/courseService/courseService";
import { ValidationError } from "../../utils/errors/validation.error";

const validateTotalHours = (hours: number): boolean => {
    return Number.isInteger(hours) && hours > 0 && hours <= 60;
};

const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

const validateSchedule = (schedule: ICourse['schedule']): boolean => {
    if (!schedule) return false;
    
    const { day, session, fromTo, room } = schedule;
    if (!day || !session || !fromTo || !room) return false;
    
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    if (!validDays.includes(day)) return false;
    
    const [startTime, endTime] = fromTo.split('-').map((t: string) => t.trim());
    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) return false;
    
    // Check if end time is after start time
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end <= start) return false;
    
    return true;
};

export const validateAndAddCourse = async (course: ICourse): Promise<ICourse> => {
    const errors: string[] = [];

    if (!validateTotalHours(course.totalHours)) {
        errors.push('Course total hours must be between 1 and 60');
    }

    if (!validateSchedule(course.schedule)) {
        errors.push('Invalid schedule format');
    }

    if (errors.length > 0) {
        throw new ValidationError(errors.join(', '));
    }

    return courseService.addCourse(course);
};

export const listCourses = async (): Promise<ICourse[]> => {
    return courseService.getCourses();
};

export const getCourseById = async (subjectId: string): Promise<ICourse | null> => {
    const courses = await courseService.getCourses();
    return courses.find(course => course.subjectId === subjectId) || null;
};

export const createCourse = async (courseData: Omit<ICourse, 'subjectId'>): Promise<ICourse> => {
    const newCourse: ICourse = {
        ...courseData,
        subjectId: `SUB${Date.now()}` // Temporary ID generation
    };
    
    return validateAndAddCourse(newCourse);
};

export const updateCourse = async (subjectId: string, courseData: Partial<ICourse>): Promise<ICourse | null> => {
    const existingCourse = await getCourseById(subjectId);
    if (!existingCourse) {
        return null;
    }
    
    const updatedCourse: ICourse = {
        ...existingCourse,
        ...courseData,
        subjectId // Keep original ID
    };
    
    if (updatedCourse.totalHours <= 0) {
        throw new Error("Course total hours must be positive");
    }
    
    return updatedCourse;
};

export const deleteCourse = async (subjectId: string): Promise<boolean> => {
    const course = await getCourseById(subjectId);
    return course !== null;
};
