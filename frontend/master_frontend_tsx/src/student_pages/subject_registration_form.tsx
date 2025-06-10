// File: src/student_pages/subject_registration_form.tsx
import { ThemeLayout } from '../styles/theme_layout';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { Subject } from "../types";
import Paper from '@mui/material/Paper';
import { useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import UserInfo from "../components/UserInfo";
import { getAvailableSubjects, enrollSubject } from "../api_clients/studentApi";

const SubjectRegistrationForm = ({ user, onLogout }: { user: { id?: string; name?: string } | null; onLogout: () => void }) => {
    const [open, setOpen] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !user.id) return;
        setLoading(true);
        setError(null);
        getAvailableSubjects(String(user.id))
            .then((data) => {
                setSubjects(data);
                setFilteredSubjects(data);
            })
            .catch((err) => setError(err.message || 'Lỗi khi tải danh sách môn học'))
            .finally(() => setLoading(false));
    }, [user]);

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleEnroll = async (subject: Subject) => {
        if (!user || !user.id) return;
        try {
            setLoading(true);
            setError(null);
            await enrollSubject(String(user.id), subject.id);
            setOpen(true);
            // Sau khi đăng ký thành công, loại bỏ môn khỏi danh sách
            setSubjects(prev => prev.filter(s => s.id !== subject.id));
            setFilteredSubjects(prev => prev.filter(s => s.id !== subject.id));
        } catch (err: any) {
            setError(err.message || 'Đăng ký môn học thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchText: string) => {
        const filtered = subjects.filter(subject =>
            subject.id.toLowerCase().includes(searchText.toLowerCase()) ||
            subject.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredSubjects(filtered);
    };

    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <UserInfo user={user} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '0.25rem' }}>
                <Paper
                    elevation={3}
                    sx={{
                        textAlign: 'left',
                        borderRadius: '1rem',
                        padding: '1.25rem',
                        fontSize: '1.125rem',
                        fontFamily: '"Varela Round", sans-serif',
                        fontWeight: 450,
                        backgroundColor: 'rgb(250, 250, 250)',
                        boxShadow: "0 0.125rem 0.3125rem rgba(0, 0, 0, 0.1)",
                        color: 'rgb(39, 89, 217)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        borderTopRightRadius: '1rem',
                        borderBottomRightRadius: '1rem',
                        flexGrow: 1,
                        minHeight: '25rem',
                        maxHeight: 'calc(100vh - 9.375rem)',
                        paddingLeft: '1rem', 
                        paddingRight: '1rem',
                        marginTop: '3.5rem', 
                        marginLeft: '0',
                        marginRight: '0.625rem',
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            fontStyle: "normal",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: '0.875rem',
                            marginTop: '0',
                            textAlign: "center",
                            fontSize: "1.875rem",
                        }}
                    >
                        Danh sách môn học
                    </Typography>
                    
                    <Box sx={{ marginBottom: '1rem' }}>
                        <CustomSearchBox
                            onSearch={handleSearch}
                            placeholder="Tìm kiếm theo mã môn học hoặc tên môn học"
                        />
                    </Box>

                    <SubjectsList
                        subjects={filteredSubjects}
                        onEnroll={handleEnroll}
                    />
                </Paper>
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                TransitionComponent={Slide}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >   
                <MuiAlert
                    onClose={handleClose}
                    severity="success"
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        backgroundColor: '#e8f5e9',
                        color: '#2e7d32',
                    }}
                >
                    Đăng ký thành công!
                </MuiAlert>
            </Snackbar>
        </ThemeLayout>
    );
};

export default SubjectRegistrationForm;

interface SearchBoxProps {
    onSearch?: (searchText: string) => void;
    placeholder?: string;
}

const CustomSearchBox = ({ onSearch, placeholder = "Search..." }: SearchBoxProps) => {
    const [searchText, setSearchText] = useState("");

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    const handleClick = () => {
        if (onSearch) {
            onSearch(searchText);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleClick();
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                width: "100%",
                backgroundColor: "#f5f5f5",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                padding: "0.25rem 0.75rem",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
                },
            }}
        >
            <TextField
                variant="standard"
                fullWidth
                placeholder={placeholder}
                value={searchText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#888" }} />
                        </InputAdornment>
                    ),
                    sx: {
                        fontSize: "1rem",
                        padding: "0.5rem 0",
                    },
                }}
            />
        </Box>
    );
};

const SubjectsList = ({ subjects, onEnroll }: { subjects: Subject[]; onEnroll: (subject: Subject) => void }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '0.75rem', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Table size="medium" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '12%' }}>Mã môn học</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '28%' }}>Môn học</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '22%' }}>Giảng viên</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', fontFamily: '"Varela Round", sans-serif', textAlign: 'left', backgroundColor: '#6ebab6', width: '20%' }}>Thời gian</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFFFFF', fontSize: '1.25rem', textAlign: 'left', fontFamily: '"Varela Round", sans-serif', backgroundColor: '#6ebab6', width: '18%' }}>Hành động</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {subjects.map((subject, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                },
                                '&:last-child td, &:last-child th': { borderBottom: 'none' }
                            }}
                        >
                            <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.id}</TableCell>
                            <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.name}</TableCell>
                            <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subject.lecturer}</TableCell>
                            <TableCell sx={{ fontSize: '1rem', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{`${subject.day}, ${subject.fromTo}`}</TableCell>
                            <TableCell sx={{ textAlign: 'left', fontFamily: '"Varela Round", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => onEnroll(subject)}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '0.5rem',
                                        boxShadow: 'none',
                                        backgroundColor: '#1976d2',
                                        '&:hover': {
                                            backgroundColor: 'hsl(223, 100.00%, 70.20%)',
                                        },
                                    }}
                                >
                                    Đăng ký
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

