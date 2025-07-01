// src/types/index.ts
//store sample data types
export interface UserData {
    role: string;
    name?: string;
    id?: string;
}

export interface User extends UserData {
    [key: string]: unknown;
}

export interface Subject {
    id: string;
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
}

export interface StudentPageProps {
    user: User | null;
    onLogout: () => void;
}

export interface EnrolledSubjectProps {
    handleUnenroll: (subject: Subject) => void;
    user: User | null;
    onLogout: () => void;
}