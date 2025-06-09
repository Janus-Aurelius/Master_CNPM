// src/business/academicBusiness/course.business.ts
import Course from "../../models/academic_related/course";
import * as courseService from "../../services/courseService/courseService";
import { ValidationError } from "../../utils/errors/validation.error";

const validateCreditValue = (credits: number): boolean => {
    return Number.isInteger(credits) && credits > 0 && credits <= 6;
};

const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

const validateSchedule = (schedule: Course['schedule']): boolean => {
    if (!schedule) return false;
    
    const { day, session, fromTo, room } = schedule;
    if (!day || !session || !fromTo || !room) return false;
    
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    if (!validDays.includes(day)) return false;
    
    const [startTime, endTime] = fromTo.split('-').map(t => t.trim());
    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) return false;
    
    // Check if end time is after start time
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    if (end <= start) return false;
    
    return true;
};

export const validateAndAddCourse = async (course: Course): Promise<Course> => {
    const errors: string[] = [];

    if (!validateCreditValue(course.credits)) {
        errors.push('Course credits must be between 1 and 6');
    }

    if (!validateSchedule(course.schedule)) {
        errors.push('Invalid schedule format');
    }

    if (errors.length > 0) {
        throw new ValidationError(errors.join(', '));
    }

    return courseService.addCourse(course);
};

export const listCourses = async (): Promise<Course[]> => {
    return courseService.getCourses();
};

export const getCourseById = async (id: number): Promise<Course | null> => {
    const courses = await courseService.getCourses();
    return courses.find(course => course.id === id) || null;
};

export const createCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    const newCourse: Course = {
        ...courseData,
        id: Date.now() // Temporary ID generation
    };
    
    return validateAndAddCourse(newCourse);
};

export const updateCourse = async (id: number, courseData: Partial<Course>): Promise<Course | null> => {
    const existingCourse = await getCourseById(id);
    if (!existingCourse) {
        return null;
    }
    
    const updatedCourse: Course = {
        ...existingCourse,
        ...courseData,
        id // Keep original ID
    };
    
    if (updatedCourse.credits <= 0) {
        throw new Error("Course credits must be positive");
    }
    
    return updatedCourse;
};

export const deleteCourse = async (id: number): Promise<boolean> => {
    const course = await getCourseById(id);
    return course !== null;
};
