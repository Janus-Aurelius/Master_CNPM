// src/services/courseService.ts
import { DatabaseService } from '../database/databaseService';
import { Database } from '../../config/database';
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
        console.log('Service - getCourseById called with ID:', id);
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
        console.log('Service - getCourseById result:', course);
        return course;
    } catch (error) {
        console.error('Error fetching course by id:', error);
        throw error;
    }
};

export const addCourse = async (course: any): Promise<any> => {
    try {
        // Thêm course vào database
        await DatabaseService.insert('MONHOC', {
            MaMonHoc: course.courseId,
            TenMonHoc: course.courseName,
            MaLoaiMon: course.courseTypeId,
            SoTiet: course.totalHours
        });
        
        // Fetch lại course vừa thêm với đầy đủ thông tin (bao gồm totalCredits)
        const newCourse = await DatabaseService.queryOne(`
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
        `, [course.courseId]);
        
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
        
        // Update course
        await DatabaseService.update('MONHOC', updateData, { MaMonHoc: id });
        
        // Fetch lại course vừa update với đầy đủ thông tin (bao gồm totalCredits)
        const updatedCourse = await DatabaseService.queryOne(`
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
        
        return updatedCourse;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
    try {
        console.log('Service - deleteCourse called with ID:', id);
        
        return await Database.withClient(async (client: any) => {
            try {
                await client.query('BEGIN');
                
                // Bước 1: Xóa từ bảng CT_PHIEUDANGKY trước (cascade delete)
                console.log('Step 1: Deleting from CT_PHIEUDANGKY...');
                const deleteCTPDKResult = await client.query('DELETE FROM CT_PHIEUDANGKY WHERE MaMonHoc = $1', [id]);
                console.log('Deleted CT_PHIEUDANGKY rows:', deleteCTPDKResult.rowCount);
                
                // Bước 2: Xóa từ bảng DANHSACHMONHOCMO
                console.log('Step 2: Deleting from DANHSACHMONHOCMO...');
                const deleteDSMHMOResult = await client.query('DELETE FROM DANHSACHMONHOCMO WHERE MaMonHoc = $1', [id]);
                console.log('Deleted DANHSACHMONHOCMO rows:', deleteDSMHMOResult.rowCount);
                
                // Bước 3: Cuối cùng xóa từ bảng MONHOC
                console.log('Step 3: Deleting from MONHOC...');
                const deleteMainResult = await client.query('DELETE FROM MONHOC WHERE MaMonHoc = $1', [id]);
                console.log('Deleted MONHOC rows:', deleteMainResult.rowCount);
                
                await client.query('COMMIT');
                
                const success = deleteMainResult.rowCount > 0;
                console.log('Final delete result:', success);
                return success;
                
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            }
        });
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
