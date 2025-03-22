// src/services/courseService.ts
import { Course } from "../models/academic_related/course";

const courses: Course[] = [
    { id: 1, name: "Programming 101", credits: 3 },
    { id: 2, name: "Data Structures", credits: 4 }
];

export const getCourses = async (): Promise<Course[]> => {
    // Simulated data fetch; replace with real DB logic later.
    return courses;
};

export const addCourse = async (course: Course): Promise<Course> => {
    courses.push(course);
    return course;
};
