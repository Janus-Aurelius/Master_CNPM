import { IStudentSchedule } from '../../models/student_related/studentInterface';
import { IStudentOverview, IClass } from '../../models/student_related/studentDashboardInterface';
import { IStudent } from '../../models/student_related/studentInterface';
import { DatabaseService } from '../database/databaseService';

export const dashboardService = {
    async getStudentOverview(studentId: string): Promise<IStudentOverview | null> {
        try {
            // Get student info
            const student = await DatabaseService.queryOne(`
                SELECT 
                    student_id as "studentId",
                    name,
                    email,
                    phone,
                    address,
                    date_of_birth as "dateOfBirth",
                    enrollment_year as "enrollmentYear",
                    major,
                    faculty,
                    program,
                    status,
                    avatar_url as "avatarUrl",
                    completed_credits as "completedCredits",
                    current_credits as "currentCredits",
                    required_credits as "requiredCredits"
                FROM students 
                WHERE student_id = $1
            `, [studentId]);

            if (!student) return null;

            // Get enrolled subjects count and total credits
            const enrollmentStats = await DatabaseService.queryOne<{enrolled_count: number, total_credits: number}>(`
                SELECT 
                    COUNT(*) as enrolled_count,
                    SUM(s.credits) as total_credits
                FROM enrollments e
                JOIN subjects s ON e.course_id = s.id
                WHERE e.student_id = $1 AND e.is_enrolled = true
            `, [studentId]);

            // Get GPA
            const gpa = await DatabaseService.queryOne<{gpa: number}>(`
                SELECT COALESCE(AVG(total_grade), 0) as gpa
                FROM grades
                WHERE student_id = $1
            `, [studentId]);

            // Get upcoming classes
            const upcomingClasses = await DatabaseService.query<IClass>(`
                SELECT 
                    c.id,
                    s.id as subject_id,
                    s.name as subject_name,
                    s.lecturer,
                    c.day,
                    CASE 
                        WHEN c.session = '1' THEN '7:30-9:30'
                        WHEN c.session = '2' THEN '9:30-11:30'
                        WHEN c.session = '3' THEN '13:30-15:30'
                        ELSE '15:30-17:30'
                    END as time,
                    c.room
                FROM classes c
                JOIN subjects s ON c.subject_id = s.id
                JOIN enrollments e ON s.id = e.course_id
                WHERE e.student_id = $1 
                AND e.is_enrolled = true
                AND c.day >= CURRENT_DATE
                ORDER BY c.day, c.session
                LIMIT 5
            `, [studentId]);

            // Get recent payments
            const recentPayments = await DatabaseService.query(`
                SELECT 
                    id,
                    student_id as "studentId",
                    amount,
                    payment_date as "paymentDate",
                    status,
                    payment_method as "paymentMethod"
                FROM payments
                WHERE student_id = $1
                ORDER BY payment_date DESC
                LIMIT 5
            `, [studentId]);

            return {
                student: {
                    studentId: student.studentId,
                    name: student.name,
                    email: student.email,
                    phone: student.phone,
                    address: student.address,
                    dateOfBirth: student.dateOfBirth,
                    enrollmentYear: student.enrollmentYear,
                    major: student.major,
                    faculty: student.faculty,
                    program: student.program,
                    status: student.status,
                    avatarUrl: student.avatarUrl,
                    credits: {
                        completed: student.completedCredits,
                        current: student.currentCredits,
                        required: student.requiredCredits
                    }
                },
                enrolledSubjects: enrollmentStats?.enrolled_count || 0,
                totalCredits: enrollmentStats?.total_credits || 0,
                gpa: gpa?.gpa || 0,
                upcomingClasses,
                recentPayments
            };
        } catch (error) {
            console.error('Error getting student overview:', error);
            throw error;
        }
    },

    async getStudentSchedule(studentId: string): Promise<IStudentSchedule | null> {
        try {
            // Get student info
            const student = await DatabaseService.queryOne(`
                SELECT 
                    student_id as "studentId",
                    name,
                    email,
                    phone,
                    address,
                    date_of_birth as "dateOfBirth",
                    enrollment_year as "enrollmentYear",
                    major,
                    faculty,
                    program,
                    status,
                    avatar_url as "avatarUrl",
                    completed_credits as "completedCredits",
                    current_credits as "currentCredits",
                    required_credits as "requiredCredits"
                FROM students 
                WHERE student_id = $1
            `, [studentId]);

            if (!student) return null;

            // Get current semester
            const currentSemester = await DatabaseService.queryOne<{semester: string}>(`
                SELECT semester 
                FROM enrollments 
                WHERE student_id = $1 
                AND is_enrolled = true
                ORDER BY semester DESC
                LIMIT 1
            `, [studentId]);

            if (!currentSemester) return null;

            // Get enrolled subjects with schedule
            const subjects = await DatabaseService.query(`
                SELECT 
                    s.id,
                    s.name,
                    s.credits,
                    s.lecturer,
                    json_agg(
                        json_build_object(
                            'day', c.day,
                            'time', CASE 
                                WHEN c.session = '1' THEN '7:30-9:30'
                                WHEN c.session = '2' THEN '9:30-11:30'
                                WHEN c.session = '3' THEN '13:30-15:30'
                                ELSE '15:30-17:30'
                            END,
                            'room', c.room
                        )
                    ) as schedule
                FROM subjects s
                JOIN enrollments e ON s.id = e.course_id
                JOIN classes c ON s.id = c.subject_id
                WHERE e.student_id = $1 
                AND e.semester = $2
                AND e.is_enrolled = true
                GROUP BY s.id, s.name, s.credits, s.lecturer
            `, [studentId, currentSemester.semester]);

            return {
                student: {
                    studentId: student.studentId,
                    name: student.name,
                    email: student.email,
                    phone: student.phone,
                    address: student.address,
                    dateOfBirth: student.dateOfBirth,
                    enrollmentYear: student.enrollmentYear,
                    major: student.major,
                    faculty: student.faculty,
                    program: student.program,
                    status: student.status,
                    avatarUrl: student.avatarUrl,
                    credits: {
                        completed: student.completedCredits,
                        current: student.currentCredits,
                        required: student.requiredCredits
                    }
                },
                semester: currentSemester.semester,
                subjects: subjects.map(s => ({
                    id: s.id,
                    name: s.name,
                    credit: s.credits,
                    schedule: s.schedule,
                    lecturer: s.lecturer
                }))
            };
        } catch (error) {
            console.error('Error getting student schedule:', error);
            throw error;
        }
    },

    async updateStudentOverview(overview: IStudentOverview): Promise<IStudentOverview> {
        try {
            // Update student info
            await DatabaseService.query(`
                UPDATE students 
                SET 
                    name = $1,
                    email = $2,
                    phone = $3,
                    address = $4,
                    updated_at = NOW()
                WHERE student_id = $5
            `, [
                overview.student.name,
                overview.student.email,
                overview.student.phone,
                overview.student.address,
                overview.student.studentId
            ]);

            // Return updated overview
            const updatedOverview = await this.getStudentOverview(overview.student.studentId);
            if (!updatedOverview) {
                throw new Error('Failed to get updated overview');
        }
            return updatedOverview;
        } catch (error) {
            console.error('Error updating student overview:', error);
            throw error;
        }
    }
};