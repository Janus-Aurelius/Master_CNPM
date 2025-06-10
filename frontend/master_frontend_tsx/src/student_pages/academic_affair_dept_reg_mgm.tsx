// File: src/student_pages/academic_affair_dept_reg_mgm.tsx
import { ThemeLayout } from '../styles/theme_layout';
import { Box, Button, Typography, Paper, TextField } from '@mui/material';
import { useState } from 'react';

interface AcademicAffairDeptReqMgmProps {
    onLogout: () => void;
}

export const AcademicAffairDeptReqMgm = ({ onLogout }: AcademicAffairDeptReqMgmProps) => {
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        console.log('Submitted content:', content);
        setContent('');
    };

    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        textAlign: 'left',
                        borderRadius: '1rem',
                        padding: '1.25rem',
                        fontSize: '1.125rem',
                        fontFamily: '"Varela Round", sans-serif',
                        fontWeight: 450,
                        backgroundColor: 'rgb(250, 250, 250)',
                        boxShadow: '0 0.125rem 0.3125rem rgba(0, 0, 0, 0.1)',
                        color: 'rgb(39, 89, 217)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderTopRightRadius: '1rem',
                        borderBottomRightRadius: '1rem',
                        marginTop: '1rem',
                        flexGrow: 1,
                        minHeight: '18.75rem',
                        maxHeight: 'calc(100vh - 9.375rem)',
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                        marginLeft: '0',
                        marginRight: '0.625rem',
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Montserrat, sans-serif',
                            fontStyle: 'normal',
                            color: 'rgba(33, 33, 33, 0.8)',
                            marginBottom: '0.875rem',
                            marginTop: '0',
                            textAlign: 'center',
                            fontSize: '1.875rem',
                        }}
                    >
                        Quản lý cứu xét
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', mt: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                width: '100%',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '0.75rem',
                                boxShadow: '0 0.25rem 0.625rem rgba(0, 0, 0, 0.1)',
                                padding: '1rem',
                                transition: 'all 0.3s ease',
                                minHeight: '31.25rem',
                                maxWidth: '50rem',
                            }}
                        >
                            <TextField
                                variant="standard"
                                fullWidth
                                multiline
                                placeholder="Nhập nội dung..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        fontSize: '1.125rem',
                                        padding: '0',
                                        textAlign: 'left',
                                        wordWrap: 'break-word',
                                    },
                                }}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '0.5rem',
                                backgroundColor: '#3869d9',
                                '&:hover': {
                                    backgroundColor: 'hsl(223, 100.00%, 70.20%)',
                                },
                            }}
                        >
                            Gửi
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </ThemeLayout>
    );
};