import React, { useState, useEffect } from 'react';
import { ThemeLayout } from "../styles/theme_layout.tsx";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { User } from "../types";
import { Box, Grid, MenuItem, Select, FormControl, InputLabel, Chip, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import UserInfo from '../components/UserInfo';

// Define the PaymentHistory type representing individual payment transactions.
interface PaymentHistory {
    id: number;
    date: string;
    amount: number;
    method: string;
}

// Updated Invoice type with payment history and total amount included.
interface Invoice {
    id: number;
    studentId: string;
    studentName: string;
    faculty: string;
    year: string;
    status: 'Chưa nộp đủ' | 'Đã nộp đủ' | 'Đang xử lý';
    paymentHistory: PaymentHistory[];
    totalAmount: number; // Số tiền phải nộp
}

// Props definition for the Financial page component.
interface FinancialPageProps {
    user: User | null;
    onLogout: () => void;
}

const sampleInvoices: Invoice[] = [
    {
        id: 1,
        studentId: '21520001',
        studentName: 'Nguyễn Văn An',
        faculty: 'Công nghệ thông tin',
        year: '2023-2024',
        status: 'Chưa nộp đủ',
        paymentHistory: [
            { id: 101, date: '2023-09-01', amount: 500000, method: 'Chuyển khoản' },
        ],
        totalAmount: 7000000,
    },
    {
        id: 2,
        studentId: '21520002',
        studentName: 'Trần Thị Bình',
        faculty: 'Công nghệ thông tin',
        year: '2023-2024',
        status: 'Đã nộp đủ',
        paymentHistory: [
            { id: 102, date: '2023-09-10', amount: 6000000, method: 'Tiền mặt' },
            { id: 104, date: '2023-10-10', amount: 1000000, method: 'Chuyển khoản' },
        ],
        totalAmount: 7000000,
    },
    {
        id: 3,
        studentId: '21520003',
        studentName: 'Lê Văn Cường',
        faculty: 'Khoa học máy tính',
        year: '2022-2023',
        status: 'Đang xử lý',
        paymentHistory: [
            { id: 103, date: '2022-09-05', amount: 3000000, method: 'Chuyển khoản' },
        ],
        totalAmount: 7000000,
    },
    {
        id: 4,
        studentId: '21520004',
        studentName: 'Phạm Thị Dung',
        faculty: 'Khoa học máy tính',
        year: '2022-2023',
        status: 'Chưa nộp đủ',
        paymentHistory: [],
        totalAmount: 7000000,
    },
    // ... More data ...
];

const statusOptions = ['Tất cả', 'Chưa nộp đủ', 'Đã nộp đủ', 'Đang xử lý'];

export default function PaymentStatusMgm({ user, onLogout }: FinancialPageProps) {
    const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [yearFilter, setYearFilter] = useState('Tất cả');
    const [facultyFilter, setFacultyFilter] = useState('Tất cả');
    const [expandedRows, setExpandedRows] = useState<{ [invoiceId: number]: boolean }>({});

    // Extract unique years and faculties
    const uniqueYears = Array.from(new Set(invoices.map(i => i.year)));
    const uniqueFaculties = Array.from(new Set(invoices.map(i => i.faculty)));

    // Filtering logic
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch =
            inv.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.studentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'Tất cả' || inv.status === statusFilter;
        const matchesYear = yearFilter === 'Tất cả' || inv.year === yearFilter;
        const matchesFaculty = facultyFilter === 'Tất cả' || inv.faculty === facultyFilter;
        return matchesSearch && matchesStatus && matchesYear && matchesFaculty;
    });

    // Group by year for display
    const groupedByYear: { [year: string]: Invoice[] } = {};
    filteredInvoices.forEach(inv => {
        if (!groupedByYear[inv.year]) groupedByYear[inv.year] = [];
        groupedByYear[inv.year].push(inv);
    });

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'Đã nộp đủ': return { bg: '#d9fade', text: '#4caf50' };
            case 'Đang xử lý': return { bg: '#fff8e1', text: '#f57c00' };
            case 'Chưa nộp đủ': return { bg: '#ffebee', text: '#ef5350' };
            default: return { bg: '#e0e0e0', text: '#616161' };
        }
    };

    const toggleHistory = (invoiceId: number) => {
        setExpandedRows(prev => ({ ...prev, [invoiceId]: !prev[invoiceId] }));
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
                        minHeight: '0px',
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
                        Quản lý tình trạng đóng học phí sinh viên
                    </Typography>
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
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Trạng thái"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <FilterListIcon />
                                        </InputAdornment>
                                    }
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
                                    {statusOptions.map(status => (
                                        <MenuItem key={status} value={status} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Năm học</InputLabel>
                                <Select
                                    value={yearFilter}
                                    label="Năm học"
                                    onChange={(e) => setYearFilter(e.target.value)}
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
                                    <MenuItem value="Tất cả" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                    {uniqueYears.map(year => (
                                        <MenuItem key={year} value={year} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2.5}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Khoa</InputLabel>
                                <Select
                                    value={facultyFilter}
                                    label="Khoa"
                                    onChange={(e) => setFacultyFilter(e.target.value)}
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
                                    <MenuItem value="Tất cả" sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>Tất cả</MenuItem>
                                    {uniqueFaculties.map(faculty => (
                                        <MenuItem key={faculty} value={faculty} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{faculty}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', border: '1px solid #e0e0e0', width: '100%', maxWidth: '100%', minWidth: 1100, maxHeight: 'calc(100vh - 350px)', height: 'auto', overflowY: 'auto' }}>
                        <Table size="medium" stickyHeader sx={{ tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '40px', backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}></TableCell>
                                    <TableCell sx={{ backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>MSSV</TableCell>
                                    <TableCell sx={{ backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Họ và tên</TableCell>
                                    <TableCell sx={{ backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Khoa</TableCell>
                                    <TableCell sx={{ backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Năm học</TableCell>
                                    <TableCell sx={{ backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Số tiền còn thiếu</TableCell>
                                    <TableCell sx={{ backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredInvoices.map((invoice) => {
                                    const paid = invoice.paymentHistory.reduce((sum, p) => sum + p.amount, 0);
                                    const missing = Math.max(invoice.totalAmount - paid, 0);
                                    return (
                                        <React.Fragment key={invoice.id}>
                                            <TableRow
                                                sx={{ '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' } }}
                                                onClick={() => toggleHistory(invoice.id)}
                                            >
                                                <TableCell>
                                                    <IconButton size="small">
                                                        {expandedRows[invoice.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 800 }}>{invoice.studentId}</TableCell>
                                                <TableCell>{invoice.studentName}</TableCell>
                                                <TableCell>{invoice.faculty}</TableCell>
                                                <TableCell>{invoice.year}</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: missing > 0 ? '#d32f2f' : '#388e3c' }}>{missing.toLocaleString()} VNĐ</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={invoice.status}
                                                        sx={{ bgcolor: getStatusChipColor(invoice.status).bg, color: getStatusChipColor(invoice.status).text, fontWeight: 'bold' }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0, border: 0 }}>
                                                    <Collapse in={expandedRows[invoice.id]} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 2, backgroundColor: '#fff', p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e0e0e0', minWidth: 400 }}>
                                                            <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mb: 1, color: '#2d3a4a', fontSize: 18 }}>
                                                                Lịch sử thanh toán
                                                            </Typography>
                                                            <Box sx={{ borderBottom: '1px solid #f0f0f0', mb: 2 }} />
                                                            {invoice.paymentHistory.length === 0 ? (
                                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: 15 }}>
                                                                    Chưa có giao dịch thanh toán nào.
                                                                </Typography>
                                                            ) : (
                                                                <Table size="small" sx={{ background: '#fafbfc', borderRadius: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.03)', overflow: 'hidden', minWidth: 350 }}>
                                                                    <TableHead>
                                                                        <TableRow sx={{ background: '#f5f7fa' }}>
                                                                            <TableCell sx={{ fontWeight: 700, color: '#4a5a6a', fontSize: 15 }}>ID</TableCell>
                                                                            <TableCell sx={{ fontWeight: 700, color: '#4a5a6a', fontSize: 15 }}>Ngày</TableCell>
                                                                            <TableCell sx={{ fontWeight: 700, color: '#4a5a6a', fontSize: 15 }}>Số tiền</TableCell>
                                                                            <TableCell sx={{ fontWeight: 700, color: '#4a5a6a', fontSize: 15 }}>Phương thức</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {invoice.paymentHistory.map((payment) => (
                                                                            <TableRow key={payment.id} sx={{ '&:hover': { background: '#f0f4f8' } }}>
                                                                                <TableCell sx={{ fontSize: 14 }}>{payment.id}</TableCell>
                                                                                <TableCell sx={{ fontSize: 14 }}>{payment.date}</TableCell>
                                                                                <TableCell sx={{ fontSize: 14 }}>{payment.amount.toLocaleString()} VNĐ</TableCell>
                                                                                <TableCell sx={{ fontSize: 14 }}>{payment.method}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            )}
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                                {filteredInvoices.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                Không tìm thấy sinh viên nào phù hợp với điều kiện tìm kiếm
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </ThemeLayout>
    );
}
                {/*
          Note: For handling a large number of invoices and associated payment histories,
          consider implementing server-side pagination, data virtualization (e.g., using react-window),
          and indexing strategies in your backend database.
        */}
