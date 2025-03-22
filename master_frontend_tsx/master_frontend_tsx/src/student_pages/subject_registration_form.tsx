// File: src/student_pages/subject_registration_form.tsx
import { useState } from 'react';
import { ThemeLayout } from '../styles/theme_layout';
import Typography from '@mui/joy/Typography';
import SubjectsGrid from '../components/layout/datagrid/subjects_grid';
import SearchBox from '../components/searchbox';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { Subject } from "../types";

const sampleSubjects: Subject[] = [
    { name: 'Mathematics', lecturer: 'Dr. Smith', day: 'Monday', session: '1', fromTo: '08:00-10:00' },
    { name: 'Physics', lecturer: 'Prof. Johnson', day: 'Tuesday', session: '2', fromTo: '10:00-12:00' },
    { name: 'Chemistry', lecturer: 'Dr. Williams', day: 'Wednesday', session: '3', fromTo: '12:00-14:00' },
    { name: 'Biology', lecturer: 'Dr. Jones', day: 'Thursday', session: '4', fromTo: '14:00-16:00' },
];

interface SubjectRegistrationFormProps {
    onLogout: () => void;
}

export const SubjectRegistrationForm = ({onLogout}:SubjectRegistrationFormProps) => {
    const [open, setOpen] = useState(false);

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleEnroll = (subject: Subject) => {
        console.log('Enrolling in', subject);
        setOpen(true);
    };

    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <Typography
                component="h1"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '25px',
                    mb: 4,
                    color: '#4880FF',
                }}
            >
                Đăng ký học phần
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SearchBox placeholder="Search..." />
                <SubjectsGrid subjects={sampleSubjects} handleEvent={handleEnroll} />
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Enrolled successfully!
                </MuiAlert>
            </Snackbar>
        </ThemeLayout>
    );
};