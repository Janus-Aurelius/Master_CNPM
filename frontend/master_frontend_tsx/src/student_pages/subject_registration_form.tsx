// File: src/student_pages/subject_registration_form.tsx
import { ThemeLayout } from '../styles/theme_layout';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { Subject } from "../types";
import Paper from '@mui/material/Paper';
import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
        courseType: course.courseType || 'Chưa xác định'
    };
};

const SubjectRegistrationForm = ({ user, onLogout }: { user: { id?: string; name?: string } | null; onLogout: () => void }) => {
    const [open, setOpen] = useState(false);
    const [requiredSubjects, setRequiredSubjects] = useState<Subject[]>([]);
    const [electiveSubjects, setElectiveSubjects] = useState<Subject[]>([]);
    const [filteredRequiredSubjects, setFilteredRequiredSubjects] = useState<Subject[]>([]);
    const [filteredElectiveSubjects, setFilteredElectiveSubjects] = useState<Subject[]>([]);
    const [enrolledSubjectIds, setEnrolledSubjectIds] = useState<Set<string>>(new Set());
    const [studentInfo, setStudentInfo] = useState<{ studentId: any; name: any; major: any; majorName: any; } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSemester, setCurrentSemester] = useState<string>("");
    const [hasRegistration, setHasRegistration] = useState<boolean | null>(null);
    const [maxCredits, setMaxCredits] = useState(0);
    const [registeredCredits, setRegisteredCredits] = useState(0);
    
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
                const [statusResult, studentData, subjectsData, enrolledData] = await Promise.all([
                    checkRegistrationStatus(currentSemesterData),
                    enrollmentApi.getStudentInfo(),
                    enrollmentApi.getClassifiedSubjects(currentSemesterData),
                    enrollmentApi.getEnrolledSubjects(currentSemesterData)
                ]);

                // Cập nhật trạng thái đăng ký để hiển thị UI
                setHasRegistration(statusResult.hasRegistration);
                setMaxCredits(statusResult.maxCredits);
                setRegisteredCredits(statusResult.registeredCredits);

                // Map và cập nhật state môn học như bình thường
                const mappedRequired = (subjectsData.required || []).map(mapBackendCourseToFrontendSubject);
                const mappedElective = (subjectsData.elective || []).map(mapBackendCourseToFrontendSubject);

                setStudentInfo(studentData);
                setRequiredSubjects(mappedRequired);
                setElectiveSubjects(mappedElective);
                setFilteredRequiredSubjects(mappedRequired);
                setFilteredElectiveSubjects(mappedElective);

                const enrolledIds = new Set(enrolledData.map((subject: any) => subject.id));
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
        if (!user || !user.id) return;
        try {
            setLoading(true);
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
            } else {
                // Show error message from backend (including conflict messages)
                setSnackbarMessage(result.message || 'Đăng ký môn học thất bại');
                setSnackbarSeverity('error');
                setOpen(true);
            }
        } catch (err: any) {
            // Handle network errors or unexpected errors
            console.error('❌ Error during enrollment:', err);
            setSnackbarMessage(err.message || 'Đăng ký môn học thất bại');
            setSnackbarSeverity('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchText: string) => {
        const filterSubjects = (subjects: Subject[]) => 
            subjects.filter(subject =>
                subject.id.toLowerCase().includes(searchText.toLowerCase()) ||
                subject.name.toLowerCase().includes(searchText.toLowerCase())
            );
        
        setFilteredRequiredSubjects(filterSubjects(requiredSubjects));
        setFilteredElectiveSubjects(filterSubjects(electiveSubjects));
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
                    </Typography>                    {/* Thông tin ngành và học kỳ */}
                    {studentInfo && (
                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '0.5rem', border: '1px solid #e9ecef' }}>
                            <Typography sx={{ fontWeight: 'bold', mb: 1, color: '#495057' }}>
                                Ngành: {studentInfo.majorName}
                            </Typography>
                            <Typography sx={{ fontWeight: 'bold', color: '#495057', mb: 1 }}>
                                {semesterInfo.fullName}
                            </Typography>
                            {hasRegistration && (
                                <Typography sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                    Tín chỉ đã đăng ký: {registeredCredits} / {maxCredits}
                                </Typography>
                            )}
                        </Box>
                    )}
                    
                    {loading && (
                        <Typography sx={{ textAlign: 'center', mt: 2 }}>
                            Đang tải dữ liệu...
                        </Typography>
                    )}

                    {error && (
                        <Typography sx={{ textAlign: 'center', mt: 2, color: 'error.main' }}>
                            {error}
                        </Typography>
                    )}

                    {!loading && !error && (
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
                    <Box sx={{ marginBottom: '1rem' }}>
                        <CustomSearchBox
                            onSearch={handleSearch}
                            placeholder="Tìm kiếm theo mã môn học hoặc tên môn học"
                        />
                    </Box>

                    {/* Bảng môn học thuộc chương trình */}
                    <Typography
                        component="h2"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: '1rem',
                            marginTop: '1.5rem',
                            fontSize: "1.5rem",
                        }}
                    >
                        Môn học mở thuộc ngành của bạn ({filteredRequiredSubjects.length} môn)
                    </Typography>                    <SubjectsList
                        subjects={filteredRequiredSubjects}
                        onEnroll={handleEnroll}
                        tableType="required"
                        enrolledSubjectIds={enrolledSubjectIds}
                    />

                    {/* Bảng môn học tự chọn */}
                    <Typography
                        component="h2"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: '1rem',
                            marginTop: '2rem',
                            fontSize: "1.5rem",
                        }}
                    >
                        Môn học mở không thuộc ngành của bạn ({filteredElectiveSubjects.length} môn)
                    </Typography>
                    <SubjectsList
                        subjects={filteredElectiveSubjects}
                        onEnroll={handleEnroll}
                        tableType="elective"
                        enrolledSubjectIds={enrolledSubjectIds}
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

