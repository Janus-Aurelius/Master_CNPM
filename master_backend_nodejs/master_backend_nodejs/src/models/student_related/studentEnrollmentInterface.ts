// Schema-based interfaces - Database driven
export interface IRegistration {
    registrationId: string;     // maPhieuDangKy
    registrationDate: Date;     // ngayLap
    studentId: string;          // maSoSinhVien
    semesterId: string;         // maHocKy
    remainingAmount: number;    // soTienConLai - Only field for money in new schema
    maxCredits: number;         // soTinChiToiDa
}

// Enhanced registration with calculated amounts for tuition service
export interface IEnhancedRegistration extends IRegistration {
    registrationAmount: number; // Calculated from courses
    requiredAmount: number;     // After discount
    paidAmount: number;         // From payment history
    // remainingAmount: number; // Already in base interface
}

export interface IRegistrationDetail {
    registrationId: string;     // maPhieuDangKy
    courseId: string;          // maMonHoc
    // Computed fields from JOINs
    courseName?: string;       // From MONHOC.TenMonHoc
    credits?: number;          // From LOAIMON.SoTiet
    courseType?: string;       // From LOAIMON.TenLoaiMon
    fee?: number;             // From LOAIMON.SoTienMotTC
}

// UI presentation interface for student academic history
export interface IStudentAcademicRecord {
    studentId: string;
    studentName: string;
    registrations: Array<{
        registration: IRegistration;
        courses: IRegistrationDetail[];
        semesterInfo: {
            semesterId: string;
            semesterName: string;
            year: number;
            startDate: Date;
            endDate: Date;
        };
    }>;
}