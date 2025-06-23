import { Box, Typography, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";

const UserInfoContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '1rem',
    right: '1.625rem', 
    display: 'flex',
    alignItems: 'center',
    borderRadius: '1.75rem',
    zIndex: 1100,
    padding: '0.5rem 1rem 0.5rem 0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(0.5rem)',
    boxShadow: '0 0.125rem 0.3125rem rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 0.25rem 1.25rem rgba(0, 0, 0, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
}));

interface UserInfoProps {
    user: { name?: string; role?: string; username?: string; } | null;
}

const roleDisplayName: Record<string, string> = {
    student: 'Sinh viên',
    academic: 'Phòng đào tạo',
    financial: 'Phòng tài chính',
    admin: 'Quản trị viên',
};

const UserInfo = ({ user }: UserInfoProps) => {
    // Use username as name if name is not available
    const userName = user?.name || user?.username || "Student";
    const userInitial = userName.charAt(0).toUpperCase();
    const roleName = user?.role ? roleDisplayName[user.role] || user.role : 'Sinh viên';

    console.log('UserInfo rendering with user:', user);

    return (
        <UserInfoContainer>
            <Avatar 
                sx={{ 
                    width: '2.375rem', 
                    height: '2.375rem', 
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginRight: '0.9375rem'
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
                    {userName}
                </Typography>
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.75rem'
                    }}
                >
                    {roleName}
                </Typography>
            </Box>
        </UserInfoContainer>
    );
};

export default UserInfo;