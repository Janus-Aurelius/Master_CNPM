import React, { useState, useMemo, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout";
import { User } from "../types";
import UserInfo from "../components/UserInfo";
import {
    Box, Paper, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    FormControl, InputLabel, Select, MenuItem, Grid, InputAdornment, Chip, IconButton, Button, Collapse
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SelectChangeEvent } from '@mui/material/Select';
// import { getAllPaymentStatus, getStudentReceipts, validatePaymentStatus } from "../api_clients/tuitionApi";

// TODO: Temporary mock functions to prevent build errors - replace with actual API when ready
const getAllPaymentStatus = async (filters: any) => [];
const getStudentReceipts = async (studentId: string) => [];
const validatePaymentStatus = async (studentId: string, data: any) => ({ success: true });

// Enum trạng thái thanh toán
export enum PaymentStatus {
    PAID = "Đã đóng đủ",
    PARTIAL = "Thiếu học phí",
    UNPAID = "Chưa đóng học phí"
}

// Interface dữ liệu sinh viên
interface StudentPaymentStatus {
    studentId: string;
    fullName: string;
    faculty: string;
    major: string;
    course: string;
    paymentStatus: PaymentStatus;
    paymentHistory?: {
        id: string;
        date: string;
        amount: number;
        method: string;
    }[];
}

interface PaymentStatusMgmFinancialProps {
    user: User | null;
    onLogout: () => void;
}

// Dữ liệu mẫu
const sampleStudentPayments: StudentPaymentStatus[] = [
    {
        studentId: "23524325",
        fullName: "Nguyễn Văn A",
        faculty: "Công nghệ thông tin",
        major: "Khoa học máy tính",
        course: "K18",
        paymentStatus: PaymentStatus.PAID,
        paymentHistory: [
            {
                id: "1",
                date: "2024-03-15",
                amount: 5000000,
                method: "Chuyển khoản"
            }
        ]
    },
    {
        studentId: "22524234",
        fullName: "Trần Thị B",
        faculty: "Công nghệ thông tin",
        major: "Kỹ thuật phần mềm",
        course: "K17",
        paymentStatus: PaymentStatus.PARTIAL,
        paymentHistory: [
            {
                id: "2",
                date: "2024-03-10",
                amount: 3000000,
                method: "Tiền mặt"
            }
        ]
    },
    {
        studentId: "23524324",
        fullName: "Lê Văn C",
        faculty: "Cơ điện tử",
        major: "Cơ điện tử",
        course: "K17",
        paymentStatus: PaymentStatus.UNPAID
    }
];

// Lấy danh sách unique cho filter
const getUnique = (arr: StudentPaymentStatus[], key: keyof StudentPaymentStatus) => {
    return Array.from(new Set(arr.map(item => item[key])));
};

const columnWidths = {
    studentId: 110,
    fullName: 150,
    faculty: 180,
    major: 180,
    course: 104,
    paymentStatus: 160,
};

export default function PaymentStatusMgmFinancial({ user, onLogout }: PaymentStatusMgmFinancialProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [facultyFilter, setFacultyFilter] = useState<string>("all");
    const [majorFilter, setMajorFilter] = useState<string>("all");
    const [courseFilter, setCourseFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentPayments, setStudentPayments] = useState<StudentPaymentStatus[]>([]);
    const [paymentHistories, setPaymentHistories] = useState<Record<string, StudentPaymentStatus["paymentHistory"]>>({});

    // Danh sách filter
    const faculties = useMemo(() => getUnique(sampleStudentPayments, "faculty").filter(Boolean) as string[], []);
    const majors = useMemo(() => getUnique(sampleStudentPayments, "major").filter(Boolean) as string[], []);
    const courses = useMemo(() => getUnique(sampleStudentPayments, "course").filter(Boolean) as string[], []);

    // Fetch danh sách trạng thái thanh toán
    useEffect(() => {
        setLoading(true);
        setError(null);
        getAllPaymentStatus({})
            .then((data) => setStudentPayments(data))
            .catch((err) => setError(err.message || 'Lỗi khi tải danh sách thanh toán'))
            .finally(() => setLoading(false));
    }, []);

    // Filter logic (áp dụng trên studentPayments thay vì sampleStudentPayments)
    const filteredData = useMemo(() => {
        return studentPayments.filter(item => {
            const matchesSearch =
                item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.fullName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFaculty = facultyFilter === "all" || item.faculty === facultyFilter;
            const matchesMajor = majorFilter === "all" || item.major === majorFilter;
            const matchesCourse = courseFilter === "all" || item.course === courseFilter;
            const matchesStatus = statusFilter === "all" || item.paymentStatus === statusFilter;
            return matchesSearch && matchesFaculty && matchesMajor && matchesCourse && matchesStatus;
        });
    }, [studentPayments, searchQuery, facultyFilter, majorFilter, courseFilter, statusFilter]);

    // Lấy lịch sử thanh toán khi expand
    const toggleHistory = async (studentId: string) => {
        setExpandedRows(prev => ({ ...prev, [studentId]: !prev[studentId] }));
        if (!paymentHistories[studentId]) {
            try {
                const receipts = await getStudentReceipts(studentId);
                setPaymentHistories(prev => ({ ...prev, [studentId]: receipts }));
            } catch (err: any) {
                setError(err.message || 'Không lấy được lịch sử thanh toán');
            }
        }
    };

    // Xác nhận thanh toán
    const handleValidatePayment = async (studentId: string) => {
        setLoading(true);
        setError(null);
        try {
            await validatePaymentStatus(studentId, { status: PaymentStatus.PAID });
            // Reload lại danh sách
            const data = await getAllPaymentStatus({});
            setStudentPayments(data);
        } catch (err: any) {
            setError(err.message || 'Cập nhật trạng thái thất bại');
        } finally {
            setLoading(false);
        }
    };

    // Màu trạng thái
    const getStatusStyle = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID:
                return { bgcolor: '#e0f7fa', color: '#00838f' };
            case PaymentStatus.PARTIAL:
                return { bgcolor: '#fff8e1', color: '#fbc02d' };
            case PaymentStatus.UNPAID:
                return { bgcolor: '#ffebee', color: '#c62828' };
            default:
                return {};
        }
    };

    return (
        <ThemeLayout role="financial" onLogout={onLogout}>
            <UserInfo user={user} />
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
                        overflow: 'auto',
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
                        Theo dõi tình trạng đóng học phí sinh viên
                    </Typography>

                    {/* Search and Filter Section */}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} md={3.5}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo MSSV hoặc Họ tên"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                                sx={{
                                    fontFamily: '"Varela Round", sans-serif',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '9px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Khoa</InputLabel>
                                <Select
                                    value={facultyFilter}
                                    label="Khoa"
                                    onChange={(e: SelectChangeEvent<string>) => setFacultyFilter(e.target.value)}
                                    startAdornment={<InputAdornment position="start"><FilterListIcon /></InputAdornment>}
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '9px' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                fontFamily: '"Varela Round", sans-serif',
                                                borderRadius: 3,
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                    {faculties.map((faculty) => (
                                        <MenuItem key={faculty} value={faculty} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                            {faculty}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Ngành</InputLabel>
                                <Select
                                    value={majorFilter}
                                    label="Ngành"
                                    onChange={(e: SelectChangeEvent<string>) => setMajorFilter(e.target.value)}
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '9px' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                fontFamily: '"Varela Round", sans-serif',
                                                borderRadius: 3,
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                    {majors.map((major) => (
                                        <MenuItem key={major} value={major} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                            {major}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={1.5}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Khóa</InputLabel>
                                <Select
                                    value={courseFilter}
                                    label="Khóa"
                                    onChange={(e: SelectChangeEvent<string>) => setCourseFilter(e.target.value)}
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '9px' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                fontFamily: '"Varela Round", sans-serif',
                                                borderRadius: 3,
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                    {courses.map((course) => (
                                        <MenuItem key={course} value={course} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                            {course}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Trạng thái"
                                    onChange={(e: SelectChangeEvent<string>) => setStatusFilter(e.target.value)}
                                    sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px', '& .MuiOutlinedInput-notchedOutline': { borderRadius: '9px' } }}
                                    MenuProps={{
                                        PaperProps: {
                                            elevation: 4,
                                            sx: {
                                                borderRadius: 3,
                                                minWidth: 200,
                                                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
                                                p: 1,
                                            },
                                        },
                                        MenuListProps: {
                                            sx: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                fontFamily: '"Varela Round", sans-serif',
                                                borderRadius: 3,
                                                p: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                    {Object.values(PaymentStatus).map(status => (
                                        <MenuItem key={status} value={status} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Table Section */}
                    <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 'none', border: '1px solid #e0e0e0', minWidth: 1100, width: '100%', maxWidth: '100%', marginTop: '1.5rem' }}>
                        <Table size="medium" style={{ width: '100%', tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: columnWidths.studentId, fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>MSSV</TableCell>
                                    <TableCell sx={{ width: columnWidths.fullName, fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Họ và tên</TableCell>
                                    <TableCell sx={{ width: columnWidths.faculty, fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Khoa</TableCell>
                                    <TableCell sx={{ width: columnWidths.major, fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Ngành</TableCell>
                                    <TableCell sx={{ width: columnWidths.course, fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Khóa</TableCell>
                                    <TableCell sx={{ width: columnWidths.paymentStatus, fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Tình trạng thanh toán</TableCell>
                                    <TableCell sx={{ width: 100, fontWeight: 'bold', color: '#FFFFFF', fontSize: '16px', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6' }}>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#888' }}>
                                            Không có dữ liệu phù hợp
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((row) => (
                                        <React.Fragment key={row.studentId}>
                                            <TableRow sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                <TableCell sx={{ minWidth: columnWidths.studentId, fontSize: '14px', fontFamily: '"Varela Round", sans-serif', fontWeight: 800 }}>{row.studentId}</TableCell>
                                                <TableCell sx={{ minWidth: columnWidths.fullName, fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{row.fullName}</TableCell>
                                                <TableCell sx={{ minWidth: columnWidths.faculty, fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{row.faculty}</TableCell>
                                                <TableCell sx={{ minWidth: columnWidths.major, fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{row.major}</TableCell>
                                                <TableCell sx={{ minWidth: columnWidths.course, fontSize: '14px', fontFamily: '"Varela Round", sans-serif' }}>{row.course}</TableCell>
                                                <TableCell sx={{ minWidth: columnWidths.paymentStatus, fontSize: '14px', fontFamily: '"Varela Round", sans-serif', p: 0 }}>
                                                    <Chip
                                                        label={row.paymentStatus}
                                                        sx={{
                                                            bgcolor: getStatusStyle(row.paymentStatus).bgcolor,
                                                            color: getStatusStyle(row.paymentStatus).color,
                                                            fontWeight: 700,
                                                            fontSize: '14px',
                                                            borderRadius: '20px',
                                                            px: 2,
                                                            py: 1,
                                                            height: '2rem',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleHistory(row.studentId)}
                                                    >
                                                        {expandedRows[row.studentId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                    {row.paymentStatus === PaymentStatus.PARTIAL && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleValidatePayment(row.studentId)}
                                                            sx={{ ml: 1 }}
                                                        >
                                                            Xác nhận
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            {row.paymentHistory && (
                                                <TableRow>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                                        <Collapse in={expandedRows[row.studentId]} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                <Typography variant="subtitle1" gutterBottom component="div">
                                                                    Lịch sử thanh toán
                                                                </Typography>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>ID</TableCell>
                                                                            <TableCell>Ngày</TableCell>
                                                                            <TableCell>Số tiền</TableCell>
                                                                            <TableCell>Phương thức</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {row.paymentHistory.map((payment) => (
                                                                            <TableRow key={payment.id}>
                                                                                <TableCell>{payment.id}</TableCell>
                                                                                <TableCell>{payment.date}</TableCell>
                                                                                <TableCell>{payment.amount.toLocaleString()} VNĐ</TableCell>
                                                                                <TableCell>{payment.method}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </ThemeLayout>
    );
}