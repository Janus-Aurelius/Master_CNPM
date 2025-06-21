// src/controllers/financialController/paymentController.ts
import { Request, Response } from 'express';
import { FinancialPaymentBusiness } from '../../business/financialBusiness/paymentBusiness';
import { IPaymentData } from '../../models/student_related/studentPaymentInterface';

export class FinancialPaymentController {
    private paymentBusiness: FinancialPaymentBusiness;

    constructor() {
        this.paymentBusiness = new FinancialPaymentBusiness();
    }    /**
     * GET /api/financial/payment/status
     * Get payment status list for a semester
     */    async getPaymentStatusList(req: Request, res: Response) {
        try {
            const { semesterId, paymentStatus, studentId, page, limit } = req.query;

            console.log('[getPaymentStatusList] req.user:', req.user);
            console.log('[getPaymentStatusList] req.query before processing:', req.query);
            
            if (!semesterId) {
                return res.status(400).json({
                    success: false,
                    message: 'Semester ID is required'
                });
            }

            // For financial staff, ignore studentId filter to show all students
            // Only use studentId filter if explicitly passed and user is not financial staff
            let finalStudentId: string | undefined = undefined;
            
            if (req.user?.role === 'financial') {
                // Financial staff should see all students, ignore auto-injected studentId
                console.log('[getPaymentStatusList] Financial staff detected, ignoring studentId filter');
                finalStudentId = undefined;
            } else if (studentId && typeof studentId === 'string') {
                // For other roles, use studentId if provided
                finalStudentId = studentId;
            }

            const filters = {
                paymentStatus: paymentStatus as 'paid' | 'unpaid' | 'not_opened',
                studentId: finalStudentId,
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 50
            };

            console.log('[getPaymentStatusList] Final filters after role check:', filters);

            const result = await this.paymentBusiness.getPaymentStatusList(
                semesterId as string,
                filters
            );

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: result.pagination
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }

    /**
     * GET /api/financial/payment/history/:studentId
     * Get payment history for a specific student
     */
    async getStudentPaymentHistory(req: Request, res: Response) {
        try {
            const { studentId } = req.params;
            const { semesterId } = req.query;

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Student ID is required'
                });
            }

            const result = await this.paymentBusiness.getStudentPaymentHistory(
                studentId,
                semesterId as string
            );

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }

    /**
     * POST /api/financial/payment/confirm
     * Confirm a payment
     */
    async confirmPayment(req: Request, res: Response) {
        try {
            const paymentData: IPaymentData = req.body;
            const performedBy = req.user?.id || req.body.performedBy;

            // Log dữ liệu nhận vào
            console.log('[CONFIRM PAYMENT] Request body:', paymentData);
            console.log('[CONFIRM PAYMENT] Performed by:', performedBy);

            if (!performedBy) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const result = await this.paymentBusiness.confirmPayment(paymentData, performedBy);

            // Log kết quả trả về từ business/service
            console.log('[CONFIRM PAYMENT] Result:', result);

            if (result.success) {
                res.status(201).json({
                    success: true,
                    data: { paymentId: result.paymentId },
                    message: result.message
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            console.error('[CONFIRM PAYMENT] Error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }

    /**
     * GET /api/financial/payment/receipt/:paymentId
     * Get payment receipt
     */
    async getPaymentReceipt(req: Request, res: Response) {
        try {
            const { paymentId } = req.params;

            if (!paymentId) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment ID is required'
                });
            }

            const result = await this.paymentBusiness.getPaymentReceipt(paymentId);

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }

    /**
     * GET /api/financial/payment/audit
     * Get payment audit trail
     */
    async getPaymentAudit(req: Request, res: Response) {
        try {
            const { studentId, semesterId, dateFrom, dateTo, page, limit } = req.query;

            const filters = {
                studentId: studentId as string,
                semesterId: semesterId as string,
                dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
                dateTo: dateTo ? new Date(dateTo as string) : undefined,
                page: page ? parseInt(page as string) : 1,
                limit: limit ? parseInt(limit as string) : 50
            };

            const result = await this.paymentBusiness.getPaymentAudit(filters);

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    pagination: result.pagination
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }

    /**
     * GET /api/financial/payment/statistics
     * Get payment statistics
     */
    async getPaymentStatistics(req: Request, res: Response) {
        try {
            const { semesterId, dateFrom, dateTo } = req.query;

            const filters = {
                semesterId: semesterId as string,
                dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
                dateTo: dateTo ? new Date(dateTo as string) : undefined
            };

            const result = await this.paymentBusiness.getPaymentStatistics(filters);

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }

    /**
     * GET /api/financial/payment/available-semesters
     * Get list of semesters that have payment data
     */
    async getAvailableSemesters(req: Request, res: Response) {
        try {
            const result = await this.paymentBusiness.getAvailableSemesters();

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: result.message
                });
            }

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error?.message
            });
        }
    }
}

export const financialPaymentController = new FinancialPaymentController();
