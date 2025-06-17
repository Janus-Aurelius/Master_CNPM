import Course from './course';

export default interface ISemester {
    // Schema fields (mapped to Vietnamese database HOCKYNAMHOC)
    semesterId: string;         // MaHocKy (Primary Key)
    termNumber: number;         // HocKyThu (1, 2, 3 - for Fall, Spring, Summer)
    feeDeadline: Date;          // ThoiHanDongHP

    // Computed/derived fields
    year: string;               // Extract from MaHocKy (e.g., "2024" from "2024_1")
    academicYear: string;       // e.g., "2024-2025"
    semesterName: string;       // e.g., "Fall 2024", "Spring 2025"

    // Additional UI fields
    startDate?: Date;           // For UI display
    endDate?: Date;             // For UI display
    courses?: Course[];         // For UI display
}