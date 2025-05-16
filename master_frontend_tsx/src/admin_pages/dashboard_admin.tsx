import { ThemeLayout } from "../styles/theme_layout.tsx";
import {
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Box,
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from "@mui/material";
import { User } from "../types";
import {
    PeopleOutline,
    AttachMoney,
    Notifications,
    AppRegistration,
    InfoOutlined,
    WarningOutlined,
    ErrorOutlined
} from "@mui/icons-material";
import { useState } from "react";
import UserInfo from "../components/UserInfo";

interface AdminPageProps {
    user: User | null;
    onLogout: () => void;
}

// Mock data - to be replaced with actual data from database
const mockSummaryData = {
    totalStudents: 1247,
    pendingPayments: 34,
    newRegistrations: 56,
    systemAlerts: 3
};

const mockAuditLogs = [
    { id: 1, user: 'admin@example.com', action: 'User created', resource: 'users/1234', timestamp: '2023-08-10 14:32:45', status: 'success' },
    { id: 2, user: 'financial@example.com', action: 'Payment processed', resource: 'payments/456', timestamp: '2023-08-10 13:15:22', status: 'success' },
    { id: 3, user: 'academic@example.com', action: 'Course updated', resource: 'courses/CS101', timestamp: '2023-08-10 12:45:01', status: 'warning' },
    { id: 4, user: 'student@example.com', action: 'Login attempt', resource: 'auth/login', timestamp: '2023-08-10 11:30:18', status: 'error' },
    { id: 5, user: 'admin@example.com', action: 'System backup', resource: 'system/backup', timestamp: '2023-08-10 10:00:00', status: 'success' },
];

const mockRecentActivities = [
    { id: 1, message: 'New student registration: John Doe', time: '5 minutes ago', severity: 'info' },
    { id: 2, message: 'Failed payment attempt: ID #45678', time: '15 minutes ago', severity: 'warning' },
    { id: 3, message: 'System update scheduled for tonight', time: '30 minutes ago', severity: 'info' },
    { id: 4, message: 'Database backup failed', time: '1 hour ago', severity: 'error' },
];

export default function DashboardAdmin({ user, onLogout }: AdminPageProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Helper function for status chips
    const renderStatusChip = (status: string) => {
        const color = status === 'success' ? 'success' :
            status === 'warning' ? 'warning' :
                status === 'error' ? 'error' : 'default';

        return <Chip size="small" label={status} color={color as never} />;
    };

    // Helper for activity icons
    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'info': return <InfoOutlined color="info" />;
            case 'warning': return <WarningOutlined color="warning" />;
            case 'error': return <ErrorOutlined color="error" />;
            default: return <InfoOutlined color="info" />;
        }
    };

    return (
        <ThemeLayout role="admin" onLogout={onLogout}>
            {/* User Info */}
            <Box sx={{ mb: 3 }}>
                <UserInfo user={user} />
            </Box>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4, mt: '2.25rem' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        bgcolor: '#e1f5fe',
                        color: '#1976d2',
                        borderRadius: '16px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)'
                        }
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#0d47a1' }}>
                                    {mockSummaryData.totalStudents}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#0d47a1', fontWeight: 500 }}>Tổng số sinh viên</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#1976d2' }}>
                                <PeopleOutline />
                            </Avatar>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        bgcolor: '#fff8e1',
                        color: '#ffb300',
                        borderRadius: '16px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)'
                        }
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#ff8f00' }}>
                                    {mockSummaryData.pendingPayments}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#ff8f00', fontWeight: 600 }}>Thanh toán đang chờ xử lý</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#ffb300' }}>
                                <AttachMoney />
                            </Avatar>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        bgcolor: '#e8f5e9',
                        color: '#388e3c',
                        borderRadius: '16px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)'
                        }
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#1b5e20' }}>
                                    {mockSummaryData.newRegistrations}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#1b5e20', fontWeight: 500 }}>Đăng ký mới</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#388e3c' }}>
                                <AppRegistration />
                            </Avatar>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{
                        bgcolor: '#ffebee',
                        color: '#d32f2f',
                        borderRadius: '16px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)'
                        }
                    }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#b71c1c' }}>
                                    {mockSummaryData.systemAlerts}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#b71c1c', fontWeight: 500 }}>Cảnh báo hệ thống</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#d32f2f' }}>
                                <Notifications />
                            </Avatar>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main content area */}
            <Grid container spacing={3}>
                {/* Audit Logs */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{
                        borderRadius: '16px',
                        padding: '20px',
                        backgroundColor: 'rgb(250, 250, 250)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        p: 2
                    }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Nhật ký hoạt động
                        </Typography>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Người dùng</TableCell>
                                        <TableCell>Hành động</TableCell>
                                        <TableCell>Tài nguyên</TableCell>
                                        <TableCell>Thời gian</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockAuditLogs
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{log.user}</TableCell>
                                                <TableCell>{log.action}</TableCell>
                                                <TableCell>{log.resource}</TableCell>
                                                <TableCell>{log.timestamp}</TableCell>
                                                <TableCell>{renderStatusChip(log.status)}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={mockAuditLogs.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{
                        p: 2,
                        height: '100%',
                        borderRadius: '16px',
                        padding: '20px',
                        backgroundColor: 'rgb(250, 250, 250)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Hoạt động gần đây
                        </Typography>
                        <List sx={{ width: '100%' }}>
                            {mockRecentActivities.map((activity, index) => (
                                <Box key={activity.id}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemIcon>
                                            {getSeverityIcon(activity.severity)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={activity.message}
                                            secondary={activity.time}
                                        />
                                    </ListItem>
                                    {index < mockRecentActivities.length - 1 && <Divider component="li" />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeLayout>
    );
}