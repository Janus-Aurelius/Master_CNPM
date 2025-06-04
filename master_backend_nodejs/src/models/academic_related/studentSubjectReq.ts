export enum RequestType {
    ADD = "Thêm học phần",
    DELETE = "Xóa học phần"
}

export enum RequestStatus {
    PENDING = "Chờ xử lý",
    APPROVED = "Đã duyệt",
    REJECTED = "Từ chối"
}

export interface StudentSubjectReq {
    id: number;
    studentId: string;
    studentName: string;
    type: RequestType;
    subjectCode: string;
    subjectName: string;
    requestDate: string;
    reason: string;
    status: RequestStatus;
} 