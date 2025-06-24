// File: src/student_pages/enrolled_subject.tsx
import { ThemeLayout } from "../styles/theme_layout";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import { EnrolledSubjectProps } from "../types";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import UserInfo from "../components/UserInfo";
import { enrolledSubjectApi, type EnrolledSubjectData } from "../api_clients/student/enrolledSubjectApi";
import { enrollmentApi, parseSemesterInfo } from "../api_clients/student/enrollmentApi";

export const EnrolledSubject = ({ user, onLogout }: Omit<EnrolledSubjectProps, 'handleUnenroll'>) => {
    const [open, setOpen] = useState(false);
    const [subjects, setSubjects] = useState<EnrolledSubjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentInfo, setStudentInfo] = useState<{ studentId: any; name: any; major: any; majorName: any; } | null>(null);
    const [currentSemester, setCurrentSemester] = useState<string>("");
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    
    // Parse semester info only if currentSemester is available
    const semesterInfo = currentSemester ? parseSemesterInfo(currentSemester) : null;    useEffect(() => {
        console.log('🔄 EnrolledSubject useEffect triggered');
        console.log('👤 User:', user);
        
        if (!user || !user.id) {
            console.log('❌ No user or user.id, returning early');
            return;
        }
        
        console.log('✅ User found, starting to load data...');
        setLoading(true);
        setError(null);
        
        // Load current semester, student info and enrolled subjects
        Promise.all([
            enrollmentApi.getCurrentSemester(),
            enrollmentApi.getStudentInfo(),
            enrolledSubjectApi.getEnrolledSubjects(), // No semester parameter - backend uses current
            enrollmentApi.checkConfirmationStatus(currentSemester || 'HK1_2024')
        ])
        .then(([currentSemesterStr, studentData, enrolledSubjects, confirmationStatus]) => {
            console.log('✅ Successfully loaded current semester:', currentSemesterStr);
            console.log('✅ Successfully loaded student info:', studentData);
            console.log('✅ Successfully loaded enrolled subjects:', enrolledSubjects);
            console.log('✅ Successfully loaded confirmation status:', confirmationStatus);
            setCurrentSemester(currentSemesterStr);
            setStudentInfo(studentData);
            setSubjects(enrolledSubjects);
            setIsConfirmed(confirmationStatus.isConfirmed);
            setLoading(false);
        })
        .catch((err: any) => {
            console.error('❌ Error loading data:', err);
            setError(err.message || 'Không thể tải dữ liệu');
            setLoading(false);
        });
    }, [user]);

    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleUnenrollClick = async (subject: EnrolledSubjectData) => {
        if (!user || !user.id) return;
        try {
            setLoading(true);
            setError(null);
            
            const result = await enrollmentApi.unenrollSubject(subject.id, currentSemester);
            
            if (result.success) {
                setSubjects(prev => prev.filter(s => s.id !== subject.id));
                setSnackbarMessage(result.message);
                setSnackbarSeverity('success');
                setOpen(true);
            } else {
                setSnackbarMessage(result.message);
                setSnackbarSeverity('error');
                setOpen(true);
            }
        } catch (err: any) {
            setSnackbarMessage(err.message || 'Hủy đăng ký thất bại');
            setSnackbarSeverity('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmRegistration = async () => {
        if (!user || !user.id || !currentSemester) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const result = await enrollmentApi.confirmRegistration(currentSemester);
            
            if (result.success) {
                setIsConfirmed(true);
                setSnackbarMessage(result.message);
                setSnackbarSeverity('success');
                setOpen(true);
                setConfirmDialogOpen(false);
            } else {
                setSnackbarMessage(result.message);
                setSnackbarSeverity('error');
                setOpen(true);
            }
        } catch (err: any) {
            setSnackbarMessage(err.message || 'Xác nhận đăng ký thất bại');
            setSnackbarSeverity('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenConfirmDialog = () => {
        setConfirmDialogOpen(true);
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
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
                >                    <Typography
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
                    </Typography>                    {/* Thông tin ngành và học kỳ */}
                    {studentInfo && semesterInfo && (
                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '0.5rem', border: '1px solid #e9ecef' }}>
                            <Typography sx={{ fontWeight: 'bold', mb: 1, color: '#495057' }}>
                                Ngành: {studentInfo.majorName}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', color: '#495057', mb: 1 }}>
                                {semesterInfo.fullName}
                            </Typography>
                            {isConfirmed ? (
                                <Typography sx={{ fontWeight: 'bold', color: '#28a745' }}>
                                    ✅ Đã xác nhận đăng ký
                                </Typography>
                            ) : (
                                <Typography sx={{ fontWeight: 'bold', color: '#ffc107' }}>
                                    ⚠️ Chưa xác nhận đăng ký
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Nút xác nhận đăng ký */}
                    {!loading && !error && subjects.length > 0 && !isConfirmed && (
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleOpenConfirmDialog}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '0.5rem',
                                    backgroundColor: '#28a745',
                                    '&:hover': {
                                        backgroundColor: '#218838',
                                    },
                                    px: 3,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✅ Xác nhận đăng ký
                            </Button>
                        </Box>
                    )}

                    {loading && (
                        <Typography sx={{ textAlign: 'center', mt: 2 }}>
                            Đang tải danh sách môn học...
                        </Typography>
                    )}

                    {error && (
                        <Typography sx={{ textAlign: 'center', mt: 2, color: 'error.main' }}>
                            {error}
                        </Typography>
                    )}

                    {!loading && !error && (

                    <TableContainer component={Paper} sx={{ mt: '1.25rem', borderRadius: '0.75rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Table>                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)', width: '60px', minWidth: '60px', maxWidth: '60px' }}></TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '120px', minWidth: '120px', maxWidth: '120px' }}>Mã lớp</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '240px', minWidth: '240px', maxWidth: '240px' }}>Môn học</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '140px', minWidth: '140px', maxWidth: '140px' }}>Loại môn</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '180px', minWidth: '180px', maxWidth: '180px' }}>Giảng viên</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '160px', minWidth: '160px', maxWidth: '160px' }}>Thời gian</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {subjects.map((subject, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5',
                                        },
                                        '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                    }}
                                >                                    <TableCell sx={{ textAlign: 'center', fontFamily: '"Varela Round", sans-serif', width: '60px', minWidth: '60px', maxWidth: '60px' }}>
                                        {!isConfirmed && (
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
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', width: '120px', minWidth: '120px', maxWidth: '120px' }}>{subject.id}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', width: '240px', minWidth: '240px', maxWidth: '240px' }}>{subject.name}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', width: '140px', minWidth: '140px', maxWidth: '140px' }}>{subject.courseType || 'Chưa xác định'}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', width: '180px', minWidth: '180px', maxWidth: '180px' }}>{subject.lecturer}</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', width: '160px', minWidth: '160px', maxWidth: '160px' }}>{`${subject.day}, ${subject.fromTo}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>                        </Table>
                    </TableContainer>
                    )}
                </Paper>
            </Box>
            
            {/* Dialog xác nhận đăng ký */}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCloseConfirmDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ 
                    textAlign: 'center', 
                    color: '#d32f2f',
                    fontWeight: 'bold',
                    fontSize: '1.5rem'
                }}>
                    ⚠️ Xác nhận đăng ký
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2, fontSize: '1.1rem', textAlign: 'center' }}>
                        Bạn đã chắc chắn đăng ký những môn này chưa?
                    </Typography>
                    <Typography sx={{ 
                        mb: 2, 
                        fontSize: '1rem', 
                        textAlign: 'center',
                        color: '#d32f2f',
                        fontWeight: 'bold',
                        backgroundColor: '#ffebee',
                        p: 2,
                        borderRadius: 1
                    }}>
                        ⚠️ Lưu ý: Một khi bấm xác nhận sẽ không được thu hồi!
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', textAlign: 'center' }}>
                        Danh sách môn học đã đăng ký ({subjects.length} môn):
                    </Typography>
                    <Box sx={{ mt: 2, maxHeight: '200px', overflowY: 'auto' }}>
                        {subjects.map((subject, index) => (
                            <Typography key={index} sx={{ 
                                fontSize: '0.9rem', 
                                mb: 0.5,
                                p: 1,
                                backgroundColor: '#f5f5f5',
                                borderRadius: 0.5
                            }}>
                                • {subject.id} - {subject.name}
                            </Typography>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Button 
                        onClick={handleCloseConfirmDialog}
                        variant="outlined"
                        sx={{ mr: 2 }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmRegistration}
                        variant="contained"
                        color="error"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#d32f2f',
                            '&:hover': {
                                backgroundColor: '#b71c1c',
                            }
                        }}
                    >
                        {loading ? 'Đang xác nhận...' : 'Xác nhận đăng ký'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={handleClose}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        borderRadius: '0.125rem',
                        backgroundColor: snackbarSeverity === 'success' ? '#e8f5e9' : '#ffebee',
                        color: snackbarSeverity === 'success' ? '#2e7d32' : '#c62828',
                    }}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </ThemeLayout>
    );
};