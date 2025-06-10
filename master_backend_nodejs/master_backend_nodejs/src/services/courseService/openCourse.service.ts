import { IOfferedSubject } from '../../models/academic_related/openCourse';
import { Database } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database.error';

export class OpenCourseService {
    static async getAllCourses(): Promise<IOfferedSubject[]> {
        try {
            const query = 'SELECT * FROM open_courses ORDER BY created_at DESC';
            return await Database.query(query);
        } catch (error) {
            throw new DatabaseError('Error fetching open courses');
        }
    }

    static async getCourseById(id: number): Promise<IOfferedSubject | null> {
        try {
            const query = 'SELECT * FROM open_courses WHERE id = $1';
            const result = await Database.query(query, [id]);
            return result[0] || null;
        } catch (error) {
            throw new DatabaseError('Error fetching open course by ID');
        }
    }

    static async createCourse(courseData: Omit<IOfferedSubject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IOfferedSubject> {
        try {
            const query = `
                INSERT INTO open_courses (
                    subject_id,
                    semester_id,
                    subject_name,
                    subject_type_id,
                    total_hours,
                    max_students,
                    current_students,
                    lecturer,
                    schedule,
                    status,
                    start_date,
                    end_date,
                    registration_start_date,
                    registration_end_date,
                    prerequisites,
                    description,
                    created_at,
                    updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW()
                ) RETURNING *
            `;

            const values = [
                courseData.subjectId,
                courseData.semesterId,
                courseData.subjectName,
                courseData.subjectTypeId,
                courseData.totalHours,
                courseData.maxStudents,
                courseData.currentStudents,
                courseData.lecturer,
                courseData.schedule ? JSON.stringify(courseData.schedule) : null,
                courseData.status || 'open',
                courseData.startDate,
                courseData.endDate,
                courseData.registrationStartDate,
                courseData.registrationEndDate,
                courseData.prerequisites ? JSON.stringify(courseData.prerequisites) : null,
                courseData.description
            ];

            const result = await Database.query(query, values);
            return this.mapToIOfferedSubject(result);
        } catch (error) {
            console.error('Error creating course:', error);
            throw new DatabaseError('Failed to create course');
        }
    }

    private static mapToIOfferedSubject(data: any): IOfferedSubject {
        return {
            subjectId: data.subject_id,
            semesterId: data.semester_id,
            subjectName: data.subject_name,
            subjectTypeId: data.subject_type_id,
            totalHours: data.total_hours,
            maxStudents: data.max_students,
            currentStudents: data.current_students,
            lecturer: data.lecturer,
            schedule: data.schedule ? JSON.parse(data.schedule) : undefined,
            status: data.status,
            startDate: data.start_date,
            endDate: data.end_date,
            registrationStartDate: data.registration_start_date,
            registrationEndDate: data.registration_end_date,
            prerequisites: data.prerequisites ? JSON.parse(data.prerequisites) : undefined,
            description: data.description,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        };
    }

    static async updateCourse(id: number, courseData: Partial<IOfferedSubject>): Promise<IOfferedSubject> {
        try {
            const query = `
                UPDATE open_courses 
                SET subject_id = COALESCE($1, subject_id),
                    subject_name = COALESCE($2, subject_name),
                    semester_id = COALESCE($3, semester_id),
                    max_students = COALESCE($4, max_students),
                    current_students = COALESCE($5, current_students),
                    lecturer = COALESCE($6, lecturer),
                    schedule = COALESCE($7, schedule),
                    status = COALESCE($8, status),
                    start_date = COALESCE($9, start_date),
                    end_date = COALESCE($10, end_date),
                    registration_start_date = COALESCE($11, registration_start_date),
                    registration_end_date = COALESCE($12, registration_end_date),
                    prerequisites = COALESCE($13, prerequisites),
                    description = COALESCE($14, description),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $15
                RETURNING *
            `;
            const result = await Database.query(query, [
                courseData.subjectId,
                courseData.subjectName,
                courseData.semesterId,
                courseData.maxStudents,
                courseData.currentStudents,
                courseData.lecturer,
                courseData.schedule ? JSON.stringify(courseData.schedule) : null,
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

    static async getCoursesByStatus(status: IOfferedSubject['status']): Promise<IOfferedSubject[]> {
        try {
            const query = 'SELECT * FROM open_courses WHERE status = $1 ORDER BY created_at DESC';
            return await Database.query(query, [status]);
        } catch (error) {
            throw new DatabaseError('Error fetching courses by status');
        }
    }

    static async getCoursesBySemester(semester: string, academicYear: string): Promise<IOfferedSubject[]> {
        try {
            const query = 'SELECT * FROM open_courses WHERE semester = $1 AND academic_year = $2 ORDER BY created_at DESC';
            return await Database.query(query, [semester, academicYear]);
        } catch (error) {
            throw new DatabaseError('Error fetching courses by semester');
        }
    }

    static async updateCourseStatus(id: number, status: IOfferedSubject['status']): Promise<IOfferedSubject> {
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