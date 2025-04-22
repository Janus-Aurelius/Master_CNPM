import { useState } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import { StudentPageProps } from "../types";
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

const enrolledSubjects: EnrolledSubject[] = [
    { id: 1, name: "Mathematics", credits: 3, tuition: 450000 },
    { id: 2, name: "Physics", credits: 4, tuition: 600000 },
    { id: 3, name: "Chemistry", credits: 3, tuition: 450000 },
    { id: 4, name: "Biology", credits: 4, tuition: 600000 },
];

const tuitionData: TuitionRecord[] = [
    {
        id: 1,
        semester: "Fall",
        year: "2023-2024",
        dueDate: "15/09/2023",
        status: "unpaid",
        subjects: enrolledSubjects,
        totalAmount: 2100000,
    },
    {
        id: 2,
        semester: "Spring",
        year: "2022-2023",
        dueDate: "15/01/2023",
        status: "paid",
        subjects: enrolledSubjects.slice(0, 2),
        totalAmount: 1050000,
    },
    {
        id: 3,
        semester: "Fall",
        year: "2022-2023",
        dueDate: "15/09/2022",
        status: "unpaid",
        subjects: enrolledSubjects.slice(1, 4),
        totalAmount: 1650000,
    },
];

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

const TuitionCollecting = ({ onLogout }: StudentPageProps) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [paymentInProgress, setPaymentInProgress] = useState<number | null>(null);

    const handleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleProceedToPayment = (tuitionId: number) => {
        setPaymentInProgress(tuitionId);
        setTimeout(() => {
            alert("Thanh toán thành công! Yêu cầu xác nhận đã được gửi đến Phòng Tài chính.");
            setPaymentInProgress(null);
        }, 2000);
    };

    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        textAlign: "left",
                        borderRadius: "16px",
                        padding: "20px",
                        fontSize: "18px",
                        fontFamily: '"Varela Round", sans-serif',
                        fontWeight: 450,
                        backgroundColor: "rgb(250, 250, 250)",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                        color: "rgb(39, 89, 217)",
                        transition: "all 0.25s ease",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        overflow: "hidden",
                        marginTop: "16px",
                        flexGrow: 1,
                        maxHeight: "calc(100vh - 150px)",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        marginLeft: "0px",
                        marginRight: "10px",
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            fontStyle: "normal",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: "14px",
                            marginTop: "0px",
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Tình trạng học phí
                    </Typography>

                    <Box>
                        {tuitionData.map((tuition) => (
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

                                        {tuition.status === "unpaid" && (
                                            <Box mt={3} display="flex" justifyContent="flex-end">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<PaymentIcon />}
                                                    disabled={paymentInProgress === tuition.id}
                                                    onClick={() => handleProceedToPayment(tuition.id)}
                                                    sx={{
                                                        textTransform: "none",
                                                        borderRadius: "8px",
                                                        backgroundColor: "#4880FF",
                                                        "&:hover": {
                                                            backgroundColor: "rgb(103, 146, 255)",
                                                        },
                                                    }}
                                                >
                                                    {paymentInProgress === tuition.id ? "Đang xử lý..." : "Tiến hành thanh toán"}
                                                </Button>
                                            </Box>
                                        )}
                                    </Paper>
                                </Collapse>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Box>
        </ThemeLayout>
    );
};

export default TuitionCollecting;