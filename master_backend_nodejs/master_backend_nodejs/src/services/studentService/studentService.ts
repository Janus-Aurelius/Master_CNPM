import { IStudent } from '../../models/student_related/studentInterface';
import { DatabaseService } from '../database/databaseService';

export const studentService = {    async getStudentInfo(studentId: string): Promise<IStudent | null> {
        try {
            const student = await DatabaseService.queryOne(`
                SELECT 
                    student_id as "studentId",
                    full_name as "fullName",
                    date_of_birth as "dateOfBirth",
                    gender,
                    hometown,
                    district_id as "districtId",
                    priority_object_id as "priorityObjectId",
                    major_id as "majorId",
                    email,
                    phone,
                    status
                FROM students 
                WHERE student_id = $1
            `, [studentId]);

            if (!student) return null;

            return {
                studentId: student.studentId,
                fullName: student.fullName,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
                hometown: student.hometown,
                districtId: student.districtId,
                priorityObjectId: student.priorityObjectId,
                majorId: student.majorId,
                email: student.email,
                phone: student.phone,
                status: student.status
            };
        } catch (error) {
            console.error('Error getting student info:', error);
            throw error;
        }
    },

    async updateStudentInfo(studentId: string, data: Partial<IStudent>): Promise<IStudent | null> {
        try {
            // Check if student exists
            const existingStudent = await this.getStudentInfo(studentId);
            if (!existingStudent) return null;

            // Prepare update data
            const updateData: Record<string, any> = {};
            if (data.fullName) updateData.full_name = data.fullName;
            if (data.email) updateData.email = data.email;
            if (data.phone) updateData.phone = data.phone;
            if (data.gender) updateData.gender = data.gender;
            if (data.hometown) updateData.hometown = data.hometown;
            if (data.districtId) updateData.district_id = data.districtId;
            if (data.priorityObjectId) updateData.priority_object_id = data.priorityObjectId;
            if (data.majorId) updateData.major_id = data.majorId;
            updateData.updated_at = new Date();

            // Update student
            await DatabaseService.query(`
                UPDATE students 
                SET ${Object.keys(updateData).map((key, index) => `${key} = $${index + 1}`).join(', ')}
                WHERE student_id = $${Object.keys(updateData).length + 1}
            `, [...Object.values(updateData), studentId]);

            // Return updated student
            return this.getStudentInfo(studentId);
        } catch (error) {
            console.error('Error updating student info:', error);
            throw error;
        }
    },    async createStudent(studentData: Omit<IStudent, 'studentId'>): Promise<IStudent> {
        try {
            // Generate student ID
            const studentId = `SV${Date.now().toString().slice(-6)}`;

            // Insert student
            await DatabaseService.query(`
                INSERT INTO students (
                    student_id,
                    full_name,
                    date_of_birth,
                    gender,
                    hometown,
                    district_id,
                    priority_object_id,
                    major_id,
                    email,
                    phone,
                    status,
                    created_at,
                    updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()
                )
            `, [
                studentId,
                studentData.fullName,
                studentData.dateOfBirth,
                studentData.gender,
                studentData.hometown,
                studentData.districtId,
                studentData.priorityObjectId,
                studentData.majorId,
                studentData.email,
                studentData.phone,
                studentData.status
            ]);

            // Return created student
            const createdStudent = await this.getStudentInfo(studentId);
            if (!createdStudent) {
                throw new Error('Failed to get created student');
            }
            return createdStudent;
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    async deleteStudent(studentId: string): Promise<boolean> {
        try {
            // Check if student exists
            const existingStudent = await this.getStudentInfo(studentId);
            if (!existingStudent) return false;

            // Delete student
            await DatabaseService.query(`
                DELETE FROM students 
                WHERE student_id = $1
            `, [studentId]);

            return true;
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    },    async getAllStudents(): Promise<IStudent[]> {
        try {
            const students = await DatabaseService.query(`
                SELECT 
                    student_id as "studentId",
                    full_name as "fullName",
                    date_of_birth as "dateOfBirth",
                    gender,
                    hometown,
                    district_id as "districtId",
                    priority_object_id as "priorityObjectId",
                    major_id as "majorId",
                    email,
                    phone,
                    status
                FROM students
            `);

            return students.map(student => ({
                studentId: student.studentId,
                fullName: student.fullName,
                dateOfBirth: student.dateOfBirth,
                gender: student.gender,
                hometown: student.hometown,
                districtId: student.districtId,
                priorityObjectId: student.priorityObjectId,
                majorId: student.majorId,
                email: student.email,
                phone: student.phone,
                status: student.status
            }));
        } catch (error) {
            console.error('Error getting all students:', error);
            throw error;
        }
    }
}; 