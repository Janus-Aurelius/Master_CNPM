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
                        maxWidth: '37.5rem',
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
                        <Box sx={{ gap: '0.125rem', display: 'flex', alignItems: 'center', ml: '1rem' }}>
                            <IconButton variant="soft" color="primary" size="sm" sx={{ backgroundColor: 'transparent' }}>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/00/Logo_UIT_updated.svg"
                                    alt="University Logo"
                                    style={{ width: '4.375rem', height: '4.375rem'}}
                                />
                            </IconButton>
                            <Typography level="title-lg" sx={{ fontWeight: 'bold', fontSize: '1.875rem' }}>  
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
                        <Stack sx={{ gap: '0.5rem', mb: 0 }}>
                            <Stack sx={{ gap: '0.625rem' }}>
                                <Typography component="h1" level="h3" sx={{ fontSize: '3.0625rem', fontWeight: 'bold', textAlign: 'center' }}>
                                    Đăng nhập
                                </Typography> 
                            </Stack>
                        </Stack>
                        <Stack sx={{ gap: '0.0625rem', mt: '0.125rem' }}>
                            <form onSubmit={handleFormSubmit}>
                                <FormControl required  sx={{ mb: '0.09375rem' }}>
                                <FormLabel sx={{ fontSize: '1.25rem', color: '#606060' }}>Email</FormLabel>
                                    <Input type="email" name="email" sx={{ height: '2.8125rem', borderRadius: '0.625rem', boxShadow: 'none'}} />
                                </FormControl>
                                <FormControl required  sx={{ mb: '0.09375rem' }}>
                                    <FormLabel sx={{ fontSize: '1.25rem', color: '#606060' }}>Mật khẩu</FormLabel>
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        sx={{ height: '2.8125rem', borderRadius: '0.625rem', boxShadow: 'none' }}
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
                                <FormControl required sx={{ mb: '0.25rem' }}>
                                    <FormLabel sx={{ fontSize: '1.25rem', color: '#606060' }}>Vai trò</FormLabel>
                                    <Select
                                        name="role"
                                        sx={{ height: '2.8125rem', borderRadius: '0.625rem', boxShadow: 'none' }}
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                    >
                                        <Option value="student">Sinh viên</Option>
                                        <Option value="academic">Phòng đào tạo  </Option>
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
                                        fontSize: '0.9375rem' 
                                            },
                                            color: '#606060' 
                                        }}
                                    />
                                    <Link level="title-sm" href="#replace-with-a-link" sx={{ fontSize: '0.9375rem' }}>
                                        Quên mật khẩu
                                    </Link>
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