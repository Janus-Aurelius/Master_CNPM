// File: src/login_page/login_form.tsx
import { useState, FormEvent } from 'react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useNavigate } from 'react-router-dom';

// Define proper theme without 'defaultColorScheme'
const customTheme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                // You can customize the light color scheme here
            }
        }
    }
});

// Define interface for the component's props
interface LoginFormProps {
    onLogin?: (user: UserData) => void;
}

// Define interface for user data
interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<string>('student');
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    // Modified form submit handler with proper type annotations
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');

        // Validate that email exists and is a string
        if (!email || typeof email !== 'string') {
            alert('Email không hợp lệ');
            return;
        }

        // Create a user object
        const mockUser: UserData = {
            id: '12345',
            email: email,
            name: email.split('@')[0], // Extract username from email
            role: selectedRole
        };

        // Call the onLogin function if provided
        if (onLogin) {
            onLogin(mockUser);
            // Navigate to the appropriate route based on role
            navigate(`/${selectedRole}`);
        } else {
            // Fallback for preview mode when onLogin isn't provided
            navigate(`/${selectedRole}`);
        }
    };

    // Handle role selection change with proper typing / / the unknown property
    const handleRoleChange = (_: unknown, newValue: string | null) => {
        if (newValue) {
            setSelectedRole(newValue);
        }
    };


    return (
        <CssVarsProvider theme={customTheme} disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': '0.4s'
                    }
                }}
            />
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundImage: 'url(https://scontent.fsgn16-1.fna.fbcdn.net/v/t39.30808-6/456257255_122144899760266532_4108067441536433176_n.png?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeERGNyEpQ2zDGtm75jMJP2iCIlu1oPb264IiW7Wg9vbrqEfsGRPxjIl6ORWN66BtcnSowhKkRK5jui32BOULOsL&_nc_ohc=zPH3vTaMdfQQ7kNvgGOHoLp&_nc_oc=AdnJU3ZBa0lLHc2ULLTtlsnd5Ue277mCpQIhy8hLz0c24EVPfvJyT76-8HWAz5HOGCiUktut_D9a7jJbR-MIxocu&_nc_zt=23&_nc_ht=scontent.fsgn16-1.fna&_nc_gid=B5eO8nkzFPVg9grxrTo5kw&oh=00_AYGVNyfbKVaPhGIISu4QfquyqtIRr8RJNtK7iLIKqTCOgQ&oe=67E88F52)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'right center',
                        filter: 'blur(10px)',
                        zIndex: -1,
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 2,
                        width: { xs: '90%', md: '50%' },
                        maxWidth: '600px',
                        backgroundColor: 'rgba(255, 255, 255, 0.68)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '20px',
                        boxShadow: '0 4px 40px rgba(0, 0, 0, 0.35)',
                        padding: 4,
                    }}
                >
                    <Box
                        component="header"
                        sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center', ml: 4 }}>
                            <IconButton variant="soft" color="primary" size="sm" sx={{ backgroundColor: 'transparent' }}>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/00/Logo_UIT_updated.svg"
                                    alt="University Logo"
                                    style={{ width: 70, height: 70}}
                                />
                            </IconButton>
                            <Typography level="title-lg" sx={{ fontWeight: 'bold', fontSize: '30px' }}>  
                                <span style={{ color: '#4299e1' }}>UIT</span> 
                                <span style={{ color: '#b2f5ea' }}> - </span> 
                                <span style={{ color: '#38b2ac' }}>ĐĂNG KÍ HỌC PHẦN</span>
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: 'auto',
                            py: 2,
                            pb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 430,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden'
                            },
                            '& *': {
                            fontSize: '18px' 
        }
                        }}
                    >
                        <Stack sx={{ gap: 2, mb: 0 }}>
                            <Stack sx={{ gap: 10 }}>
                                <Typography component="h1" level="h3" sx={{ fontSize: '49px', fontWeight: 'bold', textAlign: 'center' }}>
                                    Đăng nhập
                                </Typography> 
                            </Stack>
                        </Stack>
                        <Stack sx={{ gap: 1, mt: 2 }}>
                            <form onSubmit={handleFormSubmit}>
                                <FormControl required  sx={{ mb: 1.5 }}>
                                <FormLabel sx={{ fontSize: '20px', color: '#606060' }}>Email</FormLabel>
                                    <Input type="email" name="email" sx={{ height: '45px', borderRadius: '10px', boxShadow: 'none'}} />
                                </FormControl>
                                <FormControl required  sx={{ mb: 1.5 }}>
                                    <FormLabel sx={{ fontSize: '20px', color: '#606060' }}>Mật khẩu</FormLabel>
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        sx={{ height: '45px', borderRadius: '10px', boxShadow: 'none' }}
                                        endDecorator={
                                            <IconButton
                                                variant="plain"
                                                onClick={handleClickShowPassword}
                                                sx={{ ml: -1.5 }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        }
                                    />
                                </FormControl>
                                <FormControl required sx={{ mb: 4 }}>
                                    <FormLabel sx={{ fontSize: '20px', color: '#606060' }}>Vai trò</FormLabel>
                                    <Select
                                        name="role"
                                        sx={{ height: '45px', borderRadius: '10px', boxShadow: 'none' }}
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                    >
                                        <Option value="student">Sinh viên</Option>
                                        <Option value="academic">Giảng viên</Option>
                                        <Option value="financial">Phòng tài chính</Option>
                                        <Option value="admin">Admin</Option>
                                    </Select>
                                </FormControl>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Checkbox
                                        size="sm"
                                        label="Lưu thông tin đăng nhập"
                                    name="persistent"
                                    sx={{
                                        '& .MuiTypography-root': {
                                        fontSize: '15px' 
                                            },
                                            color: '#606060' 
                                        }}
                                    />
                                    <Link level="title-sm" href="#replace-with-a-link" sx={{ fontSize: '15px' }}>
                                        Quên mật khẩu
                                    </Link>
                                </Box>
                                <Button type="submit" fullWidth sx={{borderRadius: '10px', backgroundColor: '#2f6bff', color: 'white'}}>
                                    Đăng nhập
                                </Button>
                            </form>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                            © A Project of Group 4 - {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}