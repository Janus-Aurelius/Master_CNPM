import Semester from "./semester";
import { ICurriculum } from "./program";

export default interface AcademicYear {
    id: string;
    name_year: string;
    semesterList: Semester[];
    programList: ICurriculum [];
    status: "active" | "inactive";
}