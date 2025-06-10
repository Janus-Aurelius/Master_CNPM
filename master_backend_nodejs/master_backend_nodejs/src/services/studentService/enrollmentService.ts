import { IEnrollment, IEnrolledSubject } from '../../models/student_related/studentEnrollmentInterface';
import { IStudent } from '../../models/student_related/studentInterface';
import { DatabaseService } from '../database/databaseService';

export const enrollmentService = {
    async getEnrolledSubjects(studentId: string, semester: string): Promise<IEnrolledSubject[]> {
        try {
            const enrolledSubjects = await DatabaseService.query(`
                SELECT 
                    e.id,
                    e.student_id as "studentId",
                    e.course_id as "courseId",
                    e.course_name as "courseName",
                    e.semester,
                    e.is_enrolled as "isEnrolled",
                    e.credits,
                    s.name as "subjectName",
                    s.lecturer,
                    s.credits as "subjectCredits",
                    s.max_students as "maxStudents",
                    s.current_students as "currentStudents",
                    json_agg(
                        json_build_object(
                            'day', c.day,
                            'session', c.session,
                            'room', c.room
                        )
                    ) as schedule,
                    g.midterm_grade as "midtermGrade",
                    g.final_grade as "finalGrade",
                    g.total_grade as "totalGrade",
                    g.letter_grade as "letterGrade",
                    COALESCE(a.attendance_rate, 0) as "attendanceRate"
                FROM enrollments e
                JOIN subjects s ON e.course_id = s.id
                LEFT JOIN classes c ON s.id = c.subject_id
                LEFT JOIN grades g ON e.student_id = g.student_id AND e.course_id = g.subject_id
                LEFT JOIN attendance a ON e.student_id = a.student_id AND e.course_id = a.subject_id
                WHERE e.student_id = $1 AND e.semester = $2
                GROUP BY 
                    e.id, e.student_id, e.course_id, e.course_name, e.semester, 
                    e.is_enrolled, e.credits, s.name, s.lecturer, s.credits,
                    s.max_students, s.current_students, g.midterm_grade, g.final_grade,
                    g.total_grade, g.letter_grade, a.attendance_rate
            `, [studentId, semester]);

            return enrolledSubjects.map(subject => ({
                enrollment: {
                    id: subject.id,
                    studentId: subject.studentId,
                    courseId: subject.courseId,
                    courseName: subject.courseName,
                    semester: subject.semester,
                    isEnrolled: subject.isEnrolled,
                    credits: subject.credits
                },
                subjectDetails: {
                    id: subject.courseId,
                    name: subject.subjectName,
                    lecturer: subject.lecturer,
                    credits: subject.subjectCredits,
                    maxStudents: subject.maxStudents,
                    currentStudents: subject.currentStudents,
                    schedule: subject.schedule
                },
                grade: subject.midtermGrade ? {
                    midterm: subject.midtermGrade,
                    final: subject.finalGrade,
                    total: subject.totalGrade,
                    letter: subject.letterGrade
                } : null,
                attendanceRate: subject.attendanceRate
            }));
        } catch (error) {
            console.error('Error getting enrolled subjects:', error);
            throw error;
        }
    },

    async getSubjectDetails(studentId: string, subjectId: string): Promise<IEnrolledSubject | null> {
        try {
            const subject = await DatabaseService.queryOne(`
                SELECT 
                    e.id,
                    e.student_id as "studentId",
                    e.course_id as "courseId",
                    e.course_name as "courseName",
                    e.semester,
                    e.is_enrolled as "isEnrolled",
                    e.credits,
                    s.name as "subjectName",
                    s.lecturer,
                    s.credits as "subjectCredits",
                    s.max_students as "maxStudents",
                    s.current_students as "currentStudents",
                    json_agg(
                        json_build_object(
                            'day', c.day,
                            'session', c.session,
                            'room', c.room
                        )
                    ) as schedule,
                    g.midterm_grade as "midtermGrade",
                    g.final_grade as "finalGrade",
                    g.total_grade as "totalGrade",
                    g.letter_grade as "letterGrade",
                    COALESCE(a.attendance_rate, 0) as "attendanceRate"
                FROM enrollments e
                JOIN subjects s ON e.course_id = s.id
                LEFT JOIN classes c ON s.id = c.subject_id
                LEFT JOIN grades g ON e.student_id = g.student_id AND e.course_id = g.subject_id
                LEFT JOIN attendance a ON e.student_id = a.student_id AND e.course_id = a.subject_id
                WHERE e.student_id = $1 AND e.course_id = $2
                GROUP BY 
                    e.id, e.student_id, e.course_id, e.course_name, e.semester, 
                    e.is_enrolled, e.credits, s.name, s.lecturer, s.credits,
                    s.max_students, s.current_students, g.midterm_grade, g.final_grade,
                    g.total_grade, g.letter_grade, a.attendance_rate
            `, [studentId, subjectId]);

            if (!subject) return null;

            return {
                enrollment: {
                    id: subject.id,
                    studentId: subject.studentId,
                    courseId: subject.courseId,
                    courseName: subject.courseName,
                    semester: subject.semester,
                    isEnrolled: subject.isEnrolled,
                    credits: subject.credits
                },
                subjectDetails: {
                    id: subject.courseId,
                    name: subject.subjectName,
                    lecturer: subject.lecturer,
                    credits: subject.subjectCredits,
                    maxStudents: subject.maxStudents,
                    currentStudents: subject.currentStudents,
                    schedule: subject.schedule
                },
                grade: subject.midtermGrade ? {
                    midterm: subject.midtermGrade,
                    final: subject.finalGrade,
                    total: subject.totalGrade,
                    letter: subject.letterGrade
                } : null,
                attendanceRate: subject.attendanceRate
            };
        } catch (error) {
            console.error('Error getting subject details:', error);
            throw error;
        }
    },

    async enrollInSubject(enrollmentData: Omit<IEnrollment, 'id' | 'isEnrolled'>): Promise<IEnrollment> {
        try {
            // Check if subject exists and has available slots
            const subject = await DatabaseService.queryOne(`
                SELECT 
                    id,
                    name,
                    credits,
                    max_students,
                    current_students
                FROM subjects
                WHERE id = $1
            `, [enrollmentData.courseId]);

            if (!subject) {
                throw new Error('Subject not found');
            }

            if (subject.current_students >= subject.max_students) {
                throw new Error('Subject is full');
            }

            // Check if student is already enrolled
            const existingEnrollment = await DatabaseService.queryOne(`
                SELECT id
                FROM enrollments
                WHERE student_id = $1 AND course_id = $2
            `, [enrollmentData.studentId, enrollmentData.courseId]);

            if (existingEnrollment) {
                throw new Error('Student is already enrolled in this subject');
            }

            // Create enrollment
            const enrollment = await DatabaseService.queryOne(`
                INSERT INTO enrollments (
                    student_id,
                    course_id,
                    course_name,
                    semester,
                    is_enrolled,
                    credits,
                    created_at,
                    updated_at
                ) VALUES ($1, $2, $3, $4, true, $5, NOW(), NOW())
                RETURNING 
                    id,
                    student_id as "studentId",
                    course_id as "courseId",
                    course_name as "courseName",
                    semester,
                    is_enrolled as "isEnrolled",
                    credits
            `, [
                enrollmentData.studentId,
                enrollmentData.courseId,
                enrollmentData.courseName,
                enrollmentData.semester,
                enrollmentData.credits
            ]);

            // Update subject current students count
            await DatabaseService.query(`
                UPDATE subjects
                SET current_students = current_students + 1
                WHERE id = $1
            `, [enrollmentData.courseId]);

            return enrollment;
        } catch (error) {
            console.error('Error enrolling in subject:', error);
            throw error;
        }
    },

    async cancelEnrollment(studentId: string, subjectId: string): Promise<boolean> {
        try {
            // Check if enrollment exists
            const enrollment = await DatabaseService.queryOne(`
                SELECT id
                FROM enrollments
                WHERE student_id = $1 AND course_id = $2
            `, [studentId, subjectId]);

            if (!enrollment) {
                throw new Error('Enrollment not found');
            }

            // Update enrollment status
            await DatabaseService.query(`
                UPDATE enrollments
                SET is_enrolled = false, updated_at = NOW()
                WHERE id = $1
            `, [enrollment.id]);

            // Update subject current students count
            await DatabaseService.query(`
                UPDATE subjects
                SET current_students = current_students - 1
                WHERE id = $1
            `, [subjectId]);

            return true;
        } catch (error) {
            console.error('Error canceling enrollment:', error);
            throw error;
        }
    },

    async getEnrollmentHistory(studentId: string): Promise<IEnrollment[]> {
        try {
            const enrollments = await DatabaseService.query(`
                SELECT 
                    id,
                    student_id as "studentId",
                    course_id as "courseId",
                    course_name as "courseName",
                    semester,
                    is_enrolled as "isEnrolled",
                    credits
                FROM enrollments
                WHERE student_id = $1
                ORDER BY semester DESC, created_at DESC
            `, [studentId]);

            return enrollments;
        } catch (error) {
            console.error('Error getting enrollment history:', error);
            throw error;
        }
    },

    async checkEnrollmentStatus(studentId: string, subjectId: string): Promise<boolean> {
        try {
            const enrollment = await DatabaseService.queryOne(`
                SELECT is_enrolled
                FROM enrollments
                WHERE student_id = $1 AND course_id = $2
            `, [studentId, subjectId]);

            return enrollment?.is_enrolled || false;
        } catch (error) {
            console.error('Error checking enrollment status:', error);
            throw error;
        }
    }
};

export const enrollments: IEnrollment[] = [];
export const enrolledSubjects: IEnrolledSubject[] = [];
