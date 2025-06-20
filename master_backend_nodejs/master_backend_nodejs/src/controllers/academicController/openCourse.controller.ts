import { Request, Response } from 'express';
import { OpenCourseService } from '../../services/courseService/openCourse.service';
import { DatabaseError } from '../../utils/errors/database.error';

export class OpenCourseController {
    static async getAllCourses(req: Request, res: Response): Promise<void> {
        try {
            console.log('Getting all open courses...');
            const courses = await OpenCourseService.getAllCourses();
            console.log(`Found ${courses.length} open courses`);
            res.json(courses);
        } catch (error) {
            console.error('Error in getAllCourses:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async getCourseById(req: Request, res: Response): Promise<void> {
        try {
            const { semesterId, courseId } = req.params;
            
            if (!semesterId || !courseId) {
                res.status(400).json({ error: 'Missing semesterId or courseId' });
                return;
            }

            const course = await OpenCourseService.getCourseById(semesterId, courseId);
            if (!course) {
                res.status(404).json({ error: 'Course not found' });
                return;
            }

            res.json(course);
        } catch (error) {
            console.error('Error in getCourseById:', error);
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
            const course = await OpenCourseService.createCourse(courseData);
            res.status(201).json(course);
        } catch (error) {
            console.error('Error in createCourse:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async updateCourse(req: Request, res: Response): Promise<void> {
        try {
            const { semesterId, courseId } = req.params;
            const courseData = req.body;
            
            if (!semesterId || !courseId) {
                res.status(400).json({ error: 'Missing semesterId or courseId' });
                return;
            }

            const course = await OpenCourseService.updateCourse(0, { ...courseData, semesterId, courseId });
            res.json(course);
        } catch (error) {
            console.error('Error in updateCourse:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async deleteCourse(req: Request, res: Response): Promise<void> {
        try {
            const { semesterId, courseId } = req.params;
            
            if (!semesterId || !courseId) {
                res.status(400).json({ error: 'Missing semesterId or courseId' });
                return;
            }

            await OpenCourseService.deleteCourse(semesterId, courseId);
            res.status(204).send();
        } catch (error) {
            console.error('Error in deleteCourse:', error);
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
                res.status(400).json({ error: 'Missing semester or academicYear' });
                return;
            }

            const courses = await OpenCourseService.getCoursesBySemester(semester as string, academicYear as string);
            res.json(courses);
        } catch (error) {
            console.error('Error in getCoursesBySemester:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async updateCourseStatus(req: Request, res: Response): Promise<void> {
        try {
            const { semesterId, courseId } = req.params;
            const { status } = req.body;
            
            if (!semesterId || !courseId) {
                res.status(400).json({ error: 'Missing semesterId or courseId' });
                return;
            }

            // For now, just return the course as status update logic needs to be implemented
            const course = await OpenCourseService.getCourseById(semesterId, courseId);
            if (!course) {
                res.status(404).json({ error: 'Course not found' });
                return;
            }

            res.json(course);
        } catch (error) {
            console.error('Error in updateCourseStatus:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async getCoursesByStatus(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.params;
            
            // For now, return all courses as status filtering logic needs to be implemented
            const courses = await OpenCourseService.getAllCourses();
            res.json(courses);
        } catch (error) {
            console.error('Error in getCoursesByStatus:', error);
            if (error instanceof DatabaseError) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}
