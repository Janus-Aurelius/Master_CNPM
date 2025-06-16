// src/controllers/academicController/course.controller.ts
import { Request, Response, NextFunction } from "express";
import * as courseBusiness from "../../business/academicBusiness/course.business";
import { AppError } from '../../middleware/errorHandler';

export const getCoursesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await courseBusiness.listCourses();
        res.json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const getCourseByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const course = await courseBusiness.getCourseById(id);
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        res.json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const createCourseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courseData = req.body;
        const newCourse = await courseBusiness.createCourse(courseData);
        res.status(201).json({ success: true, data: newCourse });
    } catch (error: any) {
        if (error.message && error.message.includes('Mã môn học đã tồn tại')) {
            res.status(400).json({ success: false, message: error.message });
        } else {
            res.status(400).json({ success: false, message: error.message || 'Failed to create course' });
        }
    }
};

export const updateCourseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const courseData = req.body;
        const updatedCourse = await courseBusiness.updateCourse(id, courseData);
        if (!updatedCourse) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        res.json({ success: true, data: updatedCourse });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || 'Failed to update course' });
    }
};

export const deleteCourseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const success = await courseBusiness.deleteCourse(id);
        if (!success) {
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete course' });
    }
};
