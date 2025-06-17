export interface IUser {
    // Schema fields (mapped to Vietnamese database fields)
    username: string;           // TenDangNhap
    userId: string;             // UserID
    password: string;           // MatKhau
    groupId: string;            // MaNhom
    studentId?: string;         // MaSoSinhVien

    // Additional UI fields
    status?: string;
    name?: string;
    email?: string;
    role?: "N1" | "N2" | "N3" | "N4";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserSearchResult {
    id: string;           // UserID
    name: string;         // HoTen từ SINHVIEN
    studentId: string;    // MaSoSinhVien
    role: string;         // MaNhom
    status: string;       // TrangThai
    department: string;   // TenKhoa từ KHOA
}