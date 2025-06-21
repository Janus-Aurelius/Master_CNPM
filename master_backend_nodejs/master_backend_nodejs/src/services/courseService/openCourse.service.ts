import { IOfferedCourse } from '../../models/academic_related/openCourse';
import { Database } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database.error';

export class OpenCourseService {    static async getAllCourses(): Promise<IOfferedCourse[]> {
        try {            const query = `
                SELECT 
                    dm.MaHocKy as "semesterId",
                    dm.MaMonHoc as "courseId",
                    dm.SiSoToiThieu as "minStudents",
                    dm.SiSoToiDa as "maxStudents",
                    dm.SoSVDaDangKy as "currentStudents",
                    dm.Thu as "dayOfWeek",
                    dm.TietBatDau as "startPeriod",
                    dm.TietKetThuc as "endPeriod",
                    mh.TenMonHoc as "courseName",
                    mh.MaLoaiMon as "courseTypeId",
                    lm.TenLoaiMon as "courseTypeName",
                    mh.SoTiet as "totalHours",
                    lm.SoTietMotTC as "hoursPerCredit",
                    lm.SoTienMotTC as "pricePerCredit",                    hk.HocKyThu as "semesterNumber",
                    hk.NamHoc as "academicYear",                    CASE 
                        WHEN dm.SoSVDaDangKy >= dm.SiSoToiDa THEN 'Đầy'
                        ELSE 'Mở'
                    END as "status"
                FROM DANHSACHMONHOCMO dm
                JOIN MONHOC mh ON dm.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                JOIN HOCKYNAMHOC hk ON dm.MaHocKy = hk.MaHocKy
                ORDER BY hk.NamHoc, hk.HocKyThu, lm.TenLoaiMon, mh.TenMonHoc
            `;
            const result = await Database.query(query);
            console.log(`Found ${result.length} open courses`);
            return result;
        } catch (error) {
            console.error('Error in getAllCourses:', error);
            throw new DatabaseError('Error fetching open courses');
        }
    }static async getCourseById(semesterId: string, courseId: string): Promise<IOfferedCourse | null> {        try {            const query = `
                SELECT 
                    dm.MaHocKy as "semesterId",
                    dm.MaMonHoc as "courseId",
                    dm.SiSoToiThieu as "minStudents",
                    dm.SiSoToiDa as "maxStudents",
                    dm.SoSVDaDangKy as "currentStudents",
                    dm.Thu as "dayOfWeek",
                    dm.TietBatDau as "startPeriod",
                    dm.TietKetThuc as "endPeriod",
                    mh.TenMonHoc as "courseName",
                    mh.MaLoaiMon as "courseTypeId",
                    lm.TenLoaiMon as "courseTypeName",
                    mh.SoTiet as "totalHours",
                    lm.SoTietMotTC as "hoursPerCredit",
                    lm.SoTienMotTC as "pricePerCredit",                    hk.HocKyThu as "semesterNumber",
                    hk.NamHoc as "academicYear",                    CASE 
                        WHEN dm.SoSVDaDangKy >= dm.SiSoToiDa THEN 'Đầy'
                        ELSE 'Mở'
                    END as "status"
                FROM DANHSACHMONHOCMO dm
                JOIN MONHOC mh ON dm.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                JOIN HOCKYNAMHOC hk ON dm.MaHocKy = hk.MaHocKy
                WHERE dm.MaHocKy = $1 AND dm.MaMonHoc = $2
            `;
            const result = await Database.query(query, [semesterId, courseId]);            return result[0] || null;
        } catch (error) {
            console.error('Error in getCourseById:', error);
            throw new DatabaseError('Error fetching open course by ID');
        }
    }    static async createCourse(courseData: IOfferedCourse): Promise<IOfferedCourse> {
        try {
            // Validation business rules
            if (!courseData.semesterId || !courseData.courseId) {
                throw new Error('Mã học kỳ và mã môn học là bắt buộc');
            }

            if (courseData.minStudents < 1) {
                throw new Error('Số sinh viên tối thiểu phải lớn hơn 0');
            }

            if (courseData.maxStudents < courseData.minStudents) {
                throw new Error('Số sinh viên tối đa phải lớn hơn hoặc bằng số sinh viên tối thiểu');
            }

            if (courseData.dayOfWeek < 1 || courseData.dayOfWeek > 7) {
                throw new Error('Thứ phải từ 1 đến 7');
            }            if (courseData.startPeriod < 1 || courseData.startPeriod > 10 || 
                courseData.endPeriod < 1 || courseData.endPeriod > 10) {
                throw new Error('Tiết học phải từ 1 đến 10');
            }

            if (courseData.startPeriod >= courseData.endPeriod) {
                throw new Error('Tiết bắt đầu phải nhỏ hơn tiết kết thúc');
            }

            const query = `
                INSERT INTO DANHSACHMONHOCMO (
                    MaHocKy,
                    MaMonHoc,
                    SiSoToiThieu,
                    SiSoToiDa,
                    SoSVDaDangKy,
                    Thu,
                    TietBatDau,
                    TietKetThuc
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8
                ) RETURNING *
            `;

            const result = await Database.query(query, [
                courseData.semesterId,
                courseData.courseId,
                courseData.minStudents,
                courseData.maxStudents,
                courseData.currentStudents || 0,
                courseData.dayOfWeek,
                courseData.startPeriod,
                courseData.endPeriod
            ]);

            return result[0];
        } catch (error) {
            throw new DatabaseError('Error creating open course');
        }
    }    private static mapToIOfferedCourse(data: any): IOfferedCourse {        return {
            semesterId: data.semesterId || data.semester_id,
            courseId: data.courseId || data.course_id,
            minStudents: data.minStudents || data.min_students,
            maxStudents: data.maxStudents || data.max_students,
            currentStudents: data.currentStudents || data.current_students,
            dayOfWeek: data.dayOfWeek || data.day_of_week,
            startPeriod: data.startPeriod || data.start_period,
            endPeriod: data.endPeriod || data.end_period,
            courseName: data.courseName || data.course_name,
            courseTypeId: data.courseTypeId || data.course_type_id,
            courseTypeName: data.courseTypeName || data.course_type_name,
            totalHours: data.totalHours || data.total_hours,
            hoursPerCredit: data.hoursPerCredit || data.hours_per_credit,
            pricePerCredit: data.pricePerCredit || data.price_per_credit,
            semesterNumber: data.semesterNumber || data.semester_number,            academicYear: data.academicYear || data.academic_year,            status: data.status,
            registrationStartDate: data.registrationStartDate || data.registration_start_date,
            registrationEndDate: data.registrationEndDate || data.registration_end_date
        };
    }    static async updateCourse(semesterId: string, courseId: string, courseData: Partial<IOfferedCourse>): Promise<IOfferedCourse> {
        try {
            // First get the current course and check if students are registered
            const currentCourse = await this.getCourseById(semesterId, courseId);
            if (!currentCourse) {
                throw new Error('Môn học không tồn tại');
            }

            // Check if there are registered students for edit restrictions
            const registrationCheckQuery = `
                SELECT COUNT(*) as count 
                FROM CT_PHIEUDANGKY 
                WHERE MaHocKy = $1 AND MaMonHoc = $2
            `;
            const registrationResult = await Database.query(registrationCheckQuery, [semesterId, courseId]);
            const hasRegistrations = parseInt(registrationResult[0].count) > 0;

            console.log(`Course has ${registrationResult[0].count} registrations`);

            // Business rules for editing
            if (hasRegistrations) {
                // If there are registrations, only allow editing minStudents and maxStudents
                const allowedFields = ['minStudents', 'maxStudents'];
                const attemptedFields = Object.keys(courseData);
                const unauthorizedFields = attemptedFields.filter(field => !allowedFields.includes(field));
                
                if (unauthorizedFields.length > 0) {
                    throw new Error('Không thể sửa các trường khác ngoài số sinh viên tối thiểu/tối đa khi đã có sinh viên đăng ký');
                }

                // Validate student number constraints
                if (courseData.minStudents !== undefined) {
                    if (courseData.minStudents < currentCourse.currentStudents) {
                        throw new Error(`Số sinh viên tối thiểu không được nhỏ hơn số sinh viên đã đăng ký (${currentCourse.currentStudents})`);
                    }
                }

                if (courseData.maxStudents !== undefined) {
                    const newMinStudents = courseData.minStudents ?? currentCourse.minStudents;
                    if (courseData.maxStudents < newMinStudents) {
                        throw new Error('Số sinh viên tối đa phải lớn hơn hoặc bằng số sinh viên tối thiểu');
                    }
                    if (courseData.maxStudents < currentCourse.currentStudents) {
                        throw new Error(`Số sinh viên tối đa không được nhỏ hơn số sinh viên đã đăng ký (${currentCourse.currentStudents})`);
                    }
                }
            } else {
                // If no registrations, validate all constraints normally
                if (courseData.minStudents !== undefined && courseData.minStudents < 1) {
                    throw new Error('Số sinh viên tối thiểu phải lớn hơn 0');
                }

                if (courseData.maxStudents !== undefined && courseData.minStudents !== undefined) {
                    if (courseData.maxStudents < courseData.minStudents) {
                        throw new Error('Số sinh viên tối đa phải lớn hơn hoặc bằng số sinh viên tối thiểu');
                    }
                } else if (courseData.maxStudents !== undefined) {
                    const currentMinStudents = currentCourse.minStudents;
                    if (courseData.maxStudents < currentMinStudents) {
                        throw new Error('Số sinh viên tối đa phải lớn hơn hoặc bằng số sinh viên tối thiểu');
                    }
                } else if (courseData.minStudents !== undefined) {
                    const currentMaxStudents = currentCourse.maxStudents;
                    if (courseData.minStudents > currentMaxStudents) {
                        throw new Error('Số sinh viên tối thiểu phải nhỏ hơn hoặc bằng số sinh viên tối đa');
                    }
                }

                if (courseData.dayOfWeek !== undefined && (courseData.dayOfWeek < 1 || courseData.dayOfWeek > 7)) {
                    throw new Error('Thứ phải từ 1 đến 7');
                }                if (courseData.startPeriod !== undefined && 
                    (courseData.startPeriod < 1 || courseData.startPeriod > 10)) {
                    throw new Error('Tiết bắt đầu phải từ 1 đến 10');
                }

                if (courseData.endPeriod !== undefined && 
                    (courseData.endPeriod < 1 || courseData.endPeriod > 10)) {
                    throw new Error('Tiết kết thúc phải từ 1 đến 10');
                }

                if (courseData.startPeriod !== undefined && courseData.endPeriod !== undefined &&
                    courseData.startPeriod >= courseData.endPeriod) {
                    throw new Error('Tiết bắt đầu phải nhỏ hơn tiết kết thúc');
                }
            }

            const query = `
                UPDATE DANHSACHMONHOCMO 
                SET SiSoToiThieu = COALESCE($3, SiSoToiThieu),
                    SiSoToiDa = COALESCE($4, SiSoToiDa),
                    SoSVDaDangKy = COALESCE($5, SoSVDaDangKy),
                    Thu = COALESCE($6, Thu),
                    TietBatDau = COALESCE($7, TietBatDau),
                    TietKetThuc = COALESCE($8, TietKetThuc)
                WHERE MaHocKy = $1 AND MaMonHoc = $2
                RETURNING *
            `;

            const result = await Database.query(query, [
                semesterId,
                courseId,
                courseData.minStudents,
                courseData.maxStudents,
                courseData.currentStudents,
                courseData.dayOfWeek,
                courseData.startPeriod,
                courseData.endPeriod
            ]);

            if (!result[0]) {
                throw new Error('Môn học không tồn tại');
            }
            return result[0];
        } catch (error) {
            throw error instanceof Error ? error : new DatabaseError('Error updating open course');
        }
    }    static async deleteCourse(semesterId: string, courseId: string): Promise<void> {
        try {
            // Check if there are registered students
            const registrationCheckQuery = `
                SELECT COUNT(*) as count 
                FROM CT_PHIEUDANGKY 
                WHERE MaHocKy = $1 AND MaMonHoc = $2
            `;
            const registrationResult = await Database.query(registrationCheckQuery, [semesterId, courseId]);
            const hasRegistrations = parseInt(registrationResult[0].count) > 0;

            if (hasRegistrations) {
                throw new Error('Không thể xóa môn học này vì đã có sinh viên đăng ký');
            }            const query = 'DELETE FROM DANHSACHMONHOCMO WHERE MaHocKy = $1 AND MaMonHoc = $2';
            await Database.query(query, [semesterId, courseId]);
        } catch (error) {
            throw error instanceof Error ? error : new DatabaseError('Error deleting open course');
        }
    }

