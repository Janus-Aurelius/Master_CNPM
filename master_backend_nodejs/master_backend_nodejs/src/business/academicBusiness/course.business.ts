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
