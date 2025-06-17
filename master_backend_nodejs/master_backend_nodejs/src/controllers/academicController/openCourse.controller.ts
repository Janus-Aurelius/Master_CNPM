import { Request, Response } from 'express';
import { OpenCourseBusiness } from '../../business/academicBusiness/openCourse.business';
import { ValidationError } from '../../utils/errors/validation.error';
import { DatabaseError } from '../../utils/errors/database.error';
import { Logger } from '../../utils/logger';

export class OpenCourseController {
    static async getAllCourses(req: Request, res: Response): Promise<void> {
        try {
            const courses = await OpenCourseBusiness.getAllCourses();
            res.json(courses);
        } catch (error) {
            Logger.error('Error in getAllCourses:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async getCourseById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid course ID' });
                return;
            }

            const course = await OpenCourseBusiness.getCourseById(id);
            if (!course) {
                res.status(404).json({ error: 'Course not found' });
                return;
            }

            res.json(course);
        } catch (error) {
            Logger.error('Error in getCourseById:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async createCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseData = req.body;
            const course = await OpenCourseBusiness.createCourse(courseData);
            res.status(201).json(course);
        } catch (error) {
            Logger.error('Error in createCourse:', error);
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async updateCourse(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid course ID' });
                return;
            }

            const courseData = req.body;
            const course = await OpenCourseBusiness.updateCourse(id, courseData);
            res.json(course);
        } catch (error) {
            Logger.error('Error in updateCourse:', error);
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async deleteCourse(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid course ID' });
                return;
            }

            await OpenCourseBusiness.deleteCourse(id);
            res.status(204).send();
        } catch (error) {
            Logger.error('Error in deleteCourse:', error);
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async getCoursesByStatus(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.params;
            if (!status || !['open', 'closed', 'cancelled'].includes(status)) {
                res.status(400).json({ error: 'Invalid status' });
                return;            }

            // Status functionality has been removed, return all courses instead
            const courses = await OpenCourseBusiness.getAllCourses();
            res.json(courses);
        } catch (error) {
            Logger.error('Error in getCoursesByStatus:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async getCoursesBySemester(req: Request, res: Response): Promise<void> {
        try {
            const { semester, academicYear } = req.query;
            if (!semester || !academicYear) {
                res.status(400).json({ error: 'Semester and academic year are required' });
                return;
            }

            const courses = await OpenCourseBusiness.getCoursesBySemester(
                semester as string,
                academicYear as string
            );
            res.json(courses);
        } catch (error) {
            Logger.error('Error in getCoursesBySemester:', error);
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async updateCourseStatus(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ error: 'Invalid course ID' });
                return;
            }

            const { status } = req.body;
            if (!status || !['open', 'closed', 'cancelled'].includes(status)) {
                res.status(400).json({ error: 'Invalid status' });                return;
            }

            // For now, just return a simple response as status functionality is removed
            res.json({ message: 'Status update functionality has been removed' });
        } catch (error) {
            Logger.error('Error in updateCourseStatus:', error);
            if (error instanceof ValidationError) {
                res.status(400).json({ error: error.message });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
} 