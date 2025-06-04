// src/models/course.ts
export default interface Course {
    id: number;
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
    credits: number;
    location: string;
}
