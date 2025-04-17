interface Subject {
    id: string;
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
}

export class SubjectRegistrationService {
    public async getAvailableSubjects(semester: string): Promise<Subject[]> {
        try {
            // TODO: Get available subjects from database based on semester
            return [
                {
                    id: "IT001",
                    name: "Nhập môn lập trình",
                    lecturer: "TS. Nguyễn Văn A",
                    day: "Thứ 2",
                    session: "1",
                    fromTo: "Tiết 1-4"
                }
            ];
        } catch (error) {
            throw new Error("Error fetching available subjects");
        }
    }

    public async searchSubjects(query: string, semester: string): Promise<Subject[]> {
        try {
            // TODO: Search subjects in database based on query and semester
            const subjects = await this.getAvailableSubjects(semester);
            return subjects.filter(subject => 
                subject.id.toLowerCase().includes(query.toLowerCase()) ||
                subject.name.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            throw new Error("Error searching subjects");
        }
    }

    public async registerSubject(studentId: string, courseId: string): Promise<void> {
        try {
            // TODO: 
            // 1. Check if student can register for this course (prerequisites, conflicts, etc.)
            // 2. Check if course has available slots
            // 3. Create enrollment record in database
            
            // For now, just simulate success
            return;
        } catch (error) {
            throw new Error("Error registering subject");
        }
    }
} 