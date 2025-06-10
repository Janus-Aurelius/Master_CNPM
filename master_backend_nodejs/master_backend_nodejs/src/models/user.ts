export interface IUser {
    // Schema fields (mapped to Vietnamese database fields)
    username: string;           // tenDangNhap
    userId: string;             // userID
    password: string;           // matKhau
    groupId: string;            // maNhom
    studentId?: string;         // maSoSinhVien

    // Additional UI fields
    status?: boolean;
    name?: string;
    email?: string;
    role?: "student" | "admin" | "financial" | "academic";
    createdAt?: Date;
    updatedAt?: Date;
}