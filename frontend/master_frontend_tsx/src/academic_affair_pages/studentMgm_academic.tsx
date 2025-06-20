import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types.ts";
import UserInfo from "../components/UserInfo.tsx";
import { studentApi, Student as ApiStudent } from "../api_clients/academic/studentApi.ts";
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, CircularProgress, Alert,
    TextField, InputAdornment, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, Chip, Avatar, Grid, Divider,
    FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';

interface StudentMgmAcademicProps {
    user: User | null;
    onLogout: () => void;
}

export default function StudentMgmAcademic({ user, onLogout }: StudentMgmAcademicProps) {
    const [students, setStudents] = useState<ApiStudent[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<ApiStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [majorFilter, setMajorFilter] = useState("all");
    const [detailDialog, setDetailDialog] = useState<{ open: boolean; student: ApiStudent | null }>({ 
        open: false, 
        student: null 
    });    const [addEditDialog, setAddEditDialog] = useState<{ open: boolean; student: ApiStudent | null; isEdit: boolean }>({
        open: false,
        student: null,
        isEdit: false
    });
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; student: ApiStudent | null }>({
        open: false,
        student: null
    });const [formData, setFormData] = useState({
        studentId: '',
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Nam',
        hometown: '',
        priorityName: '',
        facultyName: '',
        majorName: '',
        enrollmentYear: '',
        provinceName: '',
        districtName: '',
        address: '',
        districtId: '',
        priorityObjectId: '',
        majorId: ''
    });

    // Fetch students on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const apiStudents = await studentApi.getStudents();
                setStudents(apiStudents);
                setError(null);
                console.log('Fetched students:', apiStudents);
            } catch (err) {
                setError('Không thể tải danh sách sinh viên');
                console.error('Error fetching students:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Apply filters
    useEffect(() => {
        let result = [...students];

        if (searchQuery) {
            result = result.filter(student => 
                student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            // Since we don't have status in API, we'll implement this later
        }

        if (majorFilter !== "all") {
            result = result.filter(student => student.majorName === majorFilter);
        }

        setFilteredStudents(result);
    }, [searchQuery, statusFilter, majorFilter, students]);

    // Get unique majors for filter
    const uniqueMajors = Array.from(new Set(students.map(s => s.majorName).filter(Boolean)));

    // Get status chip color
    const getStatusChipColor = (status?: string) => {
        switch (status) {
            case 'Đang học': return 'success';
            case 'Bảo lưu': return 'warning'; 
            case 'Thôi học': return 'error';
            default: return 'success'; // Default to "Đang học"
        }
    };    // Format address for display
    const formatAddress = (student: ApiStudent) => {
        const parts = [];
        if (student.address) parts.push(student.address);
        if (student.districtName) parts.push(student.districtName);
        if (student.provinceName) parts.push(student.provinceName);
        return parts.join(' - ') || 'N/A';
    };    // Open student detail dialog
    const openStudentDetails = (student: ApiStudent) => {
        setDetailDialog({ open: true, student });
    };

    // Close student detail dialog
    const closeStudentDetails = () => {
        setDetailDialog({ open: false, student: null });
    };    // Open add/edit dialog
    const openAddEditDialog = (student?: ApiStudent) => {
        if (student) {
            setFormData({
                studentId: student.studentId,
                fullName: student.fullName,
                email: student.email || '',
                phone: student.phone || '',
                dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
                gender: student.gender,
                hometown: student.hometown,
                priorityName: student.priorityName || '',
                facultyName: student.facultyName || '',
                majorName: student.majorName || '',
                enrollmentYear: '2021', // Default since not in schema
                provinceName: student.provinceName || '',
                districtName: student.districtName || '',
                address: student.address || '',
                districtId: student.districtId || '',
                priorityObjectId: student.priorityObjectId || '',
                majorId: student.majorId || ''
            });
            setAddEditDialog({ open: true, student, isEdit: true });
        } else {
            setFormData({
                studentId: '',
                fullName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                gender: 'Nam',
                hometown: '',
                priorityName: '',
                facultyName: '',
                majorName: '',
                enrollmentYear: '',
                provinceName: '',
                districtName: '',
                address: '',
                districtId: '',
                priorityObjectId: '',
                majorId: ''
            });
            setAddEditDialog({ open: true, student: null, isEdit: false });
        }
    };

    // Close add/edit dialog
    const closeAddEditDialog = () => {
        setAddEditDialog({ open: false, student: null, isEdit: false });
    };

    // Handle form input change
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };    // Handle save student
    const handleSaveStudent = async () => {
        try {
            setLoading(true);
            
            const studentData = {
                studentId: formData.studentId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                hometown: formData.hometown,
                districtId: formData.districtId,
                priorityObjectId: formData.priorityObjectId,
                majorId: formData.majorId,
                address: formData.address,
                // Display names for conversion
                districtName: formData.districtName,
                provinceName: formData.provinceName,
                priorityName: formData.priorityName,
                majorName: formData.majorName,
                facultyName: formData.facultyName
            };

            if (addEditDialog.isEdit && addEditDialog.student) {
                await studentApi.updateStudent(addEditDialog.student.studentId, studentData);
            } else {
                await studentApi.createStudent(studentData);
            }
            
            // Refresh the students list
            const apiStudents = await studentApi.getStudents();
            setStudents(apiStudents);
            
            closeAddEditDialog();
            setError(null);
        } catch (err) {
            setError(addEditDialog.isEdit ? 'Không thể cập nhật sinh viên' : 'Không thể thêm sinh viên');
            console.error('Error saving student:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete student
    const handleDeleteStudent = (student: ApiStudent) => {
        setDeleteDialog({ open: true, student });
    };

    const confirmDeleteStudent = async () => {
        if (!deleteDialog.student) return;
        
        try {
            setLoading(true);
            await studentApi.deleteStudent(deleteDialog.student.studentId);
            
            // Refresh the students list
            const apiStudents = await studentApi.getStudents();
            setStudents(apiStudents);
            
            setDeleteDialog({ open: false, student: null });
            setError(null);
        } catch (err) {
            setError('Không thể xóa sinh viên');
            console.error('Error deleting student:', err);
        } finally {
            setLoading(false);
        }
    };

    const cancelDeleteStudent = () => {
        setDeleteDialog({ open: false, student: null });
    };

    if (loading) {
        return (
            <ThemeLayout role="academic" onLogout={onLogout}>
                <UserInfo user={user} />
                <Box sx={{ 
                    backgroundColor: 'white',
                    minHeight: 'calc(100vh - 120px)',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Đang tải dữ liệu sinh viên...</Typography>
                    </Box>
                </Box>
            </ThemeLayout>
        );
    }

    if (error) {
        return (
            <ThemeLayout role="academic" onLogout={onLogout}>
                <UserInfo user={user} />
                <Box sx={{ 
                    backgroundColor: 'white',
                    minHeight: 'calc(100vh - 120px)',
                    p: 3 
                }}>
                    <Alert severity="error">{error}</Alert>
                    <Button 
                        variant="contained" 
                        onClick={() => window.location.reload()} 
                        sx={{ mt: 2 }}
                    >
                        Thử lại
                    </Button>
                </Box>
            </ThemeLayout>
        );
    }    return (
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
                                    <MenuItem value="Đang học" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Đang học</MenuItem>
                                    <MenuItem value="Bảo lưu" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Bảo lưu</MenuItem>
                                    <MenuItem value="Thôi học" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Thôi học</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2.5}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="program-filter-label">Ngành học</InputLabel>
                                <Select
                                    labelId="program-filter-label"
                                    value={majorFilter}
                                    label="Ngành học"
                                    onChange={(e) => setMajorFilter(e.target.value)}
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
                                    {uniqueMajors.map(major => (
                                        <MenuItem key={major} value={major} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{major}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3.5} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => openAddEditDialog()}
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px' }}
                            >
                                Thêm sinh viên
                            </Button>
                        </Grid>
                    </Grid>

                {/* Students Table */}
                <TableContainer component={Paper} sx={{ 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    maxHeight: '600px',
                    overflow: 'auto'
                }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px',
                                    backgroundColor: '#6ebab6',
                                    minWidth: '120px'
                                }}>
                                    MSSV
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px',
                                    backgroundColor: '#6ebab6',
                                    minWidth: '200px'
                                }}>
                                    Họ và Tên
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px',
                                    backgroundColor: '#6ebab6',
                                    minWidth: '200px'
                                }}>
                                    Email
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px',
                                    backgroundColor: '#6ebab6',
                                    minWidth: '180px'
                                }}>
                                    Ngành
                                </TableCell>
                                <TableCell sx={{ 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    fontSize: '16px',
                                    backgroundColor: '#6ebab6',
                                    textAlign: 'center',
                                    minWidth: '120px'
                                }}>
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStudents.map((student, index) => (
                                <TableRow key={student.studentId || index} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{student.studentId}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{student.fullName}</TableCell>
                                    <TableCell>{student.email || 'N/A'}</TableCell>
                                    <TableCell>{student.majorName || 'N/A'}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => openStudentDetails(student)}
                                            sx={{ mr: 1, color: '#1976d2' }}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openAddEditDialog(student);
                                            }}
                                            sx={{ mr: 1, color: '#ed6c02' }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteStudent(student);
                                            }}
                                            sx={{ color: '#d32f2f' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filteredStudents.length === 0 && !loading && (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                            Không có dữ liệu sinh viên
                        </Typography>
                    </Box>
                )}

                {/* Student Detail Dialog */}
                <Dialog 
                    open={detailDialog.open} 
                    onClose={closeStudentDetails} 
                    maxWidth="md" 
                    fullWidth
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '12px',
                            padding: 0,
                        },
                    }}
                >
                    <DialogTitle sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5',
                        borderBottom: '1px solid #e0e0e0'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Thông tin sinh viên
                        </Typography>
                        <IconButton onClick={closeStudentDetails}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        {detailDialog.student && (
                            <Box>
                                {/* Header with avatar and basic info */}
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Avatar
                                        sx={{ 
                                            width: 80, 
                                            height: 80, 
                                            mr: 3,
                                            backgroundColor: '#6ebab6',
                                            fontSize: '2rem'
                                        }}
                                    >
                                        {detailDialog.student.fullName.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {detailDialog.student.fullName}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            <PersonIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                            MSSV: {detailDialog.student.studentId}
                                        </Typography>
                                        <Chip
                                            label="Đang học"
                                            size="small"
                                            color={getStatusChipColor('Đang học')}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {/* Information sections */}
                                <Grid container spacing={3}>
                                    {/* Academic Information */}
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" sx={{ 
                                            color: '#6ebab6', 
                                            fontWeight: 'bold', 
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <SchoolIcon sx={{ mr: 1 }} />
                                            Thông tin học tập
                                        </Typography>
                                        <Box sx={{ pl: 2 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Khoa:</strong><br />
                                                {detailDialog.student.facultyName || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Chương trình đào tạo:</strong><br />
                                                {detailDialog.student.majorName || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Năm nhập học:</strong><br />
                                                N/A
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Personal Information */}
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" sx={{ 
                                            color: '#6ebab6', 
                                            fontWeight: 'bold', 
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <PersonIcon sx={{ mr: 1 }} />
                                            Thông tin cá nhân
                                        </Typography>
                                        <Box sx={{ pl: 2 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Ngày sinh:</strong><br />
                                                {detailDialog.student.dateOfBirth ? 
                                                    new Date(detailDialog.student.dateOfBirth).toLocaleDateString('vi-VN') : 
                                                    'N/A'
                                                }
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Giới tính:</strong><br />
                                                {detailDialog.student.gender}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Quê quán:</strong><br />
                                                {detailDialog.student.hometown}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                <strong>Đối tượng ưu tiên:</strong><br />
                                                {detailDialog.student.priorityName || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Contact Information */}
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" sx={{ 
                                            color: '#6ebab6', 
                                            fontWeight: 'bold', 
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <EmailIcon sx={{ mr: 1 }} />
                                            Thông tin liên hệ
                                        </Typography>
                                        <Box sx={{ pl: 2 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Email:</strong><br />
                                                {detailDialog.student.email || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Số điện thoại:</strong><br />
                                                {detailDialog.student.phone || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Địa chỉ thường trú:</strong><br />
                                                {formatAddress(detailDialog.student)}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<EditIcon />}
                            sx={{ mr: 2 }}
                        >
                            Chỉnh sửa
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={closeStudentDetails}
                            sx={{ backgroundColor: '#6ebab6' }}
                        >
                            Đóng
                        </Button>                    </DialogActions>
                </Dialog>

                {/* Add/Edit Student Dialog */}                <Dialog 
                    open={addEditDialog.open} 
                    onClose={closeAddEditDialog} 
                    maxWidth="lg" 
                    fullWidth
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '12px',
                            padding: 0,
                            minHeight: '700px',
                        },
                    }}
                >
                    <DialogTitle sx={{ 
                        position: 'relative',
                        textAlign: 'center',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e0e0e0',
                        py: 2
                    }}>
                        <Typography variant="h5" sx={{ 
                            fontWeight: 'bold',
                            color: '#1976d2',
                            fontSize: '1.5rem'
                        }}>
                            {addEditDialog.isEdit ? 'CHỈNH SỬA THÔNG TIN SINH VIÊN' : 'THÊM SINH VIÊN MỚI'}
                        </Typography>
                        <IconButton 
                            onClick={closeAddEditDialog}
                            sx={{
                                position: 'absolute',
                                right: 16,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#757575'
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>                    <DialogContent sx={{ p: 4, backgroundColor: '#fafafa' }}>
                        <Grid container spacing={3}>
                            {/* Row 1 */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="MSSV *"
                                    value={formData.studentId}
                                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Họ và tên *"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Row 2 */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email *"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Số điện thoại"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Row 3 */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ngày sinh *"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth size="medium">
                                    <InputLabel>Giới tính</InputLabel>
                                    <Select
                                        value={formData.gender}
                                        label="Giới tính"
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                        <MenuItem value="Khác">Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Row 4 */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Khoa *"
                                    value={formData.facultyName}
                                    onChange={(e) => handleInputChange('facultyName', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Ngành học *"
                                    value={formData.majorName}
                                    onChange={(e) => handleInputChange('majorName', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>                            {/* Row 5 */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Năm nhập học *"
                                    value={formData.enrollmentYear}
                                    onChange={(e) => handleInputChange('enrollmentYear', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Quê quán"
                                    value={formData.hometown}
                                    onChange={(e) => handleInputChange('hometown', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Row 6 */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Đối tượng ưu tiên"
                                    value={formData.priorityName}
                                    onChange={(e) => handleInputChange('priorityName', e.target.value)}
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '8px'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {/* Empty grid item for spacing */}
                            </Grid>

                            {/* Address Section */}
                            <Grid item xs={12}>
                                <Box sx={{ 
                                    mt: 3, 
                                    mb: 2, 
                                    p: 2, 
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <Typography variant="h6" sx={{ 
                                        fontWeight: 600,
                                        color: '#1976d2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        mb: 2
                                    }}>
                                        <HomeIcon sx={{ fontSize: '1.4rem' }} />
                                        Địa chỉ thường trú
                                    </Typography>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Số nhà, đường, phường/xã"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                variant="outlined"
                                                size="medium"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                label="Quận/Huyện"
                                                value={formData.districtName}
                                                onChange={(e) => handleInputChange('districtName', e.target.value)}
                                                variant="outlined"
                                                size="medium"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Tỉnh/Thành phố"
                                                value={formData.provinceName}
                                                onChange={(e) => handleInputChange('provinceName', e.target.value)}
                                                variant="outlined"
                                                size="medium"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '8px'
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>                    <DialogActions sx={{ 
                        p: 3, 
                        justifyContent: 'flex-end', 
                        gap: 2, 
                        backgroundColor: '#f8f9fa',
                        borderTop: '1px solid #e0e0e0' 
                    }}>
                        <Button 
                            variant="outlined" 
                            onClick={closeAddEditDialog}
                            sx={{ 
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                borderColor: '#bdbdbd',
                                color: '#757575',
                                '&:hover': {
                                    borderColor: '#9e9e9e',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            HỦY
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={handleSaveStudent}
                            sx={{ 
                                backgroundColor: '#1976d2',
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#1565c0'
                                }
                            }}
                        >
                            {addEditDialog.isEdit ? 'CẬP NHẬT' : 'THÊM MỚI'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialog.open}
                    onClose={cancelDeleteStudent}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '12px',
                            padding: 0,
                        },
                    }}
                >
                    <DialogTitle id="delete-dialog-title" sx={{ 
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#d32f2f',
                        position: 'relative',
                        py: 3,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '2px',
                            bottom: 0,
                            left: 0,
                            background: 'linear-gradient(to right, transparent, #d32f2f, transparent)',
                        }
                    }}>
                        Xóa sinh viên
                    </DialogTitle>
                    <DialogContent sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Bạn có chắc chắn muốn xóa sinh viên <strong>{deleteDialog.student?.fullName}</strong> (MSSV: <strong>{deleteDialog.student?.studentId}</strong>)?
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                            Hành động này không thể hoàn tác.
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={confirmDeleteStudent}
                            sx={{ 
                                borderRadius: '8px',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                width: '100%',
                                '&:hover': {
                                    backgroundColor: '#c62828'
                                }
                            }}
                        >
                            Xóa sinh viên
                        </Button>
                    </DialogContent>
                    <DialogActions sx={{ 
                        p: 2, 
                        justifyContent: 'center', 
                        gap: 2,
                        backgroundColor: '#f8f9fa',
                        borderTop: '1px solid #e0e0e0' 
                    }}>
                        <Button 
                            variant="outlined" 
                            onClick={cancelDeleteStudent}
                            sx={{ 
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                borderColor: '#bdbdbd',
                                color: '#757575',
                                '&:hover': {
                                    borderColor: '#9e9e9e',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            HỦY                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialog.open}
                    onClose={cancelDeleteStudent}
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '16px',
                            minWidth: '400px'
                        },
                    }}
                >
                    <DialogTitle id="delete-dialog-title" sx={{ 
                        fontFamily: '"Roboto", sans-serif', 
                        fontWeight: 600,
                        color: '#d32f2f',
                        textAlign: 'center'
                    }}>
                        Xác nhận xóa sinh viên
                    </DialogTitle>
                    <DialogContent sx={{ textAlign: 'center', py: 3 }}>
                        {deleteDialog.student && (
                            <Typography
                                id="delete-dialog-description"
                                component="div"
                                sx={{
                                    fontSize: '16px',
                                    color: '#5c6c7c',
                                    fontWeight: 400
                                }}
                            >
                                Bạn có chắc chắn muốn xóa sinh viên<br />
                                <strong>{deleteDialog.student.fullName}</strong> ({deleteDialog.student.studentId})<br />
                                khỏi hệ thống không?<br /><br />
                                Hành động này không thể hoàn tác.
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
                        <Button 
                            onClick={cancelDeleteStudent} 
                            variant="outlined"
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold'
                            }}
                        >
                            Hủy
                        </Button>
                        <Button 
                            onClick={confirmDeleteStudent} 
                            color="error" 
                            variant="contained"
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold'
                            }}
                        >
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>
                </Paper>
            </Box>
        </ThemeLayout>
    );
}
