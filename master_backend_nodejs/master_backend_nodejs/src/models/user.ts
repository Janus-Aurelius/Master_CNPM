export interface User
{
    id: string;
    status: boolean;
    name: string;
    email: string;
    password: string;
    role: "student" | "admin" | "financial" | "academic";
}