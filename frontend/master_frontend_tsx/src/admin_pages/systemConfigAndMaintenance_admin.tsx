import { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { User } from "../types";
import {
    Typography,
    Box,
    Paper,    Grid,
    Button,
    Alert,
    Snackbar
} from "@mui/material";
import { systemAdminApi } from "../api_clients/systemAdminApi";

interface SystemConfigAndMaintenanceProps {
    user: User | null;
    onLogout: () => void;
}

export default function SystemConfigAndMaintenance({ onLogout }: SystemConfigAndMaintenanceProps) {
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [maintenanceSettings, setMaintenanceSettings] = useState<any>({
        isMaintenanceMode: false,
        maintenanceMessage: "",
        plannedEndTime: null
    });    useEffect(() => {
        const fetchMaintenanceStatus = async () => {
            try {
                setLoading(true);
                const status = await systemAdminApi.getMaintenanceSettings();
                setMaintenanceSettings(status);
                setError(null);
            } catch (err) {
                console.error('Error fetching maintenance status:', err);
                setError("Không thể tải trạng thái bảo trì");
            } finally {
                setLoading(false);
            }
        };
        fetchMaintenanceStatus();
    }, []);

    const handleToggleMaintenance = async () => {
        try {
            const enable = !maintenanceSettings.isMaintenanceMode;
            await systemAdminApi.toggleMaintenance(enable);
            
            const newStatus = await systemAdminApi.getMaintenanceSettings();
            setMaintenanceSettings(newStatus);
            
            setSnackbar({
                open: true,
                message: enable ? "Đã bật chế độ bảo trì" : "Đã tắt chế độ bảo trì",
                severity: "success"
            });
        } catch (err) {
            setSnackbar({
                open: true,
                message: "Cập nhật chế độ bảo trì thất bại!",
                severity: "error"
            });
        }
    };    if (loading) {
        return (
            <ThemeLayout role="admin" onLogout={onLogout}>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography>Đang tải dữ liệu...</Typography>
                </Box>
            </ThemeLayout>
        );
    }
    
    if (error) {
        return (
            <ThemeLayout role="admin" onLogout={onLogout}>
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            </ThemeLayout>
        );
    }    return (
        <ThemeLayout role="admin" onLogout={onLogout}>
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
                        Bảo trì Hệ thống
                    </Typography>
                    
                    <Paper sx={{ 
                        mb: 3, 
                        p: 3, 
                        borderRadius: '16px', 
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Alert 
                            severity={maintenanceSettings.isMaintenanceMode ? "warning" : "info"} 
                            sx={{ mb: 3 }}
                        >
                            {maintenanceSettings.isMaintenanceMode
                                ? "Hệ thống hiện đang trong chế độ bảo trì. Người dùng không thể truy cập."
                                : "Hệ thống đang hoạt động bình thường."}
                        </Alert>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        mb: 2, 
                                        fontFamily: '"Varela Round", sans-serif' 
                                    }}
                                >
                                    Trạng thái hiện tại: 
                                    <Box component="span" sx={{ 
                                        fontWeight: 'bold',
                                        color: maintenanceSettings.isMaintenanceMode ? 'warning.main' : 'success.main',
                                        ml: 1
                                    }}>
                                        {maintenanceSettings.isMaintenanceMode ? 'Đang bảo trì' : 'Hoạt động bình thường'}
                                    </Box>
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Button
                                    variant={maintenanceSettings.isMaintenanceMode ? "outlined" : "contained"}
                                    color={maintenanceSettings.isMaintenanceMode ? "success" : "warning"}
                                    onClick={handleToggleMaintenance}
                                    sx={{ 
                                        borderRadius: '8px', 
                                        textTransform: 'none',
                                        fontWeight: 'bold', 
                                        py: 1, 
                                        px: 3 
                                    }}
                                >
                                    {maintenanceSettings.isMaintenanceMode ? "Tắt chế độ bảo trì" : "Bật chế độ bảo trì"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                    
                    <Paper sx={{ 
                        p: 3, 
                        borderRadius: '16px', 
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' 
                    }}>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                mb: 2, 
                                fontWeight: 'bold',
                                fontFamily: '"Varela Round", sans-serif' 
                            }}
                        >
                            Thông tin bảo trì
                        </Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography 
                                    variant="body2"
                                    sx={{ fontFamily: '"Varela Round", sans-serif' }}
                                >
                                    Khi hệ thống đang trong chế độ bảo trì, người dùng sẽ không thể truy cập vào hệ thống. 
                                    Chỉ quản trị viên mới có thể đăng nhập và quản lý hệ thống trong thời gian bảo trì.
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Typography 
                                    variant="body2"
                                    sx={{ fontFamily: '"Varela Round", sans-serif' }}
                                >
                                    Hãy đảm bảo thông báo cho người dùng trước khi bật chế độ bảo trì để tránh gián đoạn công việc.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Paper>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    severity={snackbar.severity as any} 
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ThemeLayout>
    );
}