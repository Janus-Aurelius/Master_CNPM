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
    TableCell,    TableBody,
    TablePagination,
    Snackbar,
    Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { programApi, ProgramSchedule } from "../api_clients/academic/programApi";

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
        ghiChu: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
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

    const fetchPrograms = async () => {
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
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    // Debug log cho programs state
    useEffect(() => {
        console.log('Current programs state:', programs);
    }, [programs]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
            handleCloseDialog();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi lưu chương trình học';
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
            console.error(err);
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
                        }}
                    >
                        Danh sách chương trình học
                    </Typography>
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
                        <Typography sx={{ textAlign: 'center', mt: 4 }}>Không có dữ liệu chương trình học</Typography>
                    ) : (
                        <>
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
                                    </TableHead>
                                    <TableBody>
                                        {programs
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((program, index) => (
                                            <TableRow 
                                                key={program.id || `program-${index}`}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5',
                                                    },
                                                    '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                                }}
                                            >                                                <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800}}>{program.maNganh}</TableCell>
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
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={programs.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
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
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="maNganh"
                                label="Mã ngành"
                                fullWidth
                                variant="outlined"
                                value={currentProgram.maNganh}
                                onChange={handleInputChange}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="maMonHoc"
                                label="Mã môn học"
                                fullWidth
                                variant="outlined"
                                value={currentProgram.maMonHoc}
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
                                name="maHocKy"
                                label="Mã học kỳ"
                                fullWidth
                                variant="outlined"
                                value={currentProgram.maHocKy}
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