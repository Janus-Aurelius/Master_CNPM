import { semesterApi, type Semester } from '../api_clients/academic/semesterApi';

// Cache for current semester to avoid multiple API calls
let currentSemesterCache: { semester: Semester; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get the current semester from the backend
 * Uses caching to reduce API calls
 */
export const getCurrentSemester = async (): Promise<Semester> => {
    const now = Date.now();
    
    // Return cached result if it's still valid
    if (currentSemesterCache && (now - currentSemesterCache.timestamp) < CACHE_DURATION) {
        return currentSemesterCache.semester;
    }
    
    try {
        const semester = await semesterApi.getCurrentSemester();
        
        // Update cache
        currentSemesterCache = {
            semester,
            timestamp: now
        };
        
        return semester;
    } catch (error) {
        console.error('Failed to fetch current semester:', error);
        // If we have cached data, return it even if expired
        if (currentSemesterCache) {
            return currentSemesterCache.semester;
        }
        throw error;
    }
};

/**
 * Get the current semester ID as a string
 */
export const getCurrentSemesterId = async (): Promise<string> => {
    const semester = await getCurrentSemester();
    return semester.semesterId;
};

/**
 * Clear the current semester cache
 * Use this when you know the semester has changed
 */
export const clearCurrentSemesterCache = (): void => {
    currentSemesterCache = null;
};
