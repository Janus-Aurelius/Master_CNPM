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
    Divider, Grid, InputAdornment, Menu
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// Define enums
enum CourseStatus {
    OPEN = "Mở lớp",
    WAITING = "Chờ mở lớp",
    CLOSED = "Không mở lớp"
}

// Define interfaces
interface OpenCourse {
    id: string;
    subjectCode: string;
    subjectName: string;
    credits: number;
    semester: string;
    academicYear: string;
    fieldOfStudy: string;
    status: CourseStatus;
    enrolledStudents: number;
    minStudents: number;
    maxStudents: number;
}

interface GroupedCourses {
    [key: string]: {
        [fieldOfStudy: string]: OpenCourse[]
    }
}

interface OpenCourseMgmAcademicProps {
    user: User | null;
    onLogout: () => void;
}

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

export default function OpenCourseMgmAcademic({user, onLogout }: OpenCourseMgmAcademicProps) {
    // Sample data
    const sampleOpenCourses: OpenCourse[] = [
        {
            id: "1",
            subjectCode: "IT001",
            subjectName: "Nhập môn lập trình",
            credits: 3,
            semester: "1",
            academicYear: "2023-2024",
            fieldOfStudy: "Khối cơ bản",
            status: CourseStatus.OPEN,
            enrolledStudents: 45,
            minStudents: 30,
            maxStudents: 60
        },
        {
            id: "2",
            subjectCode: "IT002",
            subjectName: "Lập trình hướng đối tượng",
            credits: 4,
            semester: "1",
            academicYear: "2023-2024",
            fieldOfStudy: "Khối cơ bản",
            status: CourseStatus.WAITING,
            enrolledStudents: 25,
            minStudents: 30,
            maxStudents: 60
        },
        {
            id: "3",
            subjectCode: "IT003",
            subjectName: "Cấu trúc dữ liệu và giải thuật",
            credits: 4,
            semester: "1",
            academicYear: "2023-2024",
            fieldOfStudy: "Khối cơ bản",
            status: CourseStatus.CLOSED,
            enrolledStudents: 15,
            minStudents: 30,
            maxStudents: 60
        },
        {
            id: "4",
            subjectCode: "SE310",
            subjectName: "Công nghệ phần mềm",
            credits: 4,
            semester: "1",
            academicYear: "2023-2024",
            fieldOfStudy: "Công nghệ phần mềm",
            status: CourseStatus.OPEN,
            enrolledStudents: 40,
            minStudents: 25,
            maxStudents: 50
        },
        {
            id: "5",
            subjectCode: "CS105",
            subjectName: "Trí tuệ nhân tạo",
            credits: 3,
            semester: "2",
            academicYear: "2023-2024",
            fieldOfStudy: "Khoa học máy tính",
            status: CourseStatus.WAITING,
            enrolledStudents: 20,
            minStudents: 25,
            maxStudents: 50
        },
    ];

    // States
    const [courses, setCourses] = useState<OpenCourse[]>(sampleOpenCourses);
    const [filteredCourses, setFilteredCourses] = useState<OpenCourse[]>(sampleOpenCourses);
    const [groupedCourses, setGroupedCourses] = useState<GroupedCourses>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<OpenCourse | null>(null);
    const [availableTerms, setAvailableTerms] = useState<string[]>([]);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

    // Thêm state cho menu trạng thái
    const [statusMenuAnchor, setStatusMenuAnchor] = useState<null | HTMLElement>(null);
    const [statusMenuCourseId, setStatusMenuCourseId] = useState<string | null>(null);

    // Extract unique years and semesters
    const uniqueYears = Array.from(new Set(courses.map(c => c.academicYear)));
    const uniqueSemesters = Array.from(new Set(courses.map(c => c.semester)));

    // Effects
    useEffect(() => {
        // Set default year and semester if not set
        if (!selectedYear && uniqueYears.length > 0) setSelectedYear(uniqueYears[0]);
        if (!selectedSemester && uniqueSemesters.length > 0) setSelectedSemester(uniqueSemesters[0]);
        // Group courses by academic term and field of study
        groupCourses();
        // Extract available terms for tabs (no longer used)
        const terms = Array.from(new Set(courses.map(course => `${course.academicYear} - Học Kỳ ${course.semester}`)));
        setAvailableTerms(terms);
    }, [courses]);

    useEffect(() => {
        // Apply filters
        let result = [...courses];

        if (searchQuery) {
            result = result.filter(course =>
                course.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.subjectName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(course => course.status === statusFilter);
        }

        // Filter by selected year and semester
        if (selectedYear) {
            result = result.filter(course => course.academicYear === selectedYear);
        }
        if (selectedSemester) {
            result = result.filter(course => course.semester === selectedSemester);
        }

        setFilteredCourses(result);
        groupCourses(result);
    }, [searchQuery, statusFilter, courses, selectedYear, selectedSemester]);

    // Helper functions
    const groupCourses = (coursesToGroup = filteredCourses) => {
        const grouped: GroupedCourses = {};

        coursesToGroup.forEach(course => {
            const term = `${course.academicYear} - Học Kỳ ${course.semester}`;

            if (!grouped[term]) {
                grouped[term] = {};
            }

            if (!grouped[term][course.fieldOfStudy]) {
                grouped[term][course.fieldOfStudy] = [];
            }

            grouped[term][course.fieldOfStudy].push(course);
        });

        setGroupedCourses(grouped);
    };

    const handleChangeStatus = (courseId: string, newStatus: CourseStatus) => {
        setCourses(courses.map(course =>
            course.id === courseId ? { ...course, status: newStatus } : course
        ));
    };

    const handleDeleteCourse = (courseId: string) => {
        setConfirmDelete({ open: true, id: courseId });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id !== null) {
            setCourses(courses.filter(course => course.id !== confirmDelete.id));
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };

    const handleAddEditCourse = (course: OpenCourse) => {
        if (editMode && currentCourse) {
            // Update existing course
            setCourses(courses.map(c => c.id === course.id ? course : c));
        } else {
            // Add new course with a generated ID
            const newCourse = {
                ...course,
                id: Date.now().toString()
            };
            setCourses([...courses, newCourse]);
        }
        setOpenDialog(false);
        setCurrentCourse(null);
        setEditMode(false);
    };

    const handleOpenEditDialog = (course: OpenCourse) => {
        setCurrentCourse(course);
        setEditMode(true);
        setOpenDialog(true);
    };

    const handleStatusChipClick = (event: React.MouseEvent<HTMLElement>, courseId: string) => {
        setStatusMenuAnchor(event.currentTarget);
        setStatusMenuCourseId(courseId);
    };

    const handleStatusMenuClose = () => {
        setStatusMenuAnchor(null);
        setStatusMenuCourseId(null);
    };

    const handleStatusMenuSelect = (status: CourseStatus) => {
        if (statusMenuCourseId) {
            handleChangeStatus(statusMenuCourseId, status);
        }
        handleStatusMenuClose();
    };

    const getStatusStyle = (status: CourseStatus) => {
        switch (status) {
            case CourseStatus.OPEN:
                return { bgcolor: '#e0f7fa', color: '#00838f' };
            case CourseStatus.WAITING:
                return { bgcolor: '#fff8e1', color: '#fbc02d' };
            case CourseStatus.CLOSED:
                return { bgcolor: '#ffebee', color: '#c62828' };
            default:
                return {};
        }
    };

    // Render selected term data (now just render filteredCourses)
    const renderSelectedTermData = () => {
        if (filteredCourses.length === 0) return (
            <Typography variant="body1" sx={{ p: 3, textAlign: 'center' }}>
                Không có dữ liệu cho học kỳ này
            </Typography>
        );
        // Group by fieldOfStudy for display
        const grouped: { [field: string]: OpenCourse[] } = {};
        filteredCourses.forEach(course => {
            if (!grouped[course.fieldOfStudy]) grouped[course.fieldOfStudy] = [];
            grouped[course.fieldOfStudy].push(course);
        });
        return Object.entries(grouped).map(([fieldOfStudy, courses]) => (
            <Box key={fieldOfStudy} sx={{ mb: 6 }}>
                <Typography variant="h6" 
                sx={{
                    fontWeight: 'bold',
                    fontFamily: '"Varela Round", sans-serif',
                    color: '#1976d2',
                }}>     
                    {fieldOfStudy}
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 1, borderRadius: '8px', boxShadow: 'none', border: '1px solid #e0e0e0', minWidth: 1100, width: '100%', maxWidth: '100%' }}>
                    <Table size="small" style={{ width: '100%', tableLayout: 'fixed' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: columnWidths.subjectCode, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Mã môn học</TableCell>
                                <TableCell sx={{ minWidth: columnWidths.subjectName, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tên môn học</TableCell>
                                <TableCell sx={{ minWidth: columnWidths.credits, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Số tín chỉ</TableCell>
                                <TableCell sx={{ minWidth: columnWidths.enrolledStudents, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Số SV đăng ký</TableCell>
                                <TableCell sx={{ minWidth: columnWidths.minStudents, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tối thiểu</TableCell>
                                <TableCell sx={{ minWidth: columnWidths.maxStudents, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tối đa</TableCell>
                                <TableCell sx={{ minWidth: columnWidths.status, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Trạng thái</TableCell>
                                <TableCell sx={{ minWidth: columnWidths.actions, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow
                                    key={course.id}
                                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child td, &:last-child th': { borderBottom: 'none' } }}
                                >
                                    <TableCell sx={{ minWidth: columnWidths.subjectCode, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800 }}>{course.subjectCode}</TableCell>
                                    <TableCell sx={{ minWidth: columnWidths.subjectName, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{course.subjectName}</TableCell>
                                    <TableCell sx={{ minWidth: columnWidths.credits, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{course.credits}</TableCell>
                                    <TableCell sx={{ minWidth: columnWidths.enrolledStudents, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{course.enrolledStudents}</TableCell>
                                    <TableCell sx={{ minWidth: columnWidths.minStudents, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{course.minStudents}</TableCell>
                                    <TableCell sx={{ minWidth: columnWidths.maxStudents, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{course.maxStudents}</TableCell>
                                    <TableCell sx={{ minWidth: columnWidths.status, fontSize: '14px', fontFamily: '"Varela Round", sans-serif', p: 0 }}>
                                        <Box
                                            onClick={(e) => handleStatusChipClick(e, course.id)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                borderRadius: '20px',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                px: 2,
                                                py: 1,
                                                ...getStatusStyle(course.status),
                                                transition: 'background 0.2s',
                                            }}
                                        >
                                            <span style={{ flex: 1 }}>{course.status}</span>
                                            <ArrowDropDownIcon fontSize="small" sx={{ ml: 1, color: getStatusStyle(course.status).color }} />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ minWidth: columnWidths.actions, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                                        <IconButton size="small" onClick={() => handleOpenEditDialog(course)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteCourse(course.id)}>
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
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderTopRightRadius: '16px',
                        borderBottomRightRadius: '16px',
                        marginTop: '3.5rem',
                        flexGrow: 1,
                        minHeight: '400px',
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
                        Quản lý môn học mở trong kỳ
                    </Typography>
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} md={3.85}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo mã môn học hoặc Tên môn học"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                    fontFamily: '"Varela Round", sans-serif',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '9px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Lọc trạng thái</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
                                    label="Lọc trạng thái"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    }
                                    sx={{ 
                                        fontFamily: '"Varela Round", sans-serif',
                                        borderRadius: '9px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderRadius: '9px',
                                        }
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                fontFamily: '"Varela Round", sans-serif',
                                                borderRadius: 3,
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                    {Object.values(CourseStatus).map((status) => (
                                        <MenuItem key={status} value={status} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* New: Year and Semester selectors */}
                        <Grid item xs={6} md={1.9}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Năm học</InputLabel>
                                <Select
                                    value={selectedYear}
                                    label="Năm học"
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '9px' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                fontFamily: '"Varela Round", sans-serif',
                                                borderRadius: 3,
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    {uniqueYears.map(year => (
                                        <MenuItem key={year} value={year} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={1.9}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Học kỳ</InputLabel>
                                <Select
                                    value={selectedSemester}
                                    label="Học kỳ"
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '9px' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                display: 'flex',           
                                                flexDirection: 'column',   
                                                gap: 0.5,                   
                                                fontFamily: '"Varela Round", sans-serif',
                                                borderRadius: 3,
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="1" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ 1</MenuItem>
                                    <MenuItem value="2" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ 2</MenuItem>
                                    <MenuItem value="3" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ hè</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2.2} sx={{ textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setEditMode(false);
                                    setCurrentCourse(null);
                                    setOpenDialog(true);
                                }}
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px', boxShadow: 'none' }}
                            >
                                Thêm môn học mở
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ p: 2 }}>
                        {renderSelectedTermData()}
                    </Box>
                </Paper>
            </Box>
            {/* Add/Edit Course Dialog */}
            <CourseFormDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleAddEditCourse}
                course={currentCourse}
                isEdit={editMode}
            />
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
                    Xác nhận xóa môn học mở mở
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
                        Bạn có chắc chắn muốn xóa môn học mở này không?
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
            {/* Menu chọn trạng thái */}
            <Menu
                anchorEl={statusMenuAnchor}
                open={Boolean(statusMenuAnchor)}
                onClose={handleStatusMenuClose}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        borderRadius: 3,
                        minWidth: 200,
                        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                        p: 1,
                        
                    },
                }}
                MenuListProps={{
                    sx: {
                        p: 0,
                    },
                }}
            >
                {Object.values(CourseStatus).map((status) => (
                    <MenuItem
                        key={status}
                        selected={false}
                        onClick={() => handleStatusMenuSelect(status as CourseStatus)}
                        sx={{
                            ...getStatusStyle(status as CourseStatus),
                            fontWeight: 700,
                            borderRadius: 2,
                            mb: 0.5,
                            mx: 1,
                            my: 0.5,
                            transition: 'background 0.2s, color 0.2s',
                            '&.Mui-selected, &.Mui-selected:hover': {
                                backgroundColor: 'transparent',
                            },
                            '&:hover': {
                                bgcolor: '#c7edf2',
                                color: '#006064',
                                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
                            },
                            fontSize: '15px',
                            fontFamily: 'Varela Round, sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            
                        }}
                    >
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getStatusStyle(status as CourseStatus).color, mr: 1}} />
                        {status}
                    </MenuItem>
                ))}
            </Menu>
        </ThemeLayout>
    );
}

// Dialog component for adding or editing courses
interface CourseFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (course: OpenCourse) => void;
    course: OpenCourse | null;
    isEdit: boolean;
}

function CourseFormDialog({ open, onClose, onSave, course, isEdit }: CourseFormDialogProps) {
    const [formData, setFormData] = useState<Partial<OpenCourse>>(
        course || {
            subjectCode: "",
            subjectName: "",
            credits: 0,
            semester: "1",
            academicYear: "2023-2024",
            fieldOfStudy: "Khối cơ bản",
            status: CourseStatus.WAITING,
            enrolledStudents: 0,
            minStudents: 25,
            maxStudents: 50
        }
    );

    useEffect(() => {
        if (course) {
            setFormData(course);
        } else {
            setFormData({
                subjectCode: "",
                subjectName: "",
                credits: 0,
                semester: "1",
                academicYear: "2023-2024",
                fieldOfStudy: "Khối cơ bản",
                status: CourseStatus.WAITING,
                enrolledStudents: 0,
                minStudents: 25,
                maxStudents: 50
            });
        }
    }, [course]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSubmit = () => {
        onSave(formData as OpenCourse);
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
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
                {isEdit ? "Chỉnh sửa môn học mở" : "Thêm môn học mở"}
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
                            name="subjectCode"
                            label="Mã môn học"
                            value={formData.subjectCode}
                            onChange={handleTextChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
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
                            name="subjectName"
                            label="Tên môn học"
                            value={formData.subjectName}
                            onChange={handleTextChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{
                                borderRadius: '12px',
                                background: '#f7faff',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            name="credits"
                            label="Số tín chỉ"
                            type="number"
                            value={formData.credits}
                            onChange={handleTextChange}
                            fullWidth
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{
                                borderRadius: '12px',
                                background: '#f7faff',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                            <InputLabel sx={{ fontWeight: 500 }}>Học kỳ</InputLabel>
                            <Select
                                name="semester"
                                value={formData.semester}
                                onChange={handleSelectChange}
                                label="Học kỳ"
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8' }  }}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 4,
                                        sx: {
                                            borderRadius: 3,
                                            minWidth: 200,
                                            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                            p: 1,
                                        },
                                    },
                                    MenuListProps: {
                                        sx: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5,
                                            fontFamily: '"Varela Round", sans-serif',
                                            borderRadius: 3,
                                            p: 0,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="1" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ 1</MenuItem>
                                <MenuItem value="2" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ 2</MenuItem>
                                <MenuItem value="3" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ hè</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                            <InputLabel sx={{ fontWeight: 500 }}>Năm học</InputLabel>
                            <Select
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleSelectChange}
                                label="Năm học"
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8'  } }}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 4,
                                        sx: {
                                            borderRadius: 3,
                                            minWidth: 200,
                                            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                            p: 1,
                                        },
                                    },
                                    MenuListProps: {
                                        sx: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5,
                                            fontFamily: '"Varela Round", sans-serif',
                                            borderRadius: 3,
                                            p: 0,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="2022-2023" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>2022-2023</MenuItem>
                                <MenuItem value="2023-2024" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>2023-2024</MenuItem>
                                <MenuItem value="2024-2025" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>2024-2025</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                            <InputLabel sx={{ fontWeight: 500 }}>Thuộc khối</InputLabel>
                            <Select
                                name="fieldOfStudy"
                                value={formData.fieldOfStudy}
                                onChange={handleSelectChange}
                                label="Thuộc khối"
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8'  } }}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 4,
                                        sx: {
                                            borderRadius: 3,
                                            minWidth: 200,
                                            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                            p: 1,
                                        },
                                    },
                                    MenuListProps: {
                                        sx: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5,
                                            fontFamily: '"Varela Round", sans-serif',
                                            borderRadius: 3,
                                            p: 0,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="Khối cơ bản" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Khối cơ bản</MenuItem>
                                <MenuItem value="Công nghệ phần mềm" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Công nghệ phần mềm</MenuItem>
                                <MenuItem value="Khoa học máy tính" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Khoa học máy tính</MenuItem>
                                <MenuItem value="Hệ thống thông tin" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Hệ thống thông tin</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1, fontWeight: 600, color: '#4299e1', fontSize: '1.1rem' }}>Thông tin đăng ký</Divider>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            name="enrolledStudents"
                            label="Số SV đã đăng ký"
                            type="number"
                            value={formData.enrolledStudents}
                            onChange={handleTextChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            sx={{
                                borderRadius: '12px',
                                background: '#f7faff',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            name="minStudents"
                            label="Số SV tối thiểu"
                            type="number"
                            value={formData.minStudents}
                            onChange={handleTextChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            sx={{
                                borderRadius: '12px',
                                background: '#f7faff',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            name="maxStudents"
                            label="Số SV tối đa"
                            type="number"
                            value={formData.maxStudents}
                            onChange={handleTextChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            sx={{
                                borderRadius: '12px',
                                background: '#f7faff',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                            <InputLabel sx={{ fontWeight: 500 }}>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleSelectChange}
                                label="Trạng thái"
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8'  } }}
                                MenuProps={{
                                    PaperProps: {
                                        elevation: 4,
                                        sx: {
                                            borderRadius: 3,
                                            minWidth: 200,
                                            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                            p: 1,
                                        },
                                    },
                                    MenuListProps: {
                                        sx: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.5,
                                            fontFamily: '"Varela Round", sans-serif',
                                            borderRadius: 3,
                                            p: 0,
                                        },
                                    },
                                }}
                            >
                                {Object.values(CourseStatus).map((status) => (
                                    <MenuItem key={status} value={status} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                <Button onClick={onClose} color="primary">
                    Hủy
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    {isEdit ? "Cập nhật" : "Thêm môn học mở"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}