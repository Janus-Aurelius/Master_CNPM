export interface ISubject {
    // Schema fields (mapped to Vietnamese database fields)
    subjectId: string;         // maMonHoc
    subjectName: string;       // tenMonHoc
    subjectTypeId: string;     // maLoaiMon
    totalHours: number;        // soTiet

    // Additional UI fields
    description?: string;
    prerequisiteSubjects?: string[];
    type?: 'Required' | 'Elective';
    department?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lecturer?: string;
    schedule?: {
        day: string;
        session: string;
        fromTo: string;
        room: string;
    };
}

export interface ISubjectType {
    // Schema fields (mapped to Vietnamese database fields)
    subjectTypeId: string;     // maLoaiMon
    subjectTypeName: string;   // tenLoaiMon
    hoursPerCredit: number;    // soTietMotTC
    costPerCredit: number;     // soTienMotTC
}