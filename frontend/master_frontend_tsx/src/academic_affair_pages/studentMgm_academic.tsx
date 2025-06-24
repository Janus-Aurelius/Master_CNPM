import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types.ts";
import UserInfo from "../components/UserInfo.tsx";
import { 
    studentApi, 
    Student as ApiStudent, 
    Major, 
    PriorityGroup, 
    Province, 
    District 
} from "../api_clients/academic/studentApi.ts";
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, CircularProgress, Alert,
    TextField, InputAdornment, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, Chip, Avatar, Grid, Divider,
    FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel
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
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon } from '@mui/icons-material';
import Snackbar from '@mui/material/Snackbar';

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
    });    const [formData, setFormData] = useState({
        studentId: '',
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Nam',
        hometown: '',
        priorityName: '',
        majorName: '',
        provinceName: '',
        districtName: '',
        address: '',
        districtId: '',
        priorityObjectId: '',
        majorId: ''
    });    // Dropdown data states
    const [majors, setMajors] = useState<Major[]>([]);
    const [priorityGroups, setPriorityGroups] = useState<PriorityGroup[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);    // Debug log current state
    console.log('=== DROPDOWN STATE DEBUG ===');
    console.log('Current dropdown data counts:', {
        majors: majors.length,
        priorityGroups: priorityGroups.length,
        provinces: provinces.length,
        districts: districts.length
    });
    console.log('Sample data:');
    if (majors.length > 0) console.log('First major:', majors[0]);
    if (priorityGroups.length > 0) console.log('First priority group:', priorityGroups[0]);
    if (provinces.length > 0) console.log('First province:', provinces[0]);
    if (districts.length > 0) console.log('First district:', districts[0]);
    console.log('=== END DEBUG ===');

    // Thêm state cho chức năng mở đăng ký
    const [isBulkRegistrationDialogOpen, setIsBulkRegistrationDialogOpen] = useState(false);
    const [bulkRegistrationStudents, setBulkRegistrationStudents] = useState<any[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [bulkRegistrationLoading, setBulkRegistrationLoading] = useState(false);
    const [maxCredits, setMaxCredits] = useState(24);
    const [currentSemester, setCurrentSemester] = useState('');
    const [semesterOptions, setSemesterOptions] = useState<any[]>([]);
    const [bulkRegistrationFilters, setBulkRegistrationFilters] = useState({
        majorId: '',
        studentId: ''
    });
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning'>('success');

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

    // Fetch dropdown data on component mount
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                console.log('Starting to fetch dropdown data...');
                console.log('Token in localStorage:', localStorage.getItem('token'));
                
                const majorsPromise = studentApi.getMajors().catch(err => {
                    console.error('Error fetching majors:', err.response?.data || err.message);
                    return [];
                });
                
                const priorityGroupsPromise = studentApi.getPriorityGroups().catch(err => {
                    console.error('Error fetching priority groups:', err.response?.data || err.message);
                    return [];
                });
                
                const provincesPromise = studentApi.getProvinces().catch(err => {
                    console.error('Error fetching provinces:', err.response?.data || err.message);
                    return [];
                });

                const semestersPromise = studentApi.getSemesters().catch(err => {
                    console.error('Error fetching semesters:', err.response?.data || err.message);
                    return [];
                });

                const currentSemesterPromise = studentApi.getCurrentSemester().catch(err => {
                    console.error('Error fetching current semester:', err.response?.data || err.message);
                    return '';
                });

                const [majorsData, priorityGroupsData, provincesData, semestersData, currentSemesterData] = await Promise.all([
                    majorsPromise,
                    priorityGroupsPromise,
                    provincesPromise,
                    semestersPromise,
                    currentSemesterPromise
                ]);
                
                console.log('Raw API responses:', {
                    majorsData,
                    priorityGroupsData,
                    provincesData,
                    semestersData,
                    currentSemesterData
                });
                
                setMajors(majorsData);
                setPriorityGroups(priorityGroupsData);
                setProvinces(provincesData);
                setSemesterOptions(semestersData);
                setCurrentSemester(currentSemesterData);
                
                console.log('Set dropdown data successfully');
            } catch (err) {
                console.error('Error fetching dropdown data:', err);
            }
        };

        fetchDropdownData();
    }, []);

    // Fetch districts when province changes
    const handleProvinceChange = async (provinceId: string) => {
        try {
            const districtsData = await studentApi.getDistrictsByProvince(provinceId);
            setDistricts(districtsData);
              // Update form data
            const selectedProvince = provinces.find(p => (p as any).matinh === provinceId);
            setFormData(prev => ({
                ...prev,
                provinceName: (selectedProvince as any)?.tentinh || '',
                districtId: '', // Reset district when province changes
                districtName: ''
            }));
        } catch (err) {
            console.error('Error fetching districts:', err);
        }
    };

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
    const openAddEditDialog = async (student?: ApiStudent) => {
        if (student) {
            // Wait for dropdown data to be available before setting form
            console.log('Opening edit dialog for student:', student);
            console.log('Available majors:', majors);
            console.log('Available priority groups:', priorityGroups);
            console.log('Available provinces:', provinces);
            
            setFormData({
                studentId: student.studentId,
                fullName: student.fullName,
                email: student.email || '',
                phone: student.phone || '',
                dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
                gender: student.gender,
                hometown: student.hometown,
                priorityName: student.priorityName || '',
                majorName: student.majorName || '',
                provinceName: student.provinceName || '',
                districtName: student.districtName || '',
                address: student.address || '',
                districtId: student.districtId || '',
                priorityObjectId: student.priorityObjectId || '',
                majorId: student.majorId || ''
            });
              // If student has a province, fetch districts for that province
            if (student.provinceName && provinces.length > 0) {
                const selectedProvince = provinces.find(p => (p as any).tentinh === student.provinceName);
                if (selectedProvince) {
                    try {
                        const districtsData = await studentApi.getDistrictsByProvince((selectedProvince as any).matinh);
                        setDistricts(districtsData);
                    } catch (err) {
                        console.error('Error fetching districts for edit:', err);
                    }
                }
            }
            
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
                majorName: '',
                provinceName: '',
                districtName: '',
                address: '',
                districtId: '',
                priorityObjectId: '',
                majorId: ''
            });
            // Clear districts when adding new student
            setDistricts([]);
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
                majorName: formData.majorName
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

    // Hàm mở dialog tạo hàng loạt PHIEUDANGKY
    const openBulkRegistrationDialog = async () => {
        if (!currentSemester) {
            setSnackbarMessage('Không có học kỳ nào đang mở đăng ký');
            setSnackbarSeverity('warning');
            return;
        }

        try {
            setBulkRegistrationLoading(true);
            
            // Kiểm tra trạng thái PHIEUDANGKY cho từng sinh viên
            const studentsWithRegistrationStatus = await Promise.all(
                students.map(async (student) => {
                    const hasRegistration = await studentApi.checkStudentRegistrationStatus(student.studentId, currentSemester);
                    return {
                        ...student,
                        hasRegistration
                    };
                })
            );
            
            setBulkRegistrationStudents(studentsWithRegistrationStatus);
            setIsBulkRegistrationDialogOpen(true);
        } catch (error) {
            console.error('Error opening bulk registration dialog:', error);
            setSnackbarMessage('Lỗi khi kiểm tra trạng thái đăng ký của sinh viên');
            setSnackbarSeverity('error');
        } finally {
            setBulkRegistrationLoading(false);
        }
    };

    // Hàm đóng dialog tạo hàng loạt PHIEUDANGKY
    const closeBulkRegistrationDialog = () => {
        setIsBulkRegistrationDialogOpen(false);
        setBulkRegistrationStudents([]);
        setSelectedStudentIds([]);
        setMaxCredits(24);
        setCurrentSemester('');
        setBulkRegistrationFilters({ majorId: '', studentId: '' });
    };

    // Hàm lọc sinh viên trong dialog (lọc local trên bulkRegistrationStudents)
    const filterBulkRegistrationStudents = () => {
        let filtered = students;
        if (bulkRegistrationFilters.majorId) {
            filtered = filtered.filter(s => s.majorId === bulkRegistrationFilters.majorId);
        }
        if (bulkRegistrationFilters.studentId) {
            filtered = filtered.filter(s => s.studentId.includes(bulkRegistrationFilters.studentId));
        }
        setBulkRegistrationStudents(filtered);
    };

    // Hàm chọn tất cả sinh viên (bao gồm cả sinh viên đã có phiếu)
    const selectAllStudents = () => {
        const availableStudentIds = bulkRegistrationStudents
            .map(student => student.studentId); // Chọn tất cả sinh viên
        setSelectedStudentIds(availableStudentIds);
    };

    // Hàm bỏ chọn tất cả sinh viên
    const deselectAllStudents = () => {
        setSelectedStudentIds([]);
    };

    // Hàm chọn/bỏ chọn một sinh viên (cho phép chọn tất cả sinh viên)
    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudentIds(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    // Hàm tạo hàng loạt PHIEUDANGKY
    const createBulkRegistrations = async () => {
        if (selectedStudentIds.length === 0) {
            setSnackbarMessage('Vui lòng chọn ít nhất một sinh viên');
            setSnackbarSeverity('warning');
            return;
        }

        try {
            setBulkRegistrationLoading(true);
            const response = await studentApi.createBulkRegistrations(selectedStudentIds, currentSemester, maxCredits);
            
            if (response.success) {
                setSnackbarMessage(response.message);
                setSnackbarSeverity('success');
                closeBulkRegistrationDialog();
                // Refresh danh sách sinh viên bằng cách trigger lại useEffect
                window.location.reload();
            } else {
                setSnackbarMessage(response.message || 'Có lỗi xảy ra khi tạo phiếu đăng ký');
                setSnackbarSeverity('error');
            }
        } catch (error) {
            console.error('Error creating bulk registrations:', error);
            setSnackbarMessage('Lỗi khi tạo phiếu đăng ký');
            setSnackbarSeverity('error');
        } finally {
            setBulkRegistrationLoading(false);
        }
    };

    // Hàm đóng snackbar
    const handleCloseSnackbar = () => {
        setSnackbarMessage('');
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
                                onClick={async () => await openAddEditDialog()}
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px' }}
                            >
                                Thêm sinh viên
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<SchoolIcon />}
                                onClick={() => openBulkRegistrationDialog()}
                                sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px' }}
                            >
                                Mở đăng ký
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
                                <TableRow 
                                    key={student.studentId || index} 
                                    hover
                                    onClick={() => openStudentDetails(student)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>{student.studentId}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{student.fullName}</TableCell>
                                    <TableCell>{student.email || 'N/A'}</TableCell>
                                    <TableCell>{student.majorName || 'N/A'}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await openAddEditDialog(student);
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
                                        </Typography>                                        <Box sx={{ pl: 2 }}>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Chương trình đào tạo:</strong><br />
                                                {detailDialog.student.majorName || 'N/A'}
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
                    <DialogActions sx={{
                    px: 3,
                    py: 2,
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 2,
                    background: 'transparent',
                }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => {
                                if (detailDialog.student) {
                                    openAddEditDialog(detailDialog.student);
                                }
                                closeStudentDetails();
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
                >                    <DialogTitle sx={{
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        fontSize: '2rem',
                        color: '#4c4c4c',
                        textAlign: 'center',
                        pb: 0,
                        pt: 3
                    }}>
                        {addEditDialog.isEdit ? "Chỉnh sửa thông tin sinh viên" : "Thêm sinh viên mới"}
                    </DialogTitle>
                    <DialogContent dividers sx={{
                        border: 'none',
                        px: 4,
                        pt: 2,
                        pb: 0,
                        background: 'transparent',
                    }}>
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
                            </Grid>                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth size="medium">
                                    <InputLabel>Giới tính</InputLabel>
                                    <Select
                                        value={formData.gender}
                                        label="Giới tính"
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            fontFamily: '"Varela Round", sans-serif',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderRadius: '8px',
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
                                        <MenuItem value="Nam" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Nam</MenuItem>
                                        <MenuItem value="Nữ" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Nữ</MenuItem>
                                        <MenuItem value="Khác" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Row 4 */}                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth size="medium">
                                    <InputLabel id="major-select-label">Ngành học *</InputLabel>
                                    <Select
                                        labelId="major-select-label"
                                        value={formData.majorId || ''}
                                        label="Ngành học *"
                                        onChange={(e) => {
                                            const selectedMajor = majors.find(m => (m as any).manganh === e.target.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                majorId: e.target.value,
                                                majorName: (selectedMajor as any)?.tennganh || ''
                                            }));
                                        }}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            fontFamily: '"Varela Round", sans-serif',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderRadius: '8px',
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
                                        <MenuItem value="" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                            <em>-- Chọn ngành học --</em>
                                        </MenuItem>
                                        {majors.length === 0 && (
                                            <MenuItem value="" disabled sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                <em>Đang tải ngành học...</em>
                                            </MenuItem>
                                        )}
                                        {majors.map((major) => {
                                            console.log('Rendering major:', major, 'tennganh:', (major as any).tennganh);
                                            return (
                                                <MenuItem key={(major as any).manganh} value={(major as any).manganh} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                    {(major as any).tennganh}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>{/* Row 5 */}
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

                            {/* Row 6 */}                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth size="medium">
                                    <InputLabel id="priority-select-label">Đối tượng ưu tiên</InputLabel>
                                    <Select
                                        labelId="priority-select-label"
                                        value={formData.priorityObjectId || ''}
                                        label="Đối tượng ưu tiên"
                                        onChange={(e) => {
                                            const selectedPriority = priorityGroups.find(p => (p as any).madoituong === e.target.value);
                                            setFormData(prev => ({
                                                ...prev,
                                                priorityObjectId: e.target.value,
                                                priorityName: (selectedPriority as any)?.tendoituong || ''
                                            }));
                                        }}
                                        sx={{
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            fontFamily: '"Varela Round", sans-serif',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderRadius: '8px',
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
                                        <MenuItem value="" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                            <em>-- Không có --</em>
                                        </MenuItem>
                                        {priorityGroups.length === 0 && (
                                            <MenuItem value="" disabled sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                <em>Đang tải đối tượng ưu tiên...</em>
                                            </MenuItem>
                                        )}
                                        {priorityGroups.map((priority) => {
                                            console.log('Rendering priority:', priority, 'tendoituong:', (priority as any).tendoituong);
                                            return (
                                                <MenuItem key={(priority as any).madoituong} value={(priority as any).madoituong} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                    {(priority as any).tendoituong}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
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
                                        </Grid>                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth size="medium">
                                                <InputLabel id="district-select-label">Quận/Huyện</InputLabel>
                                                <Select
                                                    labelId="district-select-label"
                                                    value={formData.districtId || ''}
                                                    label="Quận/Huyện"
                                                    onChange={(e) => {
                                                        const selectedDistrict = districts.find(d => (d as any).mahuyen === e.target.value);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            districtId: e.target.value,
                                                            districtName: (selectedDistrict as any)?.tenhuyen || ''
                                                        }));
                                                    }}
                                                    disabled={!formData.provinceName} // Disable until province is selected
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderRadius: '8px',
                                                        fontFamily: '"Varela Round", sans-serif',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderRadius: '8px',
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
                                                    <MenuItem value="" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                        <em>-- Chọn quận/huyện --</em>
                                                    </MenuItem>
                                                    {districts.length === 0 && !formData.provinceName && (
                                                        <MenuItem value="" disabled sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                            <em>Chọn tỉnh trước</em>
                                                        </MenuItem>
                                                    )}
                                                    {districts.length === 0 && formData.provinceName && (
                                                        <MenuItem value="" disabled sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                            <em>Đang tải quận/huyện...</em>
                                                        </MenuItem>
                                                    )}
                                                    {districts.map((district) => {
                                                        console.log('Rendering district:', district, 'tenhuyen:', (district as any).tenhuyen);
                                                        return (
                                                            <MenuItem key={(district as any).mahuyen} value={(district as any).mahuyen} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                                {(district as any).tenhuyen}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Grid>                                        <Grid item xs={12}>
                                            <FormControl fullWidth size="medium">
                                                <InputLabel id="province-select-label">Tỉnh/Thành phố</InputLabel>
                                                <Select
                                                    labelId="province-select-label"
                                                    value={formData.provinceName ? 
                                                        provinces.find(p => (p as any).tentinh === formData.provinceName)?.matinh || '' : ''}
                                                    label="Tỉnh/Thành phố"
                                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        borderRadius: '8px',
                                                        fontFamily: '"Varela Round", sans-serif',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderRadius: '8px',
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
                                                    <MenuItem value="" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                        <em>-- Chọn tỉnh/thành phố --</em>
                                                    </MenuItem>
                                                    {provinces.length === 0 && (
                                                        <MenuItem value="" disabled sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                            <em>Đang tải tỉnh/thành phố...</em>
                                                        </MenuItem>
                                                    )}
                                                    {provinces.map((province) => {
                                                        console.log('Rendering province:', province, 'tentinh:', (province as any).tentinh);
                                                        return (
                                                            <MenuItem key={(province as any).matinh} value={(province as any).matinh} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                                {(province as any).tentinh}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </FormControl>
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
                </Dialog>                {/* Bulk Registration Dialog */}
                <Dialog
                    open={isBulkRegistrationDialogOpen}
                    onClose={closeBulkRegistrationDialog}
                    maxWidth="lg"
                    fullWidth
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '12px',
                            minHeight: '600px'
                        },
                    }}
                >
                    <DialogTitle sx={{
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: 700,
                        fontSize: '2rem',
                        color: '#4c4c4c',
                        textAlign: 'center',
                        pb: 0,
                        pt: 3
                    }}>
                        Mở đăng ký học phần
                    </DialogTitle>
                    
                    <DialogContent dividers sx={{
                        border: 'none',
                        px: 4,
                        pt: 2,
                        pb: 0,
                        background: 'transparent',
                    }}>
                        {/* Thông tin học kỳ và cấu hình */}
                        <Box sx={{ 
                            mt: 1, 
                            mb: 3, 
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
                                <SchoolIcon sx={{ fontSize: '1.4rem' }} />
                                Thông tin học kỳ hiện tại
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ 
                                        p: 2, 
                                        backgroundColor: '#f8f9fa', 
                                        borderRadius: '8px', 
                                        border: '1px solid #dee2e6' 
                                    }}>
                                        <Typography variant="subtitle2" sx={{ 
                                            fontWeight: 'bold', 
                                            color: '#495057', 
                                            mb: 1, 
                                            fontFamily: '"Varela Round", sans-serif' 
                                        }}>
                                            Học kỳ đang mở đăng ký:
                                        </Typography>
                                        <Typography variant="body2" sx={{ 
                                            color: '#1976d2', 
                                            fontFamily: '"Varela Round", sans-serif',
                                            fontWeight: 500
                                        }}>
                                            {currentSemester ? (
                                                Array.isArray(semesterOptions) && semesterOptions.find(s => s.value === currentSemester)?.label || currentSemester
                                            ) : (
                                                'Đang tải thông tin học kỳ...'
                                            )}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Số tín chỉ tối đa"
                                        type="number"
                                        value={maxCredits}
                                        onChange={(e) => setMaxCredits(Number(e.target.value))}
                                        InputProps={{ inputProps: { min: 1, max: 50 } }}
                                        sx={{ 
                                            fontFamily: '"Varela Round", sans-serif',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                                backgroundColor: 'white'
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Bộ lọc tìm kiếm */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ 
                                mb: 2, 
                                color: '#1976d2',
                                fontFamily: '"Varela Round", sans-serif',
                                fontWeight: 600
                            }}>
                                Bộ lọc tìm kiếm
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        placeholder="Tìm theo MSSV"
                                        value={bulkRegistrationFilters.studentId}
                                        onChange={(e) => setBulkRegistrationFilters(prev => ({ ...prev, studentId: e.target.value }))}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            fontFamily: '"Varela Round", sans-serif',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px',
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Ngành học</InputLabel>
                                        <Select
                                            value={bulkRegistrationFilters.majorId}
                                            label="Ngành học"
                                            onChange={(e) => setBulkRegistrationFilters(prev => ({ ...prev, majorId: e.target.value }))}
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
                                            <MenuItem value="" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả ngành</MenuItem>
                                            {majors.map((major: any) => (
                                                <MenuItem key={major.manganh} value={major.manganh} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                    {major.tennganh}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        variant="contained"
                                        onClick={filterBulkRegistrationStudents}
                                        disabled={bulkRegistrationLoading}
                                        sx={{ 
                                            fontFamily: '"Varela Round", sans-serif',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            px: 3,
                                            py: 1
                                        }}
                                    >
                                        {bulkRegistrationLoading ? <CircularProgress size={20} /> : 'Lọc'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Nút chọn tất cả */}
                        <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={selectAllStudents}
                                disabled={bulkRegistrationLoading}
                                sx={{ 
                                    fontFamily: '"Varela Round", sans-serif',
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                }}
                            >
                                Chọn tất cả
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={deselectAllStudents}
                                disabled={bulkRegistrationLoading}
                                sx={{ 
                                    fontFamily: '"Varela Round", sans-serif',
                                    borderRadius: '8px',
                                    textTransform: 'none'
                                }}
                            >
                                Bỏ chọn tất cả
                            </Button>
                            <Typography variant="body2" sx={{ 
                                ml: 2, 
                                color: '#666',
                                fontFamily: '"Varela Round", sans-serif'
                            }}>
                                Đã chọn: {selectedStudentIds.length} sinh viên
                            </Typography>
                        </Box>

                        {/* Bảng danh sách sinh viên */}
                        <TableContainer component={Paper} sx={{ 
                            maxHeight: '350px', 
                            overflow: 'auto',
                            borderRadius: '12px', 
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox" sx={{ 
                                            fontWeight: 'bold', 
                                            color: '#FFFFFF', 
                                            backgroundColor: '#6ebab6',
                                        }}>
                                            <Checkbox
                                                indeterminate={selectedStudentIds.length > 0 && selectedStudentIds.length < bulkRegistrationStudents.length}
                                                checked={selectedStudentIds.length === bulkRegistrationStudents.length && bulkRegistrationStudents.length > 0}
                                                onChange={(e) => e.target.checked ? selectAllStudents() : deselectAllStudents()}
                                                sx={{ color: '#FFFFFF' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold', 
                                            color: '#FFFFFF', 
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            minWidth: '120px'
                                        }}>MSSV</TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold', 
                                            color: '#FFFFFF', 
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            minWidth: '200px'
                                        }}>Họ tên</TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold', 
                                            color: '#FFFFFF', 
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            minWidth: '180px'
                                        }}>Ngành</TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold', 
                                            color: '#FFFFFF', 
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            textAlign: 'center',
                                            minWidth: '120px'
                                        }}>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bulkRegistrationLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : bulkRegistrationStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                                                <Typography sx={{ fontFamily: '"Varela Round", sans-serif' }}>
                                                    Không có sinh viên nào
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bulkRegistrationStudents.map((student) => (
                                            <TableRow key={student.studentId} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedStudentIds.includes(student.studentId)}
                                                        onChange={() => toggleStudentSelection(student.studentId)}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500, fontFamily: '"Varela Round", sans-serif' }}>{student.studentId}</TableCell>
                                                <TableCell sx={{ fontWeight: 500, fontFamily: '"Varela Round", sans-serif' }}>{student.fullName}</TableCell>
                                                <TableCell sx={{ fontFamily: '"Varela Round", sans-serif' }}>{student.majorName}</TableCell>
                                                <TableCell align="center">
                                                    {student.hasRegistration ? (
                                                        <Chip 
                                                            label="Đã có phiếu" 
                                                            color="success" 
                                                            size="small"
                                                            sx={{ fontFamily: '"Varela Round", sans-serif' }}
                                                        />
                                                    ) : (
                                                        <Chip 
                                                            label="Chưa có phiếu" 
                                                            color="warning" 
                                                            size="small"
                                                            sx={{ fontFamily: '"Varela Round", sans-serif' }}
                                                        />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>

                    <DialogActions sx={{ 
                        p: 3, 
                        justifyContent: 'flex-end', 
                        gap: 2, 
                        backgroundColor: '#f8f9fa',
                        borderTop: '1px solid #e0e0e0' 
                    }}>
                        <Typography variant="body2" color="textSecondary" sx={{ 
                            mr: 'auto',
                            fontFamily: '"Varela Round", sans-serif'
                        }}>
                            Tổng: {bulkRegistrationStudents.length} sinh viên | 
                            Đã chọn: {selectedStudentIds.length} sinh viên
                        </Typography>
                        <Button 
                            variant="outlined" 
                            onClick={closeBulkRegistrationDialog}
                            sx={{ 
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                borderColor: '#bdbdbd',
                                color: '#757575',
                                fontFamily: '"Varela Round", sans-serif',
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
                            onClick={createBulkRegistrations}
                            disabled={selectedStudentIds.length === 0 || bulkRegistrationLoading}
                            sx={{ 
                                backgroundColor: '#1976d2',
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                fontFamily: '"Varela Round", sans-serif',
                                '&:hover': {
                                    backgroundColor: '#1565c0'
                                }
                            }}
                        >
                            {bulkRegistrationLoading ? <CircularProgress size={20} color="inherit" /> : 'TẠO PHIẾU ĐĂNG KÝ'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
                <Snackbar
                    open={!!snackbarMessage}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                   

                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity={snackbarSeverity}
                        sx={{ fontFamily: '"Varela Round", sans-serif' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Paper>
        </Box>
    </ThemeLayout>
);
}
