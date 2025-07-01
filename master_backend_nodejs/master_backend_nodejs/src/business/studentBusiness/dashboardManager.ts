import { dashboardService } from '../../services/studentService/dashboardService';
import { OpenCourseService } from '../../services/courseService/openCourse.service';
import { IStudentOverview } from '../../models/student_related/studentDashboardInterface';
import { DatabaseService } from '../../services/database/databaseService';
import { IPayment } from '../../models/payment';
import tuitionManager from './tuitionManager';

class DashboardManager {
    public async getStudentDashboard(studentId: string): Promise<IStudentOverview | null> {
        try {
            // Validate studentId
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            // Get comprehensive student data from database
            const student = await DatabaseService.queryOne(`
                SELECT 
                    s.*,
                    p.name_year as program_name,
                    COUNT(e.id) as total_enrollments,
                    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses,
                    COUNT(CASE WHEN e.status = 'registered' THEN 1 END) as current_enrollments,
                    COALESCE(SUM(CASE WHEN e.status = 'completed' THEN e.credits END), 0) as credits_earned,
                    COALESCE(SUM(CASE WHEN e.status = 'registered' THEN e.credits END), 0) as current_credits,
                    COALESCE(AVG(CASE WHEN e.status = 'completed' AND e.total_grade IS NOT NULL THEN e.total_grade END), 0) as gpa
                FROM students s
                LEFT JOIN programs p ON s.major = p.major
                LEFT JOIN enrollments e ON s.student_id = e.student_id
                WHERE s.student_id = $1
                GROUP BY s.student_id, s.name, s.email, s.phone, s.address, s.major, s.enrollment_year, 
                         s.completed_credits, s.current_credits, s.required_credits, s.status, p.name_year
            `, [studentId]);

            if (!student) {
                return null;
            }            // Get upcoming classes for today and tomorrow
            const upcomingClasses = await this.getUpcomingClasses(studentId);

            // Get available open courses for registration
            const availableOpenCourses = await this.getAvailableOpenCourses(studentId);            // Get recent payments
            const recentPayments = await this.getRecentPayments(studentId);

            // Get current semester
            const semester = await DatabaseService.getCurrentSemester();// Build comprehensive dashboard overview
            const dashboardData: IStudentOverview = {
                student: {
                    studentId: student.student_id,
                    fullName: student.name,
                    dateOfBirth: student.date_of_birth || new Date(),
                    gender: student.gender,                    hometown: student.hometown ? JSON.parse(student.hometown) : undefined,                    districtId: student.district_id,
                    priorityObjectId: student.priority_object_id,
                    majorId: student.major,
                    email: student.email,
                    phone: student.phone                },
                enrolledCourses: parseInt(student.current_enrollments) || 0,
                totalCredits: parseInt(student.current_credits) || 0,
                gpa: parseFloat(student.gpa) || 0,
                availableOpenCourses: availableOpenCourses,
                recentPayments: recentPayments
            };

            return dashboardData;

        } catch (error) {
            console.error('Error getting student dashboard:', error);
            throw error;
        }
    }

    public async getTimeTable(studentId: string, semester: string) {
        try {
            // Validate inputs
            if (!studentId || !semester) {
                throw new Error('Student ID and semester are required');
            }

            // Get student's enrolled courses with schedule details
            const timetable = await DatabaseService.query(`
                SELECT 
                    e.course_name,
                    oc.subject_code,
                    oc.lecturer,
                    oc.schedule,
                    oc.room,
                    s.credits,
                    s.type,
                    e.status
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e.semester = $2
                AND e.status IN ('registered', 'enrolled')
                ORDER BY oc.schedule
            `, [studentId, semester]);

            // Transform schedule data into structured format
            const structuredTimetable = this.structureWeeklySchedule(timetable);

            return {
                semester: semester,
                studentId: studentId,
                weeklySchedule: structuredTimetable,
                totalCourses: timetable.length,
                totalCredits: timetable.reduce((sum, course) => sum + (course.credits || 0), 0)
            };

        } catch (error) {
            console.error('Error getting timetable:', error);
            throw error;
        }
    }

    /**
     * Get student's upcoming classes for the next 2 days
     */    private async getUpcomingClasses(studentId: string) {
        try {
            const currentSemester = await DatabaseService.queryOne(`
                SELECT current_semester FROM ACADEMIC_SETTINGS WHERE id = 1
            `);
            
            const semester = currentSemester?.current_semester || '2024-1';

            const classes = await DatabaseService.query(`
                SELECT 
                    e.course_name as name,
                    oc.subject_code as id,
                    oc.lecturer,
                    oc.schedule,
                    oc.room,
                    s.credits
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e.semester = $2
                AND e.status = 'registered'
                ORDER BY oc.schedule
                LIMIT 5
            `, [studentId, semester]);            return classes.map(cls => {
                const schedule = this.parseScheduleForUpcoming(cls.schedule);
                return {
                    id: cls.id,
                    courseId: cls.id,
                    courseName: cls.name,
                    lecturer: cls.lecturer,
                    day: schedule.day,
                    time: `${schedule.startTime}-${schedule.endTime}`,
                    room: cls.room
                };
            });

        } catch (error) {
            console.error('Error getting upcoming classes:', error);
            return [];
        }
    }

