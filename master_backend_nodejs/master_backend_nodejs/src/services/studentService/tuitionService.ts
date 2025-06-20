import { DatabaseService } from '../database/databaseService';
import { 
    ITuitionStatus, 
    ICourseDetail, 
    IPaymentHistory, 
    IPaymentRequest, 
    IPaymentResponse,
    ITuitionCalculation,
    PaymentStatus 
} from '../../models/student_related/studentPaymentInterface';
import { IPayment } from '../../models/payment';

export const tuitionService = {
    /**
     * Get tuition status for student in a semester
     * Shows registered courses, amounts, payment history
     */
    async getTuitionStatus(studentId: string, semesterId: string): Promise<ITuitionStatus | null> {
        try {
            // Get registration record
            const registration = await DatabaseService.queryOne(`
                SELECT 
                    MaPhieuDangKy as "registrationId",
                    NgayLap as "registrationDate",
                    MaSoSinhVien as "studentId", 
                    MaHocKy as "semesterId",
                    SoTienDangKy as "registrationAmount",
                    SoTienPhaiDong as "requiredAmount",
                    SoTienDaDong as "paidAmount",
                    SoTienConLai as "remainingAmount",
                    SoTinChiToiDa as "maxCredits"
                FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1 AND MaHocKy = $2
            `, [studentId, semesterId]);

            if (!registration) {
                return null;
            }

            // Get registered courses with calculated fees
            const courses = await this.getRegisteredCoursesWithFees(registration.registrationId);
            
            // Get student discount
            const discount = await this.getStudentDiscount(studentId);
            
            // Get payment history
            const paymentHistory = await this.getPaymentHistory(registration.registrationId);

            return {
                registration,
                courses,
                discount,
                paymentHistory
            };
        } catch (error) {
            console.error('Error getting tuition status:', error);
            throw error;
        }
    },

    /**
     * Get registered courses with calculated fees
     */
    async getRegisteredCoursesWithFees(registrationId: string): Promise<ICourseDetail[]> {
        try {
            const courses = await DatabaseService.query(`
                SELECT 
                    mh.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    mh.SoTiet as "credits",
                    lm.SoTienMotTC as "pricePerCredit",
                    lm.SoTietMotTC as "creditsPerUnit",
                    lm.TenLoaiMon as "courseType"
                FROM CT_PHIEUDANGKY ct
                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                WHERE ct.MaPhieuDangKy = $1
                ORDER BY mh.TenMonHoc
            `, [registrationId]);

            return courses.map(course => ({
                courseId: course.courseId,
                courseName: course.courseName,
                credits: course.credits,
                pricePerCredit: course.pricePerCredit,
                totalFee: this.calculateCourseFee(course.credits, course.pricePerCredit, course.creditsPerUnit),
                courseType: course.courseType
            }));
        } catch (error) {
            console.error('Error getting registered courses:', error);
            throw error;
        }
    },

    /**
     * Get student discount from priority object
     */
    async getStudentDiscount(studentId: string): Promise<{ type: string; percentage: number; amount: number } | null> {
        try {
            const discountInfo = await DatabaseService.queryOne(`
                SELECT 
                    dt.TenDoiTuong as "priorityType",
                    dt.MucGiamHocPhi as "discountAmount"
                FROM SINHVIEN sv
                JOIN DOITUONGUUTIEN dt ON sv.MaDoiTuongUT = dt.MaDoiTuong
                WHERE sv.MaSoSinhVien = $1
            `, [studentId]);

            if (!discountInfo || !discountInfo.discountAmount) {
                return null;
            }

            // Convert absolute discount to percentage (assuming it's percentage for now)
            return {
                type: discountInfo.priorityType,
                percentage: discountInfo.discountAmount,
                amount: 0 // Will be calculated when applying to total
            };
        } catch (error) {
            console.error('Error getting student discount:', error);
            return null;
        }
    },

    /**
     * Get payment history from PHIEUTHUHP
     */
    async getPaymentHistory(registrationId: string): Promise<IPaymentHistory[]> {
        try {
            const payments = await DatabaseService.query(`
                SELECT 
                    MaPhieuThu as "paymentId",
                    NgayLap as "paymentDate",
                    SoTienDong as "amount",
                    MaPhieuDangKy as "registrationId"
                FROM PHIEUTHUHP 
                WHERE MaPhieuDangKy = $1
                ORDER BY NgayLap DESC
            `, [registrationId]);

            return payments;
        } catch (error) {
            console.error('Error getting payment history:', error);
            throw error;
        }
    },

    /**
     * Make a payment
     */
    async makePayment(paymentRequest: IPaymentRequest): Promise<IPaymentResponse> {
        try {
            // Get current registration
            const registration = await DatabaseService.queryOne(`
                SELECT SoTienDaDong, SoTienConLai, SoTienPhaiDong 
                FROM PHIEUDANGKY 
                WHERE MaPhieuDangKy = $1
            `, [paymentRequest.registrationId]);

            if (!registration) {
                throw new Error('Registration not found');
            }

            // Validate payment amount
            if (paymentRequest.amount > registration.SoTienConLai) {
                throw new Error('Payment amount exceeds remaining amount');
            }

            // Generate payment ID
            const paymentId = `THU_${Date.now()}_${paymentRequest.registrationId}`;

            // Insert payment record
            await DatabaseService.query(`
                INSERT INTO PHIEUTHUHP (MaPhieuThu, NgayLap, MaPhieuDangKy, SoTienDong)
                VALUES ($1, NOW(), $2, $3)
            `, [paymentId, paymentRequest.registrationId, paymentRequest.amount]);

            // Update registration record
            const newPaidAmount = registration.SoTienDaDong + paymentRequest.amount;
            const newRemainingAmount = registration.SoTienPhaiDong - newPaidAmount;

            await DatabaseService.query(`
                UPDATE PHIEUDANGKY 
                SET SoTienDaDong = $1, SoTienConLai = $2
                WHERE MaPhieuDangKy = $3
            `, [newPaidAmount, newRemainingAmount, paymentRequest.registrationId]);

            // Determine status
            let status: PaymentStatus = 'unpaid';
            if (newRemainingAmount <= 0) {
                status = 'paid';
            } else if (newPaidAmount > 0) {
                status = 'partial';
            }

            return {
                success: true,
                paymentId,
                newPaidAmount,
                newRemainingAmount,
                status
            };
        } catch (error) {
            console.error('Error making payment:', error);
            throw error;
        }
    },

    /**
     * Calculate tuition with discount applied
     */
    async calculateTuitionWithDiscount(studentId: string, semesterId: string): Promise<ITuitionCalculation> {
        try {
            // Get base amount from registration
            const registration = await DatabaseService.queryOne(`
                SELECT SoTienDangKy FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1 AND MaHocKy = $2
            `, [studentId, semesterId]);

            if (!registration) {
                throw new Error('Registration not found');
            }

            const baseAmount = registration.SoTienDangKy;
            
            // Get discount
            const discount = await this.getStudentDiscount(studentId);
            
            let discountAmount = 0;
            let discountDetails = null;

            if (discount) {
                // Apply percentage discount
                discountAmount = (baseAmount * discount.percentage) / 100;
                discountDetails = {
                    type: discount.type,
                    rate: discount.percentage
                };
            }

            const finalAmount = baseAmount - discountAmount;

            return {
                baseAmount,
                discountAmount,
                finalAmount,
                discountDetails
            };
        } catch (error) {
            console.error('Error calculating tuition:', error);
            throw error;
        }
    },

    /**
     * Helper: Calculate course fee
     */
    calculateCourseFee(credits: number, pricePerCredit: number, creditsPerUnit: number): number {
        const actualCredits = credits / (creditsPerUnit || 1);
        return actualCredits * pricePerCredit;
    },

    /**
     * Get all outstanding tuitions (for financial department)
     */
    async getOutstandingTuitions(semesterId?: string): Promise<any[]> {
        try {
            let query = `
                SELECT 
                    pd.MaHocKy as "semesterId",
                    pd.MaSoSinhVien as "studentId", 
                    pd.MaPhieuDangKy as "registrationId",
                    sv.HoTen as "studentName",
                    pd.SoTienPhaiDong as "requiredAmount",
                    pd.SoTienDaDong as "paidAmount",
                    pd.SoTienConLai as "remainingAmount"
                FROM PHIEUDANGKY pd
                JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
                WHERE pd.SoTienConLai > 0
            `;

            const params: string[] = [];
            if (semesterId) {
                query += ` AND pd.MaHocKy = $1`;
                params.push(semesterId);
            }

            query += ` ORDER BY pd.NgayLap DESC`;

            return await DatabaseService.query(query, params);
        } catch (error) {
            console.error('Error getting outstanding tuitions:', error);
            throw error;
        }
    },

    /**
     * Get all registrations for a student
     */
    async getAllRegistrations(studentId: string): Promise<any[]> {
        try {
            const registrations = await DatabaseService.query(`
                SELECT 
                    pd.MaPhieuDangKy as "registrationId",
                    pd.MaHocKy as "semesterId", 
                    pd.MaHocKy as "semesterName",
                    '2024' as "year",
                    pd.NgayLap as "registrationDate",
                    hy.ThoiHanDongHP as "dueDate",
                    pd.SoTienDangKy as "originalAmount",
                    pd.SoTienPhaiDong as "totalAmount",
                    pd.SoTienDaDong as "paidAmount",
                    pd.SoTienConLai as "remainingAmount",
                    CASE 
                        WHEN pd.SoTienConLai <= 0 THEN 'paid'
                        WHEN hy.ThoiHanDongHP < CURRENT_DATE AND pd.SoTienConLai > 0 THEN 'overdue'
                        WHEN pd.SoTienConLai > 0 THEN 'unpaid'
                        ELSE 'pending'
                    END as "status"
                FROM PHIEUDANGKY pd
                LEFT JOIN HOCKYNAMHOC hy ON pd.MaHocKy = hy.MaHocKy
                WHERE pd.MaSoSinhVien = $1
                ORDER BY pd.MaHocKy DESC
            `, [studentId]);

            return registrations || [];
        } catch (error) {
            console.error('Error getting all registrations:', error);
            throw error;
        }
    },

    /**
     * Get all registration IDs for a student (for payment history)
     */
    async getAllRegistrationIds(studentId: string): Promise<string[]> {
        try {
            const registrations = await DatabaseService.query(`
                SELECT MaPhieuDangKy as "registrationId" 
                FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1
                ORDER BY NgayLap DESC
            `, [studentId]);

            return registrations.map(reg => reg.registrationId);
        } catch (error) {
            console.error('Error getting registration IDs:', error);
            throw error;
        }
    },

    /**
     * Get registration by student and semester
     */
    async getRegistrationBySemester(studentId: string, semesterId: string): Promise<any | null> {
        try {
            const registration = await DatabaseService.queryOne(`
                SELECT MaPhieuDangKy as "registrationId" 
                FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1 AND MaHocKy = $2
            `, [studentId, semesterId]);

            return registration;
        } catch (error) {
            console.error('Error getting registration by semester:', error);
            throw error;
        }
    },

    /**
     * Get registration by ID for validation
     */
    async getRegistrationById(registrationId: string): Promise<{
        studentId: string;
        semesterId: string;
        remainingAmount: number;
    } | null> {
        try {
            const registration = await DatabaseService.queryOne(`
                SELECT 
                    MaSoSinhVien as "studentId",
                    MaHocKy as "semesterId", 
                    SoTienConLai as "remainingAmount"
                FROM PHIEUDANGKY 
                WHERE MaPhieuDangKy = $1
            `, [registrationId]);

            return registration;
        } catch (error) {
            console.error('Error getting registration by ID:', error);
            throw error;
        }
    },

    /**
     * Map userId to studentId
     */
    async mapUserIdToStudentId(userId: string): Promise<string | null> {
        try {
            const user = await DatabaseService.queryOne(`
                SELECT masosinhvien 
                FROM nguoidung 
                WHERE userid = $1
            `, [userId]);

            return user?.masosinhvien || null;
        } catch (error) {
            console.error('Error mapping userId to studentId:', error);
            throw error;
        }
    },
};
