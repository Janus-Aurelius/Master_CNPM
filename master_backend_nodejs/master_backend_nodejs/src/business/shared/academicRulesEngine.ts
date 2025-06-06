// src/business/shared/academicRulesEngine.ts
import { SubjectBusiness } from '../academicBusiness/subject.business';
import { ProgramBusiness } from '../academicBusiness/program.business';
import { OpenCourseBusiness } from '../academicBusiness/openCourse.business';

export interface PrerequisiteCheck {
    isMet: boolean;
    missingPrerequisites: string[];
    details: string[];
}

export interface AcademicEligibility {
    canEnroll: boolean;
    creditLimitStatus: {
        currentCredits: number;
        maxCredits: number;
        remainingCredits: number;
    };
    academicStanding: 'GOOD' | 'PROBATION' | 'SUSPENSION';
    gpaRequirement: {
        currentGPA: number;
        minRequiredGPA: number;
        meetsRequirement: boolean;
    };
}

export interface ScheduleConflict {
    hasConflict: boolean;
    conflictingCourses: Array<{
        courseId: string;
        courseName: string;
        timeSlot: string;
        room: string;
    }>;
}

export class AcademicRulesEngine {
    
    /**
     * Check if student has completed all prerequisites for a course
     */    static async checkPrerequisites(
        studentId: string, 
        courseId: string
    ): Promise<PrerequisiteCheck> {
        try {
            // Get course prerequisites - need to convert courseId to number or find by subjectCode
            const subjects = await SubjectBusiness.getAllSubjects();
            const courseInfo = subjects.find(subject => subject.subjectCode === courseId);
            
            if (!courseInfo) {
                return {
                    isMet: false,
                    missingPrerequisites: [],
                    details: [`Course ${courseId} not found`]
                };
            }

            // Get student's completed courses
            const completedCourses = await this.getStudentCompletedCourses(studentId);
            
            // Check each prerequisite
            const prerequisites = courseInfo.prerequisiteSubjects || [];
            const missingPrerequisites: string[] = [];
            const details: string[] = [];

            for (const prereqCode of prerequisites) {
                const completed = completedCourses.find(course => 
                    course.courseId === prereqCode && 
                    course.grade && 
                    this.isPassingGrade(course.grade)
                );

                if (!completed) {
                    missingPrerequisites.push(prereqCode);
                    details.push(`Missing prerequisite: ${prereqCode}`);
                }
            }

            return {
                isMet: missingPrerequisites.length === 0,
                missingPrerequisites,
                details: details.length > 0 ? details : ['All prerequisites met']
            };

        } catch (error) {
            console.error('Error checking prerequisites:', error);
            return {
                isMet: false,
                missingPrerequisites: [],
                details: ['Error checking prerequisites']
            };
        }
    }

    /**
     * Check student's academic eligibility for course registration
     */
    static async checkAcademicEligibility(
        studentId: string,
        additionalCredits: number = 0
    ): Promise<AcademicEligibility> {
        try {
            // Get student's current academic status
            const currentCredits = await this.getCurrentSemesterCredits(studentId);
            const studentGPA = await this.getStudentGPA(studentId);
            const academicStanding = await this.getAcademicStanding(studentId);

            // University rules
            const maxCreditsPerSemester = 24; // Standard max credits
            const minGPAForRegistration = 2.0;

            // Calculate remaining credits
            const totalCreditsAfterRegistration = currentCredits + additionalCredits;
            const remainingCredits = maxCreditsPerSemester - currentCredits;

            return {
                canEnroll: totalCreditsAfterRegistration <= maxCreditsPerSemester && 
                          studentGPA >= minGPAForRegistration &&
                          academicStanding !== 'SUSPENSION',
                creditLimitStatus: {
                    currentCredits,
                    maxCredits: maxCreditsPerSemester,
                    remainingCredits: Math.max(0, remainingCredits)
                },
                academicStanding,
                gpaRequirement: {
                    currentGPA: studentGPA,
                    minRequiredGPA: minGPAForRegistration,
                    meetsRequirement: studentGPA >= minGPAForRegistration
                }
            };

        } catch (error) {
            console.error('Error checking academic eligibility:', error);
            return {
                canEnroll: false,
                creditLimitStatus: {
                    currentCredits: 0,
                    maxCredits: 24,
                    remainingCredits: 0
                },
                academicStanding: 'SUSPENSION',
                gpaRequirement: {
                    currentGPA: 0,
                    minRequiredGPA: 2.0,
                    meetsRequirement: false
                }
            };
        }
    }

