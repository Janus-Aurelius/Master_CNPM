import { DashboardService } from '../../services/studentServices';
import { IStudentDashboard } from '../../models/student_related/student.interface';

class DashboardManager {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    public async getStudentDashboard(studentId: string): Promise<IStudentDashboard> {
        try {
            // Validate studentId
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            // Get dashboard data
            const dashboardData = await this.dashboardService.getStudentDashboard(studentId);

            // Additional business logic can be added here
            // For example: calculating GPA, checking student status, etc.

            return dashboardData;
        } catch (error) {
            throw error;
        }
    }

    public async getTimeTable(studentId: string, semester: string) {
        try {
            // Validate inputs
            if (!studentId || !semester) {
                throw new Error('Student ID and semester are required');
            }

            // Validate semester format (you can add more validation)
            const semesterPattern = /^HK[1-3] \d{4}-\d{4}$/;
            if (!semesterPattern.test(semester)) {
                throw new Error('Invalid semester format');
            }

            // Get timetable
            const timetable = await this.dashboardService.getTimeTable(studentId, semester);

            // Additional business logic can be added here
            // For example: sorting by day/time, filtering by week, etc.

            return timetable;
        } catch (error) {
            throw error;
        }
    }
}

export default new DashboardManager(); 