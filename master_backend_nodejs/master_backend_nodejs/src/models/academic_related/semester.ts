import Course from './course';

export default interface ISemester {
    // Schema fields (mapped to Vietnamese database HOCKYNAMHOC)
    semesterId: string;         // MaHocKy (Primary Key)
    termNumber: number;         // HocKyThu (1, 2, 3 - for Fall, Spring, Summer)
    startDate: Date;            // ThoiGianBatDau
    endDate: Date;              // ThoiGianKetThuc
    status: string;             // TrangThaiHocKy
    academicYear: number;       // NamHoc
    feeDeadline: Date;          // ThoiHanDongHP

    // Computed/derived fields for UI display
    year?: string;              // Extract from academicYear (e.g., "2024")
    academicYearDisplay?: string; // e.g., "2024-2025"
    semesterName?: string;      // e.g., "HK1", "HK2", "HK3"
    
    // Additional UI fields
    courses?: Course[];         // For UI display
}

// Interface for creating semesters
export interface ISemesterCreate {
    semesterId: string;
    termNumber: number;
    startDate: Date;
    endDate: Date;
    status: string;
    academicYear: number;
    feeDeadline: Date;
}

// Interface for updating semesters (only editable fields)
export interface ISemesterUpdate {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    feeDeadline?: Date;
}

// Interface for semester filters
export interface ISemesterFilter {
    academicYear?: number;
    status?: string;
    termNumber?: number;
}