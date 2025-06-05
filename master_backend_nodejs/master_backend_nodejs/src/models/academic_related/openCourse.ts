export interface OpenCourse {
    id: number;
    subjectCode: string;
    subjectName: string;
    semester: string;
    academicYear: string;
    maxStudents: number;
    currentStudents: number;
    lecturer: string;
    schedule: string;
    room: string;
    status: 'open' | 'closed' | 'cancelled';
    startDate: string;
    endDate: string;
    registrationStartDate: string;
    registrationEndDate: string;
    prerequisites: string[];
    description: string;
    createdAt: string;
    updatedAt: string;
} 