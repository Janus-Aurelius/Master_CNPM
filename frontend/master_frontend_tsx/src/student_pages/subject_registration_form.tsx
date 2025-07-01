// File: src/student_pages/subject_registration_form.tsx
import { ThemeLayout } from '../styles/theme_layout';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { Subject } from "../types";
import Paper from '@mui/material/Paper';
import { useState, ChangeEvent, useEffect } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import UserInfo from "../components/UserInfo";
import { enrollmentApi, parseSemesterInfo, checkRegistrationStatus } from "../api_clients/student/enrollmentApi";

// Helper function to map backend course to frontend subject format
const mapBackendCourseToFrontendSubject = (course: any): Subject => {
    const dayMap: { [key: number]: string } = {
        2: "Hai", 3: "Ba", 4: "Tư", 5: "Năm", 6: "Sáu", 7: "Bảy", 8: "Chủ nhật"
    };
    const dayOfWeek = course.dayOfWeek ? `Thứ ${dayMap[course.dayOfWeek] || course.dayOfWeek}` : 'Chưa có thông tin';
    const fromTo = (course.startPeriod && course.endPeriod) ? `tiết ${course.startPeriod}-${course.endPeriod}` : 'Chưa có thông tin';
    
    return {
        id: course.courseId,
        name: course.courseName,
        credits: course.credits ? Math.round(course.credits / 15) : 0,
        lecturer: course.lecturer || 'Chưa có thông tin',
        day: dayOfWeek,
        fromTo: fromTo,
        courseType: course.courseType || 'Chưa xác định',
        currentEnrollment: course.currentEnrollment ?? course.SoSVDaDangKy ?? 'N/A',
        maxEnrollment: course.maxStudents ?? course.maxEnrollment ?? course.SiSoToiDa ?? course.maxStudents ?? 'N/A',
    };
};

