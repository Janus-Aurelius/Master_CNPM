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

interface SystemConfigAndMaintenanceProps {
    user: User | null;
    onLogout: () => void;
}

// Mock backup history data
const mockBackupHistory = [
    { id: 1, date: "2023-08-10 02:00:00", size: "1.2 GB", status: "success", type: "Full" },
    { id: 2, date: "2023-08-09 02:00:00", size: "1.3 GB", status: "success", type: "Full" },
    { id: 3, date: "2023-08-08 02:00:00", size: "400 MB", status: "warning", type: "Incremental" },
    { id: 4, date: "2023-08-07 02:00:00", size: "1.1 GB", status: "error", type: "Full" },
    { id: 5, date: "2023-08-06 02:00:00", size: "1.2 GB", status: "success", type: "Full" },
];

// Mock audit logs
const mockAuditLogs = [
    {
        id: 1,
        timestamp: "2023-08-10 14:32:45",
        user: "admin@example.com",
        action: "User created",
        resource: "users/john.doe",
        ipAddress: "192.168.1.1",
        status: "success",
        details: "Created new student account"
    },
    {
        id: 2,
        timestamp: "2023-08-10 13:15:22",
        user: "financial@example.com",
        action: "Payment processed",
        resource: "payments/456",
        ipAddress: "192.168.1.2",
        status: "success",
        details: "Processed tuition payment for student ID 45678"
    },
    {
        id: 3,
        timestamp: "2023-08-10 12:45:01",
        user: "academic@example.com",
        action: "Course updated",
        resource: "courses/CS101",
        ipAddress: "192.168.1.3",
        status: "warning",
        details: "Modified course schedule after registration period"
    },
    {
        id: 4,
        timestamp: "2023-08-10 11:30:18",
        user: "student@example.com",
        action: "Login attempt",
        resource: "auth/login",
        ipAddress: "192.168.1.4",
        status: "error",
        details: "Failed login attempt: incorrect password (3rd attempt)"
    },
    {
        id: 5,
        timestamp: "2023-08-10 10:00:00",
        user: "system",
        action: "System backup",
        resource: "system/backup",
        ipAddress: "localhost",
        status: "success",
        details: "Automated daily backup completed"
    },
    {
        id: 6,
        timestamp: "2023-08-09 22:15:30",
        user: "admin@example.com",
        action: "Settings changed",
        resource: "system/settings",
        ipAddress: "192.168.1.1",
        status: "success",
        details: "Modified system backup schedule"
    },
    {
        id: 7,
        timestamp: "2023-08-09 18:45:12",
        user: "admin@example.com",
        action: "User deactivated",
        resource: "users/jane.smith",
        ipAddress: "192.168.1.1",
        status: "warning",
        details: "Deactivated user account due to graduation"
    },
];

export default function SystemConfigAndMaintenance({ onLogout }: SystemConfigAndMaintenanceProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [confirmDialog, setConfirmDialog] = useState({ open: false, title: "", message: "", action: "" });
    const [backupInProgress, setBackupInProgress] = useState(false);

    // Form states
    const [securitySettings, setSecuritySettings] = useState({
        passwordMinLength: 8,
        passwordExpiry: 90,
        mfaRequired: true,
        sessionTimeout: 30,
        loginAttempts: 5,
        ipRestriction: false,
        allowedIPs: ""
    });

    const [integrationSettings, setIntegrationSettings] = useState({
        paymentGateway: "stripe",
        apiKey: "sk_test_******************************",
        webhookUrl: "https://university.edu/api/payments/webhook",
        testMode: true,
        emailProvider: "sendgrid",
        emailApiKey: "SG._______________________________",
        smsProvider: "twilio",
        smsApiKey: "SK********************************"
    });

    const [backupSettings, setBackupSettings] = useState({
        autoBackup: true,
        backupFrequency: "daily",
        backupTime: "02:00",
        retentionPeriod: 30,
        backupLocation: "cloud",
        compressionLevel: "medium",
        includeUploads: true,
        encryptBackups: true
    });

    const [maintenanceSettings, setMaintenanceSettings] = useState({
        maintenanceMode: false,
        scheduledMaintenance: true,
        maintenanceDay: "sunday",
        maintenanceTime: "01:00",
        maintenanceDuration: 60,
        notifyUsers: true,
        notifyTime: 24,
        customMessage: "System maintenance in progress. Please check back later."
    });

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

    const filteredLogs = mockAuditLogs.filter(log => {
        const matchesSearch =
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterType === "all" || log.status === filterType;

        return matchesSearch && matchesFilter;
    });

    const handleSaveSettings = (section: string) => {
        setSnackbar({
            open: true,
            message: `${section} settings saved successfully`,
            severity: "success"
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleStartManualBackup = () => {
        setConfirmDialog({
            open: true,
            title: "Start Manual Backup",
            message: "Are you sure you want to start a manual backup? This process may take several minutes.",
            action: "backup"
        });
    };

    const handleConfirmDialog = () => {
        if (confirmDialog.action === "backup") {
            setBackupInProgress(true);
            setConfirmDialog({ ...confirmDialog, open: false });

            // Simulate backup process
            setTimeout(() => {
                setBackupInProgress(false);
                setSnackbar({
                    open: true,
                    message: "Manual backup completed successfully",
                    severity: "success"
                });
            }, 3000);
        } else if (confirmDialog.action === "maintenance") {
            setMaintenanceSettings({
                ...maintenanceSettings,
                maintenanceMode: !maintenanceSettings.maintenanceMode
            });
            setConfirmDialog({ ...confirmDialog, open: false });
            setSnackbar({
                open: true,
                message: maintenanceSettings.maintenanceMode
                    ? "Maintenance mode disabled"
                    : "Maintenance mode enabled",
                severity: "success"
            });
        }
    };

    const handleCancelDialog = () => {
        setConfirmDialog({ ...confirmDialog, open: false });
    };

    const handleToggleMaintenance = () => {
        setConfirmDialog({
            open: true,
            title: maintenanceSettings.maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode",
            message: maintenanceSettings.maintenanceMode
                ? "Are you sure you want to disable maintenance mode? Users will regain access to the system."
                : "Are you sure you want to enable maintenance mode? This will prevent users from accessing the system.",
            action: "maintenance"
        });
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
                                                {mockBackupHistory.map((backup) => (
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
                                                ))}
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
                                {filteredLogs
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