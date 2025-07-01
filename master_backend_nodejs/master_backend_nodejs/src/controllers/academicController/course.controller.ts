// src/controllers/academicController/course.controller.ts
import { Request, Response, NextFunction } from "express";
import * as courseBusiness from "../../business/academicBusiness/course.business";
import { AcademicStructureService } from '../../services/academicService/academicStructure.service';
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
        res.status(201).json({ success: true, data: newCourse });    } catch (error: any) {
        console.error('Error in createCourseHandler:', error);
        console.error('Error type:', typeof error);
        console.error('Error constructor name:', error?.constructor?.name);
        console.error('Error message:', error?.message);
        console.error('Error code:', error?.code);
        
        if (error.message && error.message.includes('Mã môn học đã tồn tại')) {
            res.status(400).json({ success: false, message: error.message });
        } else if (error.message === 'Mã môn học đã tồn tại') {
            res.status(400).json({ success: false, message: 'Mã môn học đã tồn tại' });
        } else if (error.code === '23503' && error.constraint === 'monhoc_maloaimon_fkey') {
            res.status(400).json({ 
                success: false, 
                message: 'Mã loại môn không hợp lệ. Vui lòng kiểm tra lại.' 
            });
        } else if (error.code === '23503') {
            // Các lỗi foreign key khác
            res.status(400).json({ 
                success: false, 
                message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.' 
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: error.message || 'Failed to create course' 
            });
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
        console.error('Error in updateCourseHandler:', error);
        
        // Xử lý lỗi foreign key constraint cho mã loại môn
        if (error.code === '23503' && error.constraint === 'monhoc_maloaimon_fkey') {
            res.status(400).json({ 
                success: false, 
                message: 'Mã loại môn không hợp lệ. Vui lòng kiểm tra lại.' 
            });
        } else if (error.code === '23503') {
            // Các lỗi foreign key khác
            res.status(400).json({ 
                success: false, 
                message: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào.' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Failed to update course' 
            });
        }
    }
};

export const deleteCourseHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        console.log('DELETE request received for course ID:', id);
        
        const success = await courseBusiness.deleteCourse(id);
        if (!success) {
            console.log('Course not found:', id);
            res.status(404).json({ success: false, message: 'Course not found' });
            return;
        }
        
        console.log('Course deleted successfully:', id);
        res.json({ 
            success: true, 
            message: 'Môn học và các dữ liệu liên quan đã được xóa thành công' 
        });    } catch (error: any) {
        console.error('Error in deleteCourseHandler:', error);
        console.error('Error code:', error.code);
        console.error('Error constraint:', error.constraint);
        console.error('Error detail:', error.detail);
        
        // Xử lý lỗi foreign key constraint
        if (error.code === '23503' && error.constraint === 'chuongtrinhhoc_mamonhoc_fkey') {
            res.status(400).json({ 
                success: false, 
                message: 'Môn này đang tồn tại trong một chương trình học' 
            });
        } else if (error.code === '23503') {
            res.status(400).json({ 
                success: false, 
                message: 'Không thể xóa môn học vì có dữ liệu liên quan trong hệ thống' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Failed to delete course' 
            });
        }
    }
};

// Course Type management for course forms
export const getCourseTypesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courseTypes = await AcademicStructureService.getAllCourseTypes();
        res.json({ success: true, data: courseTypes });
    } catch (error) {
        console.error('Error getting course types:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch course types' });
    }
};

export const getCourseFormData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courseTypes = await AcademicStructureService.getAllCourseTypes();
        res.json({ 
            success: true, 
            data: { courseTypes },
            message: 'Course form data fetched successfully'
        });
    } catch (error) {
        console.error('Error getting course form data:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch course form data' });
    }
};

export const getCourseTypesOnly = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Lấy danh sách loại môn từ database
        const { DatabaseService } = require('../../services/database/databaseService');
        const courseTypes = await DatabaseService.query(`
            SELECT MaLoaiMon as "id", TenLoaiMon as "name", SoTietMotTC as "hoursPerCredit"
            FROM LOAIMON 
            ORDER BY MaLoaiMon
        `);
        res.json({ 
            success: true, 
            data: courseTypes,
            message: 'Course types fetched successfully'
        });
    } catch (error) {
        console.error('Error getting course types:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch course types' });
    }
};
