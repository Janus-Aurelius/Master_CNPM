// src/business/shared/academicRulesEngine.ts
import { SubjectBusiness } from '../academicBusiness/subject.business';
import { ProgramBusiness } from '../academicBusiness/program.business';
import { OpenCourseBusiness } from '../academicBusiness/openCourse.business';
import { DatabaseService } from '../../services/database/databaseService';

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
            // Get course prerequisites - need to convert courseId to number or find by subjectId
            const subjects = await SubjectBusiness.getAllSubjects();
            const courseInfo = subjects.find(subject => subject.subjectId === courseId);
            
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
    }    // Helper methods
    private static async getStudentCompletedCourses(studentId: string) {
        try {
            const completedCourses = await DatabaseService.query(`
                SELECT 
                    e.course_id,
                    e.course_name,
                    e.letter_grade as grade,
                    e.total_grade,
                    oc.subject_code as courseId,
                    s.subject_name as courseName
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e.status = 'completed'
                AND e.total_grade >= 5.0
                ORDER BY e.created_at DESC
            `, [studentId]);

            return completedCourses.map(course => ({
                courseId: course.courseId,
                courseName: course.courseName,
                grade: course.grade || 'N/A'
            }));
        } catch (error) {
            console.error('Error fetching completed courses:', error);
            return [];
        }
    }

    private static async getCurrentSemesterCredits(studentId: string): Promise<number> {
        try {
            // Get current semester from system settings
            const currentSemester = await DatabaseService.queryOne(`
                SELECT setting_value FROM system_settings WHERE setting_key = 'current_semester'
            `);
            
            const semester = currentSemester?.setting_value || '2024-1';

            const result = await DatabaseService.queryOne(`
                SELECT COALESCE(SUM(e.credits), 0) as total_credits
                FROM enrollments e
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e.semester = $2
                AND e.status IN ('registered', 'enrolled')
            `, [studentId, semester]);

            return parseInt(result?.total_credits || '0');
        } catch (error) {
            console.error('Error fetching current semester credits:', error);
            return 0;
        }
    }

    private static async getStudentGPA(studentId: string): Promise<number> {
        try {
            const result = await DatabaseService.queryOne(`
                SELECT 
                    COALESCE(AVG(e.total_grade), 0) as gpa,
                    COUNT(e.id) as completed_courses
                FROM enrollments e
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e.status = 'completed'
                AND e.total_grade IS NOT NULL
                AND e.total_grade >= 0
            `, [studentId]);

            return parseFloat(result?.gpa || '0');
        } catch (error) {
            console.error('Error fetching student GPA:', error);
            return 0;
        }
    }

    private static async getAcademicStanding(studentId: string): Promise<'GOOD' | 'PROBATION' | 'SUSPENSION'> {
        try {
            const gpa = await this.getStudentGPA(studentId);
            
            // Get academic standing rules from database or use defaults
            const standingRules = await DatabaseService.queryOne(`
                SELECT * FROM academic_standing_rules WHERE status = 'active'
            `);

            const probationThreshold = standingRules?.probation_gpa || 2.0;
            const suspensionThreshold = standingRules?.suspension_gpa || 1.0;

            if (gpa < suspensionThreshold) {
                return 'SUSPENSION';
            } else if (gpa < probationThreshold) {
                return 'PROBATION';
            } else {
                return 'GOOD';
            }
        } catch (error) {
            console.error('Error determining academic standing:', error);
            return 'GOOD'; // Default to good standing on error
        }
    }    private static async getStudentEnrolledCourses(studentId: string, semester: string) {
        try {
            const enrolledCourses = await DatabaseService.query(`
                SELECT 
                    e.course_id,
                    e.course_name,
                    oc.subject_code as courseId,
                    s.subject_name as courseName,
                    e.is_enrolled
                FROM enrollments e
                JOIN open_courses oc ON e.course_id = oc.id
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE e.student_id = (SELECT id FROM students WHERE student_id = $1)
                AND e.semester = $2
                AND e.is_enrolled = true
                ORDER BY oc.subject_code
            `, [studentId, semester]);

            return enrolledCourses.map(course => ({
                courseId: course.courseId,
                courseName: course.courseName
            }));
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            return [];
        }
    }

    private static async getCourseSchedule(courseId: string, semester: string) {
        try {
            const schedule = await DatabaseService.queryOne(`
                SELECT 
                    oc.schedule,
                    oc.room,
                    s.subject_name
                FROM open_courses oc
                JOIN subjects s ON oc.subject_code = s.subject_code
                WHERE oc.id = $1 AND oc.semester = $2
            `, [parseInt(courseId), semester]);

            if (!schedule) {
                return null;
            }

            // Parse schedule string (assuming format like "MON 08:00-10:00")
            const scheduleData = schedule.schedule || '';
            const parts = scheduleData.split(' ');
            const dayOfWeek = parts[0] || 'UNKNOWN';
            const timeRange = parts[1] || '00:00-00:00';
            const [startTime, endTime] = timeRange.split('-');

            return {
                timeSlot: scheduleData,
                room: schedule.room,
                dayOfWeek,
                startTime: startTime || '00:00',
                endTime: endTime || '00:00'
            };
        } catch (error) {
            console.error('Error fetching course schedule:', error);
            return null;
        }
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
