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

 