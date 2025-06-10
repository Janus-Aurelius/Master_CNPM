import Course from "./course";

export interface ICurriculum {
    // Schema fields (mapped to Vietnamese database fields)
    majorId: string;            // maNganh
    subjectId: string;          // maMonHoc
    semesterId: string;         // maHocKy
    note?: string;              // ghiChu

    // Additional UI fields
    name?: string;
    courseList?: Course[];
    status?: "active" | "inactive";
    department?: string;
    major?: string;
    totalCredit?: number;
}