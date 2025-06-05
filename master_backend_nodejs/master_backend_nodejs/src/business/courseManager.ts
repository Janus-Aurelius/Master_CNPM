// src/business/courseManager.ts
import Course from "../models/academic_related/course";
import * as courseService from "../services/courseService";

export const validateAndAddCourse = async (course: Course): Promise<Course> => {
    if (course.credits <= 0) {
        throw new Error("Course credits must be positive");
    }
    return courseService.addCourse(course);
};

export const listCourses = async (): Promise<Course[]> => {
    return courseService.getCourses();
};
