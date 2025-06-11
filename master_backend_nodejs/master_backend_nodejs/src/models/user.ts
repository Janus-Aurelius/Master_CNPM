export interface IUser {
    // Schema fields (mapped to Vietnamese database fields)
    username: string;           // TenDangNhap
    userId: string;             // UserID
    password: string;           // MatKhau
    groupId: string;            // MaNhom
    studentId?: string;         // MaSoSinhVien

    // Additional UI fields
    status?: boolean;
    name?: string;
    email?: string;
    role?: "student" | "admin" | "financial" | "academic";
    createdAt?: Date;
    updatedAt?: Date;
}