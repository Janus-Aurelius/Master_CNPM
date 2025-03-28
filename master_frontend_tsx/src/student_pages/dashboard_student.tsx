// src/student_pages/dashboard_student.tsx
import { ThemeLayout } from "../styles/theme_layout";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TimetableGrid } from "../components/layout/datagrid/TimetableGrid";
import { StudentPageProps } from "../types";
import styled from "styled-components";

const StyledScheduleContainer = styled.div`
    text-align: left;
    border-radius: 16px;
    padding: 20px;
    font-size: 18px;
    font-family: Roboto, serif;
    font-weight: 450;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
    color: rgb(39, 89, 217);
    transition: all 0.25s ease;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    margin-top: 16px;
    flex-grow: 1; 
    min-height: 400px; 
    max-height: calc(100vh - 150px); // Đảm bảo không vượt quá chiều cao viewport
`;

const LandingPageForm = ({ user, onLogout }: StudentPageProps) => {
    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <Box sx={{ padding: "24px", marginLeft: "-40px" }}>
                <Box sx={{
        fontWeight: "bold",
        color: "#0078D4",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", 
    }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{ fontWeight: "bold", color: " ", marginLeft: "10px", marginTop: "-15px"  }}
                    >
                        Xin chào, {user?.name || "Student"}!
                    </Typography>
                </Box>

                <StyledScheduleContainer>
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            fontStyle: "normal",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: 0,
                            marginTop: '-15px',
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Thời khóa biểu
                    </Typography>
                    <TimetableGrid />
                </StyledScheduleContainer>
            </Box>
        </ThemeLayout>
    );
};

export default LandingPageForm;