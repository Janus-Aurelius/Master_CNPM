// src/controllers/financialController/financialController.ts
import { Request, Response } from 'express';
import { priorityObjectService, courseTypeService } from '../../services/financialService/financialConfigService';
import { IPriorityObject, ICourseTypeManagement } from '../../models/student_related/studentPaymentInterface';
// Import individual functions from financialManager
import * as financialBusiness from '../../business/financialBusiness/financialManager';

interface IFinancialController {
    // Priority Object Management
    getAllPriorityObjects(req: Request, res: Response): Promise<void>;
    getPriorityObjectById(req: Request, res: Response): Promise<void>;
    createPriorityObject(req: Request, res: Response): Promise<void>;
    updatePriorityObject(req: Request, res: Response): Promise<void>;
    deletePriorityObject(req: Request, res: Response): Promise<void>;
    
    // Course Type Management
    getAllCourseTypes(req: Request, res: Response): Promise<void>;
    getCourseTypeById(req: Request, res: Response): Promise<void>;
    createCourseType(req: Request, res: Response): Promise<void>;
    updateCourseType(req: Request, res: Response): Promise<void>;
    deleteCourseType(req: Request, res: Response): Promise<void>;
    getCoursesUsingType(req: Request, res: Response): Promise<void>;
    
    // Dashboard & Overview
    getDashboard(req: Request, res: Response): Promise<void>;
    
    // Payment Status Management
    getAllPaymentStatus(req: Request, res: Response): Promise<void>;
    getStudentPaymentStatus(req: Request, res: Response): Promise<void>;
    updatePaymentStatus(req: Request, res: Response): Promise<void>;
    
    // Tuition Management
    getTuitionSettings(req: Request, res: Response): Promise<void>;
    createTuitionSetting(req: Request, res: Response): Promise<void>;
    updateTuitionSetting(req: Request, res: Response): Promise<void>;
    deleteTuitionSetting(req: Request, res: Response): Promise<void>;
    
    // Payment Receipts
    getAllReceipts(req: Request, res: Response): Promise<void>;
    getReceiptById(req: Request, res: Response): Promise<void>;
    createReceipt(req: Request, res: Response): Promise<void>;
    
    // Payment Audit
    getAuditLogs(req: Request, res: Response): Promise<void>;
    getStudentAuditLogs(req: Request, res: Response): Promise<void>;
    
    // Reports
    getUnpaidTuitionReport(req: Request, res: Response): Promise<void>;
}

class FinancialController implements IFinancialController {
    
    // === PRIORITY OBJECT MANAGEMENT ===
    
