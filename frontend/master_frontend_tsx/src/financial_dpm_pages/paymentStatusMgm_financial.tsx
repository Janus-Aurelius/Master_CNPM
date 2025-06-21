import { useState, useEffect } from 'react';
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
import IconButton from '@mui/material/IconButton';
import { User } from "../types";
import { Box, Grid, MenuItem, Select, FormControl, InputLabel, Chip, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import UserInfo from '../components/UserInfo';
import { getAllPaymentStatus, submitTuitionPayment, getAvailableSemesters } from '../api_clients/tuitionApi.ts';

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
    semester: string;
    semesterId?: string;
    status: 'Chưa nộp đủ' | 'Đã nộp đủ' | 'Quá hạn';
    paymentHistory: PaymentHistory[];
    sotienphaidong: number; // Tổng số tiền phải đóng
    sotienconlai: number;   // Số tiền còn lại
    sotiendadong?: number;  // Số tiền đã đóng
}

// Props definition for the Financial page component.
interface FinancialPageProps {
    user: User | null;
    onLogout: () => void;
}

const statusOptions = ['Tất cả', 'Chưa nộp đủ', 'Đã nộp đủ', 'Quá hạn'];

// Define the mapping between display labels and backend values
const paymentMethodOptions = [
    { label: "Chuyển khoản", value: "bank_transfer" },
    { label: "Tiền mặt", value: "cash" },

];

function getPaymentMethodLabel(method: string) {
    switch (method) {
        case "bank_transfer":
            return "Chuyển khoản";
        case "cash":
            return "Tiền mặt";
        case "momo":
            return "Momo";
        case "vnpay":
            return "VNPay";
        default:
            return method;
    }
}

