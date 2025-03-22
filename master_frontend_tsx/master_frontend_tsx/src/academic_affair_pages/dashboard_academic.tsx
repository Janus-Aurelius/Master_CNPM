import {ThemeLayout} from "../styles/theme_layout.tsx";
import Typography from "@mui/material/Typography";
import {User} from "../types";


interface AcademicPageProps {
    user: User | null;
    onLogout: () => void;
}


export default function DashboardAcademic({ onLogout }: AcademicPageProps) {
    return (
        <ThemeLayout role="academic" onLogout={onLogout}>
            <Typography variant="h4">Trang chủ</Typography>
        </ThemeLayout>
    );
}