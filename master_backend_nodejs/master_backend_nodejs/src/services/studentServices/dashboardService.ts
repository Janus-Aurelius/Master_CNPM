import { IStudentSchedule } from '../../models/student_related/studentInterface';
import {IStudentOverview} from '../../models/student_related/studentDashboardInterface';
import { IStudent } from '../../models/student_related/studentInterface';

// TODO: Replace with actual database implementation
const students: IStudent[] = [];
const schedules: IStudentSchedule[] = [];
const overviews: IStudentOverview[] = [];

export const dashboardService = {
    async getStudentOverview(studentId: string): Promise<IStudentOverview | null> {
        // TODO: Implement database query
        return overviews.find(overview => overview.student.studentId === studentId) || null;
    },

    async getStudentSchedule(studentId: string): Promise<IStudentSchedule | null> {
        // TODO: Implement database query
        return schedules.find(schedule => schedule.student.studentId === studentId) || null;
    },

    async updateStudentOverview(overview: IStudentOverview): Promise<IStudentOverview> {
        // TODO: Implement database update
        const index = overviews.findIndex(o => o.student.studentId === overview.student.studentId);
        if (index !== -1) {
            overviews[index] = overview;
        } else {
            overviews.push(overview);
        }
        return overview;
    }
};