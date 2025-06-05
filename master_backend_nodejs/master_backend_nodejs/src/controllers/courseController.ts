// src/controllers/courseController.ts
<<<<<<< HEAD
import { Request, Response } from "express";
import * as courseManager from "../business/courseManager";

export const getCoursesHandler = async (req: Request, res: Response) => {
    try {
        const courses = await courseManager.listCourses();
        res.json(courses);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const addCourseHandler = async (req: Request, res: Response) => {
    try {
        const newCourse = req.body;
        const addedCourse = await courseManager.validateAndAddCourse(newCourse);
        res.status(201).json(addedCourse);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
=======
import { Request, Response, NextFunction } from "express";
import * as courseManager from "../business/courseManager";
import { AppError } from '../middleware/errorHandler';

export const getCoursesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await courseManager.listCourses();
        res.json(courses);
    } catch (error) {
        next(error);
    }
};

export const getCourseByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const course = await courseManager.getCourseById(parseInt(id));
        
        if (!course) {
            throw new AppError(404, 'Course not found');
        }

        res.json(course);
    } catch (error) {
        next(error);
    }
};

export const createCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courseData = req.body;
        const newCourse = await courseManager.createCourse(courseData);
        res.status(201).json(newCourse);
    } catch (error) {
        next(error);
    }
};

export const updateCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const courseData = req.body;
        const updatedCourse = await courseManager.updateCourse(parseInt(id), courseData);
        
        if (!updatedCourse) {
            throw new AppError(404, 'Course not found');
        }

        res.json(updatedCourse);
    } catch (error) {
        next(error);
    }
};

export const deleteCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const success = await courseManager.deleteCourse(parseInt(id));
        
        if (!success) {
            throw new AppError(404, 'Course not found');
        }

        res.status(204).send();
    } catch (error) {
        next(error);
>>>>>>> origin/Trong
    }
};
