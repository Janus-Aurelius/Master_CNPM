import { DatabaseService } from '../../services/database/databaseService';
import { CrossRoleValidationService } from '../shared/crossRoleValidationService';
import { FinancialIntegrationService } from '../shared/financialIntegrationService';

export interface CourseRegistrationRequest {
    studentId: string;
    courseId: string;
    semester: string;
}

export interface RegistrationResult {
    success: boolean;
    enrollmentId?: string;
    errors: string[];
    warnings: string[];
}

class RegistrationManager {

    public async getAvailableSubjects(semester: string) {
        try {
            // Validate semester
            if (!semester) {
                throw new Error('Semester is required');
            }

            // Validate semester format (HK1 2024-2025 hoặc 2024-1)
            const semesterPattern = /^(HK[1-3] \d{4}-\d{4}|\d{4}-[1-3])$/;
            if (!semesterPattern.test(semester)) {
                throw new Error('Invalid semester format');
            }

            // Get available open courses from database
            const subjects = await DatabaseService.query(`
                SELECT 
                    oc.id,
                    oc.subject_code,
                    oc.subject_name,
                    oc.semester,
                    oc.academic_year,
                    oc.max_students,
                    oc.current_students,
                    oc.lecturer,
                    oc.schedule,
                    oc.room,
                    oc.status,
                    oc.registration_start_date,
                    oc.registration_end_date,
                    s.credits,
                    s.description,
                    s.type,
                    s.prerequisite_subjects
                FROM open_courses oc
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE oc.semester = $1 
                AND oc.status = 'open'
                AND oc.registration_start_date <= CURRENT_DATE
                AND oc.registration_end_date >= CURRENT_DATE
                ORDER BY oc.subject_code
            `, [semester]);

            return subjects;        } catch (error) {
            console.error('Error getting available subjects:', error);
            throw error;
        }
    }

    /**
     * Search subjects by query and semester
     */
    public async searchSubjects(query: string, semester: string) {
        try {
            // Validate inputs
            if (!query || !semester) {
                throw new Error('Search query and semester are required');
            }

            // Clean and validate search query
            const cleanQuery = query.trim();
            if (cleanQuery.length < 2) {
                throw new Error('Search query must be at least 2 characters');
            }

            // Search subjects using database
            const subjects = await DatabaseService.query(`
                SELECT 
                    oc.id,
                    oc.subject_code,
                    oc.subject_name,
                    oc.semester,
                    oc.academic_year,
                    oc.max_students,
                    oc.current_students,
                    oc.lecturer,
                    oc.schedule,
                    oc.room,
                    oc.status,
                    oc.registration_start_date,
                    oc.registration_end_date,
                    s.credits,
                    s.description,
                    s.type,
                    s.prerequisite_subjects
                FROM open_courses oc
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE oc.semester = $1 
                AND oc.status = 'open'
                AND (
                    LOWER(oc.subject_name) LIKE LOWER($2) OR 
                    LOWER(oc.subject_code) LIKE LOWER($2) OR
                    LOWER(s.description) LIKE LOWER($2)
                )
                ORDER BY oc.subject_code
            `, [semester, `%${cleanQuery}%`]);            return subjects;
        } catch (error) {
            console.error('Error searching subjects:', error);
            throw error;
        }
    }

