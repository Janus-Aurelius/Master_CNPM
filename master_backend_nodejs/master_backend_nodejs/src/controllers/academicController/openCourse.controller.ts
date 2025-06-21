import { Request, Response } from 'express';
import { OpenCourseService } from '../../services/courseService/openCourse.service';
import { DatabaseError } from '../../utils/errors/database.error';
import { ValidationError } from '../../utils/errors/validation.error';

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
                res.status(500).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
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
    }    static async createCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseData = req.body;
            console.log('Creating course with data:', courseData);
            
            const course = await OpenCourseService.createCourse(courseData);
            res.status(201).json({ success: true, data: course });
        } catch (error: any) {
            console.error('Error in createCourse:', error);
            console.error('Error type:', typeof error);
            console.error('Error constructor name:', error?.constructor?.name);
            console.error('Error message:', error?.message);
            
            if (error instanceof ValidationError) {
                res.status(400).json({ success: false, message: error.message });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ success: false, message: error.message });
            } else if (error instanceof Error) {
                // Handle database constraint errors
                if (error.message.includes('duplicate key value violates unique constraint')) {
                    res.status(400).json({ success: false, message: 'Môn học này đã được mở trong học kỳ này' });
                } else if (error.message.includes('violates foreign key constraint')) {
                    if (error.message.includes('mamonhoc')) {
                        res.status(400).json({ success: false, message: 'Mã môn học không tồn tại trong hệ thống' });
                    } else if (error.message.includes('mahocky')) {
                        res.status(400).json({ success: false, message: 'Mã học kỳ không tồn tại trong hệ thống' });
                    } else {
                        res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
                    }
                } else {
                    res.status(400).json({ success: false, message: error.message });
                }
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }    static async updateCourse(req: Request, res: Response): Promise<void> {
        try {
            const { semesterId, courseId } = req.params;
            const courseData = req.body;
            console.log('Updating course with data:', courseData);
            
            if (!semesterId || !courseId) {
                res.status(400).json({ success: false, message: 'Thiếu mã học kỳ hoặc mã môn học' });
                return;
            }

            const course = await OpenCourseService.updateCourse(semesterId, courseId, courseData);
            res.json({ success: true, data: course });
        } catch (error: any) {
            console.error('Error in updateCourse:', error);
            console.error('Error type:', typeof error);
            console.error('Error constructor name:', error?.constructor?.name);
            console.error('Error message:', error?.message);
            
            if (error instanceof ValidationError) {
                res.status(400).json({ success: false, message: error.message });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ success: false, message: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ success: false, message: error.message });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    }    static async deleteCourse(req: Request, res: Response): Promise<void> {
        try {
            const { semesterId, courseId } = req.params;
            
            if (!semesterId || !courseId) {
                res.status(400).json({ success: false, message: 'Thiếu mã học kỳ hoặc mã môn học' });
                return;
            }

            await OpenCourseService.deleteCourse(semesterId, courseId);
            res.status(200).json({ success: true, message: 'Xóa môn học thành công' });
        } catch (error: any) {
            console.error('Error in deleteCourse:', error);
            console.error('Error type:', typeof error);
            console.error('Error constructor name:', error?.constructor?.name);
            console.error('Error message:', error?.message);
            
            if (error instanceof ValidationError) {
                res.status(400).json({ success: false, message: error.message });
            } else if (error instanceof DatabaseError) {
                res.status(500).json({ success: false, message: error.message });
            } else if (error instanceof Error) {
                if (error.message.includes('violates foreign key constraint')) {
                    res.status(400).json({ success: false, message: 'Không thể xóa môn học này vì đã có sinh viên đăng ký' });
                } else {
                    res.status(400).json({ success: false, message: error.message });
                }
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
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
