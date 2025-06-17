import { DatabaseService } from '../database/databaseService';
import { IPriorityObject, ICourseTypeManagement } from '../../models/student_related/studentPaymentInterface';

/**
 * Service for managing priority objects (DOITUONGUUTIEN table)
 */
export const priorityObjectService = {
    
    /**
     * Get all priority objects
     */
    async getAllPriorityObjects(): Promise<IPriorityObject[]> {
        try {
            const records = await DatabaseService.query(`
                SELECT 
                    MaDoiTuong as "priorityId",
                    TenDoiTuong as "priorityName",
                    MucGiamHocPhi as "discountAmount"
                FROM DOITUONGUUTIEN
                ORDER BY TenDoiTuong
            `);
            
            return records;
        } catch (error) {
            console.error('Error getting priority objects:', error);
            throw error;
        }
    },

    /**
     * Get priority object by ID
     */
    async getPriorityObjectById(priorityId: string): Promise<IPriorityObject | null> {
        try {
            const record = await DatabaseService.queryOne(`
                SELECT 
                    MaDoiTuong as "priorityId",
                    TenDoiTuong as "priorityName",
                    MucGiamHocPhi as "discountAmount"
                FROM DOITUONGUUTIEN
                WHERE MaDoiTuong = $1
            `, [priorityId]);
            
            return record;
        } catch (error) {
            console.error('Error getting priority object by ID:', error);
            throw error;
        }
    },

    /**
     * Create new priority object
     */
    async createPriorityObject(data: Omit<IPriorityObject, 'priorityId'>): Promise<IPriorityObject> {
        try {
            // Generate new ID
            const newId = `DT${Date.now()}`;
            
            const result = await DatabaseService.queryOne(`
                INSERT INTO DOITUONGUUTIEN (MaDoiTuong, TenDoiTuong, MucGiamHocPhi)
                VALUES ($1, $2, $3)
                RETURNING 
                    MaDoiTuong as "priorityId",
                    TenDoiTuong as "priorityName",
                    MucGiamHocPhi as "discountAmount"
            `, [newId, data.priorityName, data.discountAmount]);
            
            return result;
        } catch (error) {
            console.error('Error creating priority object:', error);
            throw error;
        }
    },

    /**
     * Update priority object
     */
    async updatePriorityObject(priorityId: string, data: Partial<Omit<IPriorityObject, 'priorityId'>>): Promise<IPriorityObject | null> {
        try {
            const setClauses = [];
            const values = [];
            let paramIndex = 1;

            if (data.priorityName !== undefined) {
                setClauses.push(`TenDoiTuong = $${paramIndex}`);
                values.push(data.priorityName);
                paramIndex++;
            }

            if (data.discountAmount !== undefined) {
                setClauses.push(`MucGiamHocPhi = $${paramIndex}`);
                values.push(data.discountAmount);
                paramIndex++;
            }

            if (setClauses.length === 0) {
                throw new Error('No data to update');
            }

            values.push(priorityId);

            const result = await DatabaseService.queryOne(`
                UPDATE DOITUONGUUTIEN 
                SET ${setClauses.join(', ')}
                WHERE MaDoiTuong = $${paramIndex}
                RETURNING 
                    MaDoiTuong as "priorityId",
                    TenDoiTuong as "priorityName",
                    MucGiamHocPhi as "discountAmount"
            `, values);
            
            return result;
        } catch (error) {
            console.error('Error updating priority object:', error);
            throw error;
        }
    },

    /**
     * Delete priority object
     */
    async deletePriorityObject(priorityId: string): Promise<boolean> {
        try {
            // Check if any students are using this priority object
            const studentCount = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count FROM SINHVIEN WHERE MaDoiTuongUT = $1
            `, [priorityId]);

            if (parseInt(studentCount.count) > 0) {
                throw new Error('Cannot delete priority object: students are still using it');
            }

            const result = await DatabaseService.queryOne(`
                DELETE FROM DOITUONGUUTIEN WHERE MaDoiTuong = $1
                RETURNING MaDoiTuong
            `, [priorityId]);
            
            return !!result;
        } catch (error) {
            console.error('Error deleting priority object:', error);
            throw error;
        }
    }
};

/**
 * Service for managing course types (LOAIMON table)
 */
export const courseTypeService = {
    
    /**
     * Get all course types
     */
    async getAllCourseTypes(): Promise<ICourseTypeManagement[]> {
        try {
            const records = await DatabaseService.query(`
                SELECT 
                    MaLoaiMon as "courseTypeId",
                    TenLoaiMon as "courseTypeName",
                    SoTietMotTC as "hoursPerCredit",
                    SoTienMotTC as "pricePerCredit"
                FROM LOAIMON
                ORDER BY TenLoaiMon
            `);
            
            return records;
        } catch (error) {
            console.error('Error getting course types:', error);
            throw error;
        }
    },

    /**
     * Get course type by ID
     */
    async getCourseTypeById(courseTypeId: string): Promise<ICourseTypeManagement | null> {
        try {
            const record = await DatabaseService.queryOne(`
                SELECT 
                    MaLoaiMon as "courseTypeId",
                    TenLoaiMon as "courseTypeName",
                    SoTietMotTC as "hoursPerCredit",
                    SoTienMotTC as "pricePerCredit"
                FROM LOAIMON
                WHERE MaLoaiMon = $1
            `, [courseTypeId]);
            
            return record;
        } catch (error) {
            console.error('Error getting course type by ID:', error);
            throw error;
        }
    },

    /**
     * Create new course type
     */
    async createCourseType(data: Omit<ICourseTypeManagement, 'courseTypeId'>): Promise<ICourseTypeManagement> {
        try {
            // Generate new ID
            const newId = `LM${Date.now()}`;
            
            const result = await DatabaseService.queryOne(`
                INSERT INTO LOAIMON (MaLoaiMon, TenLoaiMon, SoTietMotTC, SoTienMotTC)
                VALUES ($1, $2, $3, $4)
                RETURNING 
                    MaLoaiMon as "courseTypeId",
                    TenLoaiMon as "courseTypeName",
                    SoTietMotTC as "hoursPerCredit",
                    SoTienMotTC as "pricePerCredit"
            `, [newId, data.courseTypeName, data.hoursPerCredit, data.pricePerCredit]);
            
            return result;
        } catch (error) {
            console.error('Error creating course type:', error);
            throw error;
        }
    },

    /**
     * Update course type
     */
    async updateCourseType(courseTypeId: string, data: Partial<Omit<ICourseTypeManagement, 'courseTypeId'>>): Promise<ICourseTypeManagement | null> {
        try {
            const setClauses = [];
            const values = [];
            let paramIndex = 1;

            if (data.courseTypeName !== undefined) {
                setClauses.push(`TenLoaiMon = $${paramIndex}`);
                values.push(data.courseTypeName);
                paramIndex++;
            }

            if (data.hoursPerCredit !== undefined) {
                setClauses.push(`SoTietMotTC = $${paramIndex}`);
                values.push(data.hoursPerCredit);
                paramIndex++;
            }

            if (data.pricePerCredit !== undefined) {
                setClauses.push(`SoTienMotTC = $${paramIndex}`);
                values.push(data.pricePerCredit);
                paramIndex++;
            }

            if (setClauses.length === 0) {
                throw new Error('No data to update');
            }

            values.push(courseTypeId);

            const result = await DatabaseService.queryOne(`
                UPDATE LOAIMON 
                SET ${setClauses.join(', ')}
                WHERE MaLoaiMon = $${paramIndex}
                RETURNING 
                    MaLoaiMon as "courseTypeId",
                    TenLoaiMon as "courseTypeName",
                    SoTietMotTC as "hoursPerCredit",
                    SoTienMotTC as "pricePerCredit"
            `, values);
            
            return result;
        } catch (error) {
            console.error('Error updating course type:', error);
            throw error;
        }
    },

    /**
     * Delete course type
     */
    async deleteCourseType(courseTypeId: string): Promise<boolean> {
        try {
            // Check if any courses are using this course type
            const courseCount = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count FROM MONHOC WHERE MaLoaiMon = $1
            `, [courseTypeId]);

            if (parseInt(courseCount.count) > 0) {
                throw new Error('Cannot delete course type: courses are still using it');
            }

            const result = await DatabaseService.queryOne(`
                DELETE FROM LOAIMON WHERE MaLoaiMon = $1
                RETURNING MaLoaiMon
            `, [courseTypeId]);
            
            return !!result;
        } catch (error) {
            console.error('Error deleting course type:', error);
            throw error;
        }
    },

    /**
     * Get courses using this course type
     */
    async getCoursesUsingType(courseTypeId: string): Promise<any[]> {
        try {
            const courses = await DatabaseService.query(`
                SELECT 
                    MaMonHoc as "courseId",
                    TenMonHoc as "courseName",
                    SoTiet as "totalHours"
                FROM MONHOC
                WHERE MaLoaiMon = $1
                ORDER BY TenMonHoc
            `, [courseTypeId]);
            
            return courses;
        } catch (error) {
            console.error('Error getting courses using type:', error);
            throw error;
        }
    }
};
