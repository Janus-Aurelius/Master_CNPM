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

interface StudentMgmAcademicProps {
    user: User | null;
    onLogout: () => void;
}

interface Student {
    id: number;
    studentId: string;
    name: string;
    email: string;
    faculty: string;
    program: string;
    enrollmentYear: string;
    status: string;
    phone: string;
    dob: string;
    address: string;
    avatar?: string;
    gender?: string;
    hometown?: string; // quê quán
    targetGroup?: string; // đối tượng
}

export default function StudentMgmAcademic({ user, onLogout }: StudentMgmAcademicProps) {    const [students, setStudents] = useState<Student[]>([
        { 
            id: 1, 
            studentId: '21520001', 
            name: 'Nguyễn Văn An', 
            email: 'an.nguyen@student.uit.edu.vn', 
            faculty: 'Công nghệ thông tin', 
            program: 'Kỹ thuật phần mềm', 
            enrollmentYear: '2021', 
            status: 'Đang học', 
            phone: '0901234567', 
            dob: '2003-05-15', 
            address: 'Số 17, Đường số 5, Khu dân cư An Phú, Quận 9, TP.HCM',
            gender: 'Nam',
            hometown: 'Bình Định',
            targetGroup: 'Ưu tiên vùng cao'
        },
        { 
            id: 2, 
            studentId: '21520002', 
            name: 'Trần Thị Bình', 
            email: 'binh.tran@student.uit.edu.vn', 
            faculty: 'Công nghệ thông tin', 
            program: 'Khoa học máy tính', 
            enrollmentYear: '2021', 
            status: 'Đang học', 
            phone: '0909876543', 
            dob: '2003-03-20', 
            address: '23/15 Đường Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, TP.HCM',
            gender: 'Nữ',
            hometown: 'Tiền Giang',
            targetGroup: 'Khu vực 1'
        },
        { 
            id: 3, 
            studentId: '21520003', 
            name: 'Lê Văn Cường', 
            email: 'cuong.le@student.uit.edu.vn', 
            faculty: 'Công nghệ thông tin', 
            program: 'Hệ thống thông tin', 
            enrollmentYear: '2021', 
            status: 'Đang học', 
            phone: '0905678901', 
            dob: '2003-07-10', 
            address: '45 Đinh Tiên Hoàng, Phường 3, Bình Thạnh, TP.HCM',
            gender: 'Nam',
            hometown: 'Đà Nẵng',
            targetGroup: 'Khu vực 2'
        },
        { 
            id: 4, 
            studentId: '21520004', 
            name: 'Phạm Thị Dung', 
            email: 'dung.pham@student.uit.edu.vn', 
            faculty: 'Công nghệ thông tin', 
            program: 'Mạng máy tính', 
            enrollmentYear: '2021', 
            status: 'Tạm nghỉ', 
            phone: '0908765432', 
            dob: '2003-09-25', 
            address: '78 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
            gender: 'Nữ',
            hometown: 'Cần Thơ',
            targetGroup: 'Khu vực 2-NT'
        },
        { 
            id: 5, 
            studentId: '21520005', 
            name: 'Hoàng Văn Em', 
            email: 'em.hoang@student.uit.edu.vn', 
            faculty: 'Công nghệ thông tin', 
            program: 'Kỹ thuật phần mềm', 
            enrollmentYear: '2021', 
            status: 'Đang học', 
            phone: '0904567890', 
            dob: '2003-02-18', 
            address: '123 Nguyễn Văn Linh, Phường 5, Gò Vấp, TP.HCM',
            gender: 'Nam',
            hometown: 'Hà Nội',
            targetGroup: 'Khu vực 3'
        },
        { 
            id: 6, 
            studentId: '21520006', 
            name: 'Đỗ Thị Phương', 
            email: 'phuong.do@student.uit.edu.vn', 
            faculty: 'Công nghệ thông tin', 
            program: 'An toàn thông tin', 
            enrollmentYear: '2021', 
            status: 'Đang học', 
            phone: '0907654321', 
            dob: '2003-11-05', 
            address: '56 Hoàng Hoa Thám, Phường 10, Phú Nhuận, TP.HCM',
            gender: 'Nữ',
            hometown: 'Lâm Đồng',
            targetGroup: 'Khu vực 1'
        },
        { 
            id: 7, 
            studentId: '21520007', 
            name: 'Vũ Văn Giang', 
            email: 'giang.vu@student.uit.edu.vn', 
            faculty: 'Công nghệ thông tin', 
            program: 'Khoa học máy tính', 
            enrollmentYear: '2021', 
            status: 'Thôi học', 
            phone: '0903456789', 
            dob: '2003-08-12', 
            address: '89 Trần Hưng Đạo, Phường 3, Quận 10, TP.HCM',
            gender: 'Nam',
            hometown: 'Bắc Ninh',
            targetGroup: 'Không'
        },
        { 
            id: 8, 
            studentId: '21520008', 
            name: 'Lý Thị Hoa', 
            email: 'hoa.ly@student.uit.edu.vn', 
            faculty: 'Công nghệ thông tin', 
            program: 'Hệ thống thông tin', 
            enrollmentYear: '2021', 
            status: 'Đang học', 
            phone: '0906543210', 
            dob: '2003-04-30', 
            address: '34 Cách Mạng Tháng 8, Phường 6, Tân Bình, TP.HCM',
            gender: 'Nữ',
            hometown: 'Huế',
            targetGroup: 'Khu vực 2'
        },
        { 
            id: 9, 
            studentId: '21520009', 
            name: 'Trịnh Văn Khoa', 
            email: 'khoa.trinh@student.uit.edu.vn', 
            faculty: 'Khoa học máy tính', 
            program: 'An toàn thông tin', 
            enrollmentYear: '2021', 
            status: 'Đang học', 
            phone: '0902345678', 
            dob: '2003-06-22', 
            address: '112 Lạc Long Quân, Phường 3, Bình Tân, TP.HCM',
            gender: 'Nam',
            hometown: 'An Giang',
            targetGroup: 'Khu vực 2-NT'
        }
    ]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [programFilter, setProgramFilter] = useState("all");
    const [openDialog, setOpenDialog] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);    const [isEditing, setIsEditing] = useState(false);
    // Không sử dụng phân trang nữa, hiển thị tất cả trong thanh cuộn
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(5);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
    const [detailDialog, setDetailDialog] = useState<{ open: boolean; student: Student | null }>({ open: false, student: null });

    // Extract unique programs and statuses for filters
    const uniquePrograms = Array.from(new Set(students.map(s => s.program)));
    const uniqueStatuses = Array.from(new Set(students.map(s => s.status)));

    useEffect(() => {
        applyFilters();
    }, [searchQuery, statusFilter, programFilter, students]);    const applyFilters = () => {
        let result = [...students];

        if (searchQuery) {
            result = result.filter(student => 
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(student => student.status === statusFilter);
        }

        if (programFilter !== "all") {
            result = result.filter(student => student.program === programFilter);
        }

        setFilteredStudents(result);
    };    // Không cần các hàm xử lý phân trang nữa

    const handleOpenDialog = (edit: boolean = false, student?: Student) => {
        setIsEditing(edit);
        if (edit && student) {
            setCurrentStudent(student);
        } else {            setCurrentStudent({
                id: students.length + 1,
                studentId: '',
                name: '',
                email: '',
                faculty: '',
                program: '',
                enrollmentYear: '',
                status: 'Đang học',
                phone: '',
                dob: '',
                address: '',
                gender: '',
                hometown: '',
                targetGroup: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentStudent(null);
    };

    const handleSaveStudent = () => {
        if (!currentStudent) return;
        
        if (isEditing) {
            setStudents(students.map(s => s.id === currentStudent.id ? currentStudent : s));
        } else {
            setStudents([...students, currentStudent]);
        }
        handleCloseDialog();
    };

    const handleDeleteStudent = (id: number) => {
        setConfirmDelete({ open: true, id });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id !== null) {
            setStudents(students.filter(s => s.id !== confirmDelete.id));
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
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

    const openStudentDetails = (student: Student) => {
        setDetailDialog({ open: true, student });
    };

    const closeStudentDetails = () => {
        setDetailDialog({ open: false, student: null });
    };

    // Helper function for status chips
    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'Đang học': return 'success';
            case 'Tạm nghỉ': return 'warning';
            case 'Thôi học': return 'error';
            default: return 'default';
        }
    };    return (
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
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}
                                >
                                    <MenuItem value="all">Tất cả trạng thái</MenuItem>
                                    {uniqueStatuses.map(status => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
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
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}
                                >
                                    <MenuItem value="all">Tất cả ngành học</MenuItem>
                                    {uniquePrograms.map(program => (
                                        <MenuItem key={program} value={program}>{program}</MenuItem>
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
                        <Table size="medium" stickyHeader sx={{ tableLayout: 'fixed' }}>                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '12%' }}>MSSV</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '20%' }}>Họ và Tên</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '25%' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '8%' }}>Khóa</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '15%' }}>Ngành</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '10%' }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6', width: '10%' }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow
                                        key={student.id}
                                        sx={{ 
                                            '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' }, 
                                            '&:last-child td, &:last-child th': { borderBottom: 'none' } 
                                        }}
                                        onClick={() => openStudentDetails(student)}
                                    >
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800 }}>{student.studentId}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{student.name}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{student.email}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{student.enrollmentYear}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{student.program}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>
                                            <Chip 
                                                label={student.status} 
                                                color={getStatusChipColor(student.status)} 
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
                                                    handleDeleteStudent(student.id);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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
                }}>                    {currentStudent && (
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
                                    name="name"
                                    label="Họ và tên"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={currentStudent.name}
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
                                    name="dob"
                                    label="Ngày sinh"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    value={currentStudent.dob}
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
                                    >
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                        <MenuItem value="Khác">Khác</MenuItem>
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
                                <TextField
                                    name="targetGroup"
                                    label="Đối tượng"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={currentStudent.targetGroup || ''}
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
                                    name="faculty"
                                    label="Khoa"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={currentStudent.faculty}
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
                                    name="program"
                                    label="Ngành học"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={currentStudent.program}
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
                                    name="enrollmentYear"
                                    label="Năm nhập học"
                                    fullWidth
                                    margin="normal"
                                    required
                                    variant="outlined"
                                    value={currentStudent.enrollmentYear}
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
                                    <InputLabel id="status-select-label" sx={{ fontWeight: 500 }}>Trạng thái</InputLabel>
                                    <Select
                                        labelId="status-select-label"
                                        name="status"
                                        value={currentStudent.status}
                                        label="Trạng thái"
                                        onChange={handleSelectChange}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '12px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '12px', borderColor: '#d8d8d8' } }}
                                    >
                                        <MenuItem value="Đang học">Đang học</MenuItem>
                                        <MenuItem value="Tạm nghỉ">Tạm nghỉ</MenuItem>
                                        <MenuItem value="Thôi học">Thôi học</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="address"
                                    label="Địa chỉ"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={currentStudent.address}
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
                </DialogActions>            </Dialog>              {/* Student Detail Dialog */}
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
                                        {detailDialog.student.name.charAt(0)}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1, mt: 4 }}>
                                        <Typography variant="h5" component="h2" sx={{ 
                                            fontWeight: 600, 
                                            color: '#333333',
                                            fontFamily: '"Montserrat", sans-serif',
                                        }}>
                                            {detailDialog.student.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <Typography variant="body1" sx={{ color: '#666666', mr: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <PersonIcon fontSize="small" /> MSSV: {detailDialog.student.studentId}
                                            </Typography>
                                            <Chip 
                                                label={detailDialog.student.status} 
                                                color={getStatusChipColor(detailDialog.student.status)}
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
                                                        <Typography variant="body2" color="text.secondary">Khoa</Typography>
                                                        <Typography variant="body1">{detailDialog.student.faculty}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Chương trình đào tạo</Typography>
                                                        <Typography variant="body1">{detailDialog.student.program}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Năm nhập học</Typography>
                                                        <Typography variant="body1">{detailDialog.student.enrollmentYear}</Typography>
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
                                                            {new Date(detailDialog.student.dob).toLocaleDateString('vi-VN')}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Giới tính</Typography>
                                                        <Typography variant="body1">{detailDialog.student.gender || "Chưa cập nhật"}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Quê quán</Typography>
                                                        <Typography variant="body1">{detailDialog.student.hometown || "Chưa cập nhật"}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="body2" color="text.secondary">Đối tượng</Typography>
                                                        <Typography variant="body1">{detailDialog.student.targetGroup || "Chưa cập nhật"}</Typography>
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
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <HomeIcon sx={{ color: '#999', mr: 1, mt: 0.3, fontSize: '1.1rem' }} />
                                                            <Box>
                                                                <Typography variant="body2" color="text.secondary">Địa chỉ</Typography>
                                                                <Typography variant="body1">{detailDialog.student.address}</Typography>
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
                                    handleOpenDialog(true, detailDialog.student);
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
        </ThemeLayout>
    );
}