// src/services/AdminService/activitylogService.ts
export const getActivityLogs = async (page: number, size: number) => {
    // Dữ liệu mock, sau này thay bằng truy vấn DB thực tế
    const logs = [
        {
            user: "admin@example.com",
            action: "User created",
            resource: "users/1234",
            timestamp: "2023-08-10 14:32:45",
            status: "success"
        },
        {
            user: "financial@example.com",
            action: "Payment processed",
            resource: "payments/456",
            timestamp: "2023-08-10 13:15:22",
            status: "success"
        },
        {
            user: "academic@example.com",
            action: "Course updated",
            resource: "courses/CS101",
            timestamp: "2023-08-10 12:45:01",
            status: "warning"
        },
        {
            user: "student@example.com",
            action: "Login attempt",
            resource: "auth/login",
            timestamp: "2023-08-10 11:30:18",
            status: "error"
        },
        {
            user: "admin@example.com",
            action: "System backup",
            resource: "system/backup",
            timestamp: "2023-08-10 10:00:00",
            status: "success"
        }
    ];
    const start = (page - 1) * size;
    const end = start + size;
    return {
        logs: logs.slice(start, end),
        total: logs.length,
        page,
        size
    };
};