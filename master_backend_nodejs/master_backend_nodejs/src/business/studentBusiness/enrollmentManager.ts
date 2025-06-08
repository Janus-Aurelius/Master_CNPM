import { enrollmentService } from '../../services/studentService/enrollmentService';
import { IEnrollment } from '../../models/student_related/studentEnrollmentInterface';
import { DatabaseService } from '../../services/database/databaseService';

class EnrollmentManager {
    public async getEnrolledSubjects(studentId: string, semester: string) {
        try {
            // Validate inputs
            if (!studentId || !semester) {
                throw new Error('Student ID and semester are required');
            }

            // Validate semester format
            const semesterPattern = /^HK[1-3] \d{4}-\d{4}$/;
            if (!semesterPattern.test(semester)) {
                throw new Error('Invalid semester format');
            }

            // Get enrolled subjects directly from database for better performance
            const enrolledSubjects = await DatabaseService.query(`
                SELECT 
                    e.id as enrollment_id,
                    e.course_id,
                    e.course_name,
                    e.semester,
                    e.is_enrolled,
                    e.credits,
                    e.midterm_grade,
                    e.final_grade,
                    e.total_grade,
                    e.letter_grade,
                    e.enrollment_date,
                    e.drop_date,
                    oc.subject_code,
                    oc.lecturer,
                    oc.schedule,
                    oc.room,
                    oc.max_students,
                    oc.current_students,
                    s.subject_name,
                    s.type,
                    s.description,
                    s.credits as subject_credits
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e.semester = $2
                AND e.is_enrolled = true
                ORDER BY e.enrollment_date DESC
            `, [studentId, semester]);

            // Transform to match IEnrolledSubject interface
            return enrolledSubjects.map(subject => ({
                enrollment: {
                    id: subject.enrollment_id,
                    studentId: studentId,
                    courseId: subject.subject_code,
                    courseName: subject.course_name,
                    semester: subject.semester,
                    isEnrolled: subject.is_enrolled, // Updated to use boolean
                    credits: subject.credits
                },
                subjectDetails: {
                    id: subject.subject_code,
                    name: subject.subject_name,
                    lecturer: subject.lecturer,
                    credits: subject.subject_credits,
                    maxStudents: subject.max_students,
                    currentStudents: subject.current_students,
                    schedule: this.parseSchedule(subject.schedule),
                    room: subject.room,
                    type: subject.type,
                    description: subject.description
                },
                grade: subject.total_grade ? {
                    midterm: subject.midterm_grade || 0,
                    final: subject.final_grade || 0,
                    total: subject.total_grade,
                    letter: subject.letter_grade
                } : null,
                attendanceRate: 0 // TODO: Implement attendance tracking
            }));

        } catch (error) {
            console.error('Error getting enrolled subjects:', error);
            throw error;
        }
    }

    public async cancelRegistration(studentId: string, courseId: string) {
        try {
            // Validate inputs
            if (!studentId || !courseId) {
                throw new Error('Student ID and Course ID are required');
            }

            // Get enrollment details using database
            const enrollment = await DatabaseService.queryOne(`
                SELECT e.*, oc.current_students, oc.id as course_internal_id
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND oc.subject_code = $2
                AND e.is_enrolled = true
            `, [studentId, courseId]);

            if (!enrollment) {
                throw new Error('Active enrollment not found');
            }

            // Update enrollment to not enrolled (dropped)
            await DatabaseService.update('enrollments', 
                { is_enrolled: false, drop_date: new Date() }, 
                { id: enrollment.id }
            );

            // Update course current students count
            await DatabaseService.query(`
                UPDATE open_courses 
                SET current_students = GREATEST(current_students - 1, 0) 
                WHERE id = $1
            `, [enrollment.course_internal_id]);

            return {
                success: true,
                message: 'Registration cancelled successfully'
            };

        } catch (error) {
            console.error('Error cancelling registration:', error);
            throw error;
        }
    }

