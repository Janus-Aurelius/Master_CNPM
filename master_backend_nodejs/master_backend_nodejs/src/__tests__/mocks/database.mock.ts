import { Subject } from '../../models/academic_related/subject';

// Mock data
export const mockSubjects: Subject[] = [
    {
        id: 1,
        subjectCode: 'SE101',
        name: 'Introduction to Software Engineering',
        credits: 3,
        description: 'Basic concepts of software engineering',
        prerequisiteSubjects: [],
        type: 'Required',
        department: 'Computer Science',
        lecturer: 'Dr. Smith',
        schedule: {
            day: 'Monday',
            session: 'Morning',
            fromTo: '8:00-11:00',
            room: 'A101'
        },
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        subjectCode: 'SE102',
        name: 'Object-Oriented Programming',
        credits: 4,
        description: 'Advanced OOP concepts',
        prerequisiteSubjects: ['SE101'],
        type: 'Required',
        department: 'Computer Science',
        lecturer: 'Dr. Johnson',
        schedule: {
            day: 'Tuesday',
            session: 'Afternoon',
            fromTo: '13:00-16:00',
            room: 'B202'
        },
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Mock Database class
export class MockDatabase {
    static subjects = [...mockSubjects];

    static async query(query: string, params?: any[]): Promise<any[]> {
        if (!params) return [];
        
        if (query.includes('SELECT * FROM subjects')) {
            return this.subjects;
        }
        if (query.includes('WHERE id =')) {
            const id = params[0];
            return this.subjects.filter(s => s.id === id);
        }
        if (query.includes('INSERT INTO subjects')) {
            const newSubject = {
                id: this.subjects.length + 1,
                ...params[0],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            this.subjects.push(newSubject);
            return [newSubject];
        }
        if (query.includes('UPDATE subjects')) {
            const id = params[7];
            const index = this.subjects.findIndex(s => s.id === id);
            if (index !== -1) {
                this.subjects[index] = {
                    ...this.subjects[index],
                    ...params[0],
                    updatedAt: new Date()
                };
                return [this.subjects[index]];
            }
            return [];
        }
        if (query.includes('DELETE FROM subjects')) {
            const id = params[0];
            this.subjects = this.subjects.filter(s => s.id !== id);
            return [];
        }
        return [];
    }
} 