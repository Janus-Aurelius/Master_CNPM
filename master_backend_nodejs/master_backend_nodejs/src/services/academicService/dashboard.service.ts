// src/services/academicService/dashboard.service.ts
interface AcademicDashboardStats {
    totalSubjects: number;
    totalOpenCourses: number;
    totalPrograms: number;
    pendingRequests: number;
    recentActivities: RecentActivity[];
}

interface RecentActivity {
    id: string;
    type: 'subject_created' | 'course_opened' | 'request_submitted' | 'program_updated';
    description: string;
    timestamp: string;
    user: string;
}

interface SubjectStatistics {
    byDepartment: { department: string; count: number }[];
    byCredits: { credits: number; count: number }[];
    totalCreditsOffered: number;
}

interface CourseStatistics {
    bySemester: { semester: string; count: number }[];
    byStatus: { status: string; count: number }[];
    totalEnrollments: number;
    averageEnrollmentRate: number;
}

// Mock data
const mockStats: AcademicDashboardStats = {
    totalSubjects: 245,
    totalOpenCourses: 89,
    totalPrograms: 12,
    pendingRequests: 15,
    recentActivities: [
        {
            id: '1',
            type: 'subject_created',
            description: 'Môn học "Trí tuệ nhân tạo nâng cao" đã được tạo',
            timestamp: '2025-06-05T10:30:00Z',
            user: 'TS. Nguyễn Văn A'
        },
        {
            id: '2',
            type: 'course_opened',
            description: 'Lớp học phần IT001 đã được mở cho HK1 2025-2026',
            timestamp: '2025-06-05T09:15:00Z',
            user: 'PGS. Trần Thị B'
        },
        {
            id: '3',
            type: 'request_submitted',
            description: 'Yêu cầu thêm môn học từ sinh viên SV001',
            timestamp: '2025-06-05T08:45:00Z',
            user: 'Nguyễn Minh C'
        }
    ]
};

const mockSubjectStats: SubjectStatistics = {
    byDepartment: [
        { department: 'Khoa học máy tính', count: 98 },
        { department: 'Công nghệ thông tin', count: 87 },
        { department: 'Toán học', count: 45 },
        { department: 'Vật lý', count: 15 }
    ],
    byCredits: [
        { credits: 2, count: 45 },
        { credits: 3, count: 125 },
        { credits: 4, count: 65 },
        { credits: 5, count: 10 }
    ],
    totalCreditsOffered: 735
};

const mockCourseStats: CourseStatistics = {
    bySemester: [
        { semester: 'HK1 2024-2025', count: 45 },
        { semester: 'HK2 2024-2025', count: 44 }
    ],
    byStatus: [
        { status: 'open', count: 67 },
        { status: 'closed', count: 15 },
        { status: 'cancelled', count: 7 }
    ],
    totalEnrollments: 2456,
    averageEnrollmentRate: 78.5
};

export const academicDashboardService = {
    async getDashboardStats(): Promise<AcademicDashboardStats> {
        // TODO: Implement real database queries
        return mockStats;
    },

    async getSubjectStatistics(): Promise<SubjectStatistics> {
        // TODO: Implement real database queries
        return mockSubjectStats;
    },

    async getCourseStatistics(): Promise<CourseStatistics> {
        // TODO: Implement real database queries
        return mockCourseStats;
    },

    async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
        // TODO: Implement real database queries
        return mockStats.recentActivities.slice(0, limit);
    },

    async getPendingRequestsCount(): Promise<number> {
        // TODO: Implement real database queries
        return mockStats.pendingRequests;
    }
};
