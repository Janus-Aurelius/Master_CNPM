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
    LibraryBooksOutlined,
    EventNoteOutlined,
    AddCircleOutlined,
    RemoveCircleOutlined,
    PeopleOutlined,
    SchoolOutlined,
    ClassOutlined
} from "@mui/icons-material";
import UserInfo from "../components/UserInfo";
import { useState, useEffect } from "react";
import { dashboardApi, DashboardSummary, UpcomingEvent, StudentRequest } from "../api_clients/academic/dashboardApi";

interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}

export default function DashboardAcademic({ user, onLogout }: AcademicPageProps) {
    const [summaryData, setSummaryData] = useState<DashboardSummary | null>(null);
    const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
    const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [summary, events, requests] = await Promise.all([
                    dashboardApi.getSummary(),
                    dashboardApi.getUpcomingEvents(),
                    dashboardApi.getStudentRequests()
                ]);
                
                console.log('=== BEFORE SETTING STATE ===');
                console.log('requests from API:', requests);
                console.log('requests.length:', requests.length);
                console.log('Array.isArray(requests):', Array.isArray(requests));
                
                setSummaryData(summary);
                const eventsArray = Array.isArray(events) ? events : [];
                setUpcomingEvents(eventsArray);
                setStudentRequests(requests); // API already returns correctly mapped data
                
                console.log('=== AFTER SETTING STATE ===');
                console.log('State should be updated with requests:', requests);
                
                setError(null);
            } catch (err) {
                setError('Failed to fetch dashboard data');
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };        fetchDashboardData();
    }, []);

    // Debug useEffect to monitor studentRequests state changes
    useEffect(() => {
        console.log('=== STUDENT REQUESTS STATE CHANGED ===');
        console.log('studentRequests state:', studentRequests);
        console.log('studentRequests.length:', studentRequests.length);
        console.log('studentRequests type:', typeof studentRequests);
        console.log('Is array:', Array.isArray(studentRequests));
    }, [studentRequests]);
    if (loading) {
        return (
            <ThemeLayout role="academic" onLogout={onLogout}>
                <UserInfo user={user} />
                <Typography sx={{ textAlign: 'center', mt: 4 }}>Loading...</Typography>
            </ThemeLayout>
        );
    }

    if (error) {
        return (
            <ThemeLayout role="academic" onLogout={onLogout}>
                <UserInfo user={user} />
                <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>{error}</Typography>
            </ThemeLayout>        );
    }

    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <UserInfo user={user} />            {/* Summary Cards */}            
            <Grid container spacing={3} sx={{ mb: 4, mt: '2.25rem' }}>        
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                        bgcolor: '#fce4ec',
                        color: '#ad1457',
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
                                    {summaryData?.totalSubjects || 0}
                                </Typography>
                                <Typography variant="body2">Tổng số môn học</Typography>
                            </Box>                            <Avatar sx={{ bgcolor: '#d81b60' }}>
                                <LibraryBooksOutlined />
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
                                    {summaryData?.totalOpenCourses || 0}
                                </Typography>
                                <Typography variant="body2">Lớp học phần đang mở</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#2196f3' }}>
                                <ClassOutlined />
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
                                    {summaryData?.totalStudents || 0}
                                </Typography>
                                <Typography variant="body2">Tổng số sinh viên</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#4caf50' }}>
                                <PeopleOutlined />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                        bgcolor: '#fff3e0',
                        color: '#ef6c00',
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
                                    {summaryData?.registeredStudents || 0}
                                </Typography>
                                <Typography variant="body2">SV đã đăng ký</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: '#ff9800' }}>
                                <SchoolOutlined />
                            </Avatar>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            {/* Main Content Area */}
            <Grid container spacing={3}>
                {/* Student Registration Requests */}
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
                            Các yêu cầu đăng ký/hủy đăng ký môn học
                        </Typography>
                        <TableContainer sx={{
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
                            }                        }}>
                            <Table size="small" aria-label="student requests table" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã số sinh viên</TableCell>
                                        <TableCell>Tên sinh viên</TableCell>
                                        <TableCell>Môn học</TableCell>
                                        <TableCell>Loại yêu cầu</TableCell>
                                        <TableCell>Thời gian yêu cầu</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(() => {
                                        console.log('=== TABLE RENDER DEBUG ===');
                                        console.log('studentRequests:', studentRequests);
                                        console.log('studentRequests.length:', studentRequests.length);
                                        console.log('Array.isArray(studentRequests):', Array.isArray(studentRequests));
                                        console.log('studentRequests === null:', studentRequests === null);
                                        console.log('studentRequests === undefined:', studentRequests === undefined);
                                        console.log('typeof studentRequests:', typeof studentRequests);
                                        
                                        if (studentRequests.length === 0) {
                                            console.log('RENDERING: No data message');
                                            return (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">
                                                        <Typography color="textSecondary">
                                                            Không có dữ liệu
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        } else {
                                            console.log('RENDERING: Data rows, count:', studentRequests.length);
                                            return studentRequests.map((request) => {
                                                console.log('Rendering individual request:', request);
                                                return (
                                        <TableRow
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
                                                }
                                            }}
                                        >
                                            <TableCell>{request.studentId}</TableCell>
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
                                                        {request.requestType === 'register'
                                                          ? 'Đăng ký'
                                                          : request.requestType === 'cancel'
                                                            ? 'Hủy đăng ký'
                                                            : request.requestType}
                                                    </Typography>
                                                </Box>
                                            </TableCell>                                            <TableCell sx={{ color: '#78909c', fontWeight: 400 }}>{request.submittedDateTime}</TableCell>
                                        </TableRow>
                                                );
                                            });
                                        }
                                    })()}
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
                            {Array.isArray(upcomingEvents) && upcomingEvents.map((event, index) => (
                                <Box key={event.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: '36px' }}>
                                            <EventNoteOutlined color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={event.description}
                                            secondary={new Date(event.timestamp).toLocaleString()}
                                            primaryTypographyProps={{
                                                fontWeight: 500,
                                                fontSize: '0.9rem'
                                            }}
                                            secondaryTypographyProps={{
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </ListItem>
                                    {index < upcomingEvents.length - 1 && <Divider component="li" />}
                                </Box>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </ThemeLayout>
    );
}