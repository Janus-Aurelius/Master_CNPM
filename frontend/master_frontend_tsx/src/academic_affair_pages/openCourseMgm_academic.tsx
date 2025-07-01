import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import UserInfo from "../components/UserInfo";
import {
    Box, Paper, TextField, Typography, Button,
    Select, MenuItem, FormControl, InputLabel, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Divider, Grid, InputAdornment, Alert,
    Snackbar
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

const dayOfWeekNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export default function OpenCourseMgmAcademic({ user, onLogout }: OpenCourseMgmAcademicProps) {
    const [courses, setCourses] = useState<OpenCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
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

    // Snackbar state for showing messages
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Form states
    const [availableSemesters, setAvailableSemesters] = useState<Array<{id: string, name: string, semesterNumber: number, academicYear: number}>>([]);
    const [availableCourses, setAvailableCourses] = useState<Array<{courseId: string, courseName: string, courseTypeId: string, courseTypeName: string, totalHours: number}>>([]);
    const [formData, setFormData] = useState({
        semesterId: '',
        courseId: '',
        minStudents: 25,
        maxStudents: 50,
        dayOfWeek: 2, // Thứ 2
        startPeriod: 1,
        endPeriod: 3
    });    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [coursesData, semestersData, availableCoursesData] = await Promise.all([
                    openCourseApi.getCourses(),
                    openCourseApi.getSemesters(),
                    openCourseApi.getAvailableCourses()
                ]);                setCourses(coursesData);
                // Map semesters data to correct format
                console.log('Raw semesters data:', semestersData);
                const mappedSemesters = semestersData.map((semester: any) => {
                    console.log('Mapping semester:', semester);
                    return {
                        id: semester.semesterId,
                        name: `Học kỳ ${semester.termNumber || semester.semesterNumber || 'N/A'}`,
                        semesterNumber: semester.termNumber || semester.semesterNumber,
                        academicYear: semester.academicYear
                    };
                });
                console.log('Mapped semesters:', mappedSemesters);
                setAvailableSemesters(mappedSemesters);
                setAvailableCourses(availableCoursesData);
                setError(null);
                console.log('Fetched courses:', coursesData);
                console.log('Fetched semesters:', semestersData);
                console.log('Fetched available courses:', availableCoursesData);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                const errorMessage = err?.response?.data?.message || 'Không thể tải dữ liệu';
                setError(errorMessage);
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);// Filter courses based on search, semester, and academic year
    const filteredCourses = courses.filter(course => {
        const matchesSearch = searchTerm === "" || 
            course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseId?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Use semesterNumber for semester filtering - convert both to string for comparison
        const matchesSemester = selectedSemester === "all" || 
            String(course.semesterNumber) === String(selectedSemester);
        
        // Use academicYear for academic year filtering - convert both to string for comparison
        const matchesAcademicYear = selectedAcademicYear === "all" || 
            String(course.academicYear) === String(selectedAcademicYear);
        
        return matchesSearch && matchesSemester && matchesAcademicYear;
    });    console.log('Total courses:', courses.length);
    console.log('Filtered courses:', filteredCourses.length);
    console.log('Sample course:', courses[0]);
    console.log('Selected semester:', selectedSemester);
    console.log('Selected academic year:', selectedAcademicYear);    // No need to group courses by type anymore - display all in one table// Get unique semesters and academic years for filter dropdowns
    const semesters = Array.from(new Set(courses.map(course => course.semesterNumber).filter(Boolean)))
        .sort((a, b) => (a as number) - (b as number));
    const academicYears = Array.from(new Set(courses.map(course => course.academicYear).filter(Boolean)))
        .sort((a, b) => (a as number) - (b as number));

    console.log('Available semesters:', semesters);
    console.log('Available academic years:', academicYears);    const handleDeleteCourse = (semesterId: string, courseId: string) => {
        setConfirmDelete({ open: true, semesterId, courseId });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.semesterId && confirmDelete.courseId) {
            try {
                await openCourseApi.deleteCourse(confirmDelete.semesterId, confirmDelete.courseId);
                setCourses(courses.filter(c => 
                    !(c.semesterId === confirmDelete.semesterId && c.courseId === confirmDelete.courseId)
                ));
                setSnackbar({ open: true, message: 'Xóa môn học thành công', severity: 'success' });
                setError(null);
            } catch (err: any) {
                console.error('Error deleting course:', err);
                const errorMessage = err?.response?.data?.message || 'Không thể xóa môn học';
                setError(errorMessage);
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            }
        }
        setConfirmDelete({ open: false, semesterId: null, courseId: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, semesterId: null, courseId: null });
    };

    const handleOpenAddDialog = () => {
        setFormData({
            semesterId: '',
            courseId: '',
            minStudents: 25,
            maxStudents: 50,
            dayOfWeek: 2,
            startPeriod: 1,
            endPeriod: 3
        });
        setCurrentCourse(null);
        setIsEditing(false);
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (course: OpenCourse) => {
        setFormData({
            semesterId: course.semesterId,
            courseId: course.courseId,
            minStudents: course.minStudents,
            maxStudents: course.maxStudents,
            dayOfWeek: course.dayOfWeek,
            startPeriod: course.startPeriod,
            endPeriod: course.endPeriod
        });
        setCurrentCourse(course);
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentCourse(null);
        setFormData({
            semesterId: '',
            courseId: '',
            minStudents: 25,
            maxStudents: 50,
            dayOfWeek: 2,
            startPeriod: 1,
            endPeriod: 3
        });
    };

    const handleFormSubmit = async () => {
        try {
            if (isEditing && currentCourse) {
                // Update course
                const updateData: Partial<OpenCourse> = {
                    minStudents: formData.minStudents,
                    maxStudents: formData.maxStudents
                };

                // Only include time fields if no registrations (business logic will handle this)
                if (formData.dayOfWeek !== currentCourse.dayOfWeek ||
                    formData.startPeriod !== currentCourse.startPeriod ||
                    formData.endPeriod !== currentCourse.endPeriod) {
                    updateData.dayOfWeek = formData.dayOfWeek;
                    updateData.startPeriod = formData.startPeriod;
                    updateData.endPeriod = formData.endPeriod;
                }

                const updatedCourse = await openCourseApi.updateCourse(
                    currentCourse.semesterId,
                    currentCourse.courseId,
                    updateData
                );
                
                // Update courses list
                setCourses(courses.map(c => 
                    c.semesterId === currentCourse.semesterId && c.courseId === currentCourse.courseId 
                        ? { ...c, ...updatedCourse } 
                        : c
                ));
                setSnackbar({ open: true, message: 'Cập nhật môn học thành công', severity: 'success' });            } else {
                // Create new course
                await openCourseApi.createCourse({
                    semesterId: formData.semesterId,
                    courseId: formData.courseId,
                    minStudents: formData.minStudents,
                    maxStudents: formData.maxStudents,
                    dayOfWeek: formData.dayOfWeek,
                    startPeriod: formData.startPeriod,
                    endPeriod: formData.endPeriod
                });
                
                // Reload data to get the new course with all joined fields
                const updatedCourses = await openCourseApi.getCourses();
                setCourses(updatedCourses);
                setSnackbar({ open: true, message: 'Thêm môn học thành công', severity: 'success' });
            }
            
            handleCloseDialog();
        } catch (err: any) {
            console.error('Error saving course:', err);
            const errorMessage = err?.response?.data?.message || 'Không thể lưu môn học';
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        }
    };    // Form validation function
    const isFormValid = () => {
        if (!formData.semesterId || !formData.courseId) return false;
        if (formData.minStudents < 1 || formData.maxStudents < formData.minStudents) return false;
        if (formData.dayOfWeek < 1 || formData.dayOfWeek > 7) return false;        if (formData.startPeriod < 1 || formData.startPeriod > 10 || 
            formData.endPeriod < 1 || formData.endPeriod > 10) return false;
        if (formData.startPeriod >= formData.endPeriod) return false;
        return true;
    };const formatTimeSlot = (dayOfWeek: number, startPeriod: number, endPeriod: number) => {
        const dayName = dayOfWeekNames[dayOfWeek - 2] || `Thứ ${dayOfWeek}`;
        return `${dayName}, tiết ${startPeriod}-${endPeriod}`;
    };    const renderCourseTable = (courses: OpenCourse[]) => {
        if (courses.length === 0) {
            return (
                <Paper sx={{ p: 3, textAlign: 'center', color: '#666' }}>
                    Không có môn học nào
                </Paper>
            );
        }        return (
            <TableContainer component={Paper} sx={{ 
                mb: 3, 
                borderRadius: '12px', 
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                maxHeight: '600px',
                overflow: 'auto'
            }}>
                <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                width: '8%',
                                maxWidth: '80px'
                            }}>
                                Mã môn
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                width: '25%',
                                maxWidth: '180px'
                            }}>
                                Tên môn học
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                width: '10%',
                                maxWidth: '80px'
                            }}>
                                Loại môn
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                width: '8%',
                                maxWidth: '70px'
                            }}>
                                Năm học
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                width: '8%',
                                maxWidth: '70px'
                            }}>
                                Học kỳ
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                width: '6%',
                                maxWidth: '60px'
                            }}>
                                Tín chỉ
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                width: '15%',
                                maxWidth: '120px'
                            }}>
                                Thời gian
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                width: '12%',
                                maxWidth: '100px'
                            }}>
                                Sỉ số
                            </TableCell>
                            <TableCell sx={{ 
                                fontWeight: 'bold', 
                                color: '#FFFFFF', 
                                fontSize: '14px', 
                                fontFamily: '"Varela Round", sans-serif', 
                                backgroundColor: '#6ebab6',
                                textAlign: 'center',
                                width: '8%',
                                maxWidth: '80px'
                            }}>
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>                        {courses.map((course, index) => (
                            <TableRow key={`${course.semesterId}-${course.courseId}-${index}`} hover>
                                <TableCell sx={{ fontWeight: 500, fontSize: '13px', padding: '8px' }}>{course.courseId}</TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 500, 
                                    fontSize: '13px', 
                                    padding: '8px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '180px'
                                }}>
                                    {course.courseName}
                                </TableCell>
                                <TableCell sx={{ fontWeight: 500, fontSize: '13px', padding: '8px' }}>{course.courseTypeName}</TableCell>
                                <TableCell sx={{ fontWeight: 500, fontSize: '13px', padding: '8px' }}>{course.academicYear || 'N/A'}</TableCell>
                                <TableCell sx={{ fontWeight: 500, fontSize: '13px', padding: '8px' }}>
                                    {course.semesterNumber ? `HK${course.semesterNumber}` : 'N/A'}
                                </TableCell>
                                <TableCell sx={{ fontSize: '13px', padding: '8px' }}>
                                    {course.totalHours && course.hoursPerCredit ? 
                                        Math.ceil(course.totalHours / course.hoursPerCredit) : 'N/A'
                                    }
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px', padding: '8px' }}>
                                    {formatTimeSlot(course.dayOfWeek, course.startPeriod, course.endPeriod)}
                                </TableCell>
                                <TableCell sx={{ padding: '8px' }}>
                                    <Typography variant="body2" sx={{ fontSize: '12px' }}>
                                        <strong>{course.currentStudents}</strong>/{course.maxStudents}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: '10px' }}>
                                        (Min: {course.minStudents})
                                    </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ padding: '8px' }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenEditDialog(course)}
                                        sx={{ mr: 0.5, padding: '4px' }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteCourse(course.semesterId, course.courseId)}
                                        sx={{ padding: '4px' }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                    <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Tìm kiếm theo tên hoặc mã môn học..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            height: '40px'
                                        }
                                    }}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Năm học</InputLabel>
                                    <Select
                                        value={selectedAcademicYear}
                                        label="Năm học"
                                        onChange={(e) => setSelectedAcademicYear(e.target.value)}
                                        sx={{
                                            borderRadius: '12px',
                                            height: '40px'
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
                                <FormControl fullWidth size="small">
                                    <InputLabel>Học kỳ</InputLabel>
                                    <Select
                                        value={selectedSemester}
                                        label="Học kỳ"
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                        sx={{
                                            borderRadius: '12px',
                                            height: '40px'
                                        }}
                                    >
                                        <MenuItem value="all">Tất cả học kỳ</MenuItem>
                                        {semesters.map(semester => (
                                            <MenuItem key={semester} value={semester}>
                                                Học kỳ {semester}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={4}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={handleOpenAddDialog}
                                        sx={{
                                            height: '40px',
                                            borderRadius: '12px',
                                            backgroundColor: '#6ebab6',
                                            '&:hover': {
                                                backgroundColor: '#5ca9a5'
                                            },
                                            minWidth: '140px'
                                        }}
                                    >
                                        Thêm mới
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box><Divider sx={{ mb: 3 }} />

                    {/* Course Table */}
                    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e', fontWeight: 600 }}>
                        Danh sách môn học ({filteredCourses.length} môn)
                    </Typography>
                    {renderCourseTable(filteredCourses)}

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
                    </Dialog>                    {/* Add/Edit Dialog */}
                    <Dialog
                        open={openDialog}
                        onClose={handleCloseDialog}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>
                            {isEditing ? 'Chỉnh sửa môn học' : 'Thêm môn học mở'}
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ pt: 2 }}>
                                <Grid container spacing={3}>
                                    {/* Semester Selection */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Học kỳ</InputLabel>
                                            <Select
                                                value={formData.semesterId}
                                                label="Học kỳ"
                                                onChange={(e) => setFormData({...formData, semesterId: e.target.value})}
                                                disabled={isEditing}
                                            >                                                {availableSemesters.map(semester => (
                                                    <MenuItem key={semester.id} value={semester.id}>
                                                        Học kỳ {semester.semesterNumber} - {semester.academicYear}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Course Selection */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Môn học</InputLabel>
                                            <Select
                                                value={formData.courseId}
                                                label="Môn học"
                                                onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                                                disabled={isEditing}
                                            >
                                                {availableCourses.map(course => (
                                                    <MenuItem key={course.courseId} value={course.courseId}>
                                                        {course.courseId} - {course.courseName} ({course.courseTypeName})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Min Students */}
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Số SV tối thiểu"
                                            type="number"
                                            value={formData.minStudents}
                                            onChange={(e) => setFormData({...formData, minStudents: parseInt(e.target.value) || 0})}
                                            required
                                            inputProps={{ min: 1 }}
                                        />
                                    </Grid>

                                    {/* Max Students */}
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Số SV tối đa"
                                            type="number"
                                            value={formData.maxStudents}
                                            onChange={(e) => setFormData({...formData, maxStudents: parseInt(e.target.value) || 0})}
                                            required
                                            inputProps={{ min: formData.minStudents }}
                                        />
                                    </Grid>

                                    {/* Day of Week */}
                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Thứ</InputLabel>
                                            <Select
                                                value={formData.dayOfWeek}
                                                label="Thứ"
                                                onChange={(e) => setFormData({...formData, dayOfWeek: parseInt(e.target.value as string)})}
                                                disabled={isEditing && Boolean(currentCourse?.currentStudents && currentCourse.currentStudents > 0)}
                                            >
                                                {dayOfWeekNames.map((day, index) => (
                                                    <MenuItem key={index + 2} value={index + 2}>
                                                        {day}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Start Period */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Tiết bắt đầu</InputLabel>                                            <Select
                                                value={formData.startPeriod}
                                                label="Tiết bắt đầu"
                                                onChange={(e) => setFormData({...formData, startPeriod: parseInt(e.target.value as string)})}
                                                disabled={isEditing && Boolean(currentCourse?.currentStudents && currentCourse.currentStudents > 0)}
                                            >
                                                {Array.from({length: 10}, (_, i) => i + 1).map(period => (
                                                    <MenuItem key={period} value={period}>
                                                        Tiết {period}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* End Period */}
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth required>
                                            <InputLabel>Tiết kết thúc</InputLabel>                                            <Select
                                                value={formData.endPeriod}
                                                label="Tiết kết thúc"
                                                onChange={(e) => setFormData({...formData, endPeriod: parseInt(e.target.value as string)})}
                                                disabled={isEditing && Boolean(currentCourse?.currentStudents && currentCourse.currentStudents > 0)}
                                            >
                                                {Array.from({length: 10}, (_, i) => i + 1)
                                                    .filter(period => period > formData.startPeriod)
                                                    .map(period => (
                                                        <MenuItem key={period} value={period}>
                                                            Tiết {period}
                                                        </MenuItem>
                                                    ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Show restrictions for editing */}
                                    {isEditing && currentCourse?.currentStudents && currentCourse.currentStudents > 0 && (
                                        <Grid item xs={12}>
                                            <Alert severity="info">
                                                Môn học này đã có {currentCourse.currentStudents} sinh viên đăng ký. 
                                                Chỉ có thể sửa số sinh viên tối thiểu và tối đa.
                                            </Alert>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>Hủy</Button>
                            <Button 
                                onClick={handleFormSubmit} 
                                variant="contained"
                                disabled={!isFormValid()}
                            >
                                {isEditing ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Snackbar for notifications */}
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={() => setSnackbar({...snackbar, open: false})}
                    >
                        <Alert 
                            onClose={() => setSnackbar({...snackbar, open: false})} 
                            severity={snackbar.severity}
                            sx={{ width: '100%' }}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Paper>
            </Box>
        </ThemeLayout>
    );
}
