import {ThemeLayout} from "../styles/theme_layout.tsx";
import Typography from "@mui/material/Typography";
import {User} from "../types";
import { useState } from "react";
import { Box, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Chip, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText, Snackbar, Alert } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UserInfo from '../components/UserInfo';

const allProvinces = [
    "An Giang", "Bà Rịa – Vũng Tàu", "Bạc Liêu", "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

interface PriorityGroup {
    id: number;
    name: string;
    discount: number; // %
    provinces: string[];
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
            { id: 1, name: "Khu vực 1", discount: 70, provinces: ["Lào Cai", "Điện Biên", "Cao Bằng", "Lâm Đồng"] },
            { id: 2, name: "Khu vực 2", discount: 50, provinces: ["Bình Định", "Gia Lai", "Huế"] },
            { id: 3, name: "Khu vực 2-NT", discount: 60, provinces: ["An Giang", "Cần Thơ"] },
            { id: 4, name: "Khu vực 3", discount: 0, provinces: ["Hà Nội", "TP Hồ Chí Minh"] },
            { id: 5, name: "Ưu tiên vùng cao", discount: 100, provinces: ["Hà Giang"] },
            { id: 6, name: "Không", discount: 0, provinces: [] },
        ]
    );
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTargetGroup, setCurrentTargetGroup] = useState<PriorityGroup>({ id: 0, name: '', discount: 0, provinces: [] });
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success'|'error' }>({ open: false, message: '', severity: 'success' });
    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean, id: number | null }>({ open: false, id: null });

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
        setCurrentTargetGroup({ id: 0, name: '', discount: 0, provinces: [] });
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

    return (
        <ThemeLayout role="financial" onLogout={onLogout}>
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
                            marginBottom: '20px',
                            marginTop: '0px',
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Quản lý học phí
                    </Typography>
                    {/* Per-credit fee section */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'Varela Round, sans-serif' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2', fontFamily: 'Varela Round, sans-serif' }}>Học phí mỗi tín chỉ:</Typography>
                        {editFee ? (
                            <>
                                <TextField
                                    type="number"
                                    value={feeInput}
                                    onChange={e => setFeeInput(Number(e.target.value))}
                                    size="small"
                                    sx={{ width: 140 }}
                                    inputProps={{ min: 0, step: 1000 }}
                                />
                                <Button variant="contained" color="primary" onClick={handleSaveFee} sx={{ ml: 1 }}>Lưu</Button>
                                <Button variant="outlined" onClick={handleCancelFee}>Hủy</Button>
                            </>
                        ) : (
                            <>
                                <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 700 }}>{perCreditFee.toLocaleString()} VNĐ</Typography>
                                <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditFee} sx={{ fontFamily: 'Varela Round, sans-serif', borderRadius: '20px' }}>Chỉnh sửa</Button>
                            </>
                        )}
                    </Box>
                    {/* Priority group table */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' , fontFamily: 'Varela Round, sans-serif'}}>Đối tượng ưu tiên</Typography>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ borderRadius: '8px', fontFamily: 'Varela Round, sans-serif' }}>Thêm đối tượng</Button>
                        </Box>
                        <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', minWidth: 700, fontFamily: 'Varela Round, sans-serif' }}>
                            <Table size="medium" sx={{ fontFamily: 'Varela Round, sans-serif' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.1rem', backgroundColor: '#6ebab6', width: 200, fontFamily: 'Varela Round, sans-serif' }}>Tên đối tượng</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.1rem', backgroundColor: '#6ebab6', width: 120, fontFamily: 'Varela Round, sans-serif' }}>Mức giảm (%)</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.1rem', backgroundColor: '#6ebab6', width: 260, fontFamily: 'Varela Round, sans-serif' }}>Tỉnh áp dụng</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.1rem', backgroundColor: '#6ebab6', textAlign: 'center', width: 120, fontFamily: 'Varela Round, sans-serif' }}>Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ fontFamily: 'Varela Round, sans-serif' }}>
                                    {targetGroups.map(group => (
                                        <TableRow key={group.id} sx={{ fontFamily: 'Varela Round, sans-serif', '&:last-child td, &:last-child th': { borderBottom: 'none' } }}>
                                            <TableCell sx={{ fontWeight: 600, width: 200, fontFamily: 'Varela Round, sans-serif' }}>{group.name}</TableCell>
                                            <TableCell sx={{ width: 120, fontFamily: 'Varela Round, sans-serif' }}>{group.discount}%</TableCell>
                                            <TableCell sx={{ width: 260, fontFamily: 'Varela Round, sans-serif' }}>
                                                {group.provinces.map(p => (
                                                    <Chip key={p} label={p} size="small" sx={{ mr: 0.5, mb: 0.5, fontFamily: 'Varela Round, sans-serif' }} />
                                                ))}
                                            </TableCell>
                                            <TableCell align="center" sx={{ width: 120, fontFamily: 'Varela Round, sans-serif' }}>
                                                <IconButton onClick={() => handleOpenEdit(group)} sx={{ fontFamily: 'Varela Round, sans-serif' }}><EditIcon /></IconButton>
                                                <IconButton color="error" onClick={() => { setConfirmDelete({ open: true, id: group.id }); }} sx={{ fontFamily: 'Varela Round, sans-serif' }}><DeleteIcon /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {targetGroups.length === 0 && (
                                        <TableRow sx={{ '&:last-child td, &:last-child th': { borderBottom: 'none' } }}>
                                            <TableCell colSpan={4} align="center" sx={{ fontFamily: 'Varela Round, sans-serif' }}>Chưa có đối tượng ưu tiên nào.</TableCell>
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
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.98)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        padding: 0,
                    },
                }}
            >
                <DialogTitle sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: '2rem',
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
                    fontFamily: '"Varela Round", sans-serif'
                }}>
                    <Grid container spacing={2} sx={{ mt: 0.5, fontFamily: '"Varela Round", sans-serif' }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Tên đối tượng"
                                fullWidth
                                value={currentTargetGroup.name}
                                onChange={e => setCurrentTargetGroup({ ...currentTargetGroup, name: e.target.value })}
                                sx={{ borderRadius: '12px', background: '#f7faff', '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: 'Varela Round, sans-serif' }, fontFamily: 'Varela Round, sans-serif' }}
                                InputLabelProps={{ sx: { fontFamily: 'Varela Round, sans-serif' } }}
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
                                sx={{ borderRadius: '12px', background: '#f7faff', '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: 'Varela Round, sans-serif' }, fontFamily: 'Varela Round, sans-serif' }}
                                InputLabelProps={{ sx: { fontFamily: 'Varela Round, sans-serif' } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth sx={{ fontFamily: '"Varela Round", sans-serif' }}>
                                <InputLabel sx={{ fontFamily: '"Varela Round", sans-serif' }}>Tỉnh áp dụng</InputLabel>
                                <Select
                                    multiple
                                    value={currentTargetGroup.provinces}
                                    onChange={e => setCurrentTargetGroup({ ...currentTargetGroup, provinces: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })}
                                    input={<OutlinedInput label="Tỉnh áp dụng" sx={{ fontFamily: '"Varela Round", sans-serif' }} />}
                                    renderValue={selected => (selected as string[]).join(', ')}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                                fontFamily: '"Varela Round", sans-serif'
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
                                    {allProvinces.map(province => (
                                        <MenuItem key={province} value={province} sx={{ borderRadius: '9px', fontFamily: '"Varela Round", sans-serif' }}>
                                            <Checkbox
                                                checked={currentTargetGroup.provinces.indexOf(province) > -1}
                                                sx={{
                                                    color: '#1976d2',
                                                    '&.Mui-checked': {
                                                        color: '#1976d2',
                                                    },
                                                    borderRadius: '6px',
                                                    p: 0.5,
                                                    fontFamily: '"Varela Round", sans-serif'
                                                }}
                                                icon={<span style={{ border: '2px solid #b0bec5', borderRadius: 6, width: 20, height: 20, display: 'block', background: '#fff', boxSizing: 'border-box' }} />}
                                                checkedIcon={<span style={{ border: '2px solid #1976d2', background: '#1976d2', borderRadius: 6, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxSizing: 'border-box' }}><svg width="16" height="16" viewBox="0 0 20 20" style={{ display: 'block' }}><polyline points="5,11 9,15 15,7" style={{ fill: 'none', stroke: 'white', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }} /></svg></span>}
                                            />
                                            <ListItemText primary={province} sx={{ fontFamily: '"Varela Round", sans-serif' }} />
                                        </MenuItem>
                                    ))}
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
                    fontFamily: '"Varela Round", sans-serif'
                }}>
                    <Button onClick={handleDialogClose} sx={{ fontFamily: 'Varela Round, sans-serif' }}>Hủy</Button>
                    <Button variant="contained" onClick={handleDialogSave} sx={{ fontFamily: 'Varela Round, sans-serif' }}>{isEditing ? 'Cập nhật' : 'Thêm mới'}</Button>
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
                        borderRadius: '16px',
                    },
                }}
            >
                <DialogTitle id="delete-dialog-title" sx={{ fontFamily: 'Varela Round, sans-serif', fontWeight: 500 }}>
                    Xác nhận xóa khu vực ưu tiên
                </DialogTitle>
                <DialogContent>
                    <Typography
                        id="delete-dialog-description"
                        component="div"
                        sx={{
                            fontSize: '17px',
                            color: '#5c6c7c',
                            textAlign: 'center',
                            fontWeight: 400,
                            fontFamily: 'Varela Round, sans-serif'
                        }}
                    >
                        Bạn có chắc chắn muốn xóa khu vực ưu tiên này không?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ fontFamily: '"Varela Round", sans-serif' }}>
                    <Button onClick={handleCancelDelete} color="primary" sx={{ fontFamily: 'Varela Round, sans-serif' }}>
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ fontFamily: 'Varela Round, sans-serif' }}>
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