import { SubjectBusiness } from '../business/academicBusiness/subject.business';
import { ISubject } from '../models/academic_related/subject';
import { describe, expect, test, jest, beforeEach } from '@jest/globals';

// Define mock data first
const initialMockSubjects: ISubject[] = [
    {
        subjectId: 'SE101',
        subjectName: 'Introduction to Software Engineering',
        subjectTypeId: 'LT',
        totalHours: 45
    },
    {
        subjectId: 'SE102',
        subjectName: 'Object-Oriented Programming',
        subjectTypeId: 'TH',
        totalHours: 60
    }
];

// Create a mutable copy for tests
let mockSubjects: ISubject[] = [...initialMockSubjects];

// Define mock query function type
type MockQueryFunction = (query: string, params?: any[]) => Promise<any[]>;

// Mock Database
jest.mock('../config/database', () => {
    const mockQuery: MockQueryFunction = (query: string, params?: any[]) => {
        // Get all subjects
        if (query.includes('SELECT * FROM MONHOC')) {
            return Promise.resolve([...mockSubjects]);
        }
        
        // Get subject by ID
        if (query.includes('WHERE MaMonHoc =')) {
            const id = params?.[0];
            const subject = mockSubjects.find(s => s.subjectId === id);
            return Promise.resolve(subject ? [subject] : []);
        }
        
        // Create subject
        if (query.includes('INSERT INTO MONHOC')) {
            const newSubject: ISubject = {
                subjectId: params?.[0],
                subjectName: params?.[1],
                subjectTypeId: params?.[2],
                totalHours: params?.[3]
            };
            mockSubjects.push(newSubject);
            return Promise.resolve([newSubject]);
        }

        return Promise.resolve([]);
    };

    return {
        query: mockQuery
    };
});

describe('SubjectBusiness', () => {
    beforeEach(() => {
        mockSubjects = [...initialMockSubjects];
    });

    test('getAllSubjects should return all subjects', async () => {
        const subjects = await SubjectBusiness.getAllSubjects();
        expect(subjects).toHaveLength(2);
        expect(subjects[0].subjectId).toBe('SE101');
    });

    test('getSubjectById should return correct subject', async () => {
        const subject = await SubjectBusiness.getSubjectById('SE101');
        expect(subject).toBeDefined();
        expect(subject?.subjectName).toBe('Introduction to Software Engineering');
    });

    test('createSubject should add new subject', async () => {
        const newSubject: Partial<ISubject> = {
            subjectId: 'SE103',
            subjectName: 'Database Systems',
            subjectTypeId: 'LT',
            totalHours: 45
        };

        const created = await SubjectBusiness.createSubject(newSubject);
        expect(created.subjectId).toBe('SE103');
        expect(mockSubjects).toHaveLength(3);
    });

    test('updateSubject should modify existing subject', async () => {
        const updateData: Partial<ISubject> = {
            subjectName: 'Updated Name',
            totalHours: 60
        };

        const updated = await SubjectBusiness.updateSubject('SE101', updateData);
        expect(updated.subjectName).toBe('Updated Name');
        expect(updated.totalHours).toBe(60);
    });

    test('deleteSubject should remove subject', async () => {
        await SubjectBusiness.deleteSubject('SE101');
        expect(mockSubjects).toHaveLength(1);
        expect(mockSubjects[0].subjectId).toBe('SE102');
    });

    test('validateSubjectData should return errors for invalid data', () => {
        const invalidData: Partial<ISubject> = {
            subjectName: 'Test Subject'
        };

        const errors = SubjectBusiness.validateSubjectData(invalidData);
        expect(errors).toContain('Subject ID is required');
        expect(errors).toContain('Subject type is required');
        expect(errors).toContain('Total hours is required');
    });
}); 