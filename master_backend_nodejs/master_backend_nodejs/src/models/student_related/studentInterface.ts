// Consolidated Student Interface - Main interface file for all student-related types
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