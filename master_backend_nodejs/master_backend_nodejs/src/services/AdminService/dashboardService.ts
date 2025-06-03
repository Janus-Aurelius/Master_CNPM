// src/services/AdminService/dashboardService.ts
export const getDashboardStats = async () => {
    // Dữ liệu mock, sau này thay bằng truy vấn DB thực tế
    return {
        totalStudents: 1247,
        pendingPayments: 34,
        newRegistrations: 56,
        systemWarnings: 3
    };
};