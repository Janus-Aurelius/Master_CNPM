import {ThemeLayout} from "../styles/theme_layout.tsx";
import Typography from "@mui/material/Typography";
import {User} from "../types";
import { useState } from "react";
import { Box, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Chip, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, Snackbar, Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UserInfo from '../components/UserInfo';
import SearchIcon from '@mui/icons-material/Search';

const priorityGroupTypes = [
    "Người dân tộc thiểu số",
    "Anh hùng Lực lượng vũ trang", 
    "Thương binh",
    "Con liệt sĩ",
    "Con thương binh",
    "Người nhiễm chất độc hóa học",
    "Người khuyết tật",
    "Hộ nghèo",
    "Vùng đặc biệt khó khăn",
    "Xã biên giới – hải đảo"
];

interface PriorityGroup {
    id: number;
    name: string;
    type: string;
    discount: number; // %
    description: string;
}

interface FinancialPageProps {
    user: User | null;
    onLogout: () => void;
}

export default function TuitionAdjustment({ user, onLogout }: FinancialPageProps) {
    const [perCreditFee, setPerCreditFee] = useState(350000);
    const [editFee, setEditFee] = useState(false);
    const [feeInput, setFeeInput] = useState(perCreditFee);
    
    const [targetGroups, setTargetGroups] = useState<PriorityGroup[]>(
        [
            { id: 1, name: "Người dân tộc thiểu số", type: "Đối tượng dân tộc", discount: 70, description: "Giảm 70% học phí cho sinh viên người dân tộc thiểu số" },
            { id: 2, name: "Anh hùng Lực lượng vũ trang", type: "Đối tượng chính sách", discount: 100, description: "Miễn 100% học phí cho anh hùng lực lượng vũ trang" },
            { id: 3, name: "Thương binh", type: "Đối tượng chính sách", discount: 100, description: "Miễn 100% học phí cho thương binh" },
            { id: 4, name: "Con liệt sĩ", type: "Đối tượng chính sách", discount: 100, description: "Miễn 100% học phí cho con liệt sĩ" },
            { id: 5, name: "Con thương binh", type: "Đối tượng chính sách", discount: 50, description: "Giảm 50% học phí cho con thương binh" },
            { id: 6, name: "Người khuyết tật", type: "Đối tượng xã hội", discount: 70, description: "Giảm 70% học phí cho người khuyết tật" },
            { id: 7, name: "Hộ nghèo", type: "Đối tượng xã hội", discount: 70, description: "Giảm 70% học phí cho hộ nghèo" },
            { id: 8, name: "Vùng đặc biệt khó khăn", type: "Đối tượng khu vực", discount: 70, description: "Giảm 70% học phí cho vùng đặc biệt khó khăn" },
        ]
    );
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTargetGroup, setCurrentTargetGroup] = useState<PriorityGroup>({ id: 0, name: '', type: '', discount: 0, description: '' });
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean, id: number | null }>({ open: false, id: null });
    const [search, setSearch] = useState("");

    // Fee edit handlers
    const handleEditFee = () => { setEditFee(true); setFeeInput(perCreditFee); };
    const handleCancelFee = () => { setEditFee(false); setFeeInput(perCreditFee); };
    const handleSaveFee = () => {
        setPerCreditFee(feeInput);
        setEditFee(false);
        setSnackbar({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
    };

    // Target group handlers    
    const handleOpenAdd = () => {
        setIsEditing(false);
        setCurrentTargetGroup({ id: 0, name: '', type: '', discount: 0, description: '' });
        setOpenDialog(true);
    };
    const handleOpenEdit = (group: PriorityGroup) => {
        setIsEditing(true);
        setCurrentTargetGroup(group);
        setOpenDialog(true);
    };
    const handleDelete = (id: number) => {
        setConfirmDelete({ open: true, id });
    };
    const handleDialogClose = () => setOpenDialog(false);
    const handleDialogSave = () => {
        if (!currentTargetGroup.name.trim() || currentTargetGroup.discount < 0 || currentTargetGroup.discount > 100) {
            setSnackbar({ open: true, message: 'Vui lòng nhập hợp lệ.', severity: 'error' });
            return;
        }
        if (isEditing) {
            setTargetGroups(targetGroups.map(g => g.id === currentTargetGroup.id ? currentTargetGroup : g));
            setSnackbar({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
        } else {
            setTargetGroups([...targetGroups, { ...currentTargetGroup, id: Date.now() }]);
            setSnackbar({ open: true, message: 'Thêm mới thành công!', severity: 'success' });
        }
        setOpenDialog(false);
    };
    const handleConfirmDelete = () => {
        if (confirmDelete.id !== null) {
            setTargetGroups(targetGroups.filter(g => g.id !== confirmDelete.id));
            setSnackbar({ open: true, message: 'Đã xóa đối tượng ưu tiên.', severity: 'success' });
        }
        setConfirmDelete({ open: false, id: null });
    };
    const handleCancelDelete = () => setConfirmDelete({ open: false, id: null });

    // Filtered groups for search
    const filteredGroups = targetGroups.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ThemeLayout role="financial" onLogout={onLogout}>
            <UserInfo user={user} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Paper
                    elevation={2}
                    sx={{
                        textAlign: 'left',
                        borderRadius: '14px',
                        p: { xs: 2, sm: 3 },
                        fontSize: '17px',
                        fontFamily: 'Varela Round, sans-serif',
                        fontWeight: 450,
                        backgroundColor: '#fafbfc',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        color: 'rgb(39, 89, 217)',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'auto',
                        marginTop: { xs: '2rem', sm: '2.5rem' },
                        flexGrow: 1,
                        minHeight: 420,
                        maxHeight: 'calc(100vh - 120px)',
                        mx: { xs: 0, sm: 2 },
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            fontFamily: 'Montserrat, sans-serif',
                            color: 'rgba(33,33,33,0.85)',
                            mb: 2,
                            mt: 0,
                            textAlign: 'center',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                        }}
                    >
                        Quản lý học phí
                    </Typography>
                    {/* Per-credit fee section */}
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', fontFamily: 'Varela Round, sans-serif', minWidth: 170 }}>Học phí mỗi tín chỉ:</Typography>
                        {editFee ? (
                            <>
                                <TextField
                                    type="number"
                                    value={feeInput}
                                    onChange={e => setFeeInput(Number(e.target.value))}
                                    size="small"
                                    sx={{ width: 120 }}
                                    inputProps={{ min: 0, step: 1000 }}
                                />
                                <Button variant="contained" color="primary" onClick={handleSaveFee} sx={{ ml: 1, minWidth: 70 }}>Lưu</Button>
                                <Button variant="outlined" onClick={handleCancelFee} sx={{ minWidth: 70 }}>Hủy</Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 700, minWidth: 120 }}>{perCreditFee.toLocaleString()} VNĐ</Typography>
                                <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditFee} sx={{ fontFamily: 'Varela Round, sans-serif', borderRadius: '20px', minWidth: 120 }}>Chỉnh sửa</Button>
                            </>
                        )}
                    </Box>
                    {/* Priority group table */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', fontFamily: 'Varela Round, sans-serif', fontSize: { xs: '1.1rem', sm: '1.2rem' } }}>Đối tượng ưu tiên</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    size="small"
                                    placeholder="Tìm kiếm..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ color: '#b0b0b0', mr: 1 }} fontSize="small" />,
                                        sx: { borderRadius: '8px', background: '#f7faff', fontFamily: 'Varela Round, sans-serif', height: 36 }
                                    }}
                                    sx={{ width: { xs: 180, sm: 390 }, mr: 1 }}
                                />
                                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: '8px', fontFamily: 'Varela Round, sans-serif', minWidth: 120, fontWeight: 600 }}>Thêm đối tượng</Button>
                            </Box>
                        </Box>
                        <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', minWidth: 100, fontFamily: 'Varela Round, sans-serif', mt: 1 }}>
                            <Table size="medium" sx={{ fontFamily: 'Varela Round, sans-serif' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', fontSize: '1rem', backgroundColor: '#6ebab6', width: 180, fontFamily: 'Varela Round, sans-serif', borderTopLeftRadius: '8px' }}>Tên đối tượng</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', fontSize: '1rem', backgroundColor: '#6ebab6', width: 60, fontFamily: 'Varela Round, sans-serif' }}>Mức giảm (%)</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff', fontSize: '1rem', backgroundColor: '#6ebab6', textAlign: 'center', width: 120, fontFamily: 'Varela Round, sans-serif', borderTopRightRadius: '8px' }}>Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ fontFamily: 'Varela Round, sans-serif' }}>
                                    {filteredGroups.map(group => (
                                        <TableRow key={group.id} sx={{ fontFamily: 'Varela Round, sans-serif', '&:last-child td, &:last-child th': { borderBottom: 'none' } }}>
                                            <TableCell sx={{ fontWeight: 600, width: 180, fontFamily: 'Varela Round, sans-serif', fontSize: '1rem' }}>{group.name}</TableCell>
                                            <TableCell sx={{ width: 60, fontFamily: 'Varela Round, sans-serif', fontSize: '1rem' }}>{group.discount}%</TableCell>
                                            <TableCell align="center" sx={{ width: 120, fontFamily: 'Varela Round, sans-serif' }}>
                                                <IconButton onClick={() => handleOpenEdit(group)} sx={{ fontFamily: 'Varela Round, sans-serif' }}><EditIcon /></IconButton>
                                                <IconButton color="error" onClick={() => { setConfirmDelete({ open: true, id: group.id }); }} sx={{ fontFamily: 'Varela Round, sans-serif' }}><DeleteIcon /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredGroups.length === 0 && (
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { borderBottom: 'none' } }}>
                                            <TableCell colSpan={3} align="center" sx={{ fontFamily: 'Varela Round, sans-serif' }}>Không tìm thấy đối tượng phù hợp.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Paper>
            </Box>
            {/* Dialog for add/edit priority group */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '18px',
                        background: '#fff',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
                        p: 0,
                    },
                }}
            >
                <DialogTitle sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    color: '#4c4c4c',
                    textAlign: 'center',
                    pb: 0,
                    pt: 3
                }}>
                    {isEditing ? 'Chỉnh sửa đối tượng ưu tiên' : 'Thêm đối tượng ưu tiên'}
                </DialogTitle>
                <DialogContent dividers sx={{
                    border: 'none',
                    px: 4,
                    pt: 2,
                    pb: 0,
                    background: 'transparent',
                    fontFamily: 'Varela Round, sans-serif'
                }}>
                    <Grid container spacing={2} sx={{ mt: 0.5, fontFamily: 'Varela Round, sans-serif' }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Tên đối tượng"
                                fullWidth
                                value={currentTargetGroup.name}
                                onChange={e => setCurrentTargetGroup({ ...currentTargetGroup, name: e.target.value })}
                                sx={{ borderRadius: '10px', background: '#f7faff', '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Varela Round, sans-serif' }, fontFamily: 'Varela Round, sans-serif' }}
                                InputLabelProps={{ sx: { fontFamily: 'Varela Round, sans-serif' } }}
                                placeholder="Nhập tên đối tượng ưu tiên"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Mức giảm (%)"
                                type="number"
                                fullWidth
                                value={currentTargetGroup.discount}
                                onChange={e => setCurrentTargetGroup({ ...currentTargetGroup, discount: Number(e.target.value) })}
                                inputProps={{ min: 0, max: 100 }}
                                sx={{ borderRadius: '10px', background: '#f7faff', '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Varela Round, sans-serif' }, fontFamily: 'Varela Round, sans-serif' }}
                                InputLabelProps={{ sx: { fontFamily: 'Varela Round, sans-serif' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={3}
                                value={currentTargetGroup.description}
                                onChange={e => setCurrentTargetGroup({ ...currentTargetGroup, description: e.target.value })}
                                sx={{ borderRadius: '10px', background: '#f7faff', '& .MuiOutlinedInput-root': { borderRadius: '10px', fontFamily: 'Varela Round, sans-serif' }, fontFamily: 'Varela Round, sans-serif' }}
                                InputLabelProps={{ sx: { fontFamily: 'Varela Round, sans-serif' } }}
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
                    fontFamily: 'Varela Round, sans-serif'
                }}>
                    <Button onClick={handleDialogClose} sx={{ fontFamily: 'Varela Round, sans-serif', minWidth: 80 }}>Hủy</Button>
                    <Button variant="contained" onClick={handleDialogSave} sx={{ fontFamily: 'Varela Round, sans-serif', minWidth: 100 }}>{isEditing ? 'Cập nhật' : 'Thêm mới'}</Button>
                </DialogActions>
            </Dialog>
            {/* Confirm delete dialog */}
            <Dialog
                open={confirmDelete.open}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '14px',
                    },
                }}
            >
                <DialogTitle id="delete-dialog-title" sx={{ fontFamily: 'Varela Round, sans-serif', fontWeight: 500, fontSize: '1.1rem' }}>
                    Xác nhận xóa đối tượng ưu tiên
                </DialogTitle>
                <DialogContent>
                    <Typography
                        id="delete-dialog-description"
                        component="div"
                        sx={{
                            fontSize: '1rem',
                            color: '#5c6c7c',
                            textAlign: 'center',
                            fontWeight: 400,
                            fontFamily: 'Varela Round, sans-serif'
                        }}
                    >
                        Bạn có chắc chắn muốn xóa đối tượng ưu tiên này không?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ fontFamily: 'Varela Round, sans-serif' }}>
                    <Button onClick={handleCancelDelete} color="primary" sx={{ fontFamily: 'Varela Round, sans-serif', minWidth: 80 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ fontFamily: 'Varela Round, sans-serif', minWidth: 80 }}>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
            </Snackbar>
        </ThemeLayout>
    );
}