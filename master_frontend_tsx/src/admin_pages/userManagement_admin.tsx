import { useState, useEffect } from "react";
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
    Chip,
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
    Tooltip,
    Alert,
    Snackbar,
    Divider
} from "@mui/material";
import { User } from "../types";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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

export default function UserManagement({onLogout}: UserManagementProps) {
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
            <Typography variant="h4" className="font-semibold" sx={{ mb: 3 }}>
                Quản lý người dùng
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={handleChangeTab} centered>
                    <Tab label="Danh sách người dùng" />
                    <Tab label="Cấu hình quyền" />
                </Tabs>
            </Paper>

            {/* Users List Tab */}
            {tabValue === 0 && (
                <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <TextField
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
                            sx={{ width: '40%' }}
                        />
                        <Box>
                            <FormControl variant="outlined" size="small" sx={{ width: 150, mr: 2 }}>
                                <InputLabel id="role-filter-label">Lọc theo vai trò</InputLabel>
                                <Select
                                    labelId="role-filter-label"
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    label="Lọc theo vai trò"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterListIcon fontSize="small" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="all">Tất cả</MenuItem>
                                    <MenuItem value="student">Sinh viên</MenuItem>
                                    <MenuItem value="academic">Phòng đào tạo</MenuItem>
                                    <MenuItem value="financial">Phòng tài chính</MenuItem>
                                    <MenuItem value="admin">Quản trị viên</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleOpenAddDialog}
                            >
                                Thêm người dùng
                            </Button>
                        </Box>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Họ tên</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Vai trò</TableCell>
                                    <TableCell>Phòng ban</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell align="right">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.role === 'student' && 'Sinh viên'}
                                                {user.role === 'academic' && 'Phòng đào tạo'}
                                                {user.role === 'financial' && 'Phòng tài chính'}
                                                {user.role === 'admin' && 'Quản trị viên'}
                                            </TableCell>
                                            <TableCell>{user.department}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.status === 'active' ? 'Hoạt động' : 'Vô hiệu'}
                                                    color={user.status === 'active' ? 'success' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Chỉnh sửa">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleOpenEditDialog(user)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xóa">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenDeleteDialog(user)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
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
                </Paper>
            )}

            {/* Role Configuration Tab */}
            {tabValue === 1 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Cấu hình quyền hệ thống
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Điều chỉnh quyền truy cập cho từng vai trò trong hệ thống.
                    </Typography>

                    <Grid container spacing={3}>
                        {roles.map(role => (
                            <Grid item xs={12} md={6} key={role.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
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
                                                    label={permissionNames[permission.name as keyof typeof permissionNames] || permission.name}
                                                />
                                            ))}
                                        </FormGroup>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {/* User Dialog (Add/Edit) */}
            <Dialog open={openDialog && dialogType !== "delete"} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === "add" ? "Thêm người dùng mới" : "Chỉnh sửa thông tin người dùng"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Họ và tên"
                                fullWidth
                                value={currentUser?.name || ''}
                                onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                fullWidth
                                type="email"
                                value={currentUser?.email || ''}
                                onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    value={currentUser?.role || 'student'}
                                    label="Vai trò"
                                    onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                                >
                                    <MenuItem value="student">Sinh viên</MenuItem>
                                    <MenuItem value="academic">Phòng đào tạo</MenuItem>
                                    <MenuItem value="financial">Phòng tài chính</MenuItem>
                                    <MenuItem value="admin">Quản trị viên</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={currentUser?.status || 'active'}
                                    label="Trạng thái"
                                    onChange={(e) => setCurrentUser({...currentUser, status: e.target.value})}
                                >
                                    <MenuItem value="active">Hoạt động</MenuItem>
                                    <MenuItem value="inactive">Vô hiệu</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phòng ban"
                                fullWidth
                                value={currentUser?.department || ''}
                                onChange={(e) => setCurrentUser({...currentUser, department: e.target.value})}
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
                                />
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button variant="contained" onClick={handleSaveUser}>
                        {dialogType === "add" ? "Tạo người dùng" : "Lưu thay đổi"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Xóa tài khoản này?</DialogTitle>
                <DialogContent>
                    <Typography>
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
        </ThemeLayout>
    );
}