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
import { tuitionApi, TuitionRecord, PaymentHistoryItem, formatCurrency, getStatusText, getStatusChipColor } from "../api_clients/student/tuitionApi";
import { enrollmentApi, parseSemesterInfo } from "../api_clients/student/enrollmentApi";

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
    const [studentInfo, setStudentInfo] = useState<{ studentId: any; name: any; major: any; majorName: any; } | null>(null);
    const [currentSemester, setCurrentSemester] = useState<string>("");
    const [confirmationStatusMap, setConfirmationStatusMap] = useState<{ [semesterId: string]: boolean }>({});
    
    // Parse semester info only if currentSemester is available
    const semesterInfo = currentSemester ? parseSemesterInfo(currentSemester) : null;
    
    useEffect(() => {
        if (!user || !user.id) return;
        loadTuitionData();
    }, [user]);

    // Thêm useEffect để theo dõi thay đổi của tuitionDataState
    useEffect(() => {
        console.log('🔄 [TuitionCollecting] tuitionDataState changed:', tuitionDataState);
        tuitionDataState.forEach((tuition, index) => {
            console.log(`📊 [TuitionCollecting] State update - Semester ${index + 1}:`, {
                id: tuition.id,
                semesterName: tuition.semesterName,
                status: tuition.status,
                paidAmount: tuition.paidAmount,
                remainingAmount: tuition.remainingAmount
            });
        });
    }, [tuitionDataState]);

    const loadTuitionData = async () => {
        if (!user || !user.id) return;
        
        console.log('🔄 [TuitionCollecting] Starting to load tuition data...');
        setLoading(true);
        setError(null);
        try {
            const [tuitionList, paymentHistoryList] = await Promise.all([
                tuitionApi.getTuitionStatus(String(user.id)),
                tuitionApi.getPaymentHistory(String(user.id))
            ]);
            
            setTuitionDataState(tuitionList);
            setPaymentHistory(paymentHistoryList);

            // Load trạng thái xác nhận cho từng kỳ
            const statusMap: { [semesterId: string]: boolean } = {};
            await Promise.all(
                tuitionList.map(async (tuition) => {
                    try {
                        const status = await enrollmentApi.checkConfirmationStatus(tuition.semester);
                        statusMap[tuition.id] = !!status.isConfirmed;
                        console.log(`🔍 [TuitionCollecting] Confirmation status for ${tuition.id}:`, status.isConfirmed);
                    } catch (error) {
                        console.error(`❌ [TuitionCollecting] Error checking confirmation for ${tuition.id}:`, error);
                        statusMap[tuition.id] = false;
                    }
                })
            );
            setConfirmationStatusMap(statusMap);
            console.log('📊 [TuitionCollecting] Confirmation status map:', statusMap);
        } catch (err: any) {
            console.error('❌ [TuitionCollecting] Error loading tuition data:', err);
            setError(err.message || 'Lỗi khi tải dữ liệu học phí');
        } finally {
            setLoading(false);
            console.log('🏁 [TuitionCollecting] Loading completed');
        }
    };

    const handleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleOpenPaymentDialog = (tuition: TuitionRecord) => {
        // Kiểm tra trạng thái xác nhận cho kỳ học cụ thể
        const isConfirmedForSemester = confirmationStatusMap[tuition.id];
        if (!isConfirmedForSemester) {
            setError('Bạn chưa xác nhận danh sách môn học cho kỳ này. Vui lòng xác nhận trước khi thanh toán.');
            return;
        }

        console.log('💳 [TuitionCollecting] Opening payment dialog for tuition:', {
            id: tuition.id,
            semesterName: tuition.semesterName,
            year: tuition.year,
            status: tuition.status,
            originalAmount: tuition.originalAmount,
            totalAmount: tuition.totalAmount,
            paidAmount: tuition.paidAmount,
            remainingAmount: tuition.remainingAmount,
            isConfirmed: isConfirmedForSemester
        });
        
        setPaymentDialog({ open: true, tuition });
        setPaymentAmount(0);
    };

    const handleClosePaymentDialog = () => {
        setPaymentDialog({ open: false, tuition: null });
        setPaymentAmount(0);
    };

    const handleConfirmPayment = async () => {
        if (!paymentDialog.tuition || !user || !user.id) return;
        
        console.log('💳 [TuitionCollecting] Starting payment process:', {
            userId: user.id,
            tuitionId: paymentDialog.tuition.id,
            semesterName: paymentDialog.tuition.semesterName,
            year: paymentDialog.tuition.year,
            paymentAmount: paymentAmount,
            totalAmount: paymentDialog.tuition.totalAmount,
            paidAmount: paymentDialog.tuition.paidAmount,
            remainingAmount: paymentDialog.tuition.remainingAmount
        });
        
        try {
            setPaymentInProgress(paymentDialog.tuition.id);
            
            console.log('💳 [TuitionCollecting] Making payment API call...');
            await tuitionApi.makePayment(String(user.id), {
                semesterId: paymentDialog.tuition.id,
                amount: paymentAmount,
                paymentMethod: "online"
            });
            
            console.log('✅ [TuitionCollecting] Payment successful, reloading data...');
            // Reload data after successful payment
            await loadTuitionData();
            handleClosePaymentDialog();
        } catch (err: any) {
            console.error('❌ [TuitionCollecting] Payment failed:', err);
            setError(err.message || 'Thanh toán thất bại');
        } finally {
            setPaymentInProgress(null);
        }
    };

    const handleOpenHistoryDialog = (tuitionId: string) => {
        console.log('📋 Opening history dialog for tuition ID:', tuitionId);
        console.log('📋 Available payment history:', paymentHistory);
        console.log('📋 Filtered payment history:', paymentHistory.filter(item => item.registrationId === tuitionId || item.semester === tuitionId));
        setHistoryDialog({ open: true, tuitionId });
    };

    const handleCloseHistoryDialog = () => {
        setHistoryDialog({ open: false, tuitionId: null });
    };

    return (
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

                    {/* Thông báo khi chưa xác nhận đăng ký */}
                    {!loading && !error && tuitionDataState.length > 0 && 
                     tuitionDataState.every(tuition => !confirmationStatusMap[tuition.id]) && (
                        <Alert 
                            severity="warning" 
                            sx={{ 
                                mb: 1,
                                py: 0.5,
                                px: 1.5,
                                backgroundColor: '#fffbe6',
                                border: '1px solid #ffeaa7',
                                color: '#856404',
                                fontSize: '0.95rem',
                                alignItems: 'center',
                                minHeight: 'unset',
                                borderRadius: '8px',
                                boxShadow: 'none',
                                width: 'fit-content',
                                maxWidth: '100%',
                            }}
                        >
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.98rem', display: 'flex', alignItems: 'center', mb: 0 }}>
                                Bạn chưa xác nhận danh sách môn học!
                            </Typography>
                            <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.85rem', display: 'block' }}>
                                Vui lòng vào trang "Danh sách môn học đã đăng ký" để xác nhận trước khi thanh toán học phí.
                            </Typography>
                        </Alert>
                    )}

                    
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
                        {tuitionDataState.map((tuition) => {
                            console.log('🎨 [TuitionCollecting] Rendering tuition item:', {
                                id: tuition.id,
                                semesterName: tuition.semesterName,
                                year: tuition.year,
                                status: tuition.status,
                                originalAmount: tuition.originalAmount,
                                totalAmount: tuition.totalAmount,
                                paidAmount: tuition.paidAmount,
                                remainingAmount: tuition.remainingAmount,
                                isExpanded: expandedId === tuition.id
                            });
                            
                            return (                                <Box key={tuition.id} mb={2}>
                                    <Paper
                                        elevation={1}                                        sx={{
                                            p: 1.5,
                                            borderLeft: "10px solid",
                                            borderColor: tuition.status === 'not_opened' ? "#bdbdbd" : // Chưa mở - xám nhạt
                                                        tuition.remainingAmount === 0 ? "#2e7d32" : // Đã thanh toán đủ - xanh lá đậm
                                                        tuition.remainingAmount > 0 ? "#d32f2f" : // Còn nợ - đỏ đậm
                                                        "#f57c00", // Đã đóng dư - cam đậm
                                            cursor: tuition.status !== 'not_opened' ? "pointer" : "default",
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                                            borderRadius: '12px',
                                            backgroundColor: tuition.status === 'not_opened' ? "#fafafa" : 
                                                           tuition.remainingAmount === 0 ? "#f1f8e9" : // Đã thanh toán - nền xanh nhạt
                                                           tuition.remainingAmount > 0 ? "#ffebee" : // Còn nợ - nền đỏ nhạt
                                                           "#fff3e0", // Đã đóng dư - nền cam nhạt
                                            transition: "all 0.3s ease",
                                            opacity: tuition.status === 'not_opened' ? 0.8 : 1,
                                            border: tuition.status === 'not_opened' ? '1px solid rgba(0, 0, 0, 0.12)' : 
                                                   tuition.remainingAmount === 0 ? '1px solid rgba(46, 125, 50, 0.2)' :
                                                   tuition.remainingAmount > 0 ? '1px solid rgba(211, 47, 47, 0.2)' :
                                                   '1px solid rgba(245, 124, 0, 0.2)',
                                            "&:hover": tuition.status !== 'not_opened' ? {
                                                transform: "translateY(-2px)",
                                                boxShadow: tuition.remainingAmount === 0 ? "0 8px 25px rgba(46, 125, 50, 0.25)" :
                                                          tuition.remainingAmount > 0 ? "0 8px 25px rgba(211, 47, 47, 0.25)" :
                                                          "0 8px 25px rgba(245, 124, 0, 0.25)",
                                                
                                            } : {},
                                        }}
                                        onClick={() => tuition.status !== 'not_opened' && handleExpand(tuition.id)}
                                    >
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "52px" }}>
                                            {/* Left side: Semester info and status */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: "1.1rem",
                                                        color: tuition.status === 'not_opened' ? '#999' : '#2c3e50',
                                                        lineHeight: 1.2,
                                                        mb: 0.2
                                                    }}>
                                                        {tuition.semesterName} - {tuition.year}
                                                    </Typography>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Chip
                                                            label={getStatusText(tuition.status)}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: getStatusChipColor(tuition.status).bg,
                                                                color: getStatusChipColor(tuition.status).text,
                                                                fontWeight: 600,
                                                                fontSize: "0.75rem",
                                                                height: "24px",
                                                                borderRadius: "6px",
                                                            }}
                                                        />
                                                        {tuition.discountInfo && (
                                                            <Chip
                                                                label={`Ưu tiên -${Math.round(tuition.discountInfo.percentage * 100)}%`}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: "#e8f5e8",
                                                                    color: "#2e7d32",
                                                                    fontWeight: 500,
                                                                    fontSize: "0.7rem",
                                                                    height: "22px",
                                                                    borderRadius: "6px",
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>                                            {/* Right side: Payment info */}
                                            <Box sx={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                gap: 2,
                                                textAlign: "right",
                                                minWidth: "280px" // Đảm bảo chiều rộng cố định
                                            }}>
                                                {tuition.status !== 'not_opened' ? (
                                                    <Box sx={{ 
                                                        display: "flex", 
                                                        alignItems: "center",                                                        gap: 2,
                                                        width: "240px", // Chiều rộng cố định cho phần thông tin
                                                        position: "relative" // Để định vị cho text "đã đóng dư"
                                                    }}>
                                                        <Box sx={{ 
                                                            textAlign: "right",
                                                            minWidth: "100px" // Chiều rộng cố định cho cột "Phải đóng"
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block" }}>
                                                                Phải đóng
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#1976d2" }}>
                                                                {formatCurrency(tuition.totalAmount)}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ width: "1px", height: "28px", bgcolor: "#e0e0e0" }} />
                                                        <Box sx={{ 
                                                            textAlign: "right",
                                                            minWidth: "100px" // Chiều rộng cố định cho cột "Còn lại"
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block" }}>
                                                                Còn lại
                                                            </Typography>
                                                            <Typography 
                                                                variant="body2" 
                                                                sx={{ 
                                                                    fontWeight: 600, 
                                                                    fontSize: "0.9rem",
                                                                    color: tuition.remainingAmount > 0 ? "#d32f2f" : 
                                                                           tuition.remainingAmount < 0 ? "#1976d2" : "#2e7d32"
                                                                }}
                                                            >
                                                                {tuition.remainingAmount < 0 ? 
                                                                    `+${formatCurrency(Math.abs(tuition.remainingAmount))}` : 
                                                                    formatCurrency(tuition.remainingAmount)
                                                                }
                                                            </Typography>
                                                            {tuition.remainingAmount < 0 && (
                                                                <Typography variant="caption" color="primary" sx={{ 
                                                                    fontSize: "0.65rem", 
                                                                    fontWeight: 500,
                                                                    display: "block",
                                                                    mt: 0.2
                                                                }}>
                                                                    Đã đóng dư
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                ) : (
                                                    <Box sx={{ 
                                                        width: "240px",
                                                        display: "flex",
                                                        justifyContent: "center"
                                                    }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                                                            Kỳ học chưa mở
                                                        </Typography>
                                                    </Box>
                                                )}
                                                
                                                {tuition.status !== 'not_opened' && (
                                                    <Box sx={{ 
                                                        display: "flex", 
                                                        alignItems: "center",
                                                        color: "text.secondary",
                                                        transition: "transform 0.2s ease",
                                                        transform: expandedId === tuition.id ? "rotate(180deg)" : "rotate(0deg)"
                                                    }}>
                                                        <ExpandMoreIcon fontSize="small" />
                                                    </Box>
                                                )}
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
                                                        {tuition.subjects.map((subject, index) => (
                                                            <TableRow key={subject.courseId || index}>
                                                                <TableCell>{subject.courseName}</TableCell>
                                                                <TableCell>{subject.courseType}</TableCell>
                                                                <TableCell align="center">{subject.credits}</TableCell>
                                                                <TableCell align="right">
                                                                    {formatCurrency(subject.totalFee)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                        {tuition.subjects.length === 0 && (
                                                            <TableRow>
                                                                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                                    <Typography color="text.secondary">
                                                                        Chưa có môn học nào được đăng ký
                                                                    </Typography>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                                            <TableCell colSpan={3}>
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    Tổng học phí gốc (trước ưu tiên)
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    {formatCurrency(tuition.originalAmount)}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Box mt={2}>
                                                <Typography variant="body1" mb={1}>
                                                    <strong>Tổng học phí gốc:</strong> {formatCurrency(tuition.originalAmount)}
                                                </Typography>
                                                {tuition.discountInfo && (
                                                    <Typography variant="body1" mb={1} color="success.main">
                                                        <strong>Ưu tiên {tuition.discountInfo.code ? `(${tuition.discountInfo.code})` : ''} - {tuition.discountInfo.type}:</strong> -{Math.round(tuition.discountInfo.percentage * 100)}%
                                                    </Typography>
                                                )}
                                                <Typography variant="body1" mb={1}>
                                                    <strong>Số tiền phải đóng:</strong> {formatCurrency(tuition.totalAmount)}
                                                </Typography>
                                                <Typography variant="body1" mb={1}>
                                                    <strong>Đã đóng:</strong> {formatCurrency(tuition.paidAmount)}
                                                </Typography>
                                                <Typography variant="body1" color={tuition.remainingAmount > 0 ? "error" : "success"}>
                                                    <strong>Còn lại:</strong> {tuition.remainingAmount < 0 ? `Bạn đã đóng dư: ${formatCurrency(Math.abs(tuition.remainingAmount))}, vui lòng liên hệ phòng tài chính để lấy lại tiền.` : formatCurrency(tuition.remainingAmount)}
                                                </Typography>
                                                {tuition.dueDate && (
                                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                                        Hạn nộp: {new Date(tuition.dueDate).toLocaleDateString('vi-VN')}
                                                    </Typography>
                                                )}
                                            </Box>                                            {/* Thông báo khi chưa xác nhận đăng ký cho kỳ này */}
                                            {confirmationStatusMap[tuition.id] === false && (
                                                <Alert 
                                                    severity="warning" 
                                                    sx={{ 
                                                        mt: 2,
                                                        mb: 2,
                                                        borderRadius: '8px',
                                                        backgroundColor: '#fffbe6',
                                                        border: '1px solid #ffeaa7',
                                                        color: '#856404',
                                                        boxShadow: 'none',
                                                        '& .MuiAlert-icon': {
                                                            color: '#f57c00'
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                        Bạn chưa xác nhận danh sách môn học cho kỳ này!
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ fontSize: '0.85rem', display: 'block' }}>
                                                        Vui lòng vào trang "Danh sách môn học đã đăng ký" để xác nhận trước khi thanh toán học phí.
                                                    </Typography>
                                                </Alert>
                                            )}

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
                                                        disabled={tuition.status === 'not_opened' || paymentInProgress === tuition.id || confirmationStatusMap[tuition.id] === false}
                                                        sx={{
                                                            textTransform: "none",
                                                            borderRadius: "0.5rem",
                                                            backgroundColor: tuition.status === 'not_opened' || confirmationStatusMap[tuition.id] === false ? '#ccc' : "#4880FF",
                                                            '&:hover': {
                                                                backgroundColor: tuition.status === 'not_opened' || confirmationStatusMap[tuition.id] === false ? '#ccc' : "rgb(103, 146, 255)",
                                                            },
                                                        }}
                                                    >
                                                        {paymentInProgress === tuition.id ? <CircularProgress size={20} /> : 
                                                         confirmationStatusMap[tuition.id] === false ? "Chưa xác nhận đăng ký" : "Thanh toán học phí"}
                                                    </Button>
                                                )}
                                            </Box>
                                        </Paper>
                                    </Collapse>
                                </Box>
                            );
                        })}
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
                            {paymentDialog.tuition.remainingAmount < 0 && (
                                <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Bạn đã đóng dư tiền, vui lòng liên hệ phòng tài chính để lấy lại tiền.
                                </Typography>
                            )}
                            
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paymentHistory
                                        .filter(item => item.registrationId === historyDialog.tuitionId || item.semester === historyDialog.tuitionId)
                                        .map((item) => (
                                            <TableRow key={item.paymentId}>
                                                <TableCell>{item.paymentId}</TableCell>
                                                <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                                                <TableCell>{new Date(item.paymentDate).toLocaleDateString('vi-VN')}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    {paymentHistory.filter(item => item.registrationId === historyDialog.tuitionId || item.semester === historyDialog.tuitionId).length === 0 && (
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