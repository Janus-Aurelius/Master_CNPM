import Course from "./course";

export interface ICurriculum {
    // Schema fields (mapped to Vietnamese database CHUONGTRINHHOC)
    // Composite primary key: (MaNganh, MaHocKy, MaMonHoc)
    majorId: string;            // MaNganh
    semesterId: string;         // MaHocKy
    courseId: string;           // MaMonHoc
    note?: string;              // GhiChu

    // Computed fields from JOINs
    majorName?: string;         // from NGANHHOC.TenNganh
    courseName?: string;        // from MONHOC.TenMonHoc
    courseTypeName?: string;    // from LOAIMON.TenLoaiMon
    facultyName?: string;       // from KHOA.TenKhoa
    totalHours?: number;        // from MONHOC.SoTiet
    credits?: number;           // calculated from LOAIMON
    
    // Additional UI fields
    name?: string;
    courseList?: Course[];
    major?: string;
    totalCredit?: number;
}