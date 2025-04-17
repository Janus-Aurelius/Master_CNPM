import { User } from "./user";

export default interface AdminRequest {
    id: number;
    adminId: string;
    requestType: "user_management" | "course_management" | "payment_management" | "system_settings";
    requestDate: string;
    status: "pending" | "approved" | "rejected";
    description: string;
    actionDate?: string;
    actionBy?: string;
    targetId?: string; // ID of the entity being modified (user, course, etc.)
    changes?: Record<string, any>; // Details of the changes being requested
    priority: "low" | "medium" | "high";
    notes?: string;
}
