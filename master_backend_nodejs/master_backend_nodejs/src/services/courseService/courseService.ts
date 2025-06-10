// src/services/courseService.ts
import { DatabaseService } from '../database/databaseService';
import ICourse from "../../models/academic_related/course";

export const getCourses = async (): Promise<ICourse[]> => {
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
            WHERE c.TrangThai = 'active'
            ORDER BY c.MaMonHoc
        `);
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

export const getCourseById = async (id: string): Promise<ICourse | null> => {
    try {
        const course = await DatabaseService.queryOne(`
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
            WHERE c.MaMonHoc = $1
        `, [id]);
        return course;
    } catch (error) {
        console.error('Error fetching course by id:', error);
        throw error;
    }
};

export const addCourse = async (course: ICourse): Promise<ICourse> => {
    try {
        const newCourse = await DatabaseService.insert('MONHOC', {
            MaMonHoc: course.subjectId,
            TenMonHoc: course.subjectName,
            MaLoaiMon: course.subjectTypeId,
            SoTiet: course.totalHours,
            TrangThai: 'active'
        });
        return newCourse;
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
};

export const updateCourse = async (id: string, courseData: Partial<ICourse>): Promise<ICourse | null> => {
    try {
        const updateData: Record<string, any> = {};
        if (courseData.subjectName) updateData.TenMonHoc = courseData.subjectName;
        if (courseData.subjectTypeId) updateData.MaLoaiMon = courseData.subjectTypeId;
        if (courseData.totalHours) updateData.SoTiet = courseData.totalHours;
        if (courseData.status) updateData.TrangThai = courseData.status;

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
