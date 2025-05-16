import {ThemeLayout} from "../styles/theme_layout.tsx";
import {
    Typography, 
    Grid,
    Paper,
    Card,
    CardContent,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from "@mui/material";
import {User} from "../types";
import {
    PeopleOutline,
    AssignmentOutlined,
    EventAvailableOutlined,
    SchoolOutlined,
    LibraryBooksOutlined,
    EventNoteOutlined,
    CheckCircleOutline,
    ErrorOutline,
    AnnouncementOutlined,
    TaskAltOutlined
} from "@mui/icons-material";
import UserInfo from "../components/UserInfo";


interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

// Mock data - sẽ thay thế bằng data thực tế từ database sau
const mockSummaryData = {
    totalStudents: 1685,
    totalCourses: 124,
    activeRegistrations: 56,
    pendingRequests: 28
};

const mockRecentActivities = [
    { id: 1, message: "Đăng ký môn học học kỳ 1 năm 2025-2026 bắt đầu", time: "15/05/2025", severity: "info" },
    { id: 2, message: "Cập nhật thành công thời khóa biểu học kỳ 1 năm 2025-2026", time: "14/05/2025", severity: "success" },
    { id: 3, message: "8 hồ sơ yêu cầu đang chờ xử lý", time: "13/05/2025", severity: "warning" },
    { id: 4, message: "Cập nhật thông tin giảng viên khoa CNPM", time: "12/05/2025", severity: "info" }
];

const mockUpcomingEvents = [
    { id: 1, event: "Kết thúc đăng ký môn học học kỳ 1", date: "30/05/2025" },
    { id: 2, event: "Hạn cuối nộp đề cương cho sinh viên năm cuối", date: "01/06/2025" },
    { id: 3, event: "Công bố lịch thi cuối kỳ", date: "10/06/2025" }
];

const mockPendingRequests = [
    { id: 101, studentID: "21520001", studentName: "Nguyễn Văn A", requestType: "Đăng ký môn", courseCode: "SE310", date: "15/05/2025", status: "pending" },
    { id: 102, studentID: "21520015", studentName: "Trần Thị B", requestType: "Hủy môn học", courseCode: "SE330", date: "14/05/2025", status: "pending" },
    { id: 103, studentID: "21520042", studentName: "Lê Văn C", requestType: "Chuyển lớp", courseCode: "SS310", date: "13/05/2025", status: "pending" },
    { id: 104, studentID: "21520078", studentName: "Phạm Thị D", requestType: "Đăng ký môn", courseCode: "SE307", date: "12/05/2025", status: "pending" }
];

export default function DashboardAcademic({ user, onLogout }: AcademicPageProps) {
    // Helper for activity icons
    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'info': return <AnnouncementOutlined color="info" />;
            case 'success': return <CheckCircleOutline color="success" />;
            case 'warning': return <ErrorOutline color="warning" />;
            default: return <AnnouncementOutlined color="info" />;
        }
    };

    // Helper for status chips
    const getStatusChip = (status: string) => {
        switch (status) {
            case 'pending': return <Chip size="small" label="Đang chờ" color="warning" />;
            case 'approved': return <Chip size="small" label="Đã duyệt" color="success" />;
            case 'rejected': return <Chip size="small" label="Từ chối" color="error" />;
            default: return <Chip size="small" label={status} color="default" />;
        }
    };

    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <UserInfo user={user} />
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4, mt: '2.25rem' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
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
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {mockSummaryData.totalStudents}
                                </Typography>
                                <Typography variant="body2">Tổng số sinh viên</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <PeopleOutline />
                            </Avatar>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        bgcolor: '#e3f2fd', 
                        color: '#0d47a1',
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
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {mockSummaryData.totalCourses}
                                </Typography>
                                <Typography variant="body2">Tổng số môn học</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#2196f3' }}>
                                <LibraryBooksOutlined />
                            </Avatar>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
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
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {mockSummaryData.activeRegistrations}
                                </Typography>
                                <Typography variant="body2">Sinh viên đăng ký</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#4caf50' }}>
                                <AssignmentOutlined />
                            </Avatar>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        bgcolor: '#fff8e1', 
                        color: '#ff6d00',
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
                        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {mockSummaryData.pendingRequests}
                                </Typography>
                                <Typography variant="body2">Yêu cầu đang chờ</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#ff9800' }}>
                                <EventNoteOutlined />
                            </Avatar>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Pending Requests */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ 
                        p: 3,
                        borderRadius: '16px',
                        backgroundColor: 'rgb(250, 250, 250)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
                        transition: 'all 0.25s ease',
                        mb: 3,
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                        }
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: '"Varela Round", sans-serif' }}>
                                Yêu cầu đang chờ xử lý
                            </Typography>
                            <Button variant="outlined" color="primary" size="small" sx={{ borderRadius: '8px' }}>
                                Xem tất cả
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>MSSV</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Họ tên</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Loại yêu cầu</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Mã môn học</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Ngày</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {mockPendingRequests.map((req) => (
                                        <TableRow key={req.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                            <TableCell>{req.studentID}</TableCell>
                                            <TableCell>{req.studentName}</TableCell>
                                            <TableCell>{req.requestType}</TableCell>
                                            <TableCell>{req.courseCode}</TableCell>
                                            <TableCell>{req.date}</TableCell>
                                            <TableCell>{getStatusChip(req.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Side Panels */}
                <Grid item xs={12} md={4}>

                    {/* Upcoming Events */}
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
                            Sự kiện sắp tới
                        </Typography>
                        <List>
                            {mockUpcomingEvents.map((event, index) => (
                                <Box key={event.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: '36px' }}>
                                            <EventNoteOutlined color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={event.event}
                                            secondary={event.date}
                                            primaryTypographyProps={{ 
                                                fontWeight: 500,
                                                fontSize: '0.9rem'
                                            }}
                                            secondaryTypographyProps={{
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </ListItem>
                                    {index < mockUpcomingEvents.length - 1 && <Divider component="li" />}
                                </Box>
                            ))}
                        </List>
                        <Box mt={2} display="flex" justifyContent="center">
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                startIcon={<TaskAltOutlined />}
                                sx={{ 
                                    borderRadius: '8px', 
                                    textTransform: 'none',
                                }}
                            >
                                Xem lịch đầy đủ
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeLayout>
    );
}