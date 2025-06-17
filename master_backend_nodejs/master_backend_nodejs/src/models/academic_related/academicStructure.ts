// Academic Structure Interfaces - Maps to database schema

export interface Faculty {
    facultyId: string;    // MaKhoa
    facultyName: string;  // TenKhoa
}

export interface Major {
    majorId: string;      // MaNganh  
    majorName: string;    // TenNganh
    facultyId: string;    // MaKhoa
    facultyName?: string; // computed from JOIN
}

export interface CourseType {
    courseTypeId: string;     // MaLoaiMon
    courseTypeName: string;   // TenLoaiMon
    hoursPerCredit: number;   // SoTietMotTC
    pricePerCredit: number;   // SoTienMotTC
}

export interface District {
    districtId: string;   // MaHuyen
    districtName: string; // TenHuyen
    provinceId: string;   // MaTinh
    provinceName?: string; // computed from JOIN
}

export interface Province {
    provinceId: string;   // MaTinh
    provinceName: string; // TenTinh
}

export interface PriorityGroup {
    priorityId: string;        // MaDoiTuong
    priorityName: string;      // TenDoiTuong
    feeDiscountAmount: number; // MucGiamHocPhi
}
