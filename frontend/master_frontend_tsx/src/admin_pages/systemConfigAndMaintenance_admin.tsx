import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import {
    Typography,
    Box,
    Paper,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Alert,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack
} from "@mui/material";
import {
    Security,
    Schedule,
    Search,
    Save,
    Info,
    Warning,
    Error
} from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { systemAdminApi, AuditLog } from "../api_clients/systemAdminApi";

interface SystemConfigAndMaintenanceProps {
    user: User | null;
    onLogout: () => void;
}

export default function SystemConfigAndMaintenance({ onLogout }: SystemConfigAndMaintenanceProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "", action: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [securitySettings, setSecuritySettings] = useState<any>({});
    const [maintenanceSettings, setMaintenanceSettings] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('auth_token');


                const [securityData, maintenanceData, auditData] = await Promise.all([
                    systemAdminApi.getSecuritySettings(),
                    systemAdminApi.getMaintenanceSettings(),
                    systemAdminApi.getAuditLogs()
                ]);
                setSecuritySettings(securityData);
                setMaintenanceSettings(maintenanceData);
                setAuditLogs(auditData);
                setError(null);
            } catch (err) {
                setError("Không thể tải dữ liệu hệ thống từ server.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch =
            log.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.status.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === "all" || log.status === filterType;

        return matchesSearch && matchesFilter;
    });

    const handleSaveSecurity = async () => {
        try {
            await systemAdminApi.updateSecuritySettings(securitySettings);
            setSnackbar({ open: true, message: "Lưu cấu hình thành công!", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Lưu cấu hình thất bại!", severity: "error" });
        }
    };

    const handleToggleMaintenance = async () => {
        try {
            const enable = !maintenanceSettings.maintenanceMode;
            const result = await systemAdminApi.toggleMaintenance(enable);
            setMaintenanceSettings((prev: any) => ({ ...prev, maintenanceMode: result.maintenanceMode }));
            setSnackbar({ open: true, message: enable ? "Đã bật chế độ bảo trì" : "Đã tắt chế độ bảo trì", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Cập nhật chế độ bảo trì thất bại!", severity: "error" });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "success":
                return <Info color="success" />;
            case "warning":
                return <Warning color="warning" />;
            case "error":
                return <Error color="error" />;
            default:
                return <Info />;
        }
    };

    if (loading) {
        return (
            <ThemeLayout role="admin" onLogout={onLogout}>
                <Typography sx={{ textAlign: 'center', mt: 4 }}>Đang tải dữ liệu...</Typography>
            </ThemeLayout>
        );
    }
    if (error) {
        return (
            <ThemeLayout role="admin" onLogout={onLogout}>
                <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>
            </ThemeLayout>
        );
    }

    return (
        <ThemeLayout role="admin" onLogout={onLogout}>
            <Typography variant="h4" className="font-semibold" sx={{ mb: 3 }}>
                Cấu hình và Bảo trì Hệ thống
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab icon={<Security />} label="Bảo mật" />
                    <Tab icon={<Schedule />} label="Bảo trì" />
                    <Tab icon={<Search />} label="Nhật ký hệ thống" />
                </Tabs>
            </Paper>

            {/* Tab Bảo mật */}
            {activeTab === 0 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Cấu hình bảo mật
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Chính sách mật khẩu
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Độ dài mật khẩu tối thiểu"
                                                type="number"
                                                fullWidth
                                                value={securitySettings.passwordMinLength}
                                                onChange={(e) => setSecuritySettings({
                                                    ...securitySettings,
                                                    passwordMinLength: Number(e.target.value)
                                                })}
                                                InputProps={{
                                                    inputProps: { min: 6, max: 20 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Thời hạn mật khẩu (ngày)"
                                                type="number"
                                                fullWidth
                                                value={securitySettings.passwordExpiry}
                                                onChange={(e) => setSecuritySettings({
                                                    ...securitySettings,
                                                    passwordExpiry: Number(e.target.value)
                                                })}
                                                InputProps={{
                                                    inputProps: { min: 0, max: 365 }
                                                }}
                                                helperText="0 = không hết hạn"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Số lần đăng nhập tối đa"
                                                type="number"
                                                fullWidth
                                                value={securitySettings.loginAttempts}
                                                onChange={(e) => setSecuritySettings({
                                                    ...securitySettings,
                                                    loginAttempts: Number(e.target.value)
                                                })}
                                                InputProps={{
                                                    inputProps: { min: 1, max: 10 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={securitySettings.mfaRequired}
                                                        onChange={(e) => setSecuritySettings({
                                                            ...securitySettings,
                                                            mfaRequired: e.target.checked
                                                        })}
                                                    />
                                                }
                                                label="Yêu cầu xác thực 2 lớp"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Cấu hình phiên đăng nhập
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Thời gian phiên (phút)"
                                                type="number"
                                                fullWidth
                                                value={securitySettings.sessionTimeout}
                                                onChange={(e) => setSecuritySettings({
                                                    ...securitySettings,
                                                    sessionTimeout: Number(e.target.value)
                                                })}
                                                InputProps={{
                                                    inputProps: { min: 5, max: 180 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={securitySettings.ipRestriction}
                                                        onChange={(e) => setSecuritySettings({
                                                            ...securitySettings,
                                                            ipRestriction: e.target.checked
                                                        })}
                                                    />
                                                }
                                                label="Giới hạn IP"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Danh sách IP được phép (ngăn cách bởi dấu phẩy)"
                                                fullWidth
                                                disabled={!securitySettings.ipRestriction}
                                                value={securitySettings.allowedIPs}
                                                onChange={(e) => setSecuritySettings({
                                                    ...securitySettings,
                                                    allowedIPs: e.target.value
                                                })}
                                                placeholder="192.168.1.1, 10.0.0.0/24"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={handleSaveSecurity}
                            startIcon={<Save />}
                        >
                            Lưu cấu hình
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Tab Bảo trì */}
            {activeTab === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Cấu hình bảo trì hệ thống
                    </Typography>
                    <Alert severity={maintenanceSettings.maintenanceMode ? "warning" : "info"} sx={{ mb: 2 }}>
                        {maintenanceSettings.maintenanceMode
                            ? "Hệ thống hiện đang trong chế độ bảo trì. Người dùng không thể truy cập."
                            : "Hệ thống đang hoạt động bình thường."}
                    </Alert>
                    <Button
                        variant={maintenanceSettings.maintenanceMode ? "outlined" : "contained"}
                        color={maintenanceSettings.maintenanceMode ? "success" : "warning"}
                        onClick={handleToggleMaintenance}
                    >
                        {maintenanceSettings.maintenanceMode ? "Tắt chế độ bảo trì" : "Bật chế độ bảo trì"}
                    </Button>
                </Paper>
            )}

            {/* Tab Nhật ký hệ thống */}
            {activeTab === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Nhật ký hệ thống
                    </Typography>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <TextField
                            placeholder="Tìm kiếm nhật ký..."
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
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={filterType === "success"}
                                    onChange={() => setFilterType(filterType === "success" ? "all" : "success")}
                                />
                            }
                            label="Chỉ thành công"
                        />
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Người dùng</TableCell>
                                    <TableCell>Hành động</TableCell>
                                    <TableCell>IP</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLogs
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{log.created_at}</TableCell>
                                            <TableCell>{log.user_id}</TableCell>
                                            <TableCell>{log.action_type}</TableCell>
                                            <TableCell>{log.ip_address}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={log.status === 'success' ? 'Thành công' : log.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                                                    color={log.status === 'success' ? 'success' : log.status === 'warning' ? 'warning' : 'error'}
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredLogs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity as any} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeLayout>
    );
}