// File: src/student_pages/enrolled_subject.tsx
import { ThemeLayout } from "../styles/theme_layout";
import  SubjectsGrid  from "../components/layout/datagrid/subjects_grid";
import Typography from "@mui/material/Typography";
import { Subject, EnrolledSubjectProps } from "../types";

const sampleSubjects: Subject[] = [
    { name: 'Mathematics', lecturer: 'Dr. Smith', day: 'Monday', session: '1', fromTo: '08:00-10:00' },
    { name: 'Physics', lecturer: 'Prof. Johnson', day: 'Tuesday', session: '2', fromTo: '10:00-12:00' },
    { name: 'Chemistry', lecturer: 'Dr. Williams', day: 'Wednesday', session: '3', fromTo: '12:00-14:00' },
    { name: 'Biology', lecturer: 'Dr. Jones', day: 'Thursday', session: '4', fromTo: '14:00-16:00' },
];

export const EnrolledSubject = ({ handleUnenroll, onLogout, ...otherProps }: EnrolledSubjectProps) => {
    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <Typography
                variant="h3"
                component="h1"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '25px',
                    mb: 4,
                    color: '#4880FF',
                }}
            >
                Danh sách môn học đã đăng ký
            </Typography>
            <SubjectsGrid
                subjects={sampleSubjects}
                handleEvent={handleUnenroll}
                enrollText="Unenroll"
                {...otherProps}
            />
        </ThemeLayout>
    );
};