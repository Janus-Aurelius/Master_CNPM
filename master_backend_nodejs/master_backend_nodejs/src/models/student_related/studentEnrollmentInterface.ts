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

export interface IRegistrationDetail {
    registrationId: string;     // maPhieuDangKy
    subjectId: string;          // maMonHoc
}

// Additional UI interfaces
export interface IEnrollment {
    id: string;
    studentId: string;
    courseId: string;
    courseName: string;
    semester: string;
    isEnrolled: boolean; // true = enrolled, false = not enrolled/dropped
    credits: number;
    midtermGrade?: number;
    finalGrade?: number;
}

export interface IEnrolledSubject {
    enrollment: IEnrollment;
    subjectDetails: {
        id: string;
        name: string;
        lecturer: string;
        credits: number;
        maxStudents: number;
        currentStudents: number;
        schedule: {
            day: string;
            session: string;
            room: string;
        }[];
    };
    grade: {
        midterm?: number;
        final?: number;
        total?: number;
        letter?: string;
    } | null;
    attendanceRate: number;
}