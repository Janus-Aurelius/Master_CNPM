import {ThemeLayout} from "../styles/theme_layout.tsx";
import {User} from "../types";
import { useState, useEffect } from "react";
import UserInfo from "../components/UserInfo";
import {
    Button, 
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
    Grid,
    TextField,
    Typography,
    DialogContent,
    Box,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Snackbar,
    Alert,
    MenuItem,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import { programApi, ProgramSchedule } from "../api_clients/academic/programApi";
import { studentApi, Major } from "../api_clients/academic/studentApi";
import { courseApi } from "../api_clients/academic/courseApi";
import { semesterApi, Semester } from "../api_clients/academic/semesterApi";
import { Subject } from "../types/course";

interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

export default function ProgramMgmAcademic({ user, onLogout }: AcademicPageProps) {
    const [programs, setPrograms] = useState<ProgramSchedule[]>([]);
    const [majors, setMajors] = useState<Major[]>([]);
    const [courses, setCourses] = useState<Subject[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProgram, setCurrentProgram] = useState<ProgramSchedule>({
        id: 0,
        maNganh: "",
        maMonHoc: "",
        maHocKy: "",
        ghiChu: ""    });
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'error'
    });
    const [oldKeys, setOldKeys] = useState<{ maNganh: string, maMonHoc: string, maHocKy: string } | null>(null);
    
    // Search states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMajor, setSelectedMajor] = useState<string>("all");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedSemester, setSelectedSemester] = useState<string>("all");

    // Filter programs based on search criteria
    const filteredPrograms = programs.filter(program => {
        const matchesSearch = searchTerm === "" || 
            program.maNganh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.maMonHoc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.tenNganh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.tenKhoa?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesMajor = selectedMajor === "all" || program.maNganh === selectedMajor;
        const matchesDepartment = selectedDepartment === "all" || program.tenKhoa === selectedDepartment;
        const matchesSemester = selectedSemester === "all" || program.maHocKy === selectedSemester;
        
        return matchesSearch && matchesMajor && matchesDepartment && matchesSemester;
    });    // Get unique values for filter dropdowns
    const uniqueMajors = Array.from(new Set(programs.map(p => p.maNganh).filter(Boolean)));
    const uniqueDepartments = Array.from(new Set(programs.map(p => p.tenKhoa).filter(Boolean)));
    const uniqueSemesters = Array.from(new Set(programs.map(p => p.maHocKy).filter(Boolean)));

    // Group programs by major (maNganh)
    const groupedPrograms = filteredPrograms.reduce((acc, program) => {
        const key = program.maNganh;
        if (!acc[key]) {
            acc[key] = {
                maNganh: program.maNganh,
                tenNganh: program.tenNganh || '',
                tenKhoa: program.tenKhoa || '',
                programs: []
            };
        }
        acc[key].programs.push(program);
        return acc;
    }, {} as Record<string, {
        maNganh: string;
        tenNganh: string;
        tenKhoa: string;
        programs: ProgramSchedule[];
    }>);    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await programApi.getPrograms();            const formattedPrograms = response.map((program: any) => ({
                id: program.id || 0,
                maNganh: program.maNganh || program.manganh || '',
                maMonHoc: program.maMonHoc || program.mamonhoc || '',
                maHocKy: program.maHocKy || program.mahocky || '',
                ghiChu: program.ghiChu || program.ghichu || '',
                thoiGianBatDau: program.thoiGianBatDau || program.thoigianbatdau || '',
                thoiGianKetThuc: program.thoiGianKetThuc || program.thoigianketthuc || '',
                tenKhoa: program.tenKhoa || program.tenkhoa || '',
                tenNganh: program.tenNganh || program.tennganh || ''
            }));
            setPrograms(formattedPrograms);
            setError(null);
        } catch (err) {
            setError('Failed to fetch programs');
        } finally {
            setLoading(false);
        }
    };    const fetchMajors = async () => {
        try {
            const majorsList = await studentApi.getMajors();
            const formattedMajors = majorsList.map(major => ({
                ...major,
                maNganh: major.maNganh || major.manganh,
                tenNganh: major.tenNganh || major.tennganh,
                maKhoa: major.maKhoa || major.makhoa,
                tenKhoa: major.tenKhoa || major.tenkhoa
            }));
            setMajors(formattedMajors);
        } catch (err) {
            console.error('Failed to fetch majors:', err);
        }
    };

    const fetchCourses = async () => {
        try {
            const coursesList = await courseApi.getCourses();
            setCourses(coursesList);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        }
    };

    const fetchSemesters = async () => {
        try {
            const semestersList = await semesterApi.getSemesters();
            setSemesters(semestersList);
        } catch (err) {
            console.error('Failed to fetch semesters:', err);
        }
    };    useEffect(() => {
        fetchPrograms();
        fetchMajors();
        fetchCourses();
        fetchSemesters();
    }, []);

    // Debug log cho programs state
    useEffect(() => {
        console.log('Current programs state:', programs);
    }, [programs]);

    const handleOpenDialog = (edit: boolean = false, program?: ProgramSchedule) => {
        setIsEditing(edit);
        if (edit && program) {
            setCurrentProgram(program);
            setOldKeys({
                maNganh: program.maNganh,
                maMonHoc: program.maMonHoc,
                maHocKy: program.maHocKy
            });
        } else {
            setCurrentProgram({
                id: 0,
                maNganh: "",
                maMonHoc: "",
                maHocKy: "",
                ghiChu: ""
            });
            setOldKeys(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSaveProgram = async () => {
        try {
            // Validate maHocKy exists in HOCKYNAMHOC
            const isValidSemester = await programApi.validateSemester(currentProgram.maHocKy);
            if (!isValidSemester) {
                setSnackbar({
                    open: true,
                    message: 'Mã học kỳ không tồn tại trong hệ thống',
                    severity: 'error'
                });
                return;
            }

            if (isEditing && oldKeys) {
                await programApi.updateProgram(
                    oldKeys.maNganh,
                    oldKeys.maMonHoc,
                    oldKeys.maHocKy,
                    currentProgram
                );
                await fetchPrograms();
                setSnackbar({
                    open: true,
                    message: 'Cập nhật chương trình học thành công!',
                    severity: 'success'
                });
            } else {
                await programApi.createProgram(currentProgram);
                await fetchPrograms();
                setSnackbar({
                    open: true,
                    message: 'Thêm chương trình học thành công!',
                    severity: 'success'
                });
            }
            handleCloseDialog();        } catch (err: any) {
            console.log('Full error object:', err);
            console.log('Error response status:', err.response?.status);
            console.log('Error response data:', err.response?.data);
            console.log('Error response message:', err.response?.data?.message);
            
            let errorMessage = 'Có lỗi xảy ra khi lưu chương trình học';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
            console.error('Complete error:', err);
        }
    };

    const handleDeleteProgram = (id: number) => {
        setConfirmDelete({ open: true, id });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.id !== null) {
            try {
                const programToDelete = programs.find(p => p.id === confirmDelete.id);
                if (!programToDelete) {
                    setSnackbar({
                        open: true,
                        message: 'Không tìm thấy chương trình học cần xóa',
                        severity: 'error'
                    });
                    return;
                }

                if (!programToDelete.maNganh || !programToDelete.maMonHoc || !programToDelete.maHocKy) {
                    setSnackbar({
                        open: true,
                        message: 'Thông tin chương trình học không hợp lệ',
                        severity: 'error'
                    });
                    return;
                }

                await programApi.deleteProgram(
                    programToDelete.maNganh,
                    programToDelete.maMonHoc,
                    programToDelete.maHocKy
                );
                
                setPrograms(programs.filter(
                    p =>
                        !(
                            p.maNganh === programToDelete.maNganh &&
                            p.maMonHoc === programToDelete.maMonHoc &&
                            p.maHocKy === programToDelete.maHocKy
                        )
                ));
                setSnackbar({
                    open: true,
                    message: 'Xóa chương trình học thành công',
                    severity: 'success'
                });
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi xóa chương trình học';
                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
                });
                console.error(err);
            }
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'maNganh') {
            // Find selected major to get additional info
            const selectedMajor = majors.find(major => 
                (major.maNganh || major.manganh) === value
            );
            
            setCurrentProgram({
                ...currentProgram,
                [name]: value,
                tenNganh: selectedMajor ? (selectedMajor.tenNganh || selectedMajor.tennganh) : '',
                tenKhoa: selectedMajor ? (selectedMajor.tenKhoa || selectedMajor.tenkhoa) : ''
            });
        } else if (name === 'maMonHoc') {
            // Find selected course to get additional info
            const selectedCourse = courses.find(course => course.maMonHoc === value);
            
            setCurrentProgram({
                ...currentProgram,
                [name]: value,
                tenMonHoc: selectedCourse ? selectedCourse.tenMonHoc : ''
            });
        } else {
            setCurrentProgram({
                ...currentProgram,
                [name]: value
            });
        }
    };

    // Format date to display in dd/mm/yyyy format
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
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
                        minHeight: '1rem',
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
                        }}                    >
                        Danh sách chương trình học
                    </Typography>                      {/* Search and Filter Controls */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo mã ngành, môn học, tên ngành..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                    }
                                }}
                            />
                        </Grid>                        <Grid item xs={12} md={2}>
                            <TextField
                                select
                                label="Mã ngành"
                                value={selectedMajor}
                                onChange={(e) => setSelectedMajor(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{ 
                                    fontFamily: '"Varela Round", sans-serif',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '9px',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '9px',
                                    }
                                }}
                                SelectProps={{
                                    MenuProps: {
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
                                    }
                                }}
                            >
                                <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                {uniqueMajors.map((major) => (
                                    <MenuItem key={major} value={major} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                        {major}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>                        <Grid item xs={12} md={2}>
                            <TextField
                                select
                                label="Khoa"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{ 
                                    fontFamily: '"Varela Round", sans-serif',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '9px',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '9px',
                                    }
                                }}
                                SelectProps={{
                                    MenuProps: {
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
                                    }
                                }}
                            >
                                <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                {uniqueDepartments.map((dept) => (
                                    <MenuItem key={dept} value={dept} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                        {dept}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>                        <Grid item xs={12} md={2}>
                            <TextField
                                select
                                label="Học kỳ"
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                size="small"
                                fullWidth
                                sx={{ 
                                    fontFamily: '"Varela Round", sans-serif',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '9px',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '9px',
                                    }
                                }}
                                SelectProps={{
                                    MenuProps: {
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
                                    }
                                }}
                            >
                                <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                {uniqueSemesters.map((semester) => (
                                    <MenuItem key={semester} value={semester} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                        {semester}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog(false)}
                                fullWidth
                                sx={{ 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    borderRadius: '9px',
                                    height: '40px'
                                }}
                            >
                                Thêm mới
                            </Button>
                        </Grid>
                    </Grid>
                    {loading ? (
                        <Typography sx={{ textAlign: 'center', mt: 4 }}>Đang tải dữ liệu...</Typography>
                    ) : error ? (
                        <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>
                    ) : programs.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', mt: 4 }}>Không có dữ liệu chương trình học</Typography>                    ) : (
                        <Box sx={{ 
                            flexGrow: 1, 
                            overflow: 'auto',
                            maxHeight: 'calc(100vh - 20rem)',
                            '&::-webkit-scrollbar': {
                                width: '8px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: '4px'
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderRadius: '4px'
                            }
                        }}>
                            {Object.values(groupedPrograms).map((majorGroup, index) => (
                                <Accordion
                                    key={majorGroup.maNganh || `major-${index}`}
                                    sx={{
                                        mb: 2,
                                        borderRadius: '12px !important',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        '&:before': { display: 'none' },
                                        '&.Mui-expanded': {
                                            margin: '0 0 16px 0'
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '12px',
                                            '&.Mui-expanded': {
                                                borderBottomLeftRadius: '0px',
                                                borderBottomRightRadius: '0px'
                                            },
                                            '& .MuiAccordionSummary-content': {
                                                alignItems: 'center'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <SchoolIcon sx={{ mr: 2, color: '#6ebab6', fontSize: '28px' }} />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: '"Varela Round", sans-serif',
                                                        fontWeight: 700,
                                                        color: '#2c5282',
                                                        fontSize: '18px'
                                                    }}
                                                >
                                                    {majorGroup.maNganh} - {majorGroup.tenNganh}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: '"Varela Round", sans-serif',
                                                        color: '#4a5568',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    Khoa: {majorGroup.tenKhoa}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={`${majorGroup.programs.length} môn học`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#6ebab6',
                                                    color: 'white',
                                                    fontFamily: '"Varela Round", sans-serif',
                                                    fontWeight: 600,
                                                    mr: 2
                                                }}
                                            />
                                        </Box>
                                    </AccordionSummary>                                    <AccordionDetails sx={{ p: 0 }}>
                                        <TableContainer sx={{ borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                                            <Table size="small" sx={{ borderRadius: '0 0 12px 12px' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ 
                                                            fontWeight: 'bold', 
                                                            color: '#FFFFFF', 
                                                            fontSize: '16px', 
                                                            fontFamily: '"Varela Round", sans-serif', 
                                                            backgroundColor: '#4a90e2' 
                                                        }}>
                                                            <BookIcon sx={{ mr: 1, fontSize: '18px' }} />
                                                            Mã môn học
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', backgroundColor: '#4a90e2' }}>Mã học kỳ</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', backgroundColor: '#4a90e2' }}>Thời gian</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', backgroundColor: '#4a90e2' }}>Ghi chú</TableCell>
                                                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#4a90e2' }}>Thao tác</TableCell>
                                                    </TableRow>
                                                </TableHead>                                                <TableBody>
                                                    {majorGroup.programs.map((program, programIndex) => (
                                                        <TableRow 
                                                            key={program.id || `program-${programIndex}`}
                                                            sx={{
                                                                '&:hover': {
                                                                    backgroundColor: '#f0f8ff',
                                                                },
                                                                '&:nth-of-type(even)': {
                                                                    backgroundColor: '#fafafa'
                                                                },
                                                                '&:last-child td': {
                                                                    borderBottom: 'none'
                                                                }
                                                            }}
                                                        >
                                                            <TableCell sx={{ fontSize: '15px', fontFamily: '"Varela Round", sans-serif', fontWeight: 600, color: '#2d3748' }}>
                                                                {program.maMonHoc}
                                                            </TableCell>
                                                            <TableCell sx={{ fontSize: '15px', fontFamily: '"Varela Round", sans-serif', color: '#4a5568' }}>
                                                                {program.maHocKy}
                                                            </TableCell>
                                                            <TableCell sx={{ fontSize: '13px', fontFamily: '"Varela Round", sans-serif' }}>
                                                                {program.thoiGianBatDau && program.thoiGianKetThuc ? (
                                                                    <Box>
                                                                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#2d3748' }}>
                                                                            <strong>Bắt đầu:</strong> {formatDate(program.thoiGianBatDau)}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#2d3748' }}>
                                                                            <strong>Kết thúc:</strong> {formatDate(program.thoiGianKetThuc)}
                                                                        </Typography>
                                                                    </Box>
                                                                ) : (
                                                                    <Typography variant="body2" sx={{ fontSize: '12px', color: '#a0aec0' }}>
                                                                        Chưa có thông tin
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell sx={{ fontSize: '15px', fontFamily: '"Varela Round", sans-serif', color: '#4a5568' }}>
                                                                {program.ghiChu || '-'}
                                                            </TableCell>
                                                            <TableCell sx={{ textAlign: 'center' }}>
                                                                <IconButton 
                                                                    size="small" 
                                                                    color="primary"
                                                                    onClick={() => handleOpenDialog(true, program)}
                                                                    sx={{ mr: 0.5 }}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                                <IconButton 
                                                                    size="small" 
                                                                    color="error"
                                                                    onClick={() => handleDeleteProgram(program.id)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        {majorGroup.programs.length === 0 && (
                                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                                <Typography sx={{ 
                                                    fontFamily: '"Varela Round", sans-serif', 
                                                    color: '#a0aec0',
                                                    fontSize: '14px' 
                                                }}>
                                                    Không có môn học nào trong ngành này
                                                </Typography>
                                            </Box>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                            
                            {Object.keys(groupedPrograms).length === 0 && (
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
                                    <SchoolIcon sx={{ fontSize: '48px', color: '#a0aec0', mb: 2 }} />
                                    <Typography sx={{ 
                                        fontFamily: '"Varela Round", sans-serif', 
                                        color: '#4a5568',
                                        fontSize: '16px' 
                                    }}>
                                        Không tìm thấy chương trình học nào
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    )}
                </Paper>
            </Box>
            {/* Dialog for adding/editing programs */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth
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
                    {isEditing ? "Chỉnh sửa chương trình" : "Thêm chương trình mới"}
                </DialogTitle>
                <DialogContent dividers sx={{
                    border: 'none',
                    px: 4,
                    pt: 2,
                    pb: 0,
                    background: 'transparent',
                }}>                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="maNganh"
                                label="Mã ngành"
                                fullWidth
                                variant="outlined"
                                select
                                value={currentProgram.maNganh}
                                onChange={handleInputChange}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                                SelectProps={{
                                    MenuProps: {
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
                                    }
                                }}
                            >
                                <MenuItem value="" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                    <em>Chọn ngành</em>
                                </MenuItem>
                                {majors.map((major) => (
                                    <MenuItem 
                                        key={major.maNganh || major.manganh} 
                                        value={major.maNganh || major.manganh}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}
                                    >
                                        {major.maNganh || major.manganh} - {major.tenNganh || major.tennganh}
                                    </MenuItem>
                                ))}
                            </TextField>                        </Grid>                        <Grid item xs={12} md={6}>
                            <TextField
                                name="maMonHoc"
                                label="Mã môn học"
                                fullWidth
                                variant="outlined"
                                select
                                value={currentProgram.maMonHoc}
                                onChange={handleInputChange}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                                SelectProps={{
                                    MenuProps: {
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
                                    }
                                }}
                            >
                                <MenuItem value="" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                    <em>Chọn môn học</em>
                                </MenuItem>
                                {courses.map((course) => (
                                    <MenuItem 
                                        key={course.maMonHoc} 
                                        value={course.maMonHoc}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}
                                    >
                                        {course.maMonHoc} - {course.tenMonHoc}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>                        <Grid item xs={12} md={6}>
                            <TextField
                                name="maHocKy"
                                label="Mã học kỳ"
                                fullWidth
                                variant="outlined"
                                select
                                value={currentProgram.maHocKy}
                                onChange={handleInputChange}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                                SelectProps={{
                                    MenuProps: {
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
                                    }
                                }}
                            >
                                <MenuItem value="" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                    <em>Chọn học kỳ</em>
                                </MenuItem>
                                {semesters.map((semester) => (
                                    <MenuItem 
                                        key={semester.semesterId} 
                                        value={semester.semesterId}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}
                                    >
                                        {semester.semesterId} - HK{semester.termNumber} - {semester.academicYear}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>                        {isEditing && currentProgram.tenNganh && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Tên ngành"
                                    fullWidth
                                    variant="outlined"
                                    value={currentProgram.tenNganh}
                                    InputProps={{ readOnly: true }}
                                    sx={{
                                        borderRadius: '12px',
                                        background: '#f0f8ff',
                                        '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                        '& .MuiInputLabel-root': { fontWeight: 500, color: '#2e7d32' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                                        '& .MuiInputBase-input': { color: '#2e7d32', fontWeight: 600 }
                                    }}
                                />
                            </Grid>
                        )}
                        {!isEditing && currentProgram.tenNganh && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Tên ngành"
                                    fullWidth
                                    variant="outlined"
                                    value={currentProgram.tenNganh}
                                    InputProps={{ readOnly: true }}
                                    sx={{
                                        borderRadius: '12px',
                                        background: '#f0f8ff',
                                        '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                        '& .MuiInputLabel-root': { fontWeight: 500, color: '#2e7d32' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                                        '& .MuiInputBase-input': { color: '#2e7d32', fontWeight: 600 }
                                    }}
                                />
                            </Grid>
                        )}
                        {!isEditing && currentProgram.tenMonHoc && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Tên môn học"
                                    fullWidth
                                    variant="outlined"
                                    value={currentProgram.tenMonHoc}
                                    InputProps={{ readOnly: true }}
                                    sx={{
                                        borderRadius: '12px',
                                        background: '#f0f8ff',
                                        '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                        '& .MuiInputLabel-root': { fontWeight: 500, color: '#1976d2' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                                        '& .MuiInputBase-input': { color: '#1976d2', fontWeight: 600 }
                                    }}
                                />
                            </Grid>
                        )}
                        {isEditing && currentProgram.tenKhoa && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Tên khoa"
                                    fullWidth
                                    variant="outlined"
                                    value={currentProgram.tenKhoa}
                                    InputProps={{ readOnly: true }}
                                    sx={{
                                        borderRadius: '12px',
                                        background: '#f0f8ff',
                                        '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                        '& .MuiInputLabel-root': { fontWeight: 500, color: '#1976d2' },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#90caf9' },
                                        '& .MuiInputBase-input': { color: '#1976d2', fontWeight: 600 }
                                    }}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} md={12}>
                            <TextField
                                name="ghiChu"
                                label="Ghi chú"
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                value={currentProgram.ghiChu}
                                onChange={handleInputChange}
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
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} sx={{ mr: 1 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSaveProgram} variant="contained" color="primary">
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Confirmation Dialog for Delete */}
            <Dialog
                open={confirmDelete.open}
                onClose={handleCancelDelete}
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
                    fontSize: '1.5rem',
                    color: '#4c4c4c',
                    textAlign: 'center',
                    pb: 0,
                    pt: 3
                }}>
                    Xác nhận xóa
                </DialogTitle>
                <DialogContent sx={{ px: 4, pt: 2, pb: 0 }}>
                    <Typography>
                        Bạn có chắc chắn muốn xóa chương trình này không?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCancelDelete} sx={{ mr: 1 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeLayout>
    );
}