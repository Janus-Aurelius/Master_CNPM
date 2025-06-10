export interface User {
    id: string;
    username: string;
    role: string;
    studentId?: string;
}

export interface UserData {
    id: string;
    username: string;
    role: string;
    studentId?: string;
}

export interface Subject {
    id: string;
    name: string;
    lecturer: string;
    day: string;
    fromTo: string;
    credits: number;
    maxStudents: number;
    currentStudents: number;
}

export interface StudentPageProps {
    user: User | null;
    onLogout: () => void;
}

export interface EnrolledSubjectProps {
    user: User | null;
    handleUnenroll: (subject: Subject) => void;
    onLogout: () => void;
} 