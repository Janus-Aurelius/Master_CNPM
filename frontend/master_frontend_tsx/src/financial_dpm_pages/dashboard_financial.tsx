import { useEffect, useState } from "react";
import { ThemeLayout } from "../styles/theme_layout.tsx";
import Typography from "@mui/material/Typography";
import { User } from "../types";
// import { getFinancialDashboard } from "../api_clients/financial/financialApi";
import { Box, Paper, CircularProgress, Alert } from "@mui/material";

// TODO: Temporary mock function to prevent build errors - replace with actual API when ready
const getFinancialDashboard = async () => ({ 
    overview: { totalStudents: 0, totalTuition: 0, totalPaid: 0, totalPending: 0, paymentRate: 0 },
    recentPayments: [],
    semesterStats: []
});

interface FinancialPageProps {
    user: User | null;
    onLogout: () => void;
}

export default function DashboardFinancial({ user, onLogout }: FinancialPageProps) {
    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getFinancialDashboard()
            .then(setDashboard)
            .catch((err) => setError(err.message || 'Lỗi khi tải dashboard'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <ThemeLayout role="financial" onLogout={onLogout}>
            <Typography variant="h4" className="font-semibold" sx={{ mb: 3 }}>Trang chủ tài chính</Typography>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {dashboard && (
                <Box display="flex" gap={3}>
                    <Paper sx={{ p: 3, minWidth: 220 }}>
                        <Typography variant="h6">Tổng số sinh viên đã đóng</Typography>
                        <Typography variant="h4" color="success.main">{dashboard.paidCount ?? '--'}</Typography>
                    </Paper>
                    <Paper sx={{ p: 3, minWidth: 220 }}>
                        <Typography variant="h6">Tổng số sinh viên chưa đóng</Typography>
                        <Typography variant="h4" color="error.main">{dashboard.unpaidCount ?? '--'}</Typography>
                    </Paper>
                    <Paper sx={{ p: 3, minWidth: 220 }}>
                        <Typography variant="h6">Tổng tiền đã thu</Typography>
                        <Typography variant="h4" color="primary.main">{dashboard.totalPaid?.toLocaleString() ?? '--'} VNĐ</Typography>
                    </Paper>
                </Box>
            )}
        </ThemeLayout>
    );
}