import { IStudent } from '../../models/student_related/studentInterface';
import { studentService } from '../../services/academicService/student.service';

export const studentBusiness = {
    getStudents: async (semesterId?: string): Promise<{ students: IStudent[], registrationMap: Record<string, boolean> }> => {
        return await studentService.getAllStudents(semesterId);
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