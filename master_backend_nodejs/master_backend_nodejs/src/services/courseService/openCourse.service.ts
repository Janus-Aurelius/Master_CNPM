import { IOfferedCourse } from '../../models/academic_related/openCourse';
import { Database } from '../../config/database';
import { DatabaseError } from '../../utils/errors/database.error';

export class OpenCourseService {
    static async getAllCourses(): Promise<IOfferedCourse[]> {
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
                    lm.SoTienMotTC as pricePerCredit,
                    CASE 
                        WHEN dm.SoSVDaDangKy < dm.SiSoToiDa THEN true 
                        ELSE false 
                    END as isAvailable
                FROM DANHSACHMONHOCMO dm
                JOIN MONHOC mh ON dm.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                ORDER BY dm.MaHocKy, dm.MaMonHoc
            `;
            return await Database.query(query);
        } catch (error) {
            throw new DatabaseError('Error fetching open courses');
        }
    }    static async getCourseById(semesterId: string, courseId: string): Promise<IOfferedCourse | null> {
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
                    lm.SoTienMotTC as pricePerCredit,
                    CASE 
                        WHEN dm.SoSVDaDangKy < dm.SiSoToiDa THEN true 
                        ELSE false 
                    END as isAvailable
                FROM DANHSACHMONHOCMO dm
                JOIN MONHOC mh ON dm.MaMonHoc = mh.MaMonHoc
                JOIN LOAIMON lm ON mh.MaLoaiMon = lm.MaLoaiMon
                WHERE dm.MaHocKy = $1 AND dm.MaMonHoc = $2
            `;
            const result = await Database.query(query, [semesterId, courseId]);            return result[0] || null;
        } catch (error) {
            throw new DatabaseError('Error fetching open course by ID');
        }
    }

    static async createCourse(courseData: IOfferedCourse): Promise<IOfferedCourse> {
        try {
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
    }    private static mapToIOfferedCourse(data: any): IOfferedCourse {
        return {
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
            isAvailable: data.isAvailable || data.is_available,
            registrationStartDate: data.registrationStartDate || data.registration_start_date,
            registrationEndDate: data.registrationEndDate || data.registration_end_date
        };
    }static async updateCourse(id: number, courseData: Partial<IOfferedCourse>): Promise<IOfferedCourse> {
        try {
            // First get the current course to update only the fields that exist in the schema
            const currentCourse = await this.getCourseById(courseData.semesterId || '', courseData.courseId || '');
            if (!currentCourse) {
                throw new Error('Course not found');
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
                courseData.semesterId || currentCourse.semesterId,
                courseData.courseId || currentCourse.courseId,
                courseData.minStudents,
                courseData.maxStudents,
                courseData.currentStudents,
                courseData.dayOfWeek,
                courseData.startPeriod,
                courseData.endPeriod
            ]);

            if (!result[0]) {
                throw new Error('Course not found');
            }
            return result[0];
        } catch (error) {
            throw new DatabaseError('Error updating open course');
        }
    }    static async deleteCourse(semesterId: string, courseId: string): Promise<void> {
        try {            const query = 'DELETE FROM DANHSACHMONHOCMO WHERE MaHocKy = $1 AND MaMonHoc = $2';
            await Database.query(query, [semesterId, courseId]);
        } catch (error) {
            throw new DatabaseError('Error deleting open course');
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
                    lm.SoTienMotTC as pricePerCredit,
                    CASE 
                        WHEN dm.SoSVDaDangKy < dm.SiSoToiDa THEN true 
                        ELSE false 
                    END as isAvailable
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