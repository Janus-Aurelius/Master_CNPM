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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
    Button,
    Divider,
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
    IconButton,
    FormGroup,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack
} from "@mui/material";
import {
    Security,
    Payment,
    Backup,
    Schedule,
    Search,
    FilterList,
    CloudDownload,
    Save,
    Refresh,
    Info,
    Warning,
    Error
} from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { systemAdminApi, BackupHistory, AuditLog, SystemSettings } from "../api_clients/systemAdminApi";

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
    const [backupInProgress, setBackupInProgress] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dữ liệu thực tế từ API
    const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [settings, setSettings] = useState<SystemSettings | null>(null);

    // Form states (sẽ lấy từ settings)
    const [securitySettings, setSecuritySettings] = useState<any>({});
    const [integrationSettings, setIntegrationSettings] = useState<any>({});
    const [backupSettings, setBackupSettings] = useState<any>({});
    const [maintenanceSettings, setMaintenanceSettings] = useState<any>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [settingsData, backupData, auditData] = await Promise.all([
                    systemAdminApi.getSettings(),
                    systemAdminApi.getBackupHistory(),
                    systemAdminApi.getAuditLogs()
                ]);
                setSettings(settingsData);
                setSecuritySettings(settingsData.security);
                setIntegrationSettings(settingsData.integration);
                setBackupSettings(settingsData.backup);
                setMaintenanceSettings(settingsData.maintenance);
                setBackupHistory(backupData);
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
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === "all" || log.status === filterType;

        return matchesSearch && matchesFilter;
    });

    const handleSaveSettings = async (section: string) => {
        try {
            let data;
            if (section === "security") data = securitySettings;
            else if (section === "integration") data = integrationSettings;
            else if (section === "backup") data = backupSettings;
            else if (section === "maintenance") data = maintenanceSettings;
            await systemAdminApi.updateSettings(section, data);
            setSnackbar({ open: true, message: "Lưu cấu hình thành công!", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Lưu cấu hình thất bại!", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleStartManualBackup = async () => {
        try {
            setBackupInProgress(true);
            await systemAdminApi.startBackup();
            setSnackbar({ open: true, message: "Backup thành công!", severity: "success" });
            // Reload backup history
            const backupData = await systemAdminApi.getBackupHistory();
            setBackupHistory(backupData);
        } catch (err) {
            setSnackbar({ open: true, message: "Backup thất bại!", severity: "error" });
        } finally {
            setBackupInProgress(false);
        }
    };

    const handleConfirmDialog = () => {
        if (confirmDialog.action === "backup") {
            handleStartManualBackup();
        } else if (confirmDialog.action === "maintenance") {
            handleToggleMaintenance();
        }
    };

    const handleCancelDialog = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
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
                    <Tab icon={<Payment />} label="Tích hợp" />
                    <Tab icon={<Backup />} label="Sao lưu" />
                    <Tab icon={<Schedule />} label="Bảo trì" />
                    <Tab icon={<Search />} label="Nhật ký hệ thống" />
                </Tabs>
            </Paper>

            {/* Security Settings */}
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
                            onClick={() => handleSaveSettings("Security")}
                            startIcon={<Save />}
                        >
                            Lưu cấu hình
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Integration Settings */}
            {activeTab === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Tích hợp hệ thống
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Cổng thanh toán
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Nhà cung cấp</InputLabel>
                                                <Select
                                                    value={integrationSettings.paymentGateway}
                                                    label="Nhà cung cấp"
                                                    onChange={(e) => setIntegrationSettings({
                                                        ...integrationSettings,
                                                        paymentGateway: e.target.value
                                                    })}
                                                >
                                                    <MenuItem value="stripe">Stripe</MenuItem>
                                                    <MenuItem value="paypal">PayPal</MenuItem>
                                                    <MenuItem value="vnpay">VNPay</MenuItem>
                                                    <MenuItem value="momo">MoMo</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="API Key"
                                                fullWidth
                                                type="password"
                                                value={integrationSettings.apiKey}
                                                onChange={(e) => setIntegrationSettings({
                                                    ...integrationSettings,
                                                    apiKey: e.target.value
                                                })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="URL Webhook"
                                                fullWidth
                                                value={integrationSettings.webhookUrl}
                                                onChange={(e) => setIntegrationSettings({
                                                    ...integrationSettings,
                                                    webhookUrl: e.target.value
                                                })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={integrationSettings.testMode}
                                                        onChange={(e) => setIntegrationSettings({
                                                            ...integrationSettings,
                                                            testMode: e.target.checked
                                                        })}
                                                    />
                                                }
                                                label="Chế độ thử nghiệm"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Dịch vụ Email
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Nhà cung cấp</InputLabel>
                                                <Select
                                                    value={integrationSettings.emailProvider}
                                                    label="Nhà cung cấp"
                                                    onChange={(e) => setIntegrationSettings({
                                                        ...integrationSettings,
                                                        emailProvider: e.target.value
                                                    })}
                                                >
                                                    <MenuItem value="sendgrid">SendGrid</MenuItem>
                                                    <MenuItem value="mailchimp">Mailchimp</MenuItem>
                                                    <MenuItem value="smtp">SMTP Custom</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="API Key"
                                                fullWidth
                                                type="password"
                                                value={integrationSettings.emailApiKey}
                                                onChange={(e) => setIntegrationSettings({
                                                    ...integrationSettings,
                                                    emailApiKey: e.target.value
                                                })}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Dịch vụ SMS
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Nhà cung cấp</InputLabel>
                                                <Select
                                                    value={integrationSettings.smsProvider}
                                                    label="Nhà cung cấp"
                                                    onChange={(e) => setIntegrationSettings({
                                                        ...integrationSettings,
                                                        smsProvider: e.target.value
                                                    })}
                                                >
                                                    <MenuItem value="twilio">Twilio</MenuItem>
                                                    <MenuItem value="vonage">Vonage</MenuItem>
                                                    <MenuItem value="custom">Custom API</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="API Key"
                                                fullWidth
                                                type="password"
                                                value={integrationSettings.smsApiKey}
                                                onChange={(e) => setIntegrationSettings({
                                                    ...integrationSettings,
                                                    smsApiKey: e.target.value
                                                })}
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
                            onClick={() => handleSaveSettings("Integration")}
                            startIcon={<Save />}
                        >
                            Lưu cấu hình
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Backup Settings */}
            {activeTab === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Cấu hình sao lưu
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Cấu hình sao lưu tự động
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={backupSettings.autoBackup}
                                                        onChange={(e) => setBackupSettings({
                                                            ...backupSettings,
                                                            autoBackup: e.target.checked
                                                        })}
                                                    />
                                                }
                                                label="Bật sao lưu tự động"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth disabled={!backupSettings.autoBackup}>
                                                <InputLabel>Tần suất sao lưu</InputLabel>
                                                <Select
                                                    value={backupSettings.backupFrequency}
                                                    label="Tần suất sao lưu"
                                                    onChange={(e) => setBackupSettings({
                                                        ...backupSettings,
                                                        backupFrequency: e.target.value
                                                    })}
                                                >
                                                    <MenuItem value="hourly">Hàng giờ</MenuItem>
                                                    <MenuItem value="daily">Hàng ngày</MenuItem>
                                                    <MenuItem value="weekly">Hàng tuần</MenuItem>
                                                    <MenuItem value="monthly">Hàng tháng</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Thời gian sao lưu"
                                                type="time"
                                                fullWidth
                                                disabled={!backupSettings.autoBackup}
                                                value={backupSettings.backupTime}
                                                onChange={(e) => setBackupSettings({
                                                    ...backupSettings,
                                                    backupTime: e.target.value
                                                })}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Thời gian lưu trữ (ngày)"
                                                type="number"
                                                fullWidth
                                                disabled={!backupSettings.autoBackup}
                                                value={backupSettings.retentionPeriod}
                                                onChange={(e) => setBackupSettings({
                                                    ...backupSettings,
                                                    retentionPeriod: Number(e.target.value)
                                                })}
                                                InputProps={{
                                                    inputProps: { min: 1, max: 365 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth disabled={!backupSettings.autoBackup}>
                                                <InputLabel>Vị trí lưu trữ</InputLabel>
                                                <Select
                                                    value={backupSettings.backupLocation}
                                                    label="Vị trí lưu trữ"
                                                    onChange={(e) => setBackupSettings({
                                                        ...backupSettings,
                                                        backupLocation: e.target.value
                                                    })}
                                                >
                                                    <MenuItem value="local">Máy chủ cục bộ</MenuItem>
                                                    <MenuItem value="cloud">Cloud Storage</MenuItem>
                                                    <MenuItem value="both">Cả hai</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Mức nén</InputLabel>
                                                <Select
                                                    value={backupSettings.compressionLevel}
                                                    label="Mức nén"
                                                    onChange={(e) => setBackupSettings({
                                                        ...backupSettings,
                                                        compressionLevel: e.target.value
                                                    })}
                                                >
                                                    <MenuItem value="none">Không nén</MenuItem>
                                                    <MenuItem value="low">Thấp</MenuItem>
                                                    <MenuItem value="medium">Trung bình</MenuItem>
                                                    <MenuItem value="high">Cao</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormGroup>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={backupSettings.includeUploads}
                                                            onChange={(e) => setBackupSettings({
                                                                ...backupSettings,
                                                                includeUploads: e.target.checked
                                                            })}
                                                        />
                                                    }
                                                    label="Bao gồm tệp tin tải lên"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={backupSettings.encryptBackups}
                                                            onChange={(e) => setBackupSettings({
                                                                ...backupSettings,
                                                                encryptBackups: e.target.checked
                                                            })}
                                                        />
                                                    }
                                                    label="Mã hóa bản sao lưu"
                                                />
                                            </FormGroup>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleStartManualBackup}
                                            disabled={backupInProgress}
                                            startIcon={backupInProgress ? <Refresh /> : <Backup />}
                                        >
                                            {backupInProgress ? "Đang sao lưu..." : "Sao lưu thủ công"}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Save />}
                                            onClick={() => handleSaveSettings("Backup")}
                                        >
                                            Lưu cấu hình
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Lịch sử sao lưu
                                    </Typography>

                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Thời gian</TableCell>
                                                    <TableCell>Loại</TableCell>
                                                    <TableCell>Kích thước</TableCell>
                                                    <TableCell>Trạng thái</TableCell>
                                                    <TableCell align="right">Tải xuống</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {backupHistory.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">
                                                            Không có dữ liệu.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    backupHistory.map((backup) => (
                                                        <TableRow key={backup.id}>
                                                            <TableCell>{backup.date}</TableCell>
                                                            <TableCell>{backup.type}</TableCell>
                                                            <TableCell>{backup.size}</TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={backup.status === 'success' ? 'Thành công' : backup.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                                                                    color={backup.status === 'success' ? 'success' : backup.status === 'warning' ? 'warning' : 'error'}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <IconButton
                                                                    size="small"
                                                                    disabled={backup.status !== 'success'}
                                                                    title="Tải xuống"
                                                                >
                                                                    <CloudDownload />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            {/* Maintenance Settings Tab */}
            {activeTab === 3 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                        Cấu hình bảo trì hệ thống
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Chế độ bảo trì
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Alert severity={maintenanceSettings.maintenanceMode ? "warning" : "info"} sx={{ mb: 2 }}>
                                                {maintenanceSettings.maintenanceMode
                                                    ? "Hệ thống hiện đang trong chế độ bảo trì. Người dùng không thể truy cập."
                                                    : "Hệ thống đang hoạt động bình thường."}
                                            </Alert>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                variant={maintenanceSettings.maintenanceMode ? "outlined" : "contained"}
                                                color={maintenanceSettings.maintenanceMode ? "success" : "warning"}
                                                onClick={handleToggleMaintenance}
                                                fullWidth
                                            >
                                                {maintenanceSettings.maintenanceMode ? "Tắt chế độ bảo trì" : "Bật chế độ bảo trì"}
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                                        Lịch bảo trì tự động
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={maintenanceSettings.scheduledMaintenance}
                                                        onChange={(e) => setMaintenanceSettings({
                                                            ...maintenanceSettings,
                                                            scheduledMaintenance: e.target.checked
                                                        })}
                                                    />
                                                }
                                                label="Bật lịch bảo trì tự động"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth disabled={!maintenanceSettings.scheduledMaintenance}>
                                                <InputLabel>Ngày bảo trì</InputLabel>
                                                <Select
                                                    value={maintenanceSettings.maintenanceDay}
                                                    label="Ngày bảo trì"
                                                    onChange={(e) => setMaintenanceSettings({
                                                        ...maintenanceSettings,
                                                        maintenanceDay: e.target.value
                                                    })}
                                                >
                                                    <MenuItem value="monday">Thứ hai</MenuItem>
                                                    <MenuItem value="tuesday">Thứ ba</MenuItem>
                                                    <MenuItem value="wednesday">Thứ tư</MenuItem>
                                                    <MenuItem value="thursday">Thứ năm</MenuItem>
                                                    <MenuItem value="friday">Thứ sáu</MenuItem>
                                                    <MenuItem value="saturday">Thứ bảy</MenuItem>
                                                    <MenuItem value="sunday">Chủ nhật</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Thời gian bắt đầu"
                                                type="time"
                                                fullWidth
                                                disabled={!maintenanceSettings.scheduledMaintenance}
                                                value={maintenanceSettings.maintenanceTime}
                                                onChange={(e) => setMaintenanceSettings({
                                                    ...maintenanceSettings,
                                                    maintenanceTime: e.target.value
                                                })}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Thời gian bảo trì (phút)"
                                                type="number"
                                                fullWidth
                                                disabled={!maintenanceSettings.scheduledMaintenance}
                                                value={maintenanceSettings.maintenanceDuration}
                                                onChange={(e) => setMaintenanceSettings({
                                                    ...maintenanceSettings,
                                                    maintenanceDuration: Number(e.target.value)
                                                })}
                                                InputProps={{
                                                    inputProps: { min: 15, max: 240 }
                                                }}
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
                                        Thông báo người dùng
                                    </Typography>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={maintenanceSettings.notifyUsers}
                                                        onChange={(e) => setMaintenanceSettings({
                                                            ...maintenanceSettings,
                                                            notifyUsers: e.target.checked
                                                        })}
                                                    />
                                                }
                                                label="Thông báo người dùng trước khi bảo trì"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                label="Thông báo trước (giờ)"
                                                type="number"
                                                fullWidth
                                                disabled={!maintenanceSettings.notifyUsers}
                                                value={maintenanceSettings.notifyTime}
                                                onChange={(e) => setMaintenanceSettings({
                                                    ...maintenanceSettings,
                                                    notifyTime: Number(e.target.value)
                                                })}
                                                InputProps={{
                                                    inputProps: { min: 1, max: 72 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Nội dung thông báo"
                                                fullWidth
                                                multiline
                                                rows={4}
                                                disabled={!maintenanceSettings.notifyUsers}
                                                value={maintenanceSettings.customMessage}
                                                onChange={(e) => setMaintenanceSettings({
                                                    ...maintenanceSettings,
                                                    customMessage: e.target.value
                                                })}
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
                            onClick={() => handleSaveSettings("Maintenance")}
                            startIcon={<Save />}
                        >
                            Lưu cấu hình
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* System Logs Tab */}
            {activeTab === 4 && (
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
                        <FormControl variant="outlined" size="small" sx={{ width: 150 }}>
                            <InputLabel id="status-filter-label">Lọc theo trạng thái</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                label="Lọc theo trạng thái"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <FilterListIcon fontSize="small" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="success">Thành công</MenuItem>
                                <MenuItem value="warning">Cảnh báo</MenuItem>
                                <MenuItem value="error">Lỗi</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Người dùng</TableCell>
                                    <TableCell>Hành động</TableCell>
                                    <TableCell>Tài nguyên</TableCell>
                                    <TableCell>IP</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Chi tiết</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            Không có dữ liệu.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{log.timestamp}</TableCell>
                                                <TableCell>{log.user}</TableCell>
                                                <TableCell>{log.action}</TableCell>
                                                <TableCell>{log.resource}</TableCell>
                                                <TableCell>{log.ipAddress}</TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        {getStatusIcon(log.status)}
                                                        <Chip
                                                            label={log.status === 'success' ? 'Thành công' : log.status === 'warning' ? 'Cảnh báo' : 'Lỗi'}
                                                            color={log.status === 'success' ? 'success' : log.status === 'warning' ? 'warning' : 'error'}
                                                            size="small"
                                                        />
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>{log.details}</TableCell>
                                            </TableRow>
                                        ))
                                )}
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

            {/* Confirmation Dialog */}
            <Dialog open={confirmDialog.open} onClose={handleCancelDialog}>
                <DialogTitle>{confirmDialog.title}</DialogTitle>
                <DialogContent>
                    <Typography>{confirmDialog.message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDialog}>Hủy</Button>
                    <Button
                        variant="contained"
                        color={confirmDialog.action === 'maintenance' && maintenanceSettings.maintenanceMode ? 'success' : 'primary'}
                        onClick={handleConfirmDialog}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity as any} onClose={handleCloseSnackbar}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeLayout>
    );
}