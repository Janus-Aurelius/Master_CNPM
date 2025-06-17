// Student Payment Interfaces - Based on Database Schema

// === DATABASE SCHEMA INTERFACES ===

// Maps to PHIEUDANGKY table
export interface IRegistration {
    registrationId: string;     // MaPhieuDangKy
    registrationDate: Date;     // NgayLap
    studentId: string;          // MaSoSinhVien
    semesterId: string;         // MaHocKy
    registrationAmount: number; // SoTienDangKy
    requiredAmount: number;     // SoTienPhaiDong (after discount)
    paidAmount: number;         // SoTienDaDong
    remainingAmount: number;    // SoTienConLai
    maxCredits: number;         // SoTinChiToiDa
}

// Maps to BAOCAOSINHVIENNOHP table
export interface IOutstandingTuition {
    semesterId: string;         // MaHocKy
    studentId: string;          // MaSoSinhVien
    registrationId: string;     // MaPhieuDangKy
}

// === BUSINESS LOGIC INTERFACES ===

// For tuition status page display
export interface ITuitionStatus {
    registration: IRegistration;
    courses: ICourseDetail[];
    discount: {
        type: string;
        percentage: number;
        amount: number;
    } | null;
    paymentHistory: IPaymentHistory[];
}

// Course detail with calculated fee
export interface ICourseDetail {
    courseId: string;           // MaMonHoc
    courseName: string;         // TenMonHoc
    credits: number;            // SoTiet from MONHOC
    pricePerCredit: number;     // SoTienMotTC from LOAIMON
    totalFee: number;           // Calculated: credits * pricePerCredit
    courseType: string;         // TenLoaiMon
}

// Payment history from PHIEUTHUHP
export interface IPaymentHistory {
    paymentId: string;          // MaPhieuThu
    paymentDate: Date;          // NgayLap
    amount: number;             // SoTienDong
    registrationId: string;     // MaPhieuDangKy
}

// === UI/FRONTEND INTERFACES ===

export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'overdue';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'momo' | 'vnpay';

// For payment form
export interface IPaymentRequest {
    registrationId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
}

// For payment response
export interface IPaymentResponse {
    success: boolean;
    paymentId: string;
    newPaidAmount: number;
    newRemainingAmount: number;
    status: PaymentStatus;
}

// === CALCULATION INTERFACES ===

// For tuition calculation with discount
export interface ITuitionCalculation {
    baseAmount: number;         // Total before discount
    discountAmount: number;     // Discount applied
    finalAmount: number;        // After discount
    discountDetails: {
        type: string;           // Priority type name
        rate: number;           // Discount rate
    } | null;
}

// === FINANCIAL MANAGEMENT INTERFACES ===

// Maps to DOITUONGUUTIEN table - for discount management
export interface IPriorityObject {
    priorityId: string;         // MaDoiTuong
    priorityName: string;       // TenDoiTuong
    discountAmount: number;     // MucGiamHocPhi (VND amount, not percentage)
}

// For financial department to manage course types and pricing
export interface ICourseTypeManagement {
    courseTypeId: string;       // MaLoaiMon
    courseTypeName: string;     // TenLoaiMon
    hoursPerCredit: number;     // SoTietMotTC
    pricePerCredit: number;     // SoTienMotTC
}

// For financial payment management
export interface IFinancialPaymentData {
    studentId: string;
    registrationId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    receiptNumber?: string;
    paymentDate: Date;
    notes?: string;
    semesterId: string;
    status: PaymentStatus;
}

// Payment data interface for updates
export interface IPaymentData {
    studentId: string;
    amount: number;
    paymentMethod: string;
    receiptNumber?: string;
    paymentDate: Date;
    notes?: string;
    semester: string;
    status: 'PAID' | 'PARTIAL' | 'UNPAID';
}

// Payment validation interface
export interface IPaymentValidation {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
    details?: any;
}

// Tuition course item interface  
export interface TuitionCourseItem {
    courseCode: string;
    courseName: string;
    credits: number;
    creditPrice: number;
    amount: number;
    feeType: string;
}

// Extended ITuitionCalculation with full details
export interface ITuitionCalculationExtended {
    studentId: string;
    semester: string;
    baseTuition: number;
    discountAmount: number;
    discountPercentage: number;
    additionalFees: number;
    totalAmount: number;
    courses: TuitionCourseItem[];
    priorityObject?: string | null;
    calculatedAt: Date;
    breakdown: {
        courseFees: number;
        discounts: number;
        additionalCharges: number;
        netAmount: number;
    };
    feeStructure: {
        type: string;
        amount: number;
        description: string;
    }[];
}

// For payment audit trail
export interface IPaymentAudit {
    id: string;
    tuitionRecordId: string;
    studentId: string;
    action: string;
    amount: number;
    previousAmount?: number;
    previousStatus?: string;
    newStatus?: string;
    paymentMethod?: string;
    receiptNumber?: string;
    notes?: string;
    performedBy: string;
    timestamp: Date;
}
