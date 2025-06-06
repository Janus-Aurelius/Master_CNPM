export interface IStudent {
    studentId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    enrollmentYear: number;
    major: string;
    faculty: string;
    program: string;
    status: 'active' | 'inactive';
    avatarUrl?: string;
    credits: {
        completed: number;
        current: number;
        required: number;
    };
    gender?: 'male' | 'female' | 'other';
    hometown?: {
        district: string;
        province: string;
        isRemoteArea: boolean;
    };
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

// TODO: Thêm các trường về đối tượng ưu tiên, khoa/ngành cho phòng đào tạo xử lý sau 