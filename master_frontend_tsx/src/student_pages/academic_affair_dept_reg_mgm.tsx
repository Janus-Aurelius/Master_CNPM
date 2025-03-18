// File: src/student_pages/academic_affair_dept_reg_mgm.tsx
import { useState } from 'react';
import { ThemeLayout } from '../styles/theme_layout';
import { Box, Button, Typography, TextField } from '@mui/material';
import SearchBox from "../components/searchbox";

interface Subject {
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
}

interface AcademicAffairRequestGridProps {
    subjects?: Subject[];
    onEnroll: (subject: Subject, reason: string) => void;
    onDelete: (subject: Subject, reason: string) => void;
    sx?: Record<string, unknown>;
    [key: string]: unknown;
}
interface AcademicAffairDeptReqMgmProps {
    onLogout: () => void;
}

const AcademicAffairRequestGrid = ({
                                       subjects = [],
                                       onEnroll,
                                       onDelete,
                                       sx,
                                       ...otherProps
                                   }: AcademicAffairRequestGridProps) => {
    const [reasons, setReasons] = useState<Record<number, string>>({});

    const handleInputChange = (index: number, value: string) => {
        setReasons((prev) => ({ ...prev, [index]: value }));
    };

    const handleAction = (action: 'enroll' | 'delete', subject: Subject, index: number) => {
        const reason = reasons[index] || '';
        if (action === 'enroll') {
            onEnroll(subject, reason);
        } else if (action === 'delete') {
            onDelete(subject, reason);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                ...sx,
            }}
            {...otherProps}
        >
            {subjects && subjects.length > 0 ? (
                subjects.map((subject, index) => (
                    <Box
                        key={index}
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 1,
                            boxShadow: 1,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, 1fr)',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="body1">{subject.name}</Typography>
                            <Typography variant="body1">{subject.lecturer}</Typography>
                            <Typography variant="body1">{subject.day}</Typography>
                            <Typography variant="body1">{subject.session}</Typography>
                            <Typography variant="body1">{subject.fromTo}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter reason"
                                value={reasons[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            />
                            <Button variant="contained" onClick={() => handleAction('enroll', subject, index)}>
                                Enroll
                            </Button>
                            <Button variant="outlined" onClick={() => handleAction('delete', subject, index)}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                ))
            ) : (
                <Typography sx={{ p: 2, textAlign: 'center', color: 'darkgray' }}>
                    No subjects available
                </Typography>
            )}
        </Box>
    );
};

export const AcademicAffairDeptReqMgm = ({onLogout}: AcademicAffairDeptReqMgmProps) => {
    const sampleSubjects: Subject[] = [
        { name: 'Mathematics', lecturer: 'Dr. Smith', day: 'Monday', session: '1', fromTo: '08:00-10:00' },
        { name: 'Physics', lecturer: 'Prof. Johnson', day: 'Tuesday', session: '2', fromTo: '10:00-12:00' },
        { name: 'Chemistry', lecturer: 'Dr. Williams', day: 'Wednesday', session: '3', fromTo: '12:00-14:00' },
        { name: 'Biology', lecturer: 'Dr. Jones', day: 'Thursday', session: '4', fromTo: '14:00-16:00' },
    ];

    const handleEnrollRequest = (subject: Subject, reason: string) => {
        console.log('Enroll request for', subject, 'with reason:', reason);
    };

    const handleDeleteRequest = (subject: Subject, reason: string) => {
        console.log('Delete request for', subject, 'with reason:', reason);
    };

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
                Quản lý cứu xét
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SearchBox />
                <AcademicAffairRequestGrid
                    subjects={sampleSubjects}
                    onEnroll={handleEnrollRequest}
                    onDelete={handleDeleteRequest}
                />
            </Box>
        </ThemeLayout>
    );
};