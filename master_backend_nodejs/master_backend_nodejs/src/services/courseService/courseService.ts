// src/services/courseService.ts
import { DatabaseService } from '../database/databaseService';
import Course from "../../models/academic_related/course";

export const getCourses = async (): Promise<Course[]> => {
    try {
        const courses = await DatabaseService.query(`
            SELECT 
                c.id,
                c.subject_name as "subjectName",
                c.credits,
                c.schedule,
                c.lecturer,
                c.subject_code as "subjectCode",
                c.type,
                c.department,
                c.prerequisite_subjects as "prerequisite_subjects",
                c.status
            FROM courses c
            WHERE c.status = 'active'
            ORDER BY c.subject_code
        `);
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

export const getCourseById = async (id: number): Promise<Course | null> => {
    try {
        const course = await DatabaseService.queryOne(`
            SELECT 
                c.id,
                c.subject_name as "subjectName",
                c.credits,
                c.schedule,
                c.lecturer,
                c.subject_code as "subjectCode",
                c.type,
                c.department,
                c.prerequisite_subjects as "prerequisite_subjects",
                c.status
            FROM courses c
            WHERE c.id = $1
        `, [id]);
        return course;
    } catch (error) {
        console.error('Error fetching course by id:', error);
        throw error;
    }
};

export const addCourse = async (course: Course): Promise<Course> => {
    try {
        const newCourse = await DatabaseService.insert('courses', {
            subject_name: course.subjectName,
            credits: course.credits,
            schedule: course.schedule,
            lecturer: course.lecturer,
            subject_code: course.subjectCode,
            type: course.type,
            department: course.department,
            prerequisite_subjects: course.prerequisite_subjects,
            status: course.status || 'active',
            created_at: new Date(),
            updated_at: new Date()
        });
        return newCourse;
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
};

export const updateCourse = async (id: number, courseData: Partial<Course>): Promise<Course | null> => {
    try {
        const updateData: Record<string, any> = {};
        if (courseData.subjectName) updateData.subject_name = courseData.subjectName;
        if (courseData.credits) updateData.credits = courseData.credits;
        if (courseData.schedule) updateData.schedule = courseData.schedule;
        if (courseData.lecturer) updateData.lecturer = courseData.lecturer;
        if (courseData.subjectCode) updateData.subject_code = courseData.subjectCode;
        if (courseData.type) updateData.type = courseData.type;
        if (courseData.department) updateData.department = courseData.department;
        if (courseData.prerequisite_subjects) updateData.prerequisite_subjects = courseData.prerequisite_subjects;
        if (courseData.status) updateData.status = courseData.status;
        updateData.updated_at = new Date();

        const updatedCourse = await DatabaseService.update('courses', updateData, { id });
        return updatedCourse;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

export const deleteCourse = async (id: number): Promise<boolean> => {
    try {
        const result = await DatabaseService.delete('courses', { id });
        return result > 0;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};

export const searchCourses = async (query: string): Promise<Course[]> => {
    try {
        const courses = await DatabaseService.query(`
            SELECT 
                c.id,
                c.subject_name as "subjectName",
                c.credits,
                c.schedule,
                c.lecturer,
                c.subject_code as "subjectCode",
                c.type,
                c.department,
                c.prerequisite_subjects as "prerequisite_subjects",
                c.status
            FROM courses c
            WHERE 
                c.status = 'active' AND
                (
                    LOWER(c.subject_name) LIKE LOWER($1) OR
                    LOWER(c.lecturer) LIKE LOWER($1) OR
                    LOWER(c.subject_code) LIKE LOWER($1)
                )
            ORDER BY c.subject_code
        `, [`%${query}%`]);
        return courses;
    } catch (error) {
        console.error('Error searching courses:', error);
        throw error;
    }
};
