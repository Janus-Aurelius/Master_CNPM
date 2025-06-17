import { useEffect, useState } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import {
    Typography,
    Box,
    Paper,
    Tabs,
    Tab,
    Button,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Card,
    CardContent,
    Alert,
    Snackbar,
    Divider,
    Pagination,
    CircularProgress,
    Autocomplete
} from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { User } from "../types";
import UserInfo from "../components/UserInfo";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import { userAdminApi, AdminUser, AdminRole } from "../api_clients/userAdminApi";

interface UserManagementProps {
    user: User | null;
    onLogout: () => void;
}

const permissionNames = {
    view_subjects: "Xem danh sách môn học",
    register_subjects: "Đăng ký môn học",
    view_grades: "Xem điểm",
    manage_users: "Quản lý người dùng",
    manage_finances: "Quản lý tài chính"
};

// Column widths for consistent table display
const columnWidths = {
    name: 180,
    email: 200,
    role: 140,
    department: 160,
    status: 120,
    actions: 120,
};

const departmentMap = {
    'Công nghệ phần mềm': 'KTPM',
    'Hệ thống thông tin': 'HTTT',
    'Khoa học máy tính': 'KHMT',
    'Kỹ thuật máy tính': 'KTMT',
    'Truyền thông & Mạng máy tính': 'TTMT',
    'An toàn thông tin': 'ATTT'
};

