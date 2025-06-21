// Academic Structure Interfaces - Maps to database schema

export interface Faculty {
    facultyId: string;    // MaKhoa
    facultyName: string;  // TenKhoa
}

export interface Major {
    maNganh: string;      // MaNganh  
    tenNganh: string;     // TenNganh
    maKhoa: string;       // MaKhoa
    tenKhoa?: string;     // computed from JOIN
}

export interface CourseType {
    courseTypeId: string;     // MaLoaiMon
    courseTypeName: string;   // TenLoaiMon
    hoursPerCredit: number;   // SoTietMotTC
    pricePerCredit: number;   // SoTienMotTC
}

export interface District {
    maHuyen: string;   // MaHuyen
    tenHuyen: string; // TenHuyen
    maTinh: string;   // MaTinh
    tenTinh?: string; // computed from JOIN
}

export interface Province {
    maTinh: string;   // MaTinh
    tenTinh: string; // TenTinh
}

export interface PriorityGroup {
    maDoiTuong: string;        // MaDoiTuong
    tenDoiTuong: string;      // TenDoiTuong
    mucGiamHocPhi: number; // MucGiamHocPhi
}