    static async getCoursesBySemester(semester: string, academicYear: string): Promise<IOfferedCourse[]> {
        try {
            const query = `
                SELECT 
                    dm.MaHocKy as semesterId,
                    dm.MaMonHoc as courseId,
                    dm.SiSoToiThieu as minStudents,
                    dm.SiSoToiDa as maxStudents,
                    dm.SoSVDaDangKy as currentStudents,
                    dm.Thu as dayOfWeek,
                    dm.TietBatDau as startPeriod,
                    dm.TietKetThuc as endPeriod,
                    mh.TenMonHoc as courseName,
                    mh.MaLoaiMon as courseTypeId,
                    lm.TenLoaiMon as courseTypeName,
                    mh.SoTiet as totalHours,
                    lm.SoTietMotTC as hoursPerCredit,
                    lm.SoTienMotTC as pricePerCredit,                    CASE 
                        WHEN dm.SoSVDaDangKy >= dm.SiSoToiDa THEN 'Đầy'
                        ELSE 'Mở'
                    END as status
                FROM DANHSACHMONHOCMO dm
                JOIN MONHOC mh ON dm.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                WHERE dm.MaHocKy LIKE $1
                ORDER BY dm.MaHocKy, dm.MaMonHoc
            `;
            return await Database.query(query, [`%${semester}%`]);
        } catch (error) {
            throw new DatabaseError('Error fetching courses by semester');
        }
    }
} 