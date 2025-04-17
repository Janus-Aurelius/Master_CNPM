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
    schedule: {
        day: string;
        startTime: string;
        endTime: string;
        room: string;
    }[];
    instructor: string;
} 