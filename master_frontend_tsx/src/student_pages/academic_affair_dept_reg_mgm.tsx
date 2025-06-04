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
                        borderRadius: '16px',
                        padding: '20px',
                        fontSize: '18px',
                        fontFamily: '"Varela Round", sans-serif',
                        fontWeight: 450,
                        backgroundColor: 'rgb(250, 250, 250)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        color: 'rgb(39, 89, 217)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        marginTop: '16px',
                        flexGrow: 1,
                        minHeight: '300px',
                        maxHeight: 'calc(100vh - 150px)',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        marginLeft: '0px',
                        marginRight: '10px',
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            fontFamily: 'Montserrat, sans-serif',
                            fontStyle: 'normal',
                            color: 'rgba(33, 33, 33, 0.8)',
                            marginBottom: '14px',
                            marginTop: '0px',
                            textAlign: 'center',
                            fontSize: '30px',
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
                                borderRadius: '12px',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                padding: '16px',
                                transition: 'all 0.3s ease',
                                minHeight: '500px',
                                maxWidth: '800px',
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
                                        fontSize: '18px',
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
                                borderRadius: '8px',
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