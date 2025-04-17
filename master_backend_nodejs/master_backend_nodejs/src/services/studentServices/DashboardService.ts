import { IStudent, IStudentDashboard } from '../../models/student_related/student.interface';

interface Schedule {
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    room: string;
}

export class DashboardService {
    public async getStudentDashboard(studentId: string): Promise<IStudentDashboard> {
        try {
            // TODO: Get data from database
            const studentData: IStudent = {
                id: studentId,
                studentId: "20120123",
                name: "Nguyen Van A",
                email: "20120123@student.hcmus.edu.vn",
                major: "Công nghệ thông tin",
                class: "20CLC01",
                status: "active"
            };

            const schedule: Schedule[] = [
                {
                    day: "Thứ 2",
                    startTime: "07:30",
                    endTime: "11:30",
                    subject: "Nhập môn lập trình",
                    room: "F201"
                }
            ];

            return {
                student: studentData,
                schedule: schedule,
                currentSemester: "HK1 2023-2024",
                totalCredits: 18,
                gpa: 3.5
            };
        } catch (error) {
            throw new Error("Error fetching dashboard data");
        }
    }

    public async getTimeTable(studentId: string, semester: string): Promise<Schedule[]> {
        try {
            // TODO: Get timetable from database based on studentId and semester
            return [
                {
                    day: "Thứ 2",
                    startTime: "07:30",
                    endTime: "11:30",
                    subject: "Nhập môn lập trình",
                    room: "F201"
                }
            ];
        } catch (error) {
            throw new Error("Error fetching timetable");
        }
    }
} 