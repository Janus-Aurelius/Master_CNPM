import { tuitionService } from '../../services/studentService/tuitionService';
import { DatabaseService } from '../../services/database/databaseService';
import { 
    ITuitionStatus, 
    IPaymentRequest, 
    IPaymentResponse, 
    IPaymentHistory,
    PaymentStatus,
    IRegistration
} from '../../models/student_related/studentPaymentInterface';

// Additional interface for business layer
export interface ITuitionSummary {
    studentId: string;
    semesterId: string;
    totalTuition: number;
    totalPaid: number;
    remainingBalance: number;
    totalDiscount: number;
    paymentStatus: PaymentStatus;
    registrationCount: number;
    lastPaymentDate?: Date;
}

/**
 * Business layer for student tuition management
 * Handles business rules and validation for tuition-related operations
 */
class TuitionManager {
    
    /**
     * Get comprehensive tuition status for a student in current semester
     * Includes business rules for payment deadlines and warnings
     */
    public async getStudentTuitionStatus(studentId: string, semesterId?: string): Promise<ITuitionStatus | null> {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            // Use provided semester or get current semester
            const semester = semesterId || await this.getCurrentSemester();
            
            const tuitionStatus = await tuitionService.getTuitionStatus(studentId, semester);
            if (!tuitionStatus) {
                return null;
            }

            // Apply business rules for payment deadlines and warnings
            const statusWithWarnings = this.applyPaymentDeadlineRules(tuitionStatus);
            
            return statusWithWarnings;

        } catch (error) {
            console.error('Error in tuition manager getting status:', error);
            throw error;
        }
    }    /**
     * Process tuition payment with business validation
     */
    public async processPayment(paymentRequest: IPaymentRequest): Promise<IPaymentResponse> {
        try {
            // Validate payment request
            this.validatePaymentRequest(paymentRequest);            // Check if payment is allowed (not overpaying, valid amount, etc.)
            await this.validatePaymentAmount(paymentRequest);

            // Process the payment through service
            const paymentResponse = await tuitionService.makePayment(paymentRequest);

            // Apply post-payment business rules (notifications, status updates, etc.)
            await this.applyPostPaymentRules(paymentResponse);

            return paymentResponse;

        } catch (error) {
            console.error('Error in tuition manager processing payment:', error);
            throw error;
        }
    }    /**
     * Get payment history with business formatting
     */
    public async getPaymentHistory(studentId: string, semesterId?: string): Promise<IPaymentHistory[]> {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            const semester = semesterId || await this.getCurrentSemester();
            
            // First get the registration ID for this student and semester
            const registration = await DatabaseService.queryOne(`
                SELECT MaPhieuDangKy as "registrationId"
                FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1 AND MaHocKy = $2
            `, [studentId, semester]);

            if (!registration) {
                return [];
            }

            const history = await tuitionService.getPaymentHistory(registration.registrationId);
            
            // Apply business formatting and categorization
            return this.formatPaymentHistory(history);

        } catch (error) {
            console.error('Error in tuition manager getting payment history:', error);
            throw error;
        }
    }

    /**
     * Get recent payments for dashboard (last 5 transactions)
     */
    public async getRecentPayments(studentId: string): Promise<IPaymentHistory[]> {
        try {
            const allHistory = await this.getPaymentHistory(studentId);
            return allHistory.slice(0, 5); // Return only the 5 most recent
        } catch (error) {
            console.error('Error getting recent payments:', error);
            return [];
        }
    }

    /**
     * Get tuition summary for financial reporting
     */
    public async getTuitionSummary(studentId: string, semesterId?: string): Promise<ITuitionSummary | null> {
        try {
            const semester = semesterId || await this.getCurrentSemester();
            const status = await this.getStudentTuitionStatus(studentId, semester);
            if (!status) {
                return null;
            }

            const summary: ITuitionSummary = {
                studentId: status.registration.studentId,
                semesterId: semester,
                totalTuition: status.registration.registrationAmount,
                totalPaid: status.registration.paidAmount,
                remainingBalance: status.registration.remainingAmount,
                totalDiscount: status.discount?.amount || 0,
                paymentStatus: this.calculateOverallPaymentStatus(status),
                registrationCount: 1, // One registration per semester
                lastPaymentDate: status.paymentHistory.length > 0 ? 
                    status.paymentHistory
                        .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0]
                        .paymentDate : undefined
            };

            return summary;

        } catch (error) {
            console.error('Error getting tuition summary:', error);
            throw error;
        }
    }

    /**
     * Get tuition overview for dashboard display
     */
    public async getTuitionOverview(studentId: string): Promise<{
        totalOwed: number;
        totalPaid: number;
        paymentStatus: PaymentStatus;
        nextPaymentDue?: Date;
    } | null> {
        try {
            const summary = await this.getTuitionSummary(studentId);
            if (!summary) {
                return null;
            }

            return {
                totalOwed: summary.remainingBalance,
                totalPaid: summary.totalPaid,
                paymentStatus: summary.paymentStatus,
                nextPaymentDue: summary.lastPaymentDate
            };
        } catch (error) {
            console.error('Error getting tuition overview:', error);
            return null;
        }
    }

    /**
     * Get current active semester
     */
    private async getCurrentSemester(): Promise<string> {
        try {
            const currentSemester = await DatabaseService.queryOne(`
                SELECT setting_value FROM system_settings WHERE setting_key = 'current_semester'
            `);
            return currentSemester?.setting_value || '2024-1';
        } catch (error) {
            console.error('Error getting current semester:', error);
            return '2024-1'; // Fallback
        }
    }

    /**
     * Apply payment deadline rules and warnings
     */
    private applyPaymentDeadlineRules(status: ITuitionStatus): ITuitionStatus {
        const currentDate = new Date();
        const warningDays = 7; // Warn 7 days before deadline
        
        // For now, we don't have a due date in the schema, but this is where you'd add it
        // You could add business logic to calculate due dates based on registration date
        
        return status;
    }

    /**
     * Validate payment request
     */
    private validatePaymentRequest(request: IPaymentRequest): void {
        if (!request.registrationId) {
            throw new Error('Registration ID is required');
        }
        if (!request.amount || request.amount <= 0) {
            throw new Error('Payment amount must be greater than 0');
        }
        if (!request.paymentMethod) {
            throw new Error('Payment method is required');
        }
    }    /**
     * Validate payment amount against outstanding balance
     */
    private async validatePaymentAmount(request: IPaymentRequest): Promise<void> {
        // The registrationId is in the request, so we can validate directly
        // We can get student info from the registration if needed
        const registration = await DatabaseService.queryOne(`
            SELECT 
                MaSoSinhVien as "studentId",
                MaHocKy as "semesterId", 
                SoTienConLai as "remainingAmount"
            FROM PHIEUDANGKY 
            WHERE MaPhieuDangKy = $1
        `, [request.registrationId]);

        if (!registration) {
            throw new Error('Registration not found');
        }

        if (request.amount > registration.remainingAmount) {
            throw new Error('Payment amount exceeds remaining balance');
        }
    }

    /**
     * Apply post-payment business rules
     */
    private async applyPostPaymentRules(paymentResponse: IPaymentResponse): Promise<void> {
        // Here you could add:
        // - Send payment confirmation email
        // - Update student status if fully paid
        // - Generate receipt
        // - Log payment for audit
        // - Trigger notifications to financial department
        
        console.log(`Payment processed successfully, payment ID: ${paymentResponse.paymentId}, amount: ${paymentResponse.newPaidAmount}`);
    }

    /**
     * Format payment history with business logic
     */
    private formatPaymentHistory(history: IPaymentHistory[]): IPaymentHistory[] {
        return history.map(payment => ({
            ...payment,
            // Add any business formatting here if needed
        }));
    }

    /**
     * Calculate overall payment status
     */
    private calculateOverallPaymentStatus(status: ITuitionStatus): PaymentStatus {
        if (status.registration.remainingAmount <= 0) {
            return 'paid';
        }
        
        if (status.registration.paidAmount > 0) {
            return 'partial';
        }

        // Here you could add logic to check if overdue based on dates
        return 'unpaid';
    }
}

export default new TuitionManager();
