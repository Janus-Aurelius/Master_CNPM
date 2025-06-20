import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import UserInfo from "../components/UserInfo";
import {
    Box, Paper, TextField, Typography, Button,
    Select, MenuItem, FormControl, InputLabel, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Divider, Grid, InputAdornment, Chip, Alert
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { openCourseApi, OpenCourse } from "../api_clients/academic/openCourseApi";

interface OpenCourseMgmAcademicProps {
    user: User | null;
    onLogout: () => void;
}

const dayOfWeekNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export default function OpenCourseMgmAcademic({ user, onLogout }: OpenCourseMgmAcademicProps) {
    const [courses, setCourses] = useState<OpenCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSemester, setSelectedSemester] = useState<string>("all");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("all");
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<OpenCourse | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; semesterId: string | null; courseId: string | null }>({ 
        open: false, 
        semesterId: null, 
        courseId: null 
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const data = await openCourseApi.getCourses();
                setCourses(data);
                setError(null);
                console.log('Fetched courses:', data);
            } catch (err) {
                setError('Không thể tải danh sách môn học mở');
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);    // Filter courses based on search, semester, and academic year
    const filteredCourses = courses.filter(course => {
        const matchesSearch = searchTerm === "" || 
            course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseId?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Use semesterNumber for semester filtering
        const matchesSemester = selectedSemester === "all" || 
            course.semesterNumber?.toString() === selectedSemester;
        
        // Use academicYear for academic year filtering
        const matchesAcademicYear = selectedAcademicYear === "all" || 
            course.academicYear?.toString() === selectedAcademicYear;
        
        return matchesSearch && matchesSemester && matchesAcademicYear;
    });

    console.log('Total courses:', courses.length);
    console.log('Filtered courses:', filteredCourses.length);
    console.log('Sample course:', courses[0]);// Group courses by course type (Lý thuyết, Thực hành)
    const groupCoursesByType = (courses: OpenCourse[]) => {
        console.log('Grouping courses:', courses);
        const theory = courses.filter(course => 
            course.courseTypeName?.toLowerCase().includes('lý thuyết') ||
            course.courseTypeName?.toLowerCase().includes('ly thuyet') ||
            course.courseTypeName === 'LT'
        );
        
        const practice = courses.filter(course => 
            course.courseTypeName?.toLowerCase().includes('thực hành') ||
            course.courseTypeName?.toLowerCase().includes('thuc hanh') ||
            course.courseTypeName === 'TH'
        );

        console.log('Theory courses:', theory);
        console.log('Practice courses:', practice);
        return { theory, practice };
    };

    const { theory, practice } = groupCoursesByType(filteredCourses);    // Get unique semesters and academic years for filter dropdowns
    const semesters = Array.from(new Set(courses.map(course => course.semesterNumber).filter(Boolean)))
        .sort((a, b) => (a as number) - (b as number));
    const academicYears = Array.from(new Set(courses.map(course => course.academicYear).filter(Boolean)))
        .sort((a, b) => (a as number) - (b as number));

    const handleDeleteCourse = (semesterId: string, courseId: string) => {
        setConfirmDelete({ open: true, semesterId, courseId });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.semesterId && confirmDelete.courseId) {
            try {
                await openCourseApi.deleteCourse(confirmDelete.semesterId, confirmDelete.courseId);
                setCourses(courses.filter(c => 
                    !(c.semesterId === confirmDelete.semesterId && c.courseId === confirmDelete.courseId)
                ));
                setError(null);
            } catch (err) {
                setError('Không thể xóa môn học');
                console.error('Error deleting course:', err);
            }
        }
        setConfirmDelete({ open: false, semesterId: null, courseId: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, semesterId: null, courseId: null });
    };

    const handleOpenEditDialog = (course: OpenCourse) => {
        setCurrentCourse(course);
        setIsEditing(true);
        setOpenDialog(true);
    };    const getStatusColor = (status?: string) => {
        return status === 'Mở' ? 
            { bgcolor: '#e8f5e9', color: '#2e7d32' } : 
            { bgcolor: '#ffebee', color: '#c62828' };
    };const formatTimeSlot = (dayOfWeek: number, startPeriod: number, endPeriod: number) => {
        const dayName = dayOfWeekNames[dayOfWeek] || `Thứ ${dayOfWeek}`;
        return `${dayName}, tiết ${startPeriod}-${endPeriod}`;
    };

    const renderCourseTable = (courses: OpenCourse[], title: string) => {
        if (courses.length === 0) {
            return (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e', fontWeight: 600 }}>
                        {title}
                    </Typography>
                    <Paper sx={{ p: 3, textAlign: 'center', color: '#666' }}>
                        Không có môn học nào
                    </Paper>
                </Box>
            );
        }

        return (
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e', fontWeight: 600 }}>
                    {title} ({courses.length} môn)
                </Typography>
                <TableContainer component={Paper} sx={{ 
                    mb: 3, 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    maxHeight: '600px',
                    overflow: 'auto'
                }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    minWidth: '100px'
                                }}>
                                    Mã môn
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    minWidth: '200px'
                                }}>
                                    Tên môn học
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    minWidth: '80px'
                                }}>
                                    Năm học
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    minWidth: '80px'
                                }}>
                                    Học kỳ
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    minWidth: '80px'
                                }}>
                                    Tín chỉ
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    minWidth: '150px'
                                }}>
                                    Thời gian
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    minWidth: '120px'
                                }}>
                                    Sỉ số
                                </TableCell>                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    minWidth: '100px'
                                }}>
                                    Trạng thái
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px', 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    backgroundColor: '#6ebab6',
                                    textAlign: 'center',
                                    minWidth: '120px'
                                }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>                        <TableBody>
                            {courses.map((course, index) => (                                <TableRow key={`${course.semesterId}-${course.courseId}-${index}`} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{course.courseId}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{course.courseName}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{course.academicYear || 'N/A'}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>
                                        {course.semesterNumber ? `Học kỳ ${course.semesterNumber}` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {course.totalHours && course.hoursPerCredit ? 
                                            Math.ceil(course.totalHours / course.hoursPerCredit) : 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {formatTimeSlot(course.dayOfWeek, course.startPeriod, course.endPeriod)}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            <strong>{course.currentStudents}</strong>/{course.maxStudents}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            (Tối thiểu: {course.minStudents})
                                        </Typography>
                                    </TableCell>                                    <TableCell>
                                        <Chip
                                            label={course.status || 'N/A'}
                                            size="small"
                                            sx={{
                                                ...getStatusColor(course.status),
                                                fontWeight: 500
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenEditDialog(course)}
                                            sx={{ mr: 1 }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteCourse(course.semesterId, course.courseId)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    };

    if (loading) {
        return (
            <ThemeLayout role="academic" onLogout={onLogout}>
                <UserInfo user={user} />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <Typography sx={{ textAlign: 'center', fontSize: '18px' }}>Đang tải dữ liệu...</Typography>
                </Box>
            </ThemeLayout>
        );
    }

    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <UserInfo user={user} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.25rem' }}>
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
                        overflow: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: '6px'
                        },
                        borderTopRightRadius: '16px',
                        borderBottomRightRadius: '16px',
                        marginTop: '3.5rem',
                        flexGrow: 1,
                        minHeight: '25rem',
                        maxHeight: 'calc(100vh - 9.375rem)',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        marginLeft: '0px',
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
                            marginBottom: '20px',
                            marginTop: '0px',
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Quản lý mở lớp
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}                    {/* Search and Filter Controls */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo tên hoặc mã môn học..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                            />
                        </Grid>                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Năm học</InputLabel>
                                <Select
                                    value={selectedAcademicYear}
                                    label="Năm học"
                                    onChange={(e) => setSelectedAcademicYear(e.target.value)}
                                    sx={{
                                        borderRadius: '12px'
                                    }}
                                >
                                    <MenuItem value="all">Tất cả năm học</MenuItem>
                                    {academicYears.map(year => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Học kỳ</InputLabel>
                                <Select
                                    value={selectedSemester}
                                    label="Học kỳ"
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    sx={{
                                        borderRadius: '12px'
                                    }}
                                >
                                    <MenuItem value="all">Tất cả học kỳ</MenuItem>
                                    {semesters.map(semester => (
                                        <MenuItem key={semester} value={semester}>
                                            Học kỳ {semester}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>                        </Grid>
                    </Grid>
                    
                    {/* Add Course Button */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setCurrentCourse(null);
                                    setIsEditing(false);
                                    setOpenDialog(true);
                                }}
                                sx={{
                                    height: '56px',
                                    borderRadius: '12px',
                                    backgroundColor: '#6ebab6',
                                    '&:hover': {
                                        backgroundColor: '#5ca9a5'
                                    }
                                }}
                            >
                                Thêm mới
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    {/* Course Tables */}
                    {renderCourseTable(theory, "Môn Lý thuyết")}
                    {renderCourseTable(practice, "Môn Thực hành")}

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        open={confirmDelete.open}
                        onClose={handleCancelDelete}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Xác nhận xóa môn học
                        </DialogTitle>
                        <DialogContent>
                            <Typography>
                                Bạn có chắc chắn muốn xóa môn học này không? Hành động này không thể hoàn tác.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelDelete}>Hủy</Button>
                            <Button onClick={handleConfirmDelete} color="error" autoFocus>
                                Xóa
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Add/Edit Dialog - Placeholder for now */}
                    <Dialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>
                            {isEditing ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
                        </DialogTitle>
                        <DialogContent>
                            <Typography>
                                Chức năng thêm/sửa sẽ được phát triển trong phiên bản tiếp theo.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Box>
        </ThemeLayout>
    );
}
