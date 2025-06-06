import { IGrade } from '../../models/student_related/studentDashboardInterface';

// TODO: Replace with actual database implementation
const grades: IGrade[] = [];
export { grades };

export const gradeService = {
    async getStudentGrades(studentId: string): Promise<IGrade[]> {
        // TODO: Implement database query
        return grades.filter(grade => grade.studentId === studentId);
    },

    async getSubjectDetails(studentId: string, subjectId: string): Promise<IGrade | null> {
        // TODO: Implement database query
        const grade = grades.find(grade => 
            grade.studentId === studentId && 
            grade.subjectId === subjectId
        ) || null;
        if (!grade) return null;
        // Đảm bảo trả về object có subjectId và grade (cho test)
        return grade;
    },

    async updateGrade(gradeData: IGrade): Promise<IGrade> {
        // TODO: Implement database update
        const index = grades.findIndex(g => 
            g.studentId === gradeData.studentId && 
            g.subjectId === gradeData.subjectId
        );
        
        if (index !== -1) {
            grades[index] = gradeData;
        } else {
            grades.push(gradeData);
        }
        
        return gradeData;
    }
};