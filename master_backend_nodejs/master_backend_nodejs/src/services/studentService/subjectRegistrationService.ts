// src/services/studentService/subjectRegistrationService.ts
import { IEnrollment } from '../../models/student_related/studentEnrollmentInterface';
import { ISubject } from '../../models/academic_related/subject';
import { DatabaseService } from '../database/databaseService';

export const subjectRegistrationService = {
    async getAvailableSubjects(semester: string): Promise<ISubject[]> {
        try {
            const subjects = await DatabaseService.query(`
                SELECT 
                    m.MaMonHoc as "subjectId",
                    m.TenMonHoc as "subjectName",
                    m.MaLoaiMon as "subjectTypeId",
                    m.SoTiet as "totalHours",
                    l.TenLoaiMon as "subjectTypeName",
                    l.SoTietMotTC as "hoursPerCredit",
                    l.SoTienMotTC as "costPerCredit"
                FROM MONHOC m
                JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon
                JOIN DANHSACHMONHOCMO d ON m.MaMonHoc = d.MaMonHoc
                WHERE d.MaHocKy = $1
            `, [semester]);

            return subjects;
        } catch (error) {
            console.error('Error in getAvailableSubjects:', error);
            throw error;
        }
    },

    async getSubjectById(subjectId: string): Promise<ISubject | null> {
        try {
            const subject = await DatabaseService.queryOne(`
                SELECT 
                    m.MaMonHoc as "subjectId",
                    m.TenMonHoc as "subjectName",
                    m.MaLoaiMon as "subjectTypeId",
                    m.SoTiet as "totalHours",
                    l.TenLoaiMon as "subjectTypeName",
                    l.SoTietMotTC as "hoursPerCredit",
                    l.SoTienMotTC as "costPerCredit"
                FROM MONHOC m
                JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon
                WHERE m.MaMonHoc = $1
            `, [subjectId]);

            return subject;
        } catch (error) {
            console.error('Error getting subject by id:', error);
            throw error;
        }
    },

    async checkPrerequisites(studentId: string, subjectId: string): Promise<boolean> {
        try {
            // Check if student has completed all prerequisites
            const completedSubjects = await DatabaseService.query(`
                SELECT MaMonHoc
                FROM DIEM
                WHERE MaSinhVien = $1 AND DiemChu IN ('A', 'B', 'C', 'D')
            `, [studentId]);

            const completedSubjectIds = completedSubjects.map(s => s.MaMonHoc);
            
            // Get prerequisites for the subject
            const prerequisites = await DatabaseService.query(`
                SELECT MaMonHocTruoc
                FROM MONHOC_TRUOC
                WHERE MaMonHoc = $1
            `, [subjectId]);

            return prerequisites.every((prereq: any) => completedSubjectIds.includes(prereq.MaMonHocTruoc));
        } catch (error) {
            console.error('Error checking prerequisites:', error);
            throw error;
        }
    },

    async checkScheduleConflict(studentId: string, subjectId: string): Promise<boolean> {
        try {
            // Get current semester
            const currentSemester = await DatabaseService.queryOne(`
                SELECT MaHocKy
                FROM PHIEUDANGKY
                WHERE MaSinhVien = $1 AND TrangThai = 'active'
                LIMIT 1
            `, [studentId]);

            if (!currentSemester) return false;

            // Get enrolled subjects schedule
            const enrolledSchedules = await DatabaseService.query(`
                SELECT l.Thu, l.Tiet
                FROM CT_PHIEUDANGKY c
                JOIN LICH l ON c.MaMonHoc = l.MaMonHoc
                WHERE c.MaPhieuDangKy IN (
                    SELECT MaPhieuDangKy 
                    FROM PHIEUDANGKY 
                    WHERE MaSinhVien = $1 AND MaHocKy = $2
                )
            `, [studentId, currentSemester.MaHocKy]);

            // Get new subject schedule
            const newSubjectSchedule = await DatabaseService.query(`
                SELECT Thu, Tiet
                FROM LICH
                WHERE MaMonHoc = $1
            `, [subjectId]);

            // Check for conflicts
            for (const enrolled of enrolledSchedules) {
                for (const newSchedule of newSubjectSchedule) {
                    if (enrolled.Thu === newSchedule.Thu && enrolled.Tiet === newSchedule.Tiet) {
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
                SELECT MaHocKy
                FROM PHIEUDANGKY
                WHERE MaSinhVien = $1 AND TrangThai = 'active'
                LIMIT 1
            `, [studentId]);

            if (!currentSemester) return true;

            // Calculate current credits
            const currentCredits = await DatabaseService.queryOne(`
                SELECT COALESCE(SUM(CEIL(m.SoTiet / l.SoTietMotTC)), 0) as total_credits
                FROM CT_PHIEUDANGKY c
                JOIN MONHOC m ON c.MaMonHoc = m.MaMonHoc
                JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon
                WHERE c.MaPhieuDangKy IN (
                    SELECT MaPhieuDangKy 
                    FROM PHIEUDANGKY 
                    WHERE MaSinhVien = $1 AND MaHocKy = $2
                )
            `, [studentId, currentSemester.MaHocKy]);

            // Calculate new subject credits
            const newSubject = await this.getSubjectById(subjectId);
            if (!newSubject) return false;

            // Get hours per credit from LOAIMON
            const subjectType = await DatabaseService.queryOne(`
                SELECT SoTietMotTC
                FROM LOAIMON
                WHERE MaLoaiMon = $1
            `, [newSubject.subjectTypeId]);

            const subjectCredits = Math.ceil(newSubject.totalHours / subjectType.SoTietMotTC);
            const MAX_CREDITS_PER_SEMESTER = 24; // Example limit
            return (currentCredits.total_credits + subjectCredits) <= MAX_CREDITS_PER_SEMESTER;
        } catch (error) {
            console.error('Error checking credit limit:', error);
            throw error;
        }
    },

    async searchSubjects(query: string, semester: string): Promise<ISubject[]> {
        try {
            const subjects = await DatabaseService.query(`
                SELECT 
                    m.MaMonHoc as "subjectId",
                    m.TenMonHoc as "subjectName",
                    m.MaLoaiMon as "subjectTypeId",
                    m.SoTiet as "totalHours",
                    l.TenLoaiMon as "subjectTypeName",
                    l.SoTietMotTC as "hoursPerCredit",
                    l.SoTienMotTC as "costPerCredit"
                FROM MONHOC m
                JOIN LOAIMON l ON m.MaLoaiMon = l.MaLoaiMon
                JOIN DANHSACHMONHOCMO d ON m.MaMonHoc = d.MaMonHoc
                WHERE d.MaHocKy = $1 AND (
                    LOWER(m.TenMonHoc) LIKE LOWER($2) OR 
                    LOWER(m.MaMonHoc) LIKE LOWER($2)
                )
            `, [semester, `%${query.toLowerCase()}%`]);

            return subjects;
        } catch (error) {
            console.error('Error searching subjects:', error);
            throw error;
        }
    },

    async enrollInSubject(studentId: string, subjectId: string, semester: string): Promise<IEnrollment> {
        try {
            // Check if student is already enrolled
            const existingEnrollment = await DatabaseService.query(
                'SELECT * FROM CT_PHIEUDANGKY WHERE MaPhieuDangKy = $1 AND MaMonHoc = $2',
                [studentId, subjectId]
            );

            if (existingEnrollment.length > 0) {
                throw new Error('Student is already enrolled in this subject');
            }

            // Create new enrollment
            const enrollment = await DatabaseService.query(
                `INSERT INTO CT_PHIEUDANGKY (MaPhieuDangKy, MaMonHoc)
                VALUES ($1, $2)
                RETURNING *`,
                [studentId, subjectId]
            );

            return enrollment[0];
        } catch (error) {
            console.error('Error in enrollInSubject:', error);
            throw error;
        }
    }
};

export const subjects: ISubject[] = [];
