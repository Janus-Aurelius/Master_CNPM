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
import { IRegistration, IEnhancedRegistration } from '../../models/student_related/studentEnrollmentInterface';
import { IPayment } from '../../models/payment';

export const tuitionService = {    /**
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
                    SoTinChiToiDa as "maxCredits"
                FROM PHIEUDANGKY 
                WHERE MaSoSinhVien = $1 AND MaHocKy = $2
            `, [studentId, semesterId]);

            if (!registration) {
                return null;
            }

            // Get registered courses with calculated fees
            const courses = await this.getRegisteredCoursesWithFees(registration.registrationId);
            
            // Calculate registration amount from courses
            const registrationAmount = Math.round(courses.reduce((total, course) => total + course.totalFee, 0));
            
            // Get student discount
            const discount = await this.getStudentDiscount(studentId);
            
            // Calculate required amount after discount
            const discountMultiplier = discount ? (1 - discount.percentage) : 1;
            const requiredAmount = Math.round(registrationAmount * discountMultiplier);
            
            // Get payment history and calculate paid amount
            const paymentHistory = await this.getPaymentHistory(registration.registrationId);
            const paidAmount = Math.round(paymentHistory.reduce((total, payment) => total + (payment.amount || 0), 0));
            
            // Calculate remaining amount
            let remainingAmount = requiredAmount - paidAmount;
            remainingAmount = Math.round(remainingAmount);

            console.log(`💰 [getTuitionStatus] Payment calculation details:`, {
                registrationId: registration.registrationId,
                registrationAmount: registrationAmount,
                requiredAmount: requiredAmount,
                paymentHistoryCount: paymentHistory.length,
                paidAmount: paidAmount,
                calculatedRemainingAmount: remainingAmount
            });

            // Add calculated amounts to registration object
            const enhancedRegistration = {
                ...registration,
                registrationAmount,
                requiredAmount,
                paidAmount,
                remainingAmount
            };
            console.log(`[BACKEND][getTuitionStatus] studentId=${studentId}, semesterId=${semesterId}, requiredAmount=${requiredAmount}, paidAmount=${paidAmount}, remainingAmount=${remainingAmount}`);

            return {
                registration: enhancedRegistration,
                courses,
                discount,
                paymentHistory
            };
        } catch (error) {
            console.error('Error getting tuition status:', error);
            throw error;
        }
    },    /**
     * Get registered courses with calculated fees
     */
    async getRegisteredCoursesWithFees(registrationId: string): Promise<ICourseDetail[]> {
        try {
            // First get the semester ID for this registration
            const registration = await DatabaseService.queryOne(`
                SELECT MaHocKy as "semesterId"
                FROM PHIEUDANGKY 
                WHERE MaPhieuDangKy = $1
            `, [registrationId]);

            if (!registration) {
                throw new Error('Registration not found');
            }

            const courses = await DatabaseService.query(`
                SELECT 
                    mh.MaMonHoc as "courseId",
                    mh.TenMonHoc as "courseName",
                    mh.SoTiet as "totalPeriods",
                    COALESCE(ht.SoTienMotTC, 0) as "pricePerCredit",
                    lm.SoTietMotTC as "periodsPerCredit",
                    lm.TenLoaiMon as "courseType"
                FROM CT_PHIEUDANGKY ct
                JOIN MONHOC mh ON ct.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                LEFT JOIN HOCPHI_THEOHK ht ON lm.MaLoaiMon = ht.MaLoaiMon AND ht.MaHocKy = $2
                WHERE ct.MaPhieuDangKy = $1
                ORDER BY mh.TenMonHoc
            `, [registrationId, registration.semesterId]);

            return courses.map(course => {
                // Calculate actual credits: SoTiet / SoTietMotTC
                const actualCredits = course.totalPeriods / course.periodsPerCredit;
                const totalFee = actualCredits * course.pricePerCredit;
                
                return {
                    courseId: course.courseId,
                    courseName: course.courseName,
                    credits: actualCredits,
                    totalPeriods: course.totalPeriods,
                    periodsPerCredit: course.periodsPerCredit,
                    pricePerCredit: course.pricePerCredit,
                    totalFee: totalFee,
                    courseType: course.courseType
                };
            });
        } catch (error) {
            console.error('Error getting registered courses:', error);
            throw error;
        }
    },

    /**
     * Get student discount from priority object
     */    async getStudentDiscount(studentId: string): Promise<{ type: string; percentage: number; amount: number; code?: string } | null> {
        try {
            const discountInfo = await DatabaseService.queryOne(`
                SELECT 
                    dt.TenDoiTuong as "priorityType",
                    dt.MucGiamHocPhi as "discountPercentage",
                    dt.MaDoiTuong as "priorityCode"
                FROM SINHVIEN sv
                JOIN DOITUONGUUTIEN dt ON sv.MaDoiTuongUT = dt.MaDoiTuong
                WHERE sv.MaSoSinhVien = $1
            `, [studentId]);

            if (!discountInfo || !discountInfo.discountPercentage) {
                return null;
            }

            return {
                type: discountInfo.priorityType,
                percentage: discountInfo.discountPercentage,
                amount: 0, // Will be calculated when applying to specific amount
                code: discountInfo.priorityCode
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
            console.log(`📋 [getPaymentHistory] Getting payment history for registration: ${registrationId}`);
            
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

            console.log(`📋 [getPaymentHistory] Raw payments from DB:`, payments);

            const mappedPayments = payments.map(payment => ({
                ...payment,
                amount: typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount
            }));

            console.log(`📋 [getPaymentHistory] Mapped payments:`, mappedPayments);
            console.log(`📋 [getPaymentHistory] Total paid amount: ${mappedPayments.reduce((total, payment) => total + (payment.amount || 0), 0)}`);

            return mappedPayments;
        } catch (error) {
            console.error('Error getting payment history:', error);
            throw error;
        }
    },    /**
     * Make a payment
     */
    async makePayment(paymentRequest: IPaymentRequest): Promise<IPaymentResponse> {
        try {
            // Get current registration details
            const registration = await DatabaseService.queryOne(`
                SELECT 
                    MaPhieuDangKy as "registrationId",
                    MaSoSinhVien as "studentId",
                    MaHocKy as "semesterId",
                    XacNhan as "isConfirmed"
                FROM PHIEUDANGKY 
                WHERE MaPhieuDangKy = $1
            `, [paymentRequest.registrationId]);

            if (!registration) {
                throw new Error('Registration not found');
            }

            // Kiểm tra trạng thái xác nhận
            if (!registration.isconfirmed && !registration.isConfirmed) {
                throw new Error('Bạn chưa xác nhận danh sách môn học. Vui lòng xác nhận trước khi thanh toán.');
            }

            // Get current tuition status (with calculated amounts) BEFORE payment
            const tuitionStatus = await this.getTuitionStatus(registration.studentId, registration.semesterId);
            if (!tuitionStatus) {
                throw new Error('Unable to calculate tuition status');
            }

            // Generate payment ID based on existing pattern (PT + number)
            const nextIdResult = await DatabaseService.queryOne(`
                SELECT COALESCE(MAX(CAST(SUBSTRING(MaPhieuThu FROM 3) AS INTEGER)), 0) + 1 as next_id
                FROM PHIEUTHUHP 
                WHERE MaPhieuThu LIKE 'PT%'
            `);
            const nextId = String(nextIdResult?.next_id || 1).padStart(3, '0');
            const paymentId = `PT${nextId}`;

            // Insert payment record with CURRENT_DATE for current date
            console.log('💳 Creating payment record:', paymentId, 'for registration:', paymentRequest.registrationId, 'amount:', paymentRequest.amount);
            
            await DatabaseService.query(`
                INSERT INTO PHIEUTHUHP (MaPhieuThu, NgayLap, MaPhieuDangKy, SoTienDong)
                VALUES ($1, CURRENT_DATE, $2, $3)
            `, [paymentId, paymentRequest.registrationId, paymentRequest.amount]);

            console.log('✅ Payment record created successfully');

            // Calculate new amounts AFTER payment
            const paymentAmount = Math.round(Number(paymentRequest.amount));
            const currentPaidAmount = Math.round(tuitionStatus.registration.paidAmount);
            const newPaidAmount = currentPaidAmount + paymentAmount;
            let newRemainingAmount = tuitionStatus.registration.requiredAmount - newPaidAmount;
            newRemainingAmount = Math.round(newRemainingAmount); // Làm tròn về số nguyên, cho phép âm nếu đóng dư

            console.log('💰 Payment calculation:', {
                requiredAmount: tuitionStatus.registration.requiredAmount,
                currentPaidAmount: currentPaidAmount,
                paymentAmount: paymentAmount,
                newPaidAmount: newPaidAmount,
                newRemainingAmount: newRemainingAmount
            });

            // Update PHIEUDANGKY with new remaining amount
            console.log('💰 Updating PHIEUDANGKY with new remaining amount:', newRemainingAmount);
            
            await DatabaseService.query(`
                UPDATE PHIEUDANGKY 
                SET SoTienConLai = $1 
                WHERE MaPhieuDangKy = $2
            `, [newRemainingAmount, paymentRequest.registrationId]);

            console.log('✅ PHIEUDANGKY updated successfully');

            // Determine status - simplified to only 3 states
            let status: PaymentStatus = 'unpaid';
            if (newRemainingAmount <= 0) {
                status = 'paid';
            }
            // Removed partial status - now only unpaid/paid

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
    },    /**
     * Calculate tuition with discount applied
     */
    async calculateTuitionWithDiscount(studentId: string, semesterId: string): Promise<ITuitionCalculation> {
        try {
            // Get tuition status (which calculates base amount from courses)
            const tuitionStatus = await this.getTuitionStatus(studentId, semesterId);
            
            if (!tuitionStatus) {
                throw new Error('Registration not found');
            }

            const baseAmount = tuitionStatus.registration.registrationAmount;
            const discount = tuitionStatus.discount;
            
            let discountAmount = 0;
            let discountDetails = null;

            if (discount) {
                // Apply percentage discount
                discountAmount = baseAmount * discount.percentage;
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
    },    /**
     * Helper: Calculate course fee (kept for backward compatibility)
     */
    calculateCourseFee(totalPeriods: number, pricePerCredit: number, periodsPerCredit: number): number {
        const actualCredits = totalPeriods / (periodsPerCredit || 1);
        return actualCredits * pricePerCredit;
    },    /**
     * Get all outstanding tuitions (for financial department)
     */
    async getOutstandingTuitions(semesterId?: string): Promise<any[]> {
        try {
            let query = `
                SELECT DISTINCT
                    pd.MaHocKy as "semesterId",
                    pd.MaSoSinhVien as "studentId", 
                    pd.MaPhieuDangKy as "registrationId",
                    sv.HoTen as "studentName"
                FROM PHIEUDANGKY pd
                JOIN SINHVIEN sv ON pd.MaSoSinhVien = sv.MaSoSinhVien
                WHERE 1=1
            `;

            const params: string[] = [];
            if (semesterId) {
                query += ` AND pd.MaHocKy = $1`;
                params.push(semesterId);
            }

            query += ` ORDER BY pd.NgayLap DESC`;

            const registrations = await DatabaseService.query(query, params);

            // Calculate amounts for each registration
            const outstandingTuitions = await Promise.all(
                registrations.map(async (reg) => {
                    const tuitionStatus = await this.getTuitionStatus(reg.studentId, reg.semesterId);
                    
                    if (!tuitionStatus || tuitionStatus.registration.remainingAmount <= 0) {
                        return null; // Filter out paid tuitions
                    }

                    return {
                        semesterId: reg.semesterId,
                        studentId: reg.studentId,
                        registrationId: reg.registrationId,
                        studentName: reg.studentName,
                        requiredAmount: tuitionStatus.registration.requiredAmount,
                        paidAmount: tuitionStatus.registration.paidAmount,
                        remainingAmount: tuitionStatus.registration.remainingAmount
                    };
                })
            );

            // Filter out null values (paid tuitions)
            return outstandingTuitions.filter(item => item !== null);
        } catch (error) {
            console.error('Error getting outstanding tuitions:', error);
            throw error;
        }
    },/**
     * Get all registrations for a student
     */
    async getAllRegistrations(studentId: string): Promise<any[]> {
        try {
            const registrations = await DatabaseService.query(`
                SELECT 
                    pd.MaPhieuDangKy as "registrationId",
                    pd.MaHocKy as "semesterId", 
                    pd.MaHocKy as "semesterName",
                    hy.NamHoc as "year",
                    pd.NgayLap as "registrationDate",
                    hy.ThoiHanDongHP as "dueDate"
                FROM PHIEUDANGKY pd
                LEFT JOIN HOCKYNAMHOC hy ON pd.MaHocKy = hy.MaHocKy
                WHERE pd.MaSoSinhVien = $1
                ORDER BY pd.MaHocKy DESC
            `, [studentId]);

            // For each registration, get calculated amounts
            const registrationsWithAmounts = await Promise.all(
                registrations.map(async (reg) => {
                    const tuitionStatus = await this.getTuitionStatus(studentId, reg.semesterId);
                    if (!tuitionStatus) {
                        return {
                            ...reg,
                            originalAmount: 0,
                            totalAmount: 0,
                            paidAmount: 0,
                            remainingAmount: 0,
                            status: 'error'
                        };
                    }
                    let status = 'unpaid';
                    if (tuitionStatus.registration.remainingAmount <= 0) {
                        status = 'paid';
                    }
                    console.log(`[BACKEND][getAllRegistrations] studentId=${studentId}, semesterId=${reg.semesterId}, requiredAmount=${tuitionStatus.registration.requiredAmount}, paidAmount=${tuitionStatus.registration.paidAmount}, remainingAmount=${tuitionStatus.registration.remainingAmount}, status=${status}`);

                    return {
                        ...reg,
                        originalAmount: tuitionStatus.registration.registrationAmount,
                        totalAmount: tuitionStatus.registration.requiredAmount,
                        paidAmount: tuitionStatus.registration.paidAmount,
                        remainingAmount: tuitionStatus.registration.remainingAmount,
                        status,
                        discount: tuitionStatus.discount
                    };
                })
            );

            return registrationsWithAmounts || [];
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
    },    /**
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
                    MaHocKy as "semesterId"
                FROM PHIEUDANGKY 
                WHERE MaPhieuDangKy = $1
            `, [registrationId]);

            if (!registration) {
                return null;
            }

            // Get calculated tuition status
            const tuitionStatus = await this.getTuitionStatus(registration.studentId, registration.semesterId);
            
            if (!tuitionStatus) {
                return null;
            }

            return {
                studentId: registration.studentId,
                semesterId: registration.semesterId,
                remainingAmount: tuitionStatus.registration.remainingAmount
            };
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
