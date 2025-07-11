import { useEffect, useState } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
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
    TableRow,
    CircularProgress,
    Alert
} from "@mui/material";
import { User } from "../types";
import {
    PeopleOutline,
    PaymentOutlined,
    WarningOutlined,
    TrendingUpOutlined,
    AccountBalanceWalletOutlined
} from "@mui/icons-material";
import UserInfo from "../components/UserInfo";
import { financialDashboardApi, OverviewData, RecentPayment, FacultyStat, Semester } from "../api_clients/financialDashboardApi";

// TODO: Temporary mock function to prevent build errors - replace with actual API when ready
const getFinancialDashboard = async () => ({ 
    overview: { totalStudents: 0, totalTuition: 0, totalPaid: 0, totalPending: 0, paymentRate: 0 },
    recentPayments: [],
    semesterStats: []
});

interface FinancialPageProps {
    user: User | null;
    onLogout: () => void;
}

function getPaymentMethodLabel(method: string) {
    switch (method) {
        case "cash":
            return "Tiền mặt";
        case "bank_transfer":
            return "Chuyển khoản";
        default:
            return method;
    }
}

export default function DashboardFinancial({ user, onLogout }: FinancialPageProps) {
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
    const [facultyStats, setFacultyStats] = useState<FacultyStat[]>([]);
    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [selectedSemesterIdx, setSelectedSemesterIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        Promise.allSettled([
            financialDashboardApi.getOverview(),
            financialDashboardApi.getRecentPayments(),
            financialDashboardApi.getSemesters()
        ])
        .then((results) => {
            if (results[0].status === 'fulfilled') setOverview(results[0].value);
            if (results[1].status === 'fulfilled') setRecentPayments(results[1].value);
            if (results[2].status === 'fulfilled') setSemesters(results[2].value);
            if (results.some(r => r.status === 'rejected')) {
                setError("Không thể tải đủ dữ liệu dashboard");
            } else {
                setError(null);
            }
        })
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (semesters.length > 0) {
            setLoading(true);
            financialDashboardApi.getFacultyStatsBySemester(semesters[selectedSemesterIdx].semesterId)
                .then(setFacultyStats)
                .catch(() => setError("Không thể tải thống kê theo khoa"))
                .finally(() => setLoading(false));
        }
    }, [semesters, selectedSemesterIdx]);

    return (
        <ThemeLayout role="financial" onLogout={onLogout}>
            <UserInfo user={user} />

            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Summary Cards */}
            {overview && (
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
                                        {overview.totalDebtStudents}
                                    </Typography>
                                    <Typography variant="body2">Số sinh viên nợ học phí ở tất cả các kì</Typography>
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
                                        {(overview.totalDebt / 1e6).toFixed(0)}M
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
                            }
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                                <Box>
                                    <Typography variant="h6" component="div" fontWeight="bold">
                                        {(overview.totalCollected / 1e6).toFixed(0)}M
                                    </Typography>
                                    <Typography variant="body2">Tổng số tiền thu</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: '#1976d2' }}>
                                    <PaymentOutlined />
                                </Avatar>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

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
                        </Typography>
                        <TableContainer sx={{
                            maxHeight: 370,
                            borderRadius: '16px',
                            overflowY: 'auto',
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
                                    }}>
                                        <TableCell>Mã số sinh viên</TableCell>
                                        <TableCell>Tên sinh viên</TableCell>
                                        <TableCell>Số tiền</TableCell>
                                        <TableCell>Phương thức</TableCell>
                                        <TableCell>Thời gian</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentPayments.map((row, idx) => (
                                        <TableRow
                                            key={row.studentid + row.time}
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
                                        >
                                            <TableCell sx={{ fontWeight: 600 }}>{row.studentid}</TableCell>
                                            <TableCell>{row.studentname}</TableCell>
                                            <TableCell sx={{ fontWeight: 500, color: '#2e7d32' }}>
                                                {Number(row.amount).toLocaleString()} VNĐ
                                            </TableCell>
                                            <TableCell>{getPaymentMethodLabel(row.method)}</TableCell>
                                            <TableCell sx={{ color: '#78909c', fontWeight: 400 }}>
                                                {new Date(row.time).toLocaleString("vi-VN")}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                {/* Faculty Statistics */}
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
                        {/* Tiêu đề + nút chuyển kỳ */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1, fontFamily: '"Varela Round", sans-serif' }}>
                                Thống kê theo khoa
                            </Typography>
                            <Box>
                                <button
                                    disabled={selectedSemesterIdx === 0}
                                    onClick={() => setSelectedSemesterIdx(idx => Math.max(0, idx - 1))}
                                    style={{ marginRight: 8 }}
                                >
                                    {'<'}
                                </button>
                                <button
                                    disabled={selectedSemesterIdx === semesters.length - 1}
                                    onClick={() => setSelectedSemesterIdx(idx => Math.min(semesters.length - 1, idx + 1))}
                                >
                                    {'>'}
                                </button>
                            </Box>
                        </Box>
                        {/* Hiển thị học kỳ/năm học nổi bật */}
                        {semesters.length > 0 && (
                            <Typography
                                variant="subtitle1"
                                color="secondary"
                                fontWeight="bold"
                                sx={{ mb: 2, fontSize: '1rem' }}
                            >
                                {semesters[selectedSemesterIdx]?.HocKyThu && semesters[selectedSemesterIdx]?.NamHoc
                                    ? `Học kỳ ${semesters[selectedSemesterIdx].HocKyThu} - Năm học ${semesters[selectedSemesterIdx].NamHoc}`
                                    : semesters[selectedSemesterIdx]?.semesterName}
                            </Typography>
                        )}
                        <List>
                            {facultyStats.map((faculty, index) => (
                                <Box key={faculty.facultyname || index}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: '36px' }}>
                                            <PeopleOutline sx={{ color: '#1976d2' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {faculty.facultyname}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Typography variant="body2" fontWeight={500} color="#2e7d32">
                                                        Tổng SV: {faculty.totalstudents}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        SV nợ: {faculty.debtstudents} ({faculty.debtpercent}%)
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < facultyStats.length - 1 && <Divider component="li" />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeLayout>
    );
}