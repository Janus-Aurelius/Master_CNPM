import { OpenCourse } from '../../models/academic_related/openCourse';
import { Database } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database.error';

export class OpenCourseService {
    static async getAllCourses(): Promise<OpenCourse[]> {
        try {
            const query = 'SELECT * FROM open_courses ORDER BY created_at DESC';
            return await Database.query(query);
        } catch (error) {
            throw new DatabaseError('Error fetching open courses');
        }
    }

    static async getCourseById(id: number): Promise<OpenCourse | null> {
        try {
            const query = 'SELECT * FROM open_courses WHERE id = $1';
            const result = await Database.query(query, [id]);
            return result[0] || null;
        } catch (error) {
            throw new DatabaseError('Error fetching open course by ID');
        }
    }

    static async createCourse(courseData: Omit<OpenCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<OpenCourse> {
        try {
            const query = `
                INSERT INTO open_courses (
                    subject_code, subject_name, semester, academic_year,
                    max_students, current_students, lecturer, schedule,
                    room, status, start_date, end_date,
                    registration_start_date, registration_end_date,
                    prerequisites, description
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                RETURNING *
            `;
            const result = await Database.query(query, [
                courseData.subjectCode,
                courseData.subjectName,
                courseData.semester,
                courseData.academicYear,
                courseData.maxStudents,
                courseData.currentStudents,
                courseData.lecturer,
                courseData.schedule,
                courseData.room,
                courseData.status,
                courseData.startDate,
                courseData.endDate,
                courseData.registrationStartDate,
                courseData.registrationEndDate,
                JSON.stringify(courseData.prerequisites),
                courseData.description
            ]);
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error creating open course');
        }
    }

    static async updateCourse(id: number, courseData: Partial<OpenCourse>): Promise<OpenCourse> {
        try {
            const query = `
                UPDATE open_courses 
                SET subject_code = COALESCE($1, subject_code),
                    subject_name = COALESCE($2, subject_name),
                    semester = COALESCE($3, semester),
                    academic_year = COALESCE($4, academic_year),
                    max_students = COALESCE($5, max_students),
                    current_students = COALESCE($6, current_students),
                    lecturer = COALESCE($7, lecturer),
                    schedule = COALESCE($8, schedule),
                    room = COALESCE($9, room),
                    status = COALESCE($10, status),
                    start_date = COALESCE($11, start_date),
                    end_date = COALESCE($12, end_date),
                    registration_start_date = COALESCE($13, registration_start_date),
                    registration_end_date = COALESCE($14, registration_end_date),
                    prerequisites = COALESCE($15, prerequisites),
                    description = COALESCE($16, description),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $17
                RETURNING *
            `;
            const result = await Database.query(query, [
                courseData.subjectCode,
                courseData.subjectName,
                courseData.semester,
                courseData.academicYear,
                courseData.maxStudents,
                courseData.currentStudents,
                courseData.lecturer,
                courseData.schedule,
                courseData.room,
                courseData.status,
                courseData.startDate,
                courseData.endDate,
                courseData.registrationStartDate,
                courseData.registrationEndDate,
                courseData.prerequisites ? JSON.stringify(courseData.prerequisites) : null,
                courseData.description,
                id
            ]);
            if (!result[0]) {
                throw new Error('Course not found');
            }
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error updating open course');
        }
    }

    static async deleteCourse(id: number): Promise<void> {
        try {
            const query = 'DELETE FROM open_courses WHERE id = $1';
            await Database.query(query, [id]);
        } catch (error) {
            throw new DatabaseError('Error deleting open course');
        }
    }

    static async getCoursesByStatus(status: OpenCourse['status']): Promise<OpenCourse[]> {
        try {
            const query = 'SELECT * FROM open_courses WHERE status = $1 ORDER BY created_at DESC';
            return await Database.query(query, [status]);
        } catch (error) {
            throw new DatabaseError('Error fetching courses by status');
        }
    }

    static async getCoursesBySemester(semester: string, academicYear: string): Promise<OpenCourse[]> {
        try {
            const query = 'SELECT * FROM open_courses WHERE semester = $1 AND academic_year = $2 ORDER BY created_at DESC';
            return await Database.query(query, [semester, academicYear]);
        } catch (error) {
            throw new DatabaseError('Error fetching courses by semester');
        }
    }

    static async updateCourseStatus(id: number, status: OpenCourse['status']): Promise<OpenCourse> {
        try {
            const query = `
                UPDATE open_courses 
                SET status = $1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $2
                RETURNING *
            `;
            const result = await Database.query(query, [status, id]);
            if (!result[0]) {
                throw new Error('Course not found');
            }
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error updating course status');
        }
    }
} 