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
    LibraryBooksOutlined,
    EventNoteOutlined,
    AddCircleOutlined,
    RemoveCircleOutlined
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

const mockUpcomingEvents = [
    { id: 1, event: "Kết thúc đăng ký môn học học kỳ 1", date: "30/05/2025" },
    { id: 2, event: "Hạn cuối nộp đề cương cho sinh viên năm cuối", date: "01/06/2025" },
    { id: 3, event: "Công bố lịch thi cuối kỳ", date: "10/06/2025" }
];

const mockStudentRequests = [
    { 
        id: 1, 
        studentId: '21120123', 
        studentName: 'Nguyễn Văn A', 
        course: 'Nhập môn Công nghệ phần mềm', 
        requestType: 'register', 
        submittedDateTime: '15/05/2025 08:30:15',
        status: 'pending'
    },
    { 
        id: 2, 
        studentId: '21120456', 
        studentName: 'Trần Thị B', 
        course: 'Cơ sở dữ liệu', 
        requestType: 'drop', 
        submittedDateTime: '14/05/2025 14:25:47',
        status: 'pending'
    },
    { 
        id: 3, 
        studentId: '21120789', 
        studentName: 'Lê Hoàng C', 
        course: 'Mạng máy tính', 
        requestType: 'register', 
        submittedDateTime: '13/05/2025 09:12:33',
        status: 'pending'
    },
    { 
        id: 4, 
        studentId: '21120112', 
        studentName: 'Phạm Minh D', 
        course: 'Trí tuệ nhân tạo', 
        requestType: 'drop', 
        submittedDateTime: '12/05/2025 10:05:20',
        status: 'pending'
    },
    { 
        id: 5, 
        studentId: '21120345', 
        studentName: 'Hoàng Thị E', 
        course: 'Phát triển ứng dụng web', 
        requestType: 'register', 
        submittedDateTime: '11/05/2025 16:45:09',
        status: 'pending'
    },
    { 
        id: 6, 
        studentId: '21120567', 
        studentName: 'Vũ Thành F', 
        course: 'Kiểm thử phần mềm', 
        requestType: 'register', 
        submittedDateTime: '10/05/2025 11:20:38',
        status: 'pending'
    },
    { 
        id: 7, 
        studentId: '21120678', 
        studentName: 'Đặng Hải G', 
        course: 'Lập trình hướng đối tượng', 
        requestType: 'drop', 
        submittedDateTime: '10/05/2025 09:55:22',
        status: 'pending'
    },
    { 
        id: 8, 
        studentId: '21120891', 
        studentName: 'Bùi Minh H', 
        course: 'Phân tích thiết kế hệ thống', 
        requestType: 'register', 
        submittedDateTime: '09/05/2025 14:17:45',
        status: 'pending'
    }
];

