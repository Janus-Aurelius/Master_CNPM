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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { programApi, ProgramSchedule } from "../api_clients/academic/programApi";
import { studentApi, Major } from "../api_clients/academic/studentApi";
import { semesterApi, Semester } from "../api_clients/academic/semesterApi";
import { courseApi } from "../api_clients/academic/courseApi";
import { Subject } from "../types/course";

interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

export default function ProgramMgmAcademic({ user, onLogout }: AcademicPageProps) {
    const [programs, setPrograms] = useState<ProgramSchedule[]>([]);
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
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; maNganh?: string; maMonHoc?: string; maHocKy?: string }>({ open: false });
    const [snackbar, setSnackbar] = useState<{
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

    // Dropdown data states
    const [majors, setMajors] = useState<Major[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [courses, setCourses] = useState<Subject[]>([]);

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
    });

    // Get unique values for filter dropdowns
    const uniqueMajors = Array.from(new Set(programs.map(p => p.maNganh).filter(Boolean)));
    const uniqueDepartments = Array.from(new Set(programs.map(p => p.tenKhoa).filter(Boolean)));
    const uniqueSemesters = Array.from(new Set(programs.map(p => p.maHocKy).filter(Boolean)));

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await programApi.getPrograms();
            const formattedPrograms = response.map((program: any) => ({
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
            // Lọc unique theo tổ hợp maNganh, maMonHoc, maHocKy
            const uniquePrograms = Array.from(
                new Map(formattedPrograms.map(p => [`${p.maNganh}-${p.maMonHoc}-${p.maHocKy}`, p])).values()
            );
            setPrograms(uniquePrograms);
            setError(null);
        } catch (err) {
            setError('Failed to fetch programs');
        } finally {
            setLoading(false);
        }
    };    // Fetch dropdown data
    const fetchDropdownData = async () => {
        try {
            const [majorsResponse, semestersResponse, coursesResponse] = await Promise.all([
                studentApi.getMajors(),
                semesterApi.getSemesters(),
                courseApi.getCourses()
            ]);
            
            console.log('Majors API response:', majorsResponse); // Debug log
            console.log('Courses API response:', coursesResponse); // Debug log
            setMajors(majorsResponse);
            setSemesters(semestersResponse);
            setCourses(coursesResponse);
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
        }
    };

    useEffect(() => {
        fetchPrograms();
        fetchDropdownData();
    }, []);

    // Debug log cho programs state
    useEffect(() => {
        console.log('Current programs state:', programs);
    }, [programs]);

    // Debug log cho filteredPrograms state
    useEffect(() => {
        console.log('filteredPrograms to render:', filteredPrograms.length, filteredPrograms);
    }, [filteredPrograms]);

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

    const handleDeleteProgram = (maNganh: string, maMonHoc: string, maHocKy: string) => {
        setConfirmDelete({ open: true, maNganh, maMonHoc, maHocKy });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.maNganh && confirmDelete.maMonHoc && confirmDelete.maHocKy) {
            const programToDelete = programs.find(
                p => p.maNganh === confirmDelete.maNganh &&
                     p.maMonHoc === confirmDelete.maMonHoc &&
                     p.maHocKy === confirmDelete.maHocKy
            );
            console.log('[FRONTEND DELETE] Bắt đầu xóa:', programToDelete, 'Thời điểm:', new Date().toISOString());
            try {
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
                await fetchPrograms();
                setSnackbar({
                    open: true,
                    message: 'Xóa chương trình học thành công',
                    severity: 'success'
                });
            } catch (err: any) {
                console.error('[DELETE PROGRAM] Error:', err);
                const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi xóa chương trình học';
                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
                });
            }
        }
        setConfirmDelete({ open: false });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false });
    };    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentProgram({
            ...currentProgram,
            [name]: value
        });
    };    const handleSelectChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setCurrentProgram({
            ...currentProgram,
            [name]: value
        });
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
                        }}                    >
                        Danh sách chương trình học
                    </Typography>
                      {/* Search and Filter Controls */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px'
                                    }
                                }}
                            />
                        </Grid>                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small" sx={{ 
                                background: '#ffffff', 
                                borderRadius: '12px' 
                            }}>
                                <InputLabel sx={{ fontWeight: 500 }}>Mã ngành</InputLabel>
                                <Select
                                    value={selectedMajor}
                                    label="Mã ngành"
                                    onChange={(e) => setSelectedMajor(e.target.value)}
                                    sx={{ 
                                        fontFamily: '"Varela Round", sans-serif', 
                                        borderRadius: '12px', 
                                        '& .MuiOutlinedInput-notchedOutline': { 
                                            borderRadius: '12px', 
                                            borderColor: '#d8d8d8' 
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
                                    {uniqueMajors.map((major) => (
                                        <MenuItem key={major} value={major} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                            {major}
                                        </MenuItem>
                                    ))}
                                </Select>                            </FormControl>
                        </Grid>                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small" sx={{ 
                                background: '#ffffff', 
                                borderRadius: '12px' 
                            }}>
                                <InputLabel sx={{ fontWeight: 500 }}>Khoa</InputLabel>
                                <Select
                                    value={selectedDepartment}
                                    label="Khoa"
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    sx={{ 
                                        fontFamily: '"Varela Round", sans-serif', 
                                        borderRadius: '12px', 
                                        '& .MuiOutlinedInput-notchedOutline': { 
                                            borderRadius: '12px', 
                                            borderColor: '#d8d8d8' 
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
                                    {uniqueDepartments.map((dept) => (
                                        <MenuItem key={dept} value={dept} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                            {dept}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>                        </Grid>                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small" sx={{ 
                                background: '#ffffff', 
                                borderRadius: '12px' 
                            }}>
                                <InputLabel sx={{ fontWeight: 500 }}>Học kỳ</InputLabel>
                                <Select
                                    value={selectedSemester}
                                    label="Học kỳ"
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    sx={{ 
                                        fontFamily: '"Varela Round", sans-serif', 
                                        borderRadius: '12px', 
                                        '& .MuiOutlinedInput-notchedOutline': { 
                                            borderRadius: '12px', 
                                            borderColor: '#d8d8d8' 
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
                                    {uniqueSemesters.map((semester) => (
                                        <MenuItem key={semester} value={semester} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                            {semester}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog(false)}
                            sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px' }}
                        >
                            Thêm chương trình
                        </Button>
                    </Box>
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
                            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                                <Table size="medium">                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Mã ngành</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tên ngành</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tên khoa</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Mã môn học</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Mã học kỳ</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Thời gian</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Ghi chú</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6' }}>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>                                    <TableBody>
                                        {filteredPrograms.map((program, index) => (
                                            <TableRow 
                                                key={`${program.maNganh}-${program.maMonHoc}-${program.maHocKy}`}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                    },
                                                    '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                                }}
                                            ><TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800}}>{program.maNganh}</TableCell>
                                                <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 600, color: '#2e7d32' }}>{program.tenNganh || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 600, color: '#1976d2' }}>{program.tenKhoa || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{program.maMonHoc}</TableCell>
                                                <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{program.maHocKy}</TableCell>
                                                <TableCell sx={{ fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                                                    {program.thoiGianBatDau && program.thoiGianKetThuc ? (
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontSize: '13px' }}>
                                                                <strong>Bắt đầu:</strong> {formatDate(program.thoiGianBatDau)}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontSize: '13px' }}>
                                                                <strong>Kết thúc:</strong> {formatDate(program.thoiGianKetThuc)}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" sx={{ fontSize: '13px', color: '#999' }}>
                                                            Chưa có thông tin
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{program.ghiChu || '-'}</TableCell>
                                                <TableCell sx={{ textAlign: 'center' }}>
                                                    <IconButton 
                                                        size="small" 
                                                        color="primary"
                                                        onClick={() => handleOpenDialog(true, program)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton 
                                                        size="small" 
                                                        color="error"
                                                        onClick={() => handleDeleteProgram(program.maNganh, program.maMonHoc, program.maHocKy)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>                                </Table>
                            </TableContainer>
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
                }}>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined" sx={{
                                borderRadius: '12px',
                                background: '#f7faff',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                            }}>
                                <InputLabel>Mã ngành</InputLabel>                                <Select
                                    name="maNganh"
                                    value={currentProgram.maNganh}
                                    onChange={handleSelectChange}
                                    label="Mã ngành"
                                >                                    {majors.map((major) => (
                                        <MenuItem key={major.maNganh || major.manganh} value={major.maNganh || major.manganh}>
                                            {(major.maNganh || major.manganh)} - {(major.tenNganh || major.tennganh)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined" sx={{
                                borderRadius: '12px',
                                background: '#f7faff',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                            }}>
                                <InputLabel>Mã môn học</InputLabel>
                                <Select
                                    name="maMonHoc"
                                    value={currentProgram.maMonHoc}
                                    onChange={handleSelectChange}
                                    label="Mã môn học"
                                >                                    {courses.map((course) => (
                                        <MenuItem key={course.maMonHoc || course.mamonhoc} value={course.maMonHoc || course.mamonhoc}>
                                            {(course.maMonHoc || course.mamonhoc)} - {(course.tenMonHoc || course.tenmonhoc)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth variant="outlined" sx={{
                                borderRadius: '12px',
                                background: '#f7faff',
                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                            }}>
                                <InputLabel>Mã học kỳ</InputLabel>                                <Select
                                    name="maHocKy"
                                    value={currentProgram.maHocKy}
                                    onChange={handleSelectChange}
                                    label="Mã học kỳ"
                                >
                                    {semesters.map((semester) => (
                                        <MenuItem key={semester.semesterId} value={semester.semesterId}>
                                            {semester.semesterId} - {semester.semesterName || `Học kỳ ${semester.termNumber}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {isEditing && currentProgram.tenNganh && (
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