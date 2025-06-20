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

export const validateAndAddCourse = async (course: ICourse): Promise<ICourse> => {
    const errors: string[] = [];

    // Validate required fields
    if (!course.courseId || course.courseId.trim() === '') {
        errors.push('Course ID is required');
    }

    if (!course.courseName || course.courseName.trim() === '') {
        errors.push('Course name is required');
    }

    if (!course.courseTypeId || course.courseTypeId.trim() === '') {
        errors.push('Course type ID is required');
    }

    if (!validateTotalHours(course.totalHours)) {
        errors.push('Course total hours must be between 1 and 60');
    }

    if (errors.length > 0) {
        throw new ValidationError(errors.join(', '));
    }

    return courseService.addCourse(course);
};

export const listCourses = async (): Promise<any[]> => {
    return courseService.getCourses();
};

export const getCourseById = async (maMonHoc: string): Promise<any | null> => {
    return courseService.getCourseById(maMonHoc);
};

export const createCourse = async (courseData: any): Promise<any> => {
    // Validate các trường cần thiết
    if (!courseData.courseId || !courseData.courseName || !courseData.courseTypeId || !courseData.totalHours) {
        throw new Error('Missing required fields');
    }
    // Check trùng mã môn học
    const existing = await courseService.getCourseById(courseData.courseId);
    if (existing) {
        throw new Error('Mã môn học đã tồn tại');
    }
    return courseService.addCourse(courseData);
};

export const updateCourse = async (maMonHocCu: string, courseData: any): Promise<any> => {
    return courseService.updateCourse(maMonHocCu, courseData);
};

export const deleteCourse = async (maMonHoc: string): Promise<boolean> => {
    console.log('Business layer - deleteCourse called with ID:', maMonHoc);
    
    // Kiểm tra xem môn học có tồn tại không
    const existingCourse = await courseService.getCourseById(maMonHoc);
    console.log('Existing course found:', existingCourse);
    
    if (!existingCourse) {
        console.log('Course not found in database:', maMonHoc);
        throw new Error('Môn học không tồn tại');
    }
    
    // Thực hiện xóa (sẽ xóa cascade các bản ghi liên quan)
    const result = await courseService.deleteCourse(maMonHoc);
    console.log('Delete result:', result);
    return result;
};
