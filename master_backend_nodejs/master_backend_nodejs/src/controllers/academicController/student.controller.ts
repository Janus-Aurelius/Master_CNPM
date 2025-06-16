import { Request, Response } from 'express';
import { studentBusiness } from '../../business/academicBusiness/student.business';

export const studentController = {
    getStudents: async (req: Request, res: Response) => {
        try {
            const students = await studentBusiness.getStudents();
            res.json({
                success: true,
                data: students,
                message: 'Students fetched successfully'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to fetch students' 
            });
        }
    },

    createStudent: async (req: Request, res: Response) => {
        try {
            const student = await studentBusiness.createStudent(req.body);
            res.status(201).json({
                success: true,
                data: student,
                message: 'Student created successfully'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to create student' 
            });
        }
    },

    updateStudent: async (req: Request, res: Response) => {
        try {
            const student = await studentBusiness.updateStudent(req.params.id, req.body);
            res.json({
                success: true,
                data: student,
                message: 'Student updated successfully'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to update student' 
            });
        }
    },

    deleteStudent: async (req: Request, res: Response) => {
        try {
            await studentBusiness.deleteStudent(req.params.id);
            res.json({
                success: true,
                data: null,
                message: 'Student deleted successfully'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to delete student' 
            });
        }
    },

    searchStudents: async (req: Request, res: Response) => {
        try {
            const students = await studentBusiness.searchStudents(req.query.query as string);
            res.json({
                success: true,
                data: students,
                message: 'Students searched successfully'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to search students' 
            });
        }
    }
};