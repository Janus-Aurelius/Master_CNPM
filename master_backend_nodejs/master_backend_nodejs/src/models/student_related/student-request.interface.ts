export type RequestType = 
    | 'course_registration'
    | 'course_withdrawal'
    | 'grade_review';

export type RequestStatus = 
    | 'pending'
    | 'approved'
    | 'rejected';

export interface IStudentRequest {
    id: string;
    studentId: string;
    type: RequestType;
    status: RequestStatus;
    content: string;
    createdAt: Date;
}

export interface ICourseRegistrationRequest extends IStudentRequest {
    semester: string;
    courseId: string;
}

export interface IGradeReviewRequest extends IStudentRequest {
    courseId: string;
    currentGrade: number;
    expectedGrade: number;
    explanation: string;
} 