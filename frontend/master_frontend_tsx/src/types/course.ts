export interface Subject {
    id: number;
    name: string;
    code: string;
    credits: number;
    description?: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
    room: string;
    createdAt?: Date;
    updatedAt?: Date;
} 