export default function UserManagement({user, onLogout}: UserManagementProps) {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [roles, setRoles] = useState<AdminRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<"add" | "edit" | "delete">("add");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<AdminUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await userAdminApi.getUsers(page, 10, filterRole);
            console.log('Frontend received data:', response); // Debug log
            setUsers(response.users);
            setTotalPages(response.totalPages);
            setError(null);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Không thể tải dữ liệu người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, filterRole]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (user.studentid?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenAddDialog = () => {
        setDialogType("add");
        setCurrentUser({
            name: "",
            studentId: "",
            role: "N3",
            status: "active",
            department: ""
        });
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (user: any) => {
        setDialogType("edit");
        setCurrentUser({...user});
        setOpenDialog(true);
    };

    const handleOpenDeleteDialog = (user: any) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            handleDeleteUser(userToDelete.id);
        }
        handleCloseDeleteDialog();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUser(null);
    };

    const handleSaveUser = async () => {
        try {
            setIsLoading(true);
            if (dialogType === "add") {
                await userAdminApi.createUser({
                    ...currentUser,
                    studentId: currentUser.studentid,
                });
            } else if (dialogType === "edit") {
                const majorId = departmentMap[currentUser.department as keyof typeof departmentMap];
                await userAdminApi.updateUser(currentUser.id, {
                    ...currentUser,
                    department: majorId,
                });
            }
            await fetchUsers();
            handleCloseDialog();
            showSnackbar("Thao tác thành công");
        } catch (err) {
            console.error("Error:", err);
            if (typeof err === "object" && err !== null && "response" in err) {
                // @ts-ignore
                setError(err.response?.data?.message || "Có lỗi xảy ra");
            } else {
                setError("Có lỗi xảy ra");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await userAdminApi.deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            showSnackbar("Người dùng đã bị xóa thành công");
        } catch (err) {
            setError("Xóa người dùng thất bại.");
        }
    };

    const handleUpdatePermission = async (roleId: number, permissionId: number, granted: boolean) => {
        try {
            const role = roles.find(r => r.id === roleId);
            if (!role) return;
            const updatedPermissions = role.permissions.map(p =>
                p.id === permissionId ? { ...p, granted } : p
            );
            const updatedRole = await userAdminApi.updateRolePermissions(roleId, updatedPermissions);
            setRoles(roles.map(r => r.id === roleId ? updatedRole : r));
        } catch (err) {
            setError("Cập nhật quyền thất bại.");
        }
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSearch = async (value: string) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        if (!value.trim()) {
            setSearchResults([]);
            setSearchTerm(""); // Reset search term
            try {
                setIsLoading(true);
                const response = await userAdminApi.getUsers(page, 10, filterRole);
                setUsers(response.users);
                setTotalPages(response.totalPages);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Không thể tải dữ liệu người dùng");
            } finally {
                setIsLoading(false);
            }
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setIsSearching(true);
                const filteredResults = users.filter(user => 
                    user.name.toLowerCase().includes(value.toLowerCase()) ||
                    user.studentid.toLowerCase().includes(value.toLowerCase())
                );
                setSearchResults(filteredResults);
            } catch (error) {
                console.error('Error searching users:', error);
                setError('Lỗi khi tìm kiếm người dùng');
            } finally {
                setIsSearching(false);
            }
        }, 300);

        setSearchTimeout(timeout);
    };

    if (isLoading) {
        return (
            <ThemeLayout role="admin" onLogout={onLogout}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </ThemeLayout>
        );
    }

    if (error) {
        return (
            <ThemeLayout role="admin" onLogout={onLogout}>
                <Alert severity="error" sx={{ mt: 4 }}>
                    {error}
                </Alert>
            </ThemeLayout>
        );
    }

    return (
        <ThemeLayout role="admin" onLogout={onLogout}>
            <UserInfo user={user} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.25rem' }}>                <Paper
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
                        overflow: 'hidden',
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
                        Quản lý người dùng
                    </Typography>

                    {/* Users List Tab */}
                    {tabValue === 0 && (
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={12} md={8.5}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Autocomplete
                                            freeSolo
                                            options={searchResults.length > 0 ? searchResults : users}
                                            getOptionLabel={(option) => 
                                                typeof option === 'string' ? option : option.name
                                            }
                                            filterOptions={(x) => x}
                                            loading={isSearching}
                                            onInputChange={(_, newValue) => {
                                                handleSearch(newValue);
                                            }}
                                            onChange={(_, newValue) => {
                                                if (typeof newValue === 'object' && newValue) {
                                                    setSearchTerm(newValue.name);
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    placeholder="Tìm kiếm người dùng..."
                                                    variant="outlined"
                                                    size="small"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <>
                                                                <InputAdornment position="start">
                                                                    <SearchIcon />
                                                                </InputAdornment>
                                                                {params.InputProps.startAdornment}
                                                            </>
                                                        ),
                                                        endAdornment: (
                                                            <>
                                                                {isSearching ? (
                                                                    <CircularProgress color="inherit" size={20} />
                                                                ) : null}
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                    sx={{
                                                        fontFamily: '"Varela Round", sans-serif',
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: '9px',
                                                        },
                                                    }}
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                    <Box>
                                                        <Typography variant="body1">{option.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {option.studentid} - {option.department}
                                                        </Typography>
                                                    </Box>
                                                </li>
                                            )}
                                            sx={{
                                                width: '100%',
                                                '& .MuiAutocomplete-listbox': {
                                                    maxHeight: '200px',
                                                },
                                            }}
                                        />
                                        <FormControl size="small" sx={{ minWidth: 180 }}>
                                            <InputLabel id="role-filter-label">Lọc theo vai trò</InputLabel>
                                            <Select
                                                labelId="role-filter-label"
                                                value={filterRole}
                                                onChange={(e: SelectChangeEvent) => setFilterRole(e.target.value)}
                                                label="Lọc theo vai trò"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <FilterListIcon fontSize="small" />
                                                    </InputAdornment>
                                                }
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
                                                <MenuItem value="all">Tất cả</MenuItem>
                                                <MenuItem value="N3">Sinh viên</MenuItem>
                                                <MenuItem value="N2">Phòng đào tạo</MenuItem>
                                                <MenuItem value="N4">Phòng tài chính</MenuItem>
                                                <MenuItem value="N1">Quản trị viên</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={3.5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={handleOpenAddDialog}
                                        sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '8px', boxShadow: 'none', whiteSpace: 'nowrap' }}
                                    >
                                        Thêm người dùng
                                    </Button>
                                </Grid>
                            </Grid>                            <TableContainer 
                                component={Paper} 
                                sx={{ 
                                    mt: 1, 
                                    borderRadius: '8px', 
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
                                    border: '1px solid #e0e0e0', 
                                    width: '100%', 
                                    maxWidth: 950,
                                    minWidth: 700,
                                    maxHeight: 'calc(100vh - 350px)',
                                    overflowX: 'auto',
                                    '&::-webkit-scrollbar': {
                                        width: '6px'
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        borderRadius: '6px'
                                    }
                                }}
                            >
                                <Table stickyHeader size="small" sx={{ tableLayout: 'fixed' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Họ tên</TableCell>
                                            <TableCell>Mã số sinh viên</TableCell>
                                            <TableCell>Vai trò</TableCell>
                                            <TableCell>Khoa/Phòng ban</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                            <TableCell>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    Không có dữ liệu người dùng.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow 
                                                    key={user.id}
                                                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child td, &:last-child th': { borderBottom: 'none' } }}
                                                >
                                                    <TableCell sx={{ minWidth: 120, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800 }}>{user.name}</TableCell>
                                                    <TableCell sx={{ minWidth: 160, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{user.studentid}</TableCell>
                                                    <TableCell sx={{ minWidth: 110, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                                                        {user.role === 'N3' && 'Sinh viên'}
                                                        {user.role === 'N2' && 'Phòng đào tạo'}
                                                        {user.role === 'N4' && 'Phòng tài chính'}
                                                        {user.role === 'N1' && 'Quản trị viên'}
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: 140, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{user.department}</TableCell>
                                                    <TableCell sx={{ minWidth: 100, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                                                        <Box
                                                            sx={{
                                                                display: 'inline-block',
                                                                px: 2,
                                                                py: 1,
                                                                borderRadius: '20px',
                                                                ...(user.status === 'active' ? 
                                                                    { bgcolor: '#e0f7fa', color: '#00838f' } : 
                                                                    { bgcolor: '#ffebee', color: '#c62828' })
                                                            }}
                                                        >
                                                            {user.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ minWidth: 90, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                                                        <IconButton size="small" onClick={() => handleOpenEditDialog(user)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(user)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(_e, value) => setPage(value)}
                                    sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                                />
                            </TableContainer>
                        </Box>
                    )}


                    {/* User Dialog (Add/Edit) */}
                    <Dialog 
                        open={openDialog && dialogType !== "delete"} 
                        onClose={handleCloseDialog} 
                        maxWidth="sm" 
                        fullWidth
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
                            {dialogType === "add" ? "Thêm người dùng mới" : "Chỉnh sửa thông tin người dùng"}
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
                                        label="Họ và tên"
                                        fullWidth
                                        value={currentUser?.name || ''}
                                        onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
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
                                        label="Mã số sinh viên"
                                        fullWidth
                                        value={currentUser?.studentid || ''}
                                        disabled={dialogType === "edit"}
                                        onChange={(e) => setCurrentUser({...currentUser, studentid: e.target.value})}
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
                                    <FormControl fullWidth sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                        <InputLabel sx={{ fontWeight: 500 }}>Vai trò</InputLabel>
                                        <Select
                                            value={currentUser?.role || 'N3'}
                                            disabled
                                            label="Vai trò"
                                            onChange={(e: SelectChangeEvent) => setCurrentUser({...currentUser, role: e.target.value})}
                                        >
                                            <MenuItem value="N3">Sinh viên</MenuItem>
                                            <MenuItem value="N2">Phòng đào tạo</MenuItem>
                                            <MenuItem value="N4">Phòng tài chính</MenuItem>
                                            <MenuItem value="N1">Quản trị viên</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                        <InputLabel sx={{ fontWeight: 500 }}>Trạng thái</InputLabel>
                                        <Select
                                            value={currentUser?.status || 'active'}
                                            label="Trạng thái"
                                            onChange={(e: SelectChangeEvent) => setCurrentUser({...currentUser, status: e.target.value})}
                                        >
                                            <MenuItem value="active">Hoạt động</MenuItem>
                                            <MenuItem value="inactive">Vô hiệu</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {currentUser?.role === 'N3' && (
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Khoa"
                                            fullWidth
                                            value={currentUser?.department || ''}
                                            onChange={(e) => setCurrentUser({...currentUser, department: e.target.value})}
                                            sx={{
                                                borderRadius: '12px',
                                                background: '#f7faff',
                                                '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                                '& .MuiInputLabel-root': { fontWeight: 500 },
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                            }}
                                        />
                                    </Grid>
                                )}
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
                            <Button onClick={handleCloseDialog}>Hủy</Button>
                            <Button variant="contained" onClick={handleSaveUser} sx={{ borderRadius: '8px', boxShadow: 'none' }}>
                                {dialogType === "add" ? "Tạo người dùng" : "Lưu thay đổi"}
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog 
                        open={deleteDialogOpen} 
                        onClose={handleCloseDeleteDialog}
                        aria-labelledby="delete-dialog-title"
                        aria-describedby="delete-dialog-description"
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '16px',
                            },
                        }}
                    >
                        <DialogTitle id="delete-dialog-title" sx={{ fontFamily: '"Roboto", sans-serif', fontWeight: 500 }}>
                            Xóa tài khoản này?
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
                                Bạn có chắc chắn muốn xóa tài khoản {userToDelete?.name}?
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
                            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                                Xóa
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Snackbar for notifications */}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={4000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert severity="success" onClose={handleCloseSnackbar}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Paper>
            </Box>
        </ThemeLayout>
    );
}