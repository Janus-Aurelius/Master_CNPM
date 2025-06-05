// src/services/courseService.ts
import Course from "../models/academic_related/course";

const courses: Course[] = [
    { id: 1, name: "Programming 101", credits: 3 , day: "Monday", session: "1", fromTo:"26/2/2024-6/6/2024", lecturer:"John Doe", location: "Room 101"},
    { id: 2, name: "Data Structures", credits: 4, day: "Tuesday", session: "2", fromTo:"26/2/2024-6/6/2024", lecturer:"Jane Smith", location: "Room 102"},
];

export const getCourses = async (): Promise<Course[]> => {
    // Simulated data fetch; replace with real DB logic later.
    return courses;
};

export const addCourse = async (course: Course): Promise<Course> => {
    courses.push(course);
    return course;
};