export default function PaymentStatusMgm({ user, onLogout }: FinancialPageProps) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState('Tất cả');
    const [yearFilter, setYearFilter] = useState('Tất cả');
    const [semesterFilter, setSemesterFilter] = useState('Tất cả');
    const [facultyFilter, setFacultyFilter] = useState('Tất cả');
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [openAddPaymentDialog, setOpenAddPaymentDialog] = useState(false);    const [newTransaction, setNewTransaction] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        method: 'bank_transfer'
    });

    // Extract unique years, semesters and faculties
    const uniqueYears = Array.from(new Set(invoices.map(i => i.year)));
    const uniqueSemesters = Array.from(new Set(invoices.map(i => i.semester)));
    const uniqueFaculties = Array.from(new Set(invoices.map(i => i.faculty)));

    // Filtering logic
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch =
            inv.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.studentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'Tất cả' || inv.status === statusFilter;
        const matchesYear = yearFilter === 'Tất cả' || inv.year === yearFilter;
        const matchesSemester = semesterFilter === 'Tất cả' || inv.semester === semesterFilter;
        const matchesFaculty = facultyFilter === 'Tất cả' || inv.faculty === facultyFilter;
        return matchesSearch && matchesStatus && matchesYear && matchesSemester && matchesFaculty;
    });

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'Đã nộp đủ': return { bg: '#d9fade', text: '#4caf50' };
            case 'Quá hạn': return { bg: '#fff8e1', text: '#f57c00' };
            case 'Chưa nộp đủ': return { bg: '#ffebee', text: '#ef5350' };
            default: return { bg: '#e0e0e0', text: '#616161' };
        }
    };

    // Mở dialog chi tiết sinh viên
    const handleRowClick = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setOpenDetailDialog(true);
    };

    // Thêm giao dịch, cập nhật lại sotienconlai và status
    const handleAddTransaction = async () => {
        if (selectedInvoice && newTransaction.amount) {
            try {
                await submitTuitionPayment({
                    studentId: selectedInvoice.studentId,
                    semester: selectedInvoice.semesterId || selectedInvoice.semester,
                    amount: parseFloat(newTransaction.amount),
                    paymentDate: newTransaction.date,
                    paymentMethod: newTransaction.method
                });
                
                // Đóng dialog thêm thanh toán
                setOpenAddPaymentDialog(false);
                setNewTransaction({
                    date: new Date().toISOString().split('T')[0],
                    amount: '',
                    method: 'bank_transfer'
                });                // Reload toàn bộ dữ liệu và cập nhật selectedInvoice
                const reloadData = async () => {
                    try {
                        // Lấy available semesters động
                        console.log('🔄 Reloading data - fetching available semesters...');
                        const availableSemestersRes = await getAvailableSemesters() as any;
                        
                        if (!availableSemestersRes.success || !Array.isArray(availableSemestersRes.data)) {
                            console.error('❌ Failed to get available semesters during reload');
                            return;
                        }
                        
                        const semesters = availableSemestersRes.data.map((item: any) => item.semesterId);
                        console.log('✅ Available semesters for reload:', semesters);
                        
                        let allStudents: any[] = [];
                        
                        const promises = semesters.map(async (semesterId: string) => {
                            try {
                                const res: any = await getAllPaymentStatus({ semesterId });
                                if (res.success && Array.isArray(res.data)) {
                                    return res.data;
                                }
                                return [];
                            } catch (error) {
                                return [];
                            }
                        });
                        
                        const results = await Promise.all(promises);
                        results.forEach((semesterData: any) => {
                            if (Array.isArray(semesterData) && semesterData.length > 0) {
                                allStudents = [...allStudents, ...semesterData];
                            }
                        });
                        
                        // Map backend data to frontend format
                        const mappedData = mapBackendToFrontend(allStudents);
                          // Cập nhật danh sách invoices
                        setInvoices(mappedData);
                        
                        // Tìm và cập nhật selectedInvoice với dữ liệu mới
                        if (selectedInvoice && mappedData.length > 0) {
                            const updatedSelectedInvoice = mappedData.find(
                                (inv: Invoice) => inv.studentId === selectedInvoice.studentId && inv.semesterId === selectedInvoice.semesterId
                            );
                            if (updatedSelectedInvoice) {
                                setSelectedInvoice(updatedSelectedInvoice);
                            }
                        }
                    } catch (error) {
                        setInvoices([]);
                        console.error('Lỗi khi reload dữ liệu:', error);
                    }
                };
                
                await reloadData();
            } catch (err) {
                alert('Thêm giao dịch thất bại!');
            }
        }
    };

    const openAddPaymentFromDetail = () => {
        setOpenAddPaymentDialog(true);
    };    // Helper function to map backend data to frontend format
    const mapBackendToFrontend = (backendData: any[]): Invoice[] => {
        console.log('🔄 Mapping backend data to frontend format...');
        console.log('📋 Raw backend data:', JSON.stringify(backendData.slice(0, 2), null, 2));
        
        const mappedData = backendData.map((item: any) => {
            console.log('🔄 Mapping item:', item);
            
            const mapped = {
                id: item.id || item.studentId,
                studentId: item.studentId,
                studentName: item.studentName,
                faculty: item.faculty,
                year: item.year,
                semester: item.semester,
                semesterId: item.semesterId,
                status: mapPaymentStatusToVietnamese(item.paymentStatus),
                paymentHistory: item.paymentHistory || [],
                sotienphaidong: item.totalAmount || 0,
                sotienconlai: item.remainingAmount || 0,
                sotiendadong: item.paidAmount || 0
            };
            
            console.log('✅ Mapped item:', mapped);
            return mapped;
        });
        
        console.log('✅ Total mapped items:', mappedData.length);
        return mappedData;
    };

    // Helper function to map payment status from backend to Vietnamese
    const mapPaymentStatusToVietnamese = (paymentStatus: string): 'Chưa nộp đủ' | 'Đã nộp đủ' | 'Quá hạn' => {
        switch (paymentStatus) {
            case 'paid':
                return 'Đã nộp đủ';
            case 'overdue':
                return 'Quá hạn';
            case 'unpaid':
            default:
                return 'Chưa nộp đủ';
        }
    };    useEffect(() => {
        const loadAllSemesterData = async () => {
            console.log('📚 Loading payment status for all semesters...');
            
            try {
                // Bước 1: Lấy danh sách các semester có dữ liệu từ backend
                console.log('🔄 Fetching available semesters...');
                const availableSemestersRes = await getAvailableSemesters() as any;
                
                console.log('📋 Available semesters response:', availableSemestersRes);
                
                if (!availableSemestersRes.success || !Array.isArray(availableSemestersRes.data)) {
                    console.error('❌ Failed to get available semesters:', availableSemestersRes);
                    console.log('🔄 Fallback to hardcoded semesters for testing...');
                    // Fallback to hardcoded semesters for testing
                    const fallbackSemesters = ['HK1_2023', 'HK2_2023', 'HK1_2024'];
                    await loadDataForSemesters(fallbackSemesters);
                    return;
                }
                
                const semesters = availableSemestersRes.data.map((item: any) => item.semesterId);
                console.log('✅ Available semesters:', semesters);
                
                if (semesters.length === 0) {
                    console.warn('⚠️ No semesters with registration data found');
                    console.log('🔄 Fallback to hardcoded semesters for testing...');
                    const fallbackSemesters = ['HK1_2023', 'HK2_2023', 'HK1_2024'];
                    await loadDataForSemesters(fallbackSemesters);
                    return;
                }
                
                // Load data for available semesters
                await loadDataForSemesters(semesters);
                
            } catch (error) {
                console.error('❌ Error loading semester data:', error);
                console.log('🔄 Fallback to hardcoded semesters for testing...');
                const fallbackSemesters = ['HK1_2023', 'HK2_2023', 'HK1_2024'];
                await loadDataForSemesters(fallbackSemesters);
            }
        };

        // Helper function to load data for given semesters
        const loadDataForSemesters = async (semesters: string[]) => {
            console.log('🔄 Loading data for semesters:', semesters);
            let allStudents: any[] = [];
            
            const promises = semesters.map(async (semesterId: string) => {
                try {
                    console.log(`🔄 Loading data for ${semesterId}...`);
                    const res: any = await getAllPaymentStatus({ semesterId });
                      console.log(`📋 Response for ${semesterId}:`, res);
                    console.log(`📋 Response structure:`, {
                        success: res.success,
                        dataType: typeof res.data,
                        isArray: Array.isArray(res.data),
                        dataLength: res.data?.length,
                        dataContent: res.data
                    });
                    
                    if (res.success && Array.isArray(res.data)) {
                        console.log(`✅ ${semesterId}: ${res.data.length} students`);
                        return res.data;
                    }
                    console.warn(`⚠️ ${semesterId}: No data returned or wrong format`);
                    return [];
                } catch (error) {
                    console.warn(`⚠️ Failed to load ${semesterId}:`, error);
                    return [];
                }
            });
            
            const results = await Promise.all(promises);
            
            // Kết hợp tất cả dữ liệu
            results.forEach((semesterData: any) => {
                if (Array.isArray(semesterData) && semesterData.length > 0) {
                    allStudents = [...allStudents, ...semesterData];
                }
            });
            
            console.log(`🎉 Total students from all semesters: ${allStudents.length}`);
            console.log('📋 Raw student data sample:', allStudents.slice(0, 2));
            
            // Map backend data to frontend format
            const mappedData = mapBackendToFrontend(allStudents);
            console.log('🔄 Mapped data for frontend:', mappedData.slice(0, 2));
            setInvoices(mappedData);
        };
        
        loadAllSemesterData();
    }, []);

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
                        overflow: 'hidden',
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
                >                    <Typography
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
                        <Grid item xs={12} md={1.5}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Học kỳ</InputLabel>
                                <Select
                                    value={semesterFilter}
                                    label="Học kỳ"
                                    onChange={(e) => setSemesterFilter(e.target.value)}
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
                                    {uniqueSemesters.map(semester => (
                                        <MenuItem key={semester} value={semester} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>{semester}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
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
                    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', border: 'none', borderBottom: 'none', width: '100%' }}>
                        <Box sx={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
                            <Table size="medium" stickyHeader>                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '12%', backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>MSSV</TableCell>
                                        <TableCell sx={{ width: '20%', backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>Họ và tên</TableCell>
                                        <TableCell sx={{ width: '18%', backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>Khoa</TableCell>
                                        <TableCell sx={{ width: '10%', backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>Năm học</TableCell>
                                        <TableCell sx={{ width: '8%', backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>Học kỳ</TableCell>
                                        <TableCell sx={{ width: '15%', backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>Số tiền còn lại</TableCell>
                                        <TableCell sx={{ width: '12%', backgroundColor: '#6ebab6', color: '#fff', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Varela Round", sans-serif' }}>Trạng thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>                                    {filteredInvoices.map((invoice) => (
                                        <TableRow
                                            key={`${invoice.studentId}-${invoice.semesterId || invoice.semester}`}
                                            sx={{ 
                                                '&:hover': { backgroundColor: '#f5f5f5', cursor: 'pointer' },
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleRowClick(invoice)}
                                        ><TableCell sx={{ fontWeight: 800, fontFamily: '"Varela Round", sans-serif', width: '12%' }}>{invoice.studentId}</TableCell>
                                            <TableCell sx={{ fontFamily: '"Varela Round", sans-serif', width: '20%' }}>{invoice.studentName}</TableCell>
                                            <TableCell sx={{ fontFamily: '"Varela Round", sans-serif', width: '18%' }}>{invoice.faculty}</TableCell>
                                            <TableCell sx={{ fontFamily: '"Varela Round", sans-serif', width: '10%' }}>{invoice.year}</TableCell>
                                            <TableCell sx={{ fontFamily: '"Varela Round", sans-serif', width: '8%' }}>{invoice.semester}</TableCell>
                                            <TableCell sx={{ fontFamily: '"Varela Round", sans-serif', width: '15%', textAlign: 'right' }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: invoice.sotienconlai > 0 ? '#d32f2f' : '#388e3c',
                                                        fontFamily: '"Varela Round", sans-serif'
                                                    }}
                                                >
                                                    {invoice.sotienconlai.toLocaleString()} VNĐ
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ width: '12%' }}>
                                                <Chip
                                                    label={invoice.status}
                                                    sx={{ 
                                                        bgcolor: getStatusChipColor(invoice.status).bg, 
                                                        color: getStatusChipColor(invoice.status).text, 
                                                        fontWeight: 'bold', 
                                                        fontFamily: '"Varela Round", sans-serif',
                                                        fontSize: '12px'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}                                    {filteredInvoices.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body1" color="text.secondary" sx={{ fontFamily: '"Varela Round", sans-serif' }}>
                                                    Không tìm thấy sinh viên nào phù hợp với điều kiện tìm kiếm
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </TableContainer>

                    {/* Student Detail Dialog */}
                    <Dialog
                        open={openDetailDialog}
                        onClose={() => setOpenDetailDialog(false)}
                        maxWidth="md"
                        fullWidth
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.98)',
                                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                                padding: 0,
                                minHeight: '400px',
                                maxHeight: '80vh',
                            },
                        }}
                    >
                        <DialogTitle sx={{
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            color: '#4c4c4c',
                            textAlign: 'center',
                            pb: 1,
                            pt: 2,
                            position: 'relative'
                        }}>
                            Thông tin sinh viên
                            <IconButton
                                onClick={() => setOpenDetailDialog(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: '#999',
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers sx={{
                            border: 'none',
                            px: 3,
                            pt: 1,
                            pb: 0,
                            background: 'transparent',
                        }}>
                            {selectedInvoice && (
                                <Box>
                                    {/* Student Info Header */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1.5, backgroundColor: '#f7faff', borderRadius: '12px' }}>
                                        <Box sx={{ 
                                            width: 50, 
                                            height: 50, 
                                            borderRadius: '50%', 
                                            backgroundColor: '#6ebab6', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            mr: 2
                                        }}>
                                            <PersonIcon sx={{ color: 'white', fontSize: '25px' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontFamily: '"Varela Round", sans-serif', fontWeight: 600, color: '#2d3a4a', fontSize: '1.1rem' }}>
                                                {selectedInvoice.studentName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontFamily: '"Varela Round", sans-serif', color: '#666' }}>
                                                MSSV: {selectedInvoice.studentId}
                                            </Typography>
                                            <Chip
                                                label="Đang học"
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: '#d4edda', 
                                                    color: '#155724',
                                                    fontFamily: '"Varela Round", sans-serif',
                                                    fontSize: '11px',
                                                    mt: 0.5,
                                                    height: '20px'
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Student Details Grid - Compact */}
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" sx={{ fontFamily: '"Varela Round", sans-serif', mb: 0.5, fontSize: '16px' }}>
                                                <strong>Khoa:</strong> {selectedInvoice.faculty}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" sx={{ fontFamily: '"Varela Round", sans-serif', mb: 0.5, fontSize: '16x' }}>
                                                <strong>Năm học:</strong> {selectedInvoice.year}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" sx={{ fontFamily: '"Varela Round", sans-serif', mb: 0.5, fontSize: '16px' }}>
                                                <strong>Học kỳ:</strong> {selectedInvoice.semester}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Typography variant="body2" sx={{ fontFamily: '"Varela Round", sans-serif', mb: 0.5, fontSize: '16px' }}>
                                                <strong>Trạng thái:</strong><br />
                                                <Chip
                                                    label={selectedInvoice.status}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: getStatusChipColor(selectedInvoice.status).bg, 
                                                        color: getStatusChipColor(selectedInvoice.status).text, 
                                                        fontWeight: 'bold', 
                                                        fontFamily: '"Varela Round", sans-serif',
                                                        fontSize: '16px',
                                                        height: '20px'
                                                    }}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 1.5 }} />

                                    {/* Payment Summary - Compact */}
                                    <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f7faff', borderRadius: '12px' }}>
                                        <Typography variant="h6" sx={{ fontFamily: '"Varela Round", sans-serif', fontWeight: 600, color: '#2d3a4a', mb: 1.5, fontSize: '1.1rem' }}>
                                             Thông tin học phí
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" sx={{ fontFamily: '"Varela Round", sans-serif', color: '#666', mb: 0.5, fontSize: '12px' }}>
                                                    Số tiền phải đóng
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontFamily: '"Varela Round", sans-serif', fontWeight: 700, color: '#1976d2', fontSize: '1rem' }}>
                                                    {selectedInvoice.sotienphaidong.toLocaleString()} VNĐ
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" sx={{ fontFamily: '"Varela Round", sans-serif', color: '#666', mb: 0.5, fontSize: '12px' }}>
                                                    Số tiền đã đóng
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontFamily: '"Varela Round", sans-serif', fontWeight: 700, color: '#388e3c', fontSize: '1rem' }}>
                                                    {(selectedInvoice.sotiendadong || (selectedInvoice.sotienphaidong - selectedInvoice.sotienconlai)).toLocaleString()} VNĐ
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant="body2" sx={{ fontFamily: '"Varela Round", sans-serif', color: '#666', mb: 0.5, fontSize: '12px' }}>
                                                    Số tiền còn lại
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontFamily: '"Varela Round", sans-serif', fontWeight: 700, color: selectedInvoice.sotienconlai > 0 ? '#d32f2f' : '#388e3c', fontSize: '1rem' }}>
                                                    {selectedInvoice.sotienconlai.toLocaleString()} VNĐ
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Payment History - More Compact */}
                                    <Box sx={{ mb: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="h6" sx={{ fontFamily: '"Varela Round", sans-serif', fontWeight: 600, color: '#2d3a4a', fontSize: '1.1rem' }}>
                                                📋 Lịch sử thanh toán
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<AddIcon />}
                                                onClick={openAddPaymentFromDetail}
                                                sx={{
                                                    backgroundColor: '#6ebab6',
                                                    '&:hover': { backgroundColor: '#5ba9a5' },
                                                    borderRadius: '8px',
                                                    fontFamily: '"Varela Round", sans-serif',
                                                    textTransform: 'none',
                                                    fontSize: '13px',
                                                    height: '32px'
                                                }}
                                            >
                                                Thêm thanh toán
                                            </Button>
                                        </Box>
                                        
                                        {selectedInvoice.paymentHistory.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: 13, fontFamily: '"Varela Round", sans-serif', textAlign: 'center', py: 2 }}>
                                                Chưa có giao dịch thanh toán nào.
                                            </Typography>
                                        ) : (
                                            <Box 
                                                sx={{ 
                                                    height: `${selectedInvoice.paymentHistory.length * 40 + 50}px`,
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <TableContainer 
                                                    component={Paper} 
                                                    sx={{ 
                                                        height: '100%',
                                                        borderRadius: '8px', 
                                                        boxShadow: 'none',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={{ 
                                                                    fontWeight: 700, 
                                                                    color: '#4a5a6a', 
                                                                    fontSize: 12, 
                                                                    fontFamily: '"Varela Round", sans-serif', 
                                                                    backgroundColor: '#f5f7fa', 
                                                                    p: 1,
                                                                    borderBottom: '2px solid #e0e0e0'
                                                                }}>ID</TableCell>
                                                                <TableCell sx={{ 
                                                                    fontWeight: 700, 
                                                                    color: '#4a5a6a', 
                                                                    fontSize: 12, 
                                                                    fontFamily: '"Varela Round", sans-serif', 
                                                                    backgroundColor: '#f5f7fa', 
                                                                    p: 1,
                                                                    borderBottom: '2px solid #e0e0e0'
                                                                }}>Ngày</TableCell>
                                                                <TableCell sx={{ 
                                                                    fontWeight: 700, 
                                                                    color: '#4a5a6a', 
                                                                    fontSize: 12, 
                                                                    fontFamily: '"Varela Round", sans-serif', 
                                                                    backgroundColor: '#f5f7fa', 
                                                                    p: 1,
                                                                    borderBottom: '2px solid #e0e0e0'
                                                                }}>Số tiền</TableCell>
                                                                <TableCell sx={{ 
                                                                    fontWeight: 700, 
                                                                    color: '#4a5a6a', 
                                                                    fontSize: 12, 
                                                                    fontFamily: '"Varela Round", sans-serif', 
                                                                    backgroundColor: '#f5f7fa', 
                                                                    p: 1,
                                                                    borderBottom: '2px solid #e0e0e0'
                                                                }}>Phương thức</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {selectedInvoice.paymentHistory.map((payment) => (
                                                                <TableRow key={payment.id} sx={{ 
                                                                    '&:hover': { background: '#f0f4f8' },
                                                                    borderBottom: '1px solid #f0f0f0'
                                                                }}>
                                                                    <TableCell sx={{ fontSize: 12, fontFamily: '"Varela Round", sans-serif', p: 1 }}>{payment.id}</TableCell>
                                                                    <TableCell sx={{ fontSize: 12, fontFamily: '"Varela Round", sans-serif', p: 1 }}>{payment.date}</TableCell>
                                                                    <TableCell sx={{ fontSize: 12, fontFamily: '"Varela Round", sans-serif', fontWeight: 600, p: 1 }}>{payment.amount.toLocaleString()} VNĐ</TableCell>
                                                                    <TableCell sx={{ fontSize: 12, fontFamily: '"Varela Round", sans-serif', p: 1 }}>{getPaymentMethodLabel(payment.method)}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions sx={{
                            px: 3,
                            pb: 2,
                            pt: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            background: 'transparent',
                        }}>
                            <Button
                                onClick={() => setOpenDetailDialog(false)}
                                variant="contained"
                                sx={{
                                    fontFamily: '"Varela Round", sans-serif',
                                    backgroundColor: '#6ebab6',
                                    '&:hover': { backgroundColor: '#5ba9a5' },
                                    borderRadius: '8px',
                                    px: 3,
                                    height: '36px'
                                }}
                            >
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Add Payment Dialog */}
                    <Dialog
                        open={openAddPaymentDialog}
                        onClose={() => setOpenAddPaymentDialog(false)}
                        maxWidth="sm"
                        fullWidth
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '20px',
                                background: 'rgba(255,255,255,0.98)',
                                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                                padding: 0,
                            },
                        }}
                    >
                        <DialogTitle sx={{
                            fontFamily: '"Montserrat", sans-serif',
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            color: '#4c4c4c',
                            textAlign: 'center',
                            pb: 0,
                            pt: 3
                        }}>
                            Thêm giao dịch thanh toán
                        </DialogTitle>
                        <DialogContent dividers sx={{
                            border: 'none',
                            px: 4,
                            pt: 2,
                            pb: 0,
                            background: 'transparent',
                        }}>
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        autoFocus
                                        label="Ngày giao dịch"
                                        type="date"
                                        fullWidth
                                        variant="outlined"
                                        value={newTransaction.date}
                                        onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{
                                            borderRadius: '12px',
                                            background: '#f7faff',
                                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                            '& .MuiInputLabel-root': { fontWeight: 500 },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Số tiền (VNĐ)"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                        value={newTransaction.amount}
                                        onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                                        sx={{
                                            borderRadius: '12px',
                                            background: '#f7faff',
                                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                            '& .MuiInputLabel-root': { fontWeight: 500 },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '12px',
                                            background: '#f7faff',
                                            '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                                            '& .MuiInputLabel-root': { fontWeight: 500 },
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d8d8d8' },
                                        }}
                                    >
                                        <InputLabel>Phương thức thanh toán</InputLabel>
                                        <Select
                                            value={newTransaction.method}
                                            label="Phương thức thanh toán"
                                            onChange={(e) => setNewTransaction(prev => ({ ...prev, method: e.target.value }))}
                                            sx={{ fontFamily: '"Varela Round", sans-serif' }}
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
                                            {paymentMethodOptions.map(option => (
                                                <MenuItem key={option.value} value={option.value} sx={{ fontFamily: '"Varela Round", sans-serif', borderRadius: '9px' }}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{
                            px: 4,
                            pb: 3,
                            pt: 2,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                            background: 'transparent',
                        }}>
                            <Button
                                onClick={() => setOpenAddPaymentDialog(false)}
                                color="primary"
                                sx={{ fontFamily: '"Varela Round", sans-serif' }}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleAddTransaction}
                                variant="contained"
                                color="primary"
                                sx={{
                                    fontFamily: '"Varela Round", sans-serif',
                                    backgroundColor: '#6ebab6',
                                    '&:hover': { backgroundColor: '#5ba9a5' }
                                }}
                            >
                                Thêm giao dịch
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Box>
        </ThemeLayout>
    );
}