import { SelectChangeEvent } from '@mui/material/Select';
import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import UserInfo from "../components/UserInfo";
import {
    Box, Paper, TextField, Typography, Button,
    Select, MenuItem, FormControl, InputLabel, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Divider, Grid, InputAdornment, Menu, Chip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { openCourseApi, OpenCourse, CourseStatus } from "../api_clients/openCourseApi";

// Định nghĩa width cho các cột để dùng lại
const columnWidths = {
    subjectCode: 120,
    subjectName: 200,
    credits: 90,
    enrolledStudents: 120,
    minStudents: 90,
    maxStudents: 90,
    status: 160,
    actions: 120,
};

interface OpenCourseMgmAcademicProps {
    user: User | null;
    onLogout: () => void;
}

interface GroupedCourses {
    [key: string]: {
        [fieldOfStudy: string]: OpenCourse[]
    }
}

export default function OpenCourseMgmAcademic({user, onLogout }: OpenCourseMgmAcademicProps) {
    const [courses, setCourses] = useState<OpenCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<string>("2023-2024-1");
    const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<OpenCourse | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const data = await openCourseApi.getCourses();
                setCourses(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch courses');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const groupCourses = (coursesToGroup = courses) => {
        const grouped: GroupedCourses = {};
        coursesToGroup.forEach(course => {
            const key = `${course.academicYear}-${course.semester}`;
            if (!grouped[key]) {
                grouped[key] = {};
            }
            if (!grouped[key][course.fieldOfStudy]) {
                grouped[key][course.fieldOfStudy] = [];
            }
            grouped[key][course.fieldOfStudy].push(course);
        });
        return grouped;
    };

    const handleChangeStatus = async (courseId: string, newStatus: CourseStatus) => {
        try {
            const updatedCourse = await openCourseApi.updateCourseStatus(courseId, newStatus);
            setCourses(courses.map(c => c.id === courseId ? updatedCourse : c));
        } catch (err) {
            setError('Failed to update course status');
            console.error(err);
        }
    };

    const handleDeleteCourse = (courseId: string) => {
        setConfirmDelete({ open: true, id: courseId });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.id !== null) {
            try {
                await openCourseApi.deleteCourse(confirmDelete.id);
                setCourses(courses.filter(c => c.id !== confirmDelete.id));
            } catch (err) {
                setError('Failed to delete course');
                console.error(err);
            }
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };

    const handleAddEditCourse = (course: OpenCourse) => {
        setCurrentCourse(course);
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (course: OpenCourse) => {
        setCurrentCourse(course);
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleStatusChipClick = (event: React.MouseEvent<HTMLDivElement>, courseId: string) => {
        setStatusMenuAnchor(event.currentTarget);
        setSelectedCourseId(courseId);
    };

    const handleStatusMenuClose = () => {
        setStatusMenuAnchor(null);
        setSelectedCourseId(null);
    };

    const handleStatusMenuSelect = (status: CourseStatus) => {
        if (selectedCourseId) {
            handleChangeStatus(selectedCourseId, status);
        }
        handleStatusMenuClose();
    };

    const getStatusStyle = (status: CourseStatus) => {
        switch (status) {
            case CourseStatus.OPEN:
                return { bgcolor: '#e8f5e9', color: '#2e7d32' };
            case CourseStatus.WAITING:
                return { bgcolor: '#fff3e0', color: '#ef6c00' };
            case CourseStatus.CLOSED:
                return { bgcolor: '#ffebee', color: '#c62828' };
            default:
                return { bgcolor: '#f5f5f5', color: '#616161' };
        }
    };

    const renderSelectedTermData = () => {
        const groupedCourses = groupCourses();
        const termCourses = groupedCourses[selectedTerm] || {};

        return Object.entries(termCourses).map(([fieldOfStudy, courses]) => (
            <Box key={fieldOfStudy} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e', fontWeight: 600 }}>
                    {fieldOfStudy}
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 3, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Mã môn học</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tên môn học</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Số tín chỉ</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Trạng thái</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Số lượng đăng ký</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell>{course.subjectCode}</TableCell>
                                    <TableCell>{course.subjectName}</TableCell>
                                    <TableCell>{course.credits}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={course.status}
                                            onClick={(e) => handleStatusChipClick(e, course.id)}
                                            sx={{
                                                ...getStatusStyle(course.status),
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    opacity: 0.8
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {course.enrolledStudents}/{course.maxStudents}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenEditDialog(course)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteCourse(course.id)}
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
        ));
    };

    if (loading) {
        return (
            <ThemeLayout role="academic" onLogout={onLogout}>
                <UserInfo user={user} />
                <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>
            </ThemeLayout>
        );
    }

    if (error) {
        return (
            <ThemeLayout role="academic" onLogout={onLogout}>
                <UserInfo user={user} />
                <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>
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
                            marginBottom: '14px',
                            marginTop: '0px',
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Quản lý mở lớp
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleAddEditCourse({
                                id: '',
                                subjectCode: '',
                                subjectName: '',
                                credits: 0,
                                semester: '',
                                academicYear: '',
                                fieldOfStudy: '',
                                status: CourseStatus.WAITING,
                                enrolledStudents: 0,
                                minStudents: 0,
                                maxStudents: 0
                            })}
                            sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px' }}
                        >
                            Thêm lớp học
                        </Button>
                    </Box>
                    {renderSelectedTermData()}
                </Paper>
            </Box>

            {/* Status Menu */}
            <Menu
                anchorEl={statusMenuAnchor}
                open={Boolean(statusMenuAnchor)}
                onClose={handleStatusMenuClose}
            >
                <MenuItem onClick={() => handleStatusMenuSelect(CourseStatus.OPEN)}>
                    Mở lớp
                </MenuItem>
                <MenuItem onClick={() => handleStatusMenuSelect(CourseStatus.WAITING)}>
                    Chờ mở lớp
                </MenuItem>
                <MenuItem onClick={() => handleStatusMenuSelect(CourseStatus.CLOSED)}>
                    Không mở lớp
                </MenuItem>
            </Menu>

            {/* Course Form Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.98)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        padding: 0,
                    },
                }}
            >
                <DialogTitle sx={{
                    fontFamily: '"Monserrat", sans-serif',
                    fontWeight: 700,
                    fontSize: '2rem',
                    color: '#4c4c4c',
                    textAlign: 'center',
                    pb: 0,
                    pt: 3
                }}>
                    {isEditing ? "Chỉnh sửa lớp học" : "Thêm lớp học mới"}
                </DialogTitle>
                <DialogContent dividers sx={{
                    border: 'none',
                    px: 4,
                    pt: 2,
                    pb: 0,
                    background: 'transparent',
                }}>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                autoFocus
                                label="Mã môn học"
                                fullWidth
                                value={currentCourse?.subjectCode || ''}
                                onChange={(e) => setCurrentCourse(prev => prev ? { ...prev, subjectCode: e.target.value } : null)}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Tên môn học"
                                fullWidth
                                value={currentCourse?.subjectName || ''}
                                onChange={(e) => setCurrentCourse(prev => prev ? { ...prev, subjectName: e.target.value } : null)}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Số tín chỉ"
                                type="number"
                                fullWidth
                                value={currentCourse?.credits || 0}
                                onChange={(e) => setCurrentCourse(prev => prev ? { ...prev, credits: Number(e.target.value) } : null)}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Học kỳ"
                                fullWidth
                                value={currentCourse?.semester || ''}
                                onChange={(e) => setCurrentCourse(prev => prev ? { ...prev, semester: e.target.value } : null)}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Năm học"
                                fullWidth
                                value={currentCourse?.academicYear || ''}
                                onChange={(e) => setCurrentCourse(prev => prev ? { ...prev, academicYear: e.target.value } : null)}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Ngành học"
                                fullWidth
                                value={currentCourse?.fieldOfStudy || ''}
                                onChange={(e) => setCurrentCourse(prev => prev ? { ...prev, fieldOfStudy: e.target.value } : null)}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Số lượng tối thiểu"
                                type="number"
                                fullWidth
                                value={currentCourse?.minStudents || 0}
                                onChange={(e) => setCurrentCourse(prev => prev ? { ...prev, minStudents: Number(e.target.value) } : null)}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Số lượng tối đa"
                                type="number"
                                fullWidth
                                value={currentCourse?.maxStudents || 0}
                                onChange={(e) => setCurrentCourse(prev => prev ? { ...prev, maxStudents: Number(e.target.value) } : null)}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{
                    px: 4,
                    pb: 3,
                    pt: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    background: 'transparent',
                }}>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            if (currentCourse) {
                                try {
                                    if (isEditing) {
                                        const updatedCourse = await openCourseApi.updateCourse(currentCourse.id, currentCourse);
                                        setCourses(courses.map(c => c.id === currentCourse.id ? updatedCourse : c));
                                    } else {
                                        const newCourse = await openCourseApi.createCourse(currentCourse);
                                        setCourses([...courses, newCourse]);
                                    }
                                    setOpenDialog(false);
                                } catch (err) {
                                    setError('Failed to save course');
                                    console.error(err);
                                }
                            }
                        }}
                    >
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog
                open={confirmDelete.open}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '16px',
                    },
                }}
            >
                <DialogTitle id="delete-dialog-title" sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 500 }}>
                    Xác nhận xóa lớp học
                </DialogTitle>
                <DialogContent>
                    <Typography 
                        id="delete-dialog-description" 
                        component="div"
                        sx={{
                            fontSize: '17px',
                            color: '#5c6c7c', 
                            textAlign: 'center',
                            fontWeight: 400
                        }}
                    >
                        Bạn có chắc chắn muốn xóa lớp học này không?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeLayout>
    );
}