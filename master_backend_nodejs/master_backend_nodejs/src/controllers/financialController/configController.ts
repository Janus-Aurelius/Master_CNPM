// src/controllers/financialController/configController.ts
import { Request, Response } from 'express';
import { FinancialConfigBusiness } from '../../business/financialBusiness/configBusiness';

export class FinancialConfigController {
    private configBusiness: FinancialConfigBusiness;

    constructor() {
        this.configBusiness = new FinancialConfigBusiness();
    }

    /**
     * GET /api/financial/config/priority-objects
     * Get all priority objects
     */
    async getPriorityObjects(req: Request, res: Response) {
        try {
            const result = await this.configBusiness.getPriorityObjects();

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    total: result.total
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
     * POST /api/financial/config/priority-objects
     * Create a new priority object
     */
    async createPriorityObject(req: Request, res: Response) {
        try {
            const { priorityId, priorityName, discountAmount } = req.body;

            if (!priorityId || !priorityName || discountAmount === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Priority ID, name, and discount amount are required'
                });
            }

            const result = await this.configBusiness.createPriorityObject({
                priorityId,
                priorityName,
                discountAmount: parseFloat(discountAmount)
            });

            if (result.success) {
                res.status(201).json({
                    success: true,
                    message: result.message
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
     * PUT /api/financial/config/priority-objects/:priorityId
     * Update a priority object
     */
    async updatePriorityObject(req: Request, res: Response) {
        try {
            const { priorityId } = req.params;
            const { priorityName, discountAmount } = req.body;

            if (!priorityId) {
                return res.status(400).json({
                    success: false,
                    message: 'Priority ID is required'
                });
            }

            const updateData: any = {};
            if (priorityName !== undefined) {
                updateData.priorityName = priorityName;
            }
            if (discountAmount !== undefined) {
                updateData.discountAmount = parseFloat(discountAmount);
            }

            const result = await this.configBusiness.updatePriorityObject(priorityId, updateData);

            if (result.success) {
                res.json({
                    success: true,
                    message: result.message
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
     * DELETE /api/financial/config/priority-objects/:priorityId
     * Delete a priority object
     */
    async deletePriorityObject(req: Request, res: Response) {
        try {
            const { priorityId } = req.params;

            if (!priorityId) {
                return res.status(400).json({
                    success: false,
                    message: 'Priority ID is required'
                });
            }

            const result = await this.configBusiness.deletePriorityObject(priorityId);

            if (result.success) {
                res.json({
                    success: true,
                    message: result.message
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
     * GET /api/financial/config/course-types
     * Get all course types with pricing
     */
    async getCourseTypes(req: Request, res: Response) {
        try {
            const result = await this.configBusiness.getCourseTypes();

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    total: result.total
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
     * PUT /api/financial/config/course-types/:courseTypeId/price
     * Update course type price (no new course types allowed)
     */
    async updateCourseTypePrice(req: Request, res: Response) {
        try {
            const { courseTypeId } = req.params;
            const { newPrice } = req.body;

            if (!courseTypeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Course type ID is required'
                });
            }

            if (newPrice === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'New price is required'
                });
            }

            const result = await this.configBusiness.updateCourseTypePrice(
                courseTypeId,
                parseFloat(newPrice)
            );

            if (result.success) {
                res.json({
                    success: true,
                    message: result.message
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
     * PUT /api/financial/config/course-types/batch-price-update
     * Batch update course type prices
     */
    async batchUpdateCourseTypePrices(req: Request, res: Response) {
        try {
            const { updates } = req.body;

            if (!updates || !Array.isArray(updates)) {
                return res.status(400).json({
                    success: false,
                    message: 'Updates array is required'
                });
            }

            const result = await this.configBusiness.batchUpdateCourseTypePrices(updates);

            if (result.success) {
                res.json({
                    success: true,
                    data: result.data,
                    message: result.message
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
     * GET /api/financial/config/payment-deadline
     * Get payment deadline from current semester
     */
    async getPaymentDeadline(req: Request, res: Response) {
        try {
            const result = await this.configBusiness.getPaymentDeadline();

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
     * GET /api/financial/config/semester
     * Get semester configuration
     */
    async getSemesterConfig(req: Request, res: Response) {
        try {
            const { semesterId } = req.query;

            const result = await this.configBusiness.getSemesterConfig(semesterId as string);

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
     * GET /api/financial/config/summary
     * Get configuration summary
     */
    async getConfigSummary(req: Request, res: Response) {
        try {
            const result = await this.configBusiness.getConfigSummary();

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
    async getCurrentSemester(req: Request, res: Response) {
        const result = await this.configBusiness.getCurrentSemester();
        if (result.success) {
            res.json(result.data);
        } else {
            res.status(404).json({ message: result.message });
        }
    }
}
export const financialConfigController = new FinancialConfigController();
