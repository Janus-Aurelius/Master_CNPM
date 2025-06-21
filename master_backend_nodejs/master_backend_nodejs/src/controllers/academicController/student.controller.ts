import { Request, Response } from 'express';
import { studentBusiness } from '../../business/academicBusiness/student.business';
import { AcademicStructureService } from '../../services/academicService/academicStructure.service';
import { ValidationError } from '../../utils/errors/validation.error';
import { DatabaseError } from '../../utils/errors/database.error';

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
    },

    // Dropdown data endpoints for student forms
    getFaculties: async (req: Request, res: Response) => {
        try {
            const faculties = await AcademicStructureService.getAllFaculties();
            res.json({
                success: true,
                data: faculties,
                message: 'Faculties fetched successfully'
            });
        } catch (error) {
            console.error('Error getting faculties:', error);
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to fetch faculties' 
            });
        }
    },

    getMajors: async (req: Request, res: Response) => {
        try {
            const majors = await AcademicStructureService.getAllMajors();
            res.json({
                success: true,
                data: majors,
                message: 'Majors fetched successfully'
            });
        } catch (error) {
            console.error('Error getting majors:', error);
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to fetch majors' 
            });
        }
    },

    getMajorsByFaculty: async (req: Request, res: Response) => {
        try {
            const { facultyId } = req.params;
            if (!facultyId) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    error: 'Faculty ID is required'
                });
            }

            const majors = await AcademicStructureService.getMajorsByFaculty(facultyId);
            res.json({
                success: true,
                data: majors,
                message: 'Majors by faculty fetched successfully'
            });
        } catch (error) {
            console.error('Error getting majors by faculty:', error);
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to fetch majors by faculty' 
            });
        }
    },

    getProvinces: async (req: Request, res: Response) => {
        try {
            const provinces = await AcademicStructureService.getAllProvinces();
            res.json({
                success: true,
                data: provinces,
                message: 'Provinces fetched successfully'
            });
        } catch (error) {
            console.error('Error getting provinces:', error);
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to fetch provinces' 
            });
        }
    },

    getDistrictsByProvince: async (req: Request, res: Response) => {
        try {
            const { provinceId } = req.params;
            if (!provinceId) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    error: 'Province ID is required'
                });
            }

            const districts = await AcademicStructureService.getDistrictsByProvince(provinceId);
            res.json({
                success: true,
                data: districts,
                message: 'Districts fetched successfully'
            });
        } catch (error) {
            console.error('Error getting districts by province:', error);
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to fetch districts by province' 
            });
        }
    },

    getPriorityGroups: async (req: Request, res: Response) => {
        try {
            const priorityGroups = await AcademicStructureService.getAllPriorityGroups();
            res.json({
                success: true,
                data: priorityGroups,
                message: 'Priority groups fetched successfully'
            });
        } catch (error) {
            console.error('Error getting priority groups:', error);
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to fetch priority groups' 
            });
        }
    },

    // Helper endpoint for all student form data
    getStudentFormData: async (req: Request, res: Response) => {
        try {
            const [faculties, majors, provinces, districts, priorityGroups] = await Promise.all([
                AcademicStructureService.getAllFaculties(),
                AcademicStructureService.getAllMajors(),
                AcademicStructureService.getAllProvinces(),
                AcademicStructureService.getAllDistricts(),
                AcademicStructureService.getAllPriorityGroups()
            ]);

            res.json({
                success: true,
                data: {
                    faculties,
                    majors,
                    provinces,
                    districts,
                    priorityGroups
                },
                message: 'Student form data fetched successfully'
            });
        } catch (error) {
            console.error('Error getting student form data:', error);
            res.status(500).json({ 
                success: false,
                data: null,
                error: 'Failed to fetch student form data' 
            });
        }
    },
};