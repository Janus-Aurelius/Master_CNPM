// Schema-based interfaces - Database driven
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