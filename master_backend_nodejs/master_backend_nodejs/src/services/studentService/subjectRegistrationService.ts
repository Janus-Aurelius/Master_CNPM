// src/services/studentService/subjectRegistrationService.ts
import { IEnrollment } from '../../models/student_related/studentEnrollmentInterface';
import { ISubject } from '../../models/student_related/subjectInterface';
import { DatabaseService } from '../database/databaseService';

export const subjectRegistrationService = {
    async getAvailableSubjects(semester: string): Promise<ISubject[]> {
        try {
            const subjects = await DatabaseService.query(`
                SELECT 
                    s.id,
                    s.name,
                    s.lecturer,
                    s.credits,
                    s.max_students as "maxStudents",
                    s.current_students as "currentStudents",
                    s.prerequisites,
                    s.description,
                    s.semester,
                    json_agg(
                        json_build_object(
                            'day', c.day,
                            'session', c.session,
                            'room', c.room
                        )
                    ) as schedule
                FROM subjects s
                LEFT JOIN classes c ON s.id = c.subject_id
                WHERE s.semester = $1
                GROUP BY 
                    s.id, s.name, s.lecturer, s.credits,
                    s.max_students, s.current_students,
                    s.prerequisites, s.description, s.semester
            `, [semester]);

            return subjects.map(subject => ({
                id: subject.id,
                name: subject.name,
                lecturer: subject.lecturer,
                credits: subject.credits,
                maxStudents: subject.maxStudents,
                currentStudents: subject.currentStudents,
                prerequisites: subject.prerequisites || [],
                description: subject.description || '',
                schedule: subject.schedule || [],
                semester: subject.semester
            }));
        } catch (error) {
            console.error('Error getting available subjects:', error);
            throw error;
        }
    },

    async getSubjectById(subjectId: string): Promise<ISubject | null> {
        try {
            const subject = await DatabaseService.queryOne(`
                SELECT 
                    s.id,
                    s.name,
                    s.lecturer,
                    s.credits,
                    s.max_students as "maxStudents",
                    s.current_students as "currentStudents",
                    s.prerequisites,
                    s.description,
                    s.semester,
                    json_agg(
                        json_build_object(
                            'day', c.day,
                            'session', c.session,
                            'room', c.room
                        )
                    ) as schedule
                FROM subjects s
                LEFT JOIN classes c ON s.id = c.subject_id
                WHERE s.id = $1
                GROUP BY 
                    s.id, s.name, s.lecturer, s.credits,
                    s.max_students, s.current_students,
                    s.prerequisites, s.description, s.semester
            `, [subjectId]);

            if (!subject) return null;

            return {
                id: subject.id,
                name: subject.name,
                lecturer: subject.lecturer,
                credits: subject.credits,
                maxStudents: subject.maxStudents,
                currentStudents: subject.currentStudents,
                prerequisites: subject.prerequisites || [],
                description: subject.description || '',
                schedule: subject.schedule || [],
                semester: subject.semester
            };
        } catch (error) {
            console.error('Error getting subject by id:', error);
            throw error;
        }
    },

    async checkPrerequisites(studentId: string, subjectId: string): Promise<boolean> {
        try {
            const subject = await this.getSubjectById(subjectId);
            if (!subject || !subject.prerequisites.length) return true;

            const prerequisites = subject.prerequisites;
            const completedSubjects = await DatabaseService.query(`
                SELECT subject_id
                FROM grades
                WHERE student_id = $1 AND letter_grade IN ('A', 'B', 'C', 'D')
            `, [studentId]);

            const completedSubjectIds = completedSubjects.map(s => s.subject_id);
            return prerequisites.every((prereq: string) => completedSubjectIds.includes(prereq));
        } catch (error) {
            console.error('Error checking prerequisites:', error);
            throw error;
        }
    },

    async checkScheduleConflict(studentId: string, subjectId: string): Promise<boolean> {
        try {
            // Get current semester
            const currentSemester = await DatabaseService.queryOne(`
                SELECT semester
                FROM enrollments
                WHERE student_id = $1 AND is_enrolled = true
                LIMIT 1
            `, [studentId]);

            if (!currentSemester) return false;

            // Get enrolled subjects schedule
            const enrolledSchedules = await DatabaseService.query(`
                SELECT c.day, c.session
                FROM enrollments e
                JOIN subjects s ON e.course_id = s.id
                JOIN classes c ON s.id = c.subject_id
                WHERE e.student_id = $1 
                AND e.semester = $2
                AND e.is_enrolled = true
            `, [studentId, currentSemester.semester]);

            // Get new subject schedule
            const newSubjectSchedule = await DatabaseService.query(`
                SELECT day, session
                FROM classes
                WHERE subject_id = $1
            `, [subjectId]);

            // Check for conflicts
            for (const enrolled of enrolledSchedules) {
                for (const newSchedule of newSubjectSchedule) {
                    if (enrolled.day === newSchedule.day && enrolled.session === newSchedule.session) {
                        return true; // Conflict found
                    }
                }
            }

            return false; // No conflicts
        } catch (error) {
            console.error('Error checking schedule conflict:', error);
            throw error;
        }
    },

    async checkCreditLimit(studentId: string, subjectId: string): Promise<boolean> {
        try {
            // Get current semester
            const currentSemester = await DatabaseService.queryOne(`
                SELECT semester
                FROM enrollments
                WHERE student_id = $1 AND is_enrolled = true
                LIMIT 1
            `, [studentId]);

            if (!currentSemester) return true;

            // Get current enrolled credits
            const currentCredits = await DatabaseService.queryOne(`
                SELECT COALESCE(SUM(credits), 0) as total_credits
                FROM enrollments
                WHERE student_id = $1 
                AND semester = $2
                AND is_enrolled = true
            `, [studentId, currentSemester.semester]);

            // Get new subject credits
            const newSubject = await this.getSubjectById(subjectId);
            if (!newSubject) return false;

            const MAX_CREDITS_PER_SEMESTER = 24; // Example limit
            return (currentCredits.total_credits + newSubject.credits) <= MAX_CREDITS_PER_SEMESTER;
        } catch (error) {
            console.error('Error checking credit limit:', error);
            throw error;
        }
    },

    async searchSubjects(query: string, semester: string): Promise<ISubject[]> {
        try {
            const subjects = await DatabaseService.query(`
                SELECT 
                    s.id,
                    s.name,
                    s.lecturer,
                    s.credits,
                    s.max_students as "maxStudents",
                    s.current_students as "currentStudents",
                    s.prerequisites,
                    s.description,
                    s.semester,
                    json_agg(
                        json_build_object(
                            'day', c.day,
                            'session', c.session,
                            'room', c.room
                        )
                    ) as schedule
                FROM subjects s
                LEFT JOIN classes c ON s.id = c.subject_id
                WHERE s.semester = $1 AND (LOWER(s.name) LIKE $2 OR LOWER(s.id) LIKE $2)
                GROUP BY 
                    s.id, s.name, s.lecturer, s.credits,
                    s.max_students, s.current_students,
                    s.prerequisites, s.description, s.semester
            `, [semester, `%${query.toLowerCase()}%`]);

            return subjects.map(subject => ({
                id: subject.id,
                name: subject.name,
                lecturer: subject.lecturer,
                credits: subject.credits,
                maxStudents: subject.maxStudents,
                currentStudents: subject.currentStudents,
                prerequisites: subject.prerequisites || [],
                description: subject.description || '',
                schedule: subject.schedule || [],
                semester: subject.semester
            }));
        } catch (error) {
            console.error('Error searching subjects:', error);
            throw error;
        }
    },

    async registerSubject(studentId: string, subjectId: string, semester: string): Promise<boolean> {
        try {
            // Check if subject exists and has available slots
            const subject = await DatabaseService.queryOne(`
                SELECT id, max_students, current_students FROM subjects WHERE id = $1 AND semester = $2
            `, [subjectId, semester]);
        if (!subject) {
            throw new Error('Subject not found');
        }
            if (subject.current_students >= subject.max_students) {
            throw new Error('Subject is full');
        }
            // Check if already enrolled
            const existing = await DatabaseService.queryOne(`
                SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2 AND semester = $3 AND is_enrolled = true
            `, [studentId, subjectId, semester]);
            if (existing) {
                throw new Error('Already enrolled');
            }
            // Register
            await DatabaseService.query(`
                INSERT INTO enrollments (student_id, course_id, course_name, semester, is_enrolled, credits, created_at, updated_at)
                VALUES ($1, $2, (SELECT name FROM subjects WHERE id = $2), $3, true, (SELECT credits FROM subjects WHERE id = $2), NOW(), NOW())
            `, [studentId, subjectId, semester]);
            // Update subject current_students
            await DatabaseService.query(`
                UPDATE subjects SET current_students = current_students + 1 WHERE id = $1
            `, [subjectId]);
            return true;
        } catch (error) {
            console.error('Error registering subject:', error);
            throw error;
        }
    }
};
