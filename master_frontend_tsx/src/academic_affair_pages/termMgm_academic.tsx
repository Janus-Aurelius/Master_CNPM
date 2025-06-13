import { ThemeLayout } from "../styles/theme_layout";
import { User } from "../types";
import { useState, useEffect } from "react";
import UserInfo from "../components/UserInfo";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    TextField,
    Typography,
    Box,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

interface AcademicTerm {
    id: number;
    year: string;
    semester: string;
    startDate: string;
    endDate: string;
    status: string;
}

export default function TermMgmAcademic({ user, onLogout }: AcademicPageProps) {    const [terms, setTerms] = useState<AcademicTerm[]>([
        { 
            id: 1, 
            year: "2025-2026", 
            semester: "HK1", 
            startDate: "2025-09-01", 
            endDate: "2026-01-15", 
            status: "Chưa diễn ra" 
        },
        { 
            id: 2, 
            year: "2024-2025", 
            semester: "HK3", 
            startDate: "2025-06-01", 
            endDate: "2025-08-30", 
            status: "Chưa diễn ra" 
        },
        { 
            id: 3, 
            year: "2024-2025", 
            semester: "HK2", 
            startDate: "2025-01-20", 
            endDate: "2025-05-30", 
            status: "Đang diễn ra" 
        },
        { 
            id: 4, 
            year: "2024-2025", 
            semester: "HK1", 
            startDate: "2024-09-01", 
            endDate: "2025-01-15", 
            status: "Đã kết thúc" 
        },
        { 
            id: 5, 
            year: "2023-2024", 
            semester: "HK3", 
            startDate: "2024-06-01", 
            endDate: "2024-08-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 6, 
            year: "2023-2024", 
            semester: "HK2", 
            startDate: "2024-01-20", 
            endDate: "2024-05-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 7, 
            year: "2023-2024", 
            semester: "HK1", 
            startDate: "2023-09-01", 
            endDate: "2024-01-15", 
            status: "Đã kết thúc" 
        },
        { 
            id: 8, 
            year: "2022-2023", 
            semester: "HK3", 
            startDate: "2023-06-01", 
            endDate: "2023-08-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 9, 
            year: "2022-2023", 
            semester: "HK2", 
            startDate: "2023-01-20", 
            endDate: "2023-05-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 10, 
            year: "2022-2023", 
            semester: "HK1", 
            startDate: "2022-09-01", 
            endDate: "2023-01-15", 
            status: "Đã kết thúc" 
        },
        { 
            id: 11, 
            year: "2021-2022", 
            semester: "HK3", 
            startDate: "2022-06-01", 
            endDate: "2022-08-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 12, 
            year: "2021-2022", 
            semester: "HK2", 
            startDate: "2022-01-20", 
            endDate: "2022-05-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 13, 
            year: "2021-2022", 
            semester: "HK1", 
            startDate: "2021-09-01", 
            endDate: "2022-01-15", 
            status: "Đã kết thúc" 
        },
        { 
            id: 14, 
            year: "2020-2021", 
            semester: "HK3", 
            startDate: "2021-06-01", 
            endDate: "2021-08-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 15, 
            year: "2020-2021", 
            semester: "HK2", 
            startDate: "2021-01-20", 
            endDate: "2021-05-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 16, 
            year: "2020-2021", 
            semester: "HK1", 
            startDate: "2020-09-01", 
            endDate: "2021-01-15", 
            status: "Đã kết thúc" 
        },
        { 
            id: 17, 
            year: "2019-2020", 
            semester: "HK3", 
            startDate: "2020-06-01", 
            endDate: "2020-08-30", 
            status: "Đã kết thúc" 
        },
        { 
            id: 18, 
            year: "2019-2020", 
            semester: "HK2", 
            startDate: "2020-01-20", 
            endDate: "2020-05-30", 
            status: "Đã kết thúc" 
        }
    ].sort((a, b) => {
        // Sort by year first (descending)
        const yearCompare = b.year.localeCompare(a.year);
        if (yearCompare !== 0) return yearCompare;
        
        // Then by semester (HK3 > HK2 > HK1)
        const semesterOrder = { 'HK3': 3, 'HK2': 2, 'HK1': 1 };
        return semesterOrder[b.semester as keyof typeof semesterOrder] - semesterOrder[a.semester as keyof typeof semesterOrder];
    }));const [openDialog, setOpenDialog] = useState(false);    const [currentTerm, setCurrentTerm] = useState<AcademicTerm>({
        id: 0,
        year: "",
        semester: "",
        startDate: "",
        endDate: "",
        status: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });    const [yearFilter, setYearFilter] = useState("all");
    const [filteredTerms, setFilteredTerms] = useState<AcademicTerm[]>(terms);

    // Extract unique years for filter
    const uniqueYears = Array.from(new Set(terms.map(t => t.year)));

    // Filter terms based on year filter
    useEffect(() => {
        if (yearFilter === "all") {
            setFilteredTerms(terms);
        } else {
            setFilteredTerms(terms.filter(term => term.year === yearFilter));
        }
    }, [terms, yearFilter]);

    const handleOpenDialog = (edit: boolean = false, term?: AcademicTerm) => {
        setIsEditing(edit);
        if (edit && term) {
            setCurrentTerm(term);        } else {
            setCurrentTerm({
                id: terms.length + 1,
                year: "",
                semester: "",
                startDate: "",
                endDate: "",
                status: "Đang diễn ra"
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSaveTerm = () => {
        if (isEditing) {
            setTerms(terms.map(t => t.id === currentTerm.id ? currentTerm : t));
        } else {
            setTerms([...terms, currentTerm]);
        }
        handleCloseDialog();
    };

    const handleDeleteTerm = (id: number) => {
        setConfirmDelete({ open: true, id });
    };

    const handleConfirmDelete = () => {
        if (confirmDelete.id !== null) {
            setTerms(terms.filter(t => t.id !== confirmDelete.id));
        }
        setConfirmDelete({ open: false, id: null });
    };

    const handleCancelDelete = () => {
        setConfirmDelete({ open: false, id: null });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentTerm({
            ...currentTerm,
            [name]: value
        });
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setCurrentTerm({
            ...currentTerm,
            [name]: value
        });
    };

    // Helper function for status chips
    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'Đang diễn ra': return 'success';
            case 'Đã kết thúc': return 'default';
            case 'Chưa diễn ra': return 'info';
            default: return 'default';
        }
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
                        minHeight: '200px',
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
                        Quản lý năm học và học kỳ
                    </Typography>
                    
                    {/* Year Filter and Add Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                            <InputLabel id="year-filter-label">Lọc theo năm học</InputLabel>
                            <Select
                                labelId="year-filter-label"
                                value={yearFilter}
                                label="Lọc theo năm học"
                                onChange={(e) => setYearFilter(e.target.value)}
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
                                <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                    Tất cả năm học
                                </MenuItem>
                                {uniqueYears.map(year => (
                                    <MenuItem key={year} value={year} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog(false)}
                            sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px' }}
                        >
                            Thêm học kỳ
                        </Button>
                    </Box>

                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Table size="medium" stickyHeader>                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '20%' }}>Năm học</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '15%' }}>Học kỳ</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '20%' }}>Ngày bắt đầu</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '20%' }}>Ngày kết thúc</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '15%' }}>Trạng thái</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6', width: '10%' }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTerms.map((term) => (
                                    <TableRow
                                        key={term.id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5',
                                            },
                                            '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                        }}
                                    >                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', fontWeight: 600 }}>{term.year}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{term.semester}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{formatDate(term.startDate)}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>{formatDate(term.endDate)}</TableCell>
                                        <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>
                                            <Chip 
                                                label={term.status} 
                                                color={getStatusChipColor(term.status)} 
                                                size="small" 
                                                sx={{ fontWeight: 600 }} 
                                            />
                                        </TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleOpenDialog(true, term)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteTerm(term.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
            
            {/* Dialog for adding/editing terms */}
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
                    {isEditing ? "Chỉnh sửa học kỳ" : "Thêm học kỳ mới"}
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
                                name="year"
                                label="Năm học"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                placeholder="Ví dụ: 2024-2025"
                                value={currentTerm.year}
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
                                <InputLabel id="semester-select-label" sx={{ fontWeight: 500 }}>Học kỳ</InputLabel>
                                <Select
                                    labelId="semester-select-label"
                                    name="semester"
                                    value={currentTerm.semester}
                                    label="Học kỳ"
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
                                    <MenuItem value="HK1" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ 1</MenuItem>
                                    <MenuItem value="HK2" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ 2</MenuItem>
                                    <MenuItem value="HK3" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Học kỳ Hè</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                name="startDate"
                                label="Ngày bắt đầu học kỳ"
                                type="date"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={currentTerm.startDate}
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
                                label="Ngày kết thúc học kỳ"
                                type="date"
                                fullWidth
                                margin="normal"
                                required
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={currentTerm.endDate}
                                onChange={handleInputChange}
                                sx={{
                                    borderRadius: '12px',
                                    background: '#f7faff',
                                    '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                    '& .MuiInputLabel-root': { fontWeight: 500 },
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                }}
                            />                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                <InputLabel id="status-select-label" sx={{ fontWeight: 500 }}>Trạng thái</InputLabel>
                                <Select
                                    labelId="status-select-label"
                                    name="status"
                                    value={currentTerm.status}
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
                                    <MenuItem value="Chưa diễn ra" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Chưa diễn ra</MenuItem>
                                    <MenuItem value="Đang diễn ra" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Đang diễn ra</MenuItem>
                                    <MenuItem value="Đã kết thúc" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Đã kết thúc</MenuItem>
                                </Select>
                            </FormControl>
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
                    <Button variant="contained" color="primary" onClick={handleSaveTerm}>
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
                    Xác nhận xóa học kỳ
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
                        Bạn có chắc chắn muốn xóa học kỳ này không?
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