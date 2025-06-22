export interface User {
    id?: string;
    name?: string;
    role?: 'student' | 'academic' | 'financial' | 'admin';
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
    credits: number;
    day: string;
    fromTo: string;
    courseType?: string;
    lecturer: string;
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

export interface StudentInfo {
    studentId: string;
    name: string;
    major: string;
    majorName: string;
} 