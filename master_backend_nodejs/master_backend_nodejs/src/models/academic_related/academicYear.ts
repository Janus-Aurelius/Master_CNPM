import Semester from "./semester";
import Program from "./program";

export default interface AcademicYear {
    id: string;
    name_year: string;
    semesterList: Semester[];
    programList: Program[];
    status: "active" | "inactive";
}