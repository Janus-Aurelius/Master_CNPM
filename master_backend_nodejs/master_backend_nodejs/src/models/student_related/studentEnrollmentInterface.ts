export type EnrollmentStatus = 
    | 'registered'
    | 'waiting'
    | 'dropped';

export interface IEnrollment {
    id: string;
    studentId: string;
    courseId: string;
    courseName: string;
    semester: string;
    status: EnrollmentStatus;
    credits: number;
    midtermGrade?: number;
    finalGrade?: number;
}

export interface IEnrolledSubject {
    enrollment: IEnrollment;
    subjectDetails: {
        id: string;
        name: string;
        lecturer: string;
        credits: number;
        maxStudents: number;
        currentStudents: number;
        schedule: {
            day: string;
            session: string;
            room: string;
        }[];
    };
    grade: {
        midterm?: number;
        final?: number;
        total?: number;
        letter?: string;
    } | null;
    attendanceRate: number;
}