const SubjectRegistrationForm = ({ user, onLogout }: { user: { id?: string; name?: string } | null; onLogout: () => void }) => {
    const [open, setOpen] = useState(false);    const [requiredSubjects, setRequiredSubjects] = useState<Subject[]>([]);
    const [electiveSubjects, setElectiveSubjects] = useState<Subject[]>([]);
    const [combinedSubjects, setCombinedSubjects] = useState<(Subject & { subjectType: 'required' | 'elective' })[]>([]);
    const [enrolledSubjectIds, setEnrolledSubjectIds] = useState<Set<string>>(new Set());
    const [studentInfo, setStudentInfo] = useState<{ studentId: any; name: any; major: any; majorName: any; } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSemester, setCurrentSemester] = useState<string>("");
    const [hasRegistration, setHasRegistration] = useState<boolean | null>(null);
    const [maxCredits, setMaxCredits] = useState(0);
    const [registeredCredits, setRegisteredCredits] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
    
    // Parse semester info
    const semesterInfo = parseSemesterInfo(currentSemester);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setHasRegistration(null);

            try {
                const currentSemesterData = await enrollmentApi.getCurrentSemester();
                setCurrentSemester(currentSemesterData);

                if (!currentSemesterData) {
                    throw new Error("Không thể xác định học kỳ hiện tại.");
                }

                // Luôn fetch tất cả dữ liệu, bất kể trạng thái đăng ký
                const [statusResult, studentData, subjectsData, enrolledData, confirmationStatus] = await Promise.all([
                    checkRegistrationStatus(currentSemesterData),
                    enrollmentApi.getStudentInfo(),
                    enrollmentApi.getClassifiedSubjects(currentSemesterData),
                    enrollmentApi.getEnrolledSubjects(currentSemesterData),
                    enrollmentApi.checkConfirmationStatus(currentSemesterData)
                ]);

                // Cập nhật trạng thái đăng ký để hiển thị UI
                setHasRegistration(statusResult.hasRegistration);
                setMaxCredits(statusResult.maxCredits);
                setRegisteredCredits(statusResult.registeredCredits);
                setIsConfirmed(confirmationStatus.isConfirmed);

                // Map và cập nhật state môn học như bình thường
                const mappedRequired = (subjectsData.required || []).map(mapBackendCourseToFrontendSubject);
                const mappedElective = (subjectsData.elective || []).map(mapBackendCourseToFrontendSubject);                setStudentInfo(studentData);
                setRequiredSubjects(mappedRequired);
                setElectiveSubjects(mappedElective);

                // Tạo combined subjects với subject type
                const combinedList = [
                    ...mappedRequired.map((subject: Subject) => ({ ...subject, subjectType: 'required' as const })),
                    ...mappedElective.map((subject: Subject) => ({ ...subject, subjectType: 'elective' as const }))
                ];
                
                // Sắp xếp môn đã đăng ký lên đầu
                const enrolledIds = new Set(enrolledData.map((subject: any) => subject.id));
                const sortedCombinedList = combinedList.sort((a, b) => {
                    const aEnrolled = enrolledIds.has(a.id);
                    const bEnrolled = enrolledIds.has(b.id);
                    if (aEnrolled && !bEnrolled) return -1;
                    if (!aEnrolled && bEnrolled) return 1;
                    return 0;
                });
                
                setCombinedSubjects(sortedCombinedList);
                setEnrolledSubjectIds(enrolledIds);

            } catch (err: any) {
                console.error('❌ Error during data loading chain:', err);
                setError(err.message || 'Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning'>('success');

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };    const handleEnroll = async (subject: Subject) => {
        if (!user || !user.id) return;        try {
            setError(null);
            
            const result = await enrollmentApi.registerSubject(subject.id, currentSemester);
            
            if (result.success) {
                setSnackbarMessage(result.message);
                setSnackbarSeverity('success');
                setOpen(true);
                // Thêm vào danh sách đã đăng ký
                setEnrolledSubjectIds(prev => new Set([...prev, subject.id]));
                // Cập nhật lại số tín chỉ đã đăng ký
                setRegisteredCredits(prev => prev + subject.credits);
                
                // Sắp xếp lại combinedSubjects để đưa môn vừa đăng ký lên đầu
                setCombinedSubjects(prev => {
                    const sortedSubjects = [...prev].sort((a, b) => {
                        const aEnrolled = a.id === subject.id || enrolledSubjectIds.has(a.id);
                        const bEnrolled = enrolledSubjectIds.has(b.id);
                        if (aEnrolled && !bEnrolled) return -1;
                        if (!aEnrolled && bEnrolled) return 1;
                        return 0;
                    });
                    return sortedSubjects;
                });
            } else {
                // Show error message from backend (including conflict messages)
                setSnackbarMessage(result.message || 'Đăng ký môn học thất bại');
                setSnackbarSeverity('error');
                setOpen(true);
            }
        } catch (err: any) {
            // Handle network errors or unexpected errors
            console.error('❌ Error during enrollment:', err);            setSnackbarMessage(err.message || 'Đăng ký môn học thất bại');
            setSnackbarSeverity('error');
            setOpen(true);
        }
    };    const handleSearch = (searchText: string) => {
        const filterSubjects = (subjects: Subject[]) => 
            subjects.filter(subject =>
                subject.id.toLowerCase().includes(searchText.toLowerCase()) ||
                subject.name.toLowerCase().includes(searchText.toLowerCase())
            );
        
        // Cập nhật combined subjects
        const filteredRequired = filterSubjects(requiredSubjects);
        const filteredElective = filterSubjects(electiveSubjects);
        const filteredCombined = [
            ...filteredRequired.map((subject: Subject) => ({ ...subject, subjectType: 'required' as const })),
            ...filteredElective.map((subject: Subject) => ({ ...subject, subjectType: 'elective' as const }))
        ];
        
        // Sắp xếp môn đã đăng ký lên đầu
        const sortedCombined = filteredCombined.sort((a, b) => {
            const aEnrolled = enrolledSubjectIds.has(a.id);
            const bEnrolled = enrolledSubjectIds.has(b.id);
            if (aEnrolled && !bEnrolled) return -1;
            if (!aEnrolled && bEnrolled) return 1;
            return 0;
        });
        
        setCombinedSubjects(sortedCombined);
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
                        position: 'relative',                        overflow: 'hidden',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderTopRightRadius: '1rem',
                        borderBottomRightRadius: '1rem',
                        flexGrow: 1,
                        minHeight: '25rem',
                        maxHeight: 'calc(100vh - 9.375rem)',
                        paddingLeft: '1rem', 
                        paddingRight: '1rem',
                        marginTop: '3.5rem', 
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
                        Đăng ký học phần
                    </Typography>                    {/* Thông tin ngành và học kỳ - Thu gọn */}
                    {studentInfo && (
                        <Box sx={{ 
                            mb: 1.5, 
                            p: 1.5, 
                            backgroundColor: '#f8f9fa', 
                            borderRadius: '8px', 
                            border: '1px solid #e9ecef',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Typography sx={{ fontWeight: 'bold', color: '#495057', fontSize: '0.9rem' }}>
                                {studentInfo.majorName}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', color: '#495057', fontSize: '0.9rem' }}>
                                {semesterInfo.fullName}
                            </Typography>
                            {hasRegistration && (
                                <Typography sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '0.9rem' }}>
                                    Tín chỉ: {registeredCredits}/{maxCredits}
                                </Typography>
                            )}
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

                    {isConfirmed ? (
                        <Typography
                            sx={{
                                textAlign: 'center',
                                mt: 4,
                                p: 2,
                                backgroundColor: '#e0f7fa',
                                borderRadius: 3,
                                fontWeight: 'bold',
                                color: '#009688',
                                fontSize: '1.2rem'
                            }}
                        >
                            Bạn đã xác nhận đăng ký! Không thể đăng ký thêm môn học.
                        </Typography>
                    ) : (
                        <>
                            {/* Kiểm tra registration status */}
                            {!hasRegistration && (
                                <Typography sx={{ 
                                    textAlign: 'center', 
                                    mt: 4, 
                                    p: 2,
                                    backgroundColor: 'warning.light',
                                    borderRadius: 2,
                                    fontWeight: 'bold'
                                }}>
                                    Chưa mở đăng ký học phần cho học kỳ này.
                                </Typography>
                            )}
                            {hasRegistration === true && (
                            <>
                            {/* Bảng môn học với ô tìm kiếm phía trên */}
                            <Typography
                                component="h2"
                                sx={{
                                    fontWeight: "bold",
                                    fontFamily: "Montserrat, sans-serif",
                                    color: "rgba(33, 33, 33, 0.8)",
                                    marginBottom: '0.5rem',
                                    marginTop: '0.5rem',
                                    fontSize: "1.5rem",
                                }}
                            >
                                Danh sách môn học ({combinedSubjects.length} môn)
                            </Typography>

                            <CombinedSubjectsList
                                subjects={combinedSubjects}
                                onEnroll={handleEnroll}
                                enrolledSubjectIds={enrolledSubjectIds}
                                onSearch={handleSearch}
                            />
                            </>
                            )}
                        </>
                    )}
                </Paper>
            </Box>            <Snackbar
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
                        borderRadius: 2,
                        backgroundColor: snackbarSeverity === 'success' ? '#e8f5e9' : 
                                       snackbarSeverity === 'error' ? '#ffebee' : '#fff3e0',
                        color: snackbarSeverity === 'success' ? '#2e7d32' : 
                               snackbarSeverity === 'error' ? '#c62828' : '#e65100',
                    }}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </ThemeLayout>
    );
};

