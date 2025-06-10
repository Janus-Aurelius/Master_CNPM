// src/models/course.ts
export interface CourseSchedule {
    day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    session: string;
    fromTo: string; // Format: "HH:mm-HH:mm"
    room: string;
}

export interface PrerequisiteSubject {
    subjectId: string;
    minimumGrade: number; // 0-10
}

export default interface ICourse {
    // Schema fields (mapped to Vietnamese database fields)
    subjectId: string;         // maMonHoc
    subjectName: string;       // tenMonHoc
    subjectTypeId: string;     // maLoaiMon
    totalHours: number;        // soTiet

    // Additional UI fields
    type?: string;
    department?: string;
    lecturer?: string;
    schedule?: CourseSchedule;
    prerequisite_subjects?: PrerequisiteSubject[];
    description?: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}
