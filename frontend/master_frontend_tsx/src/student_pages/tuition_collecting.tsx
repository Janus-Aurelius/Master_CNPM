import React, { useState, useEffect } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { StudentPageProps } from "../types";
import UserInfo from "../components/UserInfo";
import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { tuitionApi, TuitionRecord, PaymentHistoryItem, EnrolledSubject, formatCurrency, getStatusText, getStatusChipColor } from "../api_clients/student/tuitionApi";

const TuitionCollecting = ({ user, onLogout }: StudentPageProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [paymentInProgress, setPaymentInProgress] = useState<string | null>(null);
    const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; tuition: TuitionRecord | null }>({ open: false, tuition: null });
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
    const [tuitionDataState, setTuitionDataState] = useState<TuitionRecord[]>([]);
    const [historyDialog, setHistoryDialog] = useState<{ open: boolean; tuitionId: string | null }>({ open: false, tuitionId: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !user.id) return;
        loadTuitionData();
    }, [user]);

    const loadTuitionData = async () => {
        if (!user || !user.id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const [tuitionList, paymentHistoryList] = await Promise.all([
                tuitionApi.getTuitionStatus(String(user.id)),
                tuitionApi.getPaymentHistory(String(user.id))
            ]);
            
            setTuitionDataState(tuitionList);
            setPaymentHistory(paymentHistoryList);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải dữ liệu học phí');
        } finally {
            setLoading(false);
        }
    };

    const handleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getPaidAmount = (tuitionId: string) => {
        return paymentHistory
            .filter(item => item.semester === tuitionId)
            .reduce((sum, item) => sum + item.amount, 0);
    };

    const handleOpenPaymentDialog = (tuition: TuitionRecord) => {
        setPaymentDialog({ open: true, tuition });
        setPaymentAmount(tuition.remainingAmount);
    };

    const handleClosePaymentDialog = () => {
        setPaymentDialog({ open: false, tuition: null });
        setPaymentAmount(0);
    };

    const handleConfirmPayment = async () => {
        if (!paymentDialog.tuition || !user || !user.id) return;
        
        try {
            setPaymentInProgress(paymentDialog.tuition.id);
            
            await tuitionApi.makePayment(String(user.id), {
                semesterId: paymentDialog.tuition.id,
                amount: paymentAmount,
                paymentMethod: "online"
            });
            
            // Reload data after successful payment
            await loadTuitionData();
            handleClosePaymentDialog();
        } catch (err: any) {
            setError(err.message || 'Thanh toán thất bại');
        } finally {
            setPaymentInProgress(null);
        }
    };

    const handleOpenHistoryDialog = (tuitionId: string) => {
        setHistoryDialog({ open: true, tuitionId });
    };

    const handleCloseHistoryDialog = () => {
        setHistoryDialog({ open: false, tuitionId: null });
    };    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <UserInfo user={user} />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 0.25 }}>
                <Paper
                    elevation={3}
                    sx={{
                        textAlign: "left",
                        borderRadius: "1rem",
                        padding: "1.25rem",
                        fontSize: "1.125rem",
                        fontFamily: '"Varela Round", sans-serif',
                        fontWeight: 450,
                        backgroundColor: "rgb(250, 250, 250)",
                        boxShadow: "0 0.125rem 0.3125rem rgba(0, 0, 0, 0.1)",
                        color: "rgb(39, 89, 217)",
                        transition: "all 0.25s ease",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        overflow: "hidden",
                        marginTop: '3.65rem',
                        flexGrow: 1,
                        maxHeight: "calc(100vh - 150px)",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        marginLeft: "0",
                        marginRight: "0.625rem",
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderTopRightRadius: '1rem',
                        borderBottomRightRadius: '1rem',
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            fontStyle: "normal",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: "0.875rem",
                            marginTop: "0",
                            textAlign: "center",
                            fontSize: "1.875rem",
                        }}
                    >
                        Tình trạng học phí
                    </Typography>

                    {loading && (
                        <Box display="flex" justifyContent="center" m={3}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {!loading && tuitionDataState.length === 0 && (
                        <Alert severity="info">
                            Không có thông tin học phí nào được tìm thấy.
                        </Alert>
                    )}

                    <Box>
                        {tuitionDataState.map((tuition) => (
                            <Box key={tuition.id} mb={2}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        borderLeft: "5px solid",
                                        borderColor: getStatusChipColor(tuition.status).text,
                                        cursor: "pointer",
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
                                        borderRadius: '8px',
                                        backgroundColor: "#f7fcfe",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            bgcolor: "rgba(0, 0, 0, 0.02)",
                                            boxShadow: `0 6px 15px ${getStatusChipColor(tuition.status).text}50`,
                                        },
                                    }}
                                    onClick={() => handleExpand(tuition.id)}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography variant="h6">
                                                Học phí {tuition.semesterName} {tuition.year}
                                            </Typography>
                                            <Chip
                                                label={getStatusText(tuition.status)}
                                                sx={{
                                                    bgcolor: getStatusChipColor(tuition.status).bg,
                                                    color: getStatusChipColor(tuition.status).text,
                                                    fontWeight: "bold",
                                                    display: "flex",
                                                    height: "32px",
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            {expandedId === tuition.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </Box>
                                    </Box>
                                </Paper>

                                <Collapse in={expandedId === tuition.id} timeout="auto" unmountOnExit>
                                    <Paper sx={{ p: 2, mt: 1, borderTop: "1px solid #e0e0e0", borderRadius: "16px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                                        <Typography variant="h6" mb={2}>
                                            Chi tiết học phí
                                        </Typography>

                                        <TableContainer component={Paper} variant="outlined">
                                            <Table>
                                                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                                                    <TableRow>
                                                        <TableCell>Môn học</TableCell>
                                                        <TableCell>Loại môn</TableCell>
                                                        <TableCell align="center">Số tín chỉ</TableCell>
                                                        <TableCell align="right">Học phí (VNĐ)</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {tuition.subjects.map((subject) => (
                                                        <TableRow key={subject.id}>
                                                            <TableCell>{subject.name}</TableCell>
                                                            <TableCell>{subject.courseType}</TableCell>
                                                            <TableCell align="center">{subject.credits}</TableCell>
                                                            <TableCell align="right">
                                                                {formatCurrency(subject.tuition)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                                        <TableCell colSpan={3}>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                Tổng học phí
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {formatCurrency(tuition.totalAmount)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <Box mt={2}>
                                            <Typography>Đã đóng: <b>{formatCurrency(tuition.paidAmount)}</b></Typography>
                                            <Typography>Còn lại: <b>{formatCurrency(tuition.remainingAmount)}</b></Typography>
                                            <Typography>Hạn nộp: <b>{new Date(tuition.dueDate).toLocaleDateString('vi-VN')}</b></Typography>
                                        </Box>

                                        <Box mt={2} display="flex" gap={2}>
                                            <Button variant="outlined" onClick={() => handleOpenHistoryDialog(tuition.id)}>
                                                Xem lịch sử thanh toán
                                            </Button>
                                            {tuition.status !== "paid" && (
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    startIcon={<PaymentIcon />} 
                                                    onClick={() => handleOpenPaymentDialog(tuition)}
                                                    disabled={paymentInProgress === tuition.id}
                                                    sx={{
                                                        textTransform: "none",
                                                        borderRadius: "0.5rem",
                                                        backgroundColor: "#4880FF",
                                                        "&:hover": {
                                                            backgroundColor: "rgb(103, 146, 255)",
                                                        },
                                                    }}
                                                >
                                                    {paymentInProgress === tuition.id ? <CircularProgress size={20} /> : "Thanh toán học phí"}
                                                </Button>
                                            )}
                                        </Box>
                                    </Paper>
                                </Collapse>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Box>

            {/* Dialog thanh toán */}
            <Dialog 
                open={paymentDialog.open} 
                onClose={handleClosePaymentDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Thanh toán học phí</DialogTitle>
                <DialogContent>
                    {paymentDialog.tuition && (
                        <Box>
                            <Typography variant="body1" mb={1}>
                                Kỳ học: {paymentDialog.tuition.semesterName} {paymentDialog.tuition.year}
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                Tổng tiền: {formatCurrency(paymentDialog.tuition.totalAmount)}
                            </Typography>
                            <Typography variant="body1" mb={1}>
                                Đã đóng: {formatCurrency(paymentDialog.tuition.paidAmount)}
                            </Typography>
                            <Typography variant="body1" mb={2}>
                                Còn lại: {formatCurrency(paymentDialog.tuition.remainingAmount)}
                            </Typography>
                            
                            <TextField
                                label="Số tiền thanh toán"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        max: paymentDialog.tuition.remainingAmount
                                    }
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePaymentDialog}>Hủy</Button>
                    <Button 
                        onClick={handleConfirmPayment} 
                        variant="contained"
                        disabled={paymentAmount <= 0 || paymentInProgress !== null}
                    >
                        {paymentInProgress ? <CircularProgress size={20} /> : "Xác nhận thanh toán"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog lịch sử thanh toán */}
            <Dialog 
                open={historyDialog.open} 
                onClose={handleCloseHistoryDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Lịch sử thanh toán</DialogTitle>
                <DialogContent>
                    {historyDialog.tuitionId && (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã thanh toán</TableCell>
                                        <TableCell align="right">Số tiền</TableCell>
                                        <TableCell>Ngày thanh toán</TableCell>
                                        <TableCell>Kỳ học</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paymentHistory
                                        .filter(item => item.semester === historyDialog.tuitionId)
                                        .map((item) => (
                                            <TableRow key={item.paymentId}>
                                                <TableCell>{item.paymentId}</TableCell>
                                                <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                                                <TableCell>{new Date(item.date).toLocaleDateString('vi-VN')}</TableCell>
                                                <TableCell>{item.semester}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    {paymentHistory.filter(item => item.semester === historyDialog.tuitionId).length === 0 && (
                        <Typography>Chưa có lịch sử thanh toán nào.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHistoryDialog}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </ThemeLayout>
    );
};

export default TuitionCollecting;