// Consolidated Student Interface - Main interface file for all student-related types
export interface IStudent {
    // Schema fields (mapped to Vietnamese database fields)
    studentId: string;         // maSoSinhVien
    fullName: string;          // hoTen
    dateOfBirth: Date;         // ngaySinh
    gender: string;            // gioiTinh
    hometown: string;          // queQuan (sẽ chứa tên tỉnh)
    districtId: string;        // maHuyen (sẽ chứa tên huyện)
    priorityObjectId: string;  // maDoiTuongUT (sẽ chứa tên đối tượng)
    majorId: string;           // maNganh (sẽ chứa tên ngành)

    // Additional UI fields
    email?: string;
    phone?: string;
    status?: 'active' | 'inactive' | 'đang học' | 'thôi học';
    faculty?: string;          // Tên khoa
}

// Legacy simple student interface for backward compatibility
export interface IStudentSimple {
    id: string;
    studentId: string;
    name: string;
    email: string;
    major: string;
    class: string;
    status: 'active' | 'inactive';
}

export interface IStudentSchedule {
    student: IStudent;
    semester: string;
    subjects: ISubject[];
}

export interface ISubject {
    id: string;
    name: string;
    credit: number;
    schedule: IScheduleItem[];
    lecturer: string;
}

export interface IScheduleItem {
    day: string;
    time: string;
    room: string;
}

export interface IStudentDashboard {
    student: IStudent;
    schedule: {
        day: string;
        startTime: string;
        endTime: string;
        subject: string;
        room: string;
    }[];
    currentSemester: string;
    totalCredits: number;
    gpa: number;
}