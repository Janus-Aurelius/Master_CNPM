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
    username: string;
    role: string;
    studentId?: string;
    name?: string;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<string>('student');
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;        try {
            console.log('🔐 Sending login request...');
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log('✅ Login response:', data);

            if (response.status === 503) {
                // Hiển thị thông báo bảo trì
                alert(data.message || 'Hệ thống đang bảo trì');
                return;
            }            if (data.success) {
                console.log('👤 User data from backend:', data.data.user);
                console.log('🔑 Token from backend:', data.data.token);
                
                // Make sure username is set as name if it doesn't exist
                if (!data.data.user.name && data.data.user.username) {
                    data.data.user.name = data.data.user.username;
                }
                
                // Save user data and tokens to localStorage
                localStorage.setItem('user', JSON.stringify(data.data.user));
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('refreshToken', data.data.refreshToken);

                console.log('💾 Saved to localStorage:');
                console.log('- User:', JSON.parse(localStorage.getItem('user') || '{}'));
                console.log('- Token:', localStorage.getItem('token'));

                if (onLogin) {
                    onLogin(data.data.user);
                    navigate(data.data.redirectUrl);
                }
            } else {
                console.error('❌ Login failed:', data.message);
                alert(data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Đã có lỗi xảy ra khi đăng nhập');
        }
    };

    return (
        <CssVarsProvider theme={customTheme} disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '50rem',
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
                        backgroundImage: 'url(https://i.postimg.cc/dtssdkvr/f.png)',
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
                        maxWidth: '33.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.68)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '1.25rem',
                        boxShadow: '0 0.25rem 2.5rem rgba(0, 0, 0, 0.35)',
                        padding: '1rem',
                    }}
                >
                    <Box
                        component="header"
                        sx={{ py: '1.875rem', display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box sx={{ gap: '0.125rem', display: 'flex', alignItems: 'center', ml: '0.7rem' }}>
                            <IconButton variant="soft" color="primary" size="sm" sx={{ backgroundColor: 'transparent' }}>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/00/Logo_UIT_updated.svg"
                                    alt="University Logo"
                                    style={{ width: '4.375rem', height: '4.375rem'}}
                                />
                            </IconButton>
                            <Typography level="title-lg" sx={{ fontWeight: 'bold', fontSize: '1.875rem' , ml: '1rem'}}>  
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
                            py: '0.5rem',
                            pb: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            width: '26.875rem',
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden'
                            },
                            '& *': {
                                fontSize: '1rem' 
                            }
                        }}
                    >
                        <Stack sx={{ gap: '0.5rem', mb: '1.25rem' }}>
                            <Stack sx={{ gap: '1rem' }}>
                                <Typography 
                                    component="h1" 
                                    level="h3" 
                                    sx={{ 
                                        fontSize: '2.7rem', 
                                        fontWeight: 'bold', 
                                        textAlign: 'center',
                                    }}
                                >
                                    Đăng nhập
                                </Typography> 
                            </Stack>
                        </Stack>
                        <Stack sx={{  gap: '0.0625rem', mt: '0.125rem' }}>
                            <form onSubmit={handleFormSubmit} autoComplete="off">
                                <FormControl required  sx={{ mb: '0.09375rem' }}>
                                    <FormLabel sx={{ fontSize: '1.25rem', color: '#606060' }}>Tên đăng nhập</FormLabel>
                                    <Input
                                        name="username"
                                        type="text"
                                        autoComplete="new-username"
                                        sx={{ height: '2.8125rem', borderRadius: '0.625rem', boxShadow: 'none' }}
                                        required
                                    />
                                </FormControl>
                                <FormControl required  sx={{ mb: '0.09375rem' }}>
                                    <FormLabel sx={{ fontSize: '1.25rem', color: '#606060' }}>Mật khẩu</FormLabel>
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        sx={{ height: '2.8125rem', borderRadius: '0.625rem', boxShadow: 'none' }}
                                        required
                                        endDecorator={
                                            <IconButton
                                                variant="plain"
                                                onClick={handleClickShowPassword}
                                                sx={{ ml: '-0.09375rem' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        }
                                    />
                                </FormControl>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: '0.5rem'
                                    }}
                                >
                                </Box>
                                <Button type="submit" fullWidth sx={{borderRadius: '0.625rem', backgroundColor: '#2f6bff', color: 'white'}}>
                                    Đăng nhập
                                </Button>
                            </form>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: '1.875rem' }}>
                        <Typography level="body-xs" sx={{ textAlign: 'center' }}>
                            © A Project of Group 4 - {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}