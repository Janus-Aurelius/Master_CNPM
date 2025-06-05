export interface Subject {
    id: number;
    subjectCode: string;        // Mã môn học
    name: string;               // Tên môn học
    credits: number;            // Số tín chỉ
    description?: string;       // Mô tả môn học
    prerequisiteSubjects?: string[]; // Các môn học tiên quyết
    type: 'Required' | 'Elective'; // Loại môn học (bắt buộc/tự chọn)
    department: string;         // Khoa phụ trách
    createdAt: Date;
    updatedAt: Date;
    lecturer: string;           // Giảng viên
    schedule: {
        day: string;           // Ngày học
        session: string;       // Ca học
        fromTo: string;        // Thời gian
        room: string;          // Phòng học
    };
}