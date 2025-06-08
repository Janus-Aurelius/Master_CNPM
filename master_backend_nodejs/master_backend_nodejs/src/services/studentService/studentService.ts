import { IStudent } from '../../models/student_related/studentInterface';
import { DatabaseService } from '../database/databaseService';

export const studentService = {
    async getStudentInfo(studentId: string): Promise<IStudent | null> {
        try {
            const student = await DatabaseService.queryOne(`
                SELECT 
                    student_id as "studentId",
                    name,
                    email,
                    phone,
                    address,
                    date_of_birth as "dateOfBirth",
                    enrollment_year as "enrollmentYear",
                    major,
                    faculty,
                    program,
                    status,
                    avatar_url as "avatarUrl",
                    completed_credits as "completedCredits",
                    current_credits as "currentCredits",
                    required_credits as "requiredCredits",
                    gender,
                    hometown_district as "hometownDistrict",
                    hometown_province as "hometownProvince",
                    is_remote_area as "isRemoteArea"
                FROM students 
                WHERE student_id = $1
            `, [studentId]);

            if (!student) return null;

            return {
                studentId: student.studentId,
                name: student.name,
                email: student.email,
                phone: student.phone,
                address: student.address,
                dateOfBirth: student.dateOfBirth,
                enrollmentYear: student.enrollmentYear,
                major: student.major,
                faculty: student.faculty,
                program: student.program,
                status: student.status,
                avatarUrl: student.avatarUrl,
                credits: {
                    completed: student.completedCredits,
                    current: student.currentCredits,
                    required: student.requiredCredits
                },
                gender: student.gender,
                hometown: student.hometownDistrict ? {
                    district: student.hometownDistrict,
                    province: student.hometownProvince,
                    isRemoteArea: student.isRemoteArea
                } : undefined
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
            if (data.name) updateData.name = data.name;
            if (data.email) updateData.email = data.email;
            if (data.phone) updateData.phone = data.phone;
            if (data.address) updateData.address = data.address;
            if (data.gender) updateData.gender = data.gender;
            if (data.hometown) {
                updateData.hometown_district = data.hometown.district;
                updateData.hometown_province = data.hometown.province;
                updateData.is_remote_area = data.hometown.isRemoteArea;
            }
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
    },

    async createStudent(studentData: Omit<IStudent, 'studentId'>): Promise<IStudent> {
        try {
            // Generate student ID
            const studentId = `SV${Date.now().toString().slice(-6)}`;

            // Insert student
            await DatabaseService.query(`
                INSERT INTO students (
                    student_id,
                    name,
                    email,
                    phone,
                    address,
                    date_of_birth,
                    enrollment_year,
                    major,
                    faculty,
                    program,
                    status,
                    avatar_url,
                    completed_credits,
                    current_credits,
                    required_credits,
                    gender,
                    hometown_district,
                    hometown_province,
                    is_remote_area,
                    created_at,
                    updated_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW()
                )
            `, [
                studentId,
                studentData.name,
                studentData.email,
                studentData.phone,
                studentData.address,
                studentData.dateOfBirth,
                studentData.enrollmentYear,
                studentData.major,
                studentData.faculty,
                studentData.program,
                studentData.status,
                studentData.avatarUrl,
                studentData.credits.completed,
                studentData.credits.current,
                studentData.credits.required,
                studentData.gender,
                studentData.hometown?.district,
                studentData.hometown?.province,
                studentData.hometown?.isRemoteArea
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
    },

    async getAllStudents(): Promise<IStudent[]> {
        try {
            const students = await DatabaseService.query(`
                SELECT 
                    student_id as "studentId",
                    name,
                    email,
                    phone,
                    address,
                    date_of_birth as "dateOfBirth",
                    enrollment_year as "enrollmentYear",
                    major,
                    faculty,
                    program,
                    status,
                    avatar_url as "avatarUrl",
                    completed_credits as "completedCredits",
                    current_credits as "currentCredits",
                    required_credits as "requiredCredits",
                    gender,
                    hometown_district as "hometownDistrict",
                    hometown_province as "hometownProvince",
                    is_remote_area as "isRemoteArea"
                FROM students
                ORDER BY student_id
            `);

            return students.map(student => ({
                studentId: student.studentId,
                name: student.name,
                email: student.email,
                phone: student.phone,
                address: student.address,
                dateOfBirth: student.dateOfBirth,
                enrollmentYear: student.enrollmentYear,
                major: student.major,
                faculty: student.faculty,
                program: student.program,
                status: student.status,
                avatarUrl: student.avatarUrl,
                credits: {
                    completed: student.completedCredits,
                    current: student.currentCredits,
                    required: student.requiredCredits
                },
                gender: student.gender,
                hometown: student.hometownDistrict ? {
                    district: student.hometownDistrict,
                    province: student.hometownProvince,
                    isRemoteArea: student.isRemoteArea
                } : undefined
            }));
        } catch (error) {
            console.error('Error getting all students:', error);
            throw error;
        }
    }
}; 