export default function DashboardAcademic({ user, onLogout }: AcademicPageProps) {
    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <UserInfo user={user} />
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4, mt: '2.25rem' }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        bgcolor: '#f3e5f5', // tím nhạt
                        color: '#6a1b9a',   // tím đậm
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
                                    {mockSummaryData.totalStudents}
                                </Typography>
                                <Typography variant="body2">Tổng số sinh viên</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#8e24aa' }}>
                                <PeopleOutline />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {mockSummaryData.totalCourses}
                                </Typography>
                                <Typography variant="body2">Tổng số môn học</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#2196f3' }}>
                                <LibraryBooksOutlined />
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
                                    {mockSummaryData.activeRegistrations}
                                </Typography>
                                <Typography variant="body2">Sinh viên đăng ký</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#4caf50' }}>
                                <LibraryBooksOutlined />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                            <Box>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {mockSummaryData.pendingRequests}
                                </Typography>
                                <Typography variant="body2">Yêu cầu đang chờ</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#ff9800' }}>
                                <EventNoteOutlined />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Student Registration Requests */}                <Grid item xs={12} md={8}>                    <Paper sx={{ 
                        p: 3,
                        borderRadius: '16px',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)', 
                        transition: 'all 0.25s ease',
                        border: '1px solid rgba(0, 0, 0, 0.03)',
                        '&:hover': {
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                        }
                    }}>                        <Typography 
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
                            Các yêu cầu đăng ký/hủy đăng ký môn học
                        </Typography>                        <TableContainer sx={{ 
                            height: 350,
                            maxHeight: 350, 
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
                            },
                            '& .MuiTable-root': {
                                borderCollapse: 'separate',
                                borderSpacing: 0
                            },
                            '& .MuiTableRow-root:last-child .MuiTableCell-root:first-of-type': {
                                borderBottomLeftRadius: '16px'
                            },
                            '& .MuiTableRow-root:last-child .MuiTableCell-root:last-child': {
                                borderBottomRightRadius: '16px'
                            }
                        }}>
                            <Table size="small" aria-label="student requests table" stickyHeader>                                <TableHead sx={{ 
                                    '& .MuiTableCell-head': {
                                        borderBottomLeftRadius: '0 !important',  
                                        borderBottomRightRadius: '0 !important'
                                    }
                                }}>                                    <TableRow sx={{ 
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
                                    }}>                                        <TableCell sx={{ borderBottomLeftRadius: '0 !important', borderBottomRightRadius: '0 !important' }}>Mã số sinh viên</TableCell>
                                        <TableCell sx={{ borderBottomLeftRadius: '0 !important', borderBottomRightRadius: '0 !important' }}>Tên sinh viên</TableCell>
                                        <TableCell sx={{ borderBottomLeftRadius: '0 !important', borderBottomRightRadius: '0 !important' }}>Môn học</TableCell>
                                        <TableCell sx={{ borderBottomLeftRadius: '0 !important', borderBottomRightRadius: '0 !important' }}>Loại yêu cầu</TableCell>
                                        <TableCell sx={{ borderBottomLeftRadius: '0 !important', borderBottomRightRadius: '0 !important' }}>Thời gian yêu cầu</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>                                    {mockStudentRequests.map((request) => (                                        <TableRow 
                                            key={request.id}
                                            sx={{ 
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                borderBottom: '1px solid rgba(224, 224, 224, 0.3)',
                                                bgcolor: 'transparent',
                                                transition: 'all 0.2s ease',
                                                height: '50px',
                                                '&:hover': {
                                                    bgcolor: request.requestType === 'register'
                                                        ? 'rgba(46, 125, 50, 0.04)'
                                                        : 'rgba(229, 57, 53, 0.04)',
                                                    cursor: 'pointer'
                                                },
                                                '& td': {
                                                    paddingTop: '8px',
                                                    paddingBottom: '8px',
                                                    fontSize: '0.84rem',
                                                    color: '#37474f'
                                                }
                                            }}
                                        >                                            <TableCell>
                                                {request.studentId}
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{request.studentName}</TableCell>
                                            <TableCell>{request.course}</TableCell>
                                            <TableCell>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    backgroundColor: request.requestType === 'register' ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)',
                                                    borderRadius: '16px',
                                                    padding: '4px 10px',
                                                    width: 'fit-content'
                                                }}>
                                                    {request.requestType === 'register' ? (
                                                        <AddCircleOutlined fontSize="small" sx={{ color: '#2e7d32', mr: 0.7 }} />
                                                    ) : (
                                                        <RemoveCircleOutlined fontSize="small" sx={{ color: '#e53935', mr: 0.7 }} />
                                                    )}
                                                    <Typography variant="body2" sx={{ 
                                                        fontWeight: 500,
                                                        color: request.requestType === 'register' ? '#2e7d32' : '#e53935'
                                                    }}>
                                                        {request.requestType === 'register' ? 'Đăng ký' : 'Hủy đăng ký'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: '#78909c', fontWeight: 400 }}>{request.submittedDateTime}</TableCell>
                                        </TableRow>
                                    ))}                                </TableBody>
                            </Table>                            {/* Bo góc dưới của bảng được xử lý trong CSS của TableContainer */}
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
                    </Paper>
                </Grid>
            </Grid>
        </ThemeLayout>
    );
}