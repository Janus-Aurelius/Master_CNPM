// src/student_pages/dashboard_student.tsx
import { ThemeLayout } from "../styles/theme_layout";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TimetableGrid } from "../components/layout/datagrid/TimetableGrid";
import { StudentPageProps } from "../types";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Avatar from '@mui/material/Avatar';


const UserInfoContainer = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: '16px',
    right: '16px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '28px',
    zIndex: 1100,
    padding: '8px 16px 8px 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
    marginRight: '16px',
    border: '1px solid rgba(233, 236, 239, 0.8)',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
}));

const LandingPageForm = ({ user, onLogout }: StudentPageProps) => {
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'S';
    
    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <UserInfoContainer>
                <Avatar 
                    sx={{ 
                        width: 38, 
                        height: 38, 
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        marginRight: 1.5
                    }}
                >
                    {userInitial}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            fontWeight: 600, 
                            fontSize: '0.95rem',
                            lineHeight: 1.2
                        }}
                    >
                        {user?.name || "Student"}
                    </Typography>
                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                        }}
                    >
                        Sinh viên
                    </Typography>
                </Box>
            </UserInfoContainer>
            
            <Box sx={{ padding: "0px", position: "relative" }}>
                <TimetableGrid />
            </Box>
        </ThemeLayout>
    );
};

export default LandingPageForm;