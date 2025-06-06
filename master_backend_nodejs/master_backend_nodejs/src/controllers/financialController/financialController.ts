// src/controllers/financialController/financialController.ts
import { Request, Response } from 'express';
import * as financialBusiness from '../../business/financialBusiness/financialManager';

// Dashboard
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const dashboardData = await financialBusiness.getDashboardData();
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Error getting dashboard data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Payment Status Management
export const getAllPaymentStatus = async (req: Request, res: Response): Promise<void> => {
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
};

export const getStudentPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params;
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
};

export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { studentId } = req.params;
        const { paymentStatus, amountPaid, semester } = req.body;
        
        const updated = await financialBusiness.updatePaymentStatus(
            studentId, 
            { 
                paymentStatus, 
                amountPaid, 
                semester 
            }
        );
        
        if (!updated) {
            res.status(404).json({ message: 'Payment record not found' });
            return;
        }
        
        res.status(200).json({ message: 'Payment status updated successfully' });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Tuition Adjustment
export const getTuitionSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { semester } = req.query;
        const tuitionSettings = await financialBusiness.getTuitionSettings(semester as string);
        
        res.status(200).json(tuitionSettings);
    } catch (error) {
        console.error('Error getting tuition settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateTuitionSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { semester, settings } = req.body;
        
        const updated = await financialBusiness.updateTuitionSettings(semester, settings);
        
        if (!updated) {
            res.status(404).json({ message: 'Tuition settings not found' });
            return;
        }
        
        res.status(200).json({ message: 'Tuition settings updated successfully' });
    } catch (error) {
        console.error('Error updating tuition settings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const financialController = {
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