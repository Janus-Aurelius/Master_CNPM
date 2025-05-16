// src/student_pages/dashboard_student.tsx
import { ThemeLayout } from "../styles/theme_layout";
import Box from "@mui/material/Box";
import { TimetableGrid } from "../components/layout/datagrid/TimetableGrid";
import { StudentPageProps } from "../types";
import UserInfo from "../components/UserInfo";

const LandingPageForm = ({ user, onLogout }: StudentPageProps) => {
    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <UserInfo user={user} />
            <Box sx={{ padding: "0", position: "relative" }}>
                <TimetableGrid />
            </Box>
        </ThemeLayout>
    );
};

export default LandingPageForm;