    /**
     * Check for schedule conflicts with existing enrolled courses
     */
    static async checkScheduleConflicts(
        studentId: string,
        courseId: string,
        semester: string
    ): Promise<ScheduleConflict> {
        try {
            // Get student's current enrolled courses for the semester
            const enrolledCourses = await this.getStudentEnrolledCourses(studentId, semester);
            
            // Get the new course schedule
            const newCourseSchedule = await this.getCourseSchedule(courseId, semester);
            
            if (!newCourseSchedule) {
                return {
                    hasConflict: false,
                    conflictingCourses: []
                };
            }

            // Check for time conflicts
            const conflictingCourses = [];
            
            for (const enrolledCourse of enrolledCourses) {
                const enrolledSchedule = await this.getCourseSchedule(enrolledCourse.courseId, semester);
                
                if (enrolledSchedule && this.hasTimeConflict(newCourseSchedule, enrolledSchedule)) {
                    conflictingCourses.push({
                        courseId: enrolledCourse.courseId,
                        courseName: enrolledCourse.courseName,
                        timeSlot: enrolledSchedule.timeSlot,
                        room: enrolledSchedule.room
                    });
                }
            }

            return {
                hasConflict: conflictingCourses.length > 0,
                conflictingCourses
            };

        } catch (error) {
            console.error('Error checking schedule conflicts:', error);
            return {
                hasConflict: true,
                conflictingCourses: []
            };
        }
    }

    // Helper methods
    private static async getStudentCompletedCourses(studentId: string) {
        // TODO: Implement actual database query
        // For now, return mock data
        return [
            { courseId: 'CS101', courseName: 'Intro to CS', grade: 'A' },
            { courseId: 'MATH101', courseName: 'Calculus I', grade: 'B+' }
        ];
    }

    private static async getCurrentSemesterCredits(studentId: string): Promise<number> {
        // TODO: Implement actual database query
        return 15; // Mock: student currently has 15 credits
    }

    private static async getStudentGPA(studentId: string): Promise<number> {
        // TODO: Implement actual database query
        return 3.2; // Mock GPA
    }

    private static async getAcademicStanding(studentId: string): Promise<'GOOD' | 'PROBATION' | 'SUSPENSION'> {
        // TODO: Implement actual database query based on GPA and other factors
        return 'GOOD';
    }

    private static async getStudentEnrolledCourses(studentId: string, semester: string) {
        // TODO: Implement actual database query
        return [
            { courseId: 'CS201', courseName: 'Data Structures' },
            { courseId: 'MATH201', courseName: 'Calculus II' }
        ];
    }

    private static async getCourseSchedule(courseId: string, semester: string) {
        // TODO: Implement actual database query
        return {
            timeSlot: 'MON 08:00-10:00',
            room: 'A101',
            dayOfWeek: 'MONDAY',
            startTime: '08:00',
            endTime: '10:00'
        };
    }

    private static hasTimeConflict(schedule1: any, schedule2: any): boolean {
        // TODO: Implement time conflict logic
        // For now, simple string comparison
        return schedule1.timeSlot === schedule2.timeSlot;
    }

    private static isPassingGrade(grade: string): boolean {
        const passingGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D'];
        return passingGrades.includes(grade);
    }
}
