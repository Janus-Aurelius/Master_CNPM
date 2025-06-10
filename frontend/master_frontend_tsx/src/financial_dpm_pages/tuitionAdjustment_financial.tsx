import {ThemeLayout} from "../styles/theme_layout.tsx";
import Typography from "@mui/material/Typography";
import {User} from "../types";

interface FinancialPageProps {
    user: User | null;
    onLogout: () => void;
}


export default function TuitionAdjustment({ onLogout }: FinancialPageProps) {
    return (
        <ThemeLayout role="financial" onLogout={onLogout}>
            <Typography variant="h4">Quản lý học phí</Typography>
        </ThemeLayout>
    );
}