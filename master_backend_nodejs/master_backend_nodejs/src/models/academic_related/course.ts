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

export default interface Course {
    id: number;
    subjectCode: string;
    subjectName: string;
    credits: number;
    type: string;
    department: string;
    lecturer: string;
    schedule: CourseSchedule;
    prerequisite_subjects: PrerequisiteSubject[];
    description?: string;
    status: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}
