import { IGrade } from '../../models/student_related/studentDashboardInterface';
import { DatabaseService } from '../database/databaseService';

export const gradeService = {
    async getStudentGrades(studentId: string): Promise<IGrade[]> {
        try {
            const grades = await DatabaseService.query(`
                SELECT 
                    student_id as "studentId",
                    subject_id as "subjectId",
                    midterm_grade as "midtermGrade",
                    final_grade as "finalGrade",
                    total_grade as "totalGrade",
                    letter_grade as "letterGrade"
                FROM grades
                WHERE student_id = $1
                ORDER BY subject_id
            `, [studentId]);

            return grades;
        } catch (error) {
            console.error('Error getting student grades:', error);
            throw error;
        }
    },

    async getSubjectDetails(studentId: string, subjectId: string): Promise<IGrade | null> {
        try {
            const grade = await DatabaseService.queryOne(`
                SELECT 
                    student_id as "studentId",
                    subject_id as "subjectId",
                    midterm_grade as "midtermGrade",
                    final_grade as "finalGrade",
                    total_grade as "totalGrade",
                    letter_grade as "letterGrade"
                FROM grades
                WHERE student_id = $1 AND subject_id = $2
            `, [studentId, subjectId]);

            return grade || null;
        } catch (error) {
            console.error('Error getting subject details:', error);
            throw error;
        }
    },

    async updateGrade(gradeData: IGrade): Promise<IGrade> {
        try {
            // Check if grade exists
            const existingGrade = await this.getSubjectDetails(gradeData.studentId, gradeData.subjectId);

            if (existingGrade) {
                // Update existing grade
                await DatabaseService.query(`
                    UPDATE grades 
                    SET 
                        midterm_grade = $1,
                        final_grade = $2,
                        total_grade = $3,
                        letter_grade = $4,
                        updated_at = NOW()
                    WHERE student_id = $5 AND subject_id = $6
                `, [
                    gradeData.midtermGrade,
                    gradeData.finalGrade,
                    gradeData.totalGrade,
                    gradeData.letterGrade,
                    gradeData.studentId,
                    gradeData.subjectId
                ]);
            } else {
                // Insert new grade
                await DatabaseService.query(`
                    INSERT INTO grades (
                        student_id,
                        subject_id,
                        midterm_grade,
                        final_grade,
                        total_grade,
                        letter_grade,
                        created_at,
                        updated_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                `, [
                    gradeData.studentId,
                    gradeData.subjectId,
                    gradeData.midtermGrade,
                    gradeData.finalGrade,
                    gradeData.totalGrade,
                    gradeData.letterGrade
                ]);
            }

            // Return updated grade
            const updatedGrade = await this.getSubjectDetails(gradeData.studentId, gradeData.subjectId);
            if (!updatedGrade) {
                throw new Error('Failed to get updated grade');
            }
            return updatedGrade;
        } catch (error) {
            console.error('Error updating grade:', error);
            throw error;
        }
    }
};