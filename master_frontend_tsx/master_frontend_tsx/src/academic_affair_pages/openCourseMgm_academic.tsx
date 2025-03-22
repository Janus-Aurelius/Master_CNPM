import { SelectChangeEvent } from '@mui/material/Select';
import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import {
    Box, Paper, TextField, Typography, Tabs, Tab, Button,
    Select, MenuItem, FormControl, InputLabel, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, Stack, Divider, Grid, InputAdornment
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

// Define enums
enum CourseStatus {
    OPEN = "Mở lớp (đủ sinh viên)",
    WAITING = "Chờ mở lớp (thiếu sinh viên)",
    CLOSED = "Không mở lớp (quá ít sinh viên)"
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

export default function OpenCourseMgmAcademic({onLogout }: OpenCourseMgmAcademicProps) {
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
    const [selectedTermTab, setSelectedTermTab] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<OpenCourse | null>(null);
    const [availableTerms, setAvailableTerms] = useState<string[]>([]);

    // Effects
    useEffect(() => {
        // Group courses by academic term and field of study
        groupCourses();
        // Extract available terms for tabs
        const terms = Array.from(new Set(courses.map(course => `${course.academicYear} - Học kỳ ${course.semester}`)));
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

        setFilteredCourses(result);
        groupCourses(result);
    }, [searchQuery, statusFilter, courses]);

    // Helper functions
    const groupCourses = (coursesToGroup = filteredCourses) => {
        const grouped: GroupedCourses = {};

        coursesToGroup.forEach(course => {
            const term = `${course.academicYear} - Học kỳ ${course.semester}`;

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
        setCourses(courses.filter(course => course.id !== courseId));
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

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTermTab(newValue);
    };

    const getStatusColor = (status: CourseStatus) => {
        switch (status) {
            case CourseStatus.OPEN:
                return "success";
            case CourseStatus.WAITING:
                return "warning";
            case CourseStatus.CLOSED:
                return "error";
            default:
                return "default";
        }
    };

    // Render selected term data
    const renderSelectedTermData = () => {
        if (availableTerms.length === 0) return null;

        const selectedTerm = availableTerms[selectedTermTab];
        const termData = groupedCourses[selectedTerm];

        if (!termData) return (
            <Typography variant="body1" sx={{ p: 3, textAlign: 'center' }}>
                Không có dữ liệu cho học kỳ này
            </Typography>
        );

        return Object.entries(termData).map(([fieldOfStudy, courses]) => (
            <Box key={fieldOfStudy} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, backgroundColor: '#f5f5f5', p: 1 }}>
                    {fieldOfStudy}
                </Typography>
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                                <TableCell>Mã học phần</TableCell>
                                <TableCell>Tên học phần</TableCell>
                                <TableCell>Số tín chỉ</TableCell>
                                <TableCell>Số SV đăng ký</TableCell>
                                <TableCell>Tối thiểu</TableCell>
                                <TableCell>Tối đa</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id} hover>
                                    <TableCell>{course.subjectCode}</TableCell>
                                    <TableCell>{course.subjectName}</TableCell>
                                    <TableCell>{course.credits}</TableCell>
                                    <TableCell>{course.enrolledStudents}</TableCell>
                                    <TableCell>{course.minStudents}</TableCell>
                                    <TableCell>{course.maxStudents}</TableCell>
                                    <TableCell>
                                        <FormControl size="small">
                                            <Select
                                                value={course.status}
                                                onChange={(e: SelectChangeEvent) => handleChangeStatus(course.id, e.target.value as CourseStatus)}
                                                variant="outlined"
                                                sx={{ minWidth: 200 }}
                                                renderValue={(value) => (
                                                    <Chip
                                                        label={value}
                                                        size="small"
                                                        color={getStatusColor(value as CourseStatus)}
                                                    />
                                                )}
                                            >
                                                {Object.values(CourseStatus).map((status) => (
                                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="right">
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
            <Stack spacing={3}>
                <Paper sx={{ p: 2 }} elevation={2}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 3 }}>
                        Quản lý môn học mở trong kỳ
                    </Typography>

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo mã học phần hoặc tên học phần"
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
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
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
                                >
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    {Object.values(CourseStatus).map((status) => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setEditMode(false);
                                    setCurrentCourse(null);
                                    setOpenDialog(true);
                                }}
                            >
                                Thêm học phần mở
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper elevation={2}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={selectedTermTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {availableTerms.map((term, index) => (
                                <Tab key={term} label={term} id={`term-tab-${index}`} />
                            ))}
                        </Tabs>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        {renderSelectedTermData()}
                    </Box>
                </Paper>
            </Stack>

            {/* Add/Edit Course Dialog */}
            <CourseFormDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleAddEditCourse}
                course={currentCourse}
                isEdit={editMode}
            />
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEdit ? "Chỉnh sửa học phần" : "Thêm học phần mở"}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name="subjectCode"
                            label="Mã học phần"
                            value={formData.subjectCode}
                            onChange={handleTextChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name="subjectName"
                            label="Tên học phần"
                            value={formData.subjectName}
                            onChange={handleTextChange}
                            fullWidth
                            margin="normal"
                            required
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
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Học kỳ</InputLabel>
                            <Select
                                name="semester"
                                value={formData.semester}
                                onChange={handleSelectChange}
                                label="Học kỳ"
                            >
                                <MenuItem value="1">Học kỳ 1</MenuItem>
                                <MenuItem value="2">Học kỳ 2</MenuItem>
                                <MenuItem value="3">Học kỳ hè</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Năm học</InputLabel>
                            <Select
                                name="academicYear"
                                value={formData.academicYear}
                                onChange={handleSelectChange}
                                label="Năm học"
                            >
                                <MenuItem value="2022-2023">2022-2023</MenuItem>
                                <MenuItem value="2023-2024">2023-2024</MenuItem>
                                <MenuItem value="2024-2025">2024-2025</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Thuộc khối</InputLabel>
                            <Select
                                name="fieldOfStudy"
                                value={formData.fieldOfStudy}
                                onChange={handleSelectChange}
                                label="Thuộc khối"
                            >
                                <MenuItem value="Khối cơ bản">Khối cơ bản</MenuItem>
                                <MenuItem value="Công nghệ phần mềm">Công nghệ phần mềm</MenuItem>
                                <MenuItem value="Khoa học máy tính">Khoa học máy tính</MenuItem>
                                <MenuItem value="Hệ thống thông tin">Hệ thống thông tin</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }}>Thông tin đăng ký</Divider>
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
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleSelectChange}
                                label="Trạng thái"
                            >
                                {Object.values(CourseStatus).map((status) => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {isEdit ? "Cập nhật" : "Thêm học phần"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}