import { IEnrollment } from '../../models/student_related/student-enrollment.interface';

interface EnrolledSubject {
    id: string;
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
}

export class EnrollmentService {
    public async getEnrolledSubjects(studentId: string, semester: string): Promise<EnrolledSubject[]> {
        try {
            // TODO: Get enrolled subjects from database based on studentId and semester
            return [
                {
                    id: "IT001",
                    name: "Nhập môn lập trình",
                    lecturer: "TS. Nguyễn Văn A",
                    day: "Thứ 2",
                    session: "1",
                    fromTo: "Tiết 1-4"
                }
            ];
        } catch (error) {
            throw new Error("Error fetching enrolled subjects");
        }
    }

    public async cancelRegistration(studentId: string, courseId: string): Promise<void> {
        try {
            // TODO:
            // 1. Check if cancellation is allowed (e.g., within registration period)
            // 2. Remove enrollment record from database
            // 3. Update available slots for the course
            
            // For now, just simulate success
            return;
        } catch (error) {
            throw new Error("Error cancelling registration");
        }
    }

    public async getEnrollmentDetails(studentId: string, courseId: string): Promise<IEnrollment> {
        try {
            // TODO: Get enrollment details from database
            return {
                id: "1",
                studentId: studentId,
                courseId: courseId,
                courseName: "Nhập môn lập trình",
                semester: "HK1 2023-2024",
                status: "registered",
                credits: 4
            };
        } catch (error) {
            throw new Error("Error fetching enrollment details");
        }
    }
} 