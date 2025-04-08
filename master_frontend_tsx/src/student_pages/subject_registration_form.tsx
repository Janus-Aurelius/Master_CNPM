// File: src/student_pages/subject_registration_form.tsx
import { ThemeLayout } from '../styles/theme_layout';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { Subject } from "../types";
import Paper from '@mui/material/Paper';
import { useState, ChangeEvent, KeyboardEvent } from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const sampleSubjects: Subject[] = [
    { id: 'IT001', name: 'Nhập môn lập trình', lecturer: 'TS. Nguyễn Văn A', day: 'Thứ 2', session: '1', fromTo: 'Tiết 1-4' },
    { id: 'IT002', name: 'Lập trình hướng đối tượng', lecturer: 'PGS. TS. Trần Thị B', day: 'Thứ 3', session: '2', fromTo: 'Tiết 6-9' },
    { id: 'IT003', name: 'Cấu trúc dữ liệu và giải thuật', lecturer: 'TS. Lê Văn C', day: 'Thứ 4', session: '3', fromTo: 'Tiết 2-5' },
    { id: 'SE001', name: 'Nhập môn công nghệ phần mềm', lecturer: 'TS. Phạm Thị D', day: 'Thứ 5', session: '4', fromTo: 'Tiết 7-10' },
];

interface SubjectRegistrationFormProps {
    onLogout: () => void;
}

export const SubjectRegistrationForm = ({ onLogout }: SubjectRegistrationFormProps) => {
    const [open, setOpen] = useState(false);

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleEnroll = (subject: Subject) => {
        console.log('Enrolling in', subject);
        setOpen(true);
    };

    const handleSearch = (searchText: string) => {
        console.log('Searching for:', searchText);
    };

    return (
        <ThemeLayout role="student" onLogout={onLogout}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        textAlign: 'left',
                        borderRadius: '16px',
                        padding: '20px',
                        fontSize: '18px',
                        fontFamily: '"Varela Round", sans-serif',
                        fontWeight: 450,
                        backgroundColor: 'rgb(250, 250, 250)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
                        color: 'rgb(39, 89, 217)',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden',
                        marginTop: '16px',
                        flexGrow: 1,
                        minHeight: '400px',
                        maxHeight: 'calc(100vh - 150px)',
                        paddingLeft: '16px', 
                        paddingRight: '16px', 
                        marginLeft: '-17px',
                        marginRight: '10px',
                    }}
                >
                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: "bold",
                            fontFamily: "Montserrat, sans-serif",
                            fontStyle: "normal",
                            color: "rgba(33, 33, 33, 0.8)",
                            marginBottom: '14px',
                            marginTop: '0px',
                            textAlign: "center",
                            fontSize: "30px",
                        }}
                    >
                        Danh sách môn học
                    </Typography>
                    
                    <Box sx={{ marginBottom: '16px' }}>
                        <CustomSearchBox
                            onSearch={handleSearch}
                            placeholder="Tìm kiếm mã môn học..."
            />
        </Box>

        <SubjectsList
            subjects={sampleSubjects}
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

interface SearchBoxProps {
    onSearch?: (searchText: string) => void;
    placeholder?: string;
}

const CustomSearchBox = ({ onSearch, placeholder = "Search..." }: SearchBoxProps) => {
    const [searchText, setSearchText] = useState("");

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
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
                gap: "8px",
                width: "100%",
                backgroundColor: "#f5f5f5",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                padding: "4px 12px",
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
                        fontSize: "16px",
                        padding: "8px 0",
                    },
                }}
            />
        </Box>
    );
};

const SubjectsList = ({ subjects, onEnroll }: { subjects: Subject[]; onEnroll: (subject: Subject) => void }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Mã lớp</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Môn học</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Giảng viên</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px', fontFamily: '"Varela Round", sans-serif', textAlign: 'center', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Thời gian</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#FFF1DB', fontSize: '20px' , textAlign: 'center', fontFamily: '"Varela Round", sans-serif', borderRight: '0.5px solid rgb(237, 237, 237)', backgroundColor: '#536493' }}>Hành động</TableCell>
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
                            }}
                        >
                            <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif', borderRight: '0.5px solid rgb(237, 237, 237)' }}>{subject.id}</TableCell>
                            <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif',  borderRight: '0.5px solid rgb(237, 237, 237)' }}>{subject.name}</TableCell>
                            <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif',  borderRight: '0.5px solid rgb(237, 237, 237)' }}>{subject.lecturer}</TableCell>
                            <TableCell sx={{ fontSize: '16px', fontFamily: '"Varela Round", sans-serif',  borderRight: '0.5px solid rgb(237, 237, 237)' }}>{`${subject.day}, ${subject.fromTo}`}</TableCell>
                            <TableCell sx={{ textAlign: 'center', fontFamily: '"Varela Round", sans-serif', borderRight: '0.5px solid rgb(237, 237, 237)' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    onClick={() => onEnroll(subject)}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        backgroundColor: '#3869d9',
                                        '&:hover': {
                                            backgroundColor: 'rgb(103, 146, 255)',
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