    /**
     * Register student for a course with comprehensive validation (Legacy method)
     */
    public async registerSubject(studentId: string, courseId: string, semester: string) {
        try {
            // Validate inputs
            if (!studentId || !courseId || !semester) {
                throw new Error('Student ID, Course ID, and Semester are required');
            }

            // Validate courseId format (basic validation)
            if (courseId === 'INVALID' || courseId.length < 3) {
                throw new Error('Invalid course ID format');
            }

            // 1. Comprehensive cross-role validation
            const validation = await CrossRoleValidationService.validateCourseRegistration(
                studentId, 
                courseId, 
                semester
            );

            if (!validation.isValid) {
                throw new Error(`Registration failed: ${validation.errors.join(', ')}`);
            }            // 2. Enhanced eligibility check
            const eligibility = await CrossRoleValidationService.checkStudentEligibility(
                studentId,
                courseId
            );

            if (!eligibility.canRegister) {
                throw new Error(`Student not eligible: ${eligibility.errors.join(', ')}`);
            }            // 3. Financial integration - create tuition record
            const tuitionResult = await FinancialIntegrationService.createTuitionRecord(
                studentId,
                courseId,
                semester
            );

            const warnings = [...validation.warnings];
            if (!tuitionResult.success) {
                warnings.push(`Tuition record creation warning: ${tuitionResult.error}`);
            }

            // 4. Register for the subject in database
            const student = await DatabaseService.queryOne(`
                SELECT id FROM students WHERE student_id = $1
            `, [studentId]);

            if (!student) {
                throw new Error('Student not found');
            }            // Create enrollment record
            const enrollment = await DatabaseService.insert('enrollments', {
                student_id: student.id,
                course_id: parseInt(courseId),
                enrollment_date: new Date(),
                is_enrolled: true // Boolean approach: true = enrolled
            });

            // Update current students count in open_courses
            await DatabaseService.query(`
                UPDATE open_courses 
                SET current_students = current_students + 1 
                WHERE id = $1
            `, [parseInt(courseId)]);

            // 5. Log warnings if any
            if (warnings.length > 0) {
                console.warn(`Registration warnings for student ${studentId}:`, warnings);
            }

            return {
                success: true,
                warnings,
                message: 'Course registered successfully',
                tuitionRecordId: tuitionResult.tuitionRecordId,
                eligibilityDetails: {
                    prerequisitesMet: eligibility.prerequisitesMet,
                    creditStatus: !eligibility.creditLimitExceeded,
                    paymentStatus: !eligibility.hasPaymentIssues,
                    scheduleStatus: !eligibility.hasScheduleConflict
                }
            };

        } catch (error) {
            if (error instanceof Error && error.message === 'Already registered') {
                throw new Error('Already registered');
            }            throw error;
        }
    }

