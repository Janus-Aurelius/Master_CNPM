import { Request, Response } from 'express';
import { SubjectBusiness } from '../../business/academicBusiness/subject.business';
import { ISubject } from '../../models/academic_related/subject';

export class SubjectController {
    static async getAllSubjects(req: Request, res: Response) {
        try {
            const subjects = await SubjectBusiness.getAllSubjects();
            res.status(200).json({ success: true, data: subjects });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching subjects', error });
        }
    }

    static async getSubjectById(req: Request, res: Response) {
        try {
            const { subjectId } = req.params;
            const subject = await SubjectBusiness.getSubjectById(subjectId);
            if (!subject) {
                return res.status(404).json({ success: false, message: 'Subject not found' });
            }
            res.status(200).json({ success: true, data: subject });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error fetching subject', error });
        }
    }

    static async createSubject(req: Request, res: Response) {
        try {
            const subjectData = req.body as Omit<ISubject, 'subjectId'>;
            
            // Validate data
            const errors = SubjectBusiness.validateSubjectData(subjectData);
            if (errors.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Validation failed',
                    errors 
                });
            }

            // Check for conflicts
            const conflicts = await SubjectBusiness.checkScheduleConflicts(subjectData);
            if (conflicts.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Schedule conflicts found',
                    conflicts
                });
            }

            const newSubject = await SubjectBusiness.createSubject(subjectData);
            res.status(201).json({ success: true, data: newSubject });
        } catch (error) {
            console.error('Error creating subject:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error creating subject',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    static async updateSubject(req: Request, res: Response) {
        try {
            const { subjectId } = req.params;
            const subjectData = req.body as Partial<ISubject>;
            const updatedSubject = await SubjectBusiness.updateSubject(subjectId, subjectData);
            res.status(200).json({ success: true, data: updatedSubject });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error updating subject', error });
        }
    }

    static async deleteSubject(req: Request, res: Response) {
        try {
            const { subjectId } = req.params;
            await SubjectBusiness.deleteSubject(subjectId);
            res.status(200).json({ success: true, message: 'Subject deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error deleting subject', error });
        }
    }
}