export default SubjectRegistrationForm;

const CombinedSubjectsList = ({ subjects, onEnroll, enrolledSubjectIds, onSearch }: { 
    subjects: (Subject & { subjectType: 'required' | 'elective' })[]; 
    onEnroll: (subject: Subject) => void;
    enrolledSubjectIds: Set<string>;
    onSearch: (searchText: string) => void;
}) => {
    const [searchText, setSearchText] = useState("");

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <Box>
            {/* Ô tìm kiếm compact */}
            <Box sx={{ mb: 1.5 }}>
                <TextField
                    placeholder="Tìm kiếm theo mã môn học hoặc tên môn học"
                    value={searchText}
                    onChange={handleTextChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                    size="small"
                    sx={{
                        width: '60%',
                        fontFamily: '"Varela Round", sans-serif',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            backgroundColor: '#fafafa',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                            '&.Mui-focused': {
                                backgroundColor: '#fff',
                            }
                        },
                    }}
                />
            </Box>
            
            <TableContainer component={Paper} sx={{ 
                borderRadius: '0.75rem', 
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                maxHeight: 'calc(100vh - 400px)',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px'
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '8px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                    '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.5)'
                    }
                },
                '&::-webkit-scrollbar-corner': {
                    backgroundColor: 'transparent'
                }
            }}>
                <Table size="small" sx={{ tableLayout: 'fixed' }}>                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '15%' }}>Mã môn học</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '35%' }}>Môn học</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '15%' }}>Loại môn</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '10%' }}>Tín chỉ</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '20%' }}>Thời gian</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', textAlign: 'left', fontFamily: '"Varela Round", sans-serif', backgroundColor: '#6ebab6', width: '15%' }}>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map((subject, index) => {
                            const isEnrolled = enrolledSubjectIds.has(subject.id);
                            const isRequired = subject.subjectType === 'required';
                            const isFull = Number(subject.currentEnrollment) >= Number(subject.maxEnrollment);
                            
                            return (
                                <TableRow
                                    key={index}
                                    sx={{
                                        opacity: isEnrolled ? 0.5 : 1,
                                        backgroundColor: isEnrolled ? '#f0f0f0' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: isEnrolled ? '#f0f0f0' : '#f5f5f5',
                                        },
                                        '&:last-child td, &:last-child th': { borderBottom: 'none' },
                                        // Thêm border màu để phân biệt loại môn
                                        borderLeft: `4px solid ${isRequired ? '#2e7d32' : '#1976d2'}`,
                                    }}
                                >
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {subject.id}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {subject.name}
                                            <Chip 
                                                label={isRequired ? 'Thuộc ngành' : 'Không thuộc ngành'}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: isRequired ? '#e8f5e9' : '#e3f2fd',
                                                    color: isRequired ? '#2e7d32' : '#1976d2',
                                                    fontSize: '0.75rem',
                                                    height: '20px'
                                                }}
                                            />
                                        
                                        </Box>
                                    </TableCell>                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {subject.courseType}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {subject.credits || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {subject.day}: {subject.fromTo}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'left', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            onClick={() => onEnroll(subject)}
                                            disabled={isEnrolled || isFull}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '0.5rem',
                                                boxShadow: 'none',
                                                backgroundColor: isEnrolled || isFull
                                                    ? '#cccccc'
                                                    : isRequired ? '#2e7d32' : '#1976d2',
                                                '&:hover': {
                                                    backgroundColor: isEnrolled || isFull
                                                        ? '#cccccc'
                                                        : isRequired ? '#388e3c' : 'hsl(223, 100.00%, 70.20%)',
                                                },
                                                '&:disabled': {
                                                    backgroundColor: '#cccccc',
                                                    color: '#888888'
                                                }
                                            }}
                                        >
                                            {isEnrolled ? 'Đã đăng ký' : isFull ? 'Đã đầy' : 'Đăng ký'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

