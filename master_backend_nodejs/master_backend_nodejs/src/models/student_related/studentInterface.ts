// Consolidated Student Interface - Main interface file for all student-related types
export interface IStudent {
    // Schema fields (mapped to Vietnamese database fields)
    studentId: string;         // MaSoSinhVien
    fullName: string;          // HoTen
    dateOfBirth: Date;         // NgaySinh
    gender: string;            // GioiTinh
    hometown: string;          // QueQuan
    districtId: string;        // MaHuyen
    priorityObjectId: string;  // MaDoiTuongUT
    majorId: string;           // MaNganh

    // Additional fields from database schema
    email?: string;            // Email
    phone?: string;            // SoDienThoai
    address?: string;          // DiaChi - THÊM MỚI theo schema
    
    // Computed fields from JOINs (for display)
    districtName?: string;     // from HUYEN.TenHuyen
    provinceName?: string;     // from TINH.TenTinh
    priorityName?: string;     // from DOITUONGUUTIEN.TenDoiTuong
    majorName?: string;        // from NGANHHOC.TenNganh
    facultyName?: string;      // from KHOA.TenKhoa
}

// Simple interface for backward compatibility
export interface IStudentSchedule {
    student: IStudent;
    semester: string;
    courses: any[];
}