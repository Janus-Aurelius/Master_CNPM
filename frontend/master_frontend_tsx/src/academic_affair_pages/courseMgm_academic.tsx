import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import React, { useState, useEffect, useMemo } from "react";
import UserInfo from "../components/UserInfo";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem,
    Box,
    Grid,
    InputAdornment,
    Snackbar,
    Alert
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { courseApi } from '../api_clients/academic/courseApi';
import { Subject } from '../types/course';
import SearchIcon from '@mui/icons-material/Search';

interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

const CourseMgmAcademic: React.FC<AcademicPageProps> = ({ user, onLogout }) => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const data = await courseApi.getCourses();
            setSubjects(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch subjects');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const [openDialog, setOpenDialog] = useState(false);
    const [currentSubject, setCurrentSubject] = useState<Subject>({
        maMonHoc: '',
        tenMonHoc: '',
        maLoaiMon: '',
        soTiet: 0,
        credits: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

    const [searchMaMonHoc, setSearchMaMonHoc] = useState('');
    const [searchTenMonHoc, setSearchTenMonHoc] = useState('');
    const [creditsFilter, setCreditsFilter] = useState<string>('all');

    const [maLoaiMonFilter, setMaLoaiMonFilter] = useState<string>('all');
    const [soTietFilter, setSoTietFilter] = useState<string>('all');

    const [oldMaMonHoc, setOldMaMonHoc] = useState<string | null>(null);

    const uniqueMaLoaiMon = useMemo(() => Array.from(new Set(subjects.map(s => s.maLoaiMon))).filter(Boolean), [subjects]);
    const uniqueSoTiet = useMemo(() => Array.from(new Set(subjects.map(s => s.soTiet))).filter(Boolean), [subjects]);
    const uniqueCredits = useMemo(() => Array.from(new Set(subjects.map(s => parseInt((s.credits || 0).toString(), 10)))).filter(Boolean), [subjects]);

    const filteredSubjects = useMemo(() => {
        return subjects.filter(subject => {
            const matchesMaMonHoc = (subject.maMonHoc ?? "").toLowerCase().includes(searchMaMonHoc.toLowerCase());
            const matchesTenMonHoc = (subject.tenMonHoc ?? "").toLowerCase().includes(searchTenMonHoc.toLowerCase());
            const matchesMaLoaiMon = maLoaiMonFilter === 'all' || subject.maLoaiMon === maLoaiMonFilter;
            const matchesSoTiet = soTietFilter === 'all' || subject.soTiet === Number(soTietFilter);
            const matchesCredits = creditsFilter === 'all' || parseInt((subject.credits || 0).toString(), 10) === Number(creditsFilter);
            return matchesMaMonHoc && matchesTenMonHoc && matchesMaLoaiMon && matchesSoTiet && matchesCredits;
        });
    }, [subjects, searchMaMonHoc, searchTenMonHoc, maLoaiMonFilter, soTietFilter, creditsFilter]);

    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'info' | 'warning';
    }>({
        open: false,
        message: '',
        severity: 'error'
    });

    const handleOpenDialog = (edit: boolean = false, subject?: Subject) => {
        setIsEditing(edit);
        if (edit && subject) {
            setCurrentSubject(subject);
            setOldMaMonHoc(subject.maMonHoc ?? null);
        } else {
            setCurrentSubject({
                maMonHoc: '',
                tenMonHoc: '',
                maLoaiMon: '',
                soTiet: 0,
                credits: 0
            });
            setOldMaMonHoc(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };    const handleUpdate = async (subject: Subject) => {
        try {
            if (!oldMaMonHoc) return;
            await courseApi.updateCourse(oldMaMonHoc, subject);
            await fetchSubjects(); // Fetch lại data
            handleCloseDialog(); // Đóng dialog
            setSnackbar({ open: true, message: 'Cập nhật môn học thành công!', severity: 'success' });        } catch (error: any) {
            console.log('Update course error:', error);
            
            let errorMessage = 'Có lỗi khi cập nhật môn học';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        }
    };

    const handleCreate = async (subject: Subject) => {
        try {
            await courseApi.createCourse(subject);
            await fetchSubjects(); // Fetch lại data
            handleCloseDialog(); // Đóng dialog
            setSnackbar({ open: true, message: 'Thêm môn học thành công!', severity: 'success' });        } catch (error: any) {
            console.log('Create course error:', error);
            console.log('Error response:', error.response);
            console.log('Error response data:', error.response?.data);
            
            let errorMessage = 'Có lỗi khi thêm môn học';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await courseApi.deleteCourse(id);
            await fetchSubjects();
            setSnackbar({ 
                open: true, 
                message: 'Xóa môn học thành công!', 
                severity: 'success' 
            });        } catch (error: any) {
            console.error('Error deleting subject:', error);
            console.log('Delete error response:', error.response);
            console.log('Delete error response data:', error.response?.data);
            
            let errorMessage = 'Có lỗi khi xóa môn học';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setSnackbar({ 
                open: true, 
                message: errorMessage, 
                severity: 'error' 
            });
        }
    };

    const handleDeleteSubject = (id: string) => {
        setConfirmDelete({ open: true, id });
    };

    const handleConfirmDelete = async () => {
        if (confirmDelete.id !== null) {
                await handleDelete(confirmDelete.id);
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Không xử lý trường credits vì nó được tính tự động
        if (name === 'credits') return;
        
        setCurrentSubject({
            ...currentSubject,
            [name]: name === "soTiet" ? Number(value) : value
        });
    };

    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <UserInfo user={user} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.25rem'}}>
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
                        Danh sách môn học
                    </Typography>
                    {error && (
                        <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
                            {error}
                        </Typography>
                    )}                    <Box sx={{ marginBottom: '24px' }}>
                        {/* Search and Filter Row */}                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    placeholder="Tìm kiếm theo mã môn học hoặc tên môn học"
                                    value={searchMaMonHoc}
                                    onChange={e => {
                                        setSearchMaMonHoc(e.target.value);
                                        setSearchTenMonHoc(e.target.value); // Update both search states
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: '#9e9e9e' }} />
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
                            </Grid>
                            <Grid item xs={12} md={2}>                                <TextField
                                    select
                                    label="Mã loại môn"
                                    value={maLoaiMonFilter}
                                    onChange={e => setMaLoaiMonFilter(e.target.value)}
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
                                    {uniqueMaLoaiMon.map(ma => (
                                        <MenuItem key={ma} value={ma} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{ma}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>                                <TextField
                                    select
                                    label="Số tiết"
                                    value={soTietFilter}
                                    onChange={e => setSoTietFilter(e.target.value)}
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
                                    {uniqueSoTiet.map(st => (
                                        <MenuItem key={st} value={st} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{st}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={2}>                                <TextField
                                    select
                                    label="Số tín chỉ"
                                    value={creditsFilter}
                                    onChange={e => setCreditsFilter(e.target.value)}
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
                                    {uniqueCredits.map(cr => (
                                        <MenuItem key={cr} value={cr} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{cr}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        
                        {/* Action Button Row */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog(false)}
                                sx={{ 
                                    fontFamily: '"Varela Round", sans-serif', 
                                    borderRadius: '8px'
                                }}
                        >
                            Thêm môn học
                        </Button>
                        </Box>
                    </Box>
                    {loading ? (
                        <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>                    ) : (                        <TableContainer component={Paper} sx={{ 
                            borderRadius: '12px', 
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            maxHeight: '600px',
                            overflow: 'auto'
                        }}>
                            <Table size="medium" stickyHeader>
                                <TableHead>
                                    <TableRow>                                        <TableCell sx={{ 
                                            fontWeight: 'bold',
                                            color: '#FFFFFF',
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            py: 2
                                        }}>
                                            Mã môn học
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold',
                                            color: '#FFFFFF',
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            py: 2
                                        }}>
                                            Tên môn học
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold',
                                            color: '#FFFFFF',
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            py: 2
                                        }}>
                                            Mã loại môn
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold',
                                            color: '#FFFFFF',
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            py: 2
                                        }}>
                                            Số tiết
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold',
                                            color: '#FFFFFF',
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            py: 2
                                        }}>
                                            Số tín chỉ
                                        </TableCell>
                                        <TableCell sx={{ 
                                            fontWeight: 'bold',
                                            color: '#FFFFFF',
                                            fontSize: '16px',
                                            backgroundColor: '#6ebab6',
                                            py: 2,
                                            textAlign: 'center'
                                        }}>
                                            Thao tác
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSubjects.map((subject) => (                                        <TableRow
                                            key={subject.maMonHoc}
                                            hover
                                        >                                            <TableCell sx={{ fontWeight: 500 }}>{subject.maMonHoc}</TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{subject.tenMonHoc}</TableCell>
                                            <TableCell>{subject.maLoaiMon}</TableCell>
                                            <TableCell>{subject.soTiet}</TableCell>
                                            <TableCell>{parseInt((subject.credits ?? 0).toString(), 10)}</TableCell><TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog(true, subject)}
                                                    sx={{ mr: 1, color: '#ed6c02' }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteSubject(subject.maMonHoc ?? '')}
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
                    )}
                </Paper>
            </Box>
            {/* Dialog for adding/editing subjects */}            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth
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
                    {isEditing ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
                </DialogTitle>                <DialogContent dividers sx={{
                    border: 'none',
                    px: 4,
                    pt: 2,
                    pb: 0,
                    background: 'transparent',
                }}>
                    <Grid container spacing={3} sx={{ mt: 0.5 }}>                        <Grid item xs={12} md={6}>
                            <TextField
                                name="maMonHoc"
                                label="Mã môn học"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.maMonHoc}
                                onChange={handleInputChange}
                                disabled={isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="tenMonHoc"
                                label="Tên môn học"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.tenMonHoc}
                                onChange={handleInputChange}
                            />                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="maLoaiMon"
                                label="Mã loại môn"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.maLoaiMon}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="soTiet"
                                label="Số tiết"
                                type="number"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.soTiet}
                                onChange={handleInputChange}
                                inputProps={{ min: 0 }}
                            />                        </Grid>
                        {/* Chỉ hiển thị trường credits khi đang chỉnh sửa và set read-only */}                        {isEditing && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="credits"
                                    label="Số tín chỉ"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={currentSubject.credits}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    helperText="Được tính tự động từ số tiết và loại môn"
                                />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button variant="contained" color="primary" onClick={async () => {
                        if (isEditing) {
                            await handleUpdate(currentSubject);
                        } else {
                            await handleCreate(currentSubject);
                        }
                    }}>
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Confirm Delete Dialog */}            <Dialog
                open={confirmDelete.open}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '12px',
                    },
                }}
            >
                <DialogTitle id="delete-dialog-title" sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 500 }}>
                    Xác nhận xóa học phần
                </DialogTitle>
                <DialogContent>
                    <Typography
                        id="delete-dialog-description"
                        component="div"
                        sx={{
                            fontSize: '16px',
                            color: '#5c6c7c',
                            textAlign: 'center',
                            fontWeight: 400
                        }}
                    >
                        Bạn có chắc chắn muốn xóa học phần này không?
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
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeLayout>
    );
};

export default CourseMgmAcademic;