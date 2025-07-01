// src/models/course.ts
export default interface ICourse {
    // Schema fields (mapped to Vietnamese database fields)
    courseId: string;          // MaMonHoc
    courseName: string;        // TenMonHoc
    courseTypeId: string;      // MaLoaiMon
    totalHours: number;        // SoTiet

    // Computed fields from JOIN with LOAIMON table
    courseTypeName?: string;   // TenLoaiMon
    hoursPerCredit?: number;   // SoTietMotTC
    pricePerCredit?: number;   // SoTienMotTC
    totalCredits?: number;     // SoTiet / SoTietMotTC (computed)
    totalPrice?: number;       // totalCredits * SoTienMotTC (computed)
}