    public async getEnrollmentDetails(studentId: string, courseId: string): Promise<IEnrollment> {
        try {
            if (!studentId || !courseId) {
                throw new Error('Student ID and Course ID are required');
            }

            const enrollment = await DatabaseService.queryOne(`
                SELECT 
                    e.id,
                    e.course_id,
                    e.course_name,
                    e.semester,
                    e.is_enrolled,
                    e.credits,
                    e.enrollment_date,
                    oc.subject_code
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND oc.subject_code = $2
                ORDER BY e.enrollment_date DESC
                LIMIT 1
            `, [studentId, courseId]);

            if (!enrollment) {
                throw new Error('Enrollment not found');
            }

            return {
                id: enrollment.id,
                studentId: studentId,
                courseId: enrollment.subject_code,
                courseName: enrollment.course_name,
                semester: enrollment.semester,
                isEnrolled: enrollment.is_enrolled, // Updated to boolean
                credits: enrollment.credits
            };

        } catch (error) {
            console.error('Error getting enrollment details:', error);
            throw error;
        }
    }

    /**
     * Get student's enrollment history across all semesters
     */
    public async getEnrollmentHistory(studentId: string) {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            const history = await DatabaseService.query(`
                SELECT 
                    e.id,
                    e.course_name,
                    e.semester,
                    e.is_enrolled,
                    e.credits,
                    e.total_grade,
                    e.letter_grade,
                    e.enrollment_date,
                    e.drop_date,
                    oc.subject_code,
                    s.subject_name,
                    s.type
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                ORDER BY e.semester DESC, e.enrollment_date DESC
            `, [studentId]);

            return history;

        } catch (error) {
            console.error('Error getting enrollment history:', error);
            throw error;
        }
    }

    /**
     * Get enrollment statistics for a student - Updated for boolean enrollment
     */
    public async getEnrollmentStatistics(studentId: string) {
        try {
            if (!studentId) {
                throw new Error('Student ID is required');
            }

            const stats = await DatabaseService.queryOne(`
                SELECT 
                    COUNT(*) as total_enrollments,
                    COUNT(CASE WHEN e.is_enrolled = true AND e.total_grade IS NOT NULL THEN 1 END) as completed_courses,
                    COUNT(CASE WHEN e.is_enrolled = true AND e.total_grade IS NULL THEN 1 END) as current_enrollments,
                    COUNT(CASE WHEN e.is_enrolled = false THEN 1 END) as dropped_courses,
                    COALESCE(SUM(CASE WHEN e.is_enrolled = true AND e.total_grade IS NOT NULL THEN e.credits END), 0) as total_credits_earned,
                    COALESCE(SUM(CASE WHEN e.is_enrolled = true AND e.total_grade IS NULL THEN e.credits END), 0) as current_credits,
                    COALESCE(AVG(CASE WHEN e.is_enrolled = true AND e.total_grade IS NOT NULL THEN e.total_grade END), 0) as gpa
                FROM enrollments e
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
            `, [studentId]);

            return {
                totalEnrollments: parseInt(stats?.total_enrollments || '0'),
                completedCourses: parseInt(stats?.completed_courses || '0'),
                currentEnrollments: parseInt(stats?.current_enrollments || '0'),
                droppedCourses: parseInt(stats?.dropped_courses || '0'),
                totalCreditsEarned: parseInt(stats?.total_credits_earned || '0'),
                currentCredits: parseInt(stats?.current_credits || '0'),
                gpa: parseFloat(stats?.gpa || '0')
            };

        } catch (error) {
            console.error('Error getting enrollment statistics:', error);
            throw error;
        }
    }

    /**
     * Helper method to parse schedule string into structured format
     */
    private parseSchedule(scheduleStr: string): Array<{ day: string; session: string; room: string }> {
        try {
            if (!scheduleStr) return [];

            // Parse schedule format: "MON 08:00-10:00, WED 14:00-16:00"
            const sessions = scheduleStr.split(',').map(s => s.trim());
            return sessions.map(session => {
                const parts = session.split(' ');
                const day = parts[0] || 'TBD';
                const timeRange = parts[1] || 'TBD';
                
                return {
                    day: day,
                    session: timeRange,
                    room: '' // Room is handled separately
                };
            });

        } catch (error) {
            console.error('Error parsing schedule:', error);
            return [{ day: 'TBD', session: 'TBD', room: '' }];
        }
    }
}

export default new EnrollmentManager();