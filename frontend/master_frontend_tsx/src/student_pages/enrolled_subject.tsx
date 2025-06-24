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
                        <Box sx={{ 
                            mb: 2, 
                            display: 'flex', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            backgroundColor: '#f8f9fa', 
                            borderRadius: '0.5rem', 
                            border: '1px solid #e9ecef',
                            p: 1.5
                        }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#495057' }}>
                                    Ngành: {studentInfo.majorName}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#495057' }}>
                                    {semesterInfo.fullName}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {isConfirmed ? (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        backgroundColor: '#e8f5e9', 
                                        px: 2, 
                                        py: 0.5, 
                                        borderRadius: '1rem',
                                    }}>
                                        <Typography sx={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '0.9rem' }}>
                                            Đã xác nhận đăng ký
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            backgroundColor: '#fff3cd', 
                                            px: 2, 
                                            py: 0.5, 
                                            borderRadius: '1rem',
                                            mr: 2
                                        }}>
                                            <Typography sx={{ fontWeight: 'bold', color: '#856404', fontSize: '0.9rem' }}>
                                                Chưa xác nhận
                                            </Typography>
                                        </Box>
                                        {!loading && !error && subjects.length > 0 && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={handleOpenConfirmDialog}
                                                sx={{
                                                    textTransform: 'none',
                                                    borderRadius: '1rem',
                                                    backgroundColor: '#28a745',
                                                    '&:hover': {
                                                        backgroundColor: '#218838',
                                                    },
                                                    px: 2,
                                                    py: 0.5,
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                Xác nhận đăng ký
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Box>
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
                PaperProps={{
                    style: {
                        borderRadius: '1rem',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    textAlign: 'center', 
                    color: '#495057',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    backgroundColor: '#f8f9fa',
                    py: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box component="span" sx={{ mr: 1 }}></Box>
                        Xác nhận đăng ký môn học
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Typography sx={{ mb: 2, fontSize: '1rem', textAlign: 'center' }}>
                        Bạn đã chắc chắn đăng ký những môn này chưa?
                    </Typography>
                    <Box sx={{ 
                        mb: 2, 
                        p: 1.5, 
                        backgroundColor: '#fff3cd',
                        borderRadius: '0.5rem',
                        border: '1px solid #ffeeba'
                    }}>
                        <Typography sx={{ 
                            fontSize: '0.9rem', 
                            textAlign: 'center',
                            color: '#856404',
                            fontWeight: 'medium',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Box component="span" sx={{ mr: 1 }}>⚠️</Box>
                            Lưu ý: Một khi bấm xác nhận sẽ không được thu hồi!
                        </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.95rem', textAlign: 'center', fontWeight: 'medium', color: '#495057' }}>
                        Danh sách môn học đã đăng ký ({subjects.length} môn):
                    </Typography>
                    <Box sx={{ 
                        mt: 1.5, 
                        maxHeight: '180px', 
                        overflowY: 'auto',
                        border: '1px solid #dee2e6',
                        borderRadius: '0.5rem',
                        p: 0.5
                    }}>
                        {subjects.map((subject, index) => (
                            <Typography key={index} sx={{ 
                                fontSize: '0.85rem', 
                                mb: 0.5,
                                p: 1,
                                backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                                borderRadius: '0.25rem',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Box component="span" sx={{ 
                                    minWidth: '1.5rem', 
                                    height: '1.5rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#6ebab6',
                                    color: 'white',
                                    borderRadius: '50%',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    mr: 1.5
                                }}>
                                    {index + 1}
                                </Box>
                                <Box component="span" sx={{ fontWeight: 'medium' }}>{subject.id}</Box> - {subject.name}
                            </Typography>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                    <Button 
                        onClick={handleCloseConfirmDialog}
                        variant="outlined"
                        sx={{ 
                            mr: 2, 
                            borderRadius: '0.75rem',
                            px: 2,
                            textTransform: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleConfirmRegistration}
                        variant="contained"
                        disabled={loading}
                        sx={{
                            backgroundColor: '#28a745',
                            borderRadius: '0.75rem',
                            px: 2,
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#218838',
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