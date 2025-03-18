import { useState } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { StudentPageProps } from "../types";
import {
    Box,
    Paper,
    List,
    Typography,
    Collapse,
    Button,
    Grid,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ListItemText
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PaymentIcon from '@mui/icons-material/Payment';

// Types for tuition data
interface EnrolledSubject {
    id: number;
    name: string;
    credits: number;
    tuition: number;
}

interface TuitionRecord {
    id: number;
    semester: string;
    year: string;
    dueDate: string;
    status: 'paid' | 'pending' | 'unpaid';
    subjects: EnrolledSubject[];
    totalAmount: number;
}

// Sample enrolled subjects - would come from actual enrolled_subject data
const enrolledSubjects: EnrolledSubject[] = [
    { id: 1, name: 'Mathematics', credits: 3, tuition: 450000 },
    { id: 2, name: 'Physics', credits: 4, tuition: 600000 },
    { id: 3, name: 'Chemistry', credits: 3, tuition: 450000 },
    { id: 4, name: 'Biology', credits: 4, tuition: 600000 },
];

// Mock tuition data by semester
const tuitionData: TuitionRecord[] = [
    {
        id: 1,
        semester: 'Fall',
        year: '2023-2024',
        dueDate: '15/09/2023',
        status: 'unpaid',
        subjects: enrolledSubjects,
        totalAmount: 2100000,
    },
    {
        id: 2,
        semester: 'Spring',
        year: '2022-2023',
        dueDate: '15/01/2023',
        status: 'paid',
        subjects: enrolledSubjects.slice(0, 2),
        totalAmount: 1050000,
    },
    {
        id: 3,
        semester: 'Fall',
        year: '2022-2023',
        dueDate: '15/09/2022',
        status: 'paid',
        subjects: enrolledSubjects.slice(1, 4),
        totalAmount: 1650000,
    },
];

// Status color mapping helper
const getStatusChipColor = (status: string): { bg: string; text: string } => {
    switch (status) {
        case 'paid': return { bg: '#e8f5e9', text: '#2e7d32' };
        case 'pending': return { bg: '#fff8e1', text: '#f57c00' };
        case 'unpaid': return { bg: '#ffebee', text: '#c62828' };
        default: return { bg: '#e0e0e0', text: '#616161' };
    }
};

const TuitionCollecting = ({onLogout}: StudentPageProps) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [paymentInProgress, setPaymentInProgress] = useState<number | null>(null);

    const handleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleProceedToPayment = (tuitionId: number) => {
        setPaymentInProgress(tuitionId);

        // Mock payment processing with timeout to simulate API call
        setTimeout(() => {
            // In a real app, this would send data to financial department
            alert("Thanh toán thành công! Yêu cầu xác nhận đã được gửi đến Phòng Tài chính.");
            setPaymentInProgress(null);

            // Update status to pending (in a real app, this would update the backend)
            // updateTuitionStatus(tuitionId, 'pending');
        }, 2000);
    };

    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <Typography
                variant="h4"
                sx={{ mb: 4, fontWeight: 'bold', color: '#4880FF', textAlign: 'center' }}
            >
                Tình trạng học phí
            </Typography>

            <Paper elevation={3} sx={{ p: 2 }}>
                <List>
                    {tuitionData.map((tuition) => (
                        <Box key={tuition.id} mb={2}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    borderLeft: '5px solid',
                                    borderColor: getStatusChipColor(tuition.status).text,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                                    }
                                }}
                                onClick={() => handleExpand(tuition.id)}
                            >
                                <Grid container alignItems="center">
                                    <Grid item xs={10}>
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6">
                                                    Học phí {tuition.semester} {tuition.year}
                                                </Typography>
                                            }
                                            secondary={`Hạn nộp: ${tuition.dueDate}`}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Chip
                                            label={tuition.status === 'paid' ? 'Đã nộp' :
                                                tuition.status === 'pending' ? 'Đang xử lý' : 'Chưa nộp'}
                                            sx={{
                                                bgcolor: getStatusChipColor(tuition.status).bg,
                                                color: getStatusChipColor(tuition.status).text,
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={1} textAlign="right">
                                        {expandedId === tuition.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Collapse in={expandedId === tuition.id} timeout="auto" unmountOnExit>
                                <Paper sx={{ p: 2, mt: 1, borderTop: '1px solid #e0e0e0' }}>
                                    <Typography variant="h6" mb={2}>Chi tiết học phí</Typography>

                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableRow>
                                                    <TableCell>Môn học</TableCell>
                                                    <TableCell align="center">Số tín chỉ</TableCell>
                                                    <TableCell align="right">Học phí (VNĐ)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {tuition.subjects.map((subject) => (
                                                    <TableRow key={subject.id}>
                                                        <TableCell>{subject.name}</TableCell>
                                                        <TableCell align="center">{subject.credits}</TableCell>
                                                        <TableCell align="right">
                                                            {subject.tuition.toLocaleString()} VNĐ
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                    <TableCell colSpan={2}>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            Tổng học phí
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {tuition.totalAmount.toLocaleString()} VNĐ
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {tuition.status === 'unpaid' && (
                                        <Box mt={3} display="flex" justifyContent="flex-end">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<PaymentIcon />}
                                                disabled={paymentInProgress === tuition.id}
                                                onClick={() => handleProceedToPayment(tuition.id)}
                                                sx={{ minWidth: 200 }}
                                            >
                                                {paymentInProgress === tuition.id ? 'Đang xử lý...' : 'Tiến hành thanh toán'}
                                            </Button>
                                        </Box>
                                    )}

                                    {tuition.status === 'pending' && (
                                        <Box mt={3} p={2} bgcolor="#fff8e1" borderRadius={1}>
                                            <Typography variant="body2">
                                                Yêu cầu thanh toán của bạn đang được xử lý bởi phòng tài chính.
                                                Trạng thái sẽ được cập nhật sau khi hoàn tất xác nhận.
                                            </Typography>
                                        </Box>
                                    )}

                                    {tuition.status === 'paid' && (
                                        <Box mt={3} p={2} bgcolor="#e8f5e9" borderRadius={1}>
                                            <Typography variant="body2">
                                                Học phí đã được thanh toán đầy đủ. Cảm ơn bạn!
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Collapse>
                        </Box>
                    ))}
                </List>
            </Paper>
        </ThemeLayout>
    );
};

export default TuitionCollecting;