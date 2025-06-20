import { tuitionService } from '../../services/studentService/tuitionService';
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
     */    public async getStudentTuitionStatus(studentId: string, semesterId?: string): Promise<ITuitionStatus | null> {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            // Resolve actual studentId (map userId if needed)
            const actualStudentId = await this.resolveStudentId(studentId);

            // Use provided semester or get current semester
            const semester = semesterId || await this.getCurrentSemester();
            
            const tuitionStatus = await tuitionService.getTuitionStatus(actualStudentId, semester);
            if (!tuitionStatus) {
                return null;
            }

            // Apply business rules for payment deadlines and warnings
            const statusWithWarnings = this.applyPaymentDeadlineRules(tuitionStatus);

            return statusWithWarnings;
        } catch (error) {
            console.error('Error in tuition manager getting student tuition status:', error);
            throw error;
        }
    }

    /**
     * Process a payment with business validations
     */
    public async processPayment(paymentRequest: IPaymentRequest): Promise<IPaymentResponse> {
        try {
            // Validate payment request
            this.validatePaymentRequest(paymentRequest);
            
            // Additional business validation
            await this.validatePaymentAmount(paymentRequest);

            // Process payment through service layer
            const paymentResponse = await tuitionService.makePayment(paymentRequest);

            // Apply post-payment business rules
            await this.applyPostPaymentRules(paymentResponse);

            return paymentResponse;
        } catch (error) {
            console.error('Error in tuition manager processing payment:', error);
            throw error;
        }
    }

    /**
     * Get payment history with business formatting
     */    public async getPaymentHistory(studentId: string, semesterId?: string): Promise<IPaymentHistory[]> {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            // Resolve actual studentId (map userId if needed)
            const actualStudentId = await this.resolveStudentId(studentId);

            if (semesterId) {
                // Get history for specific semester using service
                const registration = await tuitionService.getRegistrationBySemester(actualStudentId, semesterId);

                if (!registration) {
                    return [];
                }

                const history = await tuitionService.getPaymentHistory(registration.registrationId);
                
                // Apply business formatting and categorization
                return this.formatPaymentHistory(history);
            } else {
                // Get history for all semesters using service
                const allRegistrationIds = await tuitionService.getAllRegistrationIds(actualStudentId);

                if (!allRegistrationIds || allRegistrationIds.length === 0) {
                    return [];
                }

                // Get payment history for all registrations
                const allHistory = [];
                for (const regId of allRegistrationIds) {
                    const history = await tuitionService.getPaymentHistory(regId);
                    allHistory.push(...history);
                }

                // Sort by date and limit to 10 most recent
                return this.formatPaymentHistory(allHistory)
                    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                    .slice(0, 10);
            }

        } catch (error) {
            console.error('Error in tuition manager getting payment history:', error);
            return []; // Return empty array instead of throwing to prevent cascade errors
        }
    }

    /**
     * Get tuition status for all semesters of a student
     * Returns formatted data for frontend display
     */    public async getAllTuitionStatus(studentId: string): Promise<any[]> {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            // Resolve actual studentId (map userId if needed)
            const actualStudentId = await this.resolveStudentId(studentId);

            console.log('📊 Getting all tuition status for student:', actualStudentId);

            // Get all registrations using service
            const registrations = await tuitionService.getAllRegistrations(actualStudentId);

            console.log('📋 Found registrations:', registrations);            if (!registrations || registrations.length === 0) {
                console.log('📝 No registration found for student:', actualStudentId);
                return [];
            }

            // Get detailed info for each semester using service
            const tuitionRecords = await Promise.all(
                registrations.map(async (reg) => {
                    // Get subjects for this registration using existing service method
                    let subjects = await tuitionService.getRegisteredCoursesWithFees(reg.registrationId);

                    // If no subjects found, log warning
                    if (!subjects || subjects.length === 0) {
                        console.warn('⚠️ No subjects found for registration:', reg.registrationId);
                        subjects = []; // Empty array instead of mock data
                    }

                    // Apply business logic for semester name formatting
                    const formattedSemesterName = this.formatSemesterName(reg.semesterName);

                    return {
                        id: reg.semesterId,
                        semester: reg.semesterId,
                        semesterName: formattedSemesterName,
                        year: reg.year || '2024',
                        dueDate: reg.dueDate || '2024-12-31',
                        status: reg.status || 'unpaid',
                        subjects: subjects.map(subject => ({
                            id: subject.courseId,
                            name: subject.courseName,
                            credits: subject.credits,
                            courseType: subject.courseType,
                            tuition: subject.totalFee
                        })),
                        totalAmount: reg.totalAmount || 0,
                        paidAmount: reg.paidAmount || 0,
                        remainingAmount: reg.remainingAmount || (reg.totalAmount || 0),
                        registrationDate: reg.registrationDate
                    };
                })
            );

            console.log('✅ Formatted tuition records:', tuitionRecords);
            return tuitionRecords;        } catch (error) {
            console.error('❌ Error getting all tuition status:', error);
            
            // Log detailed error for debugging
            console.error('Error details:', {
                inputStudentId: studentId,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            
            // In production, should throw error instead of returning mock data
            throw error;
        }
    }

    /**
     * Get recent payments for dashboard (last 5 transactions)
     */    public async getRecentPayments(studentId: string): Promise<IPaymentHistory[]> {
        try {
            // Resolve actual studentId (map userId if needed)
            const actualStudentId = await this.resolveStudentId(studentId);
            const allHistory = await this.getPaymentHistory(actualStudentId);
            return allHistory.slice(0, 5); // Return only the 5 most recent
        } catch (error) {
            console.error('Error getting recent payments:', error);
            return [];
        }
    }

    /**
     * Get tuition summary for financial reporting
     */    public async getTuitionSummary(studentId: string, semesterId?: string): Promise<ITuitionSummary | null> {
        try {
            // Resolve actual studentId (map userId if needed)
            const actualStudentId = await this.resolveStudentId(studentId);
            const semester = semesterId || await this.getCurrentSemester();
            const status = await this.getStudentTuitionStatus(actualStudentId, semester);
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
            return null;
        }
    }

    // Private helper methods

    /**
     * Get current active semester - uses business logic instead of direct DB access
     */
    private async getCurrentSemester(): Promise<string> {
        try {
            // For now, return hardcoded current semester
            // In the future, this could be moved to a system settings service
            return 'hk1_2024';
        } catch (error) {
            console.error('Error getting current semester:', error);
            return 'hk1_2024'; // Fallback to current semester
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
    }

    /**
     * Validate payment amount against outstanding balance
     */
    private async validatePaymentAmount(request: IPaymentRequest): Promise<void> {
        // Use service layer to get registration data instead of direct DB access
        const registration = await tuitionService.getRegistrationById(request.registrationId);

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
     * Business logic for formatting semester names
     */
    private formatSemesterName(semesterName: string): string {
        switch (semesterName) {
            case 'hk1_2024':
                return 'Học kỳ 1';
            case 'hk2_2024':
                return 'Học kỳ 2';
            case 'hk1_2023':
                return 'Học kỳ 1';
            case 'hk2_2023':
                return 'Học kỳ 2';
            default:
                return semesterName;
        }
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

    /**
     * Helper method to resolve student ID from user ID if needed
     */
    private async resolveStudentId(inputId: string): Promise<string> {
        // If inputId looks like a userId (starts with U), map it to studentId
        if (inputId.startsWith('U')) {
            const studentId = await tuitionService.mapUserIdToStudentId(inputId);
            if (!studentId) {
                throw new Error(`No student found for user ID: ${inputId}`);
            }
            console.log(`🔄 Mapped userId ${inputId} to studentId ${studentId}`);
            return studentId;
        }
        
        // Otherwise assume it's already a studentId
        return inputId;
    }
}

export default new TuitionManager();
