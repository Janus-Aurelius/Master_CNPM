// src/student_pages/dashboard_student.tsx
import { ThemeLayout } from "../styles/theme_layout";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TimetableGrid } from "../components/layout/datagrid/TimetableGrid";
import { StudentPageProps } from "../types";


const LandingPageForm = ({ user, onLogout }: StudentPageProps) => {
    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <Box sx={{ padding: "24px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ fontWeight: "bold", color: "black" }}
                    >
                        Welcome, {user?.name || "Student"}
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold", color: "black", marginTop: 2 }}
                >
                    Your Schedule
                </Typography>
                <TimetableGrid />
            </Box>
        </ThemeLayout>
    );
};

export default LandingPageForm;