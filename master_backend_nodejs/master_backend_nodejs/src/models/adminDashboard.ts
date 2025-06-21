// models/adminDashboard.ts
export interface DashboardSummary {
    totalStudents: number;      // Từ bảng students
    pendingPayments: number;    // Từ bảng payments với status = 'pending'
    newRegistrations: number;   // Từ bảng registrations với created_at trong 7 ngày gần nhất
    systemAlerts: number;       // Từ bảng system_warnings với resolved = false
}

export interface RecentActivity {
    id: number;
    message: string;
    time: string;
    severity: 'info' | 'warning' | 'error';
}