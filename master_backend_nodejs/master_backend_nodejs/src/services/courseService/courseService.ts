// src/services/courseService.ts
import { DatabaseService } from '../database/databaseService';
import ICourse from "../../models/academic_related/course";

export const getCourses = async (): Promise<any[]> => {
    try {
        const courses = await DatabaseService.query(`
            SELECT 
                c.MaMonHoc as "maMonHoc",
                c.TenMonHoc as "tenMonHoc",
                c.MaLoaiMon as "maLoaiMon",
                c.SoTiet as "soTiet",
                l.SoTietMotTC as "soTietMotTC",
                ROUND(c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0), 2) as "credits"
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
                c.MaMonHoc as "maMonHoc",
                c.TenMonHoc as "tenMonHoc",
                c.MaLoaiMon as "maLoaiMon",
                c.SoTiet as "soTiet",
                l.SoTietMotTC as "soTietMotTC",
                ROUND(c.SoTiet::numeric / NULLIF(l.SoTietMotTC, 0), 2) as "credits"
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
            MaMonHoc: course.maMonHoc,
            TenMonHoc: course.tenMonHoc,
            MaLoaiMon: course.maLoaiMon,
            SoTiet: course.soTiet
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
        if (courseData.tenMonHoc) updateData.TenMonHoc = courseData.tenMonHoc;
        if (courseData.maLoaiMon) updateData.MaLoaiMon = courseData.maLoaiMon;
        if (courseData.soTiet) updateData.SoTiet = courseData.soTiet;
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
