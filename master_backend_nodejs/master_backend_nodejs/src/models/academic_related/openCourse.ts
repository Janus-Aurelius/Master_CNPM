export interface IOfferedSubject {
    // Schema fields (mapped to Vietnamese database fields)
    semesterId: string;         // maHocKy
    subjectId: string;          // maMonHoc

    // Additional UI fields
    subjectName?: string;
    subjectTypeId?: string;     // maLoaiMon
    totalHours?: number;        // soTiet
    maxStudents?: number;
    currentStudents?: number;
    lecturer?: string;
    schedule?: {
        day: string;
        session: string;
        room: string;
    };
    status?: 'open' | 'closed' | 'cancelled';
    startDate?: string;
    endDate?: string;
    registrationStartDate?: string;
    registrationEndDate?: string;
    prerequisites?: string[];
    description?: string;
    createdAt?: string;
    updatedAt?: string;
} 