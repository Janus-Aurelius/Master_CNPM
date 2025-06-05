export interface IStudent {
    id: string;
    studentId: string;
    name: string;
    email: string;
    major: string;
    class: string;
    status: 'active' | 'inactive';
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    hometown: {
        district: string;
        province: string;
        isRemoteArea: boolean;
    };
}

export interface IStudentSchedule {
    student: IStudent;
    schedule: IScheduleItem[];
    currentSemester: string;
    totalCredits: number;
    gpa: number;
}

export interface IScheduleItem {
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
    room: string;
}

// TODO: Thêm các trường về đối tượng ưu tiên, khoa/ngành cho phòng đào tạo xử lý sau 