// File: src/login_page/login_form.tsx
import { useState, FormEvent } from 'react';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
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
            alert('Please enter a valid email');
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
                    width: { xs: '100%', md: '50vw' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255 255 255 / 0.2)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: '100%',
                        px: 2
                    }}
                >
                    <Box
                        component="header"
                        sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                            <IconButton variant="soft" color="primary" size="sm">
                                <img
                                    src="https://www.uit.edu.vn/sites/vi/files/images/Logos/Logo_UIT_Web_Transparent.png"
                                    alt="University Logo"
                                    style={{ width: 50, height: 50, backgroundColor: 'transparent' }}
                                />
                            </IconButton>
                            <Typography level="title-lg">
                                VNU-HCM UNIVERSITY OF INFORMATION TECHNOLOGY
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
                            width: 400,
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
                            }
                        }}
                    >
                        <Stack sx={{ gap: 4, mb: 2 }}>
                            <Stack sx={{ gap: 1 }}>
                                <Typography component="h1" level="h3">
                                    Sign in
                                </Typography>
                            </Stack>
                        </Stack>
                        <Divider />
                        <Stack sx={{ gap: 4, mt: 2 }}>
                            <form onSubmit={handleFormSubmit}>
                                <FormControl required>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" name="email" />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
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
                                <FormControl required>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        name="role"
                                        value={selectedRole}
                                        onChange={handleRoleChange}
                                    >
                                        <Option value="student">Student</Option>
                                        <Option value="academic">Academic</Option>
                                        <Option value="admin">Admin</Option>
                                        <Option value="financial">Financial</Option>
                                    </Select>
                                </FormControl>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Checkbox size="sm" label="Remember me" name="persistent" />
                                    <Link level="title-sm" href="#replace-with-a-link">
                                        Forgot your password?
                                    </Link>
                                </Box>
                                <Button type="submit" fullWidth>
                                    Sign in
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
            <Box
                sx={{
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: '50vw' },
                    transition: 'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'url(https://media.giphy.com/media/Wl072QmzoQpWanW8Rw/giphy.gif?cid=790b7611evyupapsu53sdz4pmoggr1bz39fi0xtql1vk9z42&ep=v1_gifs_search&rid=giphy.gif&ct=g)'
                }}
            />
        </CssVarsProvider>
    );
}