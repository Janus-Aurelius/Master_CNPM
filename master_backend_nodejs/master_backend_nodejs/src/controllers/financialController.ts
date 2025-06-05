import { Request, Response } from 'express';
import { financialService } from '../services/financialService';

const financialController = {
    async getUnpaidTuitionReport(req: Request, res: Response) {
        try {
            const { semester, year } = req.query;
            const report = await financialService.getUnpaidTuitionReport(String(semester), String(year));
            res.status(200).json({ success: true, data: report });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Internal server error' });
        }
    }
};

export default financialController; 