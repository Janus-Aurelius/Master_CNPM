import { IStudent } from '../../models/student_related/studentInterface';

// TODO: Replace with actual database implementation
const students: IStudent[] = [];

export const studentService = {
    async getStudentInfo(studentId: string): Promise<IStudent | null> {
        // TODO: Implement database query
        return students.find(student => student.id === studentId) || null;
    },

    async updateStudentInfo(studentId: string, data: Partial<IStudent>): Promise<IStudent | null> {
        // TODO: Kết nối DB để kiểm tra huyện/tỉnh/vùng sâu vùng xa
        const student = students.find(s => s.id === studentId);
        if (student) {
            Object.assign(student, data);
            return student;
        }
        return null;
    },

    async createStudent(studentData: Omit<IStudent, 'id'>): Promise<IStudent> {
        // TODO: Kết nối DB để kiểm tra huyện/tỉnh/vùng sâu vùng xa
        const newStudent: IStudent = {
            ...studentData,
            id: Math.random().toString(36).substr(2, 9)
        };
        students.push(newStudent);
        return newStudent;
    },

    async deleteStudent(studentId: string): Promise<boolean> {
        // TODO: Implement database delete
        const index = students.findIndex(s => s.id === studentId);
        if (index !== -1) {
            students.splice(index, 1);
            return true;
        }
        return false;
    },

    async getAllStudents(): Promise<IStudent[]> {
        // TODO: Implement database query
        return students;
    }
}; 