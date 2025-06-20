import { Request, Response } from 'express';
import { semesterService } from '../../services/academicService/term.service';
import ISemester, { ISemesterCreate } from '../../models/academic_related/semester';

export const semesterController = {
    // GET /api/academic/semesters
    getAllSemesters: async (req: Request, res: Response): Promise<void> => {
        try {
            const semesters = await semesterService.getAllSemesters();
            res.json({
                success: true,
                data: semesters,
                message: 'Semesters retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getAllSemesters:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },

    // GET /api/academic/semesters/:id
    getSemesterById: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const semester = await semesterService.getSemesterById(id);
              if (!semester) {
                res.status(404).json({
                    success: false,
                    message: 'Semester not found'
                });
                return;
            }

            res.json({
                success: true,
                data: semester,
                message: 'Semester retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getSemesterById:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },    // POST /api/academic/semesters
    createSemester: async (req: Request, res: Response): Promise<void> => {
        try {
            const semesterData: ISemesterCreate = req.body;
            
            // Basic validation
            if (!semesterData.semesterId || !semesterData.termNumber || !semesterData.startDate || 
                !semesterData.endDate || !semesterData.status || !semesterData.academicYear) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
                return;
            }

            const newSemester = await semesterService.createSemester(semesterData);
            res.status(201).json({
                success: true,
                data: newSemester,
                message: 'Semester created successfully'
            });
        } catch (error) {
            console.error('Error in createSemester:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },

    // PUT /api/academic/semesters/:id
    updateSemester: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const semesterData: ISemester = req.body;

            const updatedSemester = await semesterService.updateSemester(id, semesterData);
            res.json({
                success: true,
                data: updatedSemester,
                message: 'Semester updated successfully'
            });        } catch (error) {
            console.error('Error in updateSemester:', error);
            
            if (error instanceof Error && error.message === 'Semester not found') {
                res.status(404).json({
                    success: false,
                    message: 'Semester not found'
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },

    // DELETE /api/academic/semesters/:id
    deleteSemester: async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await semesterService.deleteSemester(id);
            
            res.json({
                success: true,
                message: 'Semester deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteSemester:', error);
              if (error instanceof Error && error.message === 'Semester not found') {
                res.status(404).json({
                    success: false,
                    message: 'Semester not found'
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },

    // GET /api/academic/semesters/search?q=searchTerm
    searchSemesters: async (req: Request, res: Response): Promise<void> => {
        try {
            const { q } = req.query;
              if (!q || typeof q !== 'string') {
                res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
                return;
            }

            const semesters = await semesterService.searchSemesters(q);
            res.json({
                success: true,
                data: semesters,
                message: 'Search completed successfully'
            });
        } catch (error) {
            console.error('Error in searchSemesters:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },

    // GET /api/academic/semesters/year/:year
    getSemestersByYear: async (req: Request, res: Response): Promise<void> => {
        try {
            const { year } = req.params;
            const academicYear = parseInt(year);
              if (isNaN(academicYear)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid year parameter'
                });
                return;
            }

            const semesters = await semesterService.getSemestersByYear(academicYear);
            res.json({
                success: true,
                data: semesters,
                message: 'Semesters retrieved successfully'
            });
        } catch (error) {
            console.error('Error in getSemestersByYear:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};
