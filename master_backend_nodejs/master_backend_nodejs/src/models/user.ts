export interface User
{
    id: number;
    status: boolean;
    name: string;
    email: string;
    password: string;
    role: "student" | "admin" | "financial" | "academic";
}