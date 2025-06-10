import {ThemeLayout} from "../styles/theme_layout.tsx";
import {
    Typography,
    Grid,
    Paper,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {User} from "../types";
import {
    PeopleOutline,
    PaymentOutlined,
    WarningOutlined,
    TrendingUpOutlined,
    AccountBalanceWalletOutlined
} from "@mui/icons-material";
import UserInfo from "../components/UserInfo";

interface FinancialPageProps {
    user: User | null;
    onLogout: () => void;
}

// Mock data for financial dashboard
const mockSummaryData = {
    totalDebtors: 127,
    totalDebtAmount: 890000000,
    paymentsToday: 45,
    todayRevenue: 145000000
};

const mockRecentPayments = [
    { 
        id: 1, 
        studentId: '21520001', 
        studentName: 'Nguyễn Văn An', 
        amount: 7000000, 
        date: '25/11/2024 09:30', 
        method: 'Chuyển khoản',
        status: 'confirmed'
    },
    { 
        id: 2, 
        studentId: '21520045', 
        studentName: 'Trần Thị Bình', 
        amount: 3500000, 
        date: '25/11/2024 08:15', 
        method: 'Tiền mặt',
        status: 'confirmed'
    },
    { 
        id: 3, 
        studentId: '21520023', 
        studentName: 'Lê Minh Cường', 
        amount: 5250000, 
        date: '25/11/2024 07:45', 
        method: 'Chuyển khoản',
        status: 'pending'
    },
    { 
        id: 4, 
        studentId: '21520067', 
        studentName: 'Phạm Hải Đức', 
        amount: 7000000, 
        date: '24/11/2024 16:20', 
        method: 'Chuyển khoản',
        status: 'confirmed'
    },
    { 
        id: 5, 
        studentId: '21520112', 
        studentName: 'Hoàng Thị Lan', 
        amount: 4200000, 
        date: '24/11/2024 14:30', 
        method: 'Tiền mặt',
        status: 'pending'
    }
];

const mockFacultyStats = [
    { id: 1, facultyName: 'Khoa học Máy tính', code: 'KHMT', totalStudents: 450, debtStudents: 32, debtAmount: 1250000000 },
    { id: 2, facultyName: 'Kỹ thuật Phần mềm', code: 'KTPM', totalStudents: 380, debtStudents: 28, debtAmount: 980000000 },
    { id: 3, facultyName: 'Hệ thống Thông tin', code: 'HTTT', totalStudents: 320, debtStudents: 24, debtAmount: 840000000 },
    { id: 4, facultyName: 'An toàn Thông tin', code: 'ATTT', totalStudents: 280, debtStudents: 18, debtAmount: 630000000 }
];

export default function DashboardFinancial({ user, onLogout }: FinancialPageProps) {
    return (
        <ThemeLayout role="financial" onLogout={onLogout}>
            <UserInfo user={user} />
            
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4, mt: '2.25rem' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        bgcolor: '#fff3e0', 
                        color: '#e65100',
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {mockSummaryData.totalDebtors}
                                </Typography>
                                <Typography variant="body2">Sinh viên nợ học phí</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#ff9800' }}>
                                <WarningOutlined />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        bgcolor: '#ffebee', 
                        color: '#c62828',
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {(mockSummaryData.totalDebtAmount / 1000000).toFixed(0)}M
                                </Typography>
                                <Typography variant="body2">Tổng nợ (VNĐ)</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#d32f2f' }}>
                                <AccountBalanceWalletOutlined />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        bgcolor: '#e8f5e9', 
                        color: '#2e7d32',
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {mockSummaryData.paymentsToday}
                                </Typography>
                                <Typography variant="body2">Giao dịch hôm nay</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#4caf50' }}>
                                <TrendingUpOutlined />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        bgcolor: '#e3f2fd', 
                        color: '#1565c0',
                        borderRadius: '16px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)'
                        }                    }}>                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {(mockSummaryData.todayRevenue / 1000000).toFixed(0)}M
                                </Typography>
                                <Typography variant="body2">Số tiền thu hôm nay</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#1976d2' }}>
                                <PaymentOutlined />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Recent Payments */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ 
                        p: 3,
                        borderRadius: '16px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)', 
                        transition: 'all 0.25s ease',
                        border: '1px solid rgba(0, 0, 0, 0.03)',
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                        }
                    }}>
                        <Typography 
                            variant="h6" 
                            fontWeight="600" 
                            mb={2.5} 
                            sx={{ 
                                fontFamily: '"Varela Round", sans-serif',
                                color: '#1a237e',
                                fontSize: '1.1rem',
                                letterSpacing: '0.01em'
                            }}
                        >
                            Các giao dịch đóng học phí gần đây
                        </Typography>                        <TableContainer sx={{ 
                            borderRadius: '16px',
                            overflow: 'auto',
                            backgroundColor: '#ffffff',
                            border: '1px solid rgba(224, 224, 224, 0.4)',
                            '&::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px'
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: '#f1f1f1',
                                borderRadius: '8px'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: '#c1c1c1',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: '#a8a8a8'
                                }
                            }
                        }}>
                            <Table size="small" aria-label="recent payments table" stickyHeader>
                                <TableHead>
                                    <TableRow sx={{ 
                                        '& th': { 
                                            fontWeight: 600,
                                            backgroundColor: '#f7f9fc',
                                            fontSize: '0.75rem',
                                            color: '#546e7a',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.025em',
                                            borderBottom: '1px solid rgba(224, 224, 224, 0.4)',
                                            paddingTop: '10px',
                                            paddingBottom: '10px'
                                        },
                                        '& th:first-of-type': { borderTopLeftRadius: '16px' },
                                        '& th:last-of-type': { borderTopRightRadius: '16px' }
                                    }}>                                        <TableCell>Mã số sinh viên</TableCell>
                                        <TableCell>Tên sinh viên</TableCell>
                                        <TableCell>Số tiền</TableCell>
                                        <TableCell>Phương thức</TableCell>
                                        <TableCell>Thời gian</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockRecentPayments.map((payment) => (
                                        <TableRow 
                                            key={payment.id}
                                            sx={{ 
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                borderBottom: '1px solid rgba(224, 224, 224, 0.3)',
                                                bgcolor: 'transparent',
                                                transition: 'all 0.2s ease',
                                                height: '50px',
                                                '&:hover': {
                                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                                    cursor: 'pointer'
                                                },
                                                '& td': {
                                                    paddingTop: '8px',
                                                    paddingBottom: '8px',
                                                    fontSize: '0.84rem',
                                                    color: '#37474f'
                                                }
                                            }}
                                        >                                            <TableCell sx={{ fontWeight: 600 }}>{payment.studentId}</TableCell>
                                            <TableCell>{payment.studentName}</TableCell>
                                            <TableCell sx={{ fontWeight: 500, color: '#2e7d32' }}>
                                                {payment.amount.toLocaleString()} VNĐ
                                            </TableCell>
                                            <TableCell>{payment.method}</TableCell>
                                            <TableCell sx={{ color: '#78909c', fontWeight: 400 }}>{payment.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>                {/* Faculty Statistics */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: 3,
                        borderRadius: '16px',
                        backgroundColor: 'rgb(250, 250, 250)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
                        transition: 'all 0.25s ease',
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                        }
                    }}>
                        <Typography variant="h6" fontWeight="bold" mb={2} sx={{ fontFamily: '"Varela Round", sans-serif' }}>
                            Thống kê theo khoa
                        </Typography>
                        <List>
                            {mockFacultyStats.map((faculty, index) => (
                                <Box key={faculty.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: '36px' }}>
                                            <PeopleOutline 
                                                sx={{ 
                                                    color: '#1976d2'
                                                }} 
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {faculty.facultyName}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Typography variant="body2" fontWeight={500} color="#2e7d32">
                                                        Tổng SV: {faculty.totalStudents}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        SV nợ: {faculty.debtStudents} ({((faculty.debtStudents/faculty.totalStudents)*100).toFixed(1)}%)
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < mockFacultyStats.length - 1 && <Divider component="li" />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeLayout>
    );
}