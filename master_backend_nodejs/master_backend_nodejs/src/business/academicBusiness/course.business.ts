// src/business/academicBusiness/course.business.ts
import Course from "../../models/academic_related/course";
import * as courseService from "../../services/courseService/courseService";

export const validateAndAddCourse = async (course: Course): Promise<Course> => {
    if (course.credits <= 0) {
        throw new Error("Course credits must be positive");
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