    public async getAllPriorityObjects(req: Request, res: Response): Promise<void> {
        try {
            const priorityObjects = await priorityObjectService.getAllPriorityObjects();
            res.status(200).json({
                success: true,
                data: priorityObjects
            });
        } catch (error: any) {
            console.error('Error getting priority objects:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async getPriorityObjectById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const priorityObject = await priorityObjectService.getPriorityObjectById(id);
            
            if (!priorityObject) {
                res.status(404).json({
                    success: false,
                    message: 'Priority object not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: priorityObject
            });
        } catch (error: any) {
            console.error('Error getting priority object:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async createPriorityObject(req: Request, res: Response): Promise<void> {
        try {
            const { priorityName, discountAmount } = req.body;

            if (!priorityName || discountAmount === undefined) {
                res.status(400).json({
                    success: false,
                    message: 'Priority name and discount amount are required'
                });
                return;
            }

            const newPriorityObject = await priorityObjectService.createPriorityObject({
                priorityName,
                discountAmount: parseFloat(discountAmount)
            });

            res.status(201).json({
                success: true,
                data: newPriorityObject,
                message: 'Priority object created successfully'
            });
        } catch (error: any) {
            console.error('Error creating priority object:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async updatePriorityObject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { priorityName, discountAmount } = req.body;

            const updateData: Partial<Omit<IPriorityObject, 'priorityId'>> = {};
            
            if (priorityName !== undefined) updateData.priorityName = priorityName;
            if (discountAmount !== undefined) updateData.discountAmount = parseFloat(discountAmount);

            const updatedPriorityObject = await priorityObjectService.updatePriorityObject(id, updateData);

            if (!updatedPriorityObject) {
                res.status(404).json({
                    success: false,
                    message: 'Priority object not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedPriorityObject,
                message: 'Priority object updated successfully'
            });
        } catch (error: any) {
            console.error('Error updating priority object:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async deletePriorityObject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const deleted = await priorityObjectService.deletePriorityObject(id);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Priority object not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Priority object deleted successfully'
            });
        } catch (error: any) {
            console.error('Error deleting priority object:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    // === COURSE TYPE MANAGEMENT ===

    public async getAllCourseTypes(req: Request, res: Response): Promise<void> {
        try {
            const courseTypes = await courseTypeService.getAllCourseTypes();
            res.status(200).json({
                success: true,
                data: courseTypes
            });
        } catch (error: any) {
            console.error('Error getting course types:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async getCourseTypeById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const courseType = await courseTypeService.getCourseTypeById(id);
            
            if (!courseType) {
                res.status(404).json({
                    success: false,
                    message: 'Course type not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: courseType
            });
        } catch (error: any) {
            console.error('Error getting course type:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async createCourseType(req: Request, res: Response): Promise<void> {
        try {
            const { courseTypeName, hoursPerCredit, pricePerCredit } = req.body;

            if (!courseTypeName || !hoursPerCredit || !pricePerCredit) {
                res.status(400).json({
                    success: false,
                    message: 'Course type name, hours per credit, and price per credit are required'
                });
                return;
            }

            const newCourseType = await courseTypeService.createCourseType({
                courseTypeName,
                hoursPerCredit: parseInt(hoursPerCredit),
                pricePerCredit: parseFloat(pricePerCredit)
            });

            res.status(201).json({
                success: true,
                data: newCourseType,
                message: 'Course type created successfully'
            });
        } catch (error: any) {
            console.error('Error creating course type:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async updateCourseType(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { courseTypeName, hoursPerCredit, pricePerCredit } = req.body;

            const updateData: Partial<Omit<ICourseTypeManagement, 'courseTypeId'>> = {};
            
            if (courseTypeName !== undefined) updateData.courseTypeName = courseTypeName;
            if (hoursPerCredit !== undefined) updateData.hoursPerCredit = parseInt(hoursPerCredit);
            if (pricePerCredit !== undefined) updateData.pricePerCredit = parseFloat(pricePerCredit);

            const updatedCourseType = await courseTypeService.updateCourseType(id, updateData);

            if (!updatedCourseType) {
                res.status(404).json({
                    success: false,
                    message: 'Course type not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedCourseType,
                message: 'Course type updated successfully'
            });
        } catch (error: any) {
            console.error('Error updating course type:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async deleteCourseType(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const deleted = await courseTypeService.deleteCourseType(id);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Course type not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Course type deleted successfully'
            });
        } catch (error: any) {
            console.error('Error deleting course type:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    public async getCoursesUsingType(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const courses = await courseTypeService.getCoursesUsingType(id);

            res.status(200).json({
                success: true,
                data: courses
            });
        } catch (error: any) {
            console.error('Error getting courses using type:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    // === DASHBOARD & OVERVIEW ===

    public async getDashboard(req: Request, res: Response): Promise<void> {
        try {
            const dashboardData = await financialBusiness.getDashboardData();
            res.status(200).json(dashboardData);
        } catch (error) {
            console.error('Error getting dashboard data:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // === PAYMENT STATUS MANAGEMENT ===

    public async getAllPaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            const { semester, faculty, course } = req.query;
            
            const paymentStatusData = await financialBusiness.getAllPaymentStatus({
                semester: semester as string,
                faculty: faculty as string,
                course: course as string
            });
            
            res.status(200).json(paymentStatusData);
        } catch (error) {
            console.error('Error getting payment status data:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async getStudentPaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            let studentId: string | undefined = undefined;
            if (req.user?.role === 'student') {
                studentId = req.user.studentId;
            } else {
                studentId = req.params.studentId;
            }
            if (!studentId) {
                res.status(400).json({ message: 'Missing studentId' });
                return;
            }
            const paymentStatus = await financialBusiness.getStudentPaymentStatus(studentId);
            if (!paymentStatus) {
                res.status(404).json({ message: 'Student payment information not found' });
                return;
            }
            res.status(200).json(paymentStatus);
        } catch (error) {
            console.error('Error getting student payment status:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async updatePaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            let studentId: string | undefined = undefined;
            if (req.user?.role === 'student') {
                studentId = req.user.studentId;
            } else {
                studentId = req.params.studentId;
            }
            if (!studentId) {
                res.status(400).json({ message: 'Missing studentId' });
                return;
            }
            
            // TODO: Update this to use new interfaces
            const paymentData: any = {
                studentId,
                amount: req.body.amount,
                paymentMethod: req.body.paymentMethod,
                receiptNumber: req.body.receiptNumber,
                paymentDate: new Date(req.body.paymentDate),
                notes: req.body.notes,
                semester: req.body.semester,
                status: req.body.status
            };

            const updated = await financialBusiness.updatePaymentStatus(studentId, paymentData);
            if (!updated) {
                res.status(404).json({ message: 'Payment record not found' });
                return;
            }
            res.status(200).json({ message: 'Payment status updated successfully', data: updated });
        } catch (error) {
            console.error('Error updating payment status:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // === TUITION MANAGEMENT ===

    public async getTuitionSettings(req: Request, res: Response): Promise<void> {
        try {
            const { semester } = req.query;
            const tuitionSettings = await financialBusiness.getTuitionSettings(semester as string);
            res.status(200).json(tuitionSettings);
        } catch (error) {
            console.error('Error getting tuition settings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async createTuitionSetting(req: Request, res: Response): Promise<void> {
        try {
            const { semester, settings } = req.body;
            const result = await financialBusiness.updateTuitionSettings(semester, settings);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating tuition setting:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async updateTuitionSetting(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { settings } = req.body;
            const result = await financialBusiness.updateTuitionSettings(id, settings);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error updating tuition setting:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async deleteTuitionSetting(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await financialBusiness.deleteTuitionSetting(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting tuition setting:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // === PAYMENT RECEIPTS ===

    public async getAllReceipts(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, semester } = req.query;
            const receipts = await financialBusiness.getAllReceipts(studentId as string, semester as string);
            res.status(200).json(receipts);
        } catch (error) {
            console.error('Error getting receipts:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async getReceiptById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const receipt = await financialBusiness.getReceiptById(id);
            if (!receipt) {
                res.status(404).json({ message: 'Receipt not found' });
                return;
            }
            res.status(200).json(receipt);
        } catch (error) {
            console.error('Error getting receipt:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async createReceipt(req: Request, res: Response): Promise<void> {
        try {
            const receiptData = req.body;
            const receipt = await financialBusiness.createReceipt(receiptData);
            res.status(201).json(receipt);
        } catch (error) {
            console.error('Error creating receipt:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // === PAYMENT AUDIT ===

    public async getAuditLogs(req: Request, res: Response): Promise<void> {
        try {
            const { startDate, endDate } = req.query;
            const logs = await financialBusiness.getPaymentAuditTrail(
                startDate as string,
                endDate as string
            );
            res.status(200).json(logs);
        } catch (error) {
            console.error('Error getting audit logs:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    public async getStudentAuditLogs(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params;
            const { semester } = req.query;
            const logs = await financialBusiness.getPaymentAuditTrail(studentId, semester as string);
            res.status(200).json(logs);
        } catch (error) {
            console.error('Error getting student audit logs:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // === REPORTS ===

    public async getUnpaidTuitionReport(req: Request, res: Response): Promise<void> {
        try {
            const { semester, year } = req.query;
            const financialService = await import('../../services/financialService/financialService');
            const report = await financialService.financialService.getUnpaidTuitionReport(String(semester), String(year));
            res.status(200).json({ success: true, data: report });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    }
}

export default new FinancialController();
