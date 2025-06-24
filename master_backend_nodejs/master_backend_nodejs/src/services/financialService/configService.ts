// src/services/financialService/configService.ts
import { DatabaseService } from '../database/databaseService';
import { IPriorityObject, ICourseTypeManagement } from '../../models/student_related/studentPaymentInterface';

export class FinancialConfigService {
    /**
     * Get all priority objects (đối tượng ưu tiên)
     */
    async getPriorityObjects(): Promise<IPriorityObject[]> {
        const query = `
            SELECT 
                MaDoiTuong as priority_id,
                TenDoiTuong as priority_name,
                MucGiamHocPhi as discount_amount
            FROM DOITUONGUUTIEN
            ORDER BY TenDoiTuong
        `;

        const result = await DatabaseService.query(query);
        
        return result.map(row => ({
            priorityId: row.priority_id,
            priorityName: row.priority_name,
            discountAmount: parseFloat(row.discount_amount)
        }));
    }

    /**
     * Create a new priority object
     */
    async createPriorityObject(data: {
        priorityId: string;
        priorityName: string;
        discountAmount: number;
    }): Promise<{ success: boolean, message?: string }> {
        try {
            // Check if priority ID already exists
            const exists = await DatabaseService.exists('DOITUONGUUTIEN', {
                MaDoiTuong: data.priorityId
            });

            if (exists) {
                return {
                    success: false,
                    message: 'Priority object ID already exists'
                };
            }

            await DatabaseService.insert('DOITUONGUUTIEN', {
                MaDoiTuong: data.priorityId,
                TenDoiTuong: data.priorityName,
                MucGiamHocPhi: data.discountAmount
            });

            return {
                success: true,
                message: 'Priority object created successfully'
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to create priority object: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Update a priority object
     */
    async updatePriorityObject(
        priorityId: string,
        data: {
            priorityName?: string;
            discountAmount?: number;
        }
    ): Promise<{ success: boolean, message?: string }> {
        try {
            const updateData: any = {};
            
            if (data.priorityName !== undefined) {
                updateData.TenDoiTuong = data.priorityName;
            }
            
            if (data.discountAmount !== undefined) {
                updateData.MucGiamHocPhi = data.discountAmount;
            }

            if (Object.keys(updateData).length === 0) {
                return {
                    success: false,
                    message: 'No data to update'
                };
            }

            const result = await DatabaseService.update(
                'DOITUONGUUTIEN',
                updateData,
                { MaDoiTuong: priorityId }
            );

            if (!result) {
                return {
                    success: false,
                    message: 'Priority object not found'
                };
            }

            return {
                success: true,
                message: 'Priority object updated successfully'
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to update priority object: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Delete a priority object
     */
    async deletePriorityObject(priorityId: string): Promise<{ success: boolean, message?: string }> {
        try {
            // Check if priority object is being used by any student
            const isUsed = await DatabaseService.queryOne(`
                SELECT COUNT(*) as count 
                FROM SINHVIEN 
                WHERE MaDoiTuong = $1
            `, [priorityId]);

            if (isUsed && parseInt(isUsed.count) > 0) {
                return {
                    success: false,
                    message: 'Cannot delete priority object: it is being used by students'
                };
            }

            const deletedCount = await DatabaseService.delete('DOITUONGUUTIEN', {
                MaDoiTuong: priorityId
            });

            if (deletedCount === 0) {
                return {
                    success: false,
                    message: 'Priority object not found'
                };
            }

            return {
                success: true,
                message: 'Priority object deleted successfully'
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to delete priority object: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get all course types with their pricing for current semester
     */
    async getCourseTypes(): Promise<ICourseTypeManagement[]> {
        // Get current semester first
        const currentSemester = await DatabaseService.queryOne(`
            SELECT current_semester FROM ACADEMIC_SETTINGS WHERE id = 1
        `);
        
        const semesterId = currentSemester?.current_semester;
        
        if (!semesterId) {
            throw new Error('Current semester not configured');
        }

        const query = `
            SELECT 
                lm.MaLoaiMon as course_type_id,
                lm.TenLoaiMon as course_type_name,
                lm.SoTietMotTC as hours_per_credit,
                COALESCE(ht.SoTienMotTC, 0) as price_per_credit
            FROM LOAIMON lm
            LEFT JOIN HOCPHI_THEOHK ht ON lm.MaLoaiMon = ht.MaLoaiMon AND ht.MaHocKy = $1
            ORDER BY lm.TenLoaiMon
        `;

        const result = await DatabaseService.query(query, [semesterId]);
        
        return result.map(row => ({
            courseTypeId: row.course_type_id,
            courseTypeName: row.course_type_name,
            hoursPerCredit: parseInt(row.hours_per_credit),
            pricePerCredit: parseFloat(row.price_per_credit)
        }));
    }

    /**
     * Update course type pricing for current semester
     */
    async updateCourseTypePrice(
        courseTypeId: string,
        newPrice: number
    ): Promise<{ success: boolean, message?: string }> {
        try {
            // Get current semester first
            const currentSemester = await DatabaseService.queryOne(`
                SELECT current_semester FROM ACADEMIC_SETTINGS WHERE id = 1
            `);
            
            const semesterId = currentSemester?.current_semester;
            
            if (!semesterId) {
                return {
                    success: false,
                    message: 'Current semester not configured'
                };
            }

            // Check if pricing record exists for this semester and course type
            const existingRecord = await DatabaseService.queryOne(`
                SELECT MaHocKy FROM HOCPHI_THEOHK 
                WHERE MaHocKy = $1 AND MaLoaiMon = $2
            `, [semesterId, courseTypeId]);

            if (existingRecord) {
                // Update existing record
                await DatabaseService.update(
                    'HOCPHI_THEOHK',
                    { SoTienMotTC: newPrice },
                    { MaHocKy: semesterId, MaLoaiMon: courseTypeId }
                );
            } else {
                // Insert new record
                await DatabaseService.insert('HOCPHI_THEOHK', {
                    MaHocKy: semesterId,
                    MaLoaiMon: courseTypeId,
                    SoTienMotTC: newPrice
                });
            }

            return {
                success: true,
                message: 'Course type price updated successfully for current semester'
            };

        } catch (error: any) {
            return {
                success: false,
                message: `Failed to update course type price: ${error?.message || 'Unknown error'}`
            };
        }
    }

    /**
     * Get all course types with pricing for a specific semester
     */
    async getAllCourseTypesWithPricing(semesterId?: string): Promise<ICourseTypeManagement[]> {
        let targetSemester = semesterId;
        
        if (!targetSemester) {
            const currentSemester = await DatabaseService.queryOne(`
                SELECT current_semester FROM ACADEMIC_SETTINGS WHERE id = 1
            `);
            targetSemester = currentSemester?.current_semester;
        }
        
        if (!targetSemester) {
            throw new Error('Semester not specified and no current semester configured');
        }

        const query = `
            SELECT 
                lm.MaLoaiMon as course_type_id,
                lm.TenLoaiMon as course_type_name,
                lm.SoTietMotTC as hours_per_credit,
                COALESCE(ht.SoTienMotTC, 0) as price_per_credit
            FROM LOAIMON lm
            LEFT JOIN HOCPHI_THEOHK ht ON lm.MaLoaiMon = ht.MaLoaiMon AND ht.MaHocKy = $1
            ORDER BY lm.TenLoaiMon
        `;

        const result = await DatabaseService.query(query, [targetSemester]);
        
        return result.map(row => ({
            courseTypeId: row.course_type_id,
            courseTypeName: row.course_type_name,
            hoursPerCredit: parseInt(row.hours_per_credit),
            pricePerCredit: parseFloat(row.price_per_credit)
        }));
    }

    /**
     * Get payment deadline from current active semester
     */
    async getPaymentDeadline(): Promise<{ deadline: Date | null, semesterName: string | null }> {
        const query = `
            SELECT 
                HanDongHocPhi as deadline,
                TenHocKy as semester_name
            FROM HOCKYNAMHOC 
            WHERE TrangThaiHocKy = 'active' 
            ORDER BY ThoiGianBatDau DESC 
            LIMIT 1
        `;

        const result = await DatabaseService.queryOne(query);
        
        if (!result) {
            return {
                deadline: null,
                semesterName: null
            };
        }

        return {
            deadline: result.deadline,
            semesterName: result.semester_name
        };
    }

    /**
     * Get semester configuration details
     */
    async getSemesterConfig(semesterId?: string): Promise<any> {
        let query: string;
        let params: any[] = [];

        if (semesterId) {
            query = `
                SELECT 
                    MaHocKy as semester_id,
                    TenHocKy as semester_name,
                    ThoiGianBatDau as start_date,
                    ThoiGianKetThuc as end_date,
                    HanDongHocPhi as payment_deadline,
                    TrangThaiHocKy as status
                FROM HOCKYNAMHOC 
                WHERE MaHocKy = $1
            `;
            params = [semesterId];
        } else {
            query = `
                SELECT 
                    MaHocKy as semester_id,
                    TenHocKy as semester_name,
                    ThoiGianBatDau as start_date,
                    ThoiGianKetThuc as end_date,
                    HanDongHocPhi as payment_deadline,
                    TrangThaiHocKy as status
                FROM HOCKYNAMHOC 
                WHERE TrangThaiHocKy = 'active' 
                ORDER BY ThoiGianBatDau DESC 
                LIMIT 1
            `;
        }

        return await DatabaseService.queryOne(query, params);
    }

    /**
     * Get financial configuration summary
     */
    async getConfigSummary(): Promise<{
        priorityObjectsCount: number;
        courseTypesCount: number;
        currentSemester: any;
        paymentDeadline: Date | null;
    }> {
        // Get priority objects count
        const priorityCount = await DatabaseService.queryOne(`
            SELECT COUNT(*) as count FROM DOITUONGUUTIEN
        `);

        // Get course types count
        const courseTypeCount = await DatabaseService.queryOne(`
            SELECT COUNT(*) as count FROM LOAIMON
        `);

        // Get current semester and payment deadline
        const semesterInfo = await this.getSemesterConfig();

        return {
            priorityObjectsCount: parseInt(priorityCount?.count || '0'),
            courseTypesCount: parseInt(courseTypeCount?.count || '0'),
            currentSemester: semesterInfo,
            paymentDeadline: semesterInfo?.payment_deadline || null
        };
    }
    async getCurrentSemesterInfo() {
        const result = await DatabaseService.queryOne(`
            SELECT hk.MaHocKy, hk.HocKyThu, hk.NamHoc
            FROM ACADEMIC_SETTINGS s
            JOIN HOCKYNAMHOC hk ON s.current_semester = hk.MaHocKy
            WHERE s.id = 1
        `);
        console.log("[BACKEND] Current semester from DB:", result);
        return result;
    }
}
