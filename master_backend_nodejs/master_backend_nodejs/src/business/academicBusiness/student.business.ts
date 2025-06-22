import { IStudent } from '../../models/student_related/studentInterface';
import { studentService } from '../../services/academicService/student.service';

export const studentBusiness = {
    getStudents: async (): Promise<IStudent[]> => {
        return await studentService.getAllStudents();
    },

    createStudent: async (student: Omit<IStudent, 'id'>): Promise<IStudent> => {
        return await studentService.createStudent(student);
    },

    updateStudent: async (id: string, student: IStudent): Promise<IStudent> => {
        return await studentService.updateStudent(id, student);
    },

    deleteStudent: async (id: string): Promise<void> => {
        await studentService.deleteStudent(id);
    },

    searchStudents: async (query: string): Promise<IStudent[]> => {
        return await studentService.searchStudents(query);
    },

    // Tạo hàng loạt PHIEUDANGKY
    createBulkRegistrations: async (studentIds: string[], semesterId: string, maxCredits: number): Promise<any> => {
        return await studentService.createBulkRegistrations(studentIds, semesterId, maxCredits);
    },
}; 