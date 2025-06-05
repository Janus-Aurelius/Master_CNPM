// src/controllers/courseController.ts
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
    }
};
