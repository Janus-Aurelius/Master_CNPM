// src/business/financialBusiness/paymentBusiness.ts
import { FinancialPaymentService } from '../../services/financialService/paymentService';
import { IPaymentData } from '../../models/student_related/studentPaymentInterface';

export class FinancialPaymentBusiness {
    private paymentService: FinancialPaymentService;

    constructor() {
        this.paymentService = new FinancialPaymentService();
    }    /**
     * Get payment status list with validation and business logic
     */
    async getPaymentStatusList(semesterId: string, filters?: {
        paymentStatus?: 'paid' | 'unpaid' | 'not_opened';
        studentId?: string;
        page?: number;
        limit?: number;
    }) {
        try {
            // Validate semesterId
            if (!semesterId) {
                return {
                    success: false,
                    message: 'Semester ID is required'
                };
            }

            // Calculate offset from page
            const page = filters?.page || 1;
            const limit = filters?.limit || 50;
            const offset = (page - 1) * limit;

            const result = await this.paymentService.getPaymentStatusList(semesterId, {
                ...filters,
                offset,
                limit
            });

            return {
                success: true,
                data: result.data,
                pagination: {
                    total: result.total,
                    page,
                    limit,
                    totalPages: Math.ceil(result.total / limit)
                }
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get payment status list: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get student payment history with validation
     */
    async getStudentPaymentHistory(studentId: string, semesterId?: string) {
        try {
            if (!studentId) {
                return {
                    success: false,
                    message: 'Student ID is required'
                };
            }

            const history = await this.paymentService.getPaymentHistory(studentId, semesterId);

            // Calculate summary statistics
            const totalPaid = history.reduce((sum, payment) => sum + payment.amount, 0);
            const paymentCount = history.length;
            const averagePayment = paymentCount > 0 ? totalPaid / paymentCount : 0;

            return {
                success: true,
                data: {
                    payments: history,
                    summary: {
                        totalPaid,
                        paymentCount,
                        averagePayment: Math.round(averagePayment * 100) / 100,
                        lastPaymentDate: history.length > 0 ? history[0].paymentDate : null
                    }
                }
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get payment history: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Confirm payment with validation and business rules
     */
    async confirmPayment(paymentData: IPaymentData, performedBy: string) {
        try {
            // Validate required fields
            if (!paymentData.studentId) {
                return {
                    success: false,
                    message: 'Student ID is required'
                };
            }

            if (!paymentData.semester) {
                return {
                    success: false,
                    message: 'Semester is required'
                };
            }

            if (!paymentData.amount || paymentData.amount <= 0) {
                return {
                    success: false,
                    message: 'Payment amount must be greater than 0'
                };
            }

            if (!paymentData.paymentMethod) {
                return {
                    success: false,
                    message: 'Payment method is required'
                };
            }

            if (!performedBy) {
                return {
                    success: false,
                    message: 'Performer information is required'
                };
            }

            // Check if student exists and has outstanding balance
            const paymentsList = await this.paymentService.getPaymentStatusList(paymentData.semester, {
                studentId: paymentData.studentId,
                limit: 1
            });

            if (paymentsList.total === 0) {
                return {
                    success: false,
                    message: 'Student not found in this semester'
                };
            }

            const studentStatus = paymentsList.data[0];
            if (studentStatus.remainingAmount <= 0) {
                return {
                    success: false,
                    message: 'Student has no outstanding balance'
                };
            }

            if (paymentData.amount > studentStatus.remainingAmount) {
                return {
                    success: false,
                    message: `Payment amount cannot exceed outstanding balance (${studentStatus.remainingAmount})`
                };
            }

            // Process payment
            const result = await this.paymentService.confirmPayment(paymentData, performedBy);

            if (result.success) {
                // Get updated status
                const updatedStatus = await this.paymentService.getPaymentStatusList(paymentData.semester, {
                    studentId: paymentData.studentId,
                    limit: 1
                });

                return {
                    success: true,
                    data: {
                        paymentId: result.paymentId,
                        updatedStatus: updatedStatus.data[0] || null
                    },
                    message: result.message
                };
            }

            return result;

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to confirm payment: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get payment receipt with validation
     */
    async getPaymentReceipt(paymentId: string) {
        try {
            if (!paymentId) {
                return {
                    success: false,
                    message: 'Payment ID is required'
                };
            }

            const receipt = await this.paymentService.getPaymentReceipt(paymentId);

            if (!receipt) {
                return {
                    success: false,
                    message: 'Payment receipt not found'
                };
            }

            return {
                success: true,
                data: receipt
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get payment receipt: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get payment audit trail with filters and validation
     */
    async getPaymentAudit(filters?: {
        studentId?: string;
        semesterId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        page?: number;
        limit?: number;
    }) {
        try {
            // Validate date range
            if (filters?.dateFrom && filters?.dateTo && filters.dateFrom > filters.dateTo) {
                return {
                    success: false,
                    message: 'Start date cannot be after end date'
                };
            }

            // Calculate offset from page
            const page = filters?.page || 1;
            const limit = filters?.limit || 50;
            const offset = (page - 1) * limit;

            const result = await this.paymentService.getPaymentAudit({
                ...filters,
                offset,
                limit
            });

            return {
                success: true,
                data: result.data,
                pagination: {
                    total: result.total,
                    page,
                    limit,
                    totalPages: Math.ceil(result.total / limit)
                }
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get payment audit: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Validate payment data before processing
     */
    private validatePaymentData(paymentData: IPaymentData): { isValid: boolean, errors: string[] } {
        const errors: string[] = [];

        if (!paymentData.studentId) {
            errors.push('Student ID is required');
        }

        if (!paymentData.semester) {
            errors.push('Semester is required');
        }

        if (!paymentData.amount || paymentData.amount <= 0) {
            errors.push('Payment amount must be greater than 0');
        }

        if (!paymentData.paymentMethod) {
            errors.push('Payment method is required');
        }

        const validPaymentMethods = ['cash', 'bank_transfer', 'momo', 'vnpay'];
        if (paymentData.paymentMethod && !validPaymentMethods.includes(paymentData.paymentMethod)) {
            errors.push('Invalid payment method');
        }        const validStatuses = ['PAID', 'UNPAID', 'NOT_OPENED'];
        if (paymentData.status && !validStatuses.includes(paymentData.status)) {
            errors.push('Invalid payment status');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get payment statistics for a specific period
     */
    async getPaymentStatistics(filters?: {
        semesterId?: string;
        dateFrom?: Date;
        dateTo?: Date;
    }) {
        try {
            const auditResult = await this.paymentService.getPaymentAudit({
                ...filters,
                limit: 10000 // Get all records for statistics
            });

            const payments = auditResult.data;

            // Calculate statistics
            const totalPayments = payments.length;
            const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
            const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;

            // Group by payment method
            const paymentMethodStats = payments.reduce((acc: any, payment) => {
                if (!acc[payment.paymentMethod]) {
                    acc[payment.paymentMethod] = { count: 0, amount: 0 };
                }
                acc[payment.paymentMethod].count++;
                acc[payment.paymentMethod].amount += payment.amount;
                return acc;
            }, {});

            return {
                success: true,
                data: {
                    totalPayments,
                    totalAmount,
                    averagePayment: Math.round(averagePayment * 100) / 100,
                    paymentMethodStats
                }
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to get payment statistics: ${error?.message || 'Unknown error'}`
            };
        }
    }
}
