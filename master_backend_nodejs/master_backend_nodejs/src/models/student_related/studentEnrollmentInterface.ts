// Simplified boolean enrollment status as per supervisor's feedback
// Only two states: enrolled (true) or not enrolled (false)
export interface IEnrollment {
    id: string;
    studentId: string;
    courseId: string;
    courseName: string;
    semester: string;
    isEnrolled: boolean; // true = enrolled, false = not enrolled/dropped
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