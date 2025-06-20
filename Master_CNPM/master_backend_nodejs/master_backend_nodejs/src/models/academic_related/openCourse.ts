export interface IOfferedCourse {
    // Schema fields (mapped to Vietnamese database schema DANHSACHMONHOCMO)
    semesterId: string;         // MaHocKy
    courseId: string;           // MaMonHoc
    minStudents: number;        // SiSoToiThieu
    maxStudents: number;        // SiSoToiDa
    currentStudents: number;    // SoSVDaDangKy
    dayOfWeek: number;          // Thu (1-7)
    startPeriod: number;        // TietBatDau
    endPeriod: number;          // TietKetThuc

    // Computed fields from JOINs
    courseName?: string;        // from MONHOC.TenMonHoc
    courseTypeId?: string;      // from MONHOC.MaLoaiMon
    courseTypeName?: string;    // from LOAIMON.TenLoaiMon
    totalHours?: number;        // from MONHOC.SoTiet
    hoursPerCredit?: number;    // from LOAIMON.SoTietMotTC
    pricePerCredit?: number;    // from LOAIMON.SoTienMotTC
    
    // Additional UI fields
    isAvailable?: boolean;      // currentStudents < maxStudents
    registrationStartDate?: string;
    registrationEndDate?: string;
}