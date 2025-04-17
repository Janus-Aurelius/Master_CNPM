// src/models/user.ts
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "student" | "admin" | "financial" | "academic";
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    phoneNumber?: string;
    address?: string;
    avatar?: string;
    lastLogin?: Date;
}

// Định nghĩa các interface phụ trợ cho việc tạo và cập nhật user
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role: "student" | "admin" | "financial" | "academic";
    phoneNumber?: string;
    address?: string;
    avatar?: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    role?: "student" | "admin" | "financial" | "academic";
    status?: boolean;
    phoneNumber?: string;
    address?: string;
    avatar?: string;
}

// Interface cho response khi trả về user (loại bỏ password)
export interface UserResponse extends Omit<User, 'password'> {
    // Thêm các trường bổ sung nếu cần
}