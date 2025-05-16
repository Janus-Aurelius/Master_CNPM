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
import UserInfo from "../components/UserInfo";

const sampleSubjects: Subject[] = [
    { id: 'IT001', name: 'Nhập môn lập trình', lecturer: 'TS. Nguyễn Văn A', day: 'Thứ 2', session: '1', fromTo: 'Tiết 1-4' },
    { id: 'IT002', name: 'Lập trình hướng đối tượng', lecturer: 'PGS. TS. Trần Thị B', day: 'Thứ 3', session: '2', fromTo: 'Tiết 6-9' },
    { id: 'IT003', name: 'Cấu trúc dữ liệu và giải thuật', lecturer: 'TS. Lê Văn C', day: 'Thứ 4', session: '3', fromTo: 'Tiết 2-5' },
    { id: 'SE001', name: 'Nhập môn công nghệ phần mềm', lecturer: 'TS. Phạm Thị D', day: 'Thứ 5', session: '4', fromTo: 'Tiết 7-10' },
];

export const EnrolledSubject = ({ user, handleUnenroll, onLogout }: EnrolledSubjectProps) => {
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
            <UserInfo user={user} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.25rem' }}>
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
                        boxShadow: "0 0.125rem 0.3125rem rgba(0, 0, 0, 0.1)",
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
                        marginTop: '3.5rem',
                        flexGrow: 1,
                        minHeight: '25rem',
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
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            fontStyle: "normal",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: '0.875rem',
                            marginTop: '0',
                            textAlign: "center",
                            fontSize: "1.875rem",
                        }}
                    >
                        Danh sách môn học đã đăng ký
                    </Typography>

                    <TableContainer component={Paper} sx={{ mt: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)'}}></TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Mã lớp</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Môn học</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Giảng viên</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Thời gian</TableCell>
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
                                        '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                    }}
                                >
                                    <TableCell sx={{ textAlign: 'center', fontFamily: '"Varela Round", sans-serif', width: '3.125rem' }}>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleUnenrollClick(subject)}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '0.5625rem', 
                                                backgroundColor: '#ef5350',
                                                boxShadow: 'none',
                                                width: '2.1875rem',
                                                height: '2.1875rem',
                                                minWidth: '2.1875rem', 
                                                padding: '0',
                                                transition: 'box-shadow 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: '#f73e3e',
                                                    boxShadow: '0 0 0.5rem 0.125rem rgba(228, 61, 61, 0.8)',
                                                },
                                            }}
                                        >
                                            —
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif'}}>{subject.id}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif'}}>{subject.name}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif'}}>{subject.lecturer}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif'}}>{`${subject.day}, ${subject.fromTo}`}</TableCell>
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
                        borderRadius: '0.125rem',
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