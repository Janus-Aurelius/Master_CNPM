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
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getStudentTuitionStatus, getStudentPaymentHistory, submitTuitionPayment } from "../api_clients/tuitionApi";

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
    status: "paid" | "pending" | "unpaid"| "default";
    subjects: EnrolledSubject[];
    totalAmount: number;
}

const getStatusChipColor = (status: string): { bg: string; text: string } => {
    switch (status) {
        case "paid":
            return { bg: "#d9fade", text: "#4caf50" };
        case "pending":
            return { bg: "#fff8e1", text: "#f57c00" };
        case "unpaid":
            return { bg: "#ffebee", text: "#ef5350" };
        default:
            return { bg: "#e0e0e0", text: "#616161" };
    }
};
//NHANNNNNNNNNNNNNN
// Thêm interface cho lịch sử thanh toán
interface PaymentHistoryItem {
    amount: number;
    date: string;
}

const TuitionCollecting = ({ user, onLogout }: StudentPageProps) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [paymentInProgress, setPaymentInProgress] = useState<number | null>(null);
    const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; tuition: TuitionRecord | null }>({ open: false, tuition: null });
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentHistory, setPaymentHistory] = useState<Record<number, PaymentHistoryItem[]>>({});
    const [editDialog, setEditDialog] = useState<{ open: boolean; tuition: TuitionRecord | null }>({ open: false, tuition: null });
    const [tuitionDataState, setTuitionDataState] = useState<TuitionRecord[]>([]);
    const [historyDialog, setHistoryDialog] = useState<{ open: boolean; tuitionId: number | null }>({ open: false, tuitionId: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !user.id) return;
        setLoading(true);
        setError(null);
        Promise.all([
            getStudentTuitionStatus(String(user.id)),
            getStudentPaymentHistory(String(user.id))
        ])
            .then(([tuitionList, paymentHistoryList]) => {
                setTuitionDataState(tuitionList);
                const historyMap: Record<number, PaymentHistoryItem[]> = {};
                paymentHistoryList.forEach((item: any) => {
                    if (!historyMap[item.tuitionId]) historyMap[item.tuitionId] = [];
                    historyMap[item.tuitionId].push({ amount: item.amount, date: item.date });
                });
                setPaymentHistory(historyMap);
            })
            .catch((err) => {
                setError(err.message || 'Lỗi khi tải dữ liệu học phí');
            })
            .finally(() => setLoading(false));
    }, [user]);

    const handleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getPaidAmount = (tuitionId: number) => {
        return (paymentHistory[tuitionId] || []).reduce((sum, item) => sum + item.amount, 0);
    };

    const handleOpenPaymentDialog = (tuition: TuitionRecord) => {
        setPaymentDialog({ open: true, tuition });
        setPaymentAmount(tuition.totalAmount - getPaidAmount(tuition.id));
    };

    const handleClosePaymentDialog = () => {
        setPaymentDialog({ open: false, tuition: null });
        setPaymentAmount(0);
    };

    const handleConfirmPayment = async () => {
        if (!paymentDialog.tuition || !user || !user.id) return;
        const tuitionId = paymentDialog.tuition.id;
        try {
            setLoading(true);
            setError(null);
            await submitTuitionPayment(String(user.id), {
                amount: paymentAmount,
                paymentMethod: "online",
                semester: paymentDialog.tuition.semester,
                status: "pending"
            });
            const [tuitionList, paymentHistoryList] = await Promise.all([
                getStudentTuitionStatus(String(user.id)),
                getStudentPaymentHistory(String(user.id))
            ]);
            setTuitionDataState(tuitionList);
            const historyMap: Record<number, PaymentHistoryItem[]> = {};
            paymentHistoryList.forEach((item: any) => {
                if (!historyMap[item.tuitionId]) historyMap[item.tuitionId] = [];
                historyMap[item.tuitionId].push({ amount: item.amount, date: item.date });
            });
            setPaymentHistory(historyMap);
            handleClosePaymentDialog();
        } catch (err: any) {
            setError(err.message || 'Thanh toán thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenHistoryDialog = (tuitionId: number) => {
        setHistoryDialog({ open: true, tuitionId });
    };

    const handleCloseHistoryDialog = () => {
        setHistoryDialog({ open: false, tuitionId: null });
    };

    const handleOpenEditDialog = (tuition: TuitionRecord) => {
        setEditDialog({ open: true, tuition });
    };

    const handleCloseEditDialog = () => {
        setEditDialog({ open: false, tuition: null });
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

                    <Box>
                        {tuitionDataState.map((tuition) => {
                            const paid = getPaidAmount(tuition.id);
                            const remaining = tuition.totalAmount - paid;
                            return (
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
                                                    Học phí {tuition.semester} {tuition.year}
                                                </Typography>
                                                <Chip
                                                    label={
                                                        tuition.status === "paid"
                                                            ? "Đã nộp"
                                                            : tuition.status === "pending"
                                                            ? "Đang xử lý"
                                                            : "Chưa nộp"
                                                    }
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
                                                        <TableRow sx={{ bgcolor: "#f5f5f5" }}>
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

                                            <Box mt={2}>
                                                <Typography>Đã đóng: <b>{paid.toLocaleString()} VNĐ</b></Typography>
                                                <Typography>Còn lại: <b>{remaining.toLocaleString()} VNĐ</b></Typography>
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
                                                        sx={{
                                                            textTransform: "none",
                                                            borderRadius: "0.5rem",
                                                            backgroundColor: "#4880FF",
                                                            "&:hover": {
                                                                backgroundColor: "rgb(103, 146, 255)",
                                                            },
                                                        }}
                                                    >
                                                        Thanh toán học phí
                                                    </Button>
                                                )}
                                                {tuition.status !== "paid" && (
                                                    <Button variant="outlined" color="secondary" onClick={() => handleOpenEditDialog(tuition)}>
                                                        Chỉnh sửa đăng ký
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
            {/* Dialog nhập số tiền thanh toán */}
            {paymentDialog.open && paymentDialog.tuition && (
                <div className="modal-bg">
                    <div className="modal">
                        <h3>Thanh toán học phí</h3>
                        <div>Tổng tiền: {paymentDialog.tuition.totalAmount.toLocaleString()} VNĐ</div>
                        <div>Đã đóng: {getPaidAmount(paymentDialog.tuition.id).toLocaleString()} VNĐ</div>
                        <div>Còn lại: {(paymentDialog.tuition.totalAmount - getPaidAmount(paymentDialog.tuition.id)).toLocaleString()} VNĐ</div>
                        <input type="number" value={paymentAmount} min={0} max={paymentDialog.tuition.totalAmount} onChange={e => setPaymentAmount(Number(e.target.value))} />
                        <button onClick={handleConfirmPayment} disabled={paymentAmount <= 0}>Xác nhận thanh toán</button>
                        <button onClick={handleClosePaymentDialog}>Hủy</button>
                    </div>
                </div>
            )}
            {/* Dialog lịch sử thanh toán */}
            {historyDialog.open && historyDialog.tuitionId !== null && (
                <div className="modal-bg">
                    <div className="modal">
                        <h3>Lịch sử thanh toán</h3>
                        <ul>
                            {(paymentHistory[historyDialog.tuitionId] || []).map((item, idx) => (
                                <li key={idx}>Số tiền: {item.amount.toLocaleString()} VNĐ - Ngày: {item.date}</li>
                            ))}
                        </ul>
                        <button onClick={handleCloseHistoryDialog}>Đóng</button>
                    </div>
                </div>
            )}
            {/* Dialog chỉnh sửa đăng ký (mock) */}
            {editDialog.open && editDialog.tuition && (
                <div className="modal-bg">
                    <div className="modal">
                        <h3>Chỉnh sửa đăng ký môn học (demo)</h3>
                        <div>Chức năng này sẽ cho phép thêm/xóa môn học cho kỳ {editDialog.tuition.semester} {editDialog.tuition.year}.</div>
                        <button onClick={handleCloseEditDialog}>Đóng</button>
                    </div>
                </div>
            )}
        </ThemeLayout>
    );
};

export default TuitionCollecting;