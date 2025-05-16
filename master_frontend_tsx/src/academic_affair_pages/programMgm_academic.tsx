import {ThemeLayout} from "../styles/theme_layout.tsx";
import {User} from "../types";
import { useState } from "react";
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
    TablePagination,
    Chip,
    Divider
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

interface ProgramSchedule{
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    department: string;
    totalCredits: number;
    type: string;
}

export default function ProgramMgmAcademic({ user, onLogout }: AcademicPageProps) {
    const [programs, setPrograms] = useState<ProgramSchedule[]>([
        { id:1, name: "Kỹ thuật phần mềm", startDate: "2023-09-01", endDate: "2027-06-30", department: "Công nghệ thông tin", totalCredits: 145, type:"Chuyên ngành" },
        { id: 2, name: "Khoa học máy tính", startDate: "2023-09-01", endDate: "2027-06-30", department: "Công nghệ thông tin", totalCredits: 150, type: "Chuyên ngành" },
        { id: 3, name: "Hệ thống thông tin", startDate: "2023-09-01", endDate: "2027-06-30", department: "Công nghệ thông tin", totalCredits: 140, type:"Cơ sở ngành" }
    ]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentProgram, setCurrentProgram] = useState<ProgramSchedule>({
        id: 0,
        name: "",
        startDate: "",
        endDate: "",
        department: "",
        totalCredits: 0,
        type:""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

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
        } else {
            setCurrentProgram({
                id: programs.length + 1,
                name: "",
                startDate: "",
                endDate: "",
                department: "",
                totalCredits: 0,
                type:""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveProgram = () => {
        if (isEditing) {
            setPrograms(programs.map(p => p.id === currentProgram.id ? currentProgram : p));
        } else {
            setPrograms([...programs, currentProgram]);
        }
        handleCloseDialog();
    };

    const handleDeleteProgram = (id: number) => {
        setConfirmDelete({ open: true, id });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id !== null) {
            setPrograms(programs.filter(p => p.id !== confirmDelete.id));
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentProgram({
            ...currentProgram,
            [name]: name === "totalCredits" ? Number(value) : value
        });
    };

    // Helper function for program type chips
    const renderProgramTypeChip = (type: string) => {
        const color = type === 'Chuyên ngành' ? 'primary' : 'success';
        return <Chip size="small" label={type} color={color} sx={{ fontWeight: 500 }} />;
    };

    // Format date to display in dd/mm/yyyy format
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

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
                        Danh sách chương trình đào tạo
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
                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Table size="medium">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tên chương trình</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Khoa</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Loại</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Bắt đầu</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Kết thúc</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tín chỉ</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6' }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {programs
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((program) => (
                                    <TableRow 
                                        key={program.id} 
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                            '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                        }}
                                    >
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800}}>{program.name}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{program.department}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{renderProgramTypeChip(program.type)}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{formatDate(program.startDate)}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{formatDate(program.endDate)}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{program.totalCredits}</TableCell>
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
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                name="name"
                                label="Tên chương trình"
                                fullWidth
                                variant="outlined"
                                value={currentProgram.name}
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
                                name="department"
                                label="Khoa"
                                fullWidth
                                variant="outlined"
                                value={currentProgram.department}
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
                                name="type"
                                label="Loại chương trình"
                                fullWidth
                                variant="outlined"
                                value={currentProgram.type}
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
                                name="startDate"
                                label="Ngày bắt đầu"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={currentProgram.startDate}
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
                                name="endDate"
                                label="Ngày kết thúc"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={currentProgram.endDate}
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
                        <Grid item xs={12}>
                            <TextField
                                name="totalCredits"
                                label="Tổng tín chỉ"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={currentProgram.totalCredits}
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
                    <Button variant="contained" color="primary" onClick={handleSaveProgram}>
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
                    Xác nhận xóa chương trình đào tạo
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
                        Bạn có chắc chắn muốn xóa chương trình này không?
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