    /**
     * Get student's recent payment records
     */    private async getRecentPayments(studentId: string) {
        try {
            // Use the new tuition manager to get recent payments
            const recentPayments = await tuitionManager.getRecentPayments(studentId);            // Convert to IPayment format for dashboard
            return recentPayments.map(payment => ({
                paymentId: payment.paymentId,
                paymentDate: new Date(payment.paymentDate), // Convert string back to Date for IPayment interface
                registrationId: payment.registrationId,
                paymentAmount: payment.amount,
                status: 'paid' as const, // Assuming completed payments
                paymentMethod: 'cash' as const, // Default payment method
                transactionId: payment.paymentId
            }));

        } catch (error) {
            console.error('Error getting recent payments:', error);
            return [];
        }
    }

    /**
     * Get important alerts for the student
     */
    private async getStudentAlerts(studentId: string, semester: string) {
        try {
            const alerts = [];

            // Check for unpaid tuition
            const unpaidTuition = await DatabaseService.queryOne(`
                SELECT remaining_amount FROM tuition_records 
                WHERE student_id = $1 AND semester = $2 AND status != 'paid'
                ORDER BY due_date ASC LIMIT 1
            `, [studentId, semester]);

            if (unpaidTuition && parseFloat(unpaidTuition.remaining_amount) > 0) {
                alerts.push({
                    type: 'payment',
                    severity: 'high',
                    message: `Outstanding tuition payment: ${parseFloat(unpaidTuition.remaining_amount).toLocaleString()} VND`,
                    actionRequired: true
                });
            }

            // Check for low GPA
            const studentData = await DatabaseService.queryOne(`
                SELECT AVG(total_grade) as gpa FROM enrollments 
                WHERE student_id = (SELECT id FROM students WHERE student_id = $1)
                AND status = 'completed' AND total_grade IS NOT NULL
            `, [studentId]);

            const gpa = parseFloat(studentData?.gpa || '0');
            if (gpa > 0 && gpa < 2.0) {
                alerts.push({
                    type: 'academic',
                    severity: 'high',
                    message: `Low GPA warning: ${gpa.toFixed(2)}. Academic support recommended.`,
                    actionRequired: true
                });
            }

            // Check for registration deadlines
            const registrationDeadlines = await DatabaseService.query(`
                SELECT subject_name, registration_end_date 
                FROM open_courses oc
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE oc.semester = $1 
                AND oc.registration_end_date > CURRENT_DATE 
                AND oc.registration_end_date <= CURRENT_DATE + INTERVAL '7 days'
                AND oc.status = 'open'
            `, [semester]);

            registrationDeadlines.forEach(deadline => {
                alerts.push({
                    type: 'registration',
                    severity: 'medium',
                    message: `Registration deadline approaching for ${deadline.subject_name}`,
                    actionRequired: false
                });
            });

            return alerts;

        } catch (error) {
            console.error('Error getting student alerts:', error);
            return [];
        }
    }

    /**
     * Structure timetable data into weekly format
     */
    private structureWeeklySchedule(courses: any[]) {
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklySchedule: any = {};

        weekDays.forEach(day => {
            weeklySchedule[day] = [];
        });

        courses.forEach(course => {
            const schedule = this.parseScheduleForUpcoming(course.schedule);
            if (schedule.day && weeklySchedule[schedule.day]) {
                weeklySchedule[schedule.day].push({
                    courseCode: course.subject_code,
                    courseName: course.course_name,
                    lecturer: course.lecturer,
                    room: course.room,
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                    credits: course.credits,
                    type: course.type,
                    status: course.status
                });
            }
        });

        // Sort courses within each day by start time
        Object.keys(weeklySchedule).forEach(day => {
            weeklySchedule[day].sort((a: any, b: any) => {
                return a.startTime.localeCompare(b.startTime);
            });
        });

        return weeklySchedule;
    }

    /**
     * Parse schedule string for upcoming classes
     */
    private parseScheduleForUpcoming(scheduleStr: string) {
        try {
            if (!scheduleStr) {
                return { day: 'TBD', startTime: '00:00', endTime: '00:00' };
            }

            // Parse format: "MON 08:00-10:00" or "Monday 08:00-10:00"
            const parts = scheduleStr.trim().split(' ');
            if (parts.length < 2) {
                return { day: 'TBD', startTime: '00:00', endTime: '00:00' };
            }

            const dayMap: any = {
                'MON': 'Monday', 'TUE': 'Tuesday', 'WED': 'Wednesday',
                'THU': 'Thursday', 'FRI': 'Friday', 'SAT': 'Saturday', 'SUN': 'Sunday'
            };

            const dayCode = parts[0].toUpperCase();
            const day = dayMap[dayCode] || parts[0];
            const timeRange = parts[1] || '00:00-00:00';
            const [startTime, endTime] = timeRange.split('-');

            return {
                day: day,
                startTime: startTime || '00:00',
                endTime: endTime || '00:00'
            };

        } catch (error) {
            console.error('Error parsing schedule:', error);
            return { day: 'TBD', startTime: '00:00', endTime: '00:00' };
        }
    }

    /**
     * Get available open courses for student registration
     */    private async getAvailableOpenCourses(studentId: string) {
        try {
            // Get current semester
            const currentSemester = await DatabaseService.queryOne(`
                SELECT current_semester FROM ACADEMIC_SETTINGS WHERE id = 1
            `);
            
            const semester = currentSemester?.current_semester || '2024-1';
            
            // Get available courses that student hasn't enrolled yet
            const courses = await OpenCourseService.getAllCourses();
              // Filter to only show courses from current semester and available for registration
            return courses.filter(course => 
                course.semesterId === semester && 
                course.currentStudents < course.maxStudents &&
                course.status === 'Mở'
            ).slice(0, 5); // Show top 5 available courses
            
        } catch (error) {
            console.error('Error getting available open courses:', error);
            return [];
        }
    }
}

export default new DashboardManager();