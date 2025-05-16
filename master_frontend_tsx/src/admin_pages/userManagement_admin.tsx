import { useState } from "react";
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
    TablePagination,
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
    Divider
} from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { User } from "../types";
import UserInfo from "../components/UserInfo";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";

interface UserManagementProps {
    user: User | null;
    onLogout: () => void;
}

// Mock data for users
const mockUsers = [
    { id: 1, name: "Nguyễn Văn A", email: "student1@university.edu", role: "student", status: "active", department: "Computer Science" },
    { id: 2, name: "Trần Thị B", email: "academic1@university.edu", role: "academic", status: "active", department: "Academic Affairs" },
    { id: 3, name: "Lê Văn C", email: "financial1@university.edu", role: "financial", status: "active", department: "Financial Department" },
    { id: 4, name: "Phạm Thị D", email: "student2@university.edu", role: "student", status: "inactive", department: "Business" },
    { id: 5, name: "Hoàng Văn E", email: "academic2@university.edu", role: "academic", status: "active", department: "Academic Affairs" },
    { id: 6, name: "Vũ Thị F", email: "student3@university.edu", role: "student", status: "active", department: "Engineering" }
];

// Mock data for roles and permissions
const mockRoles = [
    {
        id: 1,
        name: "student",
        displayName: "Sinh viên",
        permissions: [
            { id: 1, name: "view_subjects", granted: true },
            { id: 2, name: "register_subjects", granted: true },
            { id: 3, name: "view_grades", granted: true },
            { id: 4, name: "manage_users", granted: false },
            { id: 5, name: "manage_finances", granted: false }
        ]
    },
    {
        id: 2,
        name: "academic",
        displayName: "Phòng đào tạo",
        permissions: [
            { id: 1, name: "view_subjects", granted: true },
            { id: 2, name: "register_subjects", granted: true },
            { id: 3, name: "view_grades", granted: true },
            { id: 4, name: "manage_users", granted: false },
            { id: 5, name: "manage_finances", granted: false }
        ]
    },
    {
        id: 3,
        name: "financial",
        displayName: "Phòng tài chính",
        permissions: [
            { id: 1, name: "view_subjects", granted: false },
            { id: 2, name: "register_subjects", granted: false },
            { id: 3, name: "view_grades", granted: false },
            { id: 4, name: "manage_users", granted: false },
            { id: 5, name: "manage_finances", granted: true }
        ]
    },
    {
        id: 4,
        name: "admin",
        displayName: "Quản trị viên",
        permissions: [
            { id: 1, name: "view_subjects", granted: true },
            { id: 2, name: "register_subjects", granted: true },
            { id: 3, name: "view_grades", granted: true },
            { id: 4, name: "manage_users", granted: true },
            { id: 5, name: "manage_finances", granted: true }
        ]
    }
];

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

