import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import UserInfo from "../components/UserInfo";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Grid,
    Divider,
    Chip,
    InputAdornment,
    TablePagination,
    Avatar
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import { studentApi, Student } from "../api_clients/studentApi";

interface StudentMgmAcademicProps {
    user: User | null;
    onLogout: () => void;
}

export default function StudentMgmAcademic({ user, onLogout }: StudentMgmAcademicProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [programFilter, setProgramFilter] = useState("all");
    const [openDialog, setOpenDialog] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
    const [detailDialog, setDetailDialog] = useState<{ open: boolean; student: Student | null }>({ open: false, student: null });
    const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

    // Extract unique programs and statuses for filters
    const uniquePrograms = Array.from(new Set(students.map(s => s.majorId)));
    const uniqueStatuses = Array.from(new Set(students.map(s => s.status || 'đang học')));

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const data = await studentApi.getStudents();
                setStudents(data);
                setFilteredStudents(data);
            } catch (err) {
                setError('Failed to fetch students');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, statusFilter, programFilter, students]);

    const applyFilters = () => {
        let result = [...students];

        if (searchQuery) {
            result = result.filter(student => 
                student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(student => student.status === statusFilter);
        }

        if (programFilter !== "all") {
            result = result.filter(student => student.majorId === programFilter);
        }

        setFilteredStudents(result);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentStudent) return;
        
        const { name, value } = e.target;
        setCurrentStudent({
            ...currentStudent,
            [name]: value
        });
    };

    const handleSelectChange = (e: any) => {
        if (!currentStudent) return;
        
        const { name, value } = e.target;
        setCurrentStudent({
            ...currentStudent,
            [name]: value
        });
    };

    const handleOpenDialog = (edit: boolean = false, student?: Student) => {
        setIsEditing(edit);
        
        if (edit && student) {
            setCurrentStudent({
                ...student,
                dateOfBirth: new Date(student.dateOfBirth)
            });
        } else {
            setCurrentStudent({
                studentId: '',
                fullName: '',
                dateOfBirth: new Date(),
                gender: '',
                hometown: '',
                districtId: '',
                priorityObjectId: '',
                majorId: '',
                email: '',
                phone: '',
                status: 'đang học',
                faculty: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentStudent(null);
    };

    const handleSaveStudent = async () => {
        if (!currentStudent) return;
        
        try {
            // Convert dateOfBirth to string format for API
            const studentData = {
                ...currentStudent,
                dateOfBirth: typeof currentStudent.dateOfBirth === 'string' 
                    ? currentStudent.dateOfBirth 
                    : currentStudent.dateOfBirth.toISOString().split('T')[0]
            };
            
            if (isEditing) {
                await studentApi.updateStudent(studentData.studentId, studentData);
                setStudents(students.map(s => s.studentId === studentData.studentId ? studentData : s));
            } else {
                const newStudent = await studentApi.createStudent(studentData);
                setStudents([...students, newStudent]);
            }
            handleCloseDialog();
        } catch (err: any) {
            console.error('Error saving student:', err);
            const errorMessage = err?.response?.data?.message || err?.message || 'Không thể lưu thông tin sinh viên. Vui lòng kiểm tra lại dữ liệu và thử lại.';
            setErrorDialog({ open: true, message: errorMessage });
        }
    };

    const handleDeleteStudent = (studentId: string) => {
        setConfirmDelete({ open: true, id: studentId });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.id !== null) {
            try {
                await studentApi.deleteStudent(confirmDelete.id);
                setStudents(students.filter(s => s.studentId !== confirmDelete.id));
            } catch (err: any) {
                console.error('Error deleting student:', err);
                const errorMessage = err?.response?.data?.message || err?.message || 'Không thể xóa sinh viên. Có thể sinh viên này đang có dữ liệu liên quan trong hệ thống.';
                setErrorDialog({ open: true, message: errorMessage });
            }
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };

    const openStudentDetails = (student: Student) => {
        setDetailDialog({ open: true, student });
    };

    const closeStudentDetails = () => {
        setDetailDialog({ open: false, student: null });
    };

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'active': 
            case 'đang học': return 'success';
            case 'inactive': 
            case 'thôi học': return 'error';
            default: return 'default';
        }
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
                            marginBottom: '14px',
                            marginTop: '0px',
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Quản lý sinh viên
                    </Typography>

                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} md={3.5}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo Họ tên hoặc MSSV"
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
                        <Grid item xs={12} md={2.5}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="status-filter-label">Trạng thái</InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    value={statusFilter}
                                    label="Trạng thái"
                                    onChange={(e) => setStatusFilter(e.target.value)}
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
                                    <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả trạng thái</MenuItem>
                                    {uniqueStatuses.map(status => (
                                        <MenuItem key={status} value={status} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2.5}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="program-filter-label">Ngành học</InputLabel>
                                <Select
                                    labelId="program-filter-label"
                                    value={programFilter}
                                    label="Ngành học"
                                    onChange={(e) => setProgramFilter(e.target.value)}
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
                                    <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả ngành học</MenuItem>
                                    {uniquePrograms.map(program => (
                                        <MenuItem key={program} value={program} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{program}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3.5} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog(false)}
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px' }}
                            >
                                Thêm sinh viên
                            </Button>
                        </Grid>
                    </Grid>

                    <TableContainer 
                        component={Paper} 
                        sx={{ 
                            mt: 2,
                            borderRadius: '8px', 
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
                            border: '1px solid #e0e0e0',
                            width: '100%', 
                            maxWidth: '100%', 
                            minWidth: 1100,
                            maxHeight: 'calc(100vh - 350px)',
                            height: 'auto',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '6px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: '6px'
                            }
                        }}
                    >
                        <Table size="medium" stickyHeader sx={{ tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '12%' }}>MSSV</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '20%' }}>Họ và Tên</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '25%' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '8%' }}>Ngành</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '15%' }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6', width: '10%' }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow
                                        key={student.studentId}
                                        sx={{ 
                                            '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' }, 
                                            '&:last-child td, &:last-child th': { borderBottom: 'none' } 
                                        }}
                                        onClick={() => openStudentDetails(student)}
                                    >
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800 }}>{student.studentId}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{student.fullName}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{student.email}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{student.majorId}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>
                                            <Chip 
                                                label={student.status || 'đang học'} 
                                                color={getStatusChipColor(student.status || 'đang học')} 
                                                size="small" 
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDialog(true, student);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteStudent(student.studentId);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                Không tìm thấy sinh viên nào phù hợp với điều kiện tìm kiếm
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            {/* Dialog for adding/editing students */}
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
                    {isEditing ? "Chỉnh sửa thông tin sinh viên" : "Thêm sinh viên mới"}
                </DialogTitle>
                <DialogContent dividers sx={{
                    border: 'none',
                    px: 4,
                    pt: 2,
                    pb: 0,
                    background: 'transparent',
                }}>
                    {currentStudent && (
                        <Grid container spacing={2} sx={{ mt: 0.5 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    autoFocus
                                    name="studentId"
                                    label="MSSV"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={currentStudent.studentId}
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="fullName"
                                    label="Họ và tên"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={currentStudent.fullName}
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={currentStudent.email}
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="phone"
                                    label="Số điện thoại"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={currentStudent.phone}
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="dateOfBirth"
                                    label="Ngày sinh"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    value={
                                        typeof currentStudent.dateOfBirth === 'string' 
                                            ? currentStudent.dateOfBirth 
                                            : currentStudent.dateOfBirth.toISOString().split('T')[0]
                                    }
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
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                    <InputLabel id="gender-select-label" sx={{ fontWeight: 500 }}>Giới tính</InputLabel>
                                    <Select
                                        labelId="gender-select-label"
                                        name="gender"
                                        value={currentStudent.gender || ''}
                                        label="Giới tính"
                                        onChange={handleSelectChange}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8' } }}
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
                                        <MenuItem value="Nam" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Nam</MenuItem>
                                        <MenuItem value="Nữ" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Nữ</MenuItem>
                                        <MenuItem value="Khác" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="hometown"
                                    label="Quê quán"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={currentStudent.hometown || ''}
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
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                    <InputLabel id="district-select-label" sx={{ fontWeight: 500 }}>Quận/Huyện</InputLabel>
                                    <Select
                                        labelId="district-select-label"
                                        name="districtId"
                                        value={currentStudent.districtId || ''}
                                        label="Quận/Huyện"
                                        onChange={handleSelectChange}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8' } }}
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
                                        <MenuItem value="Quận 1" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quận 1</MenuItem>
                                        <MenuItem value="Quận 2" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quận 2</MenuItem>
                                        <MenuItem value="Quận 3" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quận 3</MenuItem>
                                        <MenuItem value="Quận 4" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quận 4</MenuItem>
                                        <MenuItem value="Quận 5" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quận 5</MenuItem>
                                        <MenuItem value="Quận 7" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quận 7</MenuItem>
                                        <MenuItem value="Quận 8" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quận 8</MenuItem>
                                        <MenuItem value="Quận 10" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quận 10</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                    <InputLabel id="priority-select-label" sx={{ fontWeight: 500 }}>Đối tượng ưu tiên</InputLabel>
                                    <Select
                                        labelId="priority-select-label"
                                        name="priorityObjectId"
                                        value={currentStudent.priorityObjectId || ''}
                                        label="Đối tượng ưu tiên"
                                        onChange={handleSelectChange}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8' } }}
                                        MenuProps={{
                                            PaperProps: {
                                                elevation: 4,
                                                sx: {
                                                    borderRadius: 3,
                                                    minWidth: 250,
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
                                        <MenuItem value="Sinh viên dân tộc thiểu số" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Sinh viên dân tộc thiểu số</MenuItem>
                                        <MenuItem value="Sinh viên hộ cận nghèo" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Sinh viên hộ cận nghèo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                    <InputLabel id="major-select-label" sx={{ fontWeight: 500 }}>Ngành học *</InputLabel>
                                    <Select
                                        labelId="major-select-label"
                                        name="majorId"
                                        value={currentStudent.majorId || ''}
                                        label="Ngành học *"
                                        onChange={handleSelectChange}
                                        required
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8' } }}
                                        MenuProps={{
                                            PaperProps: {
                                                elevation: 4,
                                                sx: {
                                                    borderRadius: 3,
                                                    minWidth: 250,
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
                                        <MenuItem value="Công nghệ thông tin" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Công nghệ thông tin</MenuItem>
                                        <MenuItem value="Hệ thống thông tin" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Hệ thống thông tin</MenuItem>
                                        <MenuItem value="Khoa học máy tính" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Khoa học máy tính</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                    <InputLabel id="status-select-label" sx={{ fontWeight: 500 }}>Trạng thái</InputLabel>
                                    <Select
                                        labelId="status-select-label"
                                        name="status"
                                        value={currentStudent.status || 'đang học'}
                                        label="Trạng thái"
                                        onChange={handleSelectChange}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8' } }}
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
                                        <MenuItem value="đang học" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Đang học</MenuItem>
                                        <MenuItem value="thôi học" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Thôi học</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
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
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSaveStudent}>
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Student Detail Dialog */}
            <Dialog open={detailDialog.open} onClose={closeStudentDetails} maxWidth="md" fullWidth
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '12px',
                        background: '#ffffff',
                        padding: 0,
                    },
                }}
            >
                {detailDialog.student && (
                    <>
                        <DialogTitle sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f0f0f0',
                            px: 3,
                            py: 2
                        }}>
                            <Typography variant="h5" component="h2" sx={{ 
                                fontWeight: 600, 
                                color: '#333333',
                                fontFamily: '"Montserrat", sans-serif',
                            }}>
                                Thông tin sinh viên
                            </Typography>
                            <IconButton onClick={closeStudentDetails} size="small">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ px: 3, py: 3 }}>
                            <Grid container spacing={3}>
                                {/* Header with student name, ID and status */}
                                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 64, 
                                            height: 64,
                                            fontSize: '1.75rem',
                                            bgcolor: '#6ebab6',
                                            mr: 2,
                                            mt: 4
                                        }}
                                    >
                                        {detailDialog.student.fullName.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1, mt: 4 }}>
                                        <Typography variant="h5" component="h2" sx={{ 
                                            fontWeight: 600, 
                                            color: '#333333',
                                            fontFamily: '"Montserrat", sans-serif',
                                        }}>
                                            {detailDialog.student.fullName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <Typography variant="body1" sx={{ color: '#666666', mr: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <PersonIcon fontSize="small" /> MSSV: {detailDialog.student.studentId}
                                            </Typography>
                                            <Chip 
                                                label={detailDialog.student.status || 'đang học'} 
                                                color={getStatusChipColor(detailDialog.student.status || 'đang học')}
                                                size="small"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Divider */}
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>
                                
                                {/* Student information sections */}
                                <Grid item xs={12}>
                                    <Grid container spacing={3}>
                                        {/* Academic Info */}
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography 
                                                    variant="subtitle1" 
                                                    component="h3" 
                                                    sx={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontWeight: 600,
                                                        color: '#555',
                                                        mb: 2
                                                    }}
                                                >
                                                    <SchoolIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#6ebab6' }} /> 
                                                    Thông tin học tập
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Ngành</Typography>
                                                        <Typography variant="body1">{detailDialog.student.majorId}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Khoa</Typography>
                                                        <Typography variant="body1">{detailDialog.student.faculty}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Đối tượng ưu tiên</Typography>
                                                        <Typography variant="body1">{detailDialog.student.priorityObjectId || "Chưa cập nhật"}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        
                                        {/* Personal Info */}
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography 
                                                    variant="subtitle1" 
                                                    component="h3" 
                                                    sx={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontWeight: 600,
                                                        color: '#555',
                                                        mb: 2
                                                    }}
                                                >
                                                    <PersonOutlineIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#6ebab6' }} /> 
                                                    Thông tin cá nhân
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Ngày sinh</Typography>
                                                        <Typography variant="body1">
                                                            {new Date(detailDialog.student.dateOfBirth).toLocaleDateString('vi-VN')}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Giới tính</Typography>
                                                        <Typography variant="body1">{detailDialog.student.gender || "Chưa cập nhật"}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Tỉnh/Thành phố</Typography>
                                                        <Typography variant="body1">{detailDialog.student.hometown || "Chưa cập nhật"}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Quận/Huyện</Typography>
                                                        <Typography variant="body1">{detailDialog.student.districtId || "Chưa cập nhật"}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        
                                        {/* Contact Info */}
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography 
                                                    variant="subtitle1" 
                                                    component="h3" 
                                                    sx={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontWeight: 600,
                                                        color: '#555',
                                                        mb: 2
                                                    }}
                                                >
                                                    <ContactMailIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#6ebab6' }} /> 
                                                    Thông tin liên hệ
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                                            <EmailIcon sx={{ color: '#999', mr: 1, mt: 0.3, fontSize: '1.1rem' }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                                                <Typography variant="body1">{detailDialog.student.email}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                                                            <PhoneIcon sx={{ color: '#999', mr: 1, mt: 0.3, fontSize: '1.1rem' }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Số điện thoại</Typography>
                                                                <Typography variant="body1">{detailDialog.student.phone}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>

                        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f0f0f0' }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => {
                                    closeStudentDetails();
                                    if (detailDialog.student) {
                                        handleOpenDialog(true, detailDialog.student);
                                    }
                                }}
                                startIcon={<EditIcon />}
                                sx={{ 
                                    borderRadius: '6px', 
                                    textTransform: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Chỉnh sửa
                            </Button>
                            <Button 
                                variant="contained" 
                                onClick={closeStudentDetails}
                                sx={{ 
                                    borderRadius: '6px', 
                                    bgcolor: '#6ebab6', 
                                    '&:hover': { bgcolor: '#5da9a5' },
                                    textTransform: 'none',
                                    fontWeight: 500
                                }}
                            >
                                Đóng
                            </Button>
                        </DialogActions>
                    </>
                )}
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
                    Xác nhận xóa sinh viên
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
                        Bạn có chắc chắn muốn xóa sinh viên này khỏi hệ thống không?
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

            {/* Error Dialog */}
            <Dialog
                open={errorDialog.open}
                onClose={() => setErrorDialog({ open: false, message: '' })}
                aria-labelledby="error-dialog-title"
                maxWidth="sm"
                fullWidth
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '16px',
                    },
                }}
            >
                <DialogTitle id="error-dialog-title" sx={{ 
                    fontFamily: '"Roboto", sans-serif', 
                    fontWeight: 500,
                    color: '#d32f2f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    ⚠️ Lỗi
                </DialogTitle>
                <DialogContent>
                    <Typography 
                        component="div"
                        sx={{
                            fontSize: '16px',
                            color: '#333', 
                            fontWeight: 400,
                            lineHeight: 1.5
                        }}
                    >
                        {errorDialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setErrorDialog({ open: false, message: '' })} 
                        color="primary"
                        variant="contained"
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeLayout>
    );
}