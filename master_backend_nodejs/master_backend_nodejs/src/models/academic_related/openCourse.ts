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
      // Academic year and semester info from HOCKYNAMHOC
    semesterNumber?: number;    // from HOCKYNAMHOC.HocKyThu
    academicYear?: number;      // from HOCKYNAMHOC.NamHoc
    
    // Status
    status?: string;            // 'Mở' | 'Đầy'
    
    // Additional UI fields
    registrationStartDate?: string;
    registrationEndDate?: string;
}