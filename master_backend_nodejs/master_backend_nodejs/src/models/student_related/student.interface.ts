export interface IStudent {
    id: string;
    studentId: string;
    name: string;
    email: string;
    major: string;
    class: string;
    status: 'active' | 'inactive';
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