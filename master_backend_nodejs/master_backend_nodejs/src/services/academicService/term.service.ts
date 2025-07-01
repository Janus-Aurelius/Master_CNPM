import ISemester, { ISemesterCreate, ISemesterUpdate } from '../../models/academic_related/semester';
import { db } from '../../config/database';

export const semesterService = {
    getAllSemesters: async (): Promise<ISemester[]> => {
        try {
            const result = await db.query(`
                SELECT 
                    MaHocKy as semesterId,
                    HocKyThu as termNumber,
                    ThoiGianBatDau as startDate,
                    ThoiGianKetThuc as endDate,
                    TrangThaiHocKy as status,
                    NamHoc as academicYear,
                    ThoiHanDongHP as feeDeadline
                FROM HOCKYNAMHOC
                ORDER BY NamHoc DESC, HocKyThu DESC            `);
            
            console.log('Raw semester query result:', result.rows); // Debug log
            return result.rows.map(row => {
                console.log('Processing semester row:', row); // Debug log
                return {
                    semesterId: row.semesterid,
                    termNumber: row.termnumber,
                    startDate: row.startdate,
                    endDate: row.enddate,
                    status: row.status,
                    academicYear: row.academicyear,
                    feeDeadline: row.feedeadline
                };
            });
        } catch (error) {
            console.error('Error fetching semesters:', error);
            throw new Error('Failed to fetch semesters');
        }
    },

    getSemesterById: async (id: string): Promise<ISemester | null> => {
        try {
            const result = await db.query(`
                SELECT 
                    MaHocKy as semesterId,
                    HocKyThu as termNumber,
                    ThoiGianBatDau as startDate,
                    ThoiGianKetThuc as endDate,
                    TrangThaiHocKy as status,
                    NamHoc as academicYear,
                    ThoiHanDongHP as feeDeadline
                FROM HOCKYNAMHOC
                WHERE MaHocKy = $1
            `, [id]);
            
            if (result.rows.length === 0) return null;
            
            const row = result.rows[0];
            return {
                semesterId: row.semesterid,
                termNumber: row.termnumber,
                startDate: row.startdate,
                endDate: row.enddate,
                status: row.status,
                academicYear: row.academicyear,
                feeDeadline: row.feedeadline
            };
        } catch (error) {
            console.error('Error fetching semester by ID:', error);
            throw new Error('Failed to fetch semester');
        }
    },    createSemester: async (semester: ISemesterCreate): Promise<ISemester> => {
        try {
            // Kiểm tra trùng năm học + học kỳ
            const dupCheck = await db.query(
                `SELECT 1 FROM HOCKYNAMHOC WHERE NamHoc = $1 AND HocKyThu = $2`,
                [semester.academicYear, semester.termNumber]
            );
            if (dupCheck.rows.length > 0) {
                throw new Error('Đã tồn tại một kỳ học này rồi');
            }
            // Auto set status to "Đóng" for new semesters
            const semesterData = {
                ...semester,
                status: 'Đóng'
            };
            
            const result = await db.query(
                `INSERT INTO HOCKYNAMHOC (MaHocKy, HocKyThu, ThoiGianBatDau, ThoiGianKetThuc, TrangThaiHocKy, NamHoc, ThoiHanDongHP) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [semesterData.semesterId, semesterData.termNumber, semesterData.startDate, semesterData.endDate, semesterData.status, semesterData.academicYear, semesterData.feeDeadline]
            );
            
            const row = result.rows[0];
            return {
                semesterId: row.mahocky,
                termNumber: row.hockyth,
                startDate: row.thoigianbatdau,
                endDate: row.thoigianketthuc,
                status: row.trangthanhocky,
                academicYear: row.namhoc,
                feeDeadline: row.thoihandonghp
            };
        } catch (error) {
            console.error('Error in createSemester:', error);
            throw new Error('Failed to create semester');
        }
    },    updateSemester: async (id: string, semester: ISemesterUpdate): Promise<ISemester> => {
        const client = await db.connect();
        
        try {
            // Lấy thông tin hiện tại nếu thiếu academicYear hoặc termNumber
            let academicYear: number | undefined = undefined;
            let termNumber: number | undefined = undefined;
            if ("academicYear" in semester && "termNumber" in semester) {
                academicYear = (semester as any).academicYear;
                termNumber = (semester as any).termNumber;
            } else {
                const current = await client.query(
                    `SELECT NamHoc, HocKyThu FROM HOCKYNAMHOC WHERE MaHocKy = $1`,
                    [id]
                );
                if (current.rows.length > 0) {
                    academicYear = current.rows[0].namhoc;
                    termNumber = current.rows[0].hockythu;
                }
            }
            // Kiểm tra trùng năm học + học kỳ (loại trừ chính bản ghi đang sửa)
            if (academicYear !== undefined && termNumber !== undefined) {
                const dupCheck = await client.query(
                    `SELECT 1 FROM HOCKYNAMHOC WHERE NamHoc = $1 AND HocKyThu = $2 AND MaHocKy != $3`,
                    [academicYear, termNumber, id]
                );
                if (dupCheck.rows.length > 0) {
                    throw new Error('Đã tồn tại một kỳ học này rồi');
                }
            }
            
            await client.query('BEGIN');
            
            // Nếu đang thay đổi trạng thái thành "Đang diễn ra", kiểm tra constraint
            if (semester.status === 'Đang diễn ra') {
                // Lấy thông tin học kỳ hiện tại từ ACADEMIC_SETTINGS
                const currentSemesterSetting = await client.query(`
                    SELECT current_semester FROM ACADEMIC_SETTINGS WHERE id = 1
                `);
                
                if (currentSemesterSetting.rows.length === 0) {
                    throw new Error('Không tìm thấy cấu hình học kỳ hiện tại');
                }
                
                const currentSemesterId = currentSemesterSetting.rows[0].current_semester;
                
                // Lấy thông tin học kỳ hiện tại
                const currentSemesterInfo = await client.query(`
                    SELECT MaHocKy, NamHoc, HocKyThu
                    FROM HOCKYNAMHOC
                    WHERE MaHocKy = $1
                `, [currentSemesterId]);
                
                if (currentSemesterInfo.rows.length === 0) {
                    throw new Error('Không tìm thấy học kỳ hiện tại');
                }
                
                const currentSemester = currentSemesterInfo.rows[0];
                
                // Lấy thông tin học kỳ đang thao tác
                const targetSemesterInfo = await client.query(`
                    SELECT MaHocKy, NamHoc, HocKyThu
                    FROM HOCKYNAMHOC
                    WHERE MaHocKy = $1
                `, [id]);
                
                if (targetSemesterInfo.rows.length === 0) {
                    throw new Error('Không tìm thấy học kỳ đang thao tác');
                }
                
                const targetSemester = targetSemesterInfo.rows[0];
                
                console.log('🔍 Debug constraint check:');
                console.log('  - Target Semester ID:', id);
                console.log('  - Current Semester ID:', currentSemesterId);
                console.log('  - Current Semester Year:', currentSemester.namhoc, 'Term:', currentSemester.hockythu);
                console.log('  - Target Semester Year:', targetSemester.namhoc, 'Term:', targetSemester.hockythu);
                
                // Kiểm tra xem học kỳ đang thao tác có phải sau học kỳ hiện tại không
                const isAfterCurrent = (targetSemester.namhoc >= currentSemester.namhoc) || 
                                     (targetSemester.namhoc === currentSemester.namhoc && targetSemester.hockythu >= currentSemester.hockythu);
                
                console.log('  - Is After Current Semester:', isAfterCurrent);
                
                if (!isAfterCurrent) {
                    console.log('❌ Constraint violated: Semester is not after current semester');
                    throw new Error('Chỉ được phép set trạng thái "Đang diễn ra" cho các học kỳ sau học kỳ hiện tại');
                }

                console.log('✅ Constraint passed: Semester is after current semester, will auto-close current semester');
            }
            
            // If changing status to "Đang diễn ra", automatically close current semester and open new one
            if (semester.status === 'Đang diễn ra') {
                console.log(`🔄 Setting semester ${id} as current (Đang diễn ra)`);
                
                // First, change all "Đang diễn ra" semesters to "Đóng"
                const closeResult = await client.query(
                    `UPDATE HOCKYNAMHOC SET TrangThaiHocKy = 'Đóng' 
                     WHERE TrangThaiHocKy = 'Đang diễn ra' AND MaHocKy != $1`,
                    [id]
                );
                console.log(`📝 Closed ${closeResult.rowCount} other active semesters`);
                
                // Update ACADEMIC_SETTINGS to reflect new current semester
                const systemResult = await client.query(
                    `UPDATE ACADEMIC_SETTINGS SET current_semester = $1 WHERE id = 1`,
                    [id]
                );
                console.log(`⚙️ Updated ACADEMIC_SETTINGS: ${systemResult.rowCount} rows affected`);
            }
            
            // Prevent changing from "Đang diễn ra" to other status
            const currentResult = await client.query(
                `SELECT TrangThaiHocKy FROM HOCKYNAMHOC WHERE MaHocKy = $1`,
                [id]
            );
            
            if (currentResult.rows.length > 0 && 
                currentResult.rows[0].trangthanhocky === 'Đang diễn ra' && 
                semester.status !== 'Đang diễn ra') {
                throw new Error('Không thể thay đổi trạng thái của học kỳ đang diễn ra');
            }
            
            // Build UPDATE query dynamically based on provided fields
            const updateFields: string[] = [];
            const values: any[] = [id];
            let paramIndex = 2;

            if (semester.startDate !== undefined) {
                updateFields.push(`ThoiGianBatDau = $${paramIndex}`);
                values.push(semester.startDate);
                paramIndex++;
            }

            if (semester.endDate !== undefined) {
                updateFields.push(`ThoiGianKetThuc = $${paramIndex}`);
                values.push(semester.endDate);
                paramIndex++;
            }

            if (semester.status !== undefined) {
                updateFields.push(`TrangThaiHocKy = $${paramIndex}`);
                values.push(semester.status);
                paramIndex++;
            }

            if (semester.feeDeadline !== undefined) {
                updateFields.push(`ThoiHanDongHP = $${paramIndex}`);
                values.push(semester.feeDeadline);
                paramIndex++;
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            // Execute the dynamic update
            const result = await client.query(
                `UPDATE HOCKYNAMHOC SET ${updateFields.join(', ')} WHERE MaHocKy = $1 RETURNING *`,
                values
            );
            
            if (result.rows.length === 0) {
                throw new Error('Semester not found');
            }
            
            await client.query('COMMIT');
            
            const row = result.rows[0];
            return {
                semesterId: row.mahocky,
                termNumber: row.hockyth,
                startDate: row.thoigianbatdau,
                endDate: row.thoigianketthuc,
                status: row.trangthanhocky,
                academicYear: row.namhoc,
                feeDeadline: row.thoihandonghp
            };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error in updateSemester:', error);
            throw error;
        } finally {
            client.release();
        }    },

    deleteSemester: async (id: string): Promise<void> => {
        try {
            // Xóa dữ liệu học phí theo học kỳ trước khi xóa học kỳ
            await db.query('DELETE FROM HOCPHI_THEOHK WHERE MaHocKy = $1', [id]);
            
            // Check if there are any PHIEUDANGKY for this semester
            const registrationCheck = await db.query(
                `SELECT COUNT(*) as count FROM PHIEUDANGKY WHERE MaHocKy = $1`,
                [id]
            );
            
            if (registrationCheck.rows[0].count > 0) {
                throw new Error('Không thể xóa học kỳ đã có phiếu đăng ký');
            }
            
            // Delete CASCADE: Remove all related records first
            
            // 1. Check and delete DANHSACHMONHOCMO records (courses opened in this semester)
            const courseCheck = await db.query(
                `SELECT COUNT(*) as count FROM DANHSACHMONHOCMO WHERE MaHocKy = $1`,
                [id]
            );
            
            if (courseCheck.rows[0].count > 0) {
                await db.query('DELETE FROM DANHSACHMONHOCMO WHERE MaHocKy = $1', [id]);
                console.log(`Deleted ${courseCheck.rows[0].count} courses from DANHSACHMONHOCMO for semester ${id}`);
            }
            
            // 2. Check and delete CHUONGTRINHHOC records (curriculum)
            const curriculumCheck = await db.query(
                `SELECT COUNT(*) as count FROM CHUONGTRINHHOC WHERE MaHocKy = $1`,
                [id]
            );
            
            if (curriculumCheck.rows[0].count > 0) {
                await db.query('DELETE FROM CHUONGTRINHHOC WHERE MaHocKy = $1', [id]);
                console.log(`Deleted ${curriculumCheck.rows[0].count} curriculum records from CHUONGTRINHHOC for semester ${id}`);
            }
            
            // 3. Finally delete the semester
            const result = await db.query('DELETE FROM HOCKYNAMHOC WHERE MaHocKy = $1', [id]);
            if (result.rowCount === 0) {
                throw new Error('Semester not found');
            }
            
            console.log(`Successfully deleted semester ${id} and all related records`);
        } catch (error) {
            console.error('Error in deleteSemester:', error);
            
            // Xử lý các lỗi cụ thể
            if (error instanceof Error) {
                if (error.message === 'Không thể xóa học kỳ đã có phiếu đăng ký' || 
                    error.message === 'Semester not found') {
                    throw error;
                }
                
                // Xử lý lỗi foreign key constraint
                if (error.message.includes('academic_settings_current_semester_fkey') || 
                    error.message.includes('is still referenced from table "academic_settings"')) {
                    throw new Error('Không thể xóa học kỳ này do đang là học kỳ hiện tại');
                }
            }
            
            // Nếu là lỗi PostgreSQL với code 23503 (foreign key violation)
            if (error && typeof error === 'object' && 'code' in error && error.code === '23503') {
                const pgError = error as any;
                if (pgError.detail && pgError.detail.includes('academic_settings')) {
                    throw new Error('Không thể xóa học kỳ này do đang là học kỳ hiện tại');
                }
            }
            
            throw new Error('Failed to delete semester');
        }
    },

    searchSemesters: async (searchTerm: string): Promise<ISemester[]> => {
        try {
            const result = await db.query(`
                SELECT 
                    MaHocKy as semesterId,
                    HocKyThu as termNumber,
                    ThoiGianBatDau as startDate,
                    ThoiGianKetThuc as endDate,
                    TrangThaiHocKy as status,
                    NamHoc as academicYear,
                    ThoiHanDongHP as feeDeadline
                FROM HOCKYNAMHOC
                WHERE MaHocKy ILIKE $1 OR TrangThaiHocKy ILIKE $1 OR CAST(NamHoc AS TEXT) ILIKE $1
                ORDER BY NamHoc DESC, HocKyThu DESC
            `, [`%${searchTerm}%`]);
            
            return result.rows.map(row => ({
                semesterId: row.semesterid,
                termNumber: row.termnumber,
                startDate: row.startdate,
                endDate: row.enddate,
                status: row.status,
                academicYear: row.academicyear,
                feeDeadline: row.feedeadline
            }));
        } catch (error) {
            console.error('Error searching semesters:', error);
            throw new Error('Failed to search semesters');
        }
    },

    getSemestersByYear: async (academicYear: number): Promise<ISemester[]> => {
        try {
            const result = await db.query(`
                SELECT 
                    MaHocKy as semesterId,
                    HocKyThu as termNumber,
                    ThoiGianBatDau as startDate,
                    ThoiGianKetThuc as endDate,
                    TrangThaiHocKy as status,
                    NamHoc as academicYear,
                    ThoiHanDongHP as feeDeadline
                FROM HOCKYNAMHOC
                WHERE NamHoc = $1
                ORDER BY HocKyThu DESC
            `, [academicYear]);
            
            return result.rows.map(row => ({
                semesterId: row.semesterid,
                termNumber: row.termnumber,
                startDate: row.startdate,
                endDate: row.enddate,
                status: row.status,
                academicYear: row.academicyear,
                feeDeadline: row.feedeadline
            }));
        } catch (error) {
            console.error('Error fetching semesters by year:', error);
            throw new Error('Failed to fetch semesters by year');
        }
    },

    updateSemesterStatus: async (semesterId: string, newStatus: string): Promise<ISemester | null> => {
        try {
            const { DatabaseService } = await import('../database/databaseService');

            // Lấy thông tin học kỳ đang thao tác
            const semesterInfo = await db.query(`
                SELECT MaHocKy, NamHoc, HocKyThu, TrangThaiHocKy, ThoiGianBatDau
                FROM HOCKYNAMHOC
                WHERE MaHocKy = $1
            `, [semesterId]);

            if (semesterInfo.rows.length === 0) {
                throw new Error('Không tìm thấy học kỳ');
            }

            const semester = semesterInfo.rows[0];
            const currentDate = new Date();
            const semesterStartDate = new Date(semester.thoigianbatdau);

            console.log('🔍 Debug constraint check:');
            console.log('  - Semester ID:', semesterId);
            console.log('  - New Status:', newStatus);
            console.log('  - Current Date:', currentDate.toISOString());
            console.log('  - Semester Start Date:', semesterStartDate.toISOString());
            console.log('  - Is Future Semester:', semesterStartDate > currentDate);

            // Nếu đang set trạng thái "Đang diễn ra"
            if (newStatus === 'Đang diễn ra') {
                // Lấy thông tin học kỳ hiện tại từ ACADEMIC_SETTINGS
                const currentSemesterSetting = await db.query(`
                    SELECT current_semester FROM ACADEMIC_SETTINGS WHERE id = 1
                `);
                
                if (currentSemesterSetting.rows.length === 0) {
                    throw new Error('Không tìm thấy cấu hình học kỳ hiện tại');
                }
                
                const currentSemesterId = currentSemesterSetting.rows[0].current_semester;
                
                // Lấy thông tin học kỳ hiện tại
                const currentSemesterInfo = await db.query(`
                    SELECT MaHocKy, NamHoc, HocKyThu
                    FROM HOCKYNAMHOC
                    WHERE MaHocKy = $1
                `, [currentSemesterId]);
                
                if (currentSemesterInfo.rows.length === 0) {
                    throw new Error('Không tìm thấy học kỳ hiện tại');
                }
                
                const currentSemester = currentSemesterInfo.rows[0];
                
                console.log('🔍 Debug constraint check:');
                console.log('  - Target Semester ID:', semesterId);
                console.log('  - Current Semester ID:', currentSemesterId);
                console.log('  - Current Semester Year:', currentSemester.namhoc, 'Term:', currentSemester.hockythu);
                console.log('  - Target Semester Year:', semester.namhoc, 'Term:', semester.hockythu);
                
                // Kiểm tra xem học kỳ đang thao tác có phải sau học kỳ hiện tại không
                const isAfterCurrent = (semester.namhoc > currentSemester.namhoc) || 
                                     (semester.namhoc === currentSemester.namhoc && semester.hockythu > currentSemester.hockythu);
                
                console.log('  - Is After Current Semester:', isAfterCurrent);
                
                if (!isAfterCurrent) {
                    console.log('❌ Constraint violated: Semester is not after current semester');
                    throw new Error('Chỉ được phép set trạng thái "Đang diễn ra" cho các học kỳ sau học kỳ hiện tại');
                }

                console.log('✅ Constraint passed: Semester is after current semester, will auto-close current semester');
            }

            // Thực hiện logic cũ
            if (newStatus === 'Đang diễn ra') {
                // Use transaction to ensure atomicity
                const queries = [
                    // 1. Set all current "Đang diễn ra" semesters to "Đóng"
                    {
                        sql: "UPDATE HOCKYNAMHOC SET TrangThaiHocKy = 'Đóng' WHERE TrangThaiHocKy = 'Đang diễn ra'",
                        params: []
                    },
                    // 2. Set the new semester to "Đang diễn ra"
                    {
                        sql: "UPDATE HOCKYNAMHOC SET TrangThaiHocKy = $1 WHERE MaHocKy = $2",
                        params: [newStatus, semesterId]
                    }
                ];
                await DatabaseService.transaction(queries);
                // 3. Update ACADEMIC_SETTINGS to point to new current semester
                await DatabaseService.updateCurrentSemester(semesterId);
            } else {
                // Simple status update for other statuses
                await db.query(
                    "UPDATE HOCKYNAMHOC SET TrangThaiHocKy = $1 WHERE MaHocKy = $2",
                    [newStatus, semesterId]
                );
            }
            // Return updated semester
            return await semesterService.getSemesterById(semesterId);
        } catch (error) {
            console.error('Error updating semester status:', error);
            const errMsg = error instanceof Error ? error.message : 'Failed to update semester status';
            throw new Error(errMsg);
        }
    }
};
