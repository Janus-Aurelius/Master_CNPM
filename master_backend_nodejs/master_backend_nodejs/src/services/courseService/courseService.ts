// src/services/courseService.ts
import { DatabaseService } from '../database/databaseService';
import ICourse from "../../models/academic_related/course";

export const getCourses = async (): Promise<any[]> => {
    try {
        const courses = await DatabaseService.query(`
            SELECT 
                c.MaMonHoc as "courseId",
                c.TenMonHoc as "courseName",
                c.MaLoaiMon as "courseTypeId",
                c.SoTiet as "totalHours",
                l.TenLoaiMon as "courseTypeName",
                l.SoTietMotTC as "hoursPerCredit",
                l.SoTienMotTC as "pricePerCredit",
                ROUND(c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0), 2) as "totalCredits",
                ROUND((c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0)) * l.SoTienMotTC, 2) as "totalPrice"
            FROM MONHOC c
            JOIN LOAIMON l ON c.MaLoaiMon = l.MaLoaiMon
            ORDER BY c.MaMonHoc
        `);
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

export const getCourseById = async (id: string): Promise<any | null> => {
    try {
        const course = await DatabaseService.queryOne(`
            SELECT 
                c.MaMonHoc as "courseId",
                c.TenMonHoc as "courseName",
                c.MaLoaiMon as "courseTypeId",
                c.SoTiet as "totalHours",
                l.TenLoaiMon as "courseTypeName",
                l.SoTietMotTC as "hoursPerCredit",
                l.SoTienMotTC as "pricePerCredit",
                ROUND(c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0), 2) as "totalCredits",
                ROUND((c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0)) * l.SoTienMotTC, 2) as "totalPrice"
            FROM MONHOC c
            JOIN LOAIMON l ON c.MaLoaiMon = l.MaLoaiMon
            WHERE c.MaMonHoc = $1
        `, [id]);
        return course;
    } catch (error) {
        console.error('Error fetching course by id:', error);
        throw error;
    }
};

export const addCourse = async (course: any): Promise<any> => {
    try {
        const newCourse = await DatabaseService.insert('MONHOC', {
            MaMonHoc: course.courseId,
            TenMonHoc: course.courseName,
            MaLoaiMon: course.courseTypeId,
            SoTiet: course.totalHours
        });
        return newCourse;
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
};

export const updateCourse = async (id: string, courseData: Partial<any>): Promise<any | null> => {
    try {
        const updateData: Record<string, any> = {};
        if (courseData.courseName) updateData.TenMonHoc = courseData.courseName;
        if (courseData.courseTypeId) updateData.MaLoaiMon = courseData.courseTypeId;
        if (courseData.totalHours) updateData.SoTiet = courseData.totalHours;
        const updatedCourse = await DatabaseService.update('MONHOC', updateData, { MaMonHoc: id });
        return updatedCourse;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
    try {
        const result = await DatabaseService.delete('MONHOC', { MaMonHoc: id });
        return result > 0;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};

export const searchCourses = async (query: string): Promise<ICourse[]> => {
    try {
        const courses = await DatabaseService.query(`
            SELECT 
                c.MaMonHoc as "subjectId",
                c.TenMonHoc as "subjectName",
                c.MaLoaiMon as "subjectTypeId",
                c.SoTiet as "totalHours",
                l.TenLoaiMon as "subjectTypeName",
                l.SoTietMotTC as "hoursPerCredit",
                l.SoTienMotTC as "costPerCredit"
            FROM MONHOC c
            JOIN LOAIMON l ON c.MaLoaiMon = l.MaLoaiMon
            WHERE 
                c.TrangThai = 'active' AND
                (
                    LOWER(c.TenMonHoc) LIKE LOWER($1) OR
                    LOWER(c.MaMonHoc) LIKE LOWER($1)
                )
            ORDER BY c.MaMonHoc
        `, [`%${query}%`]);
        return courses;
    } catch (error) {
        console.error('Error searching courses:', error);
        throw error;
    }
};
