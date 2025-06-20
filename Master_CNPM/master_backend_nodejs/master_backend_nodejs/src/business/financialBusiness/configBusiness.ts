// src/business/financialBusiness/configBusiness.ts
import { FinancialConfigService } from '../../services/financialService/configService';

export class FinancialConfigBusiness {
    private configService: FinancialConfigService;

    constructor() {
        this.configService = new FinancialConfigService();
    }

    /**
     * Get all priority objects with validation
     */
    async getPriorityObjects() {
        try {
            const priorityObjects = await this.configService.getPriorityObjects();

            return {
                success: true,
                data: priorityObjects,
                total: priorityObjects.length
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get priority objects: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Create priority object with business validation
     */
    async createPriorityObject(data: {
        priorityId: string;
        priorityName: string;
        discountAmount: number;
    }) {
        try {
            // Validate input data
            const validation = this.validatePriorityObjectData(data);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.errors.join(', ')
                };
            }

            // Business rule: Discount amount should be reasonable (0 to 50M VND)
            if (data.discountAmount < 0 || data.discountAmount > 50000000) {
                return {
                    success: false,
                    message: 'Discount amount must be between 0 and 50,000,000 VND'
                };
            }

            const result = await this.configService.createPriorityObject(data);
            return result;

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create priority object: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Update priority object with validation
     */
    async updatePriorityObject(
        priorityId: string,
        data: {
            priorityName?: string;
            discountAmount?: number;
        }
    ) {
        try {
            if (!priorityId) {
                return {
                    success: false,
                    message: 'Priority ID is required'
                };
            }

            // Validate discount amount if provided
            if (data.discountAmount !== undefined) {
                if (data.discountAmount < 0 || data.discountAmount > 50000000) {
                    return {
                        success: false,
                        message: 'Discount amount must be between 0 and 50,000,000 VND'
                    };
                }
            }

            // Validate priority name if provided
            if (data.priorityName !== undefined) {
                if (!data.priorityName.trim()) {
                    return {
                        success: false,
                        message: 'Priority name cannot be empty'
                    };
                }

                if (data.priorityName.length > 100) {
                    return {
                        success: false,
                        message: 'Priority name cannot exceed 100 characters'
                    };
                }
            }

            const result = await this.configService.updatePriorityObject(priorityId, data);
            return result;

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to update priority object: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Delete priority object with business rules
     */
    async deletePriorityObject(priorityId: string) {
        try {
            if (!priorityId) {
                return {
                    success: false,
                    message: 'Priority ID is required'
                };
            }

            // Let the service handle the business rule check (if in use by students)
            const result = await this.configService.deletePriorityObject(priorityId);
            return result;

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to delete priority object: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get all course types with their pricing
     */
    async getCourseTypes() {
        try {
            const courseTypes = await this.configService.getCourseTypes();

            return {
                success: true,
                data: courseTypes,
                total: courseTypes.length
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get course types: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Update course type price with validation (no new types allowed)
     */
    async updateCourseTypePrice(courseTypeId: string, newPrice: number) {
        try {
            if (!courseTypeId) {
                return {
                    success: false,
                    message: 'Course type ID is required'
                };
            }

            // Validate price
            if (newPrice <= 0) {
                return {
                    success: false,
                    message: 'Price must be greater than 0'
                };
            }

            // Business rule: Price should be reasonable (100,000 to 5,000,000 VND per credit)
            if (newPrice < 100000 || newPrice > 5000000) {
                return {
                    success: false,
                    message: 'Price per credit must be between 100,000 and 5,000,000 VND'
                };
            }

            const result = await this.configService.updateCourseTypePrice(courseTypeId, newPrice);
            return result;

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to update course type price: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get payment deadline information
     */
    async getPaymentDeadline() {
        try {
            const deadlineInfo = await this.configService.getPaymentDeadline();

            return {
                success: true,
                data: deadlineInfo
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get payment deadline: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get semester configuration
     */
    async getSemesterConfig(semesterId?: string) {
        try {
            const config = await this.configService.getSemesterConfig(semesterId);

            if (!config) {
                return {
                    success: false,
                    message: semesterId ? 'Semester not found' : 'No active semester found'
                };
            }

            return {
                success: true,
                data: config
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get semester config: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get configuration summary dashboard
     */
    async getConfigSummary() {
        try {
            const summary = await this.configService.getConfigSummary();

            return {
                success: true,
                data: summary
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get config summary: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Validate priority object data
     */
    private validatePriorityObjectData(data: {
        priorityId: string;
        priorityName: string;
        discountAmount: number;
    }): { isValid: boolean, errors: string[] } {
        const errors: string[] = [];

        if (!data.priorityId || !data.priorityId.trim()) {
            errors.push('Priority ID is required');
        }

        if (data.priorityId && data.priorityId.length > 20) {
            errors.push('Priority ID cannot exceed 20 characters');
        }

        if (!data.priorityName || !data.priorityName.trim()) {
            errors.push('Priority name is required');
        }

        if (data.priorityName && data.priorityName.length > 100) {
            errors.push('Priority name cannot exceed 100 characters');
        }

        if (data.discountAmount === undefined || data.discountAmount === null) {
            errors.push('Discount amount is required');
        }

        if (typeof data.discountAmount !== 'number') {
            errors.push('Discount amount must be a number');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Batch update course type prices
     */
    async batchUpdateCourseTypePrices(updates: Array<{
        courseTypeId: string;
        newPrice: number;
    }>) {
        try {
            if (!updates || updates.length === 0) {
                return {
                    success: false,
                    message: 'No updates provided'
                };
            }

            const results = [];
            let successCount = 0;
            let errorCount = 0;

            for (const update of updates) {
                try {
                    const result = await this.updateCourseTypePrice(update.courseTypeId, update.newPrice);
                    results.push({
                        courseTypeId: update.courseTypeId,
                        success: result.success,
                        message: result.message
                    });

                    if (result.success) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (error: any) {
                    results.push({
                        courseTypeId: update.courseTypeId,
                        success: false,
                        message: error?.message || 'Unknown error'
                    });
                    errorCount++;
                }
            }

            return {
                success: errorCount === 0,
                data: {
                    results,
                    summary: {
                        total: updates.length,
                        successful: successCount,
                        failed: errorCount
                    }
                },
                message: `Batch update completed: ${successCount} successful, ${errorCount} failed`
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to batch update course type prices: ${error?.message || 'Unknown error'}`
            };
        }
    }
}
