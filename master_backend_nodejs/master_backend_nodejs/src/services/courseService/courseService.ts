// src/services/courseService.ts
import Course from "../../models/academic_related/course";

const courses: Course[] = [
    { id: 1, name: "Programming 101", credits: 3 , day: "Monday", session: "1", fromTo:"26/2/2024-6/6/2024", lecturer:"John Doe", location: "Room 101"},
    { id: 2, name: "Data Structures", credits: 4, day: "Tuesday", session: "2", fromTo:"26/2/2024-6/6/2024", lecturer:"Jane Smith", location: "Room 102"},
];

export const getCourses = async (): Promise<Course[]> => {
    // Simulated data fetch; replace with real DB logic later.
    return courses;
};

export const getCourseById = async (id: number): Promise<Course | null> => {
    return courses.find(course => course.id === id) || null;
};

export const addCourse = async (course: Course): Promise<Course> => {
    courses.push(course);
    return course;
};

export const updateCourse = async (id: number, courseData: Partial<Course>): Promise<Course | null> => {
    const index = courses.findIndex(course => course.id === id);
    if (index === -1) return null;
    
    courses[index] = { ...courses[index], ...courseData };
    return courses[index];
};

export const deleteCourse = async (id: number): Promise<boolean> => {
    const index = courses.findIndex(course => course.id === id);
    if (index === -1) return false;
    
    courses.splice(index, 1);
    return true;
};

export const searchCourses = async (query: string): Promise<Course[]> => {
    return courses.filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.lecturer.toLowerCase().includes(query.toLowerCase())
    );
};
