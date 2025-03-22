import Course from './course';

export default interface Semester {
    id: number;
    term: string;
    startDate: string;
    endDate: string;
    courses: Course[];
    status: "active" | "inactive";

}