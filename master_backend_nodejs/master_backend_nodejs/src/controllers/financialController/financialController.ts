// src/controllers/financialController/financialController.ts
import { Request, Response } from 'express';
import * as financialBusiness from '../../business/financialBusiness/financialManager';
import { FinancialManager } from '../../business/financialBusiness/financialManager';
import { IPaymentData, IPaymentValidation, IPaymentAudit, ITuitionCalculation, ITuitionSetting } from '../../models/student_related/studentPaymentInterface';

const financialController = {
    // Dashboard
    async getDashboard(req: Request, res: Response): Promise<void> {
        try {
            const dashboardData = await financialBusiness.getDashboardData();
            res.status(200).json(dashboardData);
        } catch (error) {
            console.error('Error getting dashboard data:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Payment Status Management
    async getAllPaymentStatus(req: Request, res: Response): Promise<void> {
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
    },

    async getStudentPaymentStatus(req: Request, res: Response): Promise<void> {
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
    },

    async updatePaymentStatus(req: Request, res: Response): Promise<void> {
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

            const paymentData: IPaymentData = {
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
    },

    // Tuition Management
    async getTuitionSettings(req: Request, res: Response): Promise<void> {
        try {
            const { semester } = req.query;
            const tuitionSettings = await financialBusiness.getTuitionSettings(semester as string);
            res.status(200).json(tuitionSettings);
        } catch (error) {
            console.error('Error getting tuition settings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async createTuitionSetting(req: Request, res: Response): Promise<void> {
        try {
            const { semester, settings } = req.body;
            const result = await financialBusiness.updateTuitionSettings(semester, settings);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating tuition setting:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async updateTuitionSetting(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { settings } = req.body;
            const result = await financialBusiness.updateTuitionSettings(id, settings);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error updating tuition setting:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteTuitionSetting(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await financialBusiness.deleteTuitionSetting(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting tuition setting:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Payment Receipts
    async getAllReceipts(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, semester } = req.query;
            const receipts = await financialBusiness.getAllReceipts(studentId as string, semester as string);
            res.status(200).json(receipts);
        } catch (error) {
            console.error('Error getting receipts:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getReceiptById(req: Request, res: Response): Promise<void> {
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
    },

    async createReceipt(req: Request, res: Response): Promise<void> {
        try {
            const receiptData = req.body;
            const receipt = await financialBusiness.createReceipt(receiptData);
            res.status(201).json(receipt);
        } catch (error) {
            console.error('Error creating receipt:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Payment Audit
    async getAuditLogs(req: Request, res: Response): Promise<void> {
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
    },

    async getStudentAuditLogs(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params;
            const { semester } = req.query;
            const logs = await financialBusiness.getPaymentAuditTrail(studentId, semester as string);
            res.status(200).json(logs);
        } catch (error) {
            console.error('Error getting student audit logs:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Unpaid Tuition Report
    async getUnpaidTuitionReport(req: Request, res: Response): Promise<void> {
        try {
            const { semester, year } = req.query;
            const financialService = await import('../../services/financialService/financialService');
            const report = await financialService.financialService.getUnpaidTuitionReport(String(semester), String(year));
            res.status(200).json({ success: true, data: report });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    }
};

export default financialController;