interface SearchBoxProps {
    onSearch?: (searchText: string) => void;
    placeholder?: string;
}

const CustomSearchBox = ({ onSearch, placeholder = "Search..." }: SearchBoxProps) => {
    const [searchText, setSearchText] = useState("");

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    const handleClick = () => {
        if (onSearch) {
            onSearch(searchText);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleClick();
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
                backgroundColor: "#f5f5f5",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                padding: "0.25rem 0.75rem",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
                },
            }}
        >
            <TextField
                variant="standard"
                fullWidth
                placeholder={placeholder}
                value={searchText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#888" }} />
                        </InputAdornment>
                    ),
                    sx: {
                        fontSize: "1rem",
                        padding: "0.5rem 0",
                    },
                }}
            />
        </Box>
    );
};

const SubjectsList = ({ subjects, onEnroll, tableType, enrolledSubjectIds }: { 
    subjects: Subject[]; 
    onEnroll: (subject: Subject) => void;
    tableType?: 'required' | 'elective';
    enrolledSubjectIds: Set<string>;
}) => {
    const headerColor = tableType === 'required' ? '#2e7d32' : '#6ebab6'; // Xanh đậm cho bắt buộc, xanh nhạt cho tự chọn
    
    return (
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '0.75rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Table size="medium" sx={{ tableLayout: 'fixed' }}>                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: headerColor, width: '12%' }}>Mã môn học</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: headerColor, width: '25%' }}>Môn học</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: headerColor, width: '12%' }}>Loại môn</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: headerColor, width: '15%' }}>Giảng viên</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: headerColor, width: '8%' }}>Tín chỉ</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: headerColor, width: '16%' }}>Thời gian</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', textAlign: 'left', fontFamily: '"Varela Round", sans-serif', backgroundColor: headerColor, width: '12%' }}>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subjects.map((subject, index) => {
                        const isEnrolled = enrolledSubjectIds.has(subject.id);
                        return (
                            <TableRow
                                key={index}
                                sx={{
                                    opacity: isEnrolled ? 0.5 : 1, // Làm mờ nếu đã đăng ký
                                    backgroundColor: isEnrolled ? '#f0f0f0' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: isEnrolled ? '#f0f0f0' : '#f5f5f5',
                                    },
                                    '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                }}
                            >                                <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.id}</TableCell>
                                <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {subject.name}
                                    {isEnrolled && <span style={{ color: '#4caf50', fontWeight: 'bold', marginLeft: '8px' }}>(Đã đăng ký)</span>}
                                </TableCell>
                                <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {subject.courseType}
                                </TableCell>
                                <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {subject.lecturer}
                                </TableCell>
                                <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.credits || 'N/A'}</TableCell>
                                <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {subject.day}: {subject.fromTo}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'left', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={() => onEnroll(subject)}
                                        disabled={isEnrolled} // Vô hiệu hóa nếu đã đăng ký
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: '0.5rem',
                                            boxShadow: 'none',
                                            backgroundColor: isEnrolled 
                                                ? '#cccccc' 
                                                : tableType === 'required' ? '#2e7d32' : '#1976d2',
                                            '&:hover': {
                                                backgroundColor: isEnrolled 
                                                    ? '#cccccc' 
                                                    : tableType === 'required' ? '#388e3c' : 'hsl(223, 100.00%, 70.20%)',
                                            },
                                            '&:disabled': {
                                                backgroundColor: '#cccccc',
                                                color: '#888888'
                                            }
                                        }}
                                    >
                                        {isEnrolled ? 'Đã đăng ký' : 'Đăng ký'}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

