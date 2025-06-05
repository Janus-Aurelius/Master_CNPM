import { SubjectBusiness } from '../business/academic/subject.business';
import { Subject } from '../models/academic_related/subject';
import { describe, expect, test, jest, beforeEach } from '@jest/globals';

// Define mock data first
const initialMockSubjects: Subject[] = [
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

// Create a mutable copy for tests
let mockSubjects: Subject[] = [...initialMockSubjects];

// Define mock query function type
type MockQueryFunction = (query: string, params?: any[]) => Promise<any[]>;

// Mock Database
jest.mock('../config/database', () => {
    const mockQuery: MockQueryFunction = (query: string, params?: any[]) => {
        // Get all subjects
        if (query.includes('SELECT * FROM subjects ORDER BY subject_code')) {
            return Promise.resolve([...mockSubjects]);
        }
        
        // Get subject by ID
        if (query.includes('SELECT * FROM subjects WHERE id =')) {
            const id = params?.[0];
            const subject = mockSubjects.find(s => s.id === id);
            return Promise.resolve(subject ? [subject] : []);
        }
        
        // Create subject
        if (query.includes('INSERT INTO subjects')) {
            const newSubject: Subject = {
                id: mockSubjects.length + 1,
                subjectCode: params?.[0],
                name: params?.[1],
                credits: params?.[2],
                description: params?.[3],
                prerequisiteSubjects: JSON.parse(params?.[4] || '[]'),
                type: params?.[5],
                department: params?.[6],
                lecturer: params?.[7],
                schedule: JSON.parse(params?.[8] || '{}'),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockSubjects.push(newSubject);
            return Promise.resolve([newSubject]);
        }
        
        // Update subject
        if (query.includes('UPDATE subjects')) {
            const id = params?.[7];
            const index = mockSubjects.findIndex(s => s.id === id);
            if (index !== -1) {
                // Only update the fields that are provided
                mockSubjects[index] = {
                    ...mockSubjects[index],
                    subjectCode: params?.[0] || mockSubjects[index].subjectCode,
                    name: params?.[1] || mockSubjects[index].name,
                    credits: params?.[2] || mockSubjects[index].credits,
                    description: params?.[3] || mockSubjects[index].description,
                    prerequisiteSubjects: params?.[4] ? JSON.parse(params[4]) : mockSubjects[index].prerequisiteSubjects,
                    type: params?.[5] || mockSubjects[index].type,
                    department: params?.[6] || mockSubjects[index].department,
                    updatedAt: new Date()
                };
                return Promise.resolve([mockSubjects[index]]);
            }
            return Promise.resolve([]);
        }
        
        // Delete subject
        if (query.includes('DELETE FROM subjects WHERE id =')) {
            const id = params?.[0];
            const index = mockSubjects.findIndex(s => s.id === id);
            if (index !== -1) {
                mockSubjects.splice(index, 1);
            }
            return Promise.resolve([]);
        }
        
        // Check schedule conflicts
        if (query.includes("SELECT * FROM subjects") && 
            query.includes("WHERE schedule->>'day' = $1") && 
            query.includes("AND schedule->>'session' = $2") && 
            query.includes("AND schedule->>'room' = $3")) {
            const day = params?.[0];
            const session = params?.[1];
            const room = params?.[2];
            
            const matchingSubjects = mockSubjects.filter(s => 
                s.schedule.day === day && 
                s.schedule.session === session && 
                s.schedule.room === room
            );
            
            return Promise.resolve(matchingSubjects);
        }
        
        return Promise.resolve([]);
    };

    return {
        Database: {
            query: jest.fn(mockQuery)
        }
    };
});

describe('Subject Management Tests', () => {
    beforeEach(() => {
        // Reset mock data before each test
        mockSubjects = [...initialMockSubjects];
    });

    test('Get all subjects', async () => {
        const subjects = await SubjectBusiness.getAllSubjects();
        expect(subjects).toHaveLength(2);
        expect(subjects[0].subjectCode).toBe('SE101');
    });

    test('Get subject by ID', async () => {
        const subject = await SubjectBusiness.getSubjectById(1);
        expect(subject).toBeDefined();
        expect(subject?.name).toBe('Introduction to Software Engineering');
    });

    test('Create new subject', async () => {
        const newSubject = {
            subjectCode: 'SE103',
            name: 'Database Systems',
            credits: 3,
            description: 'Introduction to databases',
            prerequisiteSubjects: ['SE101'],
            type: 'Required' as const,
            department: 'Computer Science',
            lecturer: 'Dr. Brown',
            schedule: {
                day: 'Wednesday',
                session: 'Morning',
                fromTo: '8:00-11:00',
                room: 'C303'
            }
        };

        const created = await SubjectBusiness.createSubject(newSubject);
        expect(created.subjectCode).toBe('SE103');
        expect(mockSubjects).toHaveLength(3);
    });

    test('Update subject', async () => {
        const updateData = {
            name: 'Updated SE101',
            credits: 4
        };

        const updated = await SubjectBusiness.updateSubject(1, updateData);
        expect(updated.name).toBe('Updated SE101');
        expect(updated.credits).toBe(4);
    });

    test('Delete subject', async () => {
        await SubjectBusiness.deleteSubject(1);
        expect(mockSubjects).toHaveLength(1);
        expect(mockSubjects[0].id).toBe(2);
    });

    test('Validate subject data', () => {
        const invalidData = {
            subjectCode: '',
            name: 'Test Subject'
        };

        const errors = SubjectBusiness.validateSubjectData(invalidData);
        expect(errors).toContain('Subject code is required');
    });

    test('Check schedule conflicts', async () => {
        const conflictingSubject = {
            schedule: {
                day: 'Monday',
                session: 'Morning',
                fromTo: '8:00-11:00',
                room: 'A101'
            }
        };

        const conflicts = await SubjectBusiness.checkScheduleConflicts(conflictingSubject);
        expect(conflicts).toHaveLength(1);
        expect(conflicts[0]).toContain('Schedule conflict');
    });
}); 