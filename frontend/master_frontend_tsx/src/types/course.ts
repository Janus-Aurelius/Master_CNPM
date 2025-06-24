export interface Subject {
    // Keep camelCase for backward compatibility
    maMonHoc?: string;
    tenMonHoc?: string;
    maLoaiMon?: string;
    soTiet?: number;
    credits?: number;
    // Actual fields from backend (lowercase)
    mamonhoc?: string;
    tenmonhoc?: string;
    maloaimon?: string;
    sotiet?: number;
}