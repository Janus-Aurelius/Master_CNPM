// src/controllers/academicController/course.controller.ts
import { Request, Response, NextFunction } from "express";
import * as courseBusiness from "../../business/academicBusiness/course.business";
import { AppError } from '../../middleware/errorHandler';

export const getCoursesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await courseBusiness.listCourses();
        res.json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

export const getCourseByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course = await courseBusiness.getCourseById(id);
        
        if (!course) {
            throw new AppError(404, 'Course not found');
        }

        res.json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

export const createCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseData = req.body;
        const newCourse = await courseBusiness.createCourse(courseData);
        res.status(201).json({ success: true, data: newCourse });
    } catch (error) {
        next(error);
    }
};

export const updateCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const courseData = req.body;
        const updatedCourse = await courseBusiness.updateCourse(id, courseData);
        
        if (!updatedCourse) {
            throw new AppError(404, 'Course not found');
        }

        res.json({ success: true, data: updatedCourse });
    } catch (error) {
        next(error);
    }
};

export const deleteCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const success = await courseBusiness.deleteCourse(id);
        
        if (!success) {
            throw new AppError(404, 'Course not found');
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
