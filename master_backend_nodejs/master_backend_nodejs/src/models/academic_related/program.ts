import Course from "./course";

export default interface Program
{
    id:string;
    name_year:string;
    courseList: Course[];
    status: "active" | "inactive";
    department: string;
    major: string;
    totalCredit: number;

}