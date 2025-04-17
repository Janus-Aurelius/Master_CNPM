import { SubjectRegistrationService } from '../../services/studentServices';

class RegistrationManager {
    private registrationService: SubjectRegistrationService;

    constructor() {
        this.registrationService = new SubjectRegistrationService();
    }

    public async getAvailableSubjects(semester: string) {
        try {
            // Validate semester
            if (!semester) {
                throw new Error('Semester is required');
            }

            // Validate semester format
            const semesterPattern = /^HK[1-3] \d{4}-\d{4}$/;
            if (!semesterPattern.test(semester)) {
                throw new Error('Invalid semester format');
            }

            // Get available subjects
            const subjects = await this.registrationService.getAvailableSubjects(semester);

            // Additional business logic
            // For example: filtering based on student's curriculum, prerequisites, etc.

            return subjects;
        } catch (error) {
            throw error;
        }
    }

    public async searchSubjects(query: string, semester: string) {
        try {
            // Validate inputs
            if (!query || !semester) {
                throw new Error('Search query and semester are required');
            }

            // Clean and validate search query
            const cleanQuery = query.trim();
            if (cleanQuery.length < 2) {
                throw new Error('Search query must be at least 2 characters');
            }

            // Search subjects
            const subjects = await this.registrationService.searchSubjects(cleanQuery, semester);

            return subjects;
        } catch (error) {
            throw error;
        }
    }

    public async registerSubject(studentId: string, courseId: string) {
        try {
            // Validate inputs
            if (!studentId || !courseId) {
                throw new Error('Student ID and Course ID are required');
            }

            // Additional business validations can be added here:
            // 1. Check if student has met prerequisites
            // 2. Check for schedule conflicts
            // 3. Check credit limits
            // 4. Check registration period
            // 5. Check if student has already registered for this course

            // Register for the subject
            await this.registrationService.registerSubject(studentId, courseId);

        } catch (error) {
            throw error;
        }
    }
}

export default new RegistrationManager(); 