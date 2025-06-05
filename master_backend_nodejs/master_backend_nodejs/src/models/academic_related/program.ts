import Course from "./course";

export interface Program {
    id: string;
    name_year: string;  // Example: "Chương trình đào tạo K2020"
    department: string; // Example: "Công nghệ phần mềm"
    major: string;     // Example: "Kỹ thuật phần mềm"
    courseList: string[]; // List of course IDs
    totalCredit: number;
    status: 'active' | 'inactive';
}