export default function UserManagement({user, onLogout}: UserManagementProps) {
    const [tabValue, setTabValue] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [users, setUsers] = useState(mockUsers);
    const [roles, setRoles] = useState(mockRoles);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<"add" | "edit" | "delete">("add");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    // Filter users based on search and role filter
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenAddDialog = () => {
        setDialogType("add");
        setCurrentUser({
            name: "",
            email: "",
            role: "student",
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

    const handleSaveUser = () => {
        if (dialogType === "add") {
            // Add new user to list
            const newUser = {
                ...currentUser,
                id: Math.max(...users.map(u => u.id)) + 1
            };
            setUsers([...users, newUser]);
            showSnackbar("Người dùng mới đã được tạo thành công");
        } else if (dialogType === "edit") {
            // Update existing user
            setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
            showSnackbar("Thông tin người dùng đã được cập nhật");
        }
        handleCloseDialog();
    };

    const handleDeleteUser = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
        showSnackbar("Người dùng đã bị xóa thành công");
    };

    const handleUpdatePermission = (roleId: number, permissionId: number, granted: boolean) => {
        const updatedRoles = roles.map(role => {
            if (role.id === roleId) {
                const updatedPermissions = role.permissions.map(perm =>
                    perm.id === permissionId ? {...perm, granted} : perm
                );
                return {...role, permissions: updatedPermissions};
            }
            return role;
        });
        setRoles(updatedRoles);
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <ThemeLayout role="admin" onLogout={onLogout}>
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
                            marginBottom: '20px',
                            marginTop: '0px',
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Quản lý người dùng
                    </Typography>                    <Box sx={{ mb: 3 }}>
                        <Tabs 
                            value={tabValue} 
                            onChange={handleChangeTab} 
                            centered
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#1976d2',
                                    height: '3px',
                                    borderRadius: '3px'
                                },
                                '& .MuiTab-root': {
                                    fontFamily: '"Varela Round", sans-serif',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    minHeight: '48px'
                                },
                                '& .Mui-selected': {
                                    color: '#1976d2'
                                }
                            }}
                        >
                            <Tab label="Danh sách người dùng" />
                            <Tab label="Cấu hình quyền" />
                        </Tabs>
                    </Box>

                    {/* Users List Tab */}
                    {tabValue === 0 && (
                        <Box sx={{ p: 2 }}>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Grid item xs={12} md={8.5}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Tìm kiếm người dùng..."
                                            variant="outlined"
                                            size="small"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                fontFamily: '"Varela Round", sans-serif',
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '9px',
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
                                                <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                                <MenuItem value="student" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Sinh viên</MenuItem>
                                                <MenuItem value="academic" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Phòng đào tạo</MenuItem>
                                                <MenuItem value="financial" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Phòng tài chính</MenuItem>
                                                <MenuItem value="admin" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quản trị viên</MenuItem>
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
                            </Grid>

                            <TableContainer component={Paper} sx={{ mt: 1, borderRadius: '8px', boxShadow: 'none', border: '1px solid #e0e0e0', width: '100%', maxWidth: '100%', minWidth: 1100 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ minWidth: columnWidths.name, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Họ tên</TableCell>
                                            <TableCell sx={{ minWidth: columnWidths.email, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Email</TableCell>
                                            <TableCell sx={{ minWidth: columnWidths.role, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Vai trò</TableCell>
                                            <TableCell sx={{ minWidth: columnWidths.department, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Phòng ban</TableCell>
                                            <TableCell sx={{ minWidth: columnWidths.status, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Trạng thái</TableCell>
                                            <TableCell sx={{ minWidth: columnWidths.actions, height: '50px', fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', backgroundColor: '#6ebab6' }}>Thao tác</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((user) => (
                                                <TableRow 
                                                    key={user.id}
                                                    sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, '&:last-child td, &:last-child th': { borderBottom: 'none' } }}
                                                >
                                                    <TableCell sx={{ minWidth: columnWidths.name, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800 }}>{user.name}</TableCell>
                                                    <TableCell sx={{ minWidth: columnWidths.email, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{user.email}</TableCell>
                                                    <TableCell sx={{ minWidth: columnWidths.role, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                                                        {user.role === 'student' && 'Sinh viên'}
                                                        {user.role === 'academic' && 'Phòng đào tạo'}
                                                        {user.role === 'financial' && 'Phòng tài chính'}
                                                        {user.role === 'admin' && 'Quản trị viên'}
                                                    </TableCell>
                                                    <TableCell sx={{ minWidth: columnWidths.department, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{user.department}</TableCell>
                                                    <TableCell sx={{ minWidth: columnWidths.status, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                                                        <Box
                                                            sx={{
                                                                display: 'inline-block',
                                                                px: 2,
                                                                py: 1,
                                                                borderRadius: '20px',
                                                                fontWeight: 700,
                                                                fontSize: '14px',
                                                                ...(user.status === 'active' ? 
                                                                    { bgcolor: '#e0f7fa', color: '#00838f' } : 
                                                                    { bgcolor: '#ffebee', color: '#c62828' })
                                                            }}
                                                        >
                                                            {user.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ minWidth: columnWidths.actions, height: '50px', fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>
                                                        <IconButton size="small" onClick={() => handleOpenEditDialog(user)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(user)}>
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
                                count={filteredUsers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Box>
                    )}

                    {/* Role Configuration Tab */}
                    {tabValue === 1 && (
                        <Box sx={{ p: 2 }}>
                            <Typography
                                variant="h6" 
                                sx={{ 
                                    mb: 2, 
                                    fontFamily: '"Varela Round", sans-serif',
                                    fontWeight: 'bold',
                                    color: '#1976d2',
                                }}
                            >
                                Cấu hình quyền hệ thống
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontFamily: '"Varela Round", sans-serif' }}>
                                Điều chỉnh quyền truy cập cho từng vai trò trong hệ thống.
                            </Typography>

                            <Grid container spacing={3}>
                                {roles.map(role => (
                                    <Grid item xs={12} md={6} key={role.id}>
                                        <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}>
                                            <CardContent>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        mb: 2, 
                                                        fontFamily: '"Varela Round", sans-serif',
                                                        fontWeight: 'bold',
                                                        color: '#1976d2',
                                                    }}
                                                >
                                                    {role.displayName}
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <FormGroup>
                                                    {role.permissions.map(permission => (
                                                        <FormControlLabel
                                                            key={permission.id}
                                                            control={
                                                                <Checkbox
                                                                    checked={permission.granted}
                                                                    onChange={(e) => handleUpdatePermission(role.id, permission.id, e.target.checked)}
                                                                />
                                                            }
                                                            sx={{ fontFamily: '"Varela Round", sans-serif' }}
                                                            label={permissionNames[permission.name as keyof typeof permissionNames] || permission.name}
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
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
                                        label="Email"
                                        fullWidth
                                        type="email"
                                        value={currentUser?.email || ''}
                                        onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
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
                                        <InputLabel sx={{ fontWeight: 500 }}>Vai trò</InputLabel>                                <Select
                                    value={currentUser?.role || 'student'}
                                    label="Vai trò"
                                    onChange={(e: SelectChangeEvent) => setCurrentUser({...currentUser, role: e.target.value})}
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
                                            <MenuItem value="student" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Sinh viên</MenuItem>
                                            <MenuItem value="academic" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Phòng đào tạo</MenuItem>
                                            <MenuItem value="financial" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Phòng tài chính</MenuItem>
                                            <MenuItem value="admin" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Quản trị viên</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ background: '#f7faff', borderRadius: '12px' }}>
                                        <InputLabel sx={{ fontWeight: 500 }}>Trạng thái</InputLabel>                                <Select
                                    value={currentUser?.status || 'active'}
                                    label="Trạng thái"
                                    onChange={(e: SelectChangeEvent) => setCurrentUser({...currentUser, status: e.target.value})}
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
                                            <MenuItem value="active" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Hoạt động</MenuItem>
                                            <MenuItem value="inactive" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Vô hiệu</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Phòng ban"
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
                                {dialogType === "add" && (
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Mật khẩu mặc định"
                                            fullWidth
                                            type="password"
                                            value="123456" // Default password
                                            disabled
                                            helperText="Mật khẩu mặc định: 123456"
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