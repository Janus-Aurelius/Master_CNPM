// models/audit/auditLog.ts
export interface IAuditLog {
    id: number;
    user_id: string;
    action_type: string;
    status: string;
    created_at: Date;
    ip_address?: string;
    user_agent?: string;
}