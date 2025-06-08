export interface ISubject {
    id: string;
    name: string;
    lecturer: string;
    credits: number;
    maxStudents: number;
    currentStudents: number;
    prerequisites: string[];
    description: string;
    schedule: {
        day: string;
        session: string;
        room: string;
    }[];
    semester?: string;
} 