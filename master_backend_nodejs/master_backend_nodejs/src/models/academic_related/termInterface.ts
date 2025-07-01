// Interface for Academic Term (Học kỳ năm học)
export interface ITerm {
    // Schema fields (mapped to Vietnamese database fields)
    termId: string;           // MaHocKy
    termNumber: number;       // HocKyThu (1, 2, 3)
    startDate: Date;          // ThoiGianBatDau
    endDate: Date;            // ThoiGianKetThuc
    status: string;           // TrangThaiHocKy
    academicYear: number;     // NamHoc
    tuitionDeadline: Date;    // ThoiHanDongHP
}

// Interface for creating/updating terms
export interface ITermCreate {
    termId: string;
    termNumber: number;
    startDate: Date;
    endDate: Date;
    status: string;
    academicYear: number;
    tuitionDeadline: Date;
}

// Interface for term filters
export interface ITermFilter {
    academicYear?: number;
    status?: string;
    termNumber?: number;
}
