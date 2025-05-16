import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import { useState } from "react";
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
    Divider
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface Subject {
    code: string; // Mã môn học
    id: number;
    name: string;
    lecturer: string;
    day: string;
    session: string;
    fromTo: string;
    room?: string;
    credits?: number;
}

interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

export default function CourseMgmAcademic({ user, onLogout }: AcademicPageProps) {
    const [subjects, setSubjects] = useState<Subject[]>([
        { code: 'IT101', id: 1, name: 'Kỹ thuật lập trình', lecturer: 'TS. Nguyễn Văn A', day: 'Thứ Hai', session: '1', fromTo: '08:00-10:00', room: 'H1-101', credits: 3 },
        { code: 'IT102', id: 2, name: 'Cấu trúc dữ liệu', lecturer: 'PGS. Trần Thị B', day: 'Thứ Ba', session: '2', fromTo: '10:00-12:00', room: 'H2-202', credits: 4 },
        { code: 'CE103', id: 3, name: 'Cơ sở dữ liệu', lecturer: 'TS. Lê Văn C', day: 'Thứ Tư', session: '3', fromTo: '12:00-14:00', room: 'H3-303', credits: 3 },
        { code: 'IT134', id: 4, name: 'Phân tích thiết kế hệ thống', lecturer: 'TS. Phạm Thị D', day: 'Thứ Năm', session: '4', fromTo: '14:00-16:00', room: 'H4-404', credits: 4 },
        { code: 'SE105', id: 5, name: 'Lập trình web', lecturer: 'TS. Hoàng Văn E', day: 'Thứ Sáu', session: '5', fromTo: '16:00-18:00', room: 'H5-505', credits: 3 },
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [currentSubject, setCurrentSubject] = useState<Subject>({
        code: '',
        id: 0,
        name: '',
        lecturer: '',
        day: '',
        session: '',
        fromTo: '',
        room: '',
        credits: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

    const handleOpenDialog = (edit: boolean = false, subject?: Subject) => {
        setIsEditing(edit);
        if (edit && subject) {
            setCurrentSubject(subject);
        } else {
            setCurrentSubject({
                code: '',
                id: subjects.length + 1,
                name: '',
                lecturer: '',
                day: '',
                session: '',
                fromTo: '',
                room: '',
                credits: 0
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveSubject = () => {
        if (isEditing) {
            setSubjects(subjects.map(s => s.id === currentSubject.id ? currentSubject : s));
        } else {
            setSubjects([...subjects, currentSubject]);
        }
        handleCloseDialog();
    };

    const handleDeleteSubject = (id: number) => {
        setConfirmDelete({ open: true, id });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id !== null) {
            setSubjects(subjects.filter(s => s.id !== confirmDelete.id));
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentSubject({
            ...currentSubject,
            [name]: name === "credits" ? Number(value) : value
        });
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setCurrentSubject({
            ...currentSubject,
            [name]: value
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
                        flexDirection: 'column',                        position: 'relative',
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<UploadFileIcon />}
                            sx={{ borderColor: '#1976d2', color: '#1976d2', borderRadius: '8px', fontFamily: '"Varela Round", sans-serif' }}
                        >
                            Nhập file
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog(false)}
                            sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px' }}
                        >
                            Thêm môn học
                        </Button>
                    </Box>
                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Table size="medium" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Mã môn học</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tên môn học</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Giảng viên</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Ngày</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Ca học</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Thời gian</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Phòng</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Số tín chỉ</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '18px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6' }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subjects.map((subject) => (
                                    <TableRow
                                        key={subject.id}
                                        sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child td, &:last-child th': { borderBottom: 'none' } }}
                                    >
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800 }}>{subject.code}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{subject.name}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{subject.lecturer}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{subject.day}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{subject.session}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{subject.fromTo}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{subject.room}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif'  }}>{subject.credits}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleOpenDialog(true, subject)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteSubject(subject.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
            {/* Dialog for adding/editing subjects */}
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
                    {isEditing ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
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
                                autoFocus
                                name="code"
                                label="Mã môn học"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.code}
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
                                label="Tên học phần"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.name}
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
                                name="lecturer"
                                label="Giảng viên"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.lecturer}
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
                                <InputLabel id="day-select-label" sx={{ fontWeight: 500 }}>Ngày</InputLabel>
                                <Select
                                    labelId="day-select-label"
                                    name="day"
                                    value={currentSubject.day}
                                    label="Ngày"
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
                                    <MenuItem value="Thứ Hai" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Thứ Hai</MenuItem>
                                    <MenuItem value="Thứ Ba" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Thứ Ba</MenuItem>
                                    <MenuItem value="Thứ Tư" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Thứ Tư</MenuItem>
                                    <MenuItem value="Thứ Năm" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Thứ Năm</MenuItem>
                                    <MenuItem value="Thứ Sáu" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Thứ Sáu</MenuItem>
                                    <MenuItem value="Thứ Bảy" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Thứ Bảy</MenuItem>
                                    <MenuItem value="Chủ Nhật" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Chủ Nhật</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                <InputLabel id="session-select-label" sx={{ fontWeight: 500 }}>Ca học</InputLabel>
                                <Select
                                    labelId="session-select-label"
                                    name="session"
                                    value={currentSubject.session}
                                    label="Ca học"
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
                                    <MenuItem value="1" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Ca 1</MenuItem>
                                    <MenuItem value="2" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Ca 2</MenuItem>
                                    <MenuItem value="3" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Ca 3</MenuItem>
                                    <MenuItem value="4" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Ca 4</MenuItem>
                                    <MenuItem value="5" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Ca 5</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="fromTo"
                                label="Thời gian"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.fromTo}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: 08:00-10:00"
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
                                name="room"
                                label="Phòng"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={currentSubject.room}
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
                                name="credits"
                                label="Số tín chỉ"
                                type="number"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                value={currentSubject.credits}
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
                    <Button variant="contained" color="primary" onClick={handleSaveSubject}>
                        {isEditing ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
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
                    Xác nhận xóa học phần
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
        </ThemeLayout>
    );
}