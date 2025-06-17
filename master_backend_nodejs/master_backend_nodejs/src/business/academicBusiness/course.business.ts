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
    if (!courseData.maMonHoc || !courseData.tenMonHoc || !courseData.maLoaiMon || !courseData.soTiet) {
        throw new Error('Missing required fields');
    }
    // Check trùng mã môn học
    const existing = await courseService.getCourseById(courseData.maMonHoc);
    if (existing) {
        throw new Error('Mã môn học đã tồn tại');
    }
    return courseService.addCourse(courseData);
};

export const updateCourse = async (maMonHocCu: string, courseData: any): Promise<any> => {
    // Xóa bản ghi cũ
    await courseService.deleteCourse(maMonHocCu);
    // Thêm bản ghi mới
    return courseService.addCourse(courseData);
};

export const deleteCourse = async (maMonHoc: string): Promise<boolean> => {
    return courseService.deleteCourse(maMonHoc);
};
