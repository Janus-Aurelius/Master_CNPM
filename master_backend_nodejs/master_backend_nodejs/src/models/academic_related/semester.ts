import Course from './course';

export default interface ISemester {
    // Schema fields (mapped to Vietnamese database fields)
    semesterId: string;         // maHocKy
    termNumber: number;         // hocKyThu
    startDate: Date;            // thoiGianBatDau
    endDate: Date;              // thoiGianKetThuc
    status: string;             // trangThaiHocKy
    academicYear: number;       // namHoc
    tuitionDueDate: Date;       // thoiHanDongHP

    // Additional UI fields
    courses?: Course[];         // For UI display
}