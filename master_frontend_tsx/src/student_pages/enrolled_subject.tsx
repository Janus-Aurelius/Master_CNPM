// File: src/student_pages/enrolled_subject.tsx
import { ThemeLayout } from "../styles/theme_layout";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { Subject, EnrolledSubjectProps } from "../types";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const sampleSubjects: Subject[] = [
    { id: 'IT001', name: 'Nhập môn lập trình', lecturer: 'TS. Nguyễn Văn A', day: 'Thứ 2', session: '1', fromTo: 'Tiết 1-4' },
    { id: 'IT002', name: 'Lập trình hướng đối tượng', lecturer: 'PGS. TS. Trần Thị B', day: 'Thứ 3', session: '2', fromTo: 'Tiết 6-9' },
    { id: 'IT003', name: 'Cấu trúc dữ liệu và giải thuật', lecturer: 'TS. Lê Văn C', day: 'Thứ 4', session: '3', fromTo: 'Tiết 2-5' },
    { id: 'SE001', name: 'Nhập môn công nghệ phần mềm', lecturer: 'TS. Phạm Thị D', day: 'Thứ 5', session: '4', fromTo: 'Tiết 7-10' },
];

export const EnrolledSubject = ({ handleUnenroll, onLogout, ...otherProps }: EnrolledSubjectProps) => {
    const [open, setOpen] = useState(false);

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleUnenrollClick = (subject: Subject) => {
        console.log('Unenrolling from', subject);
        handleUnenroll(subject);
        setOpen(true);
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
                        minHeight: '400px',
                        maxHeight: 'calc(100vh - 150px)',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        marginLeft: '-17px',
                        marginRight: '10px',
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            fontStyle: "normal",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: '14px',
                            marginTop: '0px',
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Danh sách môn học đã đăng ký
                    </Typography>

                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#536493', boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)'}}></TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Mã lớp</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Môn học</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Giảng viên</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Thời gian</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sampleSubjects.map((subject, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ textAlign: 'center', fontFamily: '"Varela Round", sans-serif', width: '50px' }}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleUnenrollClick(subject)}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '9px', 
                                                backgroundColor: '#e43d3d',
                                                boxShadow: 'none',
                                                width: '35px',
                                                height: '35px',
                                                minWidth: '35px', 
                                                padding: '0',
                                                transition: 'box-shadow 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: '#f73e3e',
                                                    boxShadow: '0 0 12px 4px rgba(228, 61, 61, 0.8)',
                                                },
                                            }}
                                        >
                                            —
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', borderRight: '0.5px solid rgb(237, 237, 237)' }}>{subject.id}</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', borderRight: '0.5px solid rgb(237, 237, 237)' }}>{subject.name}</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', borderRight: '0.5px solid rgb(237, 237, 237)' }}>{subject.lecturer}</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', borderRight: '0.5px solid rgb(237, 237, 237)' }}>{`${subject.day}, ${subject.fromTo}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
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
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                    }}
                >
                    Hủy đăng ký thành công!
                </MuiAlert>
            </Snackbar>
        </ThemeLayout>
    );
};