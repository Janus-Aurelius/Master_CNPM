import Course from "./academic_related/course";

export default interface StudentRequest {
    id: number;
    studentId: string;
    course: Course;
    requestDate: string;
    status: "pending" | "approved" | "rejected";
    reason?: string;
    actionDate?: string;
    actionBy?: string;
}