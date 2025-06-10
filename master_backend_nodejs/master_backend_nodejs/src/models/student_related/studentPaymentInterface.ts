// Consolidated Student Payment Interface - All payment and tuition related interfaces

// Schema-based interfaces
export interface IRegistration {
    registrationId: string;     // maPhieuDangKy
    registrationDate: Date;     // ngayLap
    studentId: string;          // maSoSinhVien
    semesterId: string;         // maHocKy
    registrationAmount: number; // soTienDangKy
    requiredAmount: number;     // soTienPhaiDong
    paidAmount: number;         // soTienDaDong
    remainingAmount: number;    // soTienConLai
    maxCredits: number;         // soTinChiToiDa
}

export interface ITuitionPayment {
    paymentId: string;          // maPhieuThu
    paymentDate: Date;          // ngayLap
    registrationId: string;     // maPhieuDangKy
    paymentAmount: number;      // soTienDong
}

export interface IOutstandingTuition {
    semesterId: string;         // maHocKy
    studentId: string;          // maSoSinhVien
    registrationId: string;     // maPhieuDangKy
}

// Additional UI interfaces
export type PaymentStatus = 
    | 'pending'
    | 'paid'
    | 'overdue';

export type PaymentMethod = 
    | 'bank_transfer'
    | 'credit_card';

export interface IPayment {
    id: string;
    studentId: string;
    amount: number;
    semester: string;
    academicYear: string;
    paymentDate: string;
    status: 'paid' | 'pending' | 'failed';
    method: 'cash' | 'banking';
}

export interface ITuitionInfo {
    id: string;
    studentId: string;
    semester: string;
    academicYear: string;
    dueDate: string;
    totalAmount: number;
    status: 'paid' | 'pending' | 'unpaid' | 'overdue';
    subjects: {
        subjectId: string;
        subjectName: string;
        credits: number;
        tuitionPerCredit: number;
        amount: number;
    }[];
}

// New payment and tuition interfaces (preferred)
export interface ITuitionRecord {
    id: string;
    studentId: string;
    semester: string;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
    courses: TuitionCourseItem[];
    createdAt: string;
    updatedAt: string;
}

// Interface cho từng môn học trong phiếu học phí
export interface TuitionCourseItem {
    courseId: string;
    courseName: string;
    credits: number;
    amount: number;
    semester: string;
    academicYear: string;
}

// Interface cho phiếu thu học phí
export interface ITuitionPaymentReceipt {
    id: string;
    tuitionRecordId: string;
    studentId: string;
    amount: number;
    paymentMethod: string;
    receiptNumber: string;
    paymentDate: string;
    notes?: string;
    createdAt: string;
}

// Interface cho tuition settings
export interface ITuitionSetting {
    id?: number;
    faculty: string;
    program: string;
    creditCost: number;
    semester: string;
    academicYear: string;
    effectiveDate: Date;
    expiryDate: Date;
    fees: {
        type: string;
        amount: number;
        description: string;
        mandatory: boolean;
    }[];
    discounts: {
        type: string;
        percentage: number;
        description: string;
        priority: boolean;
        maxStackable: number;
        conditions?: {
            type: string;
            value: any;
        }[];
    }[];
    paymentDeadlines: {
        early: Date;
        regular: Date;
        late: Date;
    };
    settings: {
        lateFeePercentage: number;
        earlyDiscountPercentage: number;
        maxTotalDiscount: number;
    };
}

// Interface cho payment data structure
export interface IPaymentData {
    studentId: string;
    amount: number;
    paymentMethod: string;
    receiptNumber: string;
    paymentDate: Date;
    notes?: string;
    semester: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
}

// Interface cho payment validation
export interface IPaymentValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    details: {
        amount: number;
        expectedAmount: number;
        difference: number;
        status: 'VALID' | 'INVALID' | 'WARNING';
    };
}

// Interface cho payment audit
export interface IPaymentAudit {
    id: number;
    tuitionRecordId: number;
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

// Interface cho tuition calculation
export interface ITuitionCalculation {
    baseAmount: number;
    fees: {
        type: string;
        amount: number;
        description: string;
        isMandatory: boolean;
    }[];
    discounts: {
        type: string;
        percentage: number;
        amount: number;
        description: string;
        isPriority: boolean;
    }[];
    feesTotal: number;
    discountsTotal: number;
    totalAmount: number;
    finalAmount: number;
    adjustments: { description: string; amount: number }[];
    dueDate: string;
}