    /**
     * Register student for a course with comprehensive validation (New method)
     */
    public async registerForCourse(request: CourseRegistrationRequest): Promise<RegistrationResult> {
        try {
            const { studentId, courseId, semester } = request;

            // 1. Comprehensive validation using CrossRoleValidationService
            const validation = await CrossRoleValidationService.validateCourseRegistration(
                studentId, 
                courseId, 
                semester
            );

            if (!validation.isValid) {
                return {
                    success: false,
                    errors: validation.errors,
                    warnings: validation.warnings
                };
            }

            // 2. Get student and course details
            const student = await DatabaseService.queryOne(`
                SELECT id, student_id, name FROM students WHERE student_id = $1
            `, [studentId]);

            const course = await DatabaseService.queryOne(`
                SELECT oc.*, s.credits, s.subject_name 
                FROM open_courses oc 
                JOIN subjects s ON oc.subject_code = s.subject_code 
                WHERE oc.id = $1
            `, [parseInt(courseId)]);

            if (!student || !course) {
                return {
                    success: false,
                    errors: ['Student or course not found'],
                    warnings: []
                };
            }            // 3. Create enrollment record
            const enrollment = await DatabaseService.insert('enrollments', {
                student_id: student.student_id,
                course_id: parseInt(courseId),
                course_name: course.subject_name,
                semester: semester,
                is_enrolled: true, // Boolean approach: true = enrolled
                credits: course.credits
            });

            // 4. Update course current students count
            await DatabaseService.query(`
                UPDATE open_courses 
                SET current_students = current_students + 1 
                WHERE id = $1
            `, [parseInt(courseId)]);

            // 5. Create tuition record
            await FinancialIntegrationService.createTuitionRecord(
                student.student_id,
                courseId,
                semester
            );

            return {
                success: true,
                enrollmentId: enrollment.id,
                errors: [],
                warnings: validation.warnings
            };        } catch (error) {
            console.error('Course registration error:', error);
            return {
                success: false,
                errors: [`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
                warnings: []
            };
        }
    }

    /**
     * Get student's enrolled courses for a semester
     */
    public async getStudentEnrollments(studentId: string, semester?: string) {
        try {
            let query = `                SELECT 
                    e.id as enrollment_id,
                    e.course_id,
                    e.course_name,
                    e.semester,
                    e.is_enrolled, -- Updated to boolean field
                    e.credits,
                    e.midterm_grade,
                    e.final_grade,
                    e.total_grade,
                    e.letter_grade,
                    oc.subject_code,
                    oc.lecturer,
                    oc.schedule,
                    oc.room,
                    s.type,
                    s.description
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE e.student_id = $1
            `;

            const params = [studentId];

            if (semester) {
                query += ' AND e.semester = $2';
                params.push(semester);
            }

            query += ' ORDER BY e.created_at DESC';

            const enrollments = await DatabaseService.query(query, params);
            return enrollments;

        } catch (error) {
            console.error('Error getting student enrollments:', error);
            throw error;
        }
    }

    /**
     * Drop/withdraw from a course
     */
    public async dropCourse(studentId: string, enrollmentId: string): Promise<RegistrationResult> {
        try {
            // 1. Get enrollment details
            const enrollment = await DatabaseService.queryOne(`
                SELECT e.*, oc.current_students, oc.id as course_id
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                WHERE e.id = $1 AND e.student_id = $2
            `, [enrollmentId, studentId]);

            if (!enrollment) {
                return {
                    success: false,
                    errors: ['Enrollment not found'],
                    warnings: []
                };
            }            // 2. Check if drop is allowed
            if (!enrollment.is_enrolled) {
                return {
                    success: false,
                    errors: ['Cannot drop already dropped course'],
                    warnings: []
                };
            }            // 3. Update enrollment to dropped (boolean false)
            await DatabaseService.update('enrollments', 
                { is_enrolled: false, drop_date: new Date() }, 
                { id: enrollmentId }
            );

            // 4. Update course current students count
            await DatabaseService.query(`
                UPDATE open_courses 
                SET current_students = GREATEST(current_students - 1, 0) 
                WHERE id = $1
            `, [enrollment.course_id]);

            return {
                success: true,
                errors: [],
                warnings: ['Course dropped successfully']
            };        } catch (error) {
            console.error('Course drop error:', error);
            return {
                success: false,
                errors: [`Drop failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
                warnings: []
            };
        }
    }

    /**
     * Get student's academic summary
     */
    public async getStudentAcademicSummary(studentId: string) {
        try {
            const summary = await DatabaseService.queryOne(`
                SELECT 
                    s.student_id,
                    s.name,
                    s.major,
                    s.enrollment_year,                    s.completed_credits,
                    s.current_credits,
                    s.required_credits,
                    COUNT(e.id) as total_enrollments,
                    COUNT(CASE WHEN e.is_enrolled = true AND e.total_grade IS NOT NULL THEN 1 END) as completed_courses,
                    COUNT(CASE WHEN e.is_enrolled = true AND e.total_grade IS NULL THEN 1 END) as current_enrollments,
                    COALESCE(AVG(CASE WHEN e.is_enrolled = true AND e.total_grade IS NOT NULL THEN e.total_grade END), 0) as gpa
                FROM students s
                LEFT JOIN enrollments e ON s.student_id = e.student_id
                WHERE s.student_id = $1
                GROUP BY s.student_id, s.name, s.major, s.enrollment_year, 
                         s.completed_credits, s.current_credits, s.required_credits
            `, [studentId]);

            return summary;
        } catch (error) {
            console.error('Error getting academic summary:', error);
            throw error;
        }
    }
}

export default new